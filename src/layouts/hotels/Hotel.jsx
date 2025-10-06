import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate } from "react-router-dom";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard2";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Swiper, SwiperSlide } from "swiper/react";
import Carousel from "react-bootstrap/Carousel";
import addressdata from "../../CountryStateCity.json";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { NavLink } from "react-router-dom";
import { Card, Select, TextField } from "@mui/material";
import { BASE_URL } from "BASE_URL";

const Hotel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [controller] = useMaterialUIController();
  const [temp, setTemp] = useState([]);
  const [filter, setFilter] = useState({
    searchQuery: "",
    hotelType: "",
    state: "",
    city: "",
  });
  const [selectedState, setSelectedState] = useState("");
  const fullNavigate = useNavigate();

  const CityName = async () => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(`${BASE_URL}hotel_syt`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setIsLoading(false);
    setTemp(data.data);
  };

  useEffect(() => {
    CityName();
  }, []);

  const countries = addressdata.find((obj) => obj.name === "India");

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilter({ ...filter, [id]: value });
    if (id === "state") setSelectedState(value);
  };

  const applyFilters = () => {
    return temp.filter((hotel) => {
      return (
        (!filter.searchQuery ||
          hotel.hotel_name
            .toLowerCase()
            .includes(filter.searchQuery.toLowerCase())) &&
        (!filter.hotelType || hotel.hotel_type === Number(filter.hotelType)) &&
        (!filter.state ||
          hotel.state.toLowerCase() === filter.state.toLowerCase()) &&
        (!filter.city || hotel.city.toLowerCase() === filter.city.toLowerCase())
      );
    });
  };

  const filteredHotels = applyFilters();
  console.log(filteredHotels);

const dropdownStyle = {
  color: "#7b809a",
  background: "transparent",
  border: "1px solid #dadbda",
  width: "100%",
  height: "40px",
  padding: "0px 15px",
  borderRadius: "5px",
  fontSize: "14px",
};


  return (
    <DashboardLayout>
      <DashboardNavbar />
   <MDBox pt={6} pb={3}>
  {/* Title & Add Button */}
  <MDBox
    display="flex"
    flexDirection={{ xs: "column", md: "row" }}
    justifyContent={{ xs: "center", md: "space-between" }}
    alignItems="center"
    mb={3}
    textAlign={{ xs: "center", md: "left" }}
  >
    <MDTypography variant="h4" fontWeight="bold">
      Manage Hotels ({filteredHotels?.length})
    </MDTypography>

    <Link to="/insert-Addhotel" style={{ textDecoration: "none", marginTop: "1rem" }}>
    <MDButton
  variant="gradient"
        color="dark"
        size="medium"
        sx={{
          minWidth: { xs: "50px", md: "180px" },
          px: { xs: 0, md: 2 },
          py: { xs: 1.5, md: 1 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: "50px", md: "auto" },
          color: "#fff", // white color
  }}
>
  <Icon sx={{ fontWeight: "bold", color: "white" }}>add</Icon>

  <MDTypography
    
    sx={{
            display: { xs: "none", md: "inline" },
            ml: 1,
            fontSize: "0.875rem",
            fontWeight: "bold",
            color: "#fff",
          }}
  >
    Add New Hotel
  </MDTypography>
</MDButton>

    </Link>
  </MDBox>

  {/* Filters */}
  <Grid container spacing={2} mb={3}>
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        fullWidth
        id="searchQuery"
        label="Hotel Name"
        variant="outlined"
        value={filter.searchQuery}
        onChange={handleFilterChange}
      />
    </Grid>
    <Grid item xs={12} sm={6} md={2}>
      <select
        id="hotelType"
        value={filter.hotelType}
        onChange={handleFilterChange}
        style={dropdownStyle}
      >
        <option value="">Select Hotel Type</option>
        <option value="1">1 Star</option>
        <option value="2">2 Star</option>
        <option value="3">3 Star</option>
        <option value="4">4 Star</option>
        <option value="5">5 Star</option>
      </select>
    </Grid>
    <Grid item xs={12} sm={6} md={2}>
      <select
        id="state"
        value={filter.state}
        onChange={handleFilterChange}
        style={dropdownStyle}
      >
        <option value="">Select State</option>
        {countries.states?.map((e) => (
          <option key={e.id} value={e.name}>{e.name}</option>
        ))}
      </select>
    </Grid>
    <Grid item xs={12} sm={6} md={2}>
      <select
        id="city"
        value={filter.city}
        onChange={handleFilterChange}
        style={dropdownStyle}
      >
        <option value="">Select City</option>
        {countries.states
          ?.filter(state => state.name.toLowerCase() === selectedState.toLowerCase())
          .flatMap(state => state.cities.map(city => (
            <option key={city.id} value={city.name}>{city.name}</option>
          )))}
      </select>
    </Grid>
  </Grid>

  {/* Hotel Cards */}
  <Grid container spacing={2}>
    {isLoading ? (
      <Grid item xs={12}>
        <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
      </Grid>
    ) : (
      <Card style={{ width: "100%", marginTop: "2rem" }}>
        <Grid container spacing={2}>
          {filteredHotels?.slice().reverse().map((ele) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              key={ele._id}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="p-3" style={{ backgroundColor: "aliceblue", width: "100%" }}>
                <div className="row">
                  <div className="col-12 text-end">
                    <NavLink to={`/update-hotel/${ele._id}`} style={{ color: "black" }}>
                      <EditNoteIcon />
                    </NavLink>
                  </div>
                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <Carousel>
                      {ele.hotel_photo.map((photo, i) => (
                        <Carousel.Item key={i}>
                          <img
                            className="d-block w-100"
                            style={{ height: "200px", objectFit: "cover" }}
                            src={photo}
                            alt="Hotel slide"
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                  <div className="col-12 col-md-6">
                    <ul className="list-unstyled">
                      <li><strong>Hotel Name:</strong> {ele.hotel_name}</li>
                      <li><strong>City:</strong> {ele.city}</li>
                      <li><strong>State:</strong> {ele.state}</li>
                      <li>
                        <strong>Description:</strong> {ele.hotel_description.slice(0, 10)}...
                      </li>
                    </ul>
                    <div className="mt-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => fullNavigate(`/Full-detail/${ele._id}`)}
                      >
                        View Full Detail
                      </button>
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

export default Hotel;
