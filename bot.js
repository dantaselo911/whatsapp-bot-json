const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('📱 ESCANEIE ESTE QR CODE NO WHATSAPP');
});

client.on('ready', () => {
    console.log('✅ BOT ESTÁ ONLINE! Pode usar no WhatsApp :)');
});

function formatarJSONBonito(data) {
    if (Array.isArray(data)) {
        let resultado = "📋 *Lista de Itens*\n\n";
        data.forEach((item, index) => {
            resultado += `🔹 *Item ${index + 1}*\n`;
            for (let chave in item) {
                resultado += `   *${chave}:* ${item[chave]}\n`;
            }
            resultado += "\n";
        });
        return resultado;
    } else if (typeof data === 'object') {
        let resultado = "📄 *Dados do Objeto*\n\n";
        for (let chave in data) {
            resultado += `🔹 *${chave}:* ${data[chave]}\n`;
        }
        return resultado;
    } else {
        return "❌ Formato não suportado. Envie um JSON de array ou objeto.";
    }
}

client.on('message', async (msg) => {
    const chat = await msg.getChat();

    if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        if (media.mimetype === 'application/json') {
            try {
                const conteudo = Buffer.from(media.data, 'base64').toString('utf-8');
                const dados = JSON.parse(conteudo);
                const respostaBonita = formatarJSONBonito(dados);
                chat.sendMessage(respostaBonita);
            } catch (error) {
                chat.sendMessage("❌ Erro ao ler o JSON. Verifique se o arquivo é válido.");
            }
        } else {
            chat.sendMessage("⚠️ Por favor, envie apenas arquivos .json");
        }
    }

    if (msg.body.toLowerCase().includes('!enviarjson')) {
        chat.sendMessage("📤 Por favor, envie um arquivo .json. Vou formatá-lo bonitinho pra você! 😊");
    }
});

client.initialize();