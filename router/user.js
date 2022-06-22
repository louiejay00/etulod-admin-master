const router = require("express").Router();
const { default: User } = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: err.message,
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const response = await new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      dateOfBirth: req.body.dateOfBirth,
    }).save();

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({
      error: err.message,
    });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const isUserExist = !!(await User.findById(req.params.id));

    if (!isUserExist) {
      throw new Error("User does not exist");
    }

    const update = {
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      address: req.body.address,
    };
    const doc = await User.findByIdAndUpdate(req.params.id, update);
    res.status(200).send(doc);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  // const filter = { _id: req.body._id };
  try {
    let doc = await User.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: `Destination ${id} Deleted`,
    });
  } catch (err) {
    console.log("Error deleting", err);
    res.status(500).send({
      error: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findOne({
    id: req.params.id,
  });
  res.status(200).send({
    ...user._doc,
  });
});

module.exports = router;
