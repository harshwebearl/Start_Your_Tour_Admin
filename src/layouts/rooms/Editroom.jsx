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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,

} from "@fortawesome/free-solid-svg-icons";

// import
const Editroom = () => {

    const { id } = useParams();

    const [formData1, setFormData1] = useState({
        room_title: "",
        price: "",
        photos: [],
        room_highlights: [], // Empty array for storing checked feature _ids
        total_rooms: "",
        status: "",
        start_date: "",
        end_date: ""
    });

    const [editroom, setEditroom] = useState("")

    const Call = async () => {
        const token = localStorage.getItem("sytAdmin")
        const res = await fetch(`${BASE_URL}room_syt/byid?_id=${id}`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        setEditroom(data.data);
        setFormData1({
            room_title: data.data?.[0]?.room_title,
            price: data.data?.[0]?.price,
            // photos: data.data.photos,
            room_highlights: data.data?.[0]?.room_highlights,
            total_rooms: data.data?.[0]?.total_rooms,
            start_date: data.data?.[0]?.start_date.slice(0, 10),
            end_date: data.data?.[0]?.end_date.slice(0, 10),
            status: data.data?.[0]?.status,
        });



        const images = data.data?.[0]?.photos.map(url => ({ url }));
        setRoomImages(images);
    };

    useEffect(() => {
        Call();
    }, [id]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("sytAdmin");
            const responseDelete = await axios.delete(
                `${BASE_URL}room_syt?_id=${id}`,
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

    const txt = (e) => {
        const { name, value } = e.target;
        setSclt({ ...slct, [name]: value })
    }
    // console.log(slct);

    const [isLoading, setIsLoading] = useState(true);
    const [successSB, setSuccessSB] = useState(false);
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [errorSB, setErrorSB] = useState(false);

    const handleOptionChange = (event) => {
        const { name, value, files } = event.target;
        if (name === "room_highlights") {
            const highlightsArray = value.split(",");
            setFormData1((prevFormData) => ({
                ...prevFormData,
                [name]: highlightsArray,
            }));
        } else if (name === "photos") {
            setFormData1((prevFormData) => ({
                ...prevFormData,
                [name]: event.target.files,
            }));
        } else {
            setFormData1((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };


    const [roomImages, setRoomImages] = useState([]);
    const [roomImages2, setRoomImages2] = useState([]);
    const handleRoomImageChange = (event) => {
        const files = Array.from(event.target.files);
        const fileObjects = files.map(file => ({ file, url: URL.createObjectURL(file) }));
        if (roomImages2) {
            setRoomImages2(prevImages => [...prevImages, ...fileObjects]);
        }
        else {
            setRoomImages2(fileObjects);
        }
    };



    const handleRemoveRoomImage = (indexToRemove) => {
        setRoomImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveRoomImage2 = (indexToRemove) => {
        setRoomImages2(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };


    // console.log(formData);
    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successfull Updated"
            content="Room Is Successfully Updated."
            dateTime="1 sec"
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );
    // const { id } = useParams();
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

    const { hotel_id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (
            !formData1?.room_title ||
            !formData1?.price ||
            formData1?.room_highlights?.length === 0 ||
            !formData1?.total_rooms ||
            !formData1?.status ||
            !formData1?.start_date ||
            !formData1?.end_date
        ) {
            setErrorMessage("Please Fill All Fields")
            openErrorSB();
            return;
        }

        try {
            const token = localStorage.getItem("sytAdmin");
            const formData = new FormData();
            formData.append("room_title", formData1.room_title);
            formData.append("price", Number(formData1.price));

            formData.append("hotel_id", hotel_id);

            formData1.room_highlights.forEach((highlight) => {
                formData.append("room_highlights", highlight);
            });
            formData.append("total_rooms", formData1.total_rooms)
            formData.append("status", formData1.status)
            formData.append("start_date", formData1.start_date)
            formData.append("end_date", formData1.end_date)
            roomImages2.forEach(({ file }) => {
                formData.append("photos", file);
            });

            let links = roomImages.map(image => image.url);


            links.forEach(image => {
                formData.append("previmages", image);
            });

            const response = await axios.put(
                `${BASE_URL}room_syt?_id=${id}`,
                formData,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            if (response.data.status === "OK") {
                openSuccessSB();
                setLoading(false)
                setTimeout(() => {
                    navigate(-1);
                }, 1000);
            } else {
                setErrorMessage(response?.data?.message)
                openErrorSB();
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            setErrorMessage("There Is A Problem In Updating Room")
            openErrorSB();
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
                        Edit room
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
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Room Title</label>
                            <MDInput
                                type="text"
                                name="room_title"
                                value={formData1.room_title}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>

                        <MDBox >
                            <label htmlFor="price" className="mb-1 " style={{ fontWeight: "500" }}>Room Price</label>
                            <MDInput
                                type="price"
                                name="price"
                                value={formData1.price}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox>
                            <label htmlFor="file" className="mb-1 " style={{ fontWeight: "500" }}>Room Image</label>
                            <MDInput
                                type="file"
                                label=""
                                name="photos"
                                // value={formData.photo}
                                inputProps={{
                                    multiple: true,
                                }}
                                onChange={handleRoomImageChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                            <div className="room-model-image-section">
                                <div className="room-model-image-container" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {roomImages && roomImages.map(({ url }, index) => (
                                        <div key={index} className="room-model-image-item">
                                            <img style={{ height: "70px", width: "70px" }} src={url} alt={`Room pic ${index + 1}`} className="room-model-image" />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="trash-icon"
                                                onClick={() => handleRemoveRoomImage(index)}
                                            />
                                        </div>
                                    ))}
                                    {roomImages2 && roomImages2.map(({ url }, index) => (
                                        <div key={index} className="room-model-image-item">
                                            <img style={{ height: "70px", width: "70px" }} src={url} alt={`Room pic ${index + 1}`} className="room-model-image" />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="trash-icon"
                                                onClick={() => handleRemoveRoomImage2(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </MDBox>
                        <MDBox mb={2}>
                            <label htmlFor="text" className="mb-1 " style={{ fontWeight: "500" }}>Room Highlights</label>
                            <div>
                                <MDInput
                                    type="textarea"
                                    name="room_highlights"
                                    value={formData1.room_highlights}
                                    onChange={handleOptionChange}
                                    fullWidth
                                    style={{ marginBottom: "20px" }}
                                />
                            </div>
                        </MDBox>
                        <MDBox >
                            <label htmlFor="price" className="mb-1 " style={{ fontWeight: "500" }}>Total Rooms</label>
                            <MDInput
                                type="number"
                                name="total_rooms"
                                value={formData1.total_rooms}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="price" className="mb-1 " style={{ fontWeight: "500" }}>Start Date</label>
                            <MDInput
                                type="date"
                                name="start_date"
                                value={formData1.start_date}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="price" className="mb-1 " style={{ fontWeight: "500" }}>End Date</label>
                            <MDInput
                                type="date"
                                name="end_date"
                                min={formData1.start_date}
                                value={formData1.end_date}
                                onChange={handleOptionChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox >
                            <label htmlFor="price" className="mb-1 " style={{ fontWeight: "500", marginRight: "20px" }}>Room Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData1.status}
                                label="Age"
                                onChange={handleOptionChange}
                                style={{ border: "2px solid black", color: "black" }}
                            >
                                <option value="available" style={{ color: "black", fontSize: "12px" }}>Available</option>
                                <option value="not-available" style={{ color: "black", fontSize: "12px" }}>Not Available</option>
                            </select>
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


export default Editroom;
