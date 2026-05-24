import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./navbar.scss";

const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {

        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "light") {

            document.body.classList.add("light-theme");
            setDarkMode(false);

        }

    }, []);

    const toggleTheme = () => {

        if (darkMode) {

            document.body.classList.add("light-theme");
            localStorage.setItem("theme", "light");

        } else {

            document.body.classList.remove("light-theme");
            localStorage.setItem("theme", "dark");

        }

        setDarkMode(!darkMode);

    };

    return (

        <nav className="navbar">

            <div className="navbar__left">

                {/* Logo + Name */}

                <div
                    className="brand"
                    onClick={() => navigate("/home")}
                >

                    <img
                        src="/logo.png"
                        alt="AcePrep Logo"
                    />

                    <span>
                        AcePrep.ai
                    </span>

                </div>

                {
                    location.pathname !== "/home" &&
                    location.pathname !== "/login" &&
                    location.pathname !== "/register" && (

                        <button
                            className="back-btn-nav"
                            onClick={() => navigate(-1)}
                        >
                            ←
                        </button>

                    )
                }

            </div>

            <div className="navbar__right">

                <button
                    className="theme-btn"
                    onClick={toggleTheme}
                >
                    {darkMode ? "🌙" : "☀️"}
                </button>

            </div>

        </nav>
    );
};

export default Navbar;