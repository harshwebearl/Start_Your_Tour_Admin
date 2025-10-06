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
const Editproperties = () => {

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
        console.log(data.data);
    };

    useEffect(() => {
        Dest();
    }, []);


    const [selectedDestinationId, setSelectedDestinationId] = useState("");

    const handleSelect = (event) => {
        const selectedId = event.target.value; // Get the selected option's ID
        setSelectedDestinationId(selectedId); // Update the state with the selected ID
    };
    console.log(selectedDestinationId);



    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("sytAdmin");
            const responseDelete = await axios.delete(
                `${BASE_URL}property_policies/?_id=${id}`,
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
        console.log(data);
    }



    const txt = (e) => {
        const { name, value } = e.target;
        setSclt({ ...slct, [name]: value })
    }
    // console.log(slct);

    const [category, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [successSB, setSuccessSB] = useState(false);
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [errorSB, setErrorSB] = useState(false);
    const [formData1, setFormData1] = useState({
        policy_title: "",
        policy_description: "",
        infant: "",
        children: "",
        adult_and_above: "",
        infant_points: [],
        childern_points: [],
        adult_and_above_points: [],
        policy_other: [], // Empty array for storing checked feature _ids
    });

    const handleOptionChange = (event) => {
        const { name, value, files } = event.target;
        if (name === "infant_points" || name === "childern_points" || name === "adult_and_above_points" || name === "policy_other" ) {
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
        console.log(formData1);
    };


    // console.log(formData);
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


    // console.log(formData);
    const { id } = useParams();


    const [Yay, setYay] = useState("")

    const Call = async () => {
        const token = localStorage.getItem("sytAdmin");
        const res = await fetch(`${BASE_URL}property_policies/byhotelid/?hotel_id=${id}`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        setYay(data.data);
        setFormData1({
            policy_title: data.data?.[0]?.policy_title,
            policy_description: data.data?.[0]?.policy_description,
            infant: data.data?.[0]?.infant,
            children: data.data?.[0]?.children,
            adult_and_above: data.data?.[0]?.adult_and_above,
            infant_points: data.data?.[0]?.infant_points,
            childern_points: data.data?.[0]?.childern_points,
            adult_and_above_points: data.data?.[0]?.adult_and_above_points,
            policy_other: data.data?.[0]?.policy_other,
        })
        console.log(data.data);
    };

    useEffect(() => {
        Call();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("sytAdmin");


            console.log("abc");
            const response = await axios.put(
                `${BASE_URL}property_policies/?_id=${id}`,
                {
                    policy_title: formData1.policy_title,
                    policy_description: formData1.policy_description,
                    infant: formData1.infant,
                    children: formData1.children,
                    adult_and_above: formData1.adult_and_above,
                    infant_points: formData1.infant_points,
                    childern_points: formData1.childern_points,
                    adult_and_above_points: formData1.adult_and_above_points,
                    policy_other: formData1.policy_other,
                },
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response);
            if (response.data.status === "OK") {
                openSuccessSB();
                navigate(-1);
            }
        } catch (error) {
            console.log(error);
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
                        Add Properties and policies
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <form
                        // component="form"

                        style={style1}
                        role="form"
                        className="form_container demo2"
                    >

                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Enter Policy Title</label>
                            <MDInput
                                type="text"
                                name="policy_title"
                                value={formData1.policy_title}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Enter Policy Description</label>
                            <div>
                                <MDInput
                                    type="textarea"
                                    name="policy_description"
                                    value={formData1.policy_description}
                                    onChange={handleOptionChange}
                                    fullWidth
                                    style={{ marginBottom: "20px" }}
                                />
                            </div>
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Infant Title</label>
                            <MDInput
                                type="text"
                                name="infant"
                                value={formData1.infant}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Infant Point</label>
                            <MDInput
                                type="text"
                                name="infant_points"
                                value={formData1.infant_points}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Children Title</label>
                            <MDInput
                                type="text"
                                name="children"
                                value={formData1.children}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Children Point</label>
                            <MDInput
                                type="text"
                                name="childern_points"
                                value={formData1.childern_points}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Adult Title</label>
                            <MDInput
                                type="text"
                                name="adult_and_above"
                                value={formData1.adult_and_above}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Adult Point</label>
                            <MDInput
                                type="text"
                                name="adult_and_above_points"
                                value={formData1.adult_and_above_points}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Other</label>
                            <div>
                                <MDInput
                                    type="textarea"
                                    name="policy_other"
                                    value={formData1.policy_other}
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
                                // component={Link}
                                // to="/dashboard"
                                // type="submit"
                                onClick={handleSubmit}
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


export default Editproperties;
