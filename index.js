const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');

const PREFIX = '.';

console.log('🚀 Rida Massager Bot Starting...');

async function startBot() {
    const { state } = await useMultiFileAuthState('auth');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
    });

    sock.ev.on('connection.update', (update) => {
        if (update.qr) qrcode.generate(update.qr, { small: true });
        if (update.connection === 'open') {
            console.log('✅ Rida Massager Bot is Online!');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const text = (msg.message.conversation || '').trim();
        const from = msg.key.remoteJid;

        // Normal Chat (no prefix)
        if (!text.startsWith(PREFIX)) {
            const lower = text.toLowerCase();

            if (lower.includes('hi') || lower.includes('hello') || lower.includes('hlw')) {
                await sock.sendMessage(from, { text: 'Hey baby 😘 Rida এসে গেছে... কেমন আছো আজ?' });
            } else if (lower.includes('baby') || lower.includes('bby') || lower.includes('bbz')) {
                await sock.sendMessage(from, { text: 'Yes my baby 😏 কি করবো তোমার জন্য আজ? বলো...' });
            } else {
                // Default reply for other messages
                await sock.sendMessage(from, { text: 'Hmm... বলো কি চাও? Rida তোমার সাথে আছে 🔥' });
            }
            return;
        }

        // Prefix Commands
        const command = text.slice(PREFIX.length).trim().toLowerCase();

        if (command === 'horny') {
            await sock.sendMessage(from, { text: 'Horny mode on 😈 কি করতে চাও?' });
        } else if (command === 'help') {
            await sock.sendMessage(from, { text: 'Type anything or use .horny' });
        }
    });
}

startBot();
