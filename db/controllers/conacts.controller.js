import User from "../models/user.model.js";
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

export const setNames = async (req, res) => {
  try {
    const { id, first_name, last_name } = req;
    const contactUser = await Contacts.findOne({ user_id: id });
    if (contactUser) {
      contactUser.first_name = first_name;
      contactUser.last_name = last_name;
      await contactUser.save();
    }
  } catch (error) {
    console.log("Error setting contacts", error.message);
  }
};

export const setAddress = async (req, res) => {
  try {
    const { id, address, location, addressInfo } = req;
    const contactUser = await Contacts.findOne({ user_id: id });
    if (contactUser) {
      contactUser.address = address;
      contactUser.location = location;
      contactUser.addressInfo = addressInfo;
      
      await contactUser.save();
    }
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
      const user = await User.findById(id);
      console.log("User", user);

      const contactUser = new Contacts({
        user_id: id,
        phone: "00000",
        first_name: user.first_name,
        last_name: user.last_name,
      });
      await contactUser.save();
    }
    return contactUser;
  } catch (error) {
    console.log("Error setting contacts", error.message);
  }
};


export const getUserContacts = async (req, res) => {
  try {
    const { id } = req;
    const contactUser = await Contacts.findOne({ user_id: id });
    return contactUser;
  }
  catch (error) {
    console.log("Error getting contacts", error.message);
  }
}

