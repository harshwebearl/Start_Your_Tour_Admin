import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
import Carousel from "react-bootstrap/Carousel";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import Icon from "@mui/material/Icon";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import EditNoteIcon from "@mui/icons-material/EditNote";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";

// import
const Room = () => {
  const [city, setCity] = useState([]);
  const CityName = async () => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(`${BASE_URL}room_syt`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data.data);
    setCity(data.data);
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
    console.log(formData);
  };
  console.log(formData);
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

  useEffect(() => {
    CityName();
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
  const shouldShowAddButton = () => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    return screenWidth < 650;
  };
  // console.log(formData);

  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
  };

  const [expandedAddresses, setExpandedAddresses] = useState({});

  const toggleAddressReadMore = (hotelId) => {
    setExpandedAddresses((prev) => ({
      ...prev,
      [hotelId]: !prev[hotelId],
    }));
  };

  const [expandedTitles, setExpandedTitles] = useState({});

  const toggleTitleReadMore = (roomId) => {
    setExpandedTitles((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  const [expandedHighlights, setExpandedHighlights] = useState({});
  const [expandedPoints, setExpandedPoints] = useState({});

  const toggleHighlightReadMore = (roomId, highlightIndex) => {
    const key = `${roomId}-${highlightIndex}`;
    setExpandedHighlights((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const togglePointsReadMore = (roomId) => {
    setExpandedPoints((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  console.log(city);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
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
            Hotel Rooms List
          </MDTypography>
          <Link to="/add-new-room" style={{ textDecoration: "none" }}>
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
              &nbsp;{shouldShowAddButton() ? "" : "add new room"}
            </MDButton>
          </Link>
        </MDBox>
        <MDBox pt={4} pb={3}>
          <div style={{ backgroundColor: "white", borderRadius: "25px" }}>
            <div className="row mx-2 py-3 gy-4">
              {city &&
                [...city]?.reverse()?.map((ele, index) => {
                  return (
                    <>
                      <div className="col-md-6 col-sm-12 col-12 ">
                        <div
                          className="py-3"
                          style={{
                            backgroundColor: "aliceblue",
                            borderRadius: "10px",
                            position: "relative",
                            height: "100%",
                          }}
                        >
                          <div className="row py-2 px-3">
                            <div className="col-lg-6 col-md-12 col-sm-6 col-12">
                              {/* <img src={ele.photos} alt="" className="img-fluid w-100" /> */}
                              <Carousel>
                                {ele.photos.map((e, i) => {
                                  return (
                                    <Carousel.Item>
                                      <img
                                        className="d-block w-100"
                                        style={{
                                          height: "250px",
                                        }}
                                        src={e}
                                        alt="First slide"
                                      />
                                    </Carousel.Item>
                                  );
                                })}
                              </Carousel>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-6 col-12">
                              <p
                                className="mb-1"
                                style={{
                                  fontSize: "16px",
                                  color: "#7b809a",
                                  fontWeight: "700",
                                }}
                              >
                                Hotel Name :{" "}
                                <span
                                  style={{
                                    color: "#344767",
                                    fontWeight: "500",
                                  }}
                                >
                                  {ele.hotel_details?.[0]?.hotel_name}
                                </span>
                              </p>
                              <p
                                className="mb-1"
                                style={{
                                  fontSize: "16px",
                                  color: "#7b809a",
                                  fontWeight: "700",
                                }}
                              >
                                Room Type :{" "}
                                <span
                                  style={{
                                    color: "#344767",
                                    fontWeight: "500",
                                    display: "inline-block",
                                    width: "100%",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {ele.room_title?.length > 250 ? (
                                    <>
                                      {expandedTitles[ele._id]
                                        ? ele.room_title
                                        : `${ele.room_title.substring(
                                            0,
                                            250
                                          )}...`}
                                      <MDButton
                                        variant="text"
                                        color="info"
                                        size="small"
                                        onClick={() =>
                                          toggleTitleReadMore(ele._id)
                                        }
                                        sx={{
                                          padding: "0 4px",
                                          minWidth: "auto",
                                          fontSize: "12px",
                                          marginLeft: "4px",
                                        }}
                                      >
                                        {expandedTitles[ele._id]
                                          ? "Show Less"
                                          : "Show More"}
                                      </MDButton>
                                    </>
                                  ) : (
                                    ele.room_title
                                  )}
                                </span>
                              </p>
                              <p
                                className="mb-1"
                                style={{
                                  fontSize: "16px",
                                  color: "#7b809a",
                                  fontWeight: "700",
                                }}
                              >
                                Hotel address :{" "}
                                <span
                                  style={{
                                    color: "#344767",
                                    fontWeight: "500",
                                    display: "inline-block",
                                    width: "100%",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {ele.hotel_details?.[0]?.hotel_address
                                    ?.length > 250 ? (
                                    <>
                                      {expandedAddresses[ele._id]
                                        ? ele.hotel_details[0].hotel_address
                                        : `${ele.hotel_details[0].hotel_address.substring(
                                            0,
                                            250
                                          )}...`}
                                      <MDButton
                                        variant="text"
                                        color="info"
                                        size="small"
                                        onClick={() =>
                                          toggleAddressReadMore(ele._id)
                                        }
                                        sx={{
                                          padding: "0 4px",
                                          minWidth: "auto",
                                          fontSize: "12px",
                                          marginLeft: "4px",
                                        }}
                                      >
                                        {expandedAddresses[ele._id]
                                          ? "Show Less"
                                          : "Show More"}
                                      </MDButton>
                                    </>
                                  ) : (
                                    ele.hotel_details?.[0]?.hotel_address
                                  )}
                                </span>
                              </p>
                              <p
                                className="mb-1"
                                style={{
                                  fontSize: "16px",
                                  color: "#7b809a",
                                  fontWeight: "700",
                                }}
                              >
                                price :{" "}
                                <span
                                  style={{
                                    color: "#344767",
                                    fontWeight: "500",
                                  }}
                                >
                                  {ele.price}
                                </span>
                              </p>

                              <div>
                                <p
                                  className="mb-2"
                                  style={{
                                    fontSize: "16px",
                                    color: "#7b809a",
                                    fontWeight: "700",
                                  }}
                                >
                                  Highlights :
                                </p>
                                {ele?.room_highlights?.map((ele1, index) => {
                                  // Only show first 5 points when not expanded
                                  if (!expandedPoints[ele._id] && index >= 5)
                                    return null;

                                  return (
                                    <ul className="mb-1" key={index}>
                                      <li
                                        className=""
                                        style={{
                                          color: "#344767",
                                          fontWeight: "500",
                                          fontSize: "16px",
                                          listStyle: "disc",
                                          width: "100%",
                                          wordBreak: "break-word",
                                        }}
                                      >
                                        {ele1?.length > 250 ? (
                                          <>
                                            {expandedHighlights[
                                              `${ele._id}-${index}`
                                            ]
                                              ? ele1
                                              : `${ele1.substring(0, 250)}...`}
                                            <MDButton
                                              variant="text"
                                              color="info"
                                              size="small"
                                              onClick={() =>
                                                toggleHighlightReadMore(
                                                  ele._id,
                                                  index
                                                )
                                              }
                                              sx={{
                                                padding: "0 4px",
                                                minWidth: "auto",
                                                fontSize: "12px",
                                                marginLeft: "4px",
                                              }}
                                            >
                                              {expandedHighlights[
                                                `${ele._id}-${index}`
                                              ]
                                                ? "Show Less"
                                                : "Show More"}
                                            </MDButton>
                                          </>
                                        ) : (
                                          ele1
                                        )}
                                      </li>
                                    </ul>
                                  );
                                })}
                                {ele?.room_highlights?.length > 5 && (
                                  <MDButton
                                    variant="text"
                                    color="info"
                                    size="small"
                                    onClick={() =>
                                      togglePointsReadMore(ele._id)
                                    }
                                    sx={{
                                      padding: "0 4px",
                                      minWidth: "auto",
                                      fontSize: "12px",
                                      marginLeft: "20px",
                                      marginTop: "4px",
                                    }}
                                  >
                                    {expandedPoints[ele._id]
                                      ? "Show Less Points"
                                      : `Show ${
                                          ele.room_highlights.length - 5
                                        } More Points`}
                                  </MDButton>
                                )}
                              </div>
                            </div>
                          </div>
                          <NavLink
                            to={`/update-room/${ele._id}`}
                            style={{ color: "black" }}
                          >
                            <div
                              className=""
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "5%",
                              }}
                            >
                              <EditNoteIcon />
                            </div>
                          </NavLink>
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default Room;
