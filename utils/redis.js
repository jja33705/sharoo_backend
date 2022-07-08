const redis = require('redis');

const client = redis.createClient({
    socket: {
        host: 'redis-server',
        port: 6379,
    },
});

client.connect()
.then(() => {
    console.log('redis 연결 성공');
})
.catch((err) => {
    console.log('redis 연결 실패', err);
});

module.exports = client;