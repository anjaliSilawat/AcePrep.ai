import axios from "axios"

const api = axios.create({
    baseURL: "https://aceprep-ai.onrender.com",
    withCredentials: true,
})


// GENERATE REPORT

export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
}) => {

    const formData = new FormData()

    formData.append(
        "jobDescription",
        jobDescription
    )

    formData.append(
        "selfDescription",
        selfDescription
    )

    formData.append(
        "resume",
        resumeFile
    )

    const response = await api.post(
        "/api/interview/",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    )

    return response.data

}


// GET REPORT BY ID

export const getInterviewReportById = async (
    interviewId
) => {

    const response = await api.get(
        `/api/interview/report/${interviewId}`
    )

    return response.data

}


// GET ALL REPORTS

export const getAllInterviewReports = async () => {

    const response = await api.get(
        "/api/interview/"
    )

    return response.data

}


// DOWNLOAD PDF

export const generateResumePdf = async ({
    interviewReportId
}) => {

    const response = await api.get(
        `/api/interview/resume/pdf/${interviewReportId}`,
        {
            responseType: "blob"
        }
    )

    return response.data

}