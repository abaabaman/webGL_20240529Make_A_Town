const ws = require('nodejs-websocket')
const axios = require('axios')
const BASE_URL = `http://localhost/interface`;
const PORT = 5555;

const SUM_ROUNDS = 3;  // 总回合数
const CARD_NUM = 5;  // 手牌数量
const MIN_USER_NUM = 2;  // 最小游戏人数

let list_black = [];  // 黑卡
let list_white = [];  // 白卡
let list_userOrWrite = {};  // 当前回合用户和手牌
let round = 0;  // 当前回合
let ready = false;  // 是否进行游戏中
let chooseNum = 0; // 当前回合完成选择的人数
const userList = () => Object.keys(list_userOrWrite);
const userScore = () => Object.keys(list_userOrWrite).map(e => ({ name: e, score: list_userOrWrite[e].score, isReady: list_userOrWrite[e].isReady }))

const send = (data, config) => {
    server.connections.forEach(item => {
        console.log(item.userName, '发牌');
        if (config === 'sendCard') data = { ...data, cards: list_userOrWrite[item.userName].cards }
        item.send(JSON.stringify(data));
    })
}

const startGame = () => {
    ready = true;
    axios({
        url: `${BASE_URL}/play_card_get.php`,
        method: "get",
    })
        .then(({ data }) => {
            // 洗牌
            const initRoundWhiteNum = CARD_NUM * userList().length
            const question = data.filter(e => e.type === 'question').sort(() => 0.5 - Math.random());
            const answer = data.filter(e => e.type === 'answer').sort(() => 0.5 - Math.random());
            list_black = question.slice(0, SUM_ROUNDS).map(e => ({ ...e, white: {}, score: {}, space: e.text.split('_').length - 1 }));
            list_white = answer.slice(initRoundWhiteNum)
            const init_list_white = answer.slice(0, initRoundWhiteNum);

            // 发牌
            userList().forEach((e, i) => {
                list_userOrWrite[e] = {
                    cards: init_list_white.filter((_, j) => j % userList().length === i),
                    score: 0,
                    isReady: false,
                };
            });
        });
}

const server = ws.createServer(conn => {
    conn.on('text', (e) => {
        // TODO: 准备好：新用户加入模块

        const res = JSON.parse(e);
        console.log('—————————————————————');
        console.log(res);

        // 开始游戏
        switch (res.action) {
            case 'sign': {
                // 新用户加入
                const { name } = res;
                if (Object.keys(list_userOrWrite).includes(name)) {
                    send({ action: "sign", isSign: false })
                } else {
                    if (!conn.userName) conn.userName = name;
                    list_userOrWrite[name] = {};
                    send({ action: "sign", isSign: true, userList: userScore() })

                    if (Object.keys(list_userOrWrite).length < MIN_USER_NUM) return;  // 2人登录直接开始 
                    if (ready) return; // 已开始游戏,不再次发牌

                    startGame();
                    setTimeout(() => {
                        console.log(list_userOrWrite);
                        const data = {
                            action: "start",
                            round,
                            black: list_black[round],
                            userList: userScore(),
                        }
                        send(data, 'sendCard');
                    }, 100);
                }
                break;
            }
            case 'done': {
                // 出牌
                const { name, cards } = res;
                list_black[round].white[name] = cards;

                // 补充手牌
                let nowCard = list_userOrWrite[name].cards;
                nowCard = nowCard.filter(e => !cards.map(e => e.id).includes(e.id));
                nowCard = nowCard.concat(list_white.slice(0, cards.length));
                list_white = list_white.slice(cards.length);
                list_userOrWrite[name].cards = nowCard;

                list_userOrWrite[name].isReady = true;
                send({ action: "done", round, userList: userScore() });

                if (Object.keys(list_black[round].white).length !== userList().length) return;  // 出牌未结束，不投票
                // TODO：倒计时结束，也开始投票
                send({ action: "vote", round, black: list_black[round] });

                break;
            };
            case 'vote': {
                // 投票
                const { name, choose } = res;
                const score = list_black[round].score;
                if (choose) score[choose] = score[choose] ? score[choose] + 1 : 1;
                chooseNum++;
                if (chooseNum !== userList().length) return;
                console.log('所有人完成选择');

                // 计算得分
                Object.keys(score).sort()
                const sort = Object.keys(score).sort((a, b) => (score[b] - score[a]));
                const winner = sort.filter(user => score[user] === score[sort[0]]);
                winner.forEach(user => {
                    list_userOrWrite[user].score += 1;
                })

                // 进入下一回合
                round++;
                chooseNum = 0;
                const data = {
                    action: "next",
                    round,
                    isEnd: round + 1 >= SUM_ROUNDS,
                    winner,
                    black: list_black[round],
                    userList: userScore(),
                }
                send(data, 'sendCard')
                break;
            }
        }


    })
    // conn.on('close', (e) => {
    //     userClose(conn)
    // })
    conn.on('error', (e) => {
        console.log(conn.userName + '链接断开')
        delete list_userOrWrite[conn.userName];
        // userList.splice(Object.keys(userList).indexOf(conn.userName), 1);
        send({ action: "leave", leaveOne: conn.userName });
    })
})



server.listen(PORT, () => {
    console.log('server start success,listen:' + PORT);
})