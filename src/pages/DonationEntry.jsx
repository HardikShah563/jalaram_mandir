// importing from react
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// importing stylesheet
import "../style/form.css";
// importing icons
import { MdArrowForwardIos } from "react-icons/md";
// importing from utils
import { delay } from "../config/utils";
import { Session } from "../config/utils";
import SetEvent from "../components/SetEvent";

export default function DonationEntry() {
    const navigate = useNavigate();

    const { state, dispatch: ctxDispatch } = useContext(Session);
    const { userInfo, currentEvent } = state;

    const [setEventView, setSetEventView] = useState(false);

    function toggleSetEvent() {
        setSetEventView(prevState => !prevState);
    }

    console.log(currentEvent);

    useEffect(() => {
        const fetchdata = async () => {
            const { data } = await axios.get('http://localhost:5000/api/donation/max-receipt-no');
            setFormData(prevState => {
                return {
                    ...prevState, receiptNo: (data.receiptNo + 1),
                }
            });
        }
        fetchdata();

        if (!userInfo) {
            navigate('/login');
        }
        setSetEventView(false);
    }, []);

    const [formData, setFormData] = useState({
        receiptNo: 0,
        name: "",
        address: "",
        phoneNo: "",
        email: "",
        mode: "",
        amount: null,
        panNo: "", //pan number required only if amount exceeds 5k
        eventName: currentEvent && currentEvent.name || null,
        eventDate: currentEvent && currentEvent.date || null,
    });

    const date = new Date().getDate() + "-" + new Date().getMonth() + "-" + new Date().getFullYear();

    const [msg, setMsg] = useState("");
    const [color, setColor] = useState("");

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!currentEvent) {
            setMsg("Event Name not found");
            setColor("red");
            return;
        }

        try {
            if (!formData.eventName) { }
            const { data } = await axios.post('http://localhost:5000/api/donation/new', {
                receiptNo: formData.receiptNo,
                name: formData.name,
                address: formData.address,
                phoneNo: formData.phoneNo,
                email: formData.email,
                mode: formData.mode,
                amount: formData.amount,
                panNo: formData.panNo,
                eventName: currentEvent.name
            });

            ctxDispatch({
                type: "RECIEPT_SET",
                payload: formData
            });

            if (data.message === "success") {
                await ctxDispatch({
                    type: "RECIEPT_SET",
                    payload: data.donation
                });
                localStorage.setItem(
                    "currentReciept",
                    JSON.stringify(data.donation)
                );

                setMsg("Donation Accepted");
                setColor("green");
                await delay(1000);
                setMsg("Redrirecting... wait");
                await delay(500);
                setMsg("Entry Successful!");
                navigate("/dashboard/reciepts");
            }
            else {
                setMsg(data.message);
                setColor("red");
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <div className="mg-a-a">
                <h1 className="subtitle txt-ctr">Donation Entry</h1>

                <form onSubmit={handleSubmit} className="form home-form">
                    <div className="input-box">
                        {currentEvent && currentEvent.name ? (
                            <>
                                <h3>Event Name: {currentEvent.name} (<span className="cur" onClick={() => { toggleSetEvent() }}><u id="text-red">Change Event</u></span>)</h3>
                            </>
                        ) : (
                            <>
                                <h3>Event Name: <span id="text-red">Doesn't Exist (<span className="cur" onClick={() => { toggleSetEvent() }}><u>Set Event</u></span>)</span></h3>
                            </>
                        )}
                    </div>

                    <div className="input-box">
                        <h3>Event Date: {currentEvent && currentEvent.date ? currentEvent.date : "Doesn't Exists"}</h3>
                    </div>

                    <br />

                    <div className="input-box">
                        <h3>Receipt Number: {formData.receiptNo}</h3>
                    </div>

                    <br />

                    {msg &&
                        (
                            <div className="input-box">
                                <div className="input msg-box" id={color}>
                                    {msg}
                                </div>
                            </div>
                        )
                    }

                    <div className="input-flex flex">
                        <div className="input-box">
                            <div className="input-title margin-top-15 bobby">
                                Name
                            </div>
                            <input
                                className="input margin-block-5"
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                required
                            />
                        </div>

                        <div className="input-box">
                            <div className="input-title margin-top-15 bobby">
                                Address
                            </div>
                            <input
                                className="input margin-block-5"
                                type="text"
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-flex flex">
                        <div className="input-box">
                            <div className="input-title margin-top-15 bobby">
                                Phone Number
                            </div>
                            <input
                                className="input margin-block-5"
                                type="number"
                                name="phoneNo"
                                id="phoneNo"
                                value={formData.phoneNo}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                required
                            />
                        </div>

                        <div className="input-box">
                            <div className="input-title margin-top-15 bobby">
                                E-mail
                            </div>
                            <input
                                className="input margin-block-5"
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                            />
                        </div>
                    </div>

                    <div className="input-flex">
                        <div className="input-box">
                            <div className="input-title margin-top-15 bobby">
                                Mode of payment
                            </div>
                            <select
                                className="input margin-block-5"
                                name="mode"
                                id="mode"
                                value={formData.mode}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Cash/Online --</option>
                                <option value="cash">Cash</option>
                                <option value="online">Online</option>
                            </select>
                        </div>

                        <div className="input-box">
                            <div className="input-title margin-top-15 bobby">
                                Amount
                            </div>
                            <input
                                className="input margin-block-5"
                                type="number"
                                name="amount"
                                id="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="₹ ---"
                            />
                        </div>
                    </div>

                    <div className="input-flex">
                        {formData.amount >= 2000 && (
                            <div className="input-box">
                                <div className="input-title margin-top-15 bobby">
                                    PAN Number
                                </div>
                                <input
                                    className="input margin-block-5"
                                    type="text"
                                    name="panNo"
                                    id="panNo"
                                    value={formData.panNo}
                                    onChange={handleChange}
                                    placeholder="PAN Number"
                                />
                            </div>
                        )}
                    </div>

                    <div className="input-box">
                        <button
                            className="form-btn gap-10 cur"
                            type="submit"
                        >
                            Submit <MdArrowForwardIos className="left-arrow" />
                        </button>
                    </div>
                </form>
            </div>

            {setEventView && (
                <SetEvent
                    toggleSetEvent={toggleSetEvent}
                />
            )}
        </>
    );
};
