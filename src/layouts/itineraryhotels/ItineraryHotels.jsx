import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import { NavLink } from "react-router-dom";
import { Card } from "@mui/material";
import { BASE_URL } from "BASE_URL";
import Icon from "@mui/material/Icon";
import EditNoteIcon from '@mui/icons-material/EditNote';

const ItineraryHotel = () => {
    const [plan, setPlan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [city, setCity] = useState([]);
    const [temp, setTemp] = useState([]);
    const navigate = useNavigate();
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [expandedAddresses, setExpandedAddresses] = useState({});

    const toggleDescription = (id) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleAddress = (id) => {
        setExpandedAddresses(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("sytAdmin");
            const [cityRes, planRes] = await Promise.all([
                fetch(`${BASE_URL}api/hotel_itienrary/displayAgencyById`, {
                    method: "GET",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    }
                }),
                axios.get(`${BASE_URL}package`)
            ]);

            const cityData = await cityRes.json();
            setCity(cityData.data);
            setTemp(cityData.data);
            setPlan(planRes.data.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilter = (searchQuery) => {
        const filteredItems = city.filter((item) =>
            item.hotel_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setTemp(filteredItems.length === 0 && searchQuery === "" ? city : filteredItems);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar onFilter={handleFilter} />
            <MDBox pt={6} pb={3}>
                <MDBox textAlign="center" mb={4} >
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
                        Manage Itinerary Hotels
                    </MDTypography>
                    <Link to="/insert-itinerary-hotels" style={{ textDecoration: "none" }}>
                        <MDButton variant="gradient" color="dark" sx={{
          padding: "6px 16px",
          fontSize: "14px",
          minWidth: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
                            <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                            &nbsp;Add New Hotel
                        </MDButton>
                    </Link>
                    </MDBox>
                </MDBox>
                <Grid container >
                    {isLoading ? (
                        <Grid item xs={12} textAlign="center">
                            <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
                        </Grid>
                    ) : (
                        <Card style={{ width: "100%", marginTop: "2rem" }}>
                            <Grid container >
                                {temp && [...temp].reverse().map((ele) => (
                                    <Grid item xs={12} sm={6} key={ele._id} style={{ marginBottom: "1rem", marginTop: "1rem", position: "relative" }}>
                                        <div className="mx-4 px-4 pb-3" style={{ backgroundColor: "aliceblue" }}>
                                            <div className="d-flex justify-content-between px-2">
                                                <div className="row">
                                                    <div className="col-12 text-end pe-0" style={{ fontSize: "24px" }}>
                                                        <NavLink to={`/edit-itinerary-hotels/${ele._id}`} style={{ color: "black" }}>
                                                            <EditNoteIcon />
                                                        </NavLink>
                                                    </div>
                                                    <div className="col-md-6 col-sm-12 col-12 d-flex align-items-center">
                                                        <Carousel>
                                                            {ele.hotel_photo.map((e, i) => (
                                                                <Carousel.Item key={i}>
                                                                    <img className="d-block w-100" style={{ height: "200px" }} src={e} alt={`Slide ${i}`} />
                                                                </Carousel.Item>
                                                            ))}
                                                        </Carousel>
                                                    </div>
                                                    <div className="col-md-6 col-sm-12 col-12 d-flex">
                                                        <ul className="list-unstyled">
                                                            <li><p className="mb-1" style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>Hotel name: <span style={{ color: "#344767", fontWeight: "500" }}>{ele.hotel_name}</span></p></li>
                                                            <li><p className="mb-1" style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>Address: <span style={{ color: "#344767", fontWeight: "500" }}>
                                                                {ele.hotel_address.length > 250 ? (
                                                                    <>
                                                                        {expandedAddresses[ele._id]
                                                                            ? ele.hotel_address
                                                                            : `${ele.hotel_address.substring(0, 250)}...`}
                                                                        <button
                                                                            onClick={() => toggleAddress(ele._id)}
                                                                            style={{
                                                                                background: 'none',
                                                                                border: 'none',
                                                                                color: '#3A7BD5',
                                                                                cursor: 'pointer',
                                                                                marginLeft: '5px',
                                                                                fontWeight: '500'
                                                                            }}
                                                                        >
                                                                            {expandedAddresses[ele._id] ? 'Read Less' : 'Read More'}
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    ele.hotel_address
                                                                )}
                                                            </span></p></li>
                                                            <li><p className="mb-1" style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>Location: <span style={{ color: "#344767", fontWeight: "500" }}>{ele.hotel_city}, {ele.hotel_state}</span></p></li>
                                                        </ul>
                                                    </div>

                                                    <div className="col-12 mt-2">
                                                        <p className="mb-1" style={{ fontSize: "14px", color: "#7b809a", fontWeight: "700" }}>
                                                            Meals:
                                                            <span style={{ color: "#344767", fontWeight: "500" }}>
                                                                {ele?.breakfast && ` Breakfast (₹${ele.breakfast_price}),`}
                                                                {ele?.lunch && ` Lunch (₹${ele.lunch_price}),`}
                                                                {ele?.dinner && ` Dinner (₹${ele.dinner_price})`}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <div className="col-12 mt-2">
                                                        <p className="mb-1" style={{ fontSize: "14px", color: "#7b809a", fontWeight: "700" }}>
                                                            Rooms:
                                                        </p>
                                                        <ul className="list-unstyled mb-1">
                                                            {ele?.rooms?.map((room) => (
                                                                <li key={room._id} style={{ fontSize: "14px", color: "#344767", fontWeight: "500" }}>
                                                                    {room.room_type} - ₹{room.room_type_price}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>


                                                    <div className="col-12">
    <p className="mb-1" style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>
        Hotel description: 
        <span style={{ color: "#344767", fontWeight: "500" }}>
            {ele.hotel_description.length > 250 ? (
                <>
                    {expandedDescriptions[ele.id] 
                        ? ele.hotel_description 
                        : `${ele.hotel_description.substring(0, 250)}...`}
                    <button 
                        onClick={() => toggleDescription(ele.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#3A7BD5',
                            cursor: 'pointer',
                            marginLeft: '5px',
                            fontWeight: '500'
                        }}
                    >
                        {expandedDescriptions[ele.id] ? 'Read Less' : 'Read More'}
                    </button>
                </>
            ) : (
                ele.hotel_description
            )}
        </span>
    </p>
</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>
                    )}
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
};

export default ItineraryHotel;
