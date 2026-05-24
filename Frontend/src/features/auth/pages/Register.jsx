import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss";

import Navbar from "../../auth/components/Navbar";

const Register = () => {

    const navigate = useNavigate();
    const { loading, handleRegister } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await handleRegister({
                username,
                email,
                password
            });

            if (res) {

                navigate("/home", {
                    replace: true
                });

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

                    <h1>Register</h1>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">

                            <label>Username</label>

                            <input
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                type="text"
                            />

                        </div>

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
                            Register
                        </button>

                    </form>

                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            Login
                        </Link>
                    </p>

                </div>

            </main>

        </>
    );
};

export default Register;