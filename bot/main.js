import TelegramBot from "node-telegram-bot-api"; // import the TelegramBot class
import axios from "axios";
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
  sendPhoneBtn,
  set_order,
  sendLocation,
} from "./components/const.js";
import User from "../db/models/user.model.js";
import dotenv from "dotenv";
import connectToMongoDb from "../db/connectToMongoDB.js";
import { getUserData } from "../db/controllers/user.controller.js";
import { initNewOrder } from "../db/controllers/order.controller.js";
import fData from "./api/f_api.json" with { type: "json" }; // Import the data from the JSON file

import {
  initUserContacts,
  setPhone,
  setNames,
  setAddress,
} from "../db/controllers/conacts.controller.js";
dotenv.config();

const token = process.env.BOT_TOKEN; // Your bot token from environment variables
const bot = new TelegramBot(token, { polling: true }); // Create a new bot instance
let set_contacts = false;
let tmp_orderId = null;

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
        await bot.sendMessage(id, categoryMessage("Девайси"), devicesMenu);
        break;
    }
  };

  bot.on("message", async (msg) => {
    const { from, contact, location } = msg;
    const user = await getUserData(from); // Get the user from the chat
    const text = msg.text; // Get the message from the chat
    const { id, first_name } = msg.chat; // Get the chat id
    commandsAnswer(text, { id, first_name }); // Get the answer for the command

    if (contact) {
      const { phone_number } = contact;
      await setPhone({ id: user._id, phone: phone_number });
      await bot.sendMessage(id, `Дякуємо, тепер введіть ваші ім'я та прізвище`);
    }

    if (text && /^([A-Za-zА-Яа-я]+)\s([A-Za-zА-Яа-я]+)$/.test(text)) {
      const [_, firstName, lastName] = text.match(
        /^([A-Za-zА-Яа-я]+)\s([A-Za-zА-Яа-я]+)$/
      );
      await setNames({
        id: user._id,
        first_name: firstName,
        last_name: lastName,
      });
      await bot.sendMessage(
        id,
        `Дякуємо, ${firstName} ${lastName}, ваші дані збережено.`
      );
      await bot.sendMessage(id, `Поділіться своєю адресою`, {
        reply_markup: sendLocation,
      });
    }

    if (location) {
      const { latitude, longitude } = location;
      const geocoder = await axios.get(
        `${process.env.Geocoder}lat=${latitude}&lon=${longitude}&format=json`
      );
      await setAddress({
        id: user._id,
        addressInfo: geocoder.data.address,
        location: location,
        address: geocoder.data.display_name,
      });
      await bot.sendMessage(
        id,
        `Дякуємо, ваша адреса збережена: ${geocoder.data.display_name}`,
        { reply_markup: set_order }
      );
    }
  }); // Listen for messages

  // Callback query handler

  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const { id } = query.from;
    const data = query.data;
    const user = await User.findOne({ telegram_id: id });

    switch (data) {
      case "send_photo":
        bot.sendPhoto(
          chatId,
          "https://content2.rozetka.com.ua/goods/images/base_action/439965030.jpg"
        );
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
          // console.log(query);

          tmp_orderId = sp;
          set_contacts = true;
          initUserContacts({ id: user._id });
         await bot.sendMessage(chatId, cartWithoutContanct(sp), {
            parse_mode: "HTML",
            reply_markup: sendPhoneBtn,
          });
        }
        break;

      case "set_order": {
        const userContacts = await initUserContacts({ id: user._id });
        await initNewOrder({
          user_id: user._id,
          product_id: tmp_orderId,
          contacts: userContacts,
          status: "pending",
          quantity: 1,
        });
        
        await bot.sendMessage(chatId, `Шановний ${userContacts.first_name}, ваше замовлення на товар ${tmp_orderId} успішно оформлено.\n `, {
          parse_mode: "HTML",
          });
        break
      }

      default:
        bot.sendMessage(chatId, "Команду не знайдено(");
    }
  });
};

start(); // Call the start function
