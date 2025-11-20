// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import axios from "axios";
import Card from "@mui/material/Card";
import MDAvatar from "components/MDAvatar";
import { useMaterialUIController } from "context";

import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { makeStyles } from "@mui/styles";
import breakpoints from "assets/theme/base/breakpoints";
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard3 from "examples/Cards/InfoCards/ProfileInfoCard3";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/vendordetailbyid/components/Header";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { NavLink, useParams } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { BASE_URL } from "BASE_URL";
import { Box, Button, CardContent, Typography } from "@mui/material";
import { useMediaQuery, FormControl } from "@mui/material";

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0'); // Get day and add leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so add 1) and add leading zero
  const year = date.getFullYear(); // Get full year

  return `${day}-${month}-${year}`;
}

// export const GlobleInfo = createContext();
function UserDetail() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { _id } = useParams();
  const [vendorData, setVendorData] = useState(null);
  console.log(vendorData)
  const [bookedlist, setBookedList] = useState(null);
  console.log(bookedlist)
  const [carbookedlist, setCarBookedList] = useState(null);
  const [status, setStatus] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [expandedAddresses, setExpandedAddresses] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleUpdate = async () => {
    // Call the API to update the status
    const jay = status == vendorData[0].agencydetails[0].status;
    if (status == vendorData[0].agencydetails[0].status) {
      setDialogOpen(false);
      return;
    }

    const token = localStorage.getItem("sytAdmin");
    const url = `${BASE_URL}agency/status?_id=${_id}`;
    const statusValue = status;

    // Prepare the request payload
    const payload = {
      status: statusValue
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // Refresh the vendor details so the page updates automatically
      try {
        await fetchUserData();
      } catch (e) {
        console.error("Error refreshing data after update:", e);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error:', error);
      setDialogOpen(false);
    }

    

  };

  const toggleAddress = (bookId) => {
    setExpandedAddresses(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const toggleDescription = (bookId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const useStyles = makeStyles({
    scrollContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gridAutoFlow: "column", // Display items in a single row
      gap: "16px",
      overflowX: "auto",
      // height: "350px", // Set a fixed height for the scrollable container
      scrollbarWidth: "none",
      "-ms-overflow-style": "none",
    },
    portfolioItem: {
      width: "300px", // Set a fixed width for each portfolio item
    },
  });
  const classes = useStyles();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await fetch(
        `${BASE_URL}agency/agencydetails?_id=${_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVendorData(data.data);
        setStatus(data.data[0].agencydetails[0].status);
      } else {
        throw new Error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchBookingData = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await fetch(
        `${BASE_URL}bookpackage/bookpackageforadmin?agency_id=${_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBookedList(data.data);
      } else {
        throw new Error("Error fetching boking data");
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const [carData, setCarData] = useState([]);

  const fetchCarData = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await fetch(
        `${BASE_URL}vendor_car_syt/vendorCarListByAdmin?vendor_id=${_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCarData(data.data);
      } else {
        throw new Error("Error fetching boking data");
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const fetchCarBookingData = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await fetch(
        `${BASE_URL}car_booking_syt/vendorBookedCarByAdmin?_id=${_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCarBookedList(data.data);
      } else {
        throw new Error("Error fetching boking data");
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchBookingData();
    fetchCarData();
    fetchCarBookingData();
  }, []);

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [tabValue1, setTabValue1] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue1(newValue);
  };

  const agencyDetails = vendorData?.[0]?.agencydetails?.[0] || {};

  return (
    <DashboardLayout>
      <DashboardNavbar />


      <MDBox mb={2} />
      {vendorData == null ? (
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle={{ margin: "auto", display: "block" }}
          wrapperClass=""
        />
      ) : (
        <>
          {/* <Header vendorname={vendorData[0].full_name} company={vendorData[0].company_name} /> */}
          <MDBox position="relative" mb={5}>
            <MDBox
              display="flex"
              alignItems="center"
              position="relative"
              minHeight="18.75rem"
              borderRadius="xl"
              sx={{
                backgroundImage: ({
                  functions: { rgba, linearGradient },
                  palette: { gradients },
                }) =>
                  `${linearGradient(
                    rgba(gradients.info.main, 0.6),
                    rgba(gradients.info.state, 0.6)
                  )}, url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "50%",
                overflow: "hidden",
              }}
            />
            <Card
              sx={{
                position: "relative",
                mt: -8,
                mx: 3,
                py: 2,
                px: 2,
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <MDAvatar src={vendorData ? vendorData[0].agencydetails[0].agency_logo : burceMars} alt="profile-image" size="xl" shadow="sm" />
                </Grid>
                <Grid item>
                  <MDBox height="100%" mt={0.5} lineHeight={1}>
                    <MDTypography variant="h5" fontWeight="medium">
                      {vendorData ? vendorData[0].agencydetails[0].full_name : ""}
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      {vendorData ? vendorData[0].agencydetails[0].email_address : ""}
                    </MDTypography>
                  </MDBox>
                </Grid>
                <Grid item>
                  <MDBox height="100%" mt={0.5} display="flex">
                    <MDBox
                      component="select"
                      pr={1}
                      pl={0.5}
                      lineHeight={1}
                      value={status}
                      style={{ borderRadius: "0.5rem" }}
                      onChange={(event) => setStatus(event.target.value)}
                      
                    >
                      <MDBox component="option" value="active">
                        Acitve
                      </MDBox>
                      <MDBox component="option" value="inactive">
                        Inactive
                      </MDBox>
                    </MDBox>
                    <MDTypography
  variant="h5"
  color="white"
  fontWeight="regular"
  onClick={handleOpenDialog}
  sx={{
    marginLeft: "2rem",
    background: "#007BFF",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "5px",
    paddingBottom: "5px",
    borderRadius: "10px",
    cursor: "pointer",
    userSelect: "none",
    textAlign: "center",

    // --- Responsive styles for screens 320px or smaller ---
    '@media (max-width: 320px)': {
      marginLeft: "0.5rem",   
      padding: "0.5rem",
      fontSize: "1rem",
        
    },
  }}
>
  Update
</MDTypography>
                  </MDBox>
                </Grid>
                <Grid item xs={12} className="m-auto">
                  {isMobile ? (
                    <FormControl fullWidth sx={{ 
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        }
                      }
                    }}>
                      <Select
                        value={tabValue1}
                        onChange={(e) => handleChange(e, e.target.value)}
                        displayEmpty
                        sx={{
                          height: '48px',
                          '& .MuiSelect-select': {
                            paddingY: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'text.primary'
                          }
                        }}
                      >
                        <MenuItem value={0}>Information</MenuItem>
                        <MenuItem value={1}>Total Bids ({vendorData?.[0]?.agencydetails?.[0]?.bid?.length || 0})</MenuItem>
                        <MenuItem value={2}>Total Bookings ({bookedlist?.length || 0})</MenuItem>
                        <MenuItem value={3}>Total Cars ({carData?.length || 0})</MenuItem>
                        <MenuItem value={4}>Car Bookings ({carbookedlist?.length || 0})</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <AppBar position="static">
                      <Tabs 
                        value={tabValue1} 
                        onChange={handleChange}
                        sx={{
                          '& .MuiTab-root': {
                            minWidth: 'auto',
                            px: 3,
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }
                        }}
                      >
                        <Tab label="Information" />
                        <Tab label={`Total Bids (${vendorData?.[0]?.agencydetails?.[0]?.bid?.length || 0})`} />
                        <Tab label={`Total Bookings (${bookedlist?.length || 0})`} />
                        <Tab label={`Total Cars (${carData?.length || 0})`} />
                        <Tab label={`Car Bookings (${carbookedlist?.length || 0})`} />
                      </Tabs>
                    </AppBar>
                  )}
                </Grid>
              </Grid>
              {tabValue1 === 0 && (
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" alignItems="center" mt={4} mb={4}>
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item xs={12}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                          <CardContent>

                            <Grid container spacing={2} pt={2}>
                              {[
                                { label: "Full Name", value: agencyDetails.full_name },
                                { label: "Mobile Number", value: agencyDetails.mobile_number },
                                { label: "Email Address", value: agencyDetails.email_address },
                                { label: "Pincode", value: agencyDetails.pincode },
                                { label: "City", value: agencyDetails.city },
                                { label: "State", value: agencyDetails.state },
                                { label: "Country", value: agencyDetails.country },
                                { label: "Website", value: agencyDetails.website },
                                { label: "Status", value: agencyDetails.status },
                                { label: "Business Type", value: agencyDetails.business_type },
                                { label: "IATA", value: agencyDetails.IATA },
                                { label: "Agency Name", value: agencyDetails.agency_name },
                                { label: "Agency Address", value: agencyDetails.agency_address },
                                { label: "GST Number", value: agencyDetails.GST_NO },
                              ].map((info, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                  <Typography variant="body2" color="textSecondary">
                                    <strong>{info.label}:</strong> {info.value || "N/A"}
                                  </Typography>
                                </Grid>
                              ))}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

              )}

              {tabValue1 === 1 && (
                <div>
                  <MDBox pt={2} px={2} lineHeight={1.25}>
                    <MDTypography variant="h6" fontWeight="medium" style={{ margin: 'auto' }}>
                      BID
                    </MDTypography>
                  </MDBox>
                  <MDBox p={2}>
                    <Grid container spacing={3}>
                      {vendorData && vendorData[0].agencydetails && vendorData[0].agencydetails[0].bid?.reverse()?.map((bid, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <NavLink to={`/custom-requirment-compare/${bid._id}`} >
                            <div
                              style={{
                                backgroundColor: darkMode ? 'rgb(26 46 79)' : '#FFFFFF',
                                borderRadius: '8px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                color: 'black',
                              }}
                            >
                              <div className="d-flex justify-content-around align-items-center mb-3">
                                <img
                                  src="https://www.shutterstock.com/image-vector/grunge-green-category-word-round-260nw-1794170542.jpg"
                                  className="img-fluid"
                                  alt=""
                                  style={{ height: '70px', width: '70px' }}
                                />
                                <p className="" style={{ fontWeight: '500' }}>
                                  {bid.departure} to {bid.destination}
                                </p>
                              </div>
                              <div className="ms-4 pb-3">
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Bid Date : <span style={{ color: '#7b809a', fontWeight: '400' }}>{formatDate(bid.bid_date)}</span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Price Per Person : <span style={{ color: '#7b809a', fontWeight: '400' }}>
                                    {bid.price_per_person}
                                    {bid?.price_per_person_adult + (bid?.price_per_person_adult * Number(bid?.admin_margin?.margin_percentage) / 100)}
                                  </span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Total Days/Nights :{' '}
                                  <span style={{ color: '#7b809a', fontWeight: '400' }}>{bid.total_days}</span>/
                                  <span style={{ color: '#7b809a', fontWeight: '400' }}>{bid.total_nights}</span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  status : <span style={{ color: '#7b809a', fontWeight: '400' }}>{bid.bid_status}</span>
                                </h6>
                              </div>
                            </div>
                          </NavLink>
                        </Grid>
                      ))}
                    </Grid>
                  </MDBox>
                </div>
              )}

              {tabValue1 === 2 && (
                <div>
                  <MDBox pt={2} px={2} lineHeight={1.25}>
                    <MDTypography variant="h6" fontWeight="medium" style={{ margin: 'auto' }}>
                      Bookings
                    </MDTypography>
                  </MDBox>
                  <MDBox p={2}>
                    <Grid container spacing={3}>
                      {bookedlist.map((book, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <NavLink to={`/booked-package-detail/${book?._id}`} >
                            <div
                              style={{
                                backgroundColor: darkMode ? 'rgb(26 46 79)' : '#FFFFFF',
                                borderRadius: '8px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                color: 'black',
                              }}
                            >
                              <div className="d-flex justify-content-around align-items-center mb-3">
                                <img
                                  src="https://www.shutterstock.com/image-vector/grunge-green-category-word-round-260nw-1794170542.jpg"
                                  className="img-fluid"
                                  alt=""
                                  style={{ height: '70px', width: '70px' }}
                                />
                                <p className="" style={{ fontWeight: '500' }}>
                                  {book.departure} to {book.isBid ? book.bidDetails[0].destination : book.packageDetails[0].destination[0].destination_name}
                                </p>
                              </div>
                              <div className="ms-4 pb-3">
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Book Date : <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.bookdate.slice(0, 10)}</span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Total Amount : <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.total_amount}</span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Total Days/Nights :{' '}
                                  <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.isBid ? book.bidDetails[0].total_days : book.packageDetails[0].total_days}</span>/
                                  <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.isBid ? book.bidDetails[0].total_nights : book.packageDetails[0].total_nights}</span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  sightseeing : <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.isBid ? book.bidDetails[0].sightseeing : book.packageDetails[0].sightseeing}</span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  status : <span style={{ color: '#7b809a', fontWeight: '400' }}>{book?.status}</span>
                                </h6>
                              </div>
                            </div>
                          </NavLink>
                        </Grid>
                      ))}
                    </Grid>
                  </MDBox>
                </div>
              )}

              {tabValue1 === 3 && (
                <div>
                  {/* Render data specific to the second tab */}
                  <MDBox pt={2} px={2} lineHeight={1.25}>
                    <MDTypography variant="h6" fontWeight="medium" style={{ margin: 'auto' }}>
                      Cars
                    </MDTypography>
                  </MDBox>
                  <MDBox p={2}>
                    <Grid container spacing={3}>
                      {carData.map((book, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <NavLink to={`/vendor-car-detail/${book?._id}`} >
                            <div
                              style={{
                                backgroundColor: darkMode ? 'rgb(26 46 79)' : '#FFFFFF',
                                borderRadius: '8px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                color: 'black',
                              }}
                            >
                              <div className="d-flex justify-content-around align-items-center mb-3">
                                <img
                                  src={book.photos?.[0]}
                                  className="img-fluid"
                                  alt=""
                                  style={{ height: '70px', width: '70px' }}
                                />
                                <p className="" style={{ fontWeight: '500' }}>
                                  {book.car_details?.[0]?.car_name}
                                </p>
                              </div>
                              <div className="ms-4 pb-3">
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Car Condition : 
                                  <span style={{ color: '#7b809a', fontWeight: '400' }}>
                                    {expandedDescriptions[book._id] 
                                      ? book.car_condition
                                      : `${book.car_condition.slice(0, 250)}${book.car_condition.length > 250 ? '...' : ''}`}
                                    {book.car_condition.length > 250 && (
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault(); // Prevent NavLink navigation
                                          toggleDescription(book._id);
                                        }}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: '#1e40af',
                                          cursor: 'pointer',
                                          marginLeft: '5px',
                                          fontSize: '14px'
                                        }}
                                      >
                                        {expandedDescriptions[book._id] ? 'Read Less' : 'Read More'}
                                      </button>
                                    )}
                                  </span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  City : <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.city}</span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  City : <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.state}</span>
                                </h6>
                              </div>
                            </div>
                          </NavLink>
                        </Grid>
                      ))}
                    </Grid>
                  </MDBox>
                </div>
              )}

              {tabValue1 === 4 && (
                <div>
                  {/* Render data specific to the second tab */}
                  <MDBox pt={2} px={2} lineHeight={1.25}>
                    <MDTypography variant="h6" fontWeight="medium" style={{ margin: 'auto' }}>
                      Car Bookings
                    </MDTypography>
                  </MDBox>
                  <MDBox p={2}>
                    <Grid container spacing={3}>
                      {carbookedlist.map((book, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <NavLink to={`/booked-car-detail/${book?._id}`} >
                            <div
                              style={{
                                backgroundColor: darkMode ? 'rgb(26 46 79)' : '#FFFFFF',
                                borderRadius: '8px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                color: 'black',
                              }}
                            >
                              <div className="d-flex justify-content-around align-items-center mb-3">
                                <p className="" style={{ fontWeight: '500' }}>
                                  {expandedAddresses[book._id] 
                                    ? `${book.pickup_address} `
                                    : `${book.pickup_address.slice(0, 250)}${book.pickup_address.length > 250 ? '...' : ''} `}
                                  <span style={{ fontSize: "20px" }}>to</span>{' '}
                                  {expandedAddresses[book._id]
                                    ? book.drop_address
                                    : `${book.drop_address.slice(0, 250)}${book.drop_address.length > 250 ? '...' : ''}`}
                                  {(book.pickup_address.length > 250 || book.drop_address.length > 250) && (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault(); // Prevent NavLink navigation
                                        toggleAddress(book._id);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#1e40af',
                                        cursor: 'pointer',
                                        marginLeft: '5px',
                                        fontSize: '14px'
                                      }}
                                    >
                                      {expandedAddresses[book._id] ? 'Read Less' : 'Read More'}
                                    </button>
                                  )}
                                </p>
                              </div>
                              <div className="ms-4 pb-3">
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Pickup Date : <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.pickup_date.slice(0, 10)}</span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Return Date : <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.return_date.slice(0, 10)}</span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Price per Km : <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.price_per_km}</span>
                                </h6>
                                <h6 style={{ color: '#344767', fontWeight: '700' }}>
                                  Status : <span style={{ color: '#7b809a', fontWeight: '400' }}>{book.status}</span>
                                </h6>
                              </div>
                            </div>
                          </NavLink>
                        </Grid>
                      ))}
                    </Grid>
                  </MDBox>
                </div>
              )}



            </Card>
          </MDBox>
        </>
      )}
      {dialogOpen && (
        <>
          {/* Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          ></div>
          <MDBox
            backgroundColor="#fff"
            width="300px"
            padding="20px"
            borderRadius="4px"
            boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
            textAlign="center"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
              borderRadius: "1rem",
              zIndex: 1000,
            }}
          >
            <MDTypography variant="h6" fontWeight="bold" mb={3}>
              Confirm Update
            </MDTypography>
            <MDTypography variant="body1" mb={3}>
              Are you sure you want to Change the status?
            </MDTypography>
            <MDBox display="flex" justifyContent="center">
              <MDBox
                component="button"
                type="button"
                onClick={handleUpdate}
                style={{ marginRight: "10px", backgroundColor: "red", cursor: "pointer" }}
                padding="8px 16px"
                borderRadius="4px"
                border="none"
              >
                OK
              </MDBox>
              <MDBox
                component="button"
                type="button"
                onClick={handleCloseDialog}
                padding="8px 16px"
                borderRadius="4px"
                border="none"
                cursor="pointer"
                style={{ backgroundColor: "#75de75", cursor: "pointer" }}
              >
                Cancel
              </MDBox>
            </MDBox>
          </MDBox>
        </>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default UserDetail;
