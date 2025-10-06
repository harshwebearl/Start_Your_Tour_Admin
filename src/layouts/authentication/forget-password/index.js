import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDSnackbar from "components/MDSnackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MDInput from 'components/MDInput'; // Keeping MDInput component
import bgImage from 'assets/images/bg-sign-in-basic.jpeg';
import BasicLayout from '../components/BasicLayout';
import { BASE_URL } from 'BASE_URL';
import axios from 'axios';
import { CircularProgress } from "@mui/material";

function Basic() {

  const [successMessage, setSuccessMessage] = useState("")
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull"
      content={successMessage}
      dateTime="1 sec ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const [errorMessage, setErrorMessage] = useState("")
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);


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

  const [show, setShow] = useState(false);
  const [contactNumber, setContactNumber] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [loading, setLoading] = useState(false)
  const [sentOtp, setSentOtp] = useState(null)

  const handleContactNumberChange = (e) => {
    const value = e.target.value;
    const newValue = value !== '' ? value : null;
    setContactNumber(newValue?.slice(0, 10));
  };

  const handleOtp = async () => {
    if (!contactNumber) {
      setErrorMessage("Please Enter Contact Number");
      openErrorSB();
      return;
    }
    if (Number(contactNumber) !== 9904824382) {
      setErrorMessage("Please Enter Correct Number");
      openErrorSB();
      return;
    }
    if (contactNumber.length < 10) {
      setErrorMessage("Please Enter Valid Contact Number");
      openErrorSB();
      return;
    }

    setLoading(true); // Start the loader

    try {
      const response = await axios.post(`${BASE_URL}admin/send-otp`, {
        contact: contactNumber,
      });

      if (response.status === 200) {
        handleShow();
        setSuccessMessage("Otp Sent Successfully");
        openSuccessSB();
        setLoading(false);
      } else {
        setErrorMessage("There Is a Problem In Sending Otp!");
        openErrorSB();
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage("There Is a Problem In Sending Otp!");
      openErrorSB();
    } finally {
      setLoading(false); // Stop the loader when the request is finished
    }

  };

  const [disable, setDisable] = useState(false)

  const handleOtpSubmit = async () => {
    // console.log(Number(otpInput))
    // console.log(Number(sentOtp))
    // if (Number(otpInput) === Number(sentOtp)) {
    //   setIsOtpVerified(true);
    //   handleClose();
    // } else {
    //   setErrorMessage("Otp Not Matched!");
    //   openErrorSB();
    // }

    try {
      const response = await axios.post(`${BASE_URL}admin/verify-otp`, {
        contact: Number(contactNumber),
        otp: Number(otpInput),
      });

      if (response.status === 200) {
        setDisable(true)
        setIsOtpVerified(true);
        handleClose();
      }
    } catch (error) {
      setDisable(false)
      setErrorMessage("Otp Not Matched!");
      openErrorSB();
    }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmitNewPassword = async () => {
    if (newPassword.trim() === '') {
      setErrorMessage("Please Enter New Password");
      openErrorSB();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}admin/forgetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: Number(contactNumber), new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password updated successfully");
        openSuccessSB();
        setTimeout(() => {
          navigate("/authentication/sign-in");
        }, 2000);
      } else {
        setErrorMessage(data?.message || "Failed to update password");
        openErrorSB();
      }
    } catch (error) {
      setErrorMessage("There Is A Problem In Updating Password");
      openErrorSB();
    } finally {
      setLoading(false);
    }
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
            Forget Password
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}></Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="tel"
                label="Contact Number"
                onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} // This line removes non-numeric characters
                name="contactNumber"
                value={contactNumber}
                onChange={handleContactNumberChange}
                fullWidth
                disable={disable}
              />
            </MDBox>
            {isOtpVerified && (
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Enter New Password"
                  name="new_password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  fullWidth
                />
              </MDBox>
            )}
            <MDBox mt={4} mb={1}>
              {!isOtpVerified ? (
                <MDButton onClick={handleOtp} variant="gradient" fullWidth color="info" disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Send Otp"}
                </MDButton>
              ) : (
                <MDButton onClick={handleSubmitNewPassword} variant="gradient" fullWidth color="info">
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                </MDButton>
              )}
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <Dialog
        open={show}
        onClose={handleClose}
        fullWidth
        maxWidth="xs" // You can adjust this value, like 'xs', 'sm', 'md', 'lg', 'xl'
      >
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <MDInput
            type="Number"
            label="Enter OTP"
            name="otpInput"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" style={{ color: "#fff" }} onClick={handleOtpSubmit}>
            Submit OTP
          </Button>
          <Button variant="outlined" style={{ color: "#b8b8b8" }} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {renderSuccessSB}
      {renderErrorSB}
    </BasicLayout>
  );
}

export default Basic;
