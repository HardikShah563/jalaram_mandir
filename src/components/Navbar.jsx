import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// importing stylesheet
import "../style/navbar.css";
import { Session } from "../config/utils";

export default function Navbar() {
    // creating variable responsible for web navigation
    const navigate = useNavigate();

    const { state, dispatch: ctxDispatch } = useContext(Session);
    const { userInfo } = state;

    const [login, setLogin] = useState(false);
    const [showNav, setShowNav] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setLogin(true);
        }
    }, []);

    function toggleNavbar() {
        setShowNav(prevState => !prevState);
    }

    function logoutHandler() {
        // perform logout operation
        ctxDispatch({
            type: "USER_SIGNOUT"
        });
        navigate("/");
        window.location.reload();
    }

    return (
        <>
            <nav className="nav">
                <div className="nav-items">
                    <div className="nav-logo cur" onClick={() => { navigate("/"); setShowNav(false); }}>
                        <h1>Jalaram Bhakt Mandal (Bhandup)</h1>
                    </div>

                    <div className={`nav-links ${showNav && "active"}`}>
                        {window.location.pathname.slice(0, 10) != "/dashboard" && (
                            <div className="dropdown">
                                <li>
                                    <div className="link-name cur">About</div>
                                </li>
                                <div className="dropdown-content">
                                    <div onClick={() => { navigate("/about/jalaram-bappa"); setShowNav(false); }}>Jalaram Bappa History</div>
                                    <div onClick={() => { navigate("/about/mandal"); setShowNav(false); }}>Jalaram Bhakt Mandal Bhandup</div>
                                </div>
                            </div>
                        )}

                        {window.location.pathname.slice(0, 10) != "/dashboard" && (
                            <div className="dropdown">
                                <li>
                                    <div className="link-name cur" onClick={() => { navigate("/events"); setShowNav(false); }}>Events</div>
                                </li>
                                <div className="dropdown-content">
                                </div>
                            </div>
                        )}

                        {window.location.pathname.slice(0, 10) != "/dashboard" && (
                            <div className="dropdown">
                                <li>
                                    <div className="link-name cur" onClick={() => { navigate("/donation"); setShowNav(false); }}>Donation</div>
                                </li>
                                <div className="dropdown-content">
                                    {/* drop down items */}
                                </div>
                            </div>
                        )}

                        {login ?
                            (
                                <>
                                    <div className="dropdown">
                                        <li>
                                            <div className="link-name cur" onClick={() => { navigate("/dashboard"); setShowNav(false); }}>Dashboard</div>
                                        </li>
                                    </div>

                                    <b>|</b>

                                    <div className="dropdown">
                                        <li>
                                            <div className="link-name cur" onClick={() => { logoutHandler(); setShowNav(false); }}>Log Out</div>
                                        </li>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="dropdown">
                                        <li>
                                            <div className="link-name cur" onClick={() => { navigate("/login"); setShowNav(false); }}>Login</div>
                                        </li>
                                    </div>

                                </>
                            )
                        }
                    </div>
                </div>

                <div className="nav-lines" onClick={toggleNavbar}>
                    <div className="Bar"></div>
                    <div className="Bar"></div>
                    <div className="Bar"></div>
                </div>
            </nav>
        </>
    );
};
