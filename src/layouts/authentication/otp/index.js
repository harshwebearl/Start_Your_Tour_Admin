/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// added
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [errorSB, setErrorSB] = useState(false);
  const [errorSB1, setErrorSB1] = useState(false);

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const openErrorSB1 = () => setErrorSB1(true);
  const closeErrorSB1 = () => setErrorSB1(false);
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successful Login"
      content="Login Successfully."
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
      title="Please enter valid userId and Password"
      content="Invalid Id or Password"
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
      title="Empty input error"
      content="Please fill all the fields"
      dateTime="1 sec ago"
      open={errorSB1}
      onClose={closeErrorSB1}
      close={closeErrorSB1}
      bgWhite
    />
  );

  // const [formData, setFormData] = useState({
  //   contactNumber: "",
  //   password: "",
  // });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      openErrorSB1();
      return;
    }
    navigate("/authentication/reset-password");
    // try {
    // const data = {
    //   contact_no: formData.contactNumber, // Pass contactNumber as contact_no
    //   password: formData.password,
    // };

    // const response = await axios.post(
    //   "https://metrimonial.onrender.com/api/admin/login",
    //   data
    // );
    // if (response.data.status === "OK") {
    //   openSuccessSB();
    //   localStorage.setItem("token", response.data.data.token);
    //   navigate("/dashboard");
    // } else {
    //   // Handle invalid login credentials
    //   openErrorSB();
    // }
    // } catch (error) {
    // Handle error
    // openErrorSB();
    // }
  };
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            OTP
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}></Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="otp"
                name="otp"
                value={otp}
                onChange={handleChange}
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                onClick={handleSubmit}
                style={{ color: "white", borderRadius: "0.5rem" }}
                variant="gradient"
                fullWidth
                color="info"
              >
                Submit
              </MDButton>
            </MDBox>
            {renderSuccessSB}
            {renderErrorSB}
            {renderErrorSB1}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
