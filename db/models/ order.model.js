import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: "String",
      required: true,
    },
    user_info: {
      type: {
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
        address: {
          type: String,
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
},
{ timestamps: true }
 
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
