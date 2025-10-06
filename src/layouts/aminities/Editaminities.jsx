import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate, useParams, } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";

// import
const Editaminities = () => {

    const [editroom, setEditroom] = useState("")
    const [destination, setDestination] = useState([])
    const Dest = async () => {
        const token = localStorage.getItem("sytAdmin")

        const res = await fetch(`${BASE_URL}hotel_syt`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        setDestination(data.data);
    };

    useEffect(() => {
        Dest();
    }, []);


    const [selectedDestinationId, setSelectedDestinationId] = useState("");

    const handleSelect = (event) => {
        const selectedId = event.target.value; // Get the selected option's ID
        setSelectedDestinationId(selectedId); // Update the state with the selected ID
    };


    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("sytAdmin");
            const responseDelete = await axios.delete(
                `${BASE_URL}amenities_and_facilities?_id=${id}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (responseDelete.data.status === "OK") {
                navigate(-1);
            }
        } catch (error) {
        }
    };
    const Place_to_visit = async (e) => {
        e.preventDefault();
        const { title } = insertPlace;

        const res = await fetch(`${BASE_URL}amenities_and_facilities`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                "role": "agency"
            })
        })
        const data = await res.json();
    }



    const txt = (e) => {
        const { name, value } = e.target;
        setSclt({ ...slct, [name]: value })
    }

    const [category, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [successSB, setSuccessSB] = useState(false);
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [errorSB, setErrorSB] = useState(false);
    const [formData1, setFormData1] = useState({
        title: "",
        points: [], // Empty array for storing checked feature _ids
    });

    const handleOptionChange = (event) => {
        const { name, value, files } = event.target;
        if (name === "points") {
            const highlightsArray = value.split(",");
            setFormData1((prevFormData) => ({
                ...prevFormData,
                [name]: highlightsArray,
            }));
        } else if (name === "photos") {
            const fileArray = Array.from(files); // Convert FileList to an array
            setFormData1((prevFormData) => ({
                ...prevFormData,
                [name]: prevFormData[name] ? [...prevFormData[name], ...fileArray] : fileArray,
            }));
        } else {
            setFormData1((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const { id, hotel_id } = useParams();


    const getAminity = async () => {
        const token = localStorage.getItem("sytAdmin");
        const res = await fetch(`${BASE_URL}amenities_and_facilities/byid?_id=${id}`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        })
        const data = await res.json();
        setFormData1(data.data[0]);
    }

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const navigate = useNavigate();
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successfull Added"
            content="Category is successfully added."
            dateTime="1 sec"
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );
    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title="Filled Error"
            content="Please fill all fileds"
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );

    useEffect(() => {
        getAminity();
    }, [id]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("sytAdmin");
            const response = await axios.put(
                `${BASE_URL}amenities_and_facilities?_id=${id}`,
                {
                    title: formData1.title,
                    hotel_id: hotel_id,
                    points: formData1.points
                },
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.status === "OK") {
                openSuccessSB();
                navigate(-1);
            }
        } catch (error) {
        }
    };

    const style1 = {
        backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox textAlign="center" mb={4}>
                    <MDTypography variant="h4" fontWeight="bold">
                        Edit Aminities
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <form
                        // component="form"

                        style={style1}
                        role="form"
                        className="form_container demo2"
                    >
                        {/* <MDBox mb={2}>
                            <select onChange={handleSelect} name="Destinations" id="" style={{
                                border: "1px solid grey",
                                width: "100%",
                                borderRadius: "10px",
                                padding: "7px 10px",
                            }}>
                                <option selected disabled>Select Hotel</option>
                                {destination.map((ele) => {
                                    return (
                                        <option key={ele._id} value={ele._id}>{ele.hotel_name}</option>
                                    );
                                })}
                            </select>
                        </MDBox> */}

                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Title</label>
                            <MDInput
                                type="text"
                                name="title"
                                value={formData1.title}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>


                        <MDBox mb={2}>
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Highlights</label>
                            <div>
                                <MDInput
                                    type="textarea"
                                    name="points"
                                    value={formData1.points}
                                    onChange={handleOptionChange}
                                    fullWidth
                                    style={{ marginBottom: "20px" }}
                                />
                            </div>
                        </MDBox>
                        <MDBox className="d-flex" mt={4} mb={1}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                onClick={handleSubmit}
                                // component={Link}
                                // to="/dashboard"
                                type="submit"
                                className="me-2"
                            >
                                Submit
                            </MDButton>
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                onClick={handleDelete}
                            >
                                delete
                            </MDButton>
                            {renderSuccessSB}
                            {renderErrorSB}
                        </MDBox>
                    </form>
                </MDBox>
            </MDBox>
            {/* <Footer /> */}
        </DashboardLayout>
    );
};


export default Editaminities;
