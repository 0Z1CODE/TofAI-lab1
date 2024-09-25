import TelegramBot from "node-telegram-bot-api"; // import the TelegramBot class
import {
  welcomMessage,
  menuBtns,
  infoBtns,
  plugAndPlayMenu,
  itemMenu,
  categoryMessage,
  accessoriesMenu,
  selectPoint,
  devicesMenu,
  cartBtn,
  roductCaption, 
  getContactBtn

} from "./components/const.js";
import fData from "./api/f_api.json" with { type: "json" }; // Import the data from the JSON file

const token = "8155056127:AAHtBoUfLmZjbDJCS_n30C7bO34liez87Os"; // Your bot token

const bot = new TelegramBot(token, { polling: true }); // Create a new bot instance

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Старт" },
    { command: "/info", description: "Інформація" },
  ]); // Set the bot commands

  const commandsAnswer = async (command, params) => {
    const { id, username } = params; // Get the chat id
    switch (command) {
      case "/start":
        await bot.sendSticker(
          id,
          "https://media.stickerswiki.app/dexeincognito/6508259.512.webp"
        ); // Send a sticker
        await bot.sendMessage(id, welcomMessage(username), {
          parse_mode: "HTML",
        }); // Send a message
        await bot.sendMessage(id, selectPoint(), menuBtns); 
        break;

      case "/info":
        await bot.sendMessage(id, "Тут якась інформація про бота", infoBtns);
        break;

      case "Готові пк":
        await bot.sendMessage(
          id,
          categoryMessage("Готові пк"),
          plugAndPlayMenu
        );
        break;
      case "Комплектуючі":
        await bot.sendMessage(
          id,
          categoryMessage("Комплектуючі"),
          accessoriesMenu
        );
        break;
        case "Девайси":
        await bot.sendMessage(
          id,
          categoryMessage("Девайси"),
          devicesMenu
        );
        break;

      default:
        bot.sendMessage(id, "Команду не знайдено("); 
    }
  };

  bot.on("message", async (msg) => {
    const text = msg.text; // Get the message from the chat
    const { id, username } = msg.chat; // Get the chat id
    commandsAnswer(text, { id, username }); // Get the answer for the command
  }); // Listen for messages

  // Callback query handler
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    switch (data) {
      case "send_photo":
        await bot.sendPhoto(chatId, "./assets/img/info.png"); // Send a photo
        break;

      case "for_study_cat":
        fData?.study?.map(async (item, id) => {
          console.log(data);// Log the data
          setTimeout(() => {
            bot.sendPhoto(chatId, item.images[0], {
              caption: roductCaption(item),
              parse_mode: "HTML",
              reply_markup: itemMenu,
            });
          }, 1000 * id);
        });
        break;

      case "to_cart":
        {
          const caption = query.message.caption;
          const sp = caption?.split("\n")[0];
          bot.sendMessage(
            chatId,
           cartBtn(sp),
            { parse_mode: "HTML", reply_markup: getContactBtn }
  
          );
        }
        break;
        case "send_contact": 
        bot.sendMessage(chatId, "Дякуємо за контакт");
        break;

      default:
        bot.sendMessage(chatId, "Команду не знайдено(");
    }
  });
};

start(); // Call the start function
