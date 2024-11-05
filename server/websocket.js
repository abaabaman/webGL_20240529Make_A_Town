const ws = require('nodejs-websocket')
const axios = require('axios')

const BASE_URL = `http://localhost/interface`;
const PORT = 5555;
const usersName = ["刘德华", "张学友", "黎明", "郭富城"];
let list = [];
let ready = false;
let users = [];
axios({
    url: `${BASE_URL}/play_card_get.php`,
    method: "get",
})
    .then((e) => list = e);

const everyoneSend = (msg = '') => {
    console.log(msg);
    server.connections.forEach(item => {
        item.send(msg);
    })
};

const appellation = (conn) => usersName[conn?.userId] || '观众';
const userCount = () => {
    if ([0, 1, 2, 3].map(e => e + '').every(e => users.includes(e))) {
        if (!ready) {
            everyoneSend("lifecycle=ready");
            console.log('四大天王到齐了');
            ready = true;
        }
    } else {
        if (ready) {
            if (users.filter(e => [0, 1, 2, 3].map(e => e + '').includes(e)).length > 2) {
                everyoneSend("lifecycle=resume");
            } else {
                everyoneSend("lifecycle=over");
                ready = false;
            }
        }
    }
}
const userClose = (conn) => {
    if (![0, 1, 2, 3].map(e => e + '').includes(conn?.userId)) return;
    everyoneSend(`msg=${appellation(conn)}失去连接`);
    users = users.filter(e => e !== conn?.userId);
    userCount();
}
const server = ws.createServer(conn => {
    console.log('----------new user connect---------');
    conn.send('users=' + users);
    conn.on('text', (e) => {
        const res = Object.fromEntries(e.split('&').map(e => e.split('=')));
        console.log(res)
        if (res.user) {
            conn.userId = res.user;
            everyoneSend(`msg=${appellation(conn)}进入对决!`)

            users.push(res.user);
            userCount()
        };
        if (res.lifecycle === 'close') {
            userClose(conn)
        }
    })
    conn.on('close', (e) => {
        userClose(conn)
    })
    conn.on('error', (e) => {
        console.log('链接断开')
    })
    // conn.send('users.length=' + users.length);
})



server.listen(PORT, () => {
    console.log('server start success,listen:' + PORT);
})