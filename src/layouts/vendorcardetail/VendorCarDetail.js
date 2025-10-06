import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useMaterialUIController } from "context";
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import axios from "axios";
import { makeStyles } from "@mui/styles";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/userdetailbyid/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
import Pagination from '@mui/lab/Pagination';
import { createTheme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useParams } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { BASE_URL } from "BASE_URL";

export const GlobleInfo = createContext();
function VendorCarDetail() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { id } = useParams();
  const [userData, setUserData] = useState("");
  const [filteredData, setFilteredData] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(filteredData)

  const displayVal = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") return val.name ?? val._id ?? JSON.stringify(val);
    return String(val);
  };


  const carDetail = async () => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(
      `${BASE_URL}vendor_car_syt/getById/${id}`,
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
    carDetail();
  }, [id]);


  const theme = useTheme();
  const customTheme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 750,
        md: 1050,
        lg: 1280,
        xl: 1920,
      },
    },
  });
  const isMobile = useMediaQuery(customTheme.breakpoints.down('600px'));
  const isTablet = useMediaQuery(customTheme.breakpoints.between('sm', 'md'));

  let entriesPerPage = 3;
  if (isMobile) {
    entriesPerPage = 1;
  } else if (isTablet) {
    entriesPerPage = 2;
  }
  const useStyles = makeStyles({
    scrollContainer: {
      display: "grid",
      gridAutoFlow: "column",
      gap: "16px",
      overflowX: "auto",
      scrollbarWidth: "none",
      "-ms-overflow-style": "none",
    },
    portfolioItem: {
      minWidth: "450px",
    },
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {userData == null ? (
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
        <MDBox pt={6} pb={3} >
          <MDBox
            textAlign="center"
            mb={4}
            style={{
              position: "relative",
            }}
          >
            <MDTypography variant="h4" fontWeight="bold">
              Vendor Car Details
            </MDTypography>
          </MDBox>
          <Grid container spacing={3}>
            <div className="py-3 ps-4 my-3" style={{
              backgroundColor: "white",
              width: "100%",
              borderRadius: "15px"
            }}>
            </div>
            <div className="py-4 my-3" style={{
              backgroundColor: "white",
              width: "100%",
              borderRadius: "15px"
            }}>
              <div className="row mx-3">
                <div className="col-sm-6 col-12" style={{ height: "100%" }}>
                  <div className="px-4 py-3 h-100" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                    <h5 className="text-center mb-3" style={{ fontWeight: "600" }}>Vendor Car information</h5>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>
                      Car Condition : 
                      <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>
                        {isExpanded 
                          ? filteredData?.car_condition
                          : `${filteredData?.car_condition?.slice(0, 250)}${filteredData?.car_condition?.length > 250 ? '...' : ''}`}
                        {filteredData?.car_condition?.length > 250 && (
                          <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#1e40af',
                              cursor: 'pointer',
                              marginLeft: '5px',
                              fontSize: '14px'
                            }}
                          >
                            {isExpanded ? 'Read Less' : 'Read More'}
                          </button>
                        )}
                      </span>
                    </p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Model Year : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px", overflowWrap: "anywhere" }}>{filteredData?.model_year}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Insurance : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.insurance ? "YES" : "NO"}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Registration Number : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.registration_number}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Color : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.color}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>PinCode : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.pincode}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>City : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.city}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>State : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.state}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>outStateAllowed : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.outStateAllowed ? "YES" : "NO"}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>AC : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.AC ? "YES" : "NO"}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Price Per Km : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.price_per_km}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Price Per Day : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.min_price_per_day}</span></p>
                    <div>Car Images</div>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {filteredData?.photos.map(ele => (
                        <div style={{ height: "200px", width: "200px" }}>
                          <img src={ele} style={{ height: "200px", width: "200px" }} alt="car"></img>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {filteredData?.car_details?.length !== 0 ? <div className="col-sm-6 col-12" style={{ height: "100%" }}>
                  <div className="px-4 py-3" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                    <h5 className="text-center mb-3" style={{ fontWeight: "600" }}>Car Details</h5>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Car Name : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.car_details?.[0]?.car_name}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Model Number : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.car_details?.[0]?.model_number}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Fuel Type : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{displayVal(filteredData?.car_details?.[0]?.fuel_type)}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Car Type : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{displayVal(filteredData?.car_details?.[0]?.car_type)}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>Number of Seats: <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.car_details?.[0]?.car_seats}</span></p>
                  </div>
                </div> : <div className="col-sm-6 col-12" style={{ height: "100%" }}>
                  <div className="px-4 py-3" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                    <h5 className="text-center mb-3" style={{ fontWeight: "600" }}>No Car Details</h5>
                  </div>
                </div>}
              </div>
            </div>
          </Grid>
        </MDBox>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default VendorCarDetail;
