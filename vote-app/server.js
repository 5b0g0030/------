const express = require('express'); // 引入 express 模組
const http = require('http'); // 引入 http 模組
const socketIo = require('socket.io'); // 引入 socket.io 模組

// 設置 Express 應用
const app = express(); // 建立一個 Express 應用實例
const server = http.createServer(app); // 用 Express 應用建立 HTTP 伺服器
const io = socketIo(server); // 將伺服器與 socket.io 綁定

// 設置靜態文件夾
app.use(express.static('public')); // 設定 Express 使用 'public' 資料夾中的靜態文件

// 存儲投票結果
let votes = { // 初始化一個投票結果的物件
    question1: { optionA: 0, optionB: 0, optionC: 0 },
    question2: { optionA: 0, optionB: 0, optionC: 0 },
    question3: { optionA: 0, optionB: 0, optionC: 0 },
    question4: { optionA: 0, optionB: 0, optionC: 0 },
    question5: { optionA: 0, optionB: 0, optionC: 0 },
    question6: { optionA: 0, optionB: 0, optionC: 0 },
    question7: { optionA: 0, optionB: 0, optionC: 0, optionD: 0 },
    question8: { optionA: 0, optionB: 0, optionC: 0 },
    question9: { optionA: 0, optionB: 0, optionC: 0 },
    question10: { optionA: 0, optionB: 0, optionC: 0, optionD: 0, optionE: 0, optionF: 0, optionG: 0 }
};

// 當有客戶端連接時
io.on('connection', (socket) => { // 監聽客戶端的連接事件
    console.log('A user connected'); // 當有用戶連接時，在控制台輸出訊息

    // 初始化玩家位置
    socket.emit('updateVotes', votes); // 向新連接的客戶端發送當前投票結果

    // 當接收到投票時，更新投票結果並廣播
    socket.on('vote', (data) => { // 監聽投票事件
        if (votes[data.question] && votes[data.question][data.option] !== undefined) { // 檢查投票的問題和選項是否有效
            votes[data.question][data.option]++; // 更新投票結果
            io.emit('updateVotes', votes); // 廣播更新的投票結果給所有客戶端
        }
    });

    // 當玩家斷開連接時
    socket.on('disconnect', () => { // 監聽客戶端的斷開連接事件
        console.log('User disconnected'); // 當用戶斷開連接時，在控制台輸出訊息
    });
});

// 設置伺服器監聽端口
const PORT = process.env.PORT || 3000; // 設定伺服器的端口號，使用環境變數中的 PORT 或預設為 3000
server.listen(PORT, () => { // 開始監聽指定端口
    console.log(`Server running on port ${PORT}`); // 在控制台輸出伺服器運行的端口號
});
