jest.mock("../src/services/ai.service")

const request = require("supertest")
const app = require("../src/app")
const testDb = require("./testDb")
const aiService = require("../src/services/ai.service")

const mockReport = {
    matchScore: 82,
    technicalQuestions: [
        { question: "Explain closures in JS", intention: "Test JS fundamentals", answer: "..." }
    ],
    behavioralQuestions: [
        { question: "Tell me about a conflict you resolved", intention: "Test soft skills", answer: "..." }
    ],
    skillGaps: [
        { skill: "System Design", severity: "medium" }
    ],
    preparationPlan: [
        { day: 1, focus: "DSA revision", tasks: ["Arrays", "Strings"] }
    ]
}

beforeAll(async () => {
    await testDb.connect()
})

afterEach(async () => {
    await testDb.clear()
    jest.clearAllMocks()
})

afterAll(async () => {
    await testDb.close()
})

async function registerAndGetToken(overrides = {}) {
    const res = await request(app)
        .post("/api/auth/register")
        .send({
            username: overrides.username || "interviewee",
            email: overrides.email || "interviewee@example.com",
            password: "Password123"
        })

    return res.body.token
}

describe("POST /api/interview/", () => {

    it("rejects unauthenticated requests", async () => {
        const res = await request(app)
            .post("/api/interview/")
            .field("jobDescription", "Backend Engineer")
            .field("selfDescription", "Fresher with full-stack projects")

        expect(res.status).toBe(401)
        expect(aiService.generateInterviewReport).not.toHaveBeenCalled()
    })

    it("generates and persists a report for an authenticated user", async () => {
        aiService.generateInterviewReport.mockResolvedValue(mockReport)

        const token = await registerAndGetToken()

        const res = await request(app)
            .post("/api/interview/")
            .set("Authorization", `Bearer ${token}`)
            .field("jobDescription", "Backend Engineer")
            .field("selfDescription", "Fresher with full-stack projects")

        expect(res.status).toBe(201)
        expect(aiService.generateInterviewReport).toHaveBeenCalledTimes(1)
        expect(res.body.interviewReport.matchScore).toBe(82)
        expect(res.body.interviewReport.technicalQuestions).toHaveLength(1)
        expect(res.body.interviewReport.skillGaps[0].skill).toBe("System Design")
    })

    it("returns 500 when the AI service fails", async () => {
        aiService.generateInterviewReport.mockRejectedValue(new Error("Gemini API error"))

        const token = await registerAndGetToken()

        const res = await request(app)
            .post("/api/interview/")
            .set("Authorization", `Bearer ${token}`)
            .field("jobDescription", "Backend Engineer")
            .field("selfDescription", "Fresher with full-stack projects")

        expect(res.status).toBe(500)
    })
})

describe("GET /api/interview/", () => {

    it("only returns reports belonging to the logged-in user", async () => {
        aiService.generateInterviewReport.mockResolvedValue(mockReport)

        const tokenA = await registerAndGetToken({ username: "userA", email: "userA@example.com" })
        const tokenB = await registerAndGetToken({ username: "userB", email: "userB@example.com" })

        await request(app)
            .post("/api/interview/")
            .set("Authorization", `Bearer ${tokenA}`)
            .field("jobDescription", "Backend Engineer")
            .field("selfDescription", "A")

        const resA = await request(app)
            .get("/api/interview/")
            .set("Authorization", `Bearer ${tokenA}`)

        const resB = await request(app)
            .get("/api/interview/")
            .set("Authorization", `Bearer ${tokenB}`)

        expect(resA.body.interviewReports).toHaveLength(1)
        expect(resB.body.interviewReports).toHaveLength(0)
    })
})

describe("GET /api/interview/report/:interviewId", () => {

    it("returns 404 when the report belongs to a different user", async () => {
        aiService.generateInterviewReport.mockResolvedValue(mockReport)

        const tokenA = await registerAndGetToken({ username: "userA", email: "userA@example.com" })
        const tokenB = await registerAndGetToken({ username: "userB", email: "userB@example.com" })

        const createRes = await request(app)
            .post("/api/interview/")
            .set("Authorization", `Bearer ${tokenA}`)
            .field("jobDescription", "Backend Engineer")
            .field("selfDescription", "A")

        const reportId = createRes.body.interviewReport._id

        const res = await request(app)
            .get(`/api/interview/report/${reportId}`)
            .set("Authorization", `Bearer ${tokenB}`)

        expect(res.status).toBe(404)
    })
})
