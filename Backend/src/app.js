const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ace-prep-ai-sage.vercel.app",
        "https://ace-prep-ai-git-main-anjali-silawat-s-projects.vercel.app",
        "https://ace-prep-eqvdp716w-anjali-silawat-s-projects.vercel.app"
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