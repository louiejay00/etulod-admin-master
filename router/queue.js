const { default: Queue } = require("../models/Queue");
const { default: Driver } = require("../models/Driver");
const { default: Logs, QueueStatus } = require("../models/Logs");
const router = require("express").Router();
const { default: Process } = require("../models/Process");


router.get('/', async (req, res) => {
  try {
    const currentQueuedDrivers = await Queue.find()
    res.status(200).send(currentQueuedDrivers)
  } catch (err) {
    res.status(500).send({
      error: err.message,
    })
  }
})

router.delete("/:id", async (req, res) => {
  // const filter = { _id: req.body._id };
  try {
    let doc = await Queue.findByIdAndDelete(req.params.id);
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

router.post("/booking", async (req, res) => {
  try {
    const { processId } = req.body;

    //CREATE LOG FOR BOOKING
    const process = await Process.default.findById(processId);

    const queue = await getOneDriverAndPutToQueue();

    const newLog = await new Logs({
      process,
      queue,
      status: Object.keys(QueueStatus),
    });
    res.status(200).send({
      driver: queue,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
});

router.post("/booking-cancelled", (req, res) => {
  //cancelled by customer / user
  //queued driver when returned to driver table,
  // ordernumber is not changed
});

router.post("/booking-rejected", (req, res) => {
  //ordernumbe changed to last highest ordernumber
});

router.post("/confirm-booking", (req, res) => {
  //respond customer confirms driver is on its way
});

router.post("/driver-arrived", (req, res) => {});

router.post("/end-driver-trip", async (req, res) => {
  //twilio
  //send mesasge to driver that the customer has ended trip
  //from queue to driver table
  try {
    const { queueId } = req.body;
    if (!queueId) {
      return res.status(400).send({
        error: "Queue Id is required",
      });
    }

    let driverInfo = await getDriverFromQueue(queueId);
    console.log("driver Info is - ", driverInfo);

    await insertDriverInLast(driverInfo);
    await Queue.default.findByIdAndDelete(queueId);

    return res.status(200).send({
      message : "Trip ended successfully"
    });
  } catch (err) {
    return res.status(500).send({
      error: err.message,
    });
  }
});

//Admin route

/**
 * first argument is asc or desc
 */
const getDriversSorted = async (arg) => {
  let drivers =  await Driver.default.find().sort({
    ordernumber: arg === "desc" ? -1 : 1,
  });
  return drivers;
};

const getOneDriverAndPutToQueue = async () => {
  try {
    const getDriver = (await getDriversSorted())[0];
    console.log("get deiver - ",getDriver)
    const deleteDriver = await Driver.default.findByIdAndDelete(getDriver._id);

    const addDriverToQueue = await new Queue.default({
      drivername: getDriver.drivername,
      driveraddress: getDriver.driveraddress,
      platenumber: getDriver.platenumber,
      drivercpnum: getDriver.drivercpnum,
      ordernumber: getDriver.ordernumber,
    }).save();
    return addDriverToQueue;
  } catch (err) {
    throw new Error(err);
  }
};

returnDriverFromQueue = async ({ queueId, putToLast }) => {
  const driverToBeReturned = await Queue.findById(queueId);
  if (putToLast) {
    const returnedDriverToLast = new Driver({
      ...driverToBeReturned._doc,
      ordernumber: getDriversSorted("desc")[0].ordernumber + 1,
    }).save();
  }
};

getDriverFromQueue = async (queueId) => {
  return await Queue.default.findById(queueId);
};

insertDriverInLast = async (driverInfo) => {
  driverInfo = JSON.parse(JSON.stringify(driverInfo)) 
  try {
    let lastDriverInfo = (await getDriversSorted("desc"))[0];
    let nextSeq = 0;
    if(lastDriverInfo && lastDriverInfo.ordernumber) {
      nextSeq = lastDriverInfo.ordernumber + 1
    }
    delete driverInfo._id;
    delete driverInfo._v;
    await new Driver.default({
      ...driverInfo,
      ordernumber: nextSeq,
    }).save();
    return Promise.resolve();
  } catch (e) {
    console.log(e)
    return Promise.reject("Something went wrong");
  }
};

module.exports = router;
