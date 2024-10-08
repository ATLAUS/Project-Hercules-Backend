const express = require('express')
const { Exercise } = require('../../../models')

const router = express.Router()

router.get("/all", async (req, res, next) => {
    try {
        const exercises = await Exercise.find()

        if (exercises.length < 1) {
            res.status(404).send({ message: "There are no Exercises"})
        }

        res.status(200).send({ exercises })
    } catch (error) {
        next(error)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const exerciseById = await Exercise.findById(id)

        if (!exerciseById) {
            res.status(404).send({message: "Exercise not found"})
        }

        res.status(200).send({exercise: exerciseById})
    } catch (error) {
        next(error)
    }
})

router.patch("/:id", async (req, res, next) => {
    try {
        const exerciseUpdate = req.body
        const { id } = req.params
        const exerciseById = await Exercise.findByIdAndUpdate(id, exerciseUpdate, { new: true })

        if (!exerciseById) {
            res.status(404),send({messsage: "Exercise not found"})
        }

        res.status(200).send({
            message: 'Exercise updated',
            exercise: exerciseById
        })
    } catch (error) {
        next(error)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const exerciseById = await Exercise.findByIdAndDelete(id)

        if(!exerciseById){
            res.status(404).send({message: "Exercise not found"})
        }

        res.status(200).send({
            message: "Exercise Deleted",
            exercise: exerciseById
        })
    } catch (error) {
        next(error)
    }
})


module.exports = router