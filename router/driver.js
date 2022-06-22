const router = require("express").Router();
const {default:Driver} = require("../models/Driver");
const Queue = require("../models/Queue");
const queueArray = require("../utility/Queue");
const validator = require("validator");
const faker = require("faker");
const driverSchema = require("../models/Driver");

router.get("/", async (req, res) => {
  try {
    const driver = await Driver.find();
    res.status(200).send(driver);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: err.message,
    });
  }
});

//Create Driver
const createDriver = async (req, res) => {
  try {
    const driverCount = await Driver.count()
    const response = await new Driver({
      drivername: req.body.drivername,
      driveraddress: req.body.driveraddress,
      platenumber: req.body.platenumber,
      drivercpnum: req.body.drivercpnum,
      ordernumber: driverCount,
    }).save()
    if (res?.status) {
      res.status(200).send(response)
    }
    return response
  } catch (err) {
    if (res?.status) {
      res.status(400).send({
        error: err.message,
      })
    }
    throw err
  }
}
router.post('/', createDriver)

/**
 * @params { body : {  
 *    "drivername",
      "driveraddress",
      "platenumber",
      "drivercpnum",
      "ordernumber", } 

      params: { "id" }
    } 
 */
const updateDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!(typeof driver === "object" && Object.keys(driver).length > 0)) {
      throw new Error("Driver does not exist");
    }

    /**
     * validation of fields since whitelisting is not available
     */
    const fieldsToExpect = [
      "drivername",
      "driveraddress",
      "platenumber",
      "drivercpnum",
      "ordernumber",
    ];

    Object.keys(req.body).forEach((ea) => {
      if (!fieldsToExpect.includes(ea)) {
        throw new Error(`Key ${ea} not recognized`);
      }
    });
    console.log(req.body);
    const update = {
      ...req.body,
    };

    const doc = await Driver.findByIdAndUpdate(req.params.id, update).then(
      (res) => {
        console.log(res);
        return res._doc;
      }
    );

    if (res?.status) {
      res.status(200).send({
        ...doc,
        ...update,
      });
    }

    return doc;
  } catch (err) {
    if (res?.status) {
      res.status(400).send({
        message: err.message,
      });
    }
    throw err;
  }
};
router.patch("/:id", updateDriver);

router.delete("/", async (req, res) => {
  await Driver.deleteMany();
  res.status(200).send(`Drivers deleted`);
});

router.delete("/:id", async (req, res) => {
  // const filter = { _id: req.body._id };
  try {
    console.log(req.params);
    console.log(req.params.id);
    let doc = await Driver.findByIdAndDelete(req.params.id);

    // queue find where driverId === req.params.id
    // const deleteQueue = await Queue.findOneAndDelete({
    // driverId: req.params.id
    // })
    res.status(200).send({
      message: `Driver ${id} Deleted and removed from Queue`,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
});

router.get("/sorted/:desc", (req, res) => {
  const { desc } = req.params;
  console.log("desc", desc);
  Driver.find({})
    .sort({
      //for  descending -1

      ordernumber: desc ? -1 : 1,
    })
    .then((doc) => {
      res.status(200).send(doc);
    })
    .catch((err) => {
      res.status(500).send({
        error: err.message,
      });
    });
});

router.get("/:id", async (req, res) => {
  const driver = await Driver.findOne({
    id: req.params.id,
  });
  res.status(200).send({
    ...driver._doc,
  });
});

router.post("/populate", async (req, res) => {
  const { number } = req.body;

  try {
    await createDriver({
      body: {
        drivername: faker.name.findName(),
        driveraddress: faker.address.streetAddress(),
        platenumber: faker.address.zipCode(),
        drivercpnum: faker.phone.phoneNumber(),
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
    res.status(200).send("Populated");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
exports.updateDriver = updateDriver;
