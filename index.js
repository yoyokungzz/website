const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// เสิร์ฟไฟล์ HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// เสิร์ฟไฟล์ภาพจากโฟลเดอร์ image
app.use('/image', express.static(path.join(__dirname, 'image')));

// เสิร์ฟไฟล์ไอคอนจากโฟลเดอร์ icon
app.use('/icon', express.static(path.join(__dirname, 'icon')));

// เสิร์ฟไฟล์เสียงจากโฟลเดอร์ sounds
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));

// API เพื่อดึงรายการไอคอนจากโฟลเดอร์
app.get('/api/icons', (req, res) => {
    fs.readdir(path.join(__dirname, 'icon'), (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan icons');
        }
        res.json(files);
    });
});

io.on('connection', (socket) => {
    console.log('a user connected');

    // จัดการเหตุการณ์ 'ping' เมื่อมีผู้ใช้ส่ง Ping
    socket.on('ping', (data) => {
        io.emit('ping', data);
    });

    // จัดการเหตุการณ์ 'draw_line' เมื่อมีผู้ใช้ลากเส้น
    socket.on('draw_line', (data) => {
        io.emit('draw_line', data);
    });

    // จัดการเหตุการณ์ 'place_icon' เมื่อมีผู้ใช้วางไอคอนบนมินิแมพ
    socket.on('place_icon', (data) => {
        io.emit('place_icon', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
