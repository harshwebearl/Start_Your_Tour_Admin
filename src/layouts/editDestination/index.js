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
import "./index.css";
import { BASE_URL } from "BASE_URL";
import ReactSelect from 'react-select';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Arrow Down
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"; // Arrow Up
import { FormControl , TextField  } from "@mui/material";

// import
const ManageCategory = () => {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    destination_name: "",
    how_to_reach: "",
    about_destination: "",
    best_time_for_visit: "",
    destination_category_id: [],
  });

  const [selectedOptions, setSelectedOptions] = useState([]);
  const selectedOptionsString = selectedOptions.map(option => option.label).join(', ');

  const handleSelectChange = (selectedValues) => {
    setSelectedOptions(selectedValues);

    setFormData((prevFormData) => ({
      ...prevFormData,
      best_time_for_visit: selectedOptionsString,
    }));
  };


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
      if (type === "text" && (/^[^\d]+$/).test(value) || value === "") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }
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
      title="Successfull Added"
      content="Category is successfully added."
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

  // get api

  const [myData, setMyData] = useState([]);

  const getData = async () => {
    const token = localStorage.getItem("sytAdmin")
    const res = await fetch(`${BASE_URL}destination?destination_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    })
    const data = await res.json();
    setFormData(data.data[0]);
    console.log(data.data);
  }

  // delete api


  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const responseDelete = await axios.delete(
        `${BASE_URL}destination/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (responseDelete.data.status === "OK") {
        navigate("/manage-destination");
      }
    } catch (error) {
    }
  };

  // end delete api 

  useEffect(() => {
    getData();
    const fetchCategoryList = async () => {
      try {
        // const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(
          `${BASE_URL}destinationcategory`
        );

        setCategory(response.data.data);
        setIsLoading(false);
      } catch (error) {
      }
    };
    fetchCategoryList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.destination_name ||
      !formData.how_to_reach ||
      !formData.about_destination ||
      !formData.best_time_for_visit
    ) {
      openErrorSB();
      return;
    }
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await axios.put(
        `${BASE_URL}destination/${id}`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.status === "OK") {
        openSuccessSB();
        setTimeout(() => {
          navigate("/manage-destination");
        }, 2000);
      }
    } catch (error) {
    }
    setFormData({
      destination_name: "",
      how_to_reach: "",
      about_destination: "",
      best_time_for_visit: "",
      destination_category_id: [], // Empty array for storing checked feature _ids
    });
  };

  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
  };


  const months = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid #ccc',
      borderRadius: '6px',
      width: '100%',
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: '#e2e8f0',
    }),
    placeholder: (provided, state) => ({
      ...provided,
      fontSize: '13px', // Set custom font size for placeholder
    }),
  };


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Update Destination
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} >
          <form
            // component="form"

            style={style1}
            role="form"
            className="form_container demo2"
          >
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="destination name"
                name="destination_name"
                value={formData.destination_name}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
              />
            </MDBox>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel id="how-to-reach-label">How To Reach</InputLabel>
      <Select
        labelId="how-to-reach-label"
        id="how-to-reach"
        value={formData.how_to_reach}
        onChange={handleChange}
        name="how_to_reach"
        label="How To Reach"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        IconComponent={() => (open ? <KeyboardArrowUpIcon /> : <ExpandMoreIcon />)}
        sx={{
          color: "rgb(122 131 139)",
          borderRadius: "6px",
          fontSize: "14px",
          height:"45px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(216, 216, 216)",
          },
        }}
      >
        <MenuItem value="">Select How To Reach</MenuItem>
        <MenuItem value="Train">Train</MenuItem>
        <MenuItem value="Flight">Flight</MenuItem>
        <MenuItem value="Bus">Bus</MenuItem>
        <MenuItem value="Car">Car</MenuItem>
      </Select>
    </FormControl>
            <MDBox mb={2}>

            <TextField
      label="About Destination"
      name="about_destination"
      value={formData.about_destination}
      onChange={handleChange}
      placeholder="About Destination"
      multiline
      rows={7} // Equivalent to rows="7"
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          color: "rgb(122 131 139)",
          borderRadius: "6px",
          fontSize: "14px",
          "& fieldset": {
            borderColor: "rgb(216, 216, 216)",
          },
        },
        "& .MuiInputLabel-root": {
          color: "rgb(122 131 139)",
        },
      }}
    />

            </MDBox>
            <MDBox mb={2}>

              <ReactSelect
                options={months}
                isMulti={true} // or simply isMulti
                placeholder="best time for visit"
                styles={customStyles}
                onChange={handleSelectChange}
                value={selectedOptions}
              />


            </MDBox>
            <MDBox mb={2}>
              <InputLabel style={{ marginBottom: "1rem" }}>
                Select Category
              </InputLabel>
              {category.map((feature) => (
                <MDBox key={feature._id} display="flex" alignItems="center">
                  <input
                    type="checkbox"
                    id={feature._id}
                    name={feature._id} // Use feature._id as the name
                    checked={formData.destination_category_id.includes(feature._id)} // Check if feature._id is present in the membership_feature_id array
                    onChange={handleChange}
                    style={{ marginRight: "10px" }}
                  />
                  <label
                    style={{ color: darkMode ? "#ffffffcc" : "" }}
                    htmlFor={feature._id}
                  >
                    {feature.category_name}
                  </label>
                </MDBox>
              ))}
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

export default ManageCategory;
