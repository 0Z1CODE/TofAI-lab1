
export const welcomMessage = (user) => {
  return `<b>Привіт ${user} </b>, вітаємо в нашому чат-боті.`;
};

export const teelAboutData = () =>
  "Бот створений для зручного вибору та замовлення комп'ютерної техніки та комплектуючих.";

export const categoryMessage = (category) => {
  return `Оберіть необхідну категорію: ${category} ↘`;
};

export const selectPoint = () => {
  return `Для початку роботи оберіть розділ, який вас цікавить.👇`;
};

export const infoBtns = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "Надіслати фото", callback_data: "send_photo" }],
    ],
  },
};

export const menuBtns = {
  reply_markup: {
    keyboard: [
      [{ text: "Готові пк" }, { text: "Комплектуючі" }],
      [{ text: "Девайси" }],
    ],
    resize_keyboard: true,
  },
};

export const sendPhoneBtn = {
  keyboard: [
    [{ text: "Відправити контакт", request_contact: true }]
  ],
};

export const sendLocation = {
  keyboard: [
    [{ text: "Відправити локацію", request_location: true }],
  ],
};

export const plugAndPlayMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "Для навчання ", callback_data: "for_study_cat" },
        { text: "Для роботи", callback_data: "for_work_cat" },
      ],
      [
        { text: "Ігрові ", callback_data: "gaming_cat" },
        { text: "Робочі станції", callback_data: "work_station_cat" },
      ],
      [{ text: "Універсальні", callback_data: "multi_cat" }],
    ],
  },
};

export const accessoriesMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "Процесори", callback_data: "cpu_cat" },
        { text: "Материнські плати", callback_data: "materboard_cat" },
        { text: "Оперативна пам'ять", callback_data: "ram_cat" },
      ],
      [
        { text: "HDD/SSD", callback_data: "storage_cat" },
        { text: "Відеокарти", callback_data: "gpu_cat" },
        { text: "Звукові карти", callback_data: "audio_cat" },
      ],
      [
        { text: "Блоки живлення", callback_data: "power_cat" },
        { text: "Системи охолодження", callback_data: "cooling_cat" },
        { text: "Корпуси", callback_data: "cases_cat" },
      ],
    ],
  },
};

export const devicesMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "Мишки", callback_data: "mouse_cat" },
        { text: "Клавіатури", callback_data: "keyboard_cat" },
        { text: "Навушники", callback_data: "heads_cat" },
      ],
      [
        { text: "Килимки для миші", callback_data: "pad_cat" },
        { text: "Акустика", callback_data: "acc_cat" },
        { text: "Мікрофони", callback_data: "mic_cat" },
      ],
      [{ text: "Монітори", callback_data: "display_cat" }],
    ],
  },
};

export const itemMenu = {
  inline_keyboard: [
    [{ text: "Замовити 💰", callback_data: "to_cart", pay: true }],
  ],
};

export const set_order = {
  inline_keyboard: [
    [{ text: "Підтвердити замовлення  💰", callback_data: "set_order" }],
  ],
};

export const orderMenu = {
  inline_keyboard: [
    [{ text: "Прийняти замовлення", callback_data: "accept_order" },{ text: "Редагувати дані", callback_data: "edit_contacts" }],
    
    [{ text: "Відхилити замовлення", callback_data: "cancel_order" }],
  ],
};

export const checkAndResumeMenu = {
  
  keyboard: [
    [{ text: "Змінити номер телефону", callback_data: "change_phone" }],
    [{ text: "Змінити адресу", callback_data: "change_location" }],
    [{ text: "Змінити Імя та Прізвище", callback_data: "change_name" }],
  ],
};

export const getContactBtn = {
  inline_keyboard: [
    [
      {
        text: "Надіслати номер телефону",
        request_contact: true,
        callback_data: "request_contact",
      },
    ],
  ],
  one_time_keyboard: true,



  
};
export const cartBtn = (sp) =>
  `Запит на придбання товару: <b>${sp}</b> успішно сформовано.🤩\nНаш менеджер зв'яжеться з вами за декілька хвилин.\nДякуємо, що обрали нас.\n<b>Все буде Україна! 🇺🇦 </b>`;
export const roductCaption = (item) =>
  `<b>${item.title}</b>\n<b>Короткі технічні характеристики:</b>\n${item.docket}\n<b>Ціна: ${item.price} грн</b>`;

export const cartWithoutContanct = (sp) =>  `Запит на придбання товару: <b>${sp}</b> успішно сформовано.🤩\nЩоб пробовжити оформлення замовлення надайте нам інформацію для доставки замовлення:`

export const greetingAceptOrderMessage = (product, first_name, last_name, phone, address, coast) => {
  return `Шановний ${first_name}, ваше замовлення успішно сформовано.\nІнформація замовлення:\nТовар: <b>${product}</b>\nОтримувач: <b>${first_name + " " + last_name}</b>\nТелефон: <b>${phone}</b>\nАдреса: <b>${address}</b>\nСума замовлення: <b>${coast} грн</b>\n`;
}
export const thxForOrderMessage = `Дякуємо Ваше замовлення успішно оформлено.\nНаш менеджер зв'яжеться з вами найближчим часом.\n<b>Все буде Україна! 🇺🇦 </b>`;