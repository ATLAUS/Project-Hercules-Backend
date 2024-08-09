const {
    describe,
    test,
    expect,
    beforeEach,
    beforeAll,
    afterAll,
} = require("@jest/globals");
const request = require("supertest");
const { app } = require("../../src/app");

const { Exercise } = require("../../models");
const { memoryServerConnect, memoryServerDisconnect, clearDatabase,} = require("../../db/dbUtil");

// Mock the express-oauth2-jwt-bearer module.
jest.mock("express-oauth2-jwt-bearer", () => ({
    auth: jest.fn(() => {
        return (req, res, next) => {
            next();
        };
    })
}));


describe("Exercise Integration Tests", () => {
    const mockExercise1 = {
        name: "Push Ups",
        rep: 8,
        set: 3
    }

    const mockExercise2 = {
        name: "Squats",
        rep: 15,
        set: 3
    }

    beforeAll(async () => {
        await memoryServerConnect()
    })

    afterAll(async () => {
        await memoryServerDisconnect()
    });

    beforeEach(async () => {
        await clearDatabase()
    })

    test("/GET find all exercises", async () => {
        const newExercise1 = await Exercise.create(mockExercise1)
        const newExercise2 = await Exercise.create(mockExercise2)

        const allExercises = [
            newExercise1,
            newExercise2
        ]

        const response = await request(app)
            .get('/api/v1/exercises/all')

        expect(response.status).toBe(200)
        expect(response.body.exercises.length).toBeGreaterThan(0)
        allExercises.forEach(exercise => {
            expect.arrayContaining([
                expect.objectContaining({
                    _id: String(exercise._id),
                    name: exercise.name,
                    rep: exercise.rep,
                    set: exercise.set
                })
            ])
        })
    })

    test("/GET find Exercise by Id", async () => {
        const newExercise = await Exercise.create(mockExercise1)
        
        const response = await request(app)
            .get(`/api/v1/exercises/${newExercise._id}`)

        expect(response.status).toBe(200)
        expect(response.body.exercise.name).toBe(newExercise.name)
        expect(response.body.exercise.rep).toEqual(newExercise.rep) 
        expect(response.body.exercise.set).toEqual(newExercise.set)  

    })

    test("/PATCH update exercise info", async () => {
        const newExercise = await Exercise.create(mockExercise1)
        const exercise = {
            rep: 15,
            set: 2
        }

        const response = await request(app)
            .patch(`/api/v1/exercises/${newExercise._id}`)
            .send(exercise)
                
        expect(response.status).toBe(200) 
        expect(response.body.exercise.rep).toEqual(exercise.rep)
        expect(response.body.exercise.set).toEqual(exercise.set)
    })

    test("/DELETE an exercise", async () => {
        const newExercise1 = await Exercise.create(mockExercise1)

        const response = await request(app)
            .delete(`/api/v1/exercises/${newExercise1._id}`) 

        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Exercise Deleted')
    })
})