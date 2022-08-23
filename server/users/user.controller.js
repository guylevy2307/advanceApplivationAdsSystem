const User = require("./User");
const Post = require("../posts/Post");
const NodeGeocoder = require("node-geocoder");
const createCountMinSketch = require("count-min-sketch");
const geocoder = NodeGeocoder(options);

const readUsers = async (req, res) => {
  let sent = false;
  try {
    const users = await User.find({ isDeleted: false }).clone();
    if (res) {
      res.status(200).json(users);
      sent = true;
    } else return users;
  } catch (err) {
    if (res) {
      if (!sent) res.status(404).json({ error: err.message });
    }
  }
  return null;
};

const searchUsers = async (req, res) => {
  let sent = false;
  try {
    let users = null;
    let method = req.body.searchBy;
    let content = req.body.keyword;
    if (!content) {
      res.status(400).json({
        error:
          "No keywords entered for search query,or no search method selected",
      });
      sent = true;
    } else if (!content.includes(" ")) {
      const regex = new RegExp(content, "i"); // i for case insensitive
      if (!method)
        users = await User.find({
          $or: [
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
          ],
          isDeleted: false,
        }).clone();
      else {
        if (method === "firstName")
          users = await User.find({ firstName: { $regex: regex } }).clone();
        else if (method === "lastName")
          users = await User.find({ lastName: { $regex: regex } }).clone();
        else {
          res.status(400).json({ error: "Invalid filter clause" });
          sent = true;
        }
      }
    } else {
      let values = content.split(" ", 1);
      const firstNameRegex = new RegExp(values[0], "i"); // i for case insensitive
      const lastNameRegex = new RegExp(values[1], "i"); // i for case insensitive
      users = await User.find({
        $and: [
          { firstName: { $regex: firstNameRegex } },
          { lastName: { $regex: lastNameRegex } },
        ],
        isDeleted: false,
      }).clone();
    }
    if (!sent) {
      res.status(200).json(users);
      sent = true;
    }
  } catch (err) {
    if (!sent) res.status(400).json({ error: err });
  }
};

const logIn = async (req, res) => {
  let sent = false;
  try {
    await User.findOne(
      { email: req.body.email, isDeleted: false },
      function (err, docs) {
        if (err || !docs) {
          res.status(404).json({
            message: "No user found with this email.",
            isSuccess: false,
          });
          sent = true;
        } else {
          console.log(docs);
          if (req.body.password !== docs.password) {
            if (!sent) {
              res.status(400).json({
                message:
                  "Incorrect password inserted for this user, please try again.",
                isSuccess: false,
              });
              sent = true;
            }
          } else {
            if (!sent) {
              res
                .status(200)
                .json({ message: "Success to log in", isSuccess: true });
              sent = true;
            }
            // todo: add some kind of session management and save the current logged in user.
          }
        }
      }
    ).clone();
  } catch (error) {
    if (!sent) {
      res.status(400).send("Error occurred in login.");
      sent = true;
    }
  }
};

const getUserByEmail = async (req, res) => {
  let sent = false;
  try {
    const { email } = req.params;
    await User.findOne(
      { email: email, isDeleted: false },
      function (error, docs) {
        if (error || !docs) {
          if (!sent) {
            res.status(404).send("User with email " + email + " not found");
            sent = true;
          }
        } else {
          if (!sent) {
            res.status(200).json(docs);
            sent = true;
          }
        }
      }
    ).clone();
  } catch (err) {
    if (!sent) {
      res.status(404).json({ error: err.message });
      sent = true;
    }
  }
};

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const createUser = async (req, res) => {
  let sent = false;
  try {
    let response;
    let result = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
    };
    if (
      !result.firstName ||
      !result.lastName ||
      !result.email ||
      !result.password
    ) {
      res
        .status(404)
        .json({ message: "Information missing for user creation." });
      sent = true;
    } else if (!validateEmail(result.email)) {
      if (!sent) {
        res.status(400).json({ message: "Wrong email format." });
        sent = true;
      }
    } else if (
      !/^[a-zA-Z]+$/.test(result.firstName) ||
      !/^[a-zA-Z]+$/.test(result.lastName)
    ) {
      if (!sent) {
        res
          .status(400)
          .json({ message: "User name can contain english letters only." });
        sent = true;
      }
    } else
      response = await User.findOne(
        { email: result.email, isDeleted: false },
        function (error, docs) {
          if (error && !sent) {
            res.status(400).send("Error with user creation");
            sent = true;
          } else if (docs && !sent) {
            res
              .status(404)
              .send("User with email " + result.email + " already exists");
            sent = true;
          }
        }
      ).clone();
    const user = new User({
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      password: result.password,
      address: result.address,
    });
    await user.save();
    if (!sent) {
      res.status(200).json(user);
      sent = true;
    }
  } catch (error) {
    if (!sent) {
      res.status(404).json({ message: error });
      sent = true;
    }
  }
};

const searchLatAndLngByAddress = async (address) => {
  const options = {
    provider: "google",

    // Optional depending on the providers
    // fetch: customFetchImplementation,
    apiKey: "AIzaSyDgRiuBRnyBk0p69oZpOwQQFzm8dLYuBKw", // for Mapquest, OpenCage, Google Premier
    formatter: null, // 'gpx', 'string', ...
  };

  // Using callback
  try {
    let status = await geocoder.geocode({ address: address });
    return { lat: status[0].latitude, lng: status[0].longitude };
  } catch (err) {
    console.log("Error converting address " + address + " with error " + err);
    return null;
  }
};

const getAllUserAddresses = async (req, res) => {
  let sent = false;
  try {
    await User.find({ isDeleted: false }, async function (error, result) {
      if (error) {
        res.status(400).send("Error gettings user addresses from DB.");
        sent = true;
      }
      if (result) {
        let addresses = result
          .map((user) => user.address)
          .filter((address) => address !== "Not provided"); // searchLatAndLngByAddress if possible
        let converted = [];
        for (let i = 0; i < addresses.length; i++) {
          let object = await searchLatAndLngByAddress(addresses[i]);
          if (object) converted.push(object);
        }
        if (!sent) {
          res.status(200).json(converted);
          sent = true;
        }
      }
    }).clone();
  } catch (e) {
    console.log("Exception " + e + " occurred in getAllUserAddresses");
    res.status(400).send("error");
  }
};

const getMostActiveUsers = async (req, res) => {
  let sent = false;
  try {
    Post.aggregate(
      [
        {
          $group: {
            _id: "$userEmail",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ],

      async function (err, result) {
        console.log("Before getting user data:");
        console.log(result);
        if (err) {
          if (res && !sent) {
            res.status(400).json({ message: err });
            sent = true;
          }
        } else {
          let updatedResult = [];
          let response;
          for (let i = 0; i < result.length; i++) {
            response = await User.findOne(
              { email: result[i]._id, isDeleted: false },
              function (err, docs) {
                if (err && !sent) {
                  res.status(400).json({ message: err });
                  sent = true;
                }
                if (docs) {
                  docs.numberOfPosts = result[i].count;
                  updatedResult.push(docs);
                }
              }
            ).clone();
          }
          console.log("After getting user data:");
          console.log(updatedResult);
          if (res && !sent) {
            res.status(200).json(
              updatedResult.slice(0, 3).map((u) => {
                return {
                  email: u.email,
                  fullName: u.firstName + " " + u.lastName,
                  count: u.allPostIDs.length,
                };
              })
            ); // maybe not json? just send?
            sent = true;
          }
        }
      }
    );
  } catch (e) {
    console.log("Exception " + e + " occurred in getMostActiveUsers");
    res.status(400).send("error");
  }
};

const getFriendsByUser = async (req, res) => {
  let sent = false;
  try {
    const { email } = req.params;
    let friends = [];
    let response = await User.findOne(
      { email: email, isDeleted: false },
      function (error, docs) {
        if (error || !docs) {
          res.status(400).send("No user exists with the email provided.");
          sent = true;
        }
      }
    )
      .clone()
      .then((response) => (friends = response.friends));
    response = await User.find(
      { email: { $in: friends }, isDeleted: false },
      function (error, docs) {
        if ((error || !docs) && !sent) {
          res
            .status(400)
            .send(
              "No user exists with the email provided, or no friends for user."
            );
          sent = true;
        } else if (!sent) {
          res.status(200).json(docs);
          sent = true;
        }
      }
    ).clone();
  } catch (e) {
    console.log("Exception " + e + " occurred in getFriendsByUser");
    if (!sent) res.status(400).send("error");
  }
};

const addUserFriend = async (req, res) => {
  let sent = false;
  const { email } = req.params;
  let friends = null;
  try {
    const result = await User.findOne({
      email: email,
      isDeleted: false,
    }).clone();
    if (!result) {
      res.status(400).send("No user exists with the email provided.");
      sent = true;
    } else friends = result.friends;
    if (!friends) friends = [];
    let newFriend = req.body.friendEmail;
    if (friends.includes(newFriend))
      res.status(200).send("They are already friends.");
    if (!newFriend && !sent) {
      res.status(400).send("No friend email provided.");
      sent = true;
    }
    let friendFriends;

    const resultFriend = await User.findOne({
      email: newFriend,
      isDeleted: false,
    }).clone();
    if (!resultFriend && !sent) {
      res.status(400).send("No user exists with the friend email provided.");
      sent = true;
    }
    friendFriends = resultFriend.friends;
    if (!friendFriends) friendFriends = [];

    friends.push(newFriend);
    friendFriends.push(email);
    let response;
    response = await User.findOneAndUpdate(
      { email: newFriend, isDeleted: false },
      { friends: friendFriends }
    ).clone();
    response = await User.findOneAndUpdate(
      { email: email, isDeleted: false },
      { friends: friends }
    ).clone();

    if (!sent) {
      res.status(200).json(response);
      sent = true;
    }
  } catch (e) {
    console.log("Exception " + e + " occurred in addUserFriend");
    if (!sent) {
      res.status(400).send("error");
    }
  }
};

const deletePostFromUser = async (req) => {
  try {
    let succeeded = true;
    let allPostIDs = null;
    let response = await User.findOne(
      { email: req.email, isDeleted: false },
      async function (error, docs) {
        if (error || !docs) {
          succeeded = false;
        } else allPostIDs = docs.allPostIDs;

        if (!succeeded) return false;
        let toRemove = req.postID;
        allPostIDs = allPostIDs.filter((e) => e !== toRemove);
        await User.findOneAndUpdate(
          {
            email: req.email,
            isDeleted: false,
          },
          { allPostIDs: allPostIDs },
          { new: true },
          function (error, docs) {
            if (error) succeeded = false;
            console.log("Posts after removal: " + docs.allPostIDs);
          }
        ).clone();
      }
    ).clone();

    return succeeded;
  } catch (e) {
    console.log("Exception " + e + " occurred in deletePostFromUser");
    return false;
  }
};

const AddPostToUser = async (req) => {
  let succeeded = true;
  let allPostIDs = null;
  try {
    let response = await User.findOne(
      { email: req.email, isDeleted: false },
      async function (error, docs) {
        if (error || !docs) {
          succeeded = false;
        }
        allPostIDs = docs.allPostIDs;
        if (allPostIDs == null) allPostIDs = [];
        console.log(docs);
        if (!succeeded) return false;
        let newPostId = req.postID;
        allPostIDs.push(newPostId);

        await User.findOneAndUpdate(
          {
            email: req.email,
            isDeleted: false,
          },
          { allPostIDs: allPostIDs },
          { new: true },
          function (error, docs) {
            if (error) succeeded = false;
            console.log("Posts after addition: " + docs.allPostIDs);
          }
        ).clone();
      }
    ).clone();

    return succeeded;
  } catch (e) {
    console.log("Exception " + e + " occurred in AddPostToUser");
    return false;
  }
};

const updateUser = async (req, res) => {
  try {
    let sent = false;
    const { email } = req.params;
    const { firstName, lastName, password, profilePicture, address } = req.body;
    let response = await User.findOne(
      { email: email, isDeleted: false },
      function (error, docs) {
        if (error || !docs) {
          res.status(400).send("No user exists with the email provided.");
          sent = true;
        }
      }
    ).clone();
    let updateInfo = {};
    if (firstName && firstName.length > 0) updateInfo.firstName = firstName;
    if (lastName && lastName.length > 0) updateInfo.lastName = lastName;
    if (password && password.length > 0) updateInfo.password = password;
    if (profilePicture && profilePicture.length > 0)
      updateInfo.profilePicture = profilePicture;
    if (address && address.length > 0) updateInfo.address = address;

    const result = await User.findOneAndUpdate(
      { email: email, isDeleted: false },
      updateInfo
    ).clone();
    if (!sent) {
      res.status(200).json(result);
      sent = true;
    }
  } catch (e) {
    console.log("Exception " + e + " occurred in updateUser");
    res.status(400).send("error");
  }
};

const readPostsByUser = async (req, res) => {
  try {
    let sent = false;
    const { userEmail } = req.params;

    let response = await User.findOne(
      { email: userEmail, isDeleted: false },
      function (error, docs) {
        if (error) {
          res.status(400).send("User with this email doesn't exist.");
          sent = true;
        }
      }
    ).clone();

    await Post.find(
      { userEmail: userEmail, isDeleted: false },
      function (err, docs) {
        if (!req || !res) {
          if (err) return null;
          return docs;
        } else if (err && !sent) {
          res.status(400).json({ message: err });
          sent = true;
        } else if (docs && !sent) {
          res.status(200).json(docs.reverse());
          sent = true;
        } else return null;
      }
    ).clone();
  } catch (e) {
    console.log("Exception " + e + " occurred in readPostsByUser");
    res.status(400).send("error");
  }
};

const deleteUser = async (req, res) => {
  try {
    let sent = false;
    const { email } = req.params;
    let response = await User.findOneAndUpdate(
      {
        email: email,
        isDeleted: false,
      },
      { isDeleted: true },
      function (error, result) {
        if (error) {
          res.status(400).send(error);
          sent = true;
        }
      }
    ).clone();
    if (!sent) res.status(200).send("Deleted user successfully");
  } catch (e) {
    console.log("Exception " + e + " occurred in deleteUser");
    res.status(400).send("error");
  }
};

//Increment counters

const getPopularNames = async (isFirstName) => {
  //Create data structure
  let sketch = createCountMinSketch(0.01);
  let allNames = [];
  let allUsers = await readUsers(null, null);
  if (!allUsers) {
    console.log("No users in DB");
    return;
  }
  for (let i = 0; i < allUsers.length; i++) {
    let name = null;
    if (isFirstName) name = allUsers[i].firstName;
    else name = allUsers[i].lastName;
    sketch.update(name, 1);
    if (!allNames.includes(name)) allNames.push(name);
  }

  //Query results
  // get top 3 names and counts
  let max = 0,
    maxName = null;
  let secondMax = 0,
    secondMaxName = null;
  let thirdMax = 0,
    thirdMaxName = null;
  for (let i = 0; i < allNames.length; i++) {
    let key = allNames[i];
    let frequency = sketch.query(key);
    if (frequency > max) {
      thirdMax = secondMax;
      thirdMaxName = secondMaxName;
      secondMax = max;
      secondMaxName = maxName;
      max = frequency;
      maxName = key;
    } else if (frequency > secondMax) {
      thirdMax = secondMax;
      thirdMaxName = secondMaxName;
      secondMax = frequency;
      secondMaxName = key;
    } else if (frequency > thirdMax) {
      thirdMax = frequency;
      thirdMaxName = key;
    }
  }
  console.log("first place: " + maxName + " with " + max + " appearances");
  console.log(
    "second place: " + secondMaxName + " with " + secondMax + " appearances"
  );
  console.log(
    "third place: " + thirdMaxName + " with " + thirdMax + " appearances"
  );
  return {
    firstPlace: maxName,
    firstFrequency: max,
    secondPlace: secondMaxName,
    secondFrequency: secondMax,
    thirdPlace: thirdMaxName,
    thirdFrequency: thirdMax,
  };
};

const getPopularFirstNames = async (req, res) => {
  try {
    const result = await getPopularNames(true);
    res.status(200).json(result);
  } catch (e) {
    console.log("Exception " + e + " occurred in getPopularFirstNames");
    res.status(400).send("error");
  }
};

const getPopularLastNames = async (req, res) => {
  try {
    const result = await getPopularNames(false);
    res.status(200).json(result);
  } catch (e) {
    console.log("Exception " + e + " occurred in getPopularLastNames");
    res.status(400).send("error");
  }
};

module.exports = {
  readUsers,
  createUser,
  updateUser,
  AddPostToUser,
  deleteUser,
  getUserByEmail,
  logIn,
  searchUsers,
  deletePostFromUser,
  getMostActiveUsers,
  readPostsByUser,
  getFriendsByUser,
  addUserFriend,
  getAllUserAddresses,
  getPopularFirstNames,
  getPopularLastNames,
};
