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
import { FormControl } from "@mui/material";
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

const sortDatesByMonth = (dates) => {
  if (!dates) return [];
  return [...dates].sort((a, b) => {
    const dateA = new Date(a.price_start_date);
    const dateB = new Date(b.price_start_date);
    return dateA - dateB;
  });
};

// import
const Editroom = () => {
  const [selectedDestinationId, setSelectedDestinationId] = useState("");

  const { id } = useParams();

  const location = useLocation();

  useEffect(() => {
    if (location?.state?.hotelid) {
      setSelectedDestinationId(location.state.hotelid);
    }
  }, [location]);

  const [destination, setDestination] = useState([]);
  const Dest = async () => {
    const token = localStorage.getItem("sytAdmin");

    const res = await fetch(`${BASE_URL}hotel_syt`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setDestination(data.data);
    // console.log(data.data);
  };

  useEffect(() => {
    Dest();
  }, []);

  const handleSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedDestinationId(selectedId);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [errorMessage, setErrorMessage] = useState("");

  const [formData1, setFormData1] = useState({
    room_title: "",
    photos: [],
    room_highlights: [],
    total_rooms: "",
    status: "available",
  });

  const handleOptionChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "photos") {
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
      content="Room is successfully added."
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

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        // const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}destinationcategory`);

        setCategory(response.data.data);
        setIsLoading(false);
        // console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryList();
  }, []);
  // console.log(formData);
  const { hotel_id } = useParams();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate minimum 3 images
    if (images.length < 3) {
      setErrorMessage("Please select minimum 3 images");
      openErrorSB();
      return;
    }

    // Validate all fields first
    if (!selectedDestinationId) {
      setErrorMessage("Please select a hotel");
      openErrorSB();
      return;
    }

    if (!formData1.room_title.trim()) {
      setErrorMessage("Please enter room title");
      openErrorSB();
      return;
    }

    if (!formData1.total_rooms || formData1.total_rooms === "0") {
      setErrorMessage("Please enter number of total rooms");
      openErrorSB();
      return;
    }

    if (!formData1.status) {
      setErrorMessage("Please select room status");
      openErrorSB();
      return;
    }

    if (images.length === 0) {
      setErrorMessage("Please add at least one room photo");
      openErrorSB();
      return;
    }

    if (otherDetails.length === 0) {
      setErrorMessage("Please add at least one room detail");
      openErrorSB();
      return;
    }

    // Check for empty other details
    const isAnyOtherDetailEmpty = otherDetails.some((detail) => !detail.trim());
    if (isAnyOtherDetailEmpty) {
      setErrorMessage("Please fill all room details");
      openErrorSB();
      return;
    }

    if (priceDetails.length === 0) {
      setErrorMessage("Please add at least one price detail");
      openErrorSB();
      return;
    }

    // If all validations pass, proceed with submission
    setLoading(true);
    try {
      const token = localStorage.getItem("sytAdmin");
      const formData = new FormData();

      // Add form data
      formData.append("room_title", formData1.room_title);
      formData.append("hotel_id", selectedDestinationId);
      formData.append("total_rooms", formData1.total_rooms);
      formData.append("status", formData1.status);

      // Add images
      images.forEach((item) => {
        formData.append("photos", item.file);
      });

      // Add price details
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

      // Add room highlights
      otherDetails.forEach((highlight) => {
        formData.append("room_highlights", highlight);
      });

      const response = await axios.post(`${BASE_URL}room_syt`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.status === "OK") {
        setLoading(false);
        openSuccessSB();
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } else {
        throw new Error(response?.data?.message || "Failed to add room");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response?.data?.message || "Error adding room");
      openErrorSB();
      console.error("Error submitting room:", error);
    }
  };

  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const currentTotal = images.length + files.length;

    if (currentTotal > 10) {
      setErrorMessage("Maximum 10 images allowed");
      openErrorSB();
      return;
    }

    const fileObjects = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...fileObjects]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const [otherDetails, setOtherDetails] = useState([]);

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

  const [priceDetails, setPriceDetails] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [pricePerPersonForChild, setPricePerPersonForChild] = useState("");
  const [priceStartDate, setPriceStartDate] = useState("");
  const [priceEndDate, setPriceEndDate] = useState("");

  const handleAddPriceDetail = () => {
    // Basic validation for empty fields
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

    // Validation for prices
    if (Number(pricePerPerson) < Number(pricePerPersonForChild)) {
      setErrorMessage(
        "Price of Extra bad Cannot be greater than price per night"
      );
      openErrorSB();
      return;
    }

    // Convert the date strings to Date objects for comparison
    const newStartDate = new Date(priceStartDate);
    const newEndDate = new Date(priceEndDate);

    // Skip date validation if this is the first entry
    if (priceDetails && priceDetails.length > 0) {
      // Check for date overlaps with existing price details
      const hasOverlap = priceDetails.some((detail) => {
        const existingStartDate = new Date(detail.price_start_date);
        const existingEndDate = new Date(detail.price_end_date);

        // Check if new dates overlap with existing dates
        const isOverlapping =
          (newStartDate >= existingStartDate &&
            newStartDate <= existingEndDate) || // New start date falls within existing range
          (newEndDate >= existingStartDate && newEndDate <= existingEndDate) || // New end date falls within existing range
          (newStartDate <= existingStartDate && newEndDate >= existingEndDate); // New range completely encompasses existing range

        return isOverlapping;
      });

      if (hasOverlap) {
        setErrorMessage("Selected dates overlap with existing price ranges");
        openErrorSB();
        return;
      }
    }

    // If validations pass, create the new price detail
    const newDetail = {
      adult_price: Number(pricePerPerson),
      extra_bad: Number(pricePerPersonForChild),
      price_start_date: priceStartDate,
      price_end_date: priceEndDate,
    };

    // Add new detail and sort
    setPriceDetails((prev) => {
      const updatedDetails = [...(prev || []), newDetail];
      return sortDatesByMonth(updatedDetails);
    });

    // Reset form
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
  
  const headerStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#044711",
  marginBottom: "0",
  whiteSpace: "nowrap",
};


  return (
    <DashboardLayout>
      <DashboardNavbar />
<MDBox pt={6} pb={3}>
  <MDBox textAlign="center" mb={4}>
    <MDTypography 
      variant="h4" 
      fontWeight="bold" 
      sx={{ fontSize: { xs: "20px", sm: "28px" } }} 
    >
      Add New Room
    </MDTypography>
  </MDBox>

        <Card>
          <MDBox py={3} px={2}>
            <Grid container pt={2}>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div className="mb-1">
                  <h6
                    className="mb-0"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Select Hotel
                  </h6>
                </div>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <Select
                    labelId="hotel-select-label"
                    id="hotel-select"
                    value={selectedDestinationId}
                    onChange={handleSelect}
                    name="Destinations"
                    disabled={location?.state?.hotelid}
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 200, // Limits dropdown height
                          // Enables vertical scrolling
                        },
                      },
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                    }}
                    sx={{
                      color: "#7b809a",
                      backgroundColor: "transparent",
                      borderRadius: "5px",
                      fontSize: "14px",
                      height: "44px",

                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#358eed",
                      },
                      "& .Mui-disabled": {
                        backgroundColor: "#f5f5f5",
                        color: "#b8b8b8",
                      },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {destination?.map((ele) => (
                      <MenuItem
                        key={ele._id}
                        value={ele._id}
                        sx={{ fontSize: "14px", color: "black" }}
                      >
                        {ele.hotel_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleOptionChange(e);
                    }
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div className="mb-1">
                  <h6
                    className="mb-0"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Room Status
                  </h6>
                </div>
                <FormControl fullWidth>
                  <Select
                    labelId="room-status-label"
                    id="room-status"
                    value={formData1?.status}
                    onChange={handleOptionChange}
                    name="status"
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 150, // Limits dropdown height
                          overflowY: "auto", // Enables vertical scrolling
                        },
                      },
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                    }}
                    sx={{
                      color: "#7b809a",
                      backgroundColor: "transparent",
                      borderRadius: "5px",
                      fontSize: "14px",
                      height: "42px",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#328bed",
                      },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem
                      value="available"
                      sx={{ fontSize: "12px", color: "black" }}
                    >
                      Available
                    </MenuItem>
                    <MenuItem
                      value="booked"
                      sx={{ fontSize: "12px", color: "black" }}
                    >
                      Booked
                    </MenuItem>
                    <MenuItem
                      value="sold"
                      sx={{ fontSize: "12px", color: "black" }}
                    >
                      Sold Out
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6
                        className="mb-0"
                        style={{ fontSize: "12px", color: "#b8b8b8" }}
                      >
                        Room Photos
                      </h6>
                    </div>
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="plus-icon"
                      onClick={handleAddImageClick}
                      style={{
                        cursor: "pointer",
                        opacity: 1,
                      }}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                      multiple
                      accept="image/png, image/jpeg"
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
                    {images.map(({ url }, index) => (
                      <div
                        key={index}
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
                          onClick={() => handleRemoveImage(index)}
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
                      {/* Responsive scroll container for xs/sm */}
<div
  style={{
    width: "100%",
    overflowX: "auto",
  }}
>
  {/* Inner content: always full width, allows scroll on small screens */}
  <div
    className="margin-pricing-agency-header"
     style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
      gap: "10px",
      textAlign: "center",
      padding: "8px",
      borderRadius: "4px",
      width: "100%",             
      minWidth: "600px",         
      boxSizing: "border-box",
    }}
  >
    <h5 style={headerStyle}>Price Per Adult</h5>
    <h5 style={headerStyle}>Extra Bed</h5>
    <h5 style={headerStyle}>Start Date</h5>
    <h5 style={headerStyle}>End Date</h5>
    <h5 style={headerStyle}>Actions</h5>
  </div>
</div>

{/* Divider */}
<hr
  style={{
    border: "none",
    borderTop: "1px solid #ddd",
    margin: "8px 0",
  }}
/>

                      {(() => {
                        const sortedDates = sortDatesByMonth(priceDetails);
                        let currentMonth = "";

                        return sortedDates.map((updatedItem, index) => {
                          const startDate = new Date(
                            updatedItem.price_start_date
                          );
                          const monthYear = startDate.toLocaleString(
                            "default",
                            { month: "long", year: "numeric" }
                          );
                          const showMonthHeader = monthYear !== currentMonth;
                          currentMonth = monthYear;

                          return (
                            <React.Fragment key={index}>
                              <div
                                className="margin-pricing-agency-body"
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                                  gap: "10px",
                                  textAlign: "center",
                                  padding: "8px 0",
                                  fontSize: "15px",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                <p
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {updatedItem.adult_price}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {updatedItem.extra_bad}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {rightDate(
                                    updatedItem.price_start_date.slice(0, 10)
                                  )}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {rightDate(
                                    updatedItem.price_end_date.slice(0, 10)
                                  )}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
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
                            </React.Fragment>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </MDBox>
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
                    borderRadius: "20px",
                    margin: "0 30px",
                  }}
                >
                  <Typography variant="h6" mb={3} align="center">
                    Add Price Details
                  </Typography>

                  {/* Input fields */}
                  <MDBox mt={2}>
                    <TextField
                      label="Price Per Night"
                      type="text"
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      fullWidth
                      value={pricePerPerson}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) setPricePerPerson(value); // allow only digits
                      }}
                      sx={{ mb: 2 }}
                    />
                  </MDBox>

                  <MDBox mt={2}>
                    <TextField
                      label="Price Of Extra Bed"
                      type="text"
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      fullWidth
                      value={pricePerPersonForChild}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value))
                          setPricePerPersonForChild(value);
                      }}
                      sx={{ mb: 2 }}
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
                        min: getTomorrowDate(), // Minimum start date is tomorrow
                      }}
                      onKeyDown={(e) => e.preventDefault()}
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
                      sx={{ mb: 3 }} // Larger margin for spacing before buttons
                      inputProps={{
                        min: priceStartDate || getTomorrowDate(), // Minimum end date is the selected start date or tomorrow
                      }}
                      onKeyDown={(e) => e.preventDefault()}
                      disabled={!priceStartDate} // Disable if start date is not selected
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
          </MDBox>
        </Card>
      </MDBox>
      {renderSuccessSB}
      {renderErrorSB}
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default Editroom;
