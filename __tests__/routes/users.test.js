const {
  describe,
  test,
  expect,
  beforeEach,
  afterEach
} = require('@jest/globals')
const request = require('supertest')
const { app } = require('../../src/app')

const { User } = require('../../models')

// TODO: Edit to mock the production usage of the middleware.
// Mock auth middleware.
jest.mock('express-oauth2-jwt-bearer', () => ({
  auth: jest.fn(() => {
    return (req, res, next) => {
      // TODO: Remove this console.log statement.
      console.log('Mock auth middleware called')
      next()
    }
  })
}))

describe('GET user info', () => {
  let findByIdSpy

  beforeEach(() => {
    findByIdSpy = jest.spyOn(User, 'findById')
  })

  afterEach(() => {
    findByIdSpy.mockRestore()
  })

  test('should return a user by id', async () => {
    const mockUser = {
      _id: '123',
      nickname: 'test user',
      email: 'test@user.com',
      userId: '123'
    }

    findByIdSpy.mockReturnValue(mockUser)

    const response = await request(app).get('/api/v1/users/123')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ user: mockUser })
  })

  test('should return 404 if user is not found', async () => {
    findByIdSpy.mockReturnValue(null)

    const response = await request(app).get('/api/v1/users/123')
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'User with ID 123 not found.' })
  })
})
