import mongoose from "mongoose";

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
  
    location: {
      type: Object,
    },
    address: {
      type: String,
    },

    addressInfo: {
        house_number: {
          type: String,
        },
        road: {
          type: String,
        },
        allotments: {
          type: String,
        },
        village: {
          type: String,
        },
        municipality: {
          type: String,
        },
        district: {
          type: String,
        },
        state: {
          type: String,
        },
        postcode: {
          type: String,
        },
        country: {
          type: String,
      },
    },
  },

  { timestamps: true }
);

const Contacts = mongoose.model("Contacts", contactsSchema);

export default Contacts;
