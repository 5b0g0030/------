const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let votes = {
    question1: { optionA: 0, optionB: 0, optionC: 0 },
    question2: { optionA: 0, optionB: 0, optionC: 0 },
    question3: { optionA: 0, optionB: 0, optionC: 0 },
    question4: { optionA: 0, optionB: 0, optionC: 0 },
    question5: { optionA: 0, optionB: 0, optionC: 0 },
    question6: { optionA: 0, optionB: 0, optionC: 0 },
    question7: { optionA: 0, optionB: 0, optionC: 0, optionD: 0 },
    question8: { optionA: 0, optionB: 0, optionC: 0 },
};

let users = {}; // 用來儲存使用者名稱與 Socket 連接的映射

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('login', (data) => {
        const username = data.username;
        if (username) {
            users[socket.id] = username;
            console.log(`User ${username} logged in`);
            socket.emit('updateVotes', votes);
        }
    });

    socket.on('vote', (data) => {
        if (votes[data.question] && votes[data.question][data.option] !== undefined) {
            votes[data.question][data.option]++;
            io.emit('updateVotes', votes);
        }
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        if (username) {
            console.log(`User ${username} disconnected`);
            delete users[socket.id];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
