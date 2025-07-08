const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Pastikan folder ada
if (!fs.existsSync('./session')) fs.mkdirSync('./session');
if (!fs.existsSync('./public')) fs.mkdirSync('./public');

// WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './session' }),
    puppeteer: { headless: true, args: ['--no-sandbox'] }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    QRCode.toFile('./public/qr.png', qr, () => {
        console.log('🔑 QR Code saved as /public/qr.png');
    });
});

client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready!');
});

client.on('message', msg => {
    if (msg.body === '!ping') msg.reply('pong');
});

client.initialize();

// Routes
app.get('/', (req, res) => res.redirect('/qr.html'));

app.get('/uptime', (req, res) => {
    res.json({
        status: 'online',
        time: new Date().toISOString()
    });
});

// 🔥 Endpoint buat kirim OTP dari PHP
app.post('/send-otp', async (req, res) => {
    const { phone, message } = req.body;
    if (!phone || !message) {
        return res.status(400).json({ status: false, message: 'Phone dan message wajib diisi' });
    }

    try {
        const chatId = phone.replace(/^0/, '62') + '@c.us';
        await client.sendMessage(chatId, message);
        return res.json({ status: true, message: 'OTP berhasil dikirim ke WhatsApp' });
    } catch (err) {
        console.error('❌ Error:', err);
        return res.status(500).json({ status: false, message: 'Gagal mengirim pesan' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));