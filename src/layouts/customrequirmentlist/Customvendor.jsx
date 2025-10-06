import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Bill from "layouts/billing/components/Bill";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import Carousel from 'react-bootstrap/Carousel';

function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0'); // Get day and add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so add 1) and add leading zero
    const year = date.getFullYear(); // Get full year

    return `${day}-${month}-${year}`;
}

const Customvendor = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successful Deleted"
            content="Category is successfully Deleted."
            dateTime="1 sec"
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

    const { id } = useParams();
    const [it, setIt] = useState([]);

    const getItinerary = async () => {
        if (!id || id === 'undefined') return;
        const res = await fetch(`${BASE_URL}itinerary?bid_id=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        setIt(data.data);
    };



    const [bidData, setBiddata] = useState([]);
    const [filteredData, setFilteredData] = useState(null)
    console.log(filteredData)

    const BidDetailsData = async () => {
        if (!id || id === 'undefined') return;
        const token = localStorage.getItem("sytAdmin");
        const res = await fetch(`${BASE_URL}bidpackage/displayadminbid?_id=${id}`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        })
        const data = await res.json();
        setBiddata(data.data);
        setFilteredData(data.data?.[0])
    }

    // New: fetch compare data using the provided compare API
    const fetchCompareData = async () => {
        try {
            if (!id || id === 'undefined') return;
            const token = localStorage.getItem("sytAdmin");
            const res = await fetch(`${BASE_URL}bidpackage/displaybidpackages_jaydev?custom_requirement_id=${id}`, {
                method: "GET",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            // If this endpoint returns comparison bids, use it to populate bidData/filteredData
            if (data && data.data) {
                setBiddata(data.data);
                // default to first item for the existing UI that expects a single filteredData
                setFilteredData(data.data?.[0] || "");
            }
        } catch (error) {
            // silently fail - keep existing BidDetailsData as a fallback
            console.error("fetchCompareData error:", error);
        }
    }

    // get api for user detail 

    const [UserData, setUserData] = useState([]);

    const UserDetail = async () => {
        const token = localStorage.getItem("sytAdmin");
        const res = await fetch(`${BASE_URL}bidpackage/displayadminbid?_id=${id}`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        })
            try {
                const data = await res.json();

                // only set user data when the payload is valid
                if (data && Array.isArray(data.data) && data.data.length > 0) {
                    setUserData(data.data[0]);
                } else {
                    // ensure UserData is at least an empty object to avoid runtime indexing in JSX
                    setUserData([]);
                }
            } catch (err) {
                console.error('UserDetail fetch error', err);
                setUserData([]);
            }
    }

    // end of get api 

    useEffect(() => {
    UserDetail();
    getItinerary();
    // try compare API first (this API is used for compare views)
    fetchCompareData();
    // keep original BidDetailsData as a fallback in case the compare API returns nothing
    BidDetailsData();
        const fetchCategoryList = async () => {
            try {
                // const token = localStorage.getItem("sytAdmin");
                const response = await axios.get(
                    `${BASE_URL}destinationcategory`
                );

                setCategoryList(response.data.data);
                setIsLoading(false);
            } catch (error) {
            }
        };

        fetchCategoryList();
    }, []);

    const labelStyle = { fontSize: "16px", color: "#7b809a", fontWeight: "700" };
    const valueStyle = { color: "#344767", fontWeight: "500" };

    const [expandedAddresses, setExpandedAddresses] = useState({});
    const [expandedDescriptions, setExpandedDescriptions] = useState({});

    const toggleAddress = (hotelId) => {
        setExpandedAddresses(prev => ({
            ...prev,
            [hotelId]: !prev[hotelId]
        }));
    };

    const toggleDescription = (hotelId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [hotelId]: !prev[hotelId]
        }));
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3} style={{ opacity: deleteDialogOpen ? 0.3 : 1 }}>
                <MDBox
                    textAlign="center"
                    mb={4}
                    style={{
                        position: "relative",
                    }}
                >
                    <MDTypography variant="h4" fontWeight="bold">
                        Vendor Bid Package
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
                                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>name : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{UserData?.custom_requirenment?.[0]?.full_name}</span></p>
                                </div>
                                <div className="me-4">
                                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>mobile number : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{UserData?.custom_requirenment?.[0]?.mobile_no}</span></p>
                                </div>
                                <div className="me-4">
                                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>gmail : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{UserData?.custom_requirenment?.[0]?.email_address}</span></p>
                                </div>
                                <div className="me-4">
                                    <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>city : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{UserData?.custom_requirenment?.[0]?.city}</span></p>
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
                                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>name : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{UserData?.custom_requirenment?.[0]?.full_name}</span></p>
                                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>gmail : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px", overflowWrap: "anywhere" }}>{UserData?.custom_requirenment?.[0]?.email_address}</span></p>
                                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>mobile number : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{UserData?.custom_requirenment?.[0]?.mobile_no}</span></p>
                                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>city : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{UserData?.custom_requirenment?.[0]?.city}</span></p>
                                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>city : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{UserData?.custom_requirenment?.[0]?.state}</span></p>
                                </div>
                            </div>
                            <div className="col-sm-6 col-12" style={{ height: "100%" }}>
                                <div className="px-4 py-3" style={{ backgroundColor: "aliceblue", height: "100%", border: "1px solid #f0f2f5", borderRadius: "5px" }}>
                                    <h5 className="text-center mb-3" style={{ fontWeight: "600" }}>vendor information</h5>
                                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>name : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{bidData[0]?.agency[0]?.agency_personal_details[0]?.full_name}</span></p>
                                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>gmail : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{bidData[0]?.agency[0]?.agency_personal_details[0]?.email_address}</span></p>
                                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>mobile number : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{bidData[0]?.agency[0]?.agency_personal_details[0]?.mobile_number}</span></p>
                                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>city : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{bidData[0]?.agency[0]?.agency_personal_details[0]?.city}</span></p>
                                    <p style={{ color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "15px" }}>state : <span style={{ color: "#344767", fontWeight: "600", fontSize: "16px" }}>{bidData[0]?.agency[0]?.agency_personal_details[0]?.state}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-100 mt-4">
                        <div className="row gy-4">
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
                                            <p style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.departure} to {filteredData?.destination || filteredData?.package_details?.[0]?.destination?.[0]?.destination_name}</p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>start date : <span style={{ color: "#344767", fontWeight: "500" }}>{formatDate(filteredData?.start_date)}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>end date : <span style={{ color: "#344767", fontWeight: "500" }}>{formatDate(filteredData?.end_date)}</span></p>
                                            <div>
                                                <p style={{ fontSize: "15px", color: "#7b809a" }}>Adults : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_adult} ({Math.round(filteredData?.price_per_person_adult)}/per person)</span></p>
                                                <p style={{ fontSize: "15px", color: "#7b809a" }}>infants : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.Infant} ({Math.round(filteredData?.price_per_person_infant)}/per person)</span></p>
                                                <p style={{ fontSize: "15px", color: "#7b809a" }}>child : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_child} ({Math.round(filteredData?.price_per_person_child)}/per person)</span></p>
                                            </div>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>Total person : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_adult + filteredData?.Infant + filteredData?.total_child}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>Total Amount By Vendor : <span style={{ color: "#344767", fontWeight: "500" }}>{Math.round(filteredData?.total_amount)}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>Admin Margin : <span style={{ color: "#344767", fontWeight: "500" }}>{Math.round(filteredData?.total_amount * (Number(filteredData?.admin_margin?.margin_percentage) / 100))}({filteredData?.admin_margin?.margin_percentage}%)</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>Final Amount : <span style={{ color: "#344767", fontWeight: "500" }}>{Math.round(filteredData?.total_amount + (filteredData?.total_amount * (Number(filteredData?.admin_margin?.margin_percentage) / 100)))}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>Total D/N : <span style={{ color: "#344767", fontWeight: "500" }}><span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_days}</span>/<span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.total_nights}</span></span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>destination category : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.destination_categories?.map((e) => <li>{e?.category_name}</li>)}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>meal type : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.meal_types?.[0] !== "" ? filteredData?.meal_types?.map((e) => e) : "N/A"}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>meal required : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.meal_required?.[0] !== "" ? filteredData?.meal_required?.join(',') : "N/A"}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>travel by : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.travel_by}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>hotel type : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.hotel_types?.[0] === "" ? "N/A" : filteredData?.hotel_types}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>room sharing : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.room_sharing === "" ? "N/A" : filteredData?.room_sharing}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>sightseeing : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.sightseeing}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>Additional Requirement : <span style={{ color: "#344767", fontWeight: "500" }}>{filteredData?.additional_requirement}</span></p>
                                            <p style={{ fontSize: "15px", color: "#7b809a" }}>Other Services By Agency : <span style={{ color: "#344767", fontWeight: "500" }} dangerouslySetInnerHTML={{ __html: filteredData?.other_services_by_agency }}></span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-12">
                                <div className="h-100" style={{
                                    backgroundColor: darkMode ? "rgb(26 46 79)" : "aliceblue",
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                    color: "black",
                                }}>
                                    <div className="px-3 py-3">
                                        <div className="text-center mb-3">
                                            <h6>Itinerary</h6>
                                        </div>
                                        {filteredData?.itineries_details?.map(it => (
                                            <div style={{ borderBottom: "1px solid black", marginBottom: "10px" }}>
                                                <p style={{ fontSize: "15px", color: "#7b809a" }}>day : <span style={{ color: "#344767", fontWeight: "500" }}>{it.day}</span></p>
                                                <p style={{ fontSize: "15px", color: "#7b809a" }}>Add Title : <span style={{ color: "#344767", fontWeight: "500" }}>{it.title}</span></p>
                                                <p style={{ fontSize: "15px", color: "#7b809a" }}><img src={it.photo} alt="itphoto" style={{ width: "50px", height: "50px" }}></img> </p>
                                                <p style={{ fontSize: "15px", color: "#7b809a" }}>add hotel : <span style={{ color: "#344767", fontWeight: "500" }}>{it.hotel_name}</span></p>
                                                <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>description : </p>
                                                <p className="" style={{ fontSize: "15px", color: "#344767", fontWeight: "500" }} dangerouslySetInnerHTML={{ __html: it.activity }}>

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
                                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Include:</p>
                                            <ul style={{ fontSize: "15px", color: "#344767", fontWeight: "500", marginBottom: "10px" }}>
                                                {filteredData?.include_services?.map((service, index) => (
                                                    <li key={index} dangerouslySetInnerHTML={{ __html: service }} />
                                                ))}
                                            </ul>

                                            <p className="mb-1" style={{ fontSize: "15px", color: "#7b809a" }}>Exclude:</p>
                                            <ul style={{ fontSize: "15px", color: "#344767", fontWeight: "500" }}>
                                                {filteredData?.exclude_services?.map((service, index) => (
                                                    <li key={index} dangerouslySetInnerHTML={{ __html: service }} />
                                                ))}
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {filteredData?.hotel_itienrary?.length > 0 && (
                                <div className="12">
                                    <div
                                        className="px-3 py-3"
                                        style={{
                                            backgroundColor: darkMode ? "rgb(26 46 79)" : "aliceblue",
                                            borderRadius: "8px",
                                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                            color: darkMode ? "white" : "black",
                                        }}
                                    >
                                        <div className="mb-3">
                                            <h6>HOTELS</h6>
                                        </div>

                                        <Grid container spacing={2}>
                                            {filteredData?.hotel_itienrary &&
                                                filteredData.hotel_itienrary.map((ele, index) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            sm={6}
                                                            key={ele._id}
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                marginBottom: "1rem",
                                                                marginTop: "1rem",
                                                            }}
                                                        >
                                                            <div
                                                                className="hotel-card"
                                                                style={{
                                                                    width: "100%",
                                                                    backgroundColor: darkMode ? "rgb(34 47 62)" : "white",
                                                                    padding: "16px",
                                                                    borderRadius: "8px",
                                                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
                                                                                    <span style={valueStyle}>{ele?.days}</span>
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
                                                                                        {expandedAddresses[ele._id] 
                                                                                            ? ele.hotel_address 
                                                                                            : `${ele.hotel_address.slice(0, 250)}${ele.hotel_address.length > 250 ? '...' : ''}`
                                                                                        }
                                                                                        {ele.hotel_address.length > 250 && (
                                                                                            <button
                                                                                                onClick={() => toggleAddress(ele._id)}
                                                                                                style={{
                                                                                                    background: 'none',
                                                                                                    border: 'none',
                                                                                                    color: '#1e40af',
                                                                                                    cursor: 'pointer',
                                                                                                    marginLeft: '5px',
                                                                                                    fontSize: '14px'
                                                                                                }}
                                                                                            >
                                                                                                {expandedAddresses[ele._id] ? 'Read Less' : 'Read More'}
                                                                                            </button>
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
                                                                                <span dangerouslySetInnerHTML={{ 
                                                                                    __html: expandedDescriptions[ele._id] 
                                                                                        ? ele.hotel_description 
                                                                                        : `${ele.hotel_description.slice(0, 250)}${ele.hotel_description.length > 250 ? '...' : ''}`
                                                                                }} />
                                                                                {ele.hotel_description.length > 250 && (
                                                                                    <button
                                                                                        onClick={() => toggleDescription(ele._id)}
                                                                                        style={{
                                                                                            background: 'none',
                                                                                            border: 'none',
                                                                                            color: '#1e40af',
                                                                                            cursor: 'pointer',
                                                                                            marginLeft: '5px',
                                                                                            fontSize: '14px'
                                                                                        }}
                                                                                    >
                                                                                        {expandedDescriptions[ele._id] ? 'Read Less' : 'Read More'}
                                                                                    </button>
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
                            )}
                        </div>
                    </div>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
};

export default Customvendor;
