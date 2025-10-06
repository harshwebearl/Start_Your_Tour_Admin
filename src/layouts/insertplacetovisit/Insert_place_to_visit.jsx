import React, { useEffect, useState } from "react";
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
import { Box, FormControl } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { TextField, Typography } from "@mui/material";

const Insert_place_to_visit = () => {
  const [open, setOpen] = useState(false);
  // post api
  const [formData1, setFormData1] = useState({
    name: "",
    // destination_id: "",
    photo: null,
    description: "",
  });
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);
  const handleOptionChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "name") {
      // Use a regular expression to match only alphabets and symbols
      const isValidInput =
        /^[A-Za-z\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]*$/.test(value);

      // If the input is not valid, do not update the state
      if (!isValidInput) {
        return;
      }
    }

    if (name === "photo") {
      setFormData1((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setFormData1((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
    console.log(formData1);
  };

  const AddPlace = (e) => {
    const { name, value } = e.target;
    setInsertPLace({ ...insertPlace, [name]: value });
  };
  // console.log(insertPlace);

  const Place_to_visit = async (e) => {
    e.preventDefault();
    if (!formData1.name || !formData1.description || !formData1.photo) {
      openErrorSB();
      return;
    }
    e.preventDefault();
    const token = localStorage.getItem("sytAdmin");
    const formData = new FormData();
    formData.append("name", formData1.name);
    formData.append("description", formData1.description);
    formData.append("photo", formData1.photo);
    formData.append("destination_id", selectedDestinationId);
    const response = await axios.post(`${BASE_URL}placetovisit`, formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data.data);
    if (response.data.status === "OK") {
      openSuccessSB();
      navigate("/manage-place-to-visit");
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

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: selectedImage,
    }));
  };
  // get api of select

  const [destination, setDestination] = useState([]);
  console.log(destination);
  const [slct, setSclt] = useState({
    Destinations: "",
  });

  const Dest = async () => {
    const token = localStorage.getItem("sytAdmin");

    const res = await fetch(`${BASE_URL}destination/alldestination`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setDestination(data.data);
    console.log(data.data);
  };

  useEffect(() => {
    Dest();
  }, []);

  const [selectedDestinationId, setSelectedDestinationId] = useState("");

  const handleSelect = (event) => {
    const selectedId = event.target.value; // Get the selected option's ID
    setSelectedDestinationId(selectedId); // Update the state with the selected ID
  };
  console.log(selectedDestinationId);

  // const [formData, setFormData] = useState({
  //     destination_name: "",
  //     how_to_reach: "",
  //     about_destination: "",
  //     best_time_for_visit: "",
  //     destination_category_id: [], // Empty array for storing checked feature _ids
  // });

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        // const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}destinationcategory`);

        setCategory(response.data.data);
        setIsLoading(false);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryList();
  }, []);
  // console.log(formData);

  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
    padding: "30px 20px",
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Insert Place To Visit
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} >
          <form
            // component="form"

            style={style1}
            role="form"
            className="form_container demo2"
          >
            <Box mb={2}>
              <FormControl fullWidth sx={{ borderRadius: "10px" }}>
                <Select
                  onChange={handleSelect}
                  onOpen={() => setOpen(true)}
                  onClose={() => setOpen(false)}
                  defaultValue=""
                  displayEmpty
                  IconComponent={() =>
                    open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200, // Limits height of dropdown
                        overflowY: "auto", // Enables vertical scrolling
                      },
                    },
                  }}
                  sx={{
                    border: "0px solid grey",
                    borderRadius: "10px",
                    padding: "7px 10px",
                    height: "40px",
                    backgroundColor: "white",
                  }}
                >
                  <MenuItem disabled value="">
                    Select Destination
                  </MenuItem>
                  {destination.map((ele) => (
                    <MenuItem key={ele._id} value={ele._id}>
                      {ele.destination_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <MDBox>
              <label
                htmlFor="file"
                className="mb-1 "
                style={{ fontWeight: "500" }}
              >
                Upload Image
              </label>

              <input
                type="file"
                name="photo"
                accept="image/jpeg , image/png"
                onChange={handleOptionChange}
                mb={2}
                style={{  width:"100%", padding:"7px 20px" , fontSize:"14px", border: "1px solid #d2d6da", borderRadius: "10px" }}
              />
            </MDBox>
            <MDBox>
              <label
                htmlFor="text"
                className="mb-1 "
                style={{ fontWeight: "500" }}
              >
                Enter Title
              </label>
              <MDInput
                type="text"
                name="name"
                value={formData1.name}
                onChange={handleOptionChange}
                fullWidth
                style={{ marginBottom: "20px" }}
              />
            </MDBox>
            <Box mb={2}>
              <Typography variant="body1" fontWeight={500} mb={1}>
                Enter Description
              </Typography>
              <TextField
                placeholder="Enter your description..."
                multiline
                rows={7}
                name="description"
                value={formData1.description}
                onChange={handleOptionChange}
                fullWidth
                sx={{
                  color: "rgb(122 131 139)",
                  border: "1px solid rgb(216, 216, 216)",
                  borderRadius: "6px",
                  "& .MuiOutlinedInput-root": {
                    padding: " 2px",
                    fontSize: "14px",
                  },
                }}
              />
            </Box>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                // component={Link}
                // to="/dashboard"
                type="submit"
                onClick={Place_to_visit}
              >
                Submit
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

export default Insert_place_to_visit;
