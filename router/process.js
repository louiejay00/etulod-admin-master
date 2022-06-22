const router = require('express').Router()

const { default: Process } = require('../models/Process')

router.post('/', async (req, res) => {
  try {
    const response = await new Process({
      passengerName: req.body.passengerName,
      passengerEmail: req.body.passengerEmail,
      driverName: req.body.driverName,
      user: req.body.userid,
      destination: req.body.destination,
      location: req.body.location,
      cpnum: req.body.cpnum,
      NoOfPassengers: Number(req.body.NoOfPassengers),
    }).save()

    res.status(200).send(response)
  } catch (err) {
    res.status(400).send({
      error: err.message,
    })
  }
})

router.get('/:id', async (req, res) => {
  const process = await Process.findOne({
    id: req.params.id,
  })
  res.status(200).send({
    ...process._doc,
  })
})

router.delete('/', async (req, res) => {
  try {
    await Process.remove()
    res.status(200).send({
      message: `Processes cleared`,
    })
  } catch (err) {
    res.status(500).send({
      error: err.message,
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const processFind = await Process.findOne({ id: req.params.id })
    if (!processFind) {
      throw new Error(`Process doesn't exist`)
    }
    const process = await Process.deleteOne({ id: req.params.id })
    res.status(200).send({
      message: `Process ${req.params.id} deleted`,
      process,
    })
  } catch (err) {
    res.status(500).send({
      error: err.message,
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const processes = await Process.find()
    res.status(200).send(processes)
  } catch (err) {
    res.status(500).send({
      error: err.message,
    })
  }
})
module.exports = router
