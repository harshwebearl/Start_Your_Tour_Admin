import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useMaterialUIController } from "context";
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import MDButton from "components/MDButton";
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
import { createTheme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Images
import { Table, TableHead, TableRow, TableCell, TableBody, Paper  } from '@mui/material';
import { useParams } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { BASE_URL } from "BASE_URL";
import Carousel from 'react-bootstrap/Carousel';

export const GlobleInfo = createContext();

const formatDate = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // If the current month is before the birth month or it's the birth month but the current day is before the birth day, subtract 1 from the age
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return Number(age);
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

function BookedPackage() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { bookid } = useParams();
  const [expandedInclude, setExpandedInclude] = useState({});
const [expandedExclude, setExpandedExclude] = useState({});
  const [userData, setUserData] = useState("");
  const [filteredData, setFilteredData] = useState();
  const [showFullOtherRequirement, setShowFullOtherRequirement] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState({});
  const [expandedAddress, setExpandedAddress] = useState({});
  const [expandedHotelDescriptions, setExpandedHotelDescriptions] = useState({});
  console.log(filteredData)

  const bookDetail = async () => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(
      `${BASE_URL}bookpackage/bookpackagedetail_jaydev?_id=${bookid}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const data = await res.json();
    setFilteredData(data.data[0]);
  };

  useEffect(() => {
    bookDetail();
  }, [bookid]);

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

  const labelStyle = { fontSize: "16px", color: "#7b809a", fontWeight: "700" };
  const valueStyle = { color: "#344767", fontWeight: "500" };

  const totalPercentage = Number(filteredData?.admin_margin_percentage) + 100
  const adminMargin = (Number(filteredData?.total_amount) * Number(filteredData?.admin_margin_percentage)) / totalPercentage

  const totalPaidAmount = filteredData?.payment?.reduce((sum, item) => sum + (item?.paid_amount || 0), 0);

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
            <div className="w-100 mt-4">
              <div className="row gy-4">
                <div className="col-md-12 col-sm-6 col-12">
                  <div className="h-100" style={{
                    backgroundColor: darkMode ? "rgb(26 46 79)" : "aliceblue",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    color: "black",
                  }}>
                    <div className="px-3 py-3">
                      <div>
                        <p style={{ colFor: "#344767", fontWeight: "500" }}>{filteredData?.title}</p>
                        <div className="row">
                          <div className="col-4">
                            <div className="py-3 h-100" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                              <h5 className=" mb-3" style={{ fontWeight: "600" }}>User Details</h5>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Name : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.user_name}</span></p>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Email Id : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.email_id}</span></p>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Contact Number : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.contact_number}</span></p>
                              {filteredData && filteredData?.gst_address && filteredData.gst_address !== "" && (
                                <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>
                                  Address : 
                                  <span style={{ color: "#344767", fontWeight: "500" }}>
                                    {filteredData.gst_address.length > 250 ? (
                                      <>
                                        {expandedAddress[filteredData._id] 
                                          ? filteredData.gst_address 
                                          : truncateText(filteredData.gst_address, 250)}
                                        <MDButton
                                          variant="text"
                                          color="info"
                                          size="small"
                                          onClick={() => setExpandedAddress(prev => ({
                                            ...prev,
                                            [filteredData._id]: !prev[filteredData._id]
                                          }))}
                                          sx={{
                                            p: 0,
                                            ml: 1,
                                            minWidth: "auto",
                                            fontSize: "0.75rem"
                                          }}
                                        >
                                          {expandedAddress[filteredData._id] ? "Read Less" : "Read More"}
                                        </MDButton>
                                      </>
                                    ) : (
                                      filteredData.gst_address
                                    )}
                                  </span>
                                </p>
                              )}
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>City : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.city}</span></p>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>State : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.state}</span></p>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="py-3 h-100" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                              <h5 className="mb-3" style={{ fontWeight: "600" }}>Travellers Detail</h5>
                              <div style={{ display: "grid", gridTemplateColumns: "1.7fr 0.8fr 0.5fr" }}>
                                <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "11px" }}>NAME</p>
                                <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "11px" }}>GENDER</p>
                                <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "11px" }}>AGE</p>
                              </div>
                              {filteredData && filteredData?.travel_details?.map((e, index) => (
                                <div style={{ display: "grid", gridTemplateColumns: "1.7fr 0.8fr 0.5fr" }}>
                                  <span style={{ color: "#344767", fontWeight: "600", fontSize: "14px" }}>{index + 1} {e?.first_name} {e?.last_name}</span>
                                  <span style={{ color: "#344767", fontWeight: "600", fontSize: "14px", overflowWrap: "anywhere" }}>{e?.gender}</span>
                                  <span style={{ color: "#344767", fontWeight: "600", fontSize: "14px" }}>
                                    {calculateAge(e?.dob)}
                                    {console.log(calculateAge(e?.dob))}
                                    {
                                      calculateAge(e?.dob) < 2
                                        ? "(Infant)"
                                        : calculateAge(e?.dob) >= 2 && calculateAge(e?.dob) < 12
                                          ? "(Child)"
                                          : "(Adult)"
                                    }
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="px-4 py-3 h-100" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                              <h5 className="mb-3" style={{ fontWeight: "600" }}>Agency Details</h5>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Name : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.user_name}</span></p>
                              {/* <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Agency Name : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.}</span></p> */}
                              
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Email Id : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.email_id}</span></p>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Contact Number : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.contact_number}</span></p>
                              {filteredData?.gst_address !== "" && (
                                <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Address : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.gst_address}</span></p>
                              )}
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>City : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.city}</span></p>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>State : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.state}</span></p>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="py-3 h-100" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                              <h5 className=" mb-3" style={{ fontWeight: "600" }}>Payment Details</h5>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Total Amount : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_amount}</span></p>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Paid Amount : <span style={{ color: "#344767", fontWeight: "500" }}>{totalPaidAmount}</span></p>
                              {filteredData?.payment_type_on_booking === "Partial Payment" ? (
                                <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Ramaining Amount : <span style={{ color: "#344767", fontWeight: "500" }}>{Math.round(Number(filteredData?.total_amount) - Number(totalPaidAmount))}</span></p>
                              ) : (
                                <></>
                              )}
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Payment Type : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.payment_type_on_booking}</span></p>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Status : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.payment_type}</span></p>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Admin Margin : <span style={{ color: "#344767", fontWeight: "500" }}>{Math.round(adminMargin)}({filteredData?.admin_margin_percentage}%)</span></p>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="py-3 h-100" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                              <h5 className=" mb-3" style={{ fontWeight: "600" }}>Payments</h5>
                              <div className="mt-3" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.6fr 0.6fr 1fr" }}>
                                <p className="mb-1" style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "11px" }}>PAID AMOUNT</p>
                                <p className="mb-1" style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "11px" }}>TRANSACTION ID</p>
                                <p className="mb-1" style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "11px" }}>PAYMENT MODE</p>
                                <p className="mb-1" style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "11px", textAlign: "center" }}>DATE</p>
                              </div>
                              {filteredData && filteredData?.payment?.map((e, index) => (
                                <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.6fr 0.6fr 1fr" }}>
                                  <span style={{ color: "#344767", fontWeight: "600", fontSize: "14px" }}>{Math.round(e?.paid_amount)}</span>
                                  <span style={{ color: "#344767", fontWeight: "600", fontSize: "14px" }}>{e?.transaction_id}</span>
                                  <span style={{ color: "#344767", fontWeight: "600", fontSize: "14px", overflowWrap: "anywhere", textAlign: "center" }}>{e?.payment_mode}</span>
                                  <span style={{ color: "#344767", fontWeight: "600", fontSize: "14px", textAlign: "center" }}>{formatDate(e?.payment_date)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-12">
                            <h5 className=" mb-3" style={{ fontWeight: "600" }}>Overview</h5>
                          </div>
                          <div className="col-4">
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Departure : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.departure}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Destination : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.destination}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Booking date : <span style={{ color: "#344767", fontWeight: "500" }}>{formatDate(filteredData?.bookdate)}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Booking status : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.status?.slice(0, 1)?.toUpperCase() + filteredData?.status?.slice(1)}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Destination arrival date : <span style={{ color: "#344767", fontWeight: "500" }}>{formatDate(filteredData?.destination_arrival_date)}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Start date : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.approx_start_date}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>End date : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.approx_end_date}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Package type : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.package_type}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Destination category : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.category?.map((e) => <li>{e}</li>)}</span></p>
                          </div>
                          <div className="col-4">
                            <div>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Adults : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_adult}</span></p>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Infants : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_infant}</span></p>
                              <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Child : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_child}</span></p>
                            </div>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Total person : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_adult + filteredData?.total_infant + filteredData?.total_child}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Price per person(adult) : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.price_per_person_adult}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Price per person(child) : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.price_per_person_child}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Price per person(infant) : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.price_per_person_infant}</span></p>

                          </div>
                          <div className="col-4">
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Total Day/Night : <span style={{ color: "#344767", fontWeight: "500" }}><span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.totaldays}</span>D/<span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.totalnight}N</span></span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Meal required : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.meal?.[0] !== "" ? filteredData?.meal?.join(',') : "N/A"}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Meal type : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.meal_type?.[0] !== "" ? filteredData?.meal_type?.map((e) => e) : "N/A"}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Travel by : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.transport_mode}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Hotel type : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.hoteltype === "" ? "N/A" : filteredData?.hoteltype}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Room sharing : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.room_sharing === "" ? "N/A" : filteredData?.room_sharing}</span></p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Sightseeing : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.siteseeing}</span></p>
                            <p className="mb-0" style={{ fontSize: "15px", color: "#7b809a" }}>Other Requirement :</p>
                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>
                              <span style={{ color: "#344767", fontWeight: "500" }}>
                                {filteredData?.othere_requirement?.length > 250 ? (
                                  <>
                                    {showFullOtherRequirement 
                                      ? filteredData.othere_requirement 
                                      : truncateText(filteredData.othere_requirement, 250)}
                                    <MDButton
                                      variant="text"
                                      color="info"
                                      size="small"
                                      onClick={() => setShowFullOtherRequirement(!showFullOtherRequirement)}
                                      sx={{
                                        p: 0,
                                        ml: 1,
                                        minWidth: "auto",
                                        fontSize: "0.75rem",
                                        display: "inline-flex",
                                        alignItems: "center"
                                      }}
                                    >
                                      {showFullOtherRequirement ? "Read Less" : "Read More"}
                                    </MDButton>
                                  </>
                                ) : (
                                  filteredData?.othere_requirement
                                )}
                              </span>
                            </p>
                          </div>
                          <div className="col-6">
  <h5 className="mt-3 mb-2" style={{ fontWeight: "600" }}>Include Service</h5>
  {filteredData?.booked_include?.map((e, index) => (
    <div key={index} style={{ fontSize: "14px" }}>
      {e?.include_services_value.length > 250 ? (
        <>
          {expandedInclude[index]
            ? <span dangerouslySetInnerHTML={{ __html: e?.include_services_value }} />
            : <span dangerouslySetInnerHTML={{ __html: e?.include_services_value.substring(0, 250) + "..." }} />}
          <button
            onClick={() =>
              setExpandedInclude((prev) => ({
                ...prev,
                [index]: !prev[index],
              }))
            }
            style={{
              background: "none",
              border: "none",
              color: "#3A7BD5",
              cursor: "pointer",
              fontSize: "14px",
              marginLeft: "5px",
            }}
          >
            {expandedInclude[index] ? "Read Less" : "Read More"}
          </button>
        </>
      ) : (
        <span dangerouslySetInnerHTML={{ __html: e?.include_services_value }} />
      )}
    </div>
  ))}
</div>

<div className="col-6">
  <h5 className="mt-3 mb-2" style={{ fontWeight: "600" }}>Exclude Service</h5>
  {filteredData?.booked_exclude?.map((e, index) => (
    <div key={index} style={{ fontSize: "14px" }}>
      {e?.exclude_services_value.length > 250 ? (
        <>
          {expandedExclude[index]
            ? <span dangerouslySetInnerHTML={{ __html: e?.exclude_services_value }} />
            : <span dangerouslySetInnerHTML={{ __html: e?.exclude_services_value.substring(0, 250) + "..." }} />}
          <button
            onClick={() =>
              setExpandedExclude((prev) => ({
                ...prev,
                [index]: !prev[index],
              }))
            }
            style={{
              background: "none",
              border: "none",
              color: "#3A7BD5",
              cursor: "pointer",
              fontSize: "14px",
              marginLeft: "5px",
            }}
          >
            {expandedExclude[index] ? "Read Less" : "Read More"}
          </button>
        </>
      ) : (
        <span dangerouslySetInnerHTML={{ __html: e?.exclude_services_value }} />
      )}
    </div>
  ))}
</div>
                          <div className="col-md-6 col-sm-6 col-12">
                            <h5 className="mt-3 mb-2" style={{ fontWeight: "600" }}>Itineraries</h5>
                            <div className="h-100">
                              <div className="">
                                {filteredData?.booked_itinerary?.map(it => (
                                  <div style={{ borderBottom: "1px solid black", marginBottom: "10px" }} key={it._id}>
                                    <p style={{ fontSize: "15px", color: "#7b809a" }}>day : <span style={{ color: "#344767", fontWeight: "500" }}>{it.day}</span></p>
                                    <p style={{ fontSize: "15px", color: "#7b809a" }}>Add title : <span style={{ color: "#344767", fontWeight: "500" }}>{it.title}</span></p>
                                    <p style={{ fontSize: "15px", color: "#7b809a" }}><img src={it.photo} alt="itphoto" style={{ width: "50px", height: "50px" }}></img></p>
                                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>description : </p>
                                    <div style={{ fontSize: "15px", color: "#344767", fontWeight: "500" }}>
                                      <div dangerouslySetInnerHTML={{ 
                                        __html: expandedActivities[it._id] 
                                          ? it.activity 
                                          : truncateText(it.activity.replace(/<[^>]+>/g, ''), 250)
                                      }} />
                                      {it.activity.replace(/<[^>]+>/g, '').length > 250 && (
                                        <MDButton
                                          variant="text"
                                          color="info"
                                          size="small"
                                          onClick={() => setExpandedActivities(prev => ({
                                            ...prev,
                                            [it._id]: !prev[it._id]
                                          }))}
                                          sx={{
                                            p: 0,
                                            ml: 1,
                                            minWidth: "auto",
                                            fontSize: "0.75rem"
                                          }}
                                        >
                                          {expandedActivities[it._id] ? "Read Less" : "Read More"}
                                        </MDButton>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <h5 className=" mt-3 mb-2" style={{ fontWeight: "600" }}>Hotels</h5>
                            <Grid container spacing={2}>
                              {filteredData?.hotel_itienrary &&
                                filteredData.hotel_itienrary.map((ele, index) => {
                                  return (
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      key={ele._id}
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: "1rem",
                                      }}
                                    >
                                      <div
                                        className="hotel-card"
                                        style={{
                                          width: "100%",
                                          // backgroundColor: darkMode ? "rgb(34 47 62)" : "white",
                                          padding: "16px",
                                          borderRadius: "8px",
                                          // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                      >
                                        <Grid container spacing={2}>
                                          <Grid item xs={12} sm={6}>
                                            <Carousel>
                                              {ele.hotel_photo.map((e, i) => {
                                                return (
                                                  <Carousel.Item key={i}>
                                                    <img
                                                      className="d-block w-100"
                                                      style={{
                                                        height: "200px",
                                                        borderRadius: "8px",
                                                      }}
                                                      src={e}
                                                      alt=""
                                                    />
                                                  </Carousel.Item>
                                                );
                                              })}
                                            </Carousel>
                                          </Grid>

                                          <Grid item xs={12} sm={6}>
                                            <ul className="list-unstyled">
                                              <li>
                                                <p className="mb-1" style={labelStyle}>
                                                  Day:{" "}
                                                  <span style={valueStyle}>{ele?.days?.split(',')
                                                    .map(Number) // Convert each item to a number for proper sorting
                                                    .sort((a, b) => a - b)
                                                    .join(',')}</span>
                                                </p>
                                              </li>
                                              <li>
                                                <p className="mb-1" style={labelStyle}>
                                                  Hotel Name:{" "}
                                                  <span style={valueStyle}>{ele.hotel_name}</span>
                                                </p>
                                              </li>
                                              <li>
                                                <p className="mb-1" style={labelStyle}>
                                                  Address:{" "}
                                                  <span style={valueStyle}>
                                                    {ele.hotel_address && ele.hotel_address.length > 250 ? (
                                                      <>
                                                        {expandedAddress[ele._id]
                                                          ? ele.hotel_address
                                                          : ele.hotel_address.substring(0, 250) + "..."}
                                                        <MDButton
                                                          variant="text"
                                                          color="info"
                                                          size="small"
                                                          onClick={() =>
                                                            setExpandedAddress((prev) => ({
                                                              ...prev,
                                                              [ele._id]: !prev[ele._id],
                                                            }))
                                                          }
                                                          sx={{
                                                            p: 0,
                                                            ml: 1,
                                                            minWidth: "auto",
                                                            fontSize: "0.75rem",
                                                          }}
                                                        >
                                                          {expandedAddress[ele._id] ? "Read Less" : "Read More"}
                                                        </MDButton>
                                                      </>
                                                    ) : (
                                                      ele.hotel_address
                                                    )}
                                                  </span>
                                                </p>
                                              </li>
                                              <li>
                                                <p className="mb-1" style={labelStyle}>
                                                  Location:{" "}
                                                  <span style={valueStyle}>
                                                    {ele.hotel_city}, {ele.hotel_state}
                                                  </span>
                                                </p>
                                              </li>
                                            </ul>
                                          </Grid>

                                          <Grid item xs={12}>
                                            <p className="mb-1" style={labelStyle}>
                                              Hotel Description:{" "}
                                              <span style={valueStyle}>
                                                {ele.hotel_description && ele.hotel_description.replace(/<[^>]+>/g, '').length > 250 ? (
                                                  <>
                                                    <span dangerouslySetInnerHTML={{ 
                                                      __html: expandedHotelDescriptions[ele._id] 
                                                        ? ele.hotel_description 
                                                        : truncateText(ele.hotel_description.replace(/<[^>]+>/g, ''), 250)
                                                    }} />
                                                    <MDButton
                                                      variant="text"
                                                      color="info"
                                                      size="small"
                                                      onClick={() => setExpandedHotelDescriptions(prev => ({
                                                        ...prev,
                                                        [ele._id]: !prev[ele._id]
                                                      }))}
                                                      sx={{
                                                        p: 0,
                                                        ml: 1,
                                                        minWidth: "auto",
                                                        fontSize: "0.75rem"
                                                      }}
                                                    >
                                                      {expandedHotelDescriptions[ele._id] ? "Read Less" : "Read More"}
                                                    </MDButton>
                                                  </>
                                                ) : (
                                                  <span dangerouslySetInnerHTML={{ __html: ele.hotel_description }} />
                                                )}
                                              </span>
                                            </p>
                                          </Grid>
                                        </Grid>
                                      </div>
                                    </Grid>
                                  );
                                })}
                            </Grid>
                          </div>
                        </div>
                      </div>
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

export default BookedPackage;
