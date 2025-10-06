import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
// ...existing imports...
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
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Addblogger = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
  });
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [errorSB1, setErrorSB1] = useState(false);

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
      content="Please fill all fileds"
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


    if (name === 'blog_owner_name' && value !== '' && /\d/.test(value)) {
      return;
    }

    if (name === 'mobile_number' && (value.length > 10)) {
      return;
    }

    if (e.target.name === "image") {
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
  const [previewImage, setPreviewImage] = useState("https://dummyimage.com/200x200/cccccc/ffffff");

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    // Check if a file is selected
    if (selectedFile) {
      // Check if the file type is an image
      if (selectedFile.type.startsWith('image/')) {
        setFormData((prevData) => ({
          ...prevData,
          blog_owner_photo: selectedFile,
        }));

        // Generate preview image URL
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // If the file type is not an image, show an error or handle accordingly
        console.error('Please select an image file.');
      }
    } else {
      // If no file is selected, reset the preview image
      setFormData((prevData) => ({
        ...prevData,
        blog_owner_photo: null,
      }));
      setPreviewImage("https://dummyimage.com/200x200/cccccc/ffffff");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[A-Z0-9.+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValidEmail = emailRegex.test(formData.emai_id);



    if (!formData.blog_owner_name || !formData.mobile_number || !formData.emai_id || !formData.city || !formData.state || !formData.country || !formData.blog_owner_photo) {
      openErrorSB();
      return;
    }

    if (!isValidEmail) {
      openErrorSB1();
      return;
    }


    try {
      const token = localStorage.getItem("sytAdmin");
      const formDataToSend = new FormData();
      formDataToSend.append("blog_owner_name", formData.blog_owner_name);
      formDataToSend.append("mobile_number", formData.mobile_number);
      formDataToSend.append("emai_id", formData.emai_id);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("blog_owner_photo", formData.blog_owner_photo);

      const response = await axios.post(
        `${BASE_URL}blogger/`,
        formDataToSend,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.status === "OK") {
        openSuccessSB();
        navigate("/blogger");
      }
    } catch (error) {
    }
    setFormData({
      title: "",
      image: null,
    });
    setPreviewImage("https://dummyimage.com/200x200/cccccc/ffffff");
  };
  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
  };

  // Add these states after your existing useState declarations
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Add this useEffect to load countries when component mounts
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Add these handler functions
  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    const countryName = countries.find(country => country.isoCode === countryCode)?.name;
    
    setFormData(prev => ({
      ...prev,
      country: countryName,
      state: '',
      city: ''
    }));

    const countryStates = State.getStatesOfCountry(countryCode);
    setStates(countryStates);
    setCities([]);
  };

  const handleStateChange = (event) => {
    const stateCode = event.target.value;
    const stateName = states.find(state => state.isoCode === stateCode)?.name;
    
    setFormData(prev => ({
      ...prev,
      state: stateName,
      city: ''
    }));

    const countryCities = City.getCitiesOfState(
      states[0]?.countryCode,
      stateCode
    );
    setCities(countryCities);
  };

  const handleCityChange = (event) => {
    const cityName = event.target.value;
    setFormData(prev => ({
      ...prev,
      city: cityName
    }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Insert title
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form
            // component="form"

            style={style1}
            role="form"
            className="form_container demo"
          >
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Enter Blogger Name"
                name="blog_owner_name"
                value={formData.blog_owner_name}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "12px" }}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" className="mb-3">
              <MDBox
                component="img"
                src={previewImage}
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
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Enter mobile number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
                inputProps={{ maxLength: 10 }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Enter email"
                name="emai_id"
                value={formData.emai_id}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
              />
            </MDBox>
            <MDBox mb={2}>
  <FormControl fullWidth style={{ marginBottom: "20px" }}>
    <InputLabel sx={{ fontSize: "14px" }}>Country</InputLabel>
    <Select
      value={countries.find(country => country.name === formData.country)?.isoCode || ''}
      label="Country"
      onChange={handleCountryChange}
      sx={{
        height: "45px",
        backgroundColor: "transparent",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#d2d6da",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#b8b8b8",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#318cf1",
        },
        "& .MuiSelect-select": {
          fontSize: "14px",
          padding: "10px 14px",
        }
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 250,
            "& .MuiMenuItem-root": {
              fontSize: "14px",
              padding: "8px 16px",
            }
          }
        }
      }}
    >
      {countries.map((country) => (
        <MenuItem key={country.isoCode} value={country.isoCode}>
          {country.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</MDBox>

<MDBox mb={2}>
  <FormControl fullWidth style={{ marginBottom: "20px" }}>
    <InputLabel sx={{ fontSize: "14px" }}>State</InputLabel>
    <Select
      value={states.find(state => state.name === formData.state)?.isoCode || ''}
      label="State"
      onChange={handleStateChange}
      disabled={!formData.country}
      sx={{
        height: "45px",
        backgroundColor: "transparent",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#d2d6da",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#b8b8b8",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#318cf1",
        },
        "& .MuiSelect-select": {
          fontSize: "14px",
          padding: "10px 14px",
        }
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 250,
            "& .MuiMenuItem-root": {
              fontSize: "14px",
              padding: "8px 16px",
            }
          }
        }
      }}
    >
      {states.map((state) => (
        <MenuItem key={state.isoCode} value={state.isoCode}>
          {state.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</MDBox>

<MDBox mb={2}>
  <FormControl fullWidth style={{ marginBottom: "20px" }}>
    <InputLabel sx={{ fontSize: "14px" }}>City</InputLabel>
    <Select
      value={formData.city || ''}
      label="City"
      onChange={handleCityChange}
      disabled={!formData.state}
      sx={{
        height: "45px",
        backgroundColor: "transparent",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#d2d6da",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#b8b8b8",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#318cf1",
        },
        "& .MuiSelect-select": {
          fontSize: "14px",
          padding: "10px 14px",
        }
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 250,
            "& .MuiMenuItem-root": {
              fontSize: "14px",
              padding: "8px 16px",
            }
          }
        }
      }}
    >
      {cities.map((city) => (
        <MenuItem key={city.name} value={city.name}>
          {city.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                onClick={handleSubmit}
              >
                Submit
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

export default Addblogger;
