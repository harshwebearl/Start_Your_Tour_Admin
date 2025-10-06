
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// @mui icons
import { makeStyles } from "@mui/styles";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Overview page components
import { createTheme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { BASE_URL } from "BASE_URL";

export const GlobleInfo = createContext();
function PackageBookingDetail() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { id } = useParams();
  const [userData, setUserData] = useState("");
  const [filteredData, setFilteredData] = useState();
  console.log(filteredData)


  const bookDetail = async () => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(
      `${BASE_URL}bookpackage/bookpackagedetail_jaydev?_id=${id}`,
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
  }, [id]);


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
              Booked Package
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
                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>name : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.customer?.[0]?.customer_detail?.[0]?.name}</span></p>
                  </div>
                  <div className="me-4">
                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>mobile number : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.customer?.[0]?.phone}</span></p>
                  </div>
                  <div className="me-4">
                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>email : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.customer?.[0]?.customer_detail?.[0]?.email_address}</span></p>
                  </div>
                  <div className="me-4">
                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>city : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.customer?.[0]?.customer_detail?.[0]?.city}</span></p>
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
                    <h5 className="text-center mb-3" style={{ fontWeight: "600" }}>customer information</h5>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>name : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.user_name}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>email : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px", overflowWrap: "anywhere" }}>{filteredData?.email_id}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>mobile number : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.contact_number}</span></p>
                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>city : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{filteredData?.city}</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-100 mt-4">
              <div className="row">
                <div className="col-md-3 col-sm-6 col-12">
                  <div className="h-100" style={{
                    backgroundColor: darkMode ? "rgb(26 46 79)" : "aliceblue",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    color: "black",
                  }}>
                    <div className="px-3 py-3">
                      <div className="text-center mb-3">
                        <h6>OVERVIEW</h6>
                      </div>
                      <div>
                        <p style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.departure} to {filteredData?.destination}</p>
                        <p style={{ fontSize: "15px", color: "#7b809a" }}>price per person : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.priceperperson}</span></p>
                        <div>
                          <p style={{ fontSize: "15px", color: "#7b809a" }}>Adults : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_adult}</span></p>
                          <p style={{ fontSize: "15px", color: "#7b809a" }}>infants : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_infant}</span></p>
                          <p style={{ fontSize: "15px", color: "#7b809a" }}>child : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_child}</span></p>
                        </div>
                        <p style={{ fontSize: "15px", color: "#7b809a" }}>total person : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_adult+ filteredData?.total_infant + filteredData?.total_child}</span></p>
                        <p style={{ fontSize: "15px", color: "#7b809a" }}>total day/nights <span style={{ color: "#344767", fontWeight: "500" }}><span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.totaldays}</span>/<span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.totalnight}</span></span></p>
                        <p style={{ fontSize: "15px", color: "#7b809a" }}>destination category : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.category?.map((e) => e)}</span></p>
                        <p style={{ fontSize: "15px", color: "#7b809a" }}>meal type : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.meal_type?.map((e) => e)}</span></p>
                        <p style={{ fontSize: "15px", color: "#7b809a" }}>travel by : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.transport_mode}</span></p>
                        <p style={{ fontSize: "15px", color: "#7b809a" }}>hotel type : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.hoteltype}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 col-12">
                  <div className="h-100" style={{
                    backgroundColor: darkMode ? "rgb(26 46 79)" : "aliceblue",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    color: "black",
                  }}>
                    <div className="px-3 py-3">
                      <div className="text-center mb-3">
                        <h6>ITENARIRY</h6>
                      </div>
                      {filteredData?.booked_itinerary?.map(it => (
                        <div style={{borderBottom:"1px solid black" , marginBottom:"10px"}}>
                          <p style={{ fontSize: "15px", color: "#7b809a" }}>day : <span style={{ color: "#344767", fontWeight: "500" }}>{it.day}</span></p>
                          <p style={{ fontSize: "15px", color: "#7b809a" }}>add location : <span style={{ color: "#344767", fontWeight: "500" }}>{it.title}</span></p>
                          <p style={{ fontSize: "15px", color: "#7b809a" }}><img src={it.photo} alt="itphoto" style={{width:"50px", height:"50px"}}></img> </p>
                          <p style={{ fontSize: "15px", color: "#7b809a" }}>add hotel : <span style={{ color: "#344767", fontWeight: "500" }}>{it.hotel_name}</span></p>
                          <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>description : </p>
                          <p className="" style={{ fontSize: "15px", color: "#344767", fontWeight: "500" }}>
                            {it.activity}
                          </p>
                        </div>)
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 col-12">
                  <div className="h-100" style={{
                    backgroundColor: darkMode ? "rgb(26 46 79)" : "aliceblue",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    color: "black",
                  }}>
                    <div className="px-3 py-3">
                      <div className="text-center mb-3">
                        <h6>SERVICE</h6>
                      </div>
                      <div>
                        <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>include : </p>
                        <p style={{ fontSize: "15px", color: "#344767", fontWeight: "500" }}>{filteredData?.booked_include?.map((e) => e.include_services_value).join(', ')}</p>
                        <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>exclude : </p>
                        <p style={{ fontSize: "15px", color: "#344767", fontWeight: "500" }}>{filteredData?.booked_exclude?.map((e) => e.exclude_services_value).join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 col-12">
                  <div className="px-3 py-3" style={{
                    backgroundColor: darkMode ? "rgb(26 46 79)" : "aliceblue",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    color: "black",
                  }}>
                    <div className="text-center mb-3">
                      <h6>HOTELS</h6>
                    </div>
                    <div>
                      <p style={{ fontSize: "15px", color: "#7b809a" }}>hotel name : <span style={{ color: "#344767", fontWeight: "500" }}>ITC narmada</span></p>
                      <p style={{ fontSize: "15px", color: "#7b809a" }}>hotel address : <span style={{ color: "#344767", fontWeight: "500" }}>shivranjani,ahmedabad</span></p>
                      <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>hotel description : </p>
                      <p className="" style={{ fontSize: "15px", color: "#344767", fontWeight: "500" }}>
                        After final match of ipl , the winner team of ipl 2023 chennai super kings is stayed here
                        and celebrate here.
                      </p>
                      <p style={{ fontSize: "15px", color: "#7b809a" }}>hotel highlights : <span style={{ color: "#344767", fontWeight: "500" }}>ITC narmada</span></p>
                      <p style={{ fontSize: "15px", color: "#7b809a" }}>hotel photo : <span style={{ color: "#344767", fontWeight: "500" }}>add photo</span></p>
                      <p style={{ fontSize: "15px", color: "#7b809a" }}>state : <span style={{ color: "#344767", fontWeight: "500" }}>gujrat</span></p>
                      <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>other : </p>
                      <p style={{ fontSize: "15px", color: "#344767", fontWeight: "500" }}>After final match of ipl , the winner team of ipl 2023 chennai super kings is stayed here
                        and celebrate here.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </MDBox>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default PackageBookingDetail;
