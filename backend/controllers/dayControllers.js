const Day = require("../models/dayModel");
const User = require("../models/userModel");

// Create a new Day post
const postDays =  async (req, res) => {
    console.log("Creating...", req.body);
  const { userId, imageUrl } = req.body;
  console.log("Creating...");

  try {
    const dayPost = new Day({
      user: userId,
      imageUrl,
    });

    const savedDayPost = await dayPost.save();
    console.log("Saved", savedDayPost  );

    await User.findByIdAndUpdate(userId, {
      $push: { dayPosts: savedDayPost._id },
    });

    res.status(201).json(savedDayPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get Day posts for a user
// const getDays = async (req, res) => {

//   try {
//     const user = await User.find({}).populate({
//       path: "dayPosts",
//       match: {
//         createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
//       },
//     });
//     res.json(user.dayPosts);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };



const getDays = async (req, res) => {
  try {
    // Calculate the date 24 hours ago
    const date24HoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Fetch all day posts created within the last 24 hours
    const days = await Day.find({
      createdAt: { $gte: date24HoursAgo }
    }).populate('user'); // Populate the user field if needed
    
    console.log(days);
    // Return the fetched day posts
    res.json(days);
  } catch (error) {
    // Handle errors
    res.status(400).json({ error: error.message });
  }
};


module.exports ={
    getDays,
    postDays
}