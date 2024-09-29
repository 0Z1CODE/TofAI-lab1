import Contacts from "./../models/contacts.model.js";

export const setPhone = async (req, res) => {
  try {
    const { id, phone } = req;
    const contactUser = await Contacts.findOne({ user_id: id });
    contactUser.phone = phone;
    await contactUser.save();
    return contactUser;
  } catch (error) {
    console.log("Error setting contacts", error.message);
  }
};

export const initUserContacts = async (req, res) => {
  try {
    const { id } = req;
    console.log("Init contacts", id);
    
    const contactUser = await Contacts.findOne({ user_id: id });
   
    if (!contactUser) {
      const contactUser = new Contacts({
        user_id: id,
        phone: "1",
        first_name: "1",
        last_name: "1",
      });
      await contactUser.save();
    }
    return contactUser;
  } catch (error) {
    console.log("Error setting contacts", error.message);
  }
};
