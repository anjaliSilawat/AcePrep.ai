import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss";

import Navbar from "../../auth/components/Navbar";

const Login = () => {

    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await handleLogin({
                email,
                password
            });

            if (res) {
                navigate("/home", { replace: true });
            }

        } catch (err) {

            console.log(err);

        }

    };

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <Navbar />

            <main>
                <div className="form-container">

                    <h1>Login</h1>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">

                            <label>Email</label>

                            <input
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                type="email"
                            />

                        </div>

                        <div className="input-group">

                            <label>Password</label>

                            <input
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                type="password"
                            />

                        </div>

                        <button
                            className="button primary-button"
                            type="submit"
                        >
                            Login
                        </button>

                    </form>

                    <p>
                        Don't have an account?
                        {" "}
                        <Link to="/register">
                            Register
                        </Link>
                    </p>

                </div>
            </main>
        </>
    );
};

export default Login;