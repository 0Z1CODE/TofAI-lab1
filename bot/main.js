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
  roductCaption,
  cartWithoutContanct,
  sendPhoneBtn
} from "./components/const.js";
import User from "../db/models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
import connectToMongoDb from "../db/connectToMongoDB.js";
import fData from "./api/f_api.json" with { type: "json" }; // Import the data from the JSON file
import { getUserData } from "../db/controllers/user.controller.js";
import { initUserContacts, setPhone } from "../db/controllers/conacts.controller.js";
import { set } from "mongoose";

const token = "8155056127:AAHtBoUfLmZjbDJCS_n30C7bO34liez87Os"; // Your bot token

const bot = new TelegramBot(token, { polling: true }); // Create a new bot instance
let set_contacts = false;


const start = async () => {
  await connectToMongoDb(); // Connect to the MongoDB database
  bot.setMyCommands([
    { command: "/start", description: "Старт" },
    { command: "/info", description: "Інформація" },
  ]); // Set the bot commands

  const commandsAnswer = async (command, params) => {
    const { id, first_name } = params; // Get the chat id
    
    switch (command) {
      case "/start":
        await bot.sendSticker(
          id,
          "https://media.stickerswiki.app/dexeincognito/6508259.512.webp"
        ); // Send a sticker
        await bot.sendMessage(id, welcomMessage(first_name), {
          parse_mode: "HTML",
        }); // Send a message
        await bot.sendMessage(id, selectPoint(), menuBtns); // Send a message with the menu
        break;

      case "/info":
        await bot.sendMessage(id, "Тут якась інформація про бота", infoBtns);
        break;

      case "Відправити email": 
        await bot.sendMessage(id, "Введіть ваш email");

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
        await bot.sendMessage(id, categoryMessage("Девайси"), devicesMenu);
        break;
    }
  };

  bot.on("message", async (msg) => {
    const {from, contact, location} = msg;
    const user = await getUserData(from); // Get the user from the chat
    const text = msg.text; // Get the message from the chat
    const { id, first_name } = msg.chat; // Get the chat id
    commandsAnswer(text, { id, first_name }); // Get the answer for the command

    if (contact) {
      const {phone_number} = contact;
      console.log(phone_number);
      
      setPhone({id: user._id , phone: phone_number});
      bot.sendMessage(id, `Дякуємо, ткпер введіть ваше прізвище та імя: "Залужний Валерій"`);
    }

    if (text && /^([A-Za-zА-Яа-я]+)\s([A-Za-zА-Яа-я]+)$/.test(text)) {
      const [_, firstName, lastName] = text.match(/^([A-Za-zА-Яа-я]+)\s([A-Za-zА-Яа-я]+)$/);
      bot.sendMessage(id, `Дякуємо, ${firstName} ${lastName}, ваші дані збережено.`);      
    }



    

  }); // Listen for messages

  // Callback query handler
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const {id} = query.from
    const data = query.data;
    const user = await User.findOne({ telegram_id: id });

    switch (data) {
     case "send_photo": 
        bot.sendPhoto(chatId, "https://content2.rozetka.com.ua/goods/images/base_action/439965030.jpg",);
        break;


      case "for_study_cat":
        fData?.study?.map(async (item, id) => {
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
          set_contacts = true;
          initUserContacts({id: user._id});
          bot.sendMessage(chatId, cartWithoutContanct(sp), {
            parse_mode: "HTML",
            reply_markup: sendPhoneBtn,
          });
        }
        break;
      

      default:
        bot.sendMessage(chatId, "Команду не знайдено(");
    }
  });
};

start(); // Call the start function
