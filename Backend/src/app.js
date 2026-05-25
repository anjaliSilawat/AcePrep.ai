const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: [
        "http://localhost:5173", // local frontend
        "https://YOUR-FRONTEND-URL.vercel.app" // deployed frontend URL
    ],
    credentials: true
}))

// Root route
app.get("/", (req, res) => {
    res.send("AcePrep API is running 🚀")
})

/* require all routes */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* use routes */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app