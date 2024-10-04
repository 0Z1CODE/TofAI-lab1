import Order from "../models/ order.model.js";

export const initNewOrder = async (req, res) => {
  try {
    const { user_id, product_id, contacts, status, quantity } = req;
    console.log({contacts});
    
    const newOrder = new Order({
      user_id,
      product_id,
      user_info: {
        first_name: contacts.first_name,
        last_name: contacts.last_name,
        phone: contacts.phone,
        address: contacts.address,
      },
      status,
      quantity,
    });
    await newOrder.save();
    return newOrder;
  } catch (error) {
    console.log("Error setting order", error.message);
  }
};
