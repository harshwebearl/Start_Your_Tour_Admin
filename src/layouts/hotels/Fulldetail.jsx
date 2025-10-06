import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import {
  Button,
  IconButton,
  Chip,
  styled,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { NavLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { BASE_URL } from "BASE_URL";

const formatDate1 = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

function getOldestStartDate(priceAndDateArray) {
  if (!priceAndDateArray || priceAndDateArray.length === 0) return "";
  const oldestDate = priceAndDateArray.reduce((min, price) =>
    new Date(price.price_start_date) < new Date(min.price_start_date) ? price : min
  ).price_start_date;
  return formatDate1(oldestDate);
}

function getFurthestEndDate(priceAndDateArray) {
  if (!priceAndDateArray || priceAndDateArray.length === 0) return "";
  const furthestDate = priceAndDateArray.reduce((max, price) =>
    new Date(price.price_end_date) > new Date(max.price_end_date) ? price : max
  ).price_end_date;
  return formatDate1(furthestDate);
}

const rightDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

function calculateAdjustedPrice(price, percentage) {
  const numericPrice = parseFloat(price);
  const numericPercentage = parseFloat(percentage);
  if (isNaN(numericPrice) || isNaN(numericPercentage)) {
    return "Invalid";
  }
  return (numericPrice * numericPercentage) / 100;
}

function calculateAdjustedPricePercentage(price, percentage) {
  const numericPrice = parseFloat(price);
  const numericPercentage = parseFloat(percentage);
  if (isNaN(numericPrice) || isNaN(numericPercentage)) {
    return "Invalid";
  }
  return numericPrice + (numericPrice * numericPercentage) / 100;
}

function getMarginPercentage(dateString, dataArray) {
  if (!dateString || !dataArray) return 10;
  const [day, month, year] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const monthName = date.toLocaleString("default", { month: "long" });
  const result = dataArray.find((item) => item.month_name === monthName);
  return result ? result.margin_percentage : 10;
}

const StatusBadge = styled(Chip)(({ status }) => ({
  backgroundColor:
    status === "available"
      ? "#4caf50"
      : status === "booked"
      ? "#ff9800"
      : status === "sold out"
      ? "#f44336"
      : "#ccc",
  color: "#fff",
  fontWeight: "bold",
  textTransform: "capitalize",
  marginBottom: "8px",
  fontSize: { xs: "12px", sm: "14px" },
  padding: { xs: "4px 8px", sm: "6px 12px" },
}));

const Fulldetail = () => {
  const [plan, setPlan] = useState([]);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [expandedTitles, setExpandedTitles] = useState({});
  const [expandedHighlights, setExpandedHighlights] = useState({});
  const [expandedText, setExpandedText] = useState({});
  const [expandedAddress, setExpandedAddress] = useState(false);
  const [expandedOther, setExpandedOther] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedHighlightTexts, setExpandedHighlightTexts] = useState({});

  const toggleTitle = (roomId) => {
    setExpandedTitles((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfully Deleted"
      content="Category is successfully deleted."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem("sytAdmin");
      try {
        const res = await fetch(`${BASE_URL}hotel_syt/details?_id=${id}`, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setDetail(data?.data?.[0] || {});
        setRooms(data?.data?.[0]?.rooms || []);
        setHighlights(data?.data?.[0]?.Highlights || []);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (selectedPlan) {
        const token = localStorage.getItem("sytAdmin");
        const responseDelete = await axios.delete(
          `${BASE_URL}hotel_syt/${selectedPlan._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (responseDelete.data.status === "OK") {
          openSuccessSB();
          setPlan((prev) => prev.filter((plan) => plan._id !== selectedPlan._id));
          setSelectedPlan(null);
        }
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = (plan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleScroll = (direction) => {
    const container = document.getElementById("rooms-container");
    if (container) {
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const [detail, setDetail] = useState({});
  const [rooms, setRooms] = useState([]);
  const [highlights, setHighlights] = useState([]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3} sx={{ opacity: deleteDialogOpen ? 0.3 : 1, px: { xs: 1, sm: 2, md: 3 } }}>
        <MDBox textAlign="center" mb={3}>
          <MDTypography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
            Hotel Details
          </MDTypography>
        </MDBox>

        <MDBox sx={{ backgroundColor: "white", borderRadius: "16px", p: { xs: 2, sm: 3 } }}>
          {/* Hotel Detail */}
          <Grid container spacing={2} sx={{ backgroundColor: "#f0f8ff", p: { xs: 1, sm: 2 }, borderRadius: "12px" }}>
            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                Hotel
              </MDTypography>
              <NavLink to={`/update-hotel/${id}`}>
                <IconButton size="small">
                  <img src="/pencil.png" alt="edit" style={{ height: "16px", width: "16px" }} />
                </IconButton>
              </NavLink>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Carousel>
                {detail?.hotel_photo?.map((photo, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={photo}
                      alt={`Slide ${index}`}
                      style={{
                        height: { xs: "120px", sm: "180px", md: "220px" },
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <MDBox sx={{ p: { xs: 1, sm: 2 } }}>
                {[
                  { label: "Hotel Name", value: detail.hotel_name },
                  {
                    label: "Hotel Address",
                    value: detail?.hotel_address,
                    expandable: expandedAddress,
                    setExpandable: setExpandedAddress,
                    maxLength: 100,
                  },
                  { label: "Hotel City", value: detail.city },
                  { label: "Hotel State", value: detail.state },
                  { label: "Hotel Type", value: detail.hotel_type },
                  {
                    label: "Hotel Description",
                    value: detail?.hotel_description,
                    expandable: expandedDescription,
                    setExpandable: setExpandedDescription,
                    maxLength: 100,
                  },
                  {
                    label: "Other",
                    value: detail?.other || "No additional details available.",
                    expandable: expandedOther,
                    setExpandable: setExpandedOther,
                    maxLength: 100,
                  },
                ].map(({ label, value, expandable, setExpandable, maxLength }, index) => (
                  <MDTypography
                    key={index}
                    variant="body2"
                    fontWeight="bold"
                    color="textSecondary"
                    sx={{ mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}
                  >
                    {label}:{" "}
                    <span style={{ fontWeight: 500, color: "#344767" }}>
                      {value && maxLength && value.length > maxLength ? (
                        <>
                          {expandable ? value : `${value.substring(0, maxLength)}...`}
                          <Button
                            onClick={() => setExpandable(!expandable)}
                            size="small"
                            sx={{ color: "#3A7BD5", p: 0, ml: 1, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                          >
                            {expandable ? "Read Less" : "Read More"}
                          </Button>
                        </>
                      ) : (
                        value || "-"
                      )}
                    </span>
                  </MDTypography>
                ))}
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDTypography
                variant="body2"
                fontWeight="bold"
                color="textSecondary"
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                Hotel Highlights:
              </MDTypography>
              <Grid container spacing={1} justifyContent={{ xs: "center", sm: "flex-start" }}>
                {highlights.map((ele, index) => (
                  <Grid item xs={4} sm={3} md={2} key={index} textAlign="center">
                    <img
                      src={ele.icon}
                      alt={ele.title}
                      style={{
                        height: { xs: "32px", sm: "40px" },
                        width: { xs: "32px", sm: "40px" },
                      }}
                    />
                    <MDTypography
                      variant="caption"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                    >
                      {ele.title}
                    </MDTypography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Rooms */}
          <Grid container spacing={2} sx={{ my: 2, backgroundColor: "#f0f8ff", p: { xs: 1, sm: 2 }, borderRadius: "12px" }}>
            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                Rooms
              </MDTypography>
              <MDButton
                variant="contained"
                color="dark"
                size="small"
                onClick={() => navigate("/add-new-room", { state: { hotelid: id } })}
                sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, px: { xs: 1, sm: 2 } }}
              >
                Add Rooms
              </MDButton>
            </Grid>
            <Grid item xs={12} sx={{ position: "relative" }}>
              {rooms.length > 0 && (
                <>
                  <MDBox
                    sx={{
                      position: "absolute",
                      left: { xs: 0, sm: 1 },
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                      display: { xs: rooms.length > 1 ? "block" : "none", sm: "block" },
                    }}
                  >
                    <IconButton
                      onClick={() => handleScroll("left")}
                      sx={{
                        backgroundColor: "white",
                        "&:hover": { backgroundColor: "white" },
                        boxShadow: 2,
                        p: { xs: 0.5, sm: 1 },
                      }}
                    >
                      <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                  </MDBox>
                  <MDBox
                    sx={{
                      position: "absolute",
                      right: { xs: 0, sm: 1 },
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                      display: { xs: rooms.length > 1 ? "block" : "none", sm: "block" },
                    }}
                  >
                    <IconButton
                      onClick={() => handleScroll("right")}
                      sx={{
                        backgroundColor: "white",
                        "&:hover": { backgroundColor: "white" },
                        boxShadow: 2,
                        p: { xs: 0.5, sm: 1 },
                      }}
                    >
                      <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                  </MDBox>
                </>
              )}
              {!rooms.length ? (
                <MDTypography textAlign="center" py={2} sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                  No rooms available
                </MDTypography>
              ) : (
                <MDBox
                  id="rooms-container"
                  sx={{
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    display: "flex",
                    py: 1,
                    scrollSnapType: "x mandatory",
                    "&::-webkit-scrollbar": { display: "none" },
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    gap: 2,
                  }}
                >
                  {rooms.map((ele) => (
                    <MDBox
                      key={ele._id}
                      sx={{
                        minWidth: { xs: "100%", sm: "80%", md: "45%", lg: "30%" },
                        flex: "0 0 auto",
                        scrollSnapAlign: "start",
                        px: 1,
                      }}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={5}>
                          <MDBox sx={{ position: "relative" }}>
                            <IconButton
                              onClick={() => navigate(`/update-room/${ele._id}`)}
                              sx={{
                                position: "absolute",
                                top: 6,
                                right: 6,
                                backgroundColor: "white",
                                "&:hover": { backgroundColor: "white" },
                                boxShadow: 2,
                                p: 0.5,
                              }}
                            >
                              <img src="/pencil.png" alt="edit" style={{ height: "14px", width: "14px" }} />
                            </IconButton>
                            <Carousel>
                              {ele?.photos?.map((photo, index) => (
                                <Carousel.Item key={index}>
                                  <img
                                    className="d-block w-100"
                                    src={photo}
                                    alt={`Slide ${index}`}
                                    style={{
                                      height: { xs: "120px", sm: "160px", md: "180px" },
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                    }}
                                  />
                                </Carousel.Item>
                              ))}
                            </Carousel>
                          </MDBox>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          <MDBox sx={{ px: { xs: 1, sm: 2 } }}>
                            <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                              <MDTypography
                                variant="body2"
                                fontWeight="bold"
                                color="textSecondary"
                                sx={{ width: "65%", fontSize: { xs: "0.9rem", sm: "1rem" } }}
                              >
                                Room:{" "}
                                <span style={{ fontWeight: 500, color: "#344767", wordBreak: "break-word" }}>
                                  {expandedTitles[ele._id]
                                    ? ele.room_title
                                    : `${ele.room_title.slice(0, 80)}${ele.room_title.length > 80 ? "..." : ""}`}
                                  {ele.room_title.length > 80 && (
                                    <Button
                                      onClick={() => toggleTitle(ele._id)}
                                      size="small"
                                      sx={{ color: "#3A7BD5", p: 0, ml: 1, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                                    >
                                      {expandedTitles[ele._id] ? "Read Less" : "Read More"}
                                    </Button>
                                  )}
                                </span>
                              </MDTypography>
                              <StatusBadge
                                status={ele.status}
                                label={ele.status || ""}
                                sx={{ height: "22px", minWidth: "70px" }}
                              />
                            </MDBox>
                            <MDTypography
                              variant="body2"
                              fontWeight="bold"
                              color="textSecondary"
                              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                            >
                              Available Between:{" "}
                              <span style={{ fontWeight: 500, color: "#344767" }}>
                                {getOldestStartDate(ele?.price_and_date)} to{" "}
                                {getFurthestEndDate(ele?.price_and_date)}
                              </span>
                            </MDTypography>
                            <MDTypography
                              variant="body2"
                              fontWeight="bold"
                              color="textSecondary"
                              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                            >
                              Highlights:
                              <ul style={{ paddingLeft: 16, margin: 0 }}>
                                {ele.room_highlights
                                  .slice(0, expandedHighlights[ele._id] ? undefined : 4)
                                  .map((highlight, index) => (
                                    <li key={index} style={{ fontWeight: 500, color: "#344767", fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
                                      {highlight.length > 80 ? (
                                        <>
                                          {expandedHighlightTexts[`${ele._id}-${index}`]
                                            ? highlight
                                            : `${highlight.substring(0, 80)}...`}
                                          <Button
                                            onClick={() =>
                                              setExpandedHighlightTexts((prev) => ({
                                                ...prev,
                                                [`${ele._id}-${index}`]: !prev[`${ele._id}-${index}`],
                                              }))
                                            }
                                            size="small"
                                            sx={{ color: "#3A7BD5", p: 0, ml: 1, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                                          >
                                            {expandedHighlightTexts[`${ele._id}-${index}`]
                                              ? "Read Less"
                                              : "Read More"}
                                          </Button>
                                        </>
                                      ) : (
                                        highlight
                                      )}
                                    </li>
                                  ))}
                              </ul>
                              {ele.room_highlights.length > 4 && (
                                <Button
                                  onClick={() =>
                                    setExpandedHighlights((prev) => ({
                                      ...prev,
                                      [ele._id]: !prev[ele._id],
                                    }))
                                  }
                                  size="small"
                                  sx={{ color: "#3A7BD5", p: 0, ml: 1, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                                >
                                  {expandedHighlights[ele._id] ? "Show Less" : "Show More"}
                                </Button>
                              )}
                            </MDTypography>
                          </MDBox>
                        </Grid>
                        <Grid item xs={12}>
                          <MDBox
                            sx={{
                              p: 1,
                              borderRadius: "8px",
                              boxShadow: 1,
                              backgroundColor: "white",
                            }}
                          >
                            <Grid
                              container
                              spacing={0.5}
                              sx={{
                                textAlign: "center",
                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                              }}
                            >
                              {["Price/Person", "Admin Margin", "Start Date", "End Date", "Final Price", "Actions"].map((header, index) => (
                                <Grid item xs={2} key={index}>
                                  <MDTypography
                                    variant="caption"
                                    fontWeight="bold"
                                    color="success"
                                    sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
                                  >
                                    {header}
                                  </MDTypography>
                                </Grid>
                              ))}
                            </Grid>
                            <hr style={{ border: "none", borderTop: "1px solid #ddd", my: 0.5 }} />
                            {ele?.price_and_date?.map((updatedItem, index) => (
                              <Grid container spacing={0.5} sx={{ textAlign: "center", py: 0.5 }} key={index}>
                                <Grid item xs={2}>
                                  <MDTypography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                                  >
                                    {updatedItem?.adult_price}(A)<br />
                                    {updatedItem?.extra_bad}(C)
                                  </MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                  <MDTypography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                                  >
                                    {calculateAdjustedPrice(
                                      updatedItem?.adult_price,
                                      getMarginPercentage(
                                        rightDate(updatedItem?.price_start_date?.slice(0, 10)),
                                        detail?.profitMargin?.[0]?.month_and_margin_user
                                      )
                                    )} ({getMarginPercentage(
                                      rightDate(updatedItem?.price_start_date?.slice(0, 10)),
                                      detail?.profitMargin?.[0]?.month_and_margin_user
                                    )}%)<br />
                                    {calculateAdjustedPrice(
                                      updatedItem?.extra_bad,
                                      getMarginPercentage(
                                        rightDate(updatedItem?.price_start_date?.slice(0, 10)),
                                        detail?.profitMargin?.[0]?.month_and_margin_user
                                      )
                                    )} ({getMarginPercentage(
                                      rightDate(updatedItem?.price_start_date?.slice(0, 10)),
                                      detail?.profitMargin?.[0]?.month_and_margin_user
                                    )}%)
                                  </MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                  <MDTypography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                                  >
                                    {rightDate(updatedItem?.price_start_date?.slice(0, 10))}
                                  </MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                  <MDTypography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                                  >
                                    {rightDate(updatedItem?.price_end_date?.slice(0, 10))}
                                  </MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                  <MDTypography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                                  >
                                    {Math.round(calculateAdjustedPricePercentage(
                                      updatedItem?.adult_price,
                                      getMarginPercentage(
                                        rightDate(updatedItem?.price_start_date?.slice(0, 10)),
                                        detail?.profitMargin?.[0]?.month_and_margin_user
                                      )
                                    ))}<br />
                                    {Math.round(calculateAdjustedPricePercentage(
                                      updatedItem?.extra_bad,
                                      getMarginPercentage(
                                        rightDate(updatedItem?.price_start_date?.slice(0, 10)),
                                        detail?.profitMargin?.[0]?.month_and_margin_user
                                      )
                                    ))}
                                  </MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                  <IconButton
                                    onClick={() => openDeleteDialog({ _id: ele._id })}
                                    color="secondary"
                                    size="small"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            ))}
                          </MDBox>
                        </Grid>
                      </Grid>
                    </MDBox>
                  ))}
                </MDBox>
              )}
            </Grid>
          </Grid>

          {/* Amenities and Facilities */}
          <Grid container spacing={2} sx={{ my: 2, backgroundColor: "#f0f8ff", p: { xs: 1, sm: 2 }, borderRadius: "12px" }}>
            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                Amenities and Facilities
              </MDTypography>
              <MDButton
                variant="contained"
                color="dark"
                size="small"
                onClick={() => navigate("/add-new-aminities", { state: { hotelid: id } })}
                sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, px: { xs: 1, sm: 2 } }}
              >
                Add Amenities
              </MDButton>
            </Grid>
            <Grid item xs={12}>
              {detail?.amenities_and_facilities?.length === 0 ? (
                <MDTypography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                  No Amenities and Facilities
                </MDTypography>
              ) : (
                <Grid container spacing={1}>
                  {detail?.amenities_and_facilities?.map((ele1) => (
                    <Grid item xs={12} sm={6} md={4} key={ele1._id} sx={{ position: "relative" }}>
                      <IconButton
                        onClick={() => navigate(`/update-amenities/${ele1._id}/${id}`)}
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          backgroundColor: "white",
                          "&:hover": { backgroundColor: "white" },
                          boxShadow: 2,
                          p: 0.5,
                        }}
                      >
                        <img src="/pencil.png" alt="edit" style={{ height: "14px", width: "14px" }} />
                      </IconButton>
                      <dl>
                        <dt
                          style={{
                            color: "#344767",
                            fontWeight: 600,
                            fontSize: { xs: "1rem", sm: "1.125rem" },
                            p: 1,
                            wordBreak: "break-word",
                          }}
                        >
                          {ele1.title.length > 80 ? (
                            <>
                              {expandedText[`title-${ele1._id}`]
                                ? ele1.title
                                : `${ele1.title.slice(0, 80)}...`}
                              <Button
                                onClick={() =>
                                  setExpandedText((prev) => ({
                                    ...prev,
                                    [`title-${ele1._id}`]: !prev[`title-${ele1._id}`],
                                  }))
                                }
                                size="small"
                                sx={{ color: "#3A7BD5", p: 0, mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                              >
                                {expandedText[`title-${ele1._id}`] ? "Show Less" : "Show More"}
                              </Button>
                            </>
                          ) : (
                            ele1.title
                          )}
                        </dt>
                        {ele1?.points?.map((point, index) => (
                          <dd
                            key={index}
                            style={{
                              fontSize: { xs: "0.85rem", sm: "0.95rem" },
                              color: "#7b809a",
                              fontWeight: 500,
                              p: 0.5,
                              wordBreak: "break-word",
                            }}
                          >
                            {point.length > 80 ? (
                              <>
                                {expandedText[`${ele1._id}-${index}`]
                                  ? point
                                  : `${point.slice(0, 80)}...`}
                                <Button
                                  onClick={() =>
                                    setExpandedText((prev) => ({
                                      ...prev,
                                      [`${ele1._id}-${index}`]: !prev[`${ele1._id}-${index}`],
                                    }))
                                  }
                                  size="small"
                                  sx={{ color: "#3A7BD5", p: 0, mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                                >
                                  {expandedText[`${ele1._id}-${index}`] ? "Show Less" : "Show More"}
                                </Button>
                              </>
                            ) : (
                              point
                            )}
                          </dd>
                        ))}
                      </dl>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Properties and Policies */}
          <Grid container spacing={2} sx={{ my: 2, backgroundColor: "#f0f8ff", p: { xs: 1, sm: 2 }, borderRadius: "12px" }}>
            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                Properties and Policies
              </MDTypography>
              {detail?.property_policies?.[0] ? (
                <NavLink to={`/update-properties/${id}`}>
                  <IconButton size="small">
                    <img src="/pencil.png" alt="edit" style={{ height: "16px", width: "16px" }} />
                  </IconButton>
                </NavLink>
              ) : (
                <MDButton
                  variant="contained"
                  color="dark"
                  size="small"
                  onClick={() =>
                    navigate("/Add-properties", {
                      state: { hotelid: id, hotelName: detail.hotel_name },
                    })
                  }
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, px: { xs: 1, sm: 2 } }}
                >
                  Add Property Policies
                </MDButton>
              )}
            </Grid>
            {detail?.property_policies?.[0] && (
              <Grid item xs={12}>
                <MDBox sx={{ px: { xs: 1, sm: 2 } }}>
                  <MDTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ wordBreak: "break-word", fontSize: { xs: "1rem", sm: "1.125rem" } }}
                  >
                    {detail?.property_policies?.[0]?.policy_title?.length > 80 ? (
                      <>
                        {expandedText[`policy-title`]
                          ? detail?.property_policies?.[0]?.policy_title
                          : `${detail?.property_policies?.[0]?.policy_title.slice(0, 80)}...`}
                        <Button
                          onClick={() =>
                            setExpandedText((prev) => ({
                              ...prev,
                              [`policy-title`]: !prev[`policy-title`],
                            }))
                          }
                          size="small"
                          sx={{ color: "#3A7BD5", p: 0, mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                        >
                          {expandedText[`policy-title`] ? "Show Less" : "Show More"}
                        </Button>
                      </>
                    ) : (
                      detail?.property_policies?.[0]?.policy_title || "-"
                    )}
                  </MDTypography>
                  <MDTypography
                    variant="body2"
                    color="textSecondary"
                    sx={{ wordBreak: "break-word", p: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}
                  >
                    {detail?.property_policies?.[0]?.policy_description?.length > 80 ? (
                      <>
                        {expandedText[`policy-description`]
                          ? detail?.property_policies?.[0]?.policy_description
                          : `${detail?.property_policies?.[0]?.policy_description.slice(0, 80)}...`}
                        <Button
                          onClick={() =>
                            setExpandedText((prev) => ({
                              ...prev,
                              [`policy-description`]: !prev[`policy-description`],
                            }))
                          }
                          size="small"
                          sx={{ color: "#3A7BD5", p: 0, mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                        >
                          {expandedText[`policy-description`] ? "Read Less" : "Read More"}
                        </Button>
                      </>
                    ) : (
                      detail?.property_policies?.[0]?.policy_description || "-"
                    )}
                  </MDTypography>
                  <Grid container spacing={1}>
                    {[
                      {
                        label: "Adult",
                        title: detail?.property_policies?.[0]?.adult_and_above,
                        points: detail?.property_policies?.[0]?.adult_and_above_points,
                        key: "adult",
                      },
                      {
                        label: "Children",
                        title: detail?.property_policies?.[0]?.children,
                        points: detail?.property_policies?.[0]?.childern_points,
                        key: "children",
                      },
                      {
                        label: "Infant",
                        title: detail?.property_policies?.[0]?.infant,
                        points: detail?.property_policies?.[0]?.infant_points,
                        key: "infant",
                      },
                    ].map(({ label, title, points, key }, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <MDBox sx={{ p: 1, backgroundColor: "#e6f0ff", borderRadius: "8px" }}>
                          <MDTypography
                            variant="caption"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                          >
                            {label}
                          </MDTypography>
                          <MDTypography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ wordBreak: "break-word", fontSize: { xs: "0.95rem", sm: "1rem" } }}
                          >
                            {title?.length > 80 ? (
                              <>
                                {expandedText[`${key}-title`]
                                  ? title
                                  : `${title.slice(0, 80)}...`}
                                <Button
                                  onClick={() =>
                                    setExpandedText((prev) => ({
                                      ...prev,
                                      [`${key}-title`]: !prev[`${key}-title`],
                                    }))
                                  }
                                  size="small"
                                  sx={{ color: "#3A7BD5", p: 0, mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                                >
                                  {expandedText[`${key}-title`] ? "Show Less" : "Show More"}
                                </Button>
                              </>
                            ) : (
                              title || "-"
                            )}
                          </MDTypography>
                          <ul style={{ pl: 2, m: 0 }}>
                            {points?.map((point, idx) => (
                              <li
                                key={idx}
                                style={{
                                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                                  color: "#7b809a",
                                  fontWeight: 500,
                                  wordBreak: "break-word",
                                }}
                              >
                                {point.length > 80 ? (
                                  <>
                                    {expandedText[`${key}-point-${idx}`]
                                      ? point
                                      : `${point.slice(0, 80)}...`}
                                    <Button
                                      onClick={() =>
                                        setExpandedText((prev) => ({
                                          ...prev,
                                          [`${key}-point-${idx}`]: !prev[`${key}-point-${idx}`],
                                        }))
                                      }
                                      size="small"
                                      sx={{ color: "#3A7BD5", p: 0, mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                                    >
                                      {expandedText[`${key}-point-${idx}`] ? "Show Less" : "Show More"}
                                    </Button>
                                  </>
                                ) : (
                                  point
                                )}
                              </li>
                            ))}
                          </ul>
                        </MDBox>
                      </Grid>
                    ))}
                  </Grid>
                  <MDBox>
                    <MDTypography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
                    >
                      Others
                    </MDTypography>
                    <MDTypography
                      variant="body2"
                      color="textSecondary"
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      {detail?.property_policies?.[0]?.policy_other?.map((ele, index, array) => (
                        <React.Fragment key={index}>
                          <span style={{ wordBreak: "break-word" }}>
                            {ele.length > 80 ? (
                              <>
                                {expandedText[`policy-other-${index}`]
                                  ? ele
                                  : `${ele.slice(0, 80)}...`}
                                <Button
                                  onClick={() =>
                                    setExpandedText((prev) => ({
                                      ...prev,
                                      [`policy-other-${index}`]: !prev[`policy-other-${index}`],
                                    }))
                                  }
                                  size="small"
                                  sx={{ color: "#3A7BD5", p: 0, ml: 0.5, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                                >
                                  {expandedText[`policy-other-${index}`] ? "Show Less" : "Show More"}
                                </Button>
                              </>
                            ) : (
                              ele
                            )}
                          </span>
                          {index < array.length - 1 && <span>, </span>}
                        </React.Fragment>
                      ))}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Grid>
            )}
          </Grid>
        </MDBox>

        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          <>
            <MDBox
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
              }}
            />
            <MDBox
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
                borderRadius: "12px",
                p: { xs: 2, sm: 3 },
                width: { xs: "90%", sm: "400px" },
                maxWidth: "95%",
                zIndex: 1000,
                textAlign: "center",
              }}
            >
              <MDTypography
                variant="h6"
                fontWeight="bold"
                mb={2}
                sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
              >
                Confirm Deletion
              </MDTypography>
              <MDTypography
                variant="body1"
                mb={2}
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                Are you sure you want to delete this plan?
              </MDTypography>
              <MDBox display="flex" justifyContent="center" gap={1}>
                <MDButton
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  size="small"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, px: { xs: 1, sm: 2 } }}
                >
                  OK
                </MDButton>
                <MDButton
                  variant="contained"
                  color="success"
                  onClick={closeDeleteDialog}
                  size="small"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, px: { xs: 1, sm: 2 } }}
                >
                  Cancel
                </MDButton>
              </MDBox>
            </MDBox>
          </>
        )}
        {renderSuccessSB}
      </MDBox>
    </DashboardLayout>
  );
};

export default Fulldetail;