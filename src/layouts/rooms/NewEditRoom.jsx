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
import { BASE_URL } from "BASE_URL";
import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControl } from "@mui/material";
import {
  faBell,
  faEnvelopeOpen,
  faUser,
  faPlus,
  faTrash,
  faClose,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

function getTomorrowDate() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Set date to tomorrow

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const rightDate = (dateString) => {
  const [year, month, day] = dateString?.split("-");
  return `${day}-${month}-${year}`;
};

// Add this sorting function
const sortDatesByMonth = (dates) => {
  return dates.sort((a, b) => {
    const dateA = new Date(a.price_start_date);
    const dateB = new Date(b.price_start_date);
    return dateA - dateB;
  });
};

// import
const NewEditroom = () => {
  const { id } = useParams();

  const location = useLocation();

  const [priceDetails, setPriceDetails] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [formData1, setFormData1] = useState({
    room_title: "",
    photos: [],
    room_highlights: [], // Empty array for storing checked feature _ids
    total_rooms: "",
    status: "available",
  });

  const [roomImages, setRoomImages] = useState([]);
  const [otherDetails, setOtherDetails] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const Call = async () => {
      const token = localStorage.getItem("sytAdmin");
      const res = await fetch(`${BASE_URL}room_syt/byid?_id=${id}`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data?.data?.[0]);

      setFormData1({
        room_title: data.data?.[0]?.room_title,
        // photos: data.data.photos,
        room_highlights: data?.data?.[0]?.room_highlights,
        total_rooms: data?.data?.[0]?.total_rooms,
        status: data.data?.[0]?.status,
      });

      // Sort price details before setting state
      const sortedPriceDetails = sortDatesByMonth(
        data.data?.[0]?.price_and_date || []
      );
      setPriceDetails(sortedPriceDetails);

      setImages(data?.data?.[0]?.photos);
      setOtherDetails(data?.data?.[0]?.room_highlights);

      const images = data.data?.[0]?.photos.map((url) => ({ url }));
      setRoomImages(images);
    };

    Call();
  }, [id]);

  const handleOptionChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "price" || name === "total_rooms") {
      // Allow only numbers, and prevent non-numeric input
      const numericValue = value.replace(/[^0-9]/g, ""); // This ensures only digits are allowed
      setFormData1((prevFormData) => ({
        ...prevFormData,
        [name]: numericValue,
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

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const navigate = useNavigate();
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull Updated"
      content="Room is successfully updated."
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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalImages = images.length + newImages.length;

    // Check for minimum 3 images
    if (totalImages < 3) {
      setErrorMessage("Please upload minimum 3 images");
      openErrorSB();
      return;
    }

    const isAnyOtherDetailEmpty = otherDetails.some((detail) => detail === "");

    if (
      !formData1.room_title ||
      isNaN(parseFloat(formData1.total_rooms)) ||
      !formData1.room_highlights ||
      otherDetails.length === 0 ||
      isAnyOtherDetailEmpty ||
      priceDetails?.length === 0
    ) {
      setErrorMessage("Please Fill All Fields");
      openErrorSB();
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("sytAdmin");

      const formData = new FormData();
      formData.append("room_title", formData1.room_title);

      images.forEach((item) => {
        formData.append("previmages", item);
      });

      priceDetails.forEach((item, index) => {
        formData.append(
          `price_and_date[${index}][adult_price]`,
          item.adult_price
        );
        formData.append(`price_and_date[${index}][extra_bad]`, item.extra_bad);
        formData.append(
          `price_and_date[${index}][price_start_date]`,
          item.price_start_date
        );
        formData.append(
          `price_and_date[${index}][price_end_date]`,
          item.price_end_date
        );
      });

      newImages.forEach((item) => {
        formData.append("photos", item.file);
      });

      formData.append("total_rooms", formData1.total_rooms);
      formData.append("status", formData1.status);

      otherDetails.forEach((highlight) => {
        formData.append("room_highlights", highlight);
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

      if (response?.data?.status === "OK") {
        setLoading(false);
        openSuccessSB();
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } else {
        setLoading(false);
        setErrorMessage(response?.data?.message);
        openErrorSB();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const fileInputRef = useRef(null);

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const fileObjects = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setNewImages((prevImages) => [...prevImages, ...fileObjects]);
  };

  const handleRemoveImage = (indexToRemove, type) => {
    if (type === "images") {
      setImages((prevImages) => [
        ...prevImages.filter((_, index) => index !== indexToRemove),
      ]);
    } else if (type === "newImages") {
      setNewImages((prevImages) => [
        ...prevImages.filter((_, index) => index !== indexToRemove),
      ]);
    }
  };

  const handleOtherDetailChange = (index, event) => {
    const newOtherDetails = [...otherDetails];
    newOtherDetails[index] = event.target.value;
    setOtherDetails(newOtherDetails);
    handleOptionChange({
      target: {
        name: "room_highlights",
        value: newOtherDetails,
      },
    });
  };

  const inputRef = useRef(null);
  const addOtherDetailField = () => {
    if (otherDetails[otherDetails.length - 1] !== "") {
      setOtherDetails([...otherDetails, ""]);
    } else {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const removeOtherDetailField = (index) => {
    const newOtherDetails = otherDetails.filter((_, i) => i !== index);
    setOtherDetails(newOtherDetails);
  };

  const [openModal, setOpenModal] = useState(false);
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [pricePerPersonForChild, setPricePerPersonForChild] = useState("");
  const [priceStartDate, setPriceStartDate] = useState("");
  const [priceEndDate, setPriceEndDate] = useState("");

  const handleAddPriceDetail = () => {
    // Validation for empty fields
    if (
      !pricePerPerson ||
      !pricePerPersonForChild ||
      !priceStartDate ||
      !priceEndDate
    ) {
      setErrorMessage("Please Fill All Fields");
      openErrorSB();
      return;
    }

    // Validation for prices (Child price cannot be more than adult, etc.)
    if (Number(pricePerPerson) < Number(pricePerPersonForChild)) {
      setErrorMessage(
        "Price of Extra bad Cannot be greater than price per night"
      );
      openErrorSB();
      return;
    }

    // Convert the date strings to Date objects
    const startDate = new Date(priceStartDate);
    const endDate = new Date(priceEndDate);

    // Check for overlapping date ranges in priceDetails
    const overlappingRanges = priceDetails?.filter((item) => {
      const priceStart = new Date(item?.price_start_date);
      const priceEnd = new Date(item.price_end_date);

      return (
        (startDate >= priceStart && startDate <= priceEnd) ||
        (endDate >= priceStart && endDate <= priceEnd)
      );
    });

    if (overlappingRanges?.length > 0) {
      setErrorMessage("Dates are mismatched with other dates");
      openErrorSB();
      return;
    }

    // If all validations pass, create the new price detail
    const newDetail = {
      adult_price: Number(pricePerPerson),
      extra_bad: Number(pricePerPersonForChild),
      price_start_date: priceStartDate,
      price_end_date: priceEndDate,
    };

    // Add new detail and sort
    setPriceDetails((prevDetails) => {
      const updatedDetails = [...(prevDetails || []), newDetail];
      return sortDatesByMonth(updatedDetails);
    });

    // Reset the form fields
    setPricePerPerson("");
    setPricePerPersonForChild("");
    setPriceStartDate("");
    setPriceEndDate("");
    setOpenModal(false);
  };

  const handleDelete = (index) => {
    const updatedDetails = [...priceDetails];
    updatedDetails.splice(index, 1);
    setPriceDetails(updatedDetails);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Update Room
          </MDTypography>
        </MDBox>
        <Card>
          <MDBox py={3} px={2}>
            <Grid container pt={4} px={3}>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div className="mb-1">
                  <h6
                    className="mb-0"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Room Title
                  </h6>
                </div>
                <MDInput
                  type="text"
                  name="room_title"
                  value={formData1.room_title}
                  onChange={handleOptionChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div className="mb-1">
                  <h6
                    className="mb-0"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Total Rooms
                  </h6>
                </div>
                <MDInput
                  type="text"
                  name="total_rooms"
                  value={formData1.total_rooms}
                  onChange={handleOptionChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div className="mb-1">
                  <h6
                    className="mb-0"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Room Title
                  </h6>
                </div>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <Select
                    id="room-status-select"
                    value={formData1?.status}
                    onChange={handleOptionChange}
                    name="status"
                    displayEmpty
                    sx={{
                      color: "#7b809a",
                      backgroundColor: "transparent", // Ensure background is transparent
                      borderRadius: "5px",
                      fontSize: "14px",
                      height: "44px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        // Light border color
                        backgroundColor: "transparent", // Removes white background
                      },

                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3f99ef", // Change border color when focused
                      },
                      "& .MuiSelect-select": {
                        backgroundColor: "transparent !important", // Ensures background stays transparent
                      },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem
                      value="available"
                      sx={{ fontSize: "14px", color: "black" }}
                    >
                      Available
                    </MenuItem>
                    <MenuItem
                      value="booked"
                      sx={{ fontSize: "14px", color: "black" }}
                    >
                      Booked
                    </MenuItem>
                    <MenuItem
                      value="sold"
                      sx={{ fontSize: "14px", color: "black" }}
                    >
                      Sold Out
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      className="mb-0"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Other Details
                    </h6>
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="plus-icon"
                      onClick={addOtherDetailField}
                    />
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "5px",
                    }}
                  >
                    {otherDetails.map((detail, index) => (
                      <div key={index} className="d-flex align-items-center">
                        <MDInput
                          type="text"
                          value={detail}
                          onChange={(e) => handleOtherDetailChange(index, e)}
                          fullWidth
                          ref={
                            index === otherDetails.length - 1 ? inputRef : null
                          }
                        />
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="minus-icon"
                          onClick={() => removeOtherDetailField(index)}
                          style={{
                            marginLeft: "8px",
                            cursor: "pointer",
                            color: "red",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      className="mb-0"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Room Photos
                    </h6>
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="plus-icon"
                      onClick={handleAddImageClick}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                      multiple
                      accept="image/jpeg , image/png"
                    />
                  </div>
                  <div
                    className=""
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "15px",
                    }}
                  >
                    {images &&
                      images.map((url, index) => (
                        <div
                          key={`image-${index}`}
                          className="hotel-pictures-item"
                          style={{ position: "relative" }}
                        >
                          <img
                            src={url}
                            alt={`Hotel pic ${index + 1}`}
                            className="hotel-image"
                            style={{
                              height: "70px",
                              objectFit: "cover",
                              width: "100%",
                              borderRadius: "5px",
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="trash-icon"
                            style={{
                              position: "absolute",
                              right: "5px",
                              top: "5px",
                              color: "red",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleRemoveImage(index, "images")}
                          />
                        </div>
                      ))}

                    {newImages &&
                      newImages.map(({ url }, index) => (
                        <div
                          key={`newImage-${index}`}
                          className="hotel-pictures-item"
                          style={{ position: "relative" }}
                        >
                          <img
                            src={url}
                            alt={`Hotel pic ${index + 1}`}
                            className="hotel-image"
                            style={{
                              height: "70px",
                              objectFit: "cover",
                              width: "100%",
                              borderRadius: "5px",
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="trash-icon"
                            style={{
                              position: "absolute",
                              right: "5px",
                              top: "5px",
                              color: "red",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleRemoveImage(index, "newImages")
                            }
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={12}>
                {/* Price Details */}
                <MDBox mb={4}>
                  <MDBox
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography variant="h6">Price Details</Typography>
                    <IconButton
                      onClick={() => setOpenModal(true)}
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                  </MDBox>

                  <div className="mb-4 mx-2">
                    <div
                      className="margin-pricing-agency"
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div
                        className="margin-pricing-agency-header"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                          gap: "10px",
                          textAlign: "center",
                          padding: "8px 0",
                          borderRadius: "4px",
                        }}
                      >
                        <h5
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#044711",
                            marginBottom: "0",
                          }}
                        >
                          Price per night
                        </h5>
                        <h5
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#044711",
                            marginBottom: "0",
                          }}
                        >
                          Extra bad
                        </h5>
                        <h5
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#044711",
                            marginBottom: "0",
                          }}
                        >
                          Start Date
                        </h5>
                        <h5
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#044711",
                            marginBottom: "0",
                          }}
                        >
                          End Date
                        </h5>
                        <h5
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#044711",
                            marginBottom: "0",
                          }}
                        >
                          Actions
                        </h5>
                      </div>
                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #ddd",
                          margin: "8px 0",
                        }}
                      />
                      {priceDetails &&
                        priceDetails?.map((updatedItem, index) => {
                          return (
                            <div
                              className="margin-pricing-agency-body"
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                                gap: "10px",
                                textAlign: "center",
                                padding: "8px 0",
                                fontSize:"15px",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "500",
                                  marginBottom: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {updatedItem?.adult_price}
                              </p>
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "500",
                                  marginBottom: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {updatedItem?.extra_bad}
                              </p>
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "500",
                                  marginBottom: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center", 
                                }}
                              >
                                {rightDate(
                                  updatedItem?.price_start_date?.slice(0, 10)
                                )}
                              </p>
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "500",
                                  marginBottom: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {rightDate(
                                  updatedItem?.price_end_date?.slice(0, 10)
                                )}
                              </p>
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "500",
                                  marginBottom: "0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <IconButton
                                  onClick={() => handleDelete(index)}
                                  color="secondary"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </MDBox>

                <Modal
                  open={openModal}
                  onClose={() => setOpenModal(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay background
                  }}
                >
                  <MDBox
                    p={4}
                    bgcolor="white"
                    borderRadius={2}
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Add shadow for a clean look
                    }}
                  >
                    <Typography variant="h6" mb={3} align="center">
                      Add Price Details
                    </Typography>

                    {/* Input fields */}
                    <MDBox mt={2}>
  <TextField
    label="Price Per night"
    type="number"
    fullWidth
    value={pricePerPerson}
    onChange={(e) => setPricePerPerson(e.target.value)}
    sx={{
      mb: 2,
      // Remove arrows in Webkit (Chrome, Safari, Edge)
      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
      },
      // Remove arrows in Firefox
      '& input[type=number]': {
        MozAppearance: 'textfield',
      },
    }}
  />
</MDBox>

<MDBox mt={2}>
  <TextField
    label="Price Of Extra Bed"
    type="number"
    fullWidth
    value={pricePerPersonForChild}
    onChange={(e) => setPricePerPersonForChild(e.target.value)}
    sx={{
      mb: 2,
      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
      },
      '& input[type=number]': {
        MozAppearance: 'textfield',
      },
    }}
  />
</MDBox>


                    {/* Date inputs */}
                    <MDBox mt={2}>
                      <TextField
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={priceStartDate}
                        onChange={(e) => setPriceStartDate(e.target.value)}
                        sx={{ mb: 2 }}
                        inputProps={{
                          min: getTomorrowDate(),
                        }}
                        onKeyDown={(e) => e.preventDefault()} // 🚫 Disable manual typing
                      />
                    </MDBox>

                    <MDBox mt={2}>
                      <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={priceEndDate}
                        onChange={(e) => setPriceEndDate(e.target.value)}
                        sx={{ mb: 3 }}
                        inputProps={{
                          min: priceStartDate || getTomorrowDate(),
                        }}
                        disabled={!priceStartDate}
                        onKeyDown={(e) => e.preventDefault()} // 🚫 Disable manual typing
                      />
                    </MDBox>

                    {/* Buttons */}
                    <MDBox mt={3} display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ color: "white", padding: "8px 16px" }}
                        onClick={handleAddPriceDetail}
                        sx={{ minWidth: "120px" }}
                      >
                        Submit
                      </Button>
                    </MDBox>
                  </MDBox>
                </Modal>
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

export default NewEditroom;
