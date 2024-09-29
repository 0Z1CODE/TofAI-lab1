import User from "../models/user.model.js";

export const getUserData = async (req, res) => {
  try {
    const { id } = req;
    const user = await User.findOne({ telegram_id: id });

    if (!user) {
      const newUser = new User({ telegram_id: id, ...req });
      await newUser.save();
    }

    return user;
  } catch (error) {
    console.log("Error getting user", error.message);
  }
};
