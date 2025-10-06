import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate } from "react-router-dom";
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
import {
  faBell,
  faEnvelopeOpen,
  faUser,
  faPlus,
  faTrash,
  faClose,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FormControl, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import
const Addhotel = () => {
  const countries = addressdata.find((obj) => obj.name === "India");
  const [cities, setCities] = useState([]);

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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if at least 5 images are uploaded
    if (images.length < 5) {
      toast.error(
        `Please upload at least 5 images. (${images.length}/5 uploaded)`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      return; // Stop submission if the condition is not met
    }

    const isAnyOtherDetailEmpty = otherDetails.some((detail) => detail === "");

    if (
      isAnyOtherDetailEmpty ||
      !formData.hotel_name ||
      !formData.hotel_address ||
      !formData.hotel_description ||
      !formData.city ||
      !formData.state ||
      !formData.hotel_type ||
      otherDetails.length === 0
    ) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("sytAdmin");
      const formData1 = new FormData();
      formData1.append("hotel_name", formData.hotel_name);
      formData1.append("hotel_address", formData.hotel_address);
      formData1.append("hotel_description", formData.hotel_description);
      formData1.append("city", formData.city);
      formData1.append("state", formData.state);

      otherDetails.forEach((id) => {
        formData1.append("other", id);
      });

      Array.from(images).forEach((item) => {
        formData1.append("hotel_photo", item.file);
      });
      formData1.append("hotel_type", formData.hotel_type);
      formData.destination_category_id.forEach((id) => {
        formData1.append("hotel_highlights", id);
      });

      const response = await axios.post(`${BASE_URL}hotel_syt`, formData1, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.status === "OK") {
        toast.success("Hotel successfully added!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        navigate(`/Full-Detail/${response.data.data._id}`);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while adding the hotel.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log(error);
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);

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
      content="Hotel is successfully added."
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
      title="Filled Error"
      content="Please fill all fileds"
      dateTime="1 sec ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const [images, setImages] = useState([]);
  console.log(images);
  const fileInputRef = useRef(null);

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(
      (file) => file.type === "image/jpeg" || file.type === "image/png"
    );

    if (validFiles.length !== files.length) {
      alert("Only JPG and PNG formats are allowed.");
    }

    const fileObjects = validFiles.map((file) => ({
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

  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
  };

  const [otherDetails, setOtherDetails] = useState([]);

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
            Add hotel
          </MDTypography>
        </MDBox>
        <Card>
          <MDBox py={3}>
            <Grid container pt={4} px={1}>
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
                  <FormControl fullWidth style={{ borderRadius: "5px" }}>
                    <InputLabel id="hotel-type-label">Select</InputLabel>
                    <Select
                      labelId="hotel-type-label"
                      id="hotelType"
                      name="hotel_type"
                      value={formData?.hotel_type}
                      onChange={handleOptionChange}
                      label="Select"
                      style={{
                        color: "#7b809a",
                        background: "transparent",
                        height: "44px",
                        padding: "0px 6px",
                        fontSize: "14px",
                      }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="5">5 star</MenuItem>
                      <MenuItem value="4">4 star</MenuItem>
                      <MenuItem value="3">3 star</MenuItem>
                      <MenuItem value="2">2 star</MenuItem>
                      <MenuItem value="1">1 star</MenuItem>
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
                    <InputLabel id="state-label">Select</InputLabel>
                    <Select
                      labelId="state-label"
                      id="state"
                      name="state"
                      value={formData?.state}
                      onChange={handleOptionChange}
                      label="Select"
                      style={{
                        color: "#7b809a",
                        background: "transparent",
                        height: "44px",
                        padding: "0px 6px",
                        fontSize: "14px",
                      }}
                    >
                      <MenuItem value="">Select</MenuItem>
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
                    <InputLabel id="city-label">Select</InputLabel>
                    <Select
                      labelId="city-label"
                      id="city"
                      name="city"
                      value={formData?.city}
                      onChange={handleOptionChange}
                      label="Select"
                      style={{
                        color: "#7b809a",
                        background: "transparent",
                        height: "44px",
                        padding: "0px 6px",
                        fontSize: "14px",
                      }}
                    >
                      <MenuItem value="">Select</MenuItem>
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
                    className="mb-2"
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
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                    InputProps={{
                      style: {
                        padding: "0px 6px",
                      },
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      className="mb-2"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Hotel Pictures
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
                  <div
                    style={{
                      color: images.length < 5 ? "red" : "green",
                      fontSize: "14px",
                      marginTop: "10px",
                    }}
                  >
                    {images.length < 5
                      ? `Please upload at least 5 images. (${images.length}/5 uploaded)`
                      : ""}
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
          onChange={handleChange}
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
  {formData.destination_category_id.length === 0 && (
    <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
      Please select at least one highlight.
    </p>
  )}
</div>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      className="mb-2"
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
                    className="mb-2"
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
                    rows={4}
                    variant="outlined"
                    style={{
                      color: "#7b809a",
                      background: "transparent",
                      fontSize: "14px",
                    }}
                    InputProps={{
                      style: {
                        padding: "0px 6px",
                      },
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={6} px={2} py={1}></Grid>
              <Grid item xs={12} md={12} xl={12} px={2} py={1}>
                <div className="d-flex justify-content-center">
                  <MDBox mt={4} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      type="submit"
                      onClick={handleSubmit}
                      disabled={loading || images.length < 5} // Disable if loading or fewer than 5 images
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

export default Addhotel;
