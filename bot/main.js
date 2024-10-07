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
  orderMenu,
  checkAndResumeMenu,
  sendLocation,
  greetingAceptOrderMessage,
  thxForOrderMessage,
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
  getUserContacts,
} from "../db/controllers/conacts.controller.js";

dotenv.config();

const token = process.env.BOT_TOKEN; // Your bot token from environment variables
const bot = new TelegramBot(token, { polling: true }); // Create a new bot instance
let set_contacts = false;
let tmp_orderInfo = {
  product: null,
  coast: null,
};

const start = async () => {
  await connectToMongoDb(); // Connect to the MongoDB database
  bot.setMyCommands([
    { command: "/start", description: "Старт" },
    { command: "/info", description: "Інформація" },
    { command: "/show_menu", description: "Показати меню" },
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

      case "/show_menu":
        await bot.sendMessage(id, selectPoint(), menuBtns);
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

      // default: {
      //   await bot.sendMessage(id, "Команду не знайдено(");
      // }
    }
  };

  bot.on("message", async (msg) => {
    const { from, contact, location } = msg;
    const user = await getUserData(from); // Get the user from the chat
    const text = msg.text; // Get the message from the chat
    const { id, first_name } = msg.chat; // Get the chat id
    commandsAnswer(text, { id, first_name }); // Get the answer for the command

    const userContact = (await getUserContacts({ id: user?._id })) || null;
    if (
      !userContact?.phone ||
      !userContact?.first_name ||
      !userContact?.last_name ||
      !userContact?.address
    ) {
      set_contacts = true;
      if (contact) {
        const { phone_number } = contact;
        await setPhone({ id: user._id, phone: phone_number });
        await bot.sendMessage(id, `Введіть ваше ім'я та прізвище через пробіл`);
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
          `Дякуємо, ваша адреса збережена: ${geocoder.data.display_name}`, {remove_keyboard: true}
        );
        const userContact = await getUserContacts({ id: user._id });
        await bot.sendMessage(
          id,
          greetingAceptOrderMessage(
            tmp_orderInfo.product,
            userContact.first_name,
            userContact.last_name,
            userContact.phone,
            userContact.address,
            tmp_orderInfo.coast
          ),
          {
            parse_mode: "HTML",
            reply_markup: orderMenu,
          }
        );
      }
    } else set_contacts = false;
  }); // Listen for messages

  // Callback query handler

  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const { id } = query.from;
    const data = query.data;
    const user = await User.findOne({ telegram_id: id });
    const userContacts = await getUserContacts({ id: user._id });

    switch (data) {
      case "send_photo":
        bot.sendPhoto(
          chatId,
          "https://content2.rozetka.com.ua/goods/images/base_action/439965030.jpg"
        );
        break;

      case "edit_contacts": {
        await bot.sendMessage(chatId, `Оберіть, що ви хочете змінити`, {
          reply_markup: checkAndResumeMenu,
        });
        break;
      }

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
          const priceLine = caption
            ?.split("\n")
            .find((line) => line.startsWith("Ціна:"));
          const coast = priceLine
            ? priceLine.split(":")[1].trim().replace(/\D/g, "")
            : "0";
          tmp_orderInfo.product = sp;
          tmp_orderInfo.coast = coast;
          set_contacts = true;
          if (!userContacts) {
            await initUserContacts({ id: user._id });
            await bot.sendMessage(chatId, cartWithoutContanct(sp), {
              parse_mode: "HTML",
              reply_markup: sendPhoneBtn,
            });
          } else {
            const userContacts = await getUserContacts({ id: user._id });
            const { phone, first_name, last_name, address } = userContacts;
            await bot.sendMessage(
              chatId,
              greetingAceptOrderMessage(
                sp,
                first_name,
                last_name,
                phone,
                address,
                coast
              ),
              {
                parse_mode: "HTML",
                reply_markup: orderMenu,
              }
            );
          }
        }
        break;

      case "accept_order": {
        const { product, coast } = tmp_orderInfo;
        const userContacts = await getUserContacts({ id: user._id });
        await initNewOrder({
          user_id: user._id,
          product_id: product,
          contacts: userContacts,
          status: "pending",
          quantity: 1,
          coast: coast,
        });

        await bot.sendMessage(chatId, thxForOrderMessage, {
          parse_mode: "HTML",
          reply_markup: menuBtns,
        });
        break;
      }

      case "cancel_order": {
        await bot.sendMessage(chatId, "Замовлення відхилено");
        await bot.sendMessage(chatId, "Оберіть пункт меню", {
          reply_markup: menuBtns,
        });
        break;
      }

      default:
        bot.sendMessage(chatId, "Команду не знайдено(");
    }
  });
};

start(); // Call the start function
