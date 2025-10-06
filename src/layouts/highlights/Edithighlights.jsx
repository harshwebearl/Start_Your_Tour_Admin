import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";

// import
const ManageCategory = () => {
    const [formData, setFormData] = useState({
        title: "",
        icon: null,
    });
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const { id } = useParams();
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

    // Delete api start
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("sytAdmin");
            const responseDelete = await axios.delete(
                `${BASE_URL}highlight?_id=${id}`,
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
            console.log(error);
        }
    };



    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const handleChange = (e) => {
        if (e.target.name === "icon") {
            setFormData((prevData) => ({
                ...prevData,
                [e.target.name]: e.target.files[0],
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [e.target.name]: e.target.value,
            }));
        }
    };
    const [previewImage, setPreviewImage] = useState("https://dummyimage.com/200x200/cccccc/ffffff");

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            icon: selectedImage,
        }));

        if (selectedImage) {
            // Generate preview image URL
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(selectedImage);
        } else {
            // If no image is selected, reset the preview image
            setPreviewImage("https://dummyimage.com/200x200/cccccc/ffffff");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) {
            // If category or image is not filled, show the success snackbar and return
            openErrorSB();
            return;
        }
        try {
            const token = localStorage.getItem("sytAdmin");
            let requestData;
            if (formData.title && formData.icon) {
                const formDataToSend = new FormData();
                formDataToSend.append("title", formData.title);
                formDataToSend.append("icon", formData.icon);
                requestData = formDataToSend;
            } else if (formData.title) {
                requestData = {
                    title: formData.title,
                };
            } else if (formData.icon) {
                const formDataToSend = new FormData();
                formDataToSend.append("icon", formData.icon);
                requestData = formDataToSend;
            }
            const response = await axios.put(
                `${BASE_URL}highlight?_id=${id}`,
                requestData,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (response.data.status === "OK") {
                openSuccessSB();
                navigate(-1);
            }
        } catch (error) {
            console.log(error);
            // Handle error or show an error message
            // openErrorSB();
        }

        // Reset the form fields
        setFormData({
            title: "",
            icon: null,
        });
        // setPreviewImage("https://dummyimage.com/200x200/cccccc/ffffff");
    };
    const style1 = {
        //   // Adding media query..
        //   width: "40%",
        //   margin: "auto",
        //   padding: "2rem",
        //   borderRadius: "5%",
        backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
        //   "@media (max-width: 700px)": {
        //     width: "100%",
        //   },
    };


    const getHigh = async () => {
        const token = localStorage.getItem("sytAdmin");
        const res = await fetch(`${BASE_URL}highlight/detail?_id=${id}`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        })
        const data = await res.json();
        setFormData({
            title: data.data.title
        })

    }

    useEffect(() => {
        getHigh()
    }, [id])
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox textAlign="center" mb={4}>
                    <MDTypography variant="h4" fontWeight="bold">
                        Edit title
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <form
                        // component="form"

                        style={style1}
                        role="form"
                        className="form_container demo"
                    >
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox display="flex" alignItems="center">
                            <MDBox
                                component="img"
                                src={previewImage}
                                alt="Preview"
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    // marginRight: "10px",
                                }}
                            // mb={2}
                            />
                            {/* <img src={previewImage} alt="Preview" /> */}
                            {/* </MDBox> */}
                            <MDInput
                                type="file"
                                name="icon"
                                accept="icon/jpeg , icon/png"
                                onChange={handleImageChange}
                                mb={2}
                                style={{ marginLeft: "20px" }}
                            />

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
                                Update
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

export default ManageCategory;
