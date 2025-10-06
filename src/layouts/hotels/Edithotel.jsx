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
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDSnackbar from "components/MDSnackbar";
import checkbox from "assets/theme/components/form/checkbox";
import { BASE_URL } from "BASE_URL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {

    faTrash,

} from "@fortawesome/free-solid-svg-icons";

// import
const Edithotel = () => {

    // post api 
    // const {id} = useParams();

    const [insertPlace, setInsertPLace] = useState({
        name: "",
        destination_id: "",
        photo: "",
        description: "",
    });

    const AddPlace = (e) => {
        const { name, value } = e.target;
        setInsertPLace({ ...insertPlace, [name]: value })
    };

    const Place_to_visit = async (e) => {
        e.preventDefault();
        const { name, destination_id, photo, description } = insertPlace;

        const res = await fetch(`${BASE_URL}placetovisit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                destination_id,
                description,
                photo,
                "role": "agency"
            })
        })
        const data = await res.json();
    }

    // get api for check box start

    const [CheckBox, setCheckBox] = useState([])

    const Call = async (ele) => {
        const token = localStorage.getItem("sytAdmin");
        const res = await fetch(`${BASE_URL}highlight`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        setCheckBox(data.data);
    };

    useEffect(() => {
        Call();
    }, []);


    // get api for check box end

    const [category, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [successSB, setSuccessSB] = useState(false);
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [errorSB, setErrorSB] = useState(false);
    const [status, setStatus] = useState();
    const [formData, setFormData] = useState({
        hotel_name: "",
        hotel_address: "",
        hotel_type: "",
        city: "",
        photo: "",
        state: "",
        hotel_description: "",
        hotel_photo: [],
    });

    const [highlights, setHighlights] = useState([])
    // const formData1 = new FormData();
    // formData1.append("hotel_name", formData.hotel_name);
    // formData1.append("hotel_address", formData.hotel_address);
    // formData1.append("hotel_description", formData.hotel_description);
    // formData1.append("city", formData.city);
    // formData1.append("state", formData.state);
    // formData1.append("other", formData.other);
    // //   formData1.append("hotel_photo", formData.hotel_photo);
    // Array.from(formData.hotel_photo).forEach((item) => {
    //     formData1.append("hotel_photo", item);
    // });
    // formData1.append("hotel_type", formData.hotel_type);
    // //   formData1.append("photo", formData.photo);
    // formData.hotel_highlights.forEach((id) => {
    //     formData1.append("hotel_highlights", id);
    // });


    // get api 
    const getDetail = async () => {
        const token = localStorage.getItem("sytAdmin")

        const res = await fetch(`${BASE_URL}hotel_syt/details?_id=${id}`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        setStatus(data.data[0].status);

        let str = data.data?.[0]?.other.join(',');

        setFormData(
            {
                hotel_name: data.data?.[0]?.hotel_name,
                hotel_address: data.data?.[0]?.hotel_address,
                hotel_type: data.data?.[0]?.hotel_type,
                city: data.data?.[0]?.city,
                state: data.data?.[0]?.state,
                hotel_description: data.data?.[0]?.hotel_description,
                other: str,
                status: data.data?.[0]?.status || ""
            }
        )
        setHighlights(data.data?.[0]?.Highlights)

        const images = data.data?.[0]?.hotel_photo.map(url => ({ url }));
        setImages(images);
        // setDestination(data.data);
    };
    useEffect(() => {
        // Dest();
        getDetail();
    }, []);

    const handleOptionChange = (event) => {
        const { name, value, files } = event.target;
        const selectedValue = event.target.value;
        if (name === "hotel_photo") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: event.target.files,
            }));
        } else if (name == "destination_id") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                destination_id: selectedValue,
            }));
        }
        else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));

        }
    };

    const handleHighlightChange = (event) => {
        const { checked, id } = event.target;
        if (checked) {
            setHighlights(prev => [...prev, CheckBox.find(x => x._id === id)]);
        } else {
            setHighlights(prev => prev.filter(highlight => highlight._id !== id));
        }
    };

    const [images, setImages] = useState([]);
    const [images2, setImages2] = useState([]);
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const fileObjects = files.map(file => ({ file, url: URL.createObjectURL(file) }));
        setImages2(prevImages => [...prevImages, ...fileObjects]);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveImage2 = (indexToRemove) => {
        setImages2(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

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
    const { id } = useParams();
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


    // for edit put api start
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData1 = new FormData();
        let links = images.map(image => image.url);
        formData1.append("hotel_name", formData.hotel_name);
        formData1.append("hotel_address", formData.hotel_address);
        formData1.append("hotel_description", formData.hotel_description);
        formData1.append("city", formData.city);
        formData1.append("state", formData.state);
        formData1.append('status', status)

        let otherarray = formData.other.split(',');

        formData1.append("other", formData.other);

        otherarray.forEach((id) => {
            formData1.append("other", id);
        });
        //   formData1.append("hotel_photo", formData.hotel_photo);
        formData1.append("hotel_type", formData.hotel_type);
        //   formData1.append("photo", formData.photo);
        highlights.forEach((id) => {
            formData1.append("hotel_highlights", id._id);
        });

        links.forEach((image, index) => {
            formData1.append("previmages", image)
        });

        images2.forEach(({ file }, index) => {
            formData1.append("hotel_photo", file);
        });
        try {
            const token = localStorage.getItem("sytAdmin");
            const response = await axios.put(
                `${BASE_URL}hotel_syt?_id=${id}`,
                formData1,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            const response1 = await axios.put(
                `${BASE_URL}hotel_syt/status?_id=${id}`,
                { status: status },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (response.data.status === "OK" && response1.data.status === "OK") {
                openSuccessSB();
                navigate(-1);

            }
            else {
                openErrorSB();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // for edit put api end

    const style1 = {
        backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
    };


    // Delete api start
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("sytAdmin");
            const responseDelete = await axios.delete(
                `${BASE_URL}hotel_syt?_id=${id}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (responseDelete.data.status === "OK") {
                navigate("/hotel");
            }
        } catch (error) {
            console.log(error);
        }
    };
    //   Delete api close
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox textAlign="center" mb={4}>
                    <MDTypography variant="h4" fontWeight="bold">
                        Edit hotel
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
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Enter Hotel Name</label>
                            <MDInput
                                type="text"
                                name="hotel_name"
                                onChange={handleOptionChange}
                                value={formData.hotel_name}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Enter Hotel Address</label>
                            <MDInput
                                type="text"
                                name="hotel_address"
                                onChange={handleOptionChange}
                                value={formData.hotel_address}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Enter Hotel City</label>
                            <MDInput
                                type="text"
                                name="city"
                                onChange={handleOptionChange}
                                value={formData.city}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Enter Hotel State</label>
                            <MDInput
                                type="text"
                                name="state"
                                onChange={handleOptionChange}
                                value={formData.state}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox className="my-2">
                            <label htmlFor="file" className="mb-1 " style={{ fontWeight: "500" }}>Upload Image</label>
                            <MDInput
                                type="file"
                                name="hotel_photo"
                                inputProps={{
                                    multiple: true,
                                }}
                                onChange={handleImageChange}
                                // value={formData.photo}
                                mb={2}
                                style={{ marginLeft: "20px" }}
                            />

                            <div className="hotel-pictures-section" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {console.log(images)}
                                {console.log(images2)}
                                {images && images.map((img, index) => (
                                    <div key={index} className="hotel-pictures-item">
                                        <img style={{ height: "70px", width: "70px" }} src={img.url} alt={`Hotel pic ${index + 1}`} className="hotel-image" />
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="trash-icon"
                                            onClick={() => handleRemoveImage(index)}
                                        />
                                    </div>
                                ))}
                                {images2 && images2.map(({ url }, index) => (
                                    <div key={index} className="hotel-pictures-item">
                                        <img style={{ height: "70px", width: "70px" }} src={url} alt={`Hotel pic ${index + 1}`} className="hotel-image" />
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="trash-icon"
                                            onClick={() => handleRemoveImage2(index)}
                                        />
                                    </div>
                                ))}

                            </div>
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Enter Hotel Type</label>
                            {/* <MDInput
                                type="text"
                                name="hotel_type"
                                onChange={handleOptionChange}
                                value={formData.hotel_type}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            /> */}
                            <select onChange={handleOptionChange} value={formData.hotel_type} name="hotel_type" className="mb-3" style={{ color: "#7b809a", background: "transparent", border: "1px solid #dadbd", width: "100%", height: "40px", padding: "0px 15px", borderRadius: "5px", fontSize: "16px" }}>
                                <option value="select" selected disabled >Hotel Type</option>
                                <option style={{ color: "#495057" }} value="1">1 star</option>
                                <option style={{ color: "#495057" }} value="2">2 star</option>
                                <option style={{ color: "#495057" }} value="3">3 star</option>
                                <option style={{ color: "#495057" }} value="4">4 star</option>
                                <option style={{ color: "#495057" }} value="5">5 star</option>
                            </select>
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Edit Hotel Status</label>
                            {/* <MDInput
                                type="text"
                                name="hotel_type"
                                onChange={handleOptionChange}
                                value={formData.hotel_type}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            /> */}
                            <select onChange={(e) => setStatus(e.target.value)} value={status} name="hotel_type" className="mb-3" style={{ color: "#7b809a", background: "transparent", border: "1px solid #dadbd", width: "100%", height: "40px", padding: "0px 15px", borderRadius: "5px", fontSize: "16px" }}>
                                <option value="select" selected disabled >Hotel Status</option>
                                <option style={{ color: "#495057" }} value="active">Active</option>
                                <option style={{ color: "#495057" }} value="deactive">Deactive</option>
                                <option style={{ color: "#495057" }} value="pending">Pending</option>
                                <option style={{ color: "#495057" }} value="block">Block</option>
                                {/* <option style={{ color: "#495057" }} value="5">5 star</option> */}
                            </select>
                        </MDBox>
                        <MDBox mb={2}>

                            {CheckBox && CheckBox?.map((feature) => {
                                return (
                                    <>
                                        <MDBox key={feature._id} display="flex" alignItems="center">
                                            <input
                                                type="checkbox"
                                                id={feature._id}
                                                name={feature._id} // Use feature._id as the name
                                                checked={highlights.some(highlight => highlight._id === feature._id)}// Check if feature._id is present in the membership_feature_id array
                                                onChange={handleHighlightChange}
                                                style={{ marginRight: "10px" }}
                                            />
                                            <label
                                                style={{ color: darkMode ? "#ffffffcc" : "" }}
                                                htmlFor={feature._id}
                                            >
                                                {feature.title}
                                            </label>
                                        </MDBox>
                                    </>
                                )
                            })}
                        </MDBox>
                        <MDBox mb={2}>
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Enter Hotel Description</label>
                            <div>
                                <textarea className="px-1" name="hotel_description" value={formData.hotel_description} onChange={handleOptionChange} id="" style={{ width: "100%", height: "150px" }} ></textarea>
                            </div>
                        </MDBox>
                        <MDBox >
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Other</label>
                            <MDInput
                                type="text"
                                name="name"
                                fullWidth
                                style={{ marginBottom: "20px" }}
                                value={formData.other}
                            />
                        </MDBox>
                        <MDBox className="d-flex" mt={4} mb={1}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                onClick={handleSubmit}
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


export default Edithotel;
