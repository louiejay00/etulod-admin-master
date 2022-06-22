const router = require("express").Router();
const fare = require("../models/Fare");
const Fare = require("../models/Fare");

router.get("/", async (req, res) => {
  try {
    const fares = await Fare.find();
    res.status(200).send(fares);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await new Fare({
      destination: req.body.destination,
      fare: req.body.fare,
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
    const isFareExist = !!(await Fare.findById(req.params.id));

    if (!isFareExist) {
      throw new Error("Location does not exist");
    }

    const update = {
      destination: req.body.destination,
      fare: req.body.fare,
    };
    const doc = await Fare.findByIdAndUpdate(req.params.id, update);
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
    let doc = await Fare.findByIdAndDelete(req.params.id);
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
  const fare = await Fare.findOne({
    id: req.params.id,
  });
  res.status(200).send({
    ...fare._doc,
  });
});

module.exports = router;
