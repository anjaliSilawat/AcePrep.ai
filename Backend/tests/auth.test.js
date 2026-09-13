const request = require("supertest")
const app = require("../src/app")
const testDb = require("./testDb")

beforeAll(async () => {
    await testDb.connect()
})

afterEach(async () => {
    await testDb.clear()
})

afterAll(async () => {
    await testDb.close()
})

const validUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "Password123"
}

describe("POST /api/auth/register", () => {

    it("registers a new user and returns a token", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(validUser)

        expect(res.status).toBe(201)
        expect(res.body.token).toBeDefined()
        expect(res.body.user.email).toBe(validUser.email)
        expect(res.body.user.password).toBeUndefined()
    })

    it("rejects registration with missing fields", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: validUser.email })

        expect(res.status).toBe(400)
    })

    it("rejects duplicate email or username", async () => {
        await request(app).post("/api/auth/register").send(validUser)

        const res = await request(app)
            .post("/api/auth/register")
            .send(validUser)

        expect(res.status).toBe(400)
    })
})

describe("POST /api/auth/login", () => {

    beforeEach(async () => {
        await request(app).post("/api/auth/register").send(validUser)
    })

    it("logs in with correct credentials", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: validUser.email, password: validUser.password })

        expect(res.status).toBe(200)
        expect(res.body.token).toBeDefined()
    })

    it("rejects an incorrect password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: validUser.email, password: "wrongpassword" })

        expect(res.status).toBe(400)
    })

    it("rejects a non-existent email", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "nobody@example.com", password: "whatever" })

        expect(res.status).toBe(400)
    })
})

describe("GET /api/auth/get-me", () => {

    it("rejects requests with no token", async () => {
        const res = await request(app).get("/api/auth/get-me")
        expect(res.status).toBe(401)
    })

    it("rejects requests with a malformed token", async () => {
        const res = await request(app)
            .get("/api/auth/get-me")
            .set("Authorization", "Bearer not-a-real-token")

        expect(res.status).toBe(401)
    })

    it("returns the current user for a valid token", async () => {
        const registerRes = await request(app)
            .post("/api/auth/register")
            .send(validUser)

        const token = registerRes.body.token

        const res = await request(app)
            .get("/api/auth/get-me")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.user.email).toBe(validUser.email)
    })
})

describe("GET /api/auth/logout", () => {

    it("blacklists the token so it can no longer be used", async () => {
        const registerRes = await request(app)
            .post("/api/auth/register")
            .send(validUser)

        const token = registerRes.body.token

        const logoutRes = await request(app)
            .get("/api/auth/logout")
            .set("Authorization", `Bearer ${token}`)

        expect(logoutRes.status).toBe(200)

        const meRes = await request(app)
            .get("/api/auth/get-me")
            .set("Authorization", `Bearer ${token}`)

        expect(meRes.status).toBe(401)
    })
})
