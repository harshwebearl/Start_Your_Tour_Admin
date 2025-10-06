import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import {
  Box,
  Select,
  MenuItem,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { List, ListItem } from "@mui/material";
const AddCareer = () => {
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [selectedCareerCategory, setSelectedCareerCategory] = useState("");
  const [careerData, setCareerData] = useState({
    career_title: "",
    career_desc: "",
    career_tag: [],
  });

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfully Added"
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
      title="Fill Error"
      content="Please fill all fields"
      dateTime="1 sec ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const history = useNavigate();

  const handleNavigate = () => {
    history("/insertcareercategory");
  };

  const handleAdd = (e) => {
    const { name, value } = e.target;
    setCareerData({ ...careerData, [name]: value });
  };

  const handleSubmit = async () => {
    const { career_title, career_tag, career_desc } = careerData;

    try {
      const token = localStorage.getItem("sytAdmin");
      const res = await fetch(`${BASE_URL}api/career`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          career_title,
          career_desc,
          career_tag,
          career_category_id: selectedCareerCategory,
        }),
      });

      if (res.code === 200) {
        const res = await res.json();
        openSuccessSB();
        setTimeout(() => {
          navigate("/career");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      openErrorSB();
    }
  };

  const [Yay, setYay] = useState([]);

  const Call = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/career_category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setYay(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching career categories:", error);
    }
  };

  useEffect(() => {
    Call();
  }, []);

  const [additionalValue, setAdditionalValue] = useState("");

  const handleAddButtonClick = (e) => {
    e.preventDefault(); // Prevent form submission or default behavior
    if (additionalValue.trim() !== "") {
      setCareerData({
        ...careerData,
        career_tag: [...careerData.career_tag, additionalValue],
      });
      setAdditionalValue("");
    } else {
      openErrorSB();
    }
  };

  const handleRemoveButtonClick = (index, e) => {
    e.preventDefault(); // Prevent form submission or default behavior
    const updatedCareerTags = [...careerData.career_tag];
    updatedCareerTags.splice(index, 1);
    setCareerData({
      ...careerData,
      career_tag: updatedCareerTags,
    });
  };
const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 420);

useEffect(() => {
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 420);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Insert Career
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form
            // style={{ backgroundColor: "rgb(26 46 79)" }}
            role="form"
            className="form_container demo"
          >
            <Box mb={2}>
              {/* Label */}
              <Typography sx={{ fontWeight: 500, marginBottom: 1 }}>
                Select Career Tag
              </Typography>

              <Box display="flex" alignItems="center">
                {/* Material UI Select */}
                <Select
                  value={selectedCareerCategory}
                  onChange={(e) => setSelectedCareerCategory(e.target.value)}
                  displayEmpty
                  fullWidth
                  sx={{
                    color: "#7b809a",
                    background: "transparent",
                    border: "0px solid #dadbda",
                    height: "40px",
                    padding: "0px 0px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#dadbda",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "blue",
                      borderWidth: "2px",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Career Tag
                  </MenuItem>
                  {Yay.map((e) => (
                    <MenuItem key={e._id} value={e._id}>
                      {e.career_cat_value}
                    </MenuItem>
                  ))}
                </Select>

                {/* "+" Button */}
                <Button
                  variant="contained"
                  sx={{
                    height: "40px",
                    width: "20px",
                    fontSize: "15px",
                    backgroundColor: "black !important", // Ensures black color stays
                    color: "#ffffff", // Corrected to pure white
                    borderRadius: "5px",
                    marginLeft: "5px",
                    boxShadow: "none", // Removes default Material UI shadow
                    "&:hover": {
                      backgroundColor: "black", // Keeps black on hover
                    },
                    "&:focus": {
                      backgroundColor: "black", // Keeps black on focus
                    },
                  }}
                  onClick={handleNavigate}
                >
                  +
                </Button>
              </Box>
            </Box>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Enter Career Title"
                name="career_title"
                fullWidth
                style={{ marginBottom: "20px" }}
                onChange={handleAdd}
              />
            </MDBox>
            <MDBox mb={2}>
              {/* <MDInput
                type="text"
                label="Enter Career Description"
                name="career_desc"
                fullWidth
                style={{ marginBottom: "20px" }}
                onChange={handleAdd}
              /> */}

              <TextField
                name="career_desc"
                onChange={handleAdd}
                placeholder="Enter Career Description"
                multiline
                rows={7}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "rgb(122 131 139)",
                    borderRadius: "6px", // Rounded corners
                    padding: "9px 10px",
                    fontSize: "14px",
                    "& fieldset": {
                      borderColor: "rgb(216, 216, 216)", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: "grey", // Border on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#318bec", // Border color on focus
                    },
                  },
                }}
              />
            </MDBox>

            {/* <MDBox mb={2}>
              <MDInput
                type="text"
                label="Enter Career Disc"
                name="career_tag"
                fullWidth
                style={{ marginBottom: "20px" }}
                onChange={handleAdd}
              />
            </MDBox> */}

            <div style={{ width: "100%" }}>
              {/* List of Tags */}
              <ul style={{ listStyle: "none", padding: 0 }}>
                {careerData?.career_tag.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #d2d6da",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      marginBottom: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    {item}
                    <button
                      onClick={(e) => handleRemoveButtonClick(index, e)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              {/* Input Field & Add Button */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isSmallScreen ? "column" : "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={additionalValue}
                  onChange={(e) => setAdditionalValue(e.target.value)}
                  placeholder="Add Tags..."
                  style={{
                    flex: 1,
                     width: "100%", // Makes input stretch to full container width
    padding: "10px",
    border: "1px solid #d2d6da",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box", // Prevents input from overflowing due to padding
                  }}
                />
               
                <button
                  onClick={handleAddButtonClick}
                  style={{
      background: "black",
      color: "white",
      border: "none",
      fontSize: "15px",
      padding: "8px 25px",
      borderRadius: "6px",
      cursor: "pointer",
      width: isSmallScreen ? "100%" : "auto",
      marginTop: isSmallScreen ? "10px" : "0px",
      marginLeft: isSmallScreen ? "0px" : "10px",
    }}
                >
                  Add
                </button>
              </div>
            </div>

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="button"
                onClick={handleSubmit}
              >
                Submit
              </MDButton>
              {renderSuccessSB}
              {renderErrorSB}
            </MDBox>
          </form>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
};

export default AddCareer;
