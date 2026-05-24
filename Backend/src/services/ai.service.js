const { GoogleGenAI } = require("@google/genai")

const PDFDocument = require("pdfkit")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// GENERATE INTERVIEW REPORT

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    try {

        const prompt = `
You are an AI interview preparation assistant.

Analyze the following:

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

Return ONLY valid JSON.

Format:

{
  "matchScore": 90,

  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],

  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],

  "skillGaps": [
    {
      "skill": "",
      "severity": "low"
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": []
    }
  ]
}

Rules:
- Generate exactly 5 technical questions
- Generate exactly 5 behavioral questions
- Generate at least 3 skill gaps
- Generate 4 day preparation plan
- Return ONLY valid JSON
`

        const response =
            await ai.models.generateContent({

                model: "gemini-2.5-flash",

                contents: prompt,

                config: {
                    responseMimeType:
                        "application/json"
                }

            })

        const data =
            JSON.parse(response.text)

        return data

    } catch (error) {

        console.log(error)

        throw error

    }

}


// GENERATE PDF

async function generateResumePdf(interviewReport) {

    return new Promise((resolve, reject) => {

        try {

            const doc = new PDFDocument({
                margin: 40
            })

            const buffers = []

            doc.on("data", buffers.push.bind(buffers))

            doc.on("end", () => {

                const pdfData = Buffer.concat(buffers)

                resolve(pdfData)

            })

            // TITLE

            doc
                .fontSize(24)
                .fillColor("#ff2d78")
                .text("AI Interview Report", {
                    align: "center"
                })

            doc.moveDown(2)

            // MATCH SCORE

            doc
                .fontSize(18)
                .fillColor("black")
                .text(`Match Score: ${interviewReport.matchScore}%`)

            doc.moveDown()

            // TECHNICAL QUESTIONS

            doc
                .fontSize(20)
                .fillColor("#ff2d78")
                .text("Technical Questions")

            doc.moveDown()

            interviewReport.technicalQuestions.forEach((q, index) => {

                doc
                    .fontSize(14)
                    .fillColor("black")
                    .text(`${index + 1}. ${q.question}`)

                doc
                    .fontSize(12)
                    .fillColor("gray")
                    .text(`Intention: ${q.intention}`)

                doc
                    .fontSize(12)
                    .fillColor("black")
                    .text(`Answer: ${q.answer}`)

                doc.moveDown()

            })

            // BEHAVIORAL QUESTIONS

            doc
                .fontSize(20)
                .fillColor("#ff2d78")
                .text("Behavioral Questions")

            doc.moveDown()

            interviewReport.behavioralQuestions.forEach((q, index) => {

                doc
                    .fontSize(14)
                    .fillColor("black")
                    .text(`${index + 1}. ${q.question}`)

                doc
                    .fontSize(12)
                    .fillColor("gray")
                    .text(`Intention: ${q.intention}`)

                doc
                    .fontSize(12)
                    .fillColor("black")
                    .text(`Answer: ${q.answer}`)

                doc.moveDown()

            })

            // SKILL GAPS

            doc
                .fontSize(20)
                .fillColor("#ff2d78")
                .text("Skill Gaps")

            doc.moveDown()

            interviewReport.skillGaps.forEach((gap, index) => {

                doc
                    .fontSize(12)
                    .fillColor("black")
                    .text(`${index + 1}. ${gap.skill} (${gap.severity})`)

            })

            doc.moveDown(2)

            // ROADMAP

            doc
                .fontSize(20)
                .fillColor("#ff2d78")
                .text("Preparation Roadmap")

            doc.moveDown()

            interviewReport.preparationPlan.forEach((day) => {

                doc
                    .fontSize(15)
                    .fillColor("black")
                    .text(`Day ${day.day}: ${day.focus}`)

                doc.moveDown(0.5)

                day.tasks.forEach((task) => {

                    doc
                        .fontSize(12)
                        .text(`• ${task}`)

                })

                doc.moveDown()

            })

            doc.end()

        } catch (error) {

            reject(error)

        }

    })

}

module.exports = {
    generateInterviewReport,
    generateResumePdf
}