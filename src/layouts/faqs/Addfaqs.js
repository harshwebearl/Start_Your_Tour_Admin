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
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import { TextField } from "@mui/material";
// import
const Addfaqs = () => {
  const [formData, setFormData] = useState({
    category: "",
    image: null,
  });
  const [successSB, setSuccessSB] = useState(false);
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
      content="FAQs is successfully added."
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
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      // If category or image is not filled, show the success snackbar and return
      openErrorSB();
      return;
    }
    try {
      const token = localStorage.getItem("sytAdmin");

      const response = await axios.post(
        `${BASE_URL}faqs`,
        {
          question: formData.question,
          answer: formData.answer,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.status === "OK") {
        openSuccessSB();
        setTimeout(() => {
          navigate("/faqs");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      // Handle error or show an error message
    }

    // Reset the form fields
    setFormData({
      question: "",
      answer: "",
    });
  };
  const style1 = {
    //   // Adding media query..
    //   width: "40%",
    //   margin: "auto",
    //   padding: "2rem",
    //   borderRadius: "5%",
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
    //   "@media (max-width: 700px)": {
    //     width: "100%",
    //   },
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Insert FAQS
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
                label="Question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
              />
            </MDBox>
            <MDBox mb={2}>
              {/* <MDInput
                                type="text"
                                label="answer"
                                name="answer"
                                value={formData.answer}
                                onChange={handleChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            /> */}

              <TextField
                placeholder="Answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                multiline
                rows={7}
                fullWidth
                sx={{
                  color: "rgb(122 131 139)",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                    fontSize: "14px",
                    border: "0px solid rgb(216, 216, 216)",
                    transition: "border-color 0.2s ease-in-out",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgb(216, 216, 216)",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#1a73e8", // Changes border color on focus (click)
                    },
                }}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                // component={Link}
                // to="/dashboard"
                type="submit"
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
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default Addfaqs;
