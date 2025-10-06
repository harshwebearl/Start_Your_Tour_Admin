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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import CountryStateCity from 'CountryStateCity.json'
// Add this import with your other Material-UI imports
import { CircularProgress } from "@mui/material";

// ...existing code...
import { Padding } from "@mui/icons-material";

// import
const Editblogger = () => {
  
  const [formData, setFormData] = useState({
    blog_owner_name: "",
    mobile_number: "",
    emai_id: "",
    country: "",
    state: "",
    city: "",
    blog_owner_photo: "",
  });
  

  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [errorSB1, setErrorSB1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const openErrorSB1 = () => setErrorSB1(true);
  const closeErrorSB = () => setErrorSB(false);
  const closeErrorSB1 = () => setErrorSB1(false);
  const navigate = useNavigate();
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull Added"
      content="title is successfully added."
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

  const renderErrorSB1 = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Filled Error"
      content="Enter Valid Email"
      dateTime="1 sec ago"
      open={errorSB1}
      onClose={closeErrorSB1}
      close={closeErrorSB1}
      bgWhite
    />
  );
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "mobile_number") {
      if (!/^\d*$/.test(value)) return; // Prevents characters
      if (value.length > 1 && value.startsWith("0")) return; // Prevents 0 at the beginning
      if (value.length > 10) return; // Limits input to 10 digits

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (name === "blog_owner_name" && value !== "" && /\d/.test(value)) {
      return;
    }
    if (name === "mobile_number" && value.length === 1 && value === "0") {
      return; // Ignore input if the first digit is zero
    }
    if (name === "mobile_number") {
      // If user tries to add '0' at the beginning
      if (value.length > 1 && value.startsWith("0")) {
        return; // Ignore the input change
      }

      // Allow only numeric values and limit to 10 digits
      if (/^\d{0,10}$/.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }

    if (name === "mobile_number" && value.length > 10) {
      return;
    }

    if (e.target.name === "blog_owner_photo") {
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
  const [previewImage, setPreviewImage] = useState(
    "https://dummyimage.com/200x200/cccccc/ffffff"
  );

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      blog_owner_photo: selectedImage,
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

  const { _id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields validation first
    if (
      !formData.blog_owner_name ||
      !formData.mobile_number ||
      !formData.emai_id ||
      !formData.city ||
      !formData.state ||
      !formData.country
    ) {
      setErrorMessage("Please fill all required fields");
      openErrorSB();
      return;
    }

    // Email validation
    const emailRegex = /^[A-Z0-9.+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValidEmail = emailRegex.test(formData.emai_id);

    if (!isValidEmail) {
      openErrorSB1();
      return;
    }

    // Phone validation - check both length and numeric value
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.mobile_number)) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      openErrorSB();
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("sytAdmin");
      const formDataToSend = new FormData();

      // Rest of your existing code...
      formDataToSend.append("blog_owner_name", formData.blog_owner_name);
      formDataToSend.append("mobile_number", formData.mobile_number);
      formDataToSend.append("emai_id", formData.emai_id);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("country", formData.country);

      // Only append photo if it exists and has changed
      if (formData.blog_owner_photo instanceof File) {
        formDataToSend.append("blog_owner_photo", formData.blog_owner_photo);
      }

      const response = await axios.put(
        `${BASE_URL}blogger/?_id=${_id}`,
        formDataToSend,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "OK") {
        setLoading(false);
        openSuccessSB();
        setTimeout(() => {
          navigate("/blogger");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to update blogger");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message || "Error updating blogger");
      openErrorSB();
      console.error("Error:", error);
    }
  };

  const imageUrlToBinary = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsArrayBuffer(blob);
      });
    } catch (error) {
      console.error("Error converting image URL to binary:", error);
      throw error;
    }
  };

  // get api
  const getDetail = async () => {
    const token = localStorage.getItem("sytAdmin");

    const res = await fetch(`${BASE_URL}blogger/blogger?_id=${_id}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    const binaryData = await imageUrlToBinary(data?.data?.blog_owner_photo);

    setFormData({
      blog_owner_name: data.data?.blog_owner_name,
      mobile_number: data.data?.mobile_number,
      emai_id: data.data?.emai_id,
      city: data.data?.city,
      state: data.data?.state,
      country: data.data?.country,
      blog_owner_photo: new File([binaryData], "image.jpg"),
    });

  };

  useEffect(() => {
    // Dest();
    getDetail();
  }, []);

  // Delete api start
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("sytAdmin");
      const responseDelete = await axios.delete(
        `${BASE_URL}blogger/?_id=${_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (responseDelete.data.status === "OK") {
        navigate(-1);
      }
    } catch (error) {}
  };
  //   Delete api close

  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={2}>
        <MDBox textAlign="center" >
          <MDTypography variant="h4" fontWeight="bold">
           Update title
          </MDTypography>
        </MDBox>
        <MDBox pt={2} pb={3} >
          <form
            // component="form"

            style={{ ...style1, paddingTop: "30px", paddingBottom: "20px" }}
            role="form"
            className="form_container demo"
            >
            <MDBox >
              <MDInput
              type="text"
              label="Enter Blogger Name"
              name="blog_owner_name"
              value={formData.blog_owner_name}
              onChange={handleChange}
              fullWidth
              style={{ marginBottom: "15px" }}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" className="mb-3">
              <MDBox
              component="img"
              src={formData.blog_owner_photo ? URL.createObjectURL(formData.blog_owner_photo) : previewImage}
              alt="Preview"
              style={{
              width: "3rem",
              height: "3rem",
              objectFit: "cover",
              borderRadius: "50%",
              }}
              />
              <MDInput
              type="file"
              name="blog_owner_photo"
              accept="image/*"
              onChange={handleImageChange}
              mb={2}
              style={{ marginLeft: "20px" }}
              />
            </MDBox>
            <MDBox >
              <MDInput
              type="text"
              label="Enter mobile number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              fullWidth
              style={{ marginBottom: "15px"  }}
              />
            </MDBox>
            <MDBox>
              <MDInput
              type="text"
              label="Enter email"
              name="emai_id"
              value={formData.emai_id}
              onChange={handleChange}
              fullWidth
              style={{ marginBottom: "16px"}}
              />
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
              disablePortal
              options={CountryStateCity.map((country) => country.name)}
              value={formData.country}
              onChange={(event, newValue) => {
              setFormData((prevData) => ({
              ...prevData,
              country: newValue,
              state: "",
              city: "",
              }));
              }}
              renderInput={(params) => <TextField {...params} label="Country" />}
              sx={{ width: "100%" }}
              />
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
              disablePortal
              options={
              CountryStateCity.find((country) => country.name === formData.country)?.states.map((state) => state.name) || []
              }
              value={formData.state}
              onChange={(event, newValue) => {  
              setFormData((prevData) => ({
              ...prevData,
              state: newValue,
              city: "",
              }));
              }}
              renderInput={(params) => <TextField {...params} lab el="State" />}
              sx={{ width: "100%" }}
              disabled={!formData.country}
              />
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
              disablePortal
              options={
              CountryStateCity.find((country) => country.name === formData.country)
              ?.states.find((state) => state.name === formData.state)?.cities.map((city) => city.name) || []
              }
              value={formData.city}
              onChange={(event, newValue) => {
              setFormData((prevData) => ({
              ...prevData,
              city: newValue,
              }));
              }}
              renderInput={(params) => <TextField {...params} label="City" />}
              sx={{ width: "100%" }}
              disabled={!formData.state}
              />
            </MDBox>
            <MDBox className="d-flex" mt={3} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
                type="submit"
                className="me-2"
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
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
              {renderErrorSB1}
            </MDBox>
          </form>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default Editblogger;
