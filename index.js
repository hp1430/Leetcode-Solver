const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

bot.on("message", async(msg) => {
    const chatId = msg.chat.id;
    const message = msg.text.split(',');

    if (!msg.text || !msg.text.includes(',')) {
        bot.sendMessage(chatId, "Please provide input in the format: `<Leetcode_Question_Number>,<Language>`");
        return;
    }

    const prompt = `Give me code for leetcode question number ${message[0]} in ${message[1]} language.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(response);

    bot.sendMessage(chatId, text);
})