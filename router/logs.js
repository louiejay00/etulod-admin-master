const router = require("express").Router();
const { QueueStatus } = require("../models/Logs");
const { default: Log } = require("../models/Logs");

router.get("/", async (req, res) => {
  try {
    const logs = await Log.find();
    res.status(200).send(logs);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await new Log({
      user: req.body.user,
      process: req.body.process,
      queue: req.body.queue,
      driver: req.body.driver,
      status: Object.keys(QueueStatus),
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
    const isLogExist = !!(await Log.findById(req.params.id));

    if (!isLogExist) {
      throw new Error("Log does not exist");
    }

    const update = {
      user: req.body.user,
      process: req.body.process,
      queue: req.body.queue,
      driver: req.body.driver,
      status: Object.keys(QueueStatus),
    };
    const doc = await Log.findByIdAndUpdate(req.params.id, update);
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
    let doc = await Log.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: `Log ${id} Deleted`,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  const log = await Log.findOne({
    id: req.params.id,
  });
  res.status(200).send({
    ...log._doc,
  });
});

module.exports = router;
