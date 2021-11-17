const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '2102393348:AAF1hy0DVQwxOsMURyf8PM7WlSuBrECkhs0'


const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId)=>{
    await bot.sendMessage(chatId, 'Угадай  цифру от 0 до 9')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай', gameOptions)
}

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: ' Приветствие'},
        {command: '/info', description: 'Информфция о пользователе'},
        {command: '/game', description: 'Угадай цифру'},
    ])


    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/thumb128.webp')
            return bot.sendMessage(chatId, `Hello !`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
                 return startGame(chatId)
        }
        return bot.sendMessage(chatId, "Я не понимаю, попробуй ешще рраз")
    })
    bot.on('callback_query', async msg=> {
        const data = msg.data
        const chatId = msg.message.chat.id;
        if(data=== '/again'){
           return startGame(chatId)
        }

        if (data === chats[chatId]) {
                 return  bot.sendMessage(chatId,`Поздравля , ты угадал цифру ${chats[chatId]}`,againOptions)
        }else {
            return  bot.sendMessage(chatId,`Не угадал цифру,  бот загадал - ${chats[chatId]}`,againOptions)
        }
    })
}

start()