const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");


// const allUsers = asyncHandler(async (req, res) => {
//   const keyword = req.query.search
//     ? {
//         $or: [
//           { name: { $regex: req.query.search, $options: "i" } },
//           { email: { $regex: req.query.search, $options: "i" } },
//         ],
//       }
//     : {};

//   const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
//   res.send(users);
// });

const allUsers = asyncHandler(async (req, res) => {
  const searchQuery = req.query.search || '';
  console.log('Search Query:', searchQuery);

  if (!req.user || !req.user._id) {
    return res.status(400).json({ success: false, message: 'User not authenticated' });
  }

  let users = [];
  
  if (searchQuery) {
    // First, find exact matches
    users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [
            { name: searchQuery },
            { email: searchQuery }
          ]
        }
      ]
    });

    // If no exact matches, find partial matches
    if (users.length === 0) {
      users = await User.find({
        $and: [
          { _id: { $ne: req.user._id } },
          {
            $or: [
              { name: { $regex: searchQuery, $options: 'i' } },
              { email: { $regex: searchQuery, $options: 'i' } },
            ]
          }
        ]
      });
    }
  } else {
    // If no search query, return all users except the logged-in user
    users = await User.find({ _id: { $ne: req.user._id } });
  }

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});




const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { allUsers, registerUser, authUser };