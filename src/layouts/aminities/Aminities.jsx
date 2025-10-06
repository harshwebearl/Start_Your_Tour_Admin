import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
import Icon from "@mui/material/Icon";
import EditNoteIcon from "@mui/icons-material/EditNote";
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
import { Box, Button, FormControl } from "@mui/material";
// import
const Aminities = () => {
  const [Places, setPlaces] = useState([]);

  const [destination, setDestination] = useState([]);
  const [slct, setSclt] = useState({
    Destinations: "",
  });

  const [selectedOption, setSelectedOption] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  const handleOptionSelect = (event) => {
    setSelectedOption(event.target.value);
  };

  const toggleReadMore = (pointId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [pointId]: !prev[pointId],
    }));
  };

  const Dest = async () => {
    const token = localStorage.getItem("sytAdmin");

    const res = await fetch(`${BASE_URL}hotel_syt`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setDestination(data.data);
  };

  useEffect(() => {
    Dest();
  }, []);

  const txt = (e) => {
    const { name, value } = e.target;
    setSclt({ ...slct, [name]: value });
  };
  const handleButtonClick = async () => {
    const token = localStorage.getItem("sytAdmin");
    if (selectedOption) {
      try {
        const response = await axios.get(
          `${BASE_URL}amenities_and_facilities/byhotelid?hotel_id=${selectedOption}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        // Process the response data
        setPlaces(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => setDeleteDialogOpen(false);

  // const [aminities, setAminities] = useState("")

  // const Call = async () => {
  //     const res = await fetch("${BASE_URL}amenities_and_facilities", {
  //         method: "GET",
  //         headers: {
  //             "Content-Type": "application/json",
  //         },
  //     });
  //     const data = await res.json();
  //     setAminities(data.data[0]);
  // };

  // useEffect(() => {
  //     Call();
  // }, []);

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

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        // const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}destinationcategory`);

        setCategory(response.data.data);
        setIsLoading(false);
      } catch (error) {}
    };
    fetchCategoryList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (
    //     !formData.destination_name ||
    //     !formData.how_to_reach ||
    //     !formData.about_destination ||
    //     !formData.best_time_for_visit
    // ) {
    //     // If category or image is not filled, show the success snackbar and return
    //     openErrorSB();
    //     return;
    // }
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
      // Handle error or show an error message
    }
    setFormData({
      photo: null,
      title: "",
      description: "",
      destination_id: "", // Empty array for storing checked feature _ids
    });
  };

  const shouldShowAddButton = () => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    return screenWidth < 650;
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
              Aminities & Facilities
            </MDTypography>
           
            <Link to="/add-new-aminities" style={{ textDecoration: "none" }}>
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
                &nbsp;{shouldShowAddButton() ? "" : "add new aminities"}
              </MDButton>
            </Link>
          </MDBox>
        </MDBox>
        <Box display="flex" justifyContent="center" alignItems="center">
          <FormControl sx={{ width: "50%" }}>
            <Select
              value={selectedOption}
              onChange={handleOptionSelect}
              displayEmpty
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: "350px", // Limit dropdown height
                    overflowY: "auto", // Enable scrolling
                  },
                },
              }}
              sx={{
                border: "1px solid grey",
                borderRadius: 2,
                backgroundColor: "white",
                height: "40px",
              }}
            >
              <MenuItem disabled value="">
                Select Hotel
              </MenuItem>
              {destination.map((ele) => (
                <MenuItem key={ele._id} value={ele._id}>
                  {ele.hotel_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            sx={{
              ml: 2,
              width: 50,
              borderRadius: 2,
              backgroundColor: "#000000 !important", // Ensures black bg
              color: "#FFFFFF !important", // Ensures white text
              padding: "8px 0px",
              "&:hover": {
                backgroundColor: "#000000 !important",
              },
            }}
            onClick={handleButtonClick}
          >
            OK
          </Button>
        </Box>
        <MDBox pt={4} pb={3} px={3}>
          <div style={{ backgroundColor: "white", borderRadius: "25px" }}>
            {Places.map((ele) => {
              return (
                <>
                  <div className="row">
                    {ele.amenities_and_facilities.map((e) => {
                      return (
                        <>
                          <div className=" col-12 px-sm-5 px-4">
                            <div className="row">
                              <div className="col-12 text-end">
                                <NavLink
                                  to={`/update-amenities/${e._id}/${ele.hotel_id}`}
                                  style={{ color: "black" }}
                                >
                                  <EditNoteIcon />
                                </NavLink>
                              </div>
                              <div className="col-12">
                                <div
                                  style={{
                                    width: "100%",
                                    overflow: "hidden",
                                    wordBreak: "break-word",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <b
                                    style={{
                                      display: "block",
                                      fontSize: "16px",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    {e.title}
                                  </b>
                                </div>
                                <div>
                                  {e.points.map((e1, index) => (
                                    <ul
                                      key={index}
                                      style={{ margin: 0, padding: "0 0 0 20px" }}
                                    >
                                      <li>
                                        <div
                                          style={{
                                            width: "100%",
                                            overflow: "hidden",
                                            wordWrap: "break-word",
                                          }}
                                        >
                                          {e1.length > 250 ? (
                                            <>
                                              {expandedItems[`${e._id}-${index}`]
                                                ? e1
                                                : `${e1.substring(0, 250)}...`}
                                              <Button
                                                onClick={() =>
                                                  toggleReadMore(`${e._id}-${index}`)
                                                }
                                                sx={{
                                                  color: "#348eed",
                                                  padding: "0 8px",
                                                  minWidth: "auto",
                                                  textTransform: "none",
                                                  "&:hover": {
                                                    backgroundColor: "transparent",
                                                  },
                                                }}
                                              >
                                                {expandedItems[`${e._id}-${index}`]
                                                  ? "Show Less"
                                                  : "Show More"}
                                              </Button>
                                            </>
                                          ) : (
                                            e1
                                          )}
                                        </div>
                                      </li>
                                    </ul>
                                  ))}
                                </div>
                                <div className="d-flex justify-content-end pe-3 pb-3"></div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              );
            })}
          </div>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default Aminities;
