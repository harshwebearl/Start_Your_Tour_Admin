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
import { BASE_URL } from "BASE_URL";
import { Box, FormControl , Typography , TextField  } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Margin } from "@mui/icons-material";
// import
const Edit_place_to_visit = () => {
  // post api
  const [open, setOpen] = useState(false);
  const [insertPlace, setInsertPLace] = useState({
    name: "",
    destination_id: "",
    photo: "",
    description: "",
  });

  const AddPlace = (e) => {
    const { name, value } = e.target;
    setInsertPLace({ ...insertPlace, [name]: value });
  };

  const Place_to_visit = async (e) => {
    e.preventDefault();
    const { name, destination_id, photo, description } = insertPlace;

    const res = await fetch(`${BASE_URL}placetovisit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        destination_id,
        description,
        photo,
        role: "agency",
      }),
    });
    const data = await res.json();
  };

  // get api of select

  const [destination, setDestination] = useState([]);
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
  };

  // get api
  const getDetail = async () => {
    const token = localStorage.getItem("sytAdmin");

    const res = await fetch(`${BASE_URL}placetovisit/details?_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setFormData({
      photo: data.data.photo,
      title: data.data?.[0]?.name,
      description: data.data?.[0]?.description,
      destination_id: data.data?.[0]?.destination_id,
    });
    // setDestination(data.data);
  };
  useEffect(() => {
    Dest();
    getDetail();
  }, []);

  const txt = (e) => {
    const { name, value } = e.target;
    setSclt({ ...slct, [name]: value });
  };

  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    photo: "",
    title: "",
    description: "",
    destination_id: "", // Empty array for storing checked feature _ids
  });

  console.log(formData);

  const handleOptionChange = (event) => {
    const { name, value, files } = event.target;
    const selectedValue = event.target.value;
    if (name === "title") {
      const isValidInput =
        /^[A-Za-z\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]*$/.test(value);
      if (!isValidInput) {
        return;
      }
    }
    if (name === "photo") {
      setImagePreview(URL.createObjectURL(files[0]));
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else if (name == "destination_id") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        destination_id: selectedValue,
      }));
    } else {
      setFormData((prevFormData) => ({
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
      title="Successfull Added"
      content="Category is successfully added."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  const { id } = useParams();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.title) {
      openErrorSB();
      return;
    }

    try {
      const token = localStorage.getItem("sytAdmin");
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("destination_id", formData.destination_id);

      if (typeof formData.photo === "object") {
        // Only append the photo if it's a new file
        formDataToSend.append("photo", formData.photo);
      }

      const response = await axios.put(
        `${BASE_URL}placetovisit?_id=${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "OK") {
        openSuccessSB();
        navigate("/manage-place-to-visit");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // for edit put api end

  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF"
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("sytAdmin");
      const responseDelete = await axios.delete(
        `${BASE_URL}placetovisit/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (responseDelete.data.status === "OK") {
        navigate("/manage-place-to-visit");
      }
    } catch (error) {}
  };

  //   Delete api close
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={1}>
          <MDTypography variant="h4" fontWeight="bold">
            Edit Place To Visit
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3}>
          <form style={style1} role="form" className="form_container demo2">
          <Box mb={2}>
            <FormControl fullWidth sx={{ borderRadius: "10px" }}>
                <Select
                    name="destination_id"
                    value={formData.destination_id || ""}
                    onChange={handleOptionChange}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    displayEmpty
                    IconComponent={() => (open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    sx={{
                        border: "0px solid #d2d6da", // Default border color
                        borderRadius: "10px",
                        padding: "11px 10px",
                        backgroundColor: "white",
                        "&.Mui-focused": {
                            border: "0px solid #3790ee", // Change border color when clicked
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 200, // Enable vertical scrolling
                                overflowY: "auto",
                            },
                        },
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
            <div
              className="mb-2"
              style={{ height: "50px", width: "50px", borderRadius: "50%" }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt=""
                  style={{ height: "50px", width: "50px", borderRadius: "50%" }}
                />
              ) : (
                <img
                  src={formData?.photo}
                  alt=""
                  style={{ height: "50px", width: "50px", borderRadius: "50%" }}
                />
              )}
            </div>
            <MDBox>
              <label
                htmlFor="file"
                className="mb-1 "
                style={{ fontWeight: "500" }}
              >
                Upload Image
              </label>
              <MDInput
                type="file"
                label=""
                name="photo"
                // value={formData.photo}
                onChange={handleOptionChange}
                fullWidth
                style={{ marginBottom: "20px" }}
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
                name="title"
                value={formData.title}
                onChange={handleOptionChange}
                fullWidth
                style={{ marginBottom: "20px" }}
              />
            </MDBox>
            <Box mb={2}>
            {/* Label */}
            <Typography sx={{ fontWeight: 500, marginBottom: 1 }}>
                Enter Description
            </Typography>

            {/* Material UI TextArea */}
            <TextField
                name="description"
                value={formData.description}
                onChange={handleOptionChange}
                placeholder="Type here..."
                multiline
                rows={7}
                fullWidth
                sx={{
                    "& .MuiOutlinedInput-root": {
                        color: "rgb(122 131 139)",
                        borderRadius: "6px",
                        fontSize: "14px", // Default border color
                        // Hover effect
                        "&.Mui-focused fieldset": { borderColor: "#3089ec", borderWidth: "2px" }, // Focus effect
                    },
                }}
            />
        </Box>
            <MDBox className="d-flex" mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
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

export default Edit_place_to_visit;
