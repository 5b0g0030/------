const express = require('express');  // 引入 Express 框架
const http = require('http');  // 引入 HTTP 模組
const socketIo = require('socket.io');  // 引入 Socket.IO 模組

const app = express();  // 建立一個 Express 應用程式實例
const server = http.createServer(app);  // 建立一個 HTTP 伺服器
const io = socketIo(server);  // 使用 Socket.IO 包裝 HTTP 伺服器

app.use(express.static('public'));  // 設定 Express 伺服器靜態資源的目錄為 'public'

let votes = {  // 定義一個物件來儲存所有問題的投票數
    question1: { optionA: 0, optionB: 0, optionC: 0 },
    question2: { optionA: 0, optionB: 0, optionC: 0 },
    question3: { optionA: 0, optionB: 0, optionC: 0 },
    question4: { optionA: 0, optionB: 0, optionC: 0 },
    question5: { optionA: 0, optionB: 0, optionC: 0 },
    question6: { optionA: 0, optionB: 0, optionC: 0 },
    question7: { optionA: 0, optionB: 0, optionC: 0, optionD: 0 },
    question8: { optionA: 0, optionB: 0, optionC: 0 },
};

let users = {}; // 定義一個物件來儲存使用者名稱與 Socket 連接的映射

io.on('connection', (socket) => {  // 當有用戶連接時觸發此事件
    console.log('A user connected');  // 在控制台打印訊息

    socket.on('login', (data) => {  // 當用戶登錄時觸發此事件
        const username = data.username;  // 獲取用戶名稱
        if (username) {  // 如果用戶名稱有效
            users[socket.id] = username;  // 將用戶名稱與 Socket 連接對應
            console.log(`User ${username} logged in`);  // 在控制台打印訊息
            socket.emit('updateVotes', votes);  // 向當前用戶發送目前的投票數據
        }
    });

    socket.on('vote', (data) => {  // 當用戶投票時觸發此事件
        if (votes[data.question] && votes[data.question][data.option] !== undefined) {  // 檢查投票的問題和選項是否有效
            votes[data.question][data.option]++;  // 增加該選項的票數
            io.emit('updateVotes', votes);  // 向所有連接的用戶發送更新後的投票數據
        }
    });

    socket.on('disconnect', () => {  // 當用戶斷開連接時觸發此事件
        const username = users[socket.id];  // 獲取斷開連接的用戶名稱
        if (username) {  // 如果用戶名稱存在
            console.log(`User ${username} disconnected`);  // 在控制台打印訊息
            delete users[socket.id];  // 刪除用戶名稱與 Socket 連接的映射
        }
    });
});

const PORT = process.env.PORT || 3000;  // 定義伺服器監聽的端口
server.listen(PORT, () => {  // 啟動伺服器並監聽指定的端口
    console.log(`Server running on port ${PORT}`);  // 在控制台打印訊息
});
