import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      default: "asfsdfdsfdsf"
    },
    user_info: {
      first_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      last_name: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      phone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contacts",
        required: true,
      },
      },
   
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },




  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
