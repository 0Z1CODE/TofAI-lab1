import mongoose from "mongoose";
import User from "./user.model.js"; // Ensure you have the correct path to the User model

const contactsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    first_name: {
      type: String,
      required: true,
    },

    last_name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    location: {
      type: Array,
    },
    deliveryInfo: {
      type: Array,
    },
  },

  { timestamps: true }
);

const Contacts = mongoose.model("Contacts", contactsSchema);

export default Contacts;
