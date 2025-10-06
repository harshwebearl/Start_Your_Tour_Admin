import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { Card, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell,
    faEnvelopeOpen,
    faUser,
    faPlus,
    faTrash,
    faClose,
    faMinus,
} from "@fortawesome/free-solid-svg-icons";

// import
const EditAmenities = () => {

    const { id, hotel_id } = useParams();

    const location = useLocation();

    const [successSB, setSuccessSB] = useState(false);
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [errorSB, setErrorSB] = useState(false);
    const [formData1, setFormData1] = useState({
        title: "",
        points: [],
    });
    const [otherDetails, setOtherDetails] = useState([]);

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
        console.log(data?.data?.[0])
        setFormData1(data.data[0]);
        setOtherDetails(data?.data?.[0]?.points);
    }

    useEffect(() => {
        getAminity();
    }, [id]);

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


    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("")

    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successfull Updated"
            content="Amenities is successfully updated."
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
            content={errorMessage}
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isAnyOtherDetailEmpty = otherDetails.some((detail) => detail === "");

        if (!formData1.title || otherDetails?.length === 0 || isAnyOtherDetailEmpty) {
            setErrorMessage("Fill All Fields!")
            openErrorSB();
            return;
        }

        setLoading(true)

        try {
            const token = localStorage.getItem("sytAdmin");
            const response = await axios.put(
                `${BASE_URL}amenities_and_facilities?_id=${id}`,
                {
                    title: formData1.title,
                    hotel_id: hotel_id,
                    points: otherDetails
                },
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response?.data?.status === "OK") {
                setLoading(false)
                openSuccessSB();
                setTimeout(() => {
                    navigate(-1);
                }, 1000);
                setLoading(false)
            } else {
                setErrorMessage(response?.data?.message)
                openErrorSB();
                setLoading(false)
            }
        } catch (error) {
            setErrorMessage("There Is A Problem In Updating Amenities")
            openErrorSB();
            setLoading(false)
        }

    };

    const handleOtherDetailChange = (index, event) => {
        const newOtherDetails = [...otherDetails];
        newOtherDetails[index] = event.target.value;
        setOtherDetails(newOtherDetails);
    };

    const inputRef = useRef(null);
    const addOtherDetailField = () => {
        if (otherDetails[otherDetails.length - 1] !== '') {
            setOtherDetails([...otherDetails, '']);
        }
        else {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const removeOtherDetailField = (index) => {
        const newOtherDetails = otherDetails.filter((_, i) => i !== index);
        setOtherDetails(newOtherDetails);
        handleOptionChange({
            target: {
                name: 'room_highlights',
                value: newOtherDetails
            }
        });
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox textAlign="center" mb={4}>
                    <MDTypography variant="h4" fontWeight="bold">
                        Add Aminities
                    </MDTypography>
                </MDBox>
                <Card>
                    <MDBox py={3} px={2}>
                        <Grid container pt={4} px={3}>
                            <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                            
<div className="mb-1">
    <h6 className="mb-0" style={{ fontSize: "12px", color: "#b8b8b8" }}>Title</h6>
    <MDInput
        type="text"
        name="title"
        value={formData1.title}
        onChange={(e) => {
            if (e.target.value.length <= 120) {
                handleOptionChange(e);
            }
        }}
        fullWidth
        inputProps={{
            maxLength: 120
        }}
        error={formData1.title.length === 120}
    />
    <div style={{ 
        fontSize: "12px", 
        color: formData1.title.length === 120 ? "#d32f2f" : "#b8b8b8",
        marginTop: "4px",
        textAlign: "right"
    }}>
        {`${formData1.title.length}/120 characters`}
    </div>
</div>
                            </Grid>
                            <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0" style={{ fontSize: "12px", color: "#b8b8b8" }}>Amenities Points</h6>
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="plus-icon"
                                        onClick={addOtherDetailField}
                                    />
                                </div>
                                <div className="mt-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "5px" }}>
                                    {otherDetails.map((detail, index) => (
                                        <div key={index} className="d-flex align-items-center">
                                            <MDInput
                                                type="text"
                                                value={detail}
                                                onChange={(e) => handleOtherDetailChange(index, e)}
                                                fullWidth
                                                ref={index === otherDetails.length - 1 ? inputRef : null}
                                            />
                                            <FontAwesomeIcon
                                                icon={faMinus}
                                                className="minus-icon"
                                                onClick={() => removeOtherDetailField(index)}
                                                style={{ marginLeft: "8px", cursor: "pointer", color: "red" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                            <Grid item xs={12} md={12} xl={12} px={2} py={1}>
                                <div className="d-flex justify-content-center">
                                    <MDBox mt={4} mb={1}>
                                        <MDButton
                                            variant="gradient"
                                            color="info"
                                            fullWidth
                                            type="submit"
                                            onClick={handleSubmit}
                                            disabled={loading} // Disable button when loading
                                        >
                                            {loading ? (
                                                <>
                                                    <CircularProgress
                                                        size={24} // Size of the loader
                                                        color="inherit" // Keeps the loader color consistent with the button
                                                        style={{ marginRight: 8 }} // Optional: adds space between loader and text
                                                    />
                                                    Loading...
                                                </>
                                            ) : (
                                                "Submit"
                                            )}
                                        </MDButton>
                                    </MDBox>

                                </div>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Card>
            </MDBox>
            {renderSuccessSB}
            {renderErrorSB}
            {/* <Footer /> */}
        </DashboardLayout>
    );
};


export default EditAmenities;
