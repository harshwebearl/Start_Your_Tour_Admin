import React, { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { BASE_URL } from "BASE_URL";

const ManageCategory = () => {
  const [errors, setErrors] = React.useState({
    old_password: "",
  });

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    old_password: false,
    new_password: false,
  });

  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [errorSB1, setErrorSB1] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const openErrorSB1 = () => setErrorSB1(true);
  const closeErrorSB1 = () => setErrorSB1(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]:
        value.length < 6 || value.length > 8
          ? "Password must be 6 to 8 digits long"
          : "",
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("sytAdmin");
    if (!formData.old_password || !formData.new_password) {
      openErrorSB1();
      return;
    }
    try {
      const data = {
        new_password: formData.new_password,
        old_password: formData.old_password,
      };

      const response = await axios.put(`${BASE_URL}user/updatepassword`, data, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status === "OK") {
        openSuccessSB();
      } else {
        openErrorSB();
      }
    } catch (error) {
      openErrorSB();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Change Password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <div className="form_container demo">
            <MDBox mb={2}>
              <MDInput
                type={showPassword.old_password ? "text" : "password"}
                label="Old Password"
                name="old_password"
                value={formData.old_password}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,8}$/.test(value)) {
                    handleChange(e);
                  }
                }}
                fullWidth
                error={!!errors.old_password}
                helperText={errors.old_password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("old_password")}
                        edge="end"
                      >
                        {showPassword.old_password ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ minLength: 6, maxLength: 8 }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type={showPassword.new_password ? "text" : "password"}
                label="New Password"
                name="new_password"
                value={formData.new_password}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,8}$/.test(value)) {
                    handleChange(e);
                  }
                }}
                fullWidth
                error={!!errors.new_password}
                helperText={errors.new_password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("new_password")}
                        edge="end"
                      >
                        {showPassword.new_password ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ minLength: 6, maxLength: 8 }}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                onClick={(e) => {
                  if (
                    formData.old_password.length >= 6 &&
                    formData.old_password.length <= 8 &&
                    formData.new_password.length >= 6 &&
                    formData.new_password.length <= 8
                  ) {
                    handleSubmit(e);
                  } else {
                    openErrorSB1();
                  }
                }}
                style={{ color: "white", borderRadius: "0.5rem" }}
                variant="gradient"
                fullWidth
                color="info"
              >
                Submit
              </MDButton>
            </MDBox>
            <MDSnackbar
              color="success"
              icon="check"
              title="Successful Login"
              content="Password Changed Successfully."
              dateTime="1 sec"
              open={successSB}
              onClose={closeSuccessSB}
              close={closeSuccessSB}
              bgWhite
            />
            <MDSnackbar
              color="error"
              icon="warning"
              title="Please enter valid Old Password"
              content="Invalid Id or Password"
              dateTime="1 sec ago"
              open={errorSB}
              onClose={closeErrorSB}
              close={closeErrorSB}
              bgWhite
            />
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
          </div>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
};

export default ManageCategory;
