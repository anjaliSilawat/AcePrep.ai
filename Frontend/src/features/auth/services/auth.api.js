import axios from "axios"

const api = axios.create({
    baseURL: "https://aceprep-ai.onrender.com"
})

export async function register({ username, email, password }) {

    try {

        const response = await api.post(
            "/api/auth/register",
            {
                username,
                email,
                password
            }
        )

        if (response.data.token) {

            localStorage.setItem(
                "token",
                response.data.token
            )

        }

        return response.data

    } catch (err) {

        console.log(err)

    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post(
            "/api/auth/login",
            {
                email,
                password
            }
        )

        if (response.data.token) {

            localStorage.setItem(
                "token",
                response.data.token
            )

        }

        return response.data

    } catch (err) {

        console.log(err)

    }

}

export async function logout() {

    try {

        const token = localStorage.getItem("token")

        const response = await api.get(
            "/api/auth/logout",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        localStorage.removeItem("token")

        return response.data

    } catch (err) {

        console.log(err)

    }

}

export async function getMe() {

    try {

        const token = localStorage.getItem("token")

        if (!token) {
            return null
        }

        const response = await api.get(
            "/api/auth/get-me",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return response.data

    } catch (err) {

        console.log(err)

        return null

    }

}