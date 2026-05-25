import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf
} from "../services/interview.api"

import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context


    // GENERATE REPORT
    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {

        setLoading(true)

        try {

            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            if (response?.interviewReport) {

                const newReport = response.interviewReport

                setReport(newReport)

                // 🔥 IMPORTANT FIX: update list instantly
                setReports(prev => [newReport, ...prev])

                return newReport
            }

            return null

        } catch (error) {
            console.log(error)
            alert(error?.response?.data?.message || "Failed to generate report")
            return null
        } finally {
            setLoading(false)
        }
    }


    // GET REPORT BY ID
    const getReportById = async (interviewId) => {

        setLoading(true)

        try {

            const response = await getInterviewReportById(interviewId)

            if (response?.interviewReport) {
                setReport(response.interviewReport)
                return response.interviewReport
            }

            return null

        } catch (error) {
            console.log(error)
            return null
        } finally {
            setLoading(false)
        }
    }


    // GET ALL REPORTS
    const getReports = async () => {

        setLoading(true)

        try {

            const response = await getAllInterviewReports()

            const list = response?.interviewReports || []

            setReports(list)

            return list

        } catch (error) {
            console.log(error)
            return []
        } finally {
            setLoading(false)
        }
    }


    // DOWNLOAD PDF
    const getResumePdf = async (interviewReportId) => {

        setLoading(true)

        try {

            const response = await generateResumePdf({
                interviewReportId
            })

            const file = new Blob([response], {
                type: "application/pdf"
            })

            const fileURL = window.URL.createObjectURL(file)

            const link = document.createElement("a")
            link.href = fileURL
            link.download = `resume_${interviewReportId}.pdf`

            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            window.URL.revokeObjectURL(fileURL)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    // 🔥 FIXED EFFECT (IMPORTANT)
    useEffect(() => {

        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }

    }, [interviewId])


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }
}