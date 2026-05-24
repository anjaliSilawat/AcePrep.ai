const pdfParse = require("pdf-parse")
const {
    generateInterviewReport,
    generateResumePdf
} = require("../services/ai.service")

const interviewReportModel = require("../models/interviewReport.model")


/**
 * @description Controller to generate interview report
 */
async function generateInterViewReportController(req, res) {

    try {

        const resumeContent = await (
            new pdfParse.PDFParse(
                Uint8Array.from(req.file.buffer)
            )
        ).getText()

        const { selfDescription, jobDescription } = req.body

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        console.log(interViewReportByAi)

        const interviewReport = await interviewReportModel.create({

            user: req.user.id,

            resume: resumeContent.text,

            selfDescription,

            jobDescription,

            technicalQuestions:
                interViewReportByAi.technicalQuestions || [],

            behavioralQuestions:
                interViewReportByAi.behavioralQuestions ||
                interViewReportByAi.behaviouralQuestions ||
                [],

            skillGaps:
                interViewReportByAi.skillGaps || [],

            resumeSuggestions:
                interViewReportByAi.resumeSuggestions || [],

            preparationPlan:
                interViewReportByAi.preparationPlan || [],

            matchScore:
                interViewReportByAi.matchScore || 0
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: error.message || "Something went wrong"
        })
    }
}


/**
 * @description get report by id
 */
async function getInterviewReportByIdController(req, res) {

    try {

        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: error.message
        })
    }
}


/**
 * @description get all reports
 */
async function getAllInterviewReportsController(req, res) {

    try {

        const interviewReports =
            await interviewReportModel
                .find({ user: req.user.id })
                .sort({ createdAt: -1 })

        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: error.message
        })
    }
}


/**
 * @description generate resume pdf
 */
async function generateResumePdfController(req, res) {

    try {

        const { interviewReportId } = req.params

        const interviewReport =
            await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {

            return res.status(404).json({
                message: "Interview report not found"
            })

        }

        // GENERATE FULL PDF REPORT

        const pdfBuffer =
            await generateResumePdf(interviewReport)

        res.set({

            "Content-Type": "application/pdf",

            "Content-Disposition":
                `attachment; filename=interview_report_${interviewReportId}.pdf`

        })

        res.send(pdfBuffer)

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: error.message
        })

    }

}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}