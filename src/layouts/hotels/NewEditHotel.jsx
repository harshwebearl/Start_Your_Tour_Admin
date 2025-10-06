import React, { useEffect, useRef, useState } from "react";
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
import addressdata from "../../CountryStateCity.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField } from "@mui/material";
import {
  faBell,
  faEnvelopeOpen,
  faUser,
  faPlus,
  faTrash,
  faClose,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { FormControl } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import
const EditHotel = () => {
  const { id } = useParams();

  const countries = addressdata.find((obj) => obj.name === "India");
  const [cities, setCities] = useState([]);

  const [status, setStatus] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [otherDetails, setOtherDetails] = useState([]);

  const [images, setImages] = useState([]);
  const [images2, setImages2] = useState([]);

  const [formData, setFormData] = useState({
    hotel_name: "",
    hotel_address: "",
    hotel_description: "",
    hotel_highlights: [],
    city: "",
    state: "",
    other: "",
    hotel_photo: [],
    hotel_type: "", // Empty array for storing checked feature _ids
    destination_category_id: [],
  });
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}highlight`, {
          headers: {
            Authorization: token,
          },
        });

        setCategory(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryList();
  }, []);

  const getDetail = async () => {
    const token = localStorage.getItem("sytAdmin");

    const res = await fetch(`${BASE_URL}hotel_syt/details?_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data?.data?.[0]);
    setStatus(data.data[0].hotel_status);
    const selectedCity = countries?.states?.find(
      (e) => e?.name === data.data?.[0]?.state
    );
    setCities(selectedCity?.cities);
    setOtherDetails(data.data?.[0]?.other);

    setFormData({
      hotel_name: data.data?.[0]?.hotel_name,
      hotel_address: data.data?.[0]?.hotel_address,
      hotel_type: data.data?.[0]?.hotel_type,
      city: data.data?.[0]?.city,
      state: data.data?.[0]?.state,
      hotel_description: data.data?.[0]?.hotel_description,
      status: data.data?.[0]?.status || "",
    });
    setHighlights(data.data?.[0]?.Highlights);

    // const images = data.data?.[0]?.hotel_photo?.map(url => ({ url }));
    setImages(data.data?.[0]?.hotel_photo);
    // setDestination(data.data);
  };
  useEffect(() => {
    // Dest();
    getDetail();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalImages = images.length + images2.length;

    if (totalImages < 5) {
      setErrorMessage("Please select minimum 5 images");
      openErrorSB();
      return;
    }

    // Rest of your validation checks
    const isAnyOtherDetailEmpty = otherDetails.some((detail) => detail === "");
    if (
      isAnyOtherDetailEmpty ||
      !formData.hotel_name ||
      !formData.hotel_address ||
      !formData.hotel_description ||
      !formData.state ||
      !formData.city ||
      !status ||
      !otherDetails
    ) {
      setErrorMessage("Please Fill All Fields");
      openErrorSB();
      return;
    }

    const formData1 = new FormData();
    formData1.append("hotel_name", formData.hotel_name);
    formData1.append("hotel_address", formData.hotel_address);
    formData1.append("hotel_description", formData.hotel_description);
    formData1.append("city", formData.city);
    formData1.append("state", formData.state);
    formData1.append("status", status);

    images.forEach((image, index) => {
      formData1.append("previmages", image);
    });

    images2.forEach(({ file }, index) => {
      formData1.append("hotel_photo", file);
    });

    otherDetails.forEach((id) => {
      formData1.append("other", id);
    });
    //   formData1.append("hotel_photo", formData.hotel_photo);
    formData1.append("hotel_type", formData.hotel_type);
    //   formData1.append("photo", formData.photo);
    highlights.forEach((id) => {
      formData1.append("hotel_highlights", id._id);
    });

    setLoading(true);

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
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } else {
        setErrorMessage(
          "Please provide all hotel information (Room, Amenities, and Property Policies)"
        );
        openErrorSB();
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(
        "Please provide all hotel information (Room, Amenities, and Property Policies)"
      );
      openErrorSB();
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

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
      content="Hotel is successfully updated."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (checked) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          destination_category_id: [
            ...prevFormData.destination_category_id,
            name, // Add the _id to the array
          ],
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          destination_category_id: prevFormData.destination_category_id.filter(
            (categoryId) => categoryId !== name // Remove the _id from the array
          ),
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Error"
      content={errorMessage}
      dateTime="1 sec ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const fileInputRef = useRef(null);

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const currentTotal = images.length + images2.length + files.length;

    if (currentTotal > 10) {
      setErrorMessage("Maximum 10 images allowed");
      openErrorSB();
      return;
    }

    const fileObjects = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages2((prevImages) => [...prevImages, ...fileObjects]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveImage2 = (indexToRemove) => {
    setImages2((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleOptionChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "room_highlights") {
      const highlightsArray = value
        .split(",")
        .map((highlight) => highlight.trim());
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: highlightsArray,
      }));
    } else if (name === "hotel_photo") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: event.target.files,
      }));
    } else if (name === "state") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      const selectedCity = countries?.states?.find((e) => e?.name === value);
      setCities(selectedCity?.cities);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleOtherDetailChange = (index, event) => {
    const newOtherDetails = [...otherDetails];
    newOtherDetails[index] = event.target.value;
    setOtherDetails(newOtherDetails);
    handleChange({
      target: {
        name: "hotel_others",
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

  const handleHighlightChange = (event) => {
    const { checked, id } = event.target;
    if (checked) {
      setHighlights((prev) => [...prev, category.find((x) => x._id === id)]);
    } else {
      setHighlights((prev) => prev.filter((highlight) => highlight._id !== id));
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
            Update hotel
          </MDTypography>
        </MDBox>
        <Card>
          <MDBox py={3} px={2}>
            <Grid container pt={4}>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div className="mb-2">
                  <h6
                    className="mb-0"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Hotel Name
                  </h6>
                </div>
                <MDInput
                  type="text"
                  name="hotel_name"
                  value={formData?.hotel_name}
                  onChange={handleOptionChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <h6
                    className="mb-2"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Hotel Type
                  </h6>
                  <FormControl fullWidth>
                    <InputLabel id="hotelType-label">Select</InputLabel>
                    <Select
                      id="hotelType"
                      name="hotel_type"
                      value={formData?.hotel_type}
                      onChange={handleOptionChange}
                      label="Select"
                      style={{
                        color: "#7b809a",
                        background: "transparent",
                        height: "44px",
                        padding: "0px 15px",
                        borderRadius: "5px",
                        fontSize: "14px",
                      }}
                      IconComponent={(props) => (
                        <ArrowDropDownIcon {...props} />
                      )} // Down arrow
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value="1">1 star</MenuItem>
                      <MenuItem value="2">2 star</MenuItem>
                      <MenuItem value="3">3 star</MenuItem>
                      <MenuItem value="4">4 star</MenuItem>
                      <MenuItem value="5">5 star</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <h6
                    className="mb-2"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    State
                  </h6>
                  <FormControl fullWidth style={{ borderRadius: "5px" }}>
                    <InputLabel
                      id="state-label"
                      style={{ fontSize: "14px", color: "#7b809a" }}
                    >
                      Select
                    </InputLabel>
                    <Select
                      labelId="state-label"
                      id="state"
                      name="state"
                      value={formData?.state}
                      onChange={handleOptionChange}
                      style={{
                        color: "#7b809a",
                        background: "transparent",
                        height: "44px",
                        padding: "0px 15px",
                        fontSize: "14px",
                      }}
                      label="State"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {countries?.states?.map((e) => (
                        <MenuItem key={e.name} value={e.name}>
                          {e.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Grid>

              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <h6
                    className="mb-2"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    City
                  </h6>
                  <FormControl fullWidth style={{ borderRadius: "5px" }}>
                    <InputLabel
                      id="city-label"
                      style={{ fontSize: "14px", color: "#7b809a" }}
                    >
                      Select
                    </InputLabel>
                    <Select
                      labelId="city-label"
                      id="city"
                      name="city"
                      value={formData?.city}
                      onChange={handleOptionChange}
                      style={{
                        color: "#7b809a",
                        background: "transparent",
                        height: "44px",
                        padding: "0px 15px",
                        fontSize: "14px",
                      }}
                      label="City"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {cities?.map((e) => (
                        <MenuItem key={e.name} value={e.name}>
                          {e.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <h6
                    className="mb-1"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Address
                  </h6>
                  <TextField
                    name="hotel_address"
                    onChange={handleOptionChange}
                    value={formData?.hotel_address}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    style={{
                      color: "#7b809a",
                      background: "transparent",
                      border: "1px solid #dadbda",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6
                        className="mb-0"
                        style={{ fontSize: "12px", color: "#b8b8b8" }}
                      >
                        Hotel Pictures
                      </h6>
                    </div>
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
                    {images.map((url, index) => (
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
                    {images2 &&
                      images2.map(({ url }, index) => (
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
                            onClick={() => handleRemoveImage2(index)}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="">
                    <h6
                      className="mb-0"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Select Highlights <span style={{ color: "red" }}>*</span>
                    </h6>
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "5px",
                    }}
                  >
                    {category.map((feature) => (
                      <MDBox
                        key={feature._id}
                        display="flex"
                        alignItems="center"
                      >
                        <input
                          type="checkbox"
                          id={feature._id}
                          name={feature._id}
                          checked={highlights.some(
                            (highlight) => highlight._id === feature._id
                          )}
                          onChange={handleHighlightChange}
                          style={{ marginRight: "10px" }}
                        />
                        <label
                          style={{
                            color: darkMode ? "#ffffffcc" : "",
                            fontSize: "14px",
                          }}
                          htmlFor={feature._id}
                        >
                          {feature.title}
                        </label>
                      </MDBox>
                    ))}
                  </div>
                  {/* Validation message */}
                  {highlights.length === 0 && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      Please select at least one highlight.
                    </p>
                  )}
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      className="mb-0"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Hotel Other
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
                </div>
              </Grid>

              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <h6
                    className="mb-1"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Hotel Description
                  </h6>
                  <TextField
                    name="hotel_description"
                    onChange={handleOptionChange}
                    value={formData?.hotel_description}
                    fullWidth
                    multiline
                    rows={4} // Adjust the number of rows to control the height of the textarea
                    variant="outlined"
                    style={{
                      color: "#7b809a",
                      background: "transparent",
                      border: "1px solid #dadbda",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <h6
                    className="mb-2"
                    style={{ fontSize: "12px", color: "#b8b8b8" }}
                  >
                    Status
                  </h6>
                  <FormControl fullWidth style={{ borderRadius: "5px" }}>
                    <InputLabel id="status-label">Select</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      name="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Select"
                      style={{
                        color: "#7b809a",
                        background: "transparent",
                        height: "44px",
                        padding: "0px 15px",
                        fontSize: "14px",
                      }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="deactive">Deactive</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="block">Block</MenuItem>
                    </Select>
                  </FormControl>
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
                      disabled={loading}
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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </DashboardLayout>
  );
};

export default EditHotel;
