import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MDSnackbar from "components/MDSnackbar";
import MDInput from "components/MDInput";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { BASE_URL } from "BASE_URL";

const Addcareercategory = () => {
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [careerData, setCareerData] = useState({
    career_cat_value: "",
  });

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const navigate = useNavigate();

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

  const handleAdd = (e) => {
    const { name, value } = e.target;
    setCareerData({ ...careerData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await fetch(`${BASE_URL}api/career_category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Make sure to use "Bearer" before the token
        },
        body: JSON.stringify({
          career_cat_value: careerData.career_cat_value, // Access the value from careerData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTimeout(() => {
          navigate("/insertcareer")
        }, 2000);

        openSuccessSB();
      } else {
        // Show error message
        openErrorSB();
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error (show error message or take other actions)
      openErrorSB();
    }
  };

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Insert Career Category
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form
            style={style1}
            role="form"
            className="form_container demo"
          >
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Enter Career Title"
                name="career_cat_value"
                fullWidth
                style={{ marginBottom: "20px" }}
                onChange={handleAdd}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="button" // Change the type to "button"
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

export default Addcareercategory;
