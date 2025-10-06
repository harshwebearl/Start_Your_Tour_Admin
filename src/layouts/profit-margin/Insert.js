import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import countries from "../../CountryStateCity.json";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Down arrow
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const AddProfitMargin = () => {
  const { _id } = useParams();

  const states = countries.find((e) => e.name === "India");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [formData, setFormData] = useState({
    category: "",
    margins: months.reduce(
      (acc, month) => ({
        ...acc,
        [month]: { user: "", agency: "" },
      }),
      {}
    ),
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
      title="Operation Successful"
      content={`Profit margin has been ${
        _id ? "updated" : "added"
      } successfully.`}
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
      title="Error"
      content="Please fill all fields correctly."
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
    const { name, value } = e.target;
    const [month, role] = name.split("-");
    
    // Prevent leading zeros and minus signs
    if (value.startsWith('0') || value.includes('-')) return;
    
    // Only allow numbers and decimal point
    if (!/^\d*\.?\d*$/.test(value) && value !== '') return;
  
    setFormData((prevData) => ({
      ...prevData,
      margins: {
        ...prevData.margins,
        [month]: {
          ...prevData.margins[month],
          [role]: value,
        },
      },
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      category: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allMarginsFilled = Object.values(formData.margins).every(
      (margin) => margin.user && margin.agency
    );

    if (!allMarginsFilled) {
      openErrorSB();
      return;
    }

    const month_and_margin_user = months.map((month) => ({
      month_name: month,
      margin_percentage: formData.margins[month].user,
    }));

    const month_and_margin_agency = months.map((month) => ({
      month_name: month,
      margin_percentage: formData.margins[month].agency,
    }));

    try {
      const token = localStorage.getItem("sytAdmin");

      const url = _id
        ? `${BASE_URL}api/package_profit_margin/update/${_id}`
        : `${BASE_URL}api/package_profit_margin/create`;

      const method = _id ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        data: {
          state_name: formData.category,
          month_and_margin_user: month_and_margin_user,
          month_and_margin_agency: month_and_margin_agency,
        },
        headers: {
          Authorization: token,
        },
      });

      if (response.data.success) {
        openSuccessSB();
        setTimeout(() => {
          navigate("/profit-margin");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
  };

  useEffect(() => {
    if (_id) {
      const fetchAllData = async () => {
        try {
          const token = localStorage.getItem("sytAdmin");
          const response = await axios.get(
            `${BASE_URL}api/package_profit_margin/getById/${_id}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          const data = response.data.data;
          if (data) {
            setFormData({
              category: data.state_name,
              margins: months.reduce((acc, month) => {
                const userMargin =
                  data.month_and_margin_user.find((m) => m.month_name === month)
                    ?.margin_percentage || "";
                const agencyMargin =
                  data.month_and_margin_agency.find(
                    (m) => m.month_name === month
                  )?.margin_percentage || "";
                return {
                  ...acc,
                  [month]: { user: userMargin, agency: agencyMargin },
                };
              }, {}),
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchAllData();
    }
  }, [_id]);
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center">
          <MDTypography variant="h4" fontWeight="bold">
            {_id ? "Update Profit Margin" : "Insert Profit Margin"}
          </MDTypography>
        </MDBox>
       <MDBox
  pt={4}
  pb={3}
  
  display="flex"
  justifyContent="center"
>
  <form
    style={{
      ...style1,
      width: "100%",
      maxWidth: "900px", // or adjust to your liking (e.g. 1000px)
      margin: "0 auto",
      padding: "20px",
      borderRadius: "10px",
      boxSizing: "border-box",
    }}
    role="form"
    className="form_container demo"
  >
            {/* Dropdown for category */}

            <FormControl
              fullWidth
              sx={{
                minWidth: { xs: "100%", sm: "200px", md: "250px" }, // Responsive width
              }}
            >
              <Select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                displayEmpty
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                IconComponent={() =>
                  open ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
                sx={{
                  borderRadius: "6px",
                  border: "none",
                  color: "rgb(122 131 139)",
                  height: "40px",
                  paddingRight: "10px",
                  backgroundColor: "#f0f4fa",
                  "& .MuiSelect-icon": {
                    right: "10px",
                    color: "rgb(122 131 139)",
                  },
                  margin: "0px 0px 10px 0px",
                  width: "100%", // Ensures responsiveness
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select State
                </MenuItem>
                {states?.states.map((e) => (
                  <MenuItem key={e.name} value={e.name}>
                    {e.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Table-like layout for margins */}
            <MDBox mb={2} sx={{ overflowX: "auto" }} >
              <Grid container spacing={2} alignItems="center" sx={{ minWidth: "600px" }}>
                <Grid item xs={4}>
                  <MDTypography  variant="h6" fontWeight="bold">
                    Month
                  </MDTypography>
                </Grid>
                <Grid item xs={4}>
                  <MDTypography variant="h6" fontWeight="bold">
                    User Margin
                  </MDTypography>
                </Grid>
                <Grid item xs={4}>
                  <MDTypography variant="h6" fontWeight="bold">
                    Agency Margin
                  </MDTypography>
                </Grid>
              </Grid>
              {months.map((month) => (
                <Grid container spacing={2} mb={2} alignItems="center" key={month} sx={{ minWidth: "600px" }}>
                  <Grid item xs={4}>
                    <MDTypography variant="body1">{month}</MDTypography>
                  </Grid>
                  <Grid item xs={4}>
                    <MDInput
                      type="number"
                      label=""
                      name={`${month}-user`}
                      value={formData.margins[month].user}
                      onChange={handleChange}
                      fullWidth
                      inputProps={{
                        min: 1,
                        max: 100,
                        step: 0.01,
                        style: {
                          MozAppearance: 'textfield',
                        },
                      }}
                      sx={{
                        '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                        },
                      }}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || (e.key === '0' && !e.target.value)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        const pastedValue = e.clipboardData.getData('text');
                        if (pastedValue.startsWith('0') || !/^\d*\.?\d*$/.test(pastedValue)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <MDInput
                      type="text"
                      label=""
                      name={`${month}-agency`}
                      value={formData.margins[month].agency}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                onClick={handleSubmit}
              >
                {_id ? "Update" : "Submit"}
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

export default AddProfitMargin;
