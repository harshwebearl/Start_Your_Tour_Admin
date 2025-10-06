import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { useTheme, useMediaQuery, createTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { Audio } from "react-loader-spinner";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { BASE_URL } from "BASE_URL";

export const GlobleInfo = createContext();

function BookedCar() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { bookid } = useParams();
  const [filteredData, setFilteredData] = useState(null);
  const [expandedPickup, setExpandedPickup] = useState(false);
  const [expandedDrop, setExpandedDrop] = useState(false);

  const bookDetail = async () => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(
      `${BASE_URL}car_booking_syt/vendorBookedCarDetails?booked_car_id=${bookid}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    setFilteredData(data.data[0]);
  };

  useEffect(() => {
    bookDetail();
  }, [bookid]);

  // const theme = useTheme();
  // const customTheme = createTheme({
  //   breakpoints: {
  //     values: {
  //       xs: 0,
  //       sm: 750,
  //       md: 1050,
  //       lg: 1280,
  //       xl: 1920,
  //     },
  //   },
  // });
  // const isMobile = useMediaQuery(customTheme.breakpoints.down("600px"));
  // const isTablet = useMediaQuery(customTheme.breakpoints.between("sm", "md"));

  // let entriesPerPage = 3;
  // if (isMobile) {
  //   entriesPerPage = 1;
  // } else if (isTablet) {
  //   entriesPerPage = 2;
  // }

  // const useStyles = makeStyles({
  //   scrollContainer: {
  //     display: "grid",
  //     gridAutoFlow: "column",
  //     gap: "16px",
  //     overflowX: "auto",
  //     scrollbarWidth: "none",
  //     "-ms-overflow-style": "none",
  //   },
  //   portfolioItem: {
  //     minWidth: "450px",
  //   },
  // });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {!filteredData ? (
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
        <MDBox pt={6} pb={3}>
          <MDBox
            textAlign="center"
            mb={4}
            style={{
              position: "relative",
            }}
          >
            <MDTypography variant="h4" fontWeight="bold">
              Booked Car Details
            </MDTypography>
          </MDBox>
          <Grid container spacing={3}>
            <div className="py-3 ps-4 my-3" style={{
              backgroundColor: "white",
              width: "100%",
              borderRadius: "15px"
            }}>
              <div>
                <div className="d-flex " style={{ overflowX: "auto" }}>
                  <div className="me-4">
                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Name: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.name}</span></p>
                  </div>
                  <div className="me-4">
                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Mobile Number: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.mobile_number}</span></p>
                  </div>
                  <div className="me-4">
                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Email: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.email}</span></p>
                  </div>
                  <div className="me-4">
                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>City: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.city}</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-4 my-3" style={{
              backgroundColor: "white",
              width: "100%",
              borderRadius: "15px"
            }}>
              <div className="row mx-3">
                <div className="col-sm-6 col-12" style={{ height: "100%" }}>
                  <div className="px-4 py-3 h-100" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                    <h5 className="text-center mb-3" style={{ fontWeight: "600" }}>Customer Information</h5>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Name: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.name}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Email: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px", overflowWrap: "anywhere" }}>{filteredData.email}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Mobile Number: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.mobile_number}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>City: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.city}</span></p>
                  </div>
                </div>
                <div className="col-sm-6 col-12" style={{ height: "100%" }}>
                  <div className="px-4 py-3" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                    <h5 className="text-center mb-3" style={{ fontWeight: "600" }}>Vendor Car Information</h5>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Car Name: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.vendor_car_details[0]?.car_details[0]?.car_name}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Model Number: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.vendor_car_details[0]?.car_details[0]?.model_number}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Registration Number: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.registration_number}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Price Per KM: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.price_per_km}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Price Per Day: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.price_per_day}</span></p>
                  </div>
                </div>
              </div>
              <div className="row mt-4 mx-3">
                <div className="col-sm-6 col-12" style={{ height: "100%" }}>
                  <div className="px-4 py-3 h-100" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                    <h5 className="text-center mb-3" style={{ fontWeight: "600" }}>Pick-up Information</h5>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>
                      Pick-up Location: 
                      <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>
                        {expandedPickup 
                          ? filteredData.pickup_address
                          : `${filteredData.pickup_address.slice(0, 250)}${filteredData.pickup_address.length > 250 ? '...' : ''}`}
                        {filteredData.pickup_address.length > 250 && (
                          <button
                            onClick={() => setExpandedPickup(!expandedPickup)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#1e40af',
                              cursor: 'pointer',
                              marginLeft: '5px',
                              fontSize: '14px'
                            }}
                          >
                            {expandedPickup ? 'Read Less' : 'Read More'}
                          </button>
                        )}
                      </span>
                    </p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Pick-up Date: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.pickup_date.slice(0, 10)}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Pick-up Time: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.pickup_time}</span></p>
                  </div>
                </div>
                <div className="col-sm-6 col-12" style={{ height: "100%" }}>
                  <div className="px-4 py-3" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                    <h5 className="text-center mb-3" style={{ fontWeight: "600" }}>Drop Information</h5>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>
                      Drop Location: 
                      <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>
                        {expandedDrop 
                          ? filteredData.drop_address
                          : `${filteredData.drop_address.slice(0, 250)}${filteredData.drop_address.length > 250 ? '...' : ''}`}
                        {filteredData.drop_address.length > 250 && (
                          <button
                            onClick={() => setExpandedDrop(!expandedDrop)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#1e40af',
                              cursor: 'pointer',
                              marginLeft: '5px',
                              fontSize: '14px'
                            }}
                          >
                            {expandedDrop ? 'Read Less' : 'Read More'}
                          </button>
                        )}
                      </span>
                    </p>
                    {filteredData.twoway &&
                      <>
                        <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "18px" }}>Two Way Trip </p>
                        <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Return Date: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.return_date.slice(0, 10)}</span></p>
                      </>
                    }
                    {/* <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Drop Date: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.drop_date}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Drop Time: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.drop_time}</span></p> */}
                  </div>
                </div>
              </div>
              {/* <div className="row mt-4 mx-3">
                <div className="col-12" style={{ height: "100%" }}>
                  <div className="px-4 py-3 h-100" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                    <h5 className="text-center mb-3" style={{ fontWeight: "600" }}>Car Details</h5>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Booking ID: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.id}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Booking Date: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.booking_date}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Booking Status: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.booking_status}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Booking Amount: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData.booking_amount}</span></p>
                  </div>
                </div>
              </div> */}
            </div>
          </Grid>
        </MDBox>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default BookedCar;
