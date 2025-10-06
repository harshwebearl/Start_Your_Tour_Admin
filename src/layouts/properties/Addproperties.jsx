import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
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
import { Typography } from "@mui/material";

import {
  Card,
  CircularProgress,
  Stack,
  Autocomplete,
  TextField,
} from "@mui/material";
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
const Addproperties = () => {
  const location = useLocation();
  // console.log(location);

  const hotelId = location.state?.hotelid;

  const [editroom, setEditroom] = useState("");
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
  };

  useEffect(() => {
    Dest();
  }, []);

  const [selectedDestinationId, setSelectedDestinationId] = useState("");

  const handleSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedDestinationId(selectedId);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);
  const [formData1, setFormData1] = useState({
    hotel_id: "",
    policy_description: "",
    infant: "",
    children: "",
    adult_and_above: "",
    infant_points: [],
    childern_points: [],
    adult_and_above_points: [],
    policy_other: [],
  });

  const handleOptionChange = (event) => {
    const { name, value, files } = event.target;
    if (
      name === "infant_points" ||
      name === "childern_points" ||
      name === "adult_and_above_points" ||
      name === "policy_other"
    ) {
      const highlightsArray = value.split(",");
      setFormData1((prevFormData) => ({
        ...prevFormData,
        [name]: highlightsArray,
      }));
    } else {
      setFormData1((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // Add this near your other state declarations
  const [hotelName, setHotelName] = useState(location.state?.hotelName || "");

  const [errorMessage, setErrorMessage] = useState("");

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
      content="Policy is successfully added."
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

  // console.log(formData);
  const { hotel_id } = useParams();
  const [infantPoints, setOtherDetails] = useState([]);
  const [childPoints, setChildDetails] = useState([]);
  const [adultPoints, setAdultDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate hotel_id first
    if (!formData1.hotel_id) {
      setErrorMessage("Please select a hotel");
      openErrorSB();
      return;
    }

    const isAnyOtherDetailEmpty1 = infantPoints.some((detail) => detail === "");
    const isAnyOtherDetailEmpty2 = adultPoints.some((detail) => detail === "");
    const isAnyOtherDetailEmpty3 = childPoints.some((detail) => detail === "");

    if (
      !formData1.policy_title ||
      !formData1.policy_description ||
      !formData1.infant ||
      !formData1.children ||
      !formData1.adult_and_above ||
      infantPoints?.length === 0 ||
      childPoints?.length === 0 ||
      adultPoints?.length === 0 ||
      isAnyOtherDetailEmpty1 ||
      isAnyOtherDetailEmpty2 ||
      isAnyOtherDetailEmpty3 ||
      !formData1.policy_other
    ) {
      setErrorMessage("Please Fill All Fields");
      openErrorSB();
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("sytAdmin");

      console.log("abc");
      const response = await axios.post(
        `${BASE_URL}property_policies`,
        {
          ...formData1,
          hotel_id: formData1.hotel_id, // Using hotel_id from formData1
          infant_points: infantPoints,
          childern_points: childPoints,
          adult_and_above_points: adultPoints,
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
      } else {
        setLoading(false);
        setErrorMessage(response?.data?.message);
        openErrorSB();
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("There is Some Issue In Adding Policy");
      openErrorSB();
      console.log(error);
    }
  };

  const handleOtherDetailChange = (index, event) => {
    const newOtherDetails = [...infantPoints];
    newOtherDetails[index] = event.target.value;
    setOtherDetails(newOtherDetails);
  };

  const inputRef = useRef(null);
  const addOtherDetailField = () => {
    if (infantPoints[infantPoints.length - 1] !== "") {
      setOtherDetails([...infantPoints, ""]);
    } else {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleChildChange = (index, event) => {
    const newOtherDetails = [...childPoints];
    newOtherDetails[index] = event.target.value;
    setChildDetails(newOtherDetails);
  };

  const childRef = useRef(null);
  const addOtherDetailField2 = () => {
    if (childPoints[childPoints.length - 1] !== "") {
      setChildDetails([...childPoints, ""]);
    } else {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleAdultChange = (index, event) => {
    const newOtherDetails = [...adultPoints];
    newOtherDetails[index] = event.target.value;
    setAdultDetails(newOtherDetails);
  };

  const adultRef = useRef(null);
  const addOtherDetailField3 = () => {
    if (adultPoints[adultPoints.length - 1] !== "") {
      setAdultDetails([...adultPoints, ""]);
    } else {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const removeOtherDetailFieldAdult = (index) => {
    const newOtherDetails = adultPoints.filter((_, i) => i !== index);
    setAdultDetails(newOtherDetails);
  };

  const removeOtherDetailFieldChild = (index) => {
    const newOtherDetails = childPoints.filter((_, i) => i !== index);
    setChildDetails(newOtherDetails);
  };

  const removeOtherDetailFieldInfant = (index) => {
    const newOtherDetails = infantPoints.filter((_, i) => i !== index);
    setOtherDetails(newOtherDetails);
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
        <Card>
          <MDBox py={4} px={2}>
            <Grid container pt={4} px={3}>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <Stack spacing={2} sx={{ width: "100%" }}>
                  <Autocomplete
                    disablePortal
                    options={destination}
                    value={
                      destination.find((hotel) => hotel._id === hotelId) || null
                    }
                    onChange={(event, newValue) => {
                      setHotelName(newValue?.hotel_name || "");
                      setFormData1((prev) => ({
                        ...prev,
                        hotel_id: newValue?._id || "",
                      }));
                    }}
                    getOptionLabel={(option) => option.hotel_name || ""}
                    clearOnBlur={false} // Prevent clearing on blur
                    clearOnEscape={false} // Prevent clearing on escape key
                    blurOnSelect="touch" // Better touch device handling
                    disableClearable // Remove the clear button
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Select Hotel"
                        variant="outlined"
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-root": {
                            fontSize: "14px",
                            "& fieldset": { borderColor: "#dadbda" },
                            "&:hover fieldset": { borderColor: "#b8b8b8" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#2a84eb",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={6} xl={6} px={2} py={1}></Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div className="mb-1">
                  <h6
                    className="mb-0"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Policy Title
                  </h6>
                </div>
                <MDInput
                  type="text"
                  name="policy_title"
                  value={formData1.policy_title}
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
                    Policy Description
                  </h6>
                </div>
                <MDInput
                  type="text"
                  name="policy_description"
                  value={formData1.policy_description}
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
                    Infant Title
                  </h6>
                </div>
                <MDInput
                  type="text"
                  name="infant"
                  value={formData1.infant}
                  onChange={handleOptionChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      className="mb-0"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Infant Points
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
                    {/* {infantPoints.map((detail, index) => (
                                            <MDInput
                                                type="text"
                                                key={index}
                                                value={detail}
                                                onChange={(e) => handleOtherDetailChange(index, e)}
                                                fullWidth
                                                ref={index === infantPoints.length - 1 ? inputRef : null}
                                            />
                                        ))} */}
                    {infantPoints?.map((detail, index) => (
                      <div key={index} className="d-flex align-items-center">
                        <MDInput
                          type="text"
                          value={detail}
                          onChange={(e) => handleOtherDetailChange(index, e)}
                          fullWidth
                          ref={
                            index === infantPoints?.length - 1 ? inputRef : null
                          }
                        />
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="minus-icon"
                          onClick={() => removeOtherDetailFieldInfant(index)}
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
                <div className="mb-1">
                  <h6
                    className="mb-0"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Children Title
                  </h6>
                </div>
                <MDInput
                  type="text"
                  name="children"
                  value={formData1.children}
                  onChange={handleOptionChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      className="mb-0"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Children Points
                    </h6>
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="plus-icon"
                      onClick={addOtherDetailField2}
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
                    {/* {childPoints.map((detail, index) => (
                                            <MDInput
                                                type="text"
                                                key={index}
                                                value={detail}
                                                onChange={(e) => handleChildChange(index, e)}
                                                fullWidth
                                                ref={index === childPoints.length - 1 ? childRef : null}
                                            />
                                        ))} */}
                    {childPoints?.map((detail, index) => (
                      <div key={index} className="d-flex align-items-center">
                        <MDInput
                          type="text"
                          value={detail}
                          onChange={(e) => handleChildChange(index, e)}
                          fullWidth
                          ref={
                            index === childPoints?.length - 1 ? childRef : null
                          }
                        />
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="minus-icon"
                          onClick={() => removeOtherDetailFieldChild(index)}
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
                <div className="mb-1">
                  <h6
                    className="mb-0"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Adult Title
                  </h6>
                </div>
                <MDInput
                  type="text"
                  name="adult_and_above"
                  value={formData1.adult_and_above}
                  onChange={handleOptionChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      className="mb-0"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Adult Points
                    </h6>
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="plus-icon"
                      onClick={addOtherDetailField3}
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
                    {/* {adultPoints.map((detail, index) => (
                                            <MDInput
                                                type="text"
                                                key={index}
                                                value={detail}
                                                onChange={(e) => handleAdultChange(index, e)}
                                                fullWidth
                                                ref={index === adultPoints.length - 1 ? adultRef : null}
                                            />
                                        ))} */}
                    {adultPoints?.map((detail, index) => (
                      <div key={index} className="d-flex align-items-center">
                        <MDInput
                          type="text"
                          value={detail}
                          onChange={(e) => handleAdultChange(index, e)}
                          fullWidth
                          ref={
                            index === adultPoints?.length - 1 ? adultRef : null
                          }
                        />
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="minus-icon"
                          onClick={() => removeOtherDetailFieldAdult(index)}
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
                <Stack spacing={1} sx={{ width: "100%" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Other
                  </Typography>
                  <TextField
                    multiline
                    minRows={4} // Equivalent to 100px height
                    name="policy_other"
                    onChange={handleOptionChange}
                    value={formData1?.policy_other}
                    variant="outlined"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#7b809a",
                        backgroundColor: "transparent",
                        borderRadius: "5px",
                        fontSize: "14px",
                        "&:hover": { borderColor: "#b8b8b8" },
                        "&.Mui-focused fieldset": { borderColor: "#2a84eb" },
                      },
                    }}
                  />
                </Stack>
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

export default Addproperties;
