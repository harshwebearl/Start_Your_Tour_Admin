import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
import Icon from "@mui/material/Icon";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";

// import
const Allfaqs = () => {
  const [photo_title, setPhoto_title] = useState("");

  const Call = async (ele) => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(`${BASE_URL}faqs`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setPhoto_title(data.data);
  };

  useEffect(() => {
    Call();
  }, []);

  const shouldShowAddButton = () => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    return screenWidth < 650;
  };

  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);
  const [formData, setFormData] = useState({
    photo: "",
    title: "",
    description: "",
    destination_id: "", // Empty array for storing checked feature _ids
  });
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
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleOptionChange = (event) => {
    const { name, value, files } = event.target;
    const selectedValue = event.target.value;
    if (name === "photo") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0], // Store the first selected file
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
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await axios.put(
        `${BASE_URL}placetovisit?_id=${id}`,
        { ...formData, name: formData.title },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.status === "OK") {
        openSuccessSB();
        navigate("/manage-place-to-visit");
      }
    } catch (error) {
      console.log(error);
      // Handle error or show an error message
    }
    setFormData({
      photo: null,
      title: "",
      description: "",
      destination_id: "", // Empty array for storing checked feature _ids
    });
  };

  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDBox
           display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection={{ xs: "column", sm: "row" }}
          textAlign="center"
          mb={2}
          gap={2}
          >
            <MDTypography variant="h4" fontWeight="bold">
              FAQS
            </MDTypography>
            <Link to="/add-new-faqs" style={{ textDecoration: "none" }}>
              <MDButton
                variant="gradient"
                color="dark"
                 sx={{
          padding: "6px 16px",
          fontSize: "14px",
          minWidth: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
              >
                <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                &nbsp;{shouldShowAddButton() ? "" : "add new faqs"}
              </MDButton>
            </Link>
          </MDBox>
        </MDBox>
        
        <MDBox pt={4} pb={3}>
          <div
            className="container-fluid "
            style={{ backgroundColor: "white", borderRadius: "25px" }}
          >
            <div className="row mx-[5px] md:mx-1 py-3 gy-4">
              {photo_title &&
                photo_title.map((ele) => (
                  <div className="col-12">
                    <div
                      className="p-3 p-sm-2 p-md-3 position-relative"
                      style={{
                        backgroundColor: "aliceblue",
                        borderRadius: "10px",
                        width: "100%",
                      }}
                    >
                      <h3 className="fs-5 fs-sm-6 fs-md-4 fs-lg-3 fw-bold">
                        Q. {ele.question}
                      </h3>
                      <p className="fs-6 fs-sm-7 fs-md-5 fs-lg-4 text-wrap">
                        ANS. {ele.answer}
                      </p>

                      {/* "Edit" Button with Responsive Positioning */}
                      <NavLink to={`/edit-faqs/${ele._id}`}>
                        <button
                          className="border border-secondary rounded-2 px-3 py-1 fs-6 fw-medium shadow-sm d-none d-md-block"
                          style={{
                            backgroundColor: "white",
                            position: "absolute",
                            top: "10px", // Default positioning for large screens
                            right: "10px", // Default positioning for large screens
                            zIndex: 10,
                          }} // Hide on small screens
                        >
                          Edit
                        </button>
                      </NavLink>

                      {/* "Edit" Button for Mobile Devices */}
                      <div className="d-md-none mt-3 d-flex justify-content-center">
                        <NavLink to={`/edit-faqs/${ele._id}`}>
                          <button
                            className="border border-secondary rounded-2 px-3 py-[3px] fs-6 fw-medium shadow-sm"
                            style={{
                              backgroundColor: "white",
                            }}
                          >
                            Edit
                          </button>
                        </NavLink>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default Allfaqs;
