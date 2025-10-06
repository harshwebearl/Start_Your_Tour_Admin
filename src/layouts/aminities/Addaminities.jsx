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
import { Card, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography, FormControl, TextField } from "@mui/material";
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
const Addaminities = () => {
  const [destination, setDestination] = useState([]);

  const location = useLocation();

  useEffect(() => {
    if (location?.state?.hotelid) {
      setSelectedDestinationId(location.state.hotelid);
    }
  }, [location]);

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
  };

  useEffect(() => {
    Dest();
  }, []);

  const [selectedDestinationId, setSelectedDestinationId] = useState("");

  const handleSelect = (event) => {
    const selectedId = event.target.value; // Get the selected option's ID
    setSelectedDestinationId(selectedId); // Update the state with the selected ID
  };

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
        [name]: prevFormData[name]
          ? [...prevFormData[name], ...fileArray]
          : fileArray,
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

  const [errorMessage, setErrorMessage] = useState("");

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull Added"
      content="Amenities is successfully added."
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

    const isAnyOtherDetailEmpty = otherDetails.some((detail) => detail === "");

    if (
      !formData1.title ||
      !formData1.points ||
      otherDetails?.length === 0 ||
      isAnyOtherDetailEmpty
    ) {
      setErrorMessage("Fill All Fields!");
      openErrorSB();
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await axios.post(
        `${BASE_URL}amenities_and_facilities`,
        {
          title: formData1.title,
          hotel_id: selectedDestinationId,
          points: otherDetails,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status === "OK") {
        setLoading(false);
        openSuccessSB();
        setTimeout(() => {
          navigate(-1);
        }, 1000);
        setLoading(false);
      } else {
        setErrorMessage(response?.data?.message);
        openErrorSB();
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage("There Is A Problem In Adding Amenities");
      openErrorSB();
      setLoading(false);
    }
  };

  const [otherDetails, setOtherDetails] = useState([]);

  const handleOtherDetailChange = (index, event) => {
    const newOtherDetails = [...otherDetails];
    newOtherDetails[index] = event.target.value;
    setOtherDetails(newOtherDetails);
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
            <Grid container pt={4} >
              <Grid container>
                {/* Select Hotel */}
                <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                  <h6
                    style={{
                      fontSize: "12px",
                      color: "#b8b8b8",
                      marginBottom: "5px",
                    }}
                  >
                    Select Hotel
                  </h6>
                  <FormControl fullWidth>
                    <Select
                      id="hotel-select"
                      onChange={handleSelect}
                      value={selectedDestinationId}
                      disabled={location?.state?.hotelid}
                      name="Destinations"
                      displayEmpty
                      sx={{
                        color: "#7b809a",
                        background: "transparent",
                        border: "0px solid #dadbda",
                        height: "44px",
                        padding: "0px 0px",
                        borderRadius: "5px",
                        fontSize: "14px",
                        width: "100%",
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 250, // Set max height for scroll
                            overflowY: "auto", // Enable vertical scroll
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
                    >
                      <MenuItem
                        value=""
                        sx={{
                          fontSize: "12px",
                          color: "#b8b8b8",
                          fontWeight: "bold",
                        }}
                      >
                        Select
                      </MenuItem>
                      {destination &&
                        destination.map((e) => (
                          <MenuItem
                            key={e._id}
                            value={e._id}
                            sx={{ fontSize: "12px", color: "black" }}
                          >
                            {e.hotel_name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Title Input */}
                <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                  <div>
                    <h6
                      style={{
                        fontSize: "12px",
                        color: "#b8b8b8",
                        marginBottom: "5px",
                      }}
                    >
                      Title
                    </h6>
                    <TextField
                      type="text"
                      name="title"
                      value={formData1.title}
                      onChange={(e) => {
                        if (e.target.value.length <= 120) {
                          handleOptionChange(e);
                        }
                      }}
                      fullWidth
                      variant="outlined"
                      inputProps={{
                        maxLength: 120
                      }}
                      helperText={`${formData1.title.length}/120 characters`}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          fontSize: "14px",
                          color: "#7b809a",
                          "&:hover ": {
                            borderColor: "#368fed",
                          },
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: "12px",
                          color: formData1.title.length === 120 ? "#d32f2f" : "#b8b8b8",
                          marginLeft: "0px"
                        }
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div className="d-flex justify-content-between align-items-center">
                  <h6
                    className="mb-0"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Amenities Points
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
                  {/* {otherDetails.map((detail, index) => (
                                        <MDInput
                                            type="text"
                                            key={index}
                                            value={detail}
                                            onChange={(e) => handleOtherDetailChange(index, e)}
                                            fullWidth
                                            ref={index === otherDetails.length - 1 ? inputRef : null}
                                        />
                                    ))} */}
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

export default Addaminities;
