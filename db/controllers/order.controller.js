import Order from "../models/ order.model.js";

export const initNewOrder = async (req, res) => {
  try {
    const { user_id, product_id, contacts, status, quantity, coast} = req;
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
      coast,
    });
    await newOrder.save();
    return newOrder;
  } catch (error) {
    console.log("Error setting order", error.message);
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const { id } = req;
    const orders = await Order.find({ user_id: id });
    return orders;
  } catch (error) {
    console.log("Error getting orders", error.message);
  }
};