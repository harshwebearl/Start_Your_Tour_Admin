import React from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelopeOpen,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BASE_URL } from "BASE_URL";
import "./hotelbooking.css";
import Carousel from "react-bootstrap/Carousel";
import Grid from "@mui/material/Grid";
import {
  IconButton,
  Modal,
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MDSnackbar from "components/MDSnackbar";

import { Autocomplete, TextField } from "@mui/material";

// import './css/HotelBooking.css'

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // If the current month is before the birth month or it's the birth month but the current day is before the birth day, subtract 1 from the age
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return Number(age);
};

const rightDate = (dateString) => {
  // Check if dateString is a valid string and matches the yyyy-mm-dd format
  if (
    typeof dateString === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }
  // If not valid, return the original value
  return dateString;
};

const HotelBookingDetail = () => {
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [expandedAddress, setExpandedAddress] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull Changed"
      content="Status Successfully Changed."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

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

  const navigate = useNavigate();
  const { id } = useParams();

  const [bookingData, setBookingData] = useState([]);

  const getBookedHotel = async () => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(
      `${BASE_URL}hotel_booking_syt/hotel_book_details/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const data = await res.json();
    setBookingData(data.data[0]);
    setbookingstatus(data.data[0].status);
  };

  useEffect(() => {
    getBookedHotel();
  }, []);

  const [bookingstatus, setbookingstatus] = useState();

  const handleUpdateStatus = async () => {
    const token = localStorage.getItem("sytAdmin");
    if (
      bookingstatus === "pending" ||
      bookingstatus === "booked" ||
      bookingstatus === ""
    ) {
      openErrorSB();
      return;
    }

    const res = await fetch(`${BASE_URL}hotel_booking_syt/updateStatus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        status: bookingstatus,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update status `);
    } else {
      handleClose();
      openSuccessSB();
      getBookedHotel();
      return res.json();
    }
  };

  const labelStyle = { fontSize: "16px", color: "#7b809a", fontWeight: "700" };
  const valueStyle = { color: "#344767", fontWeight: "500" };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOptionChange = (event) => setbookingstatus(event.target.value);

  const handleSubmit = () => {
    // Handle form submission here
    handleClose(); // Close modal after submit
  };
  const options = [
    { label: "Select", value: "" },
    { label: "Approve", value: "approve" },
    { label: "Reject", value: "reject" },
  ];
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            sm={6}
            // key={ele._id}
            style={{
              display: "flex",
              justifyContent: "center",
              // alignItems: "center",
              // marginBottom: "1rem",
              // marginTop: "1rem",
            }}
          >
            <div
              className="hotel-card"
              style={{
                width: "100%",
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <h5>1.User Details</h5>
                  <ul className="list-unstyled">
                    <li>
                      <p className="mb-1" style={labelStyle}>
                        User Name:{" "}
                        <span style={valueStyle}>{bookingData?.user_name}</span>
                      </p>
                    </li>
                    <li>
                      <p className="mb-1" style={labelStyle}>
                        Contact Number:{" "}
                        <span style={valueStyle}>
                          {bookingData?.contact_no}
                        </span>
                      </p>
                    </li>
                    <li>
                     <p className="mb-1" style={labelStyle}>
  Address:{" "}
  <span style={valueStyle}>
    {bookingData?.hotel_details?.[0]?.hotel_address ? (
      bookingData.hotel_details[0].hotel_address.length > 250 ? (
        <>
          {expandedAddress 
            ? bookingData.hotel_details[0].hotel_address
            : `${bookingData.hotel_details[0].hotel_address.substring(0, 250)}...`
          }
          <button
            onClick={() => setExpandedAddress(!expandedAddress)}
            style={{
              background: "none",
              border: "none",
              color: "#3A7BD5",
              cursor: "pointer",
              marginLeft: "5px",
              fontSize: "14px",
              fontWeight: "500",
              padding: "0",
            }}
          >
            {expandedAddress ? "Read Less" : "Read More"}
          </button>
        </>
      ) : (
        bookingData.hotel_details[0].hotel_address
      )
    ) : (
      "Address not available"
    )}
  </span>
</p>
                    </li>
                  </ul>
                  <hr />
                  <h5>2.Travellers</h5>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1fr",
                    }}
                  >
                    <p
                      className="mb-1"
                      style={{
                        color: "#7b809a",
                        fontWeight: "700",
                        opacity: "0.7",
                        fontSize: "12px",
                      }}
                    >
                      NAME
                    </p>
                    <p
                      className="mb-1"
                      style={{
                        color: "#7b809a",
                        fontWeight: "700",
                        opacity: "0.7",
                        fontSize: "12px",
                      }}
                    >
                      GENDER
                    </p>
                    <p
                      className="mb-1"
                      style={{
                        color: "#7b809a",
                        fontWeight: "700",
                        opacity: "0.7",
                        fontSize: "12px",
                      }}
                    >
                      AGE
                    </p>
                    <p
                      className="mb-1"
                      style={{
                        color: "#7b809a",
                        fontWeight: "700",
                        opacity: "0.7",
                        fontSize: "12px",
                      }}
                    >
                      DOB
                    </p>
                  </div>
                  {bookingData &&
                    bookingData?.travel_details?.map((e, index) => (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1fr",
                        }}
                      >
                        <span
                          style={{
                            color: "#344767",
                            fontWeight: "600",
                            fontSize: "16px",
                          }}
                        >
                          {index + 1} {e?.first_name} {e?.last_name}
                        </span>
                        <span
                          style={{
                            color: "#344767",
                            fontWeight: "600",
                            fontSize: "16px",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {e?.gender}
                        </span>
                        <span
                          style={{
                            color: "#344767",
                            fontWeight: "600",
                            fontSize: "16px",
                          }}
                        >
                          {calculateAge(e?.dob)}(
                          {calculateAge(e?.dob) > 12 ? "Adult" : "Child"})
                        </span>
                        <span
                          style={{
                            color: "#344767",
                            fontWeight: "600",
                            fontSize: "16px",
                          }}
                        >
                          {rightDate(e?.dob?.slice(0, 10))}
                        </span>
                      </div>
                    ))}
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              className="hotel-card"
              style={{
                width: "100%",
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
            >
              {/* Edit Icon */}
              <IconButton
                onClick={handleOpen}
                style={{ position: "absolute", top: 8, right: 8 }}
              >
                <EditIcon />
              </IconButton>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <h5>Booking Details</h5>
                  <hr />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "0.7fr 1fr 1fr 1fr 1fr",
                    }}
                  >
                    <p
                      className="mb-1 text-center"
                      style={{
                        color: "#7b809a",
                        fontWeight: "700",
                        opacity: "0.7",
                        fontSize: "12px",
                      }}
                    ></p>
                    <p
                      className="mb-1 text-center"
                      style={{
                        color: "#7b809a",
                        fontWeight: "700",
                        opacity: "0.7",
                        fontSize: "12px",
                      }}
                    >
                      Price Per Person
                    </p>
                    <p
                      className="mb-1 text-center"
                      style={{
                        color: "#7b809a",
                        fontWeight: "700",
                        opacity: "0.7",
                        fontSize: "12px",
                      }}
                    >
                      Admin Margin
                    </p>
                    <p
                      className="mb-1 text-center"
                      style={{
                        color: "#7b809a",
                        fontWeight: "700",
                        opacity: "0.7",
                        fontSize: "12px",
                      }}
                    >
                      Total Person
                    </p>
                    <p
                      className="mb-1 text-center"
                      style={{
                        color: "#7b809a",
                        fontWeight: "700",
                        opacity: "0.7",
                        fontSize: "12px",
                      }}
                    >
                      Total Amount
                    </p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "0.7fr 1fr 1fr 1fr 1fr",
                    }}
                  >
                    <span
                      className=""
                      style={{
                        color: "#344767",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      Adult
                    </span>
                    <span
                      className=" text-center"
                      style={{
                        color: "#344767",
                        fontWeight: "600",
                        fontSize: "16px",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {bookingData?.price_per_person_adult}
                    </span>
                    <span
                      className=" text-center"
                      style={{
                        color: "#344767",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      {(bookingData?.price_per_person_adult *
                        Number(bookingData?.admin_margin_percentage)) /
                        100}
                      ({bookingData?.admin_margin_percentage}%)
                    </span>
                    <span
                      className=" text-center"
                      style={{
                        color: "#344767",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      {bookingData?.total_adult}
                    </span>
                    <span
                      className=" text-center"
                      style={{
                        color: "#344767",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      {bookingData?.price_per_person_adult +
                        (bookingData?.price_per_person_adult *
                          Number(bookingData?.admin_margin_percentage)) /
                          100}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "0.7fr 1fr 1fr 1fr 1fr",
                    }}
                  >
                    <span
                      className=" "
                      style={{
                        color: "#344767",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      Extra bad
                    </span>
                    <span
                      className=" text-center"
                      style={{
                        color: "#344767",
                        fontWeight: "600",
                        fontSize: "16px",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {bookingData?.price_per_person_extra_bed}
                    </span>
                    <span
                      className=" text-center"
                      style={{
                        color: "#344767",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      {(bookingData?.price_per_person_child *
                        Number(bookingData?.admin_margin_percentage)) /
                        100}
                      ({bookingData?.admin_margin_percentage}%)
                    </span>
                    <span
                      className=" text-center"
                      style={{
                        color: "#344767",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      {bookingData?.total_child}
                    </span>
                    <span
                      className=" text-center"
                      style={{
                        color: "#344767",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      {bookingData?.price_per_person_child +
                        (bookingData?.price_per_person_child *
                          Number(bookingData?.admin_margin_percentage)) /
                          100}
                    </span>
                  </div>
                  <hr />
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between">
                      <p className="mb-1" style={labelStyle}>
                        Booked Date:{" "}
                        <span style={valueStyle}>
                          {rightDate(bookingData?.createdAt?.slice(0, 10))}
                        </span>
                      </p>
                      <p className="mb-1" style={labelStyle}>
                        Status:{" "}
                        <span style={valueStyle}>{bookingData?.status}</span>
                      </p>
                    </li>
                    <li className="d-flex justify-content-between">
                      <p className="mb-1" style={labelStyle}>
                        Total Rooms:{" "}
                        <span style={valueStyle}>
                          {bookingData?.total_booked_rooms}
                        </span>
                      </p>
                    </li>
                    <li className="d-flex justify-content-between">
                      <p className="mb-1" style={labelStyle}>
                        Total Amount:{" "}
                        <span style={valueStyle}>{bookingData?.price}</span>
                      </p>
                    </li>
                    <li className="d-flex justify-content-between">
                      <p className="mb-1" style={labelStyle}>
                        Transaction Id:{" "}
                        <span style={valueStyle}>
                          {bookingData?.transaction_id}
                        </span>
                      </p>
                    </li>
                  </ul>
                </Grid>
                <Modal open={open} onClose={handleClose}>
                  <Box
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 400,
                      backgroundColor: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      boxShadow: 24,
                      outline: "none",
                    }}
                  >
                    <Typography variant="h5" component="h2" textAlign="center">
                      Edit Booking Details
                    </Typography>

                    {/* Dropdown */}
                    <Autocomplete
                      disablePortal
                      options={options}
                      getOptionLabel={(option) => option.label}
                      value={options.find((opt) => opt.value === bookingstatus) || null}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setbookingstatus(newValue.value);
                        }
                      }}
                      sx={{
                        width: "100%",
                        mt: 1, // Adds margin-top of 10px
                        "& .MuiInputBase-root": {
                          height: "45px",
                          borderRadius: "5px",
                          fontSize: "14px",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Status"
                          variant="outlined"
                        />
                      )}
                    />

                    {/* Submit Button */}
                    <div className="d-flex justify-content-center mt-3">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateStatus}
                        style={{
                          color: "#ffffff",
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </Box>
                </Modal>
              </Grid>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            // key={ele._id}
            style={{
              display: "flex",
              justifyContent: "center",
              // alignItems: "center",
              // marginBottom: "1rem",
              // marginTop: "1rem",
            }}
          >
            <div
              className="hotel-card"
              style={{
                width: "100%",
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Carousel>
                    {bookingData?.hotel_details?.[0]?.hotel_photo?.map(
                      (e, i) => {
                        return (
                          <Carousel.Item>
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
                      }
                    )}
                  </Carousel>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <ul className="list-unstyled">
                    <li>
                      <p className="mb-1" style={labelStyle}>
                        Hotel Name:{" "}
                        <span style={valueStyle}>
                          {bookingData?.hotel_details?.[0]?.hotel_name}
                        </span>
                      </p>
                    </li>
                    <li>
                    <p className="mb-1" style={labelStyle}>
  Address:{" "}
  <span style={valueStyle}>
    {bookingData?.hotel_details?.[0]?.hotel_address ? (
      bookingData.hotel_details[0].hotel_address.length > 250 ? (
        <>
          {expandedAddress 
            ? bookingData.hotel_details[0].hotel_address
            : `${bookingData.hotel_details[0].hotel_address.substring(0, 250)}...`
          }
          <button
            onClick={() => setExpandedAddress(!expandedAddress)}
            style={{
              background: "none",
              border: "none",
              color: "#3A7BD5",
              cursor: "pointer",
              marginLeft: "5px",
              fontSize: "14px",
              fontWeight: "500",
              padding: "0",
            }}
          >
            {expandedAddress ? "Read Less" : "Read More"}
          </button>
        </>
      ) : (
        bookingData.hotel_details[0].hotel_address
      )
    ) : (
      "Address not available"
    )}
  </span>
</p>
                    </li>
                    <li>
                      <p className="mb-1" style={labelStyle}>
                        Location:{" "}
                        <span style={valueStyle}>
                          {bookingData?.hotel_details?.[0]?.city},{" "}
                          {bookingData?.hotel_details?.[0]?.state}
                        </span>
                      </p>
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            // key={ele._id}
            style={{
              display: "flex",
              justifyContent: "center",
              // alignItems: "center",
              // marginBottom: "1rem",
              // marginTop: "1rem",
            }}
          >
            <div
              className="hotel-card"
              style={{
                width: "100%",
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Carousel>
                    {bookingData?.room_details?.[0]?.photos?.map((e, i) => {
                      return (
                        <Carousel.Item>
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
                        <span style={valueStyle}>
                          {bookingData?.room_details?.[0]?.room_title}
                        </span>
                      </p>
                    </li>
                    <li>
                      <p className="mb-1" style={labelStyle}>
                        Highlights:{" "}
                      </p>
                      <ul>
                        {bookingData?.room_details?.[0]?.room_highlights &&
                          bookingData?.room_details?.[0]?.room_highlights?.map(
                            (e) => (
                              <li>
                                <p className="mb-1" style={labelStyle}>
                                  <span style={valueStyle}>{e}</span>
                                </p>
                              </li>
                            )
                          )}
                      </ul>
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        {/* <div className="costum_container">
                    <div style={{ backgroundColor: "#F0F8FF", minHeight: "100vh" , borderRadius:"20px" }}>

                        <section className="booked_packega_margin p-4">
                            {bookingData.length !== 0 && <div>
                                <div className="booked-details">
                                    <div className="booked-hotel-details-container">
                                        <div className='booked-details-title'>Hotel Details</div>
                                        {
                                            bookingData.hotel_details ? (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                    <div className="booked-details-name"><span className="cust-details-headings">Hotel Name:</span>{bookingData.hotel_details[0].hotel_name}</div>
                                                    <div className="booked-details-address"><span className="cust-details-headings">Address: </span>{bookingData.hotel_details[0].hotel_address}</div>
                                                </div>
                                            ) : (
                                                <div>N/A</div>
                                            )
                                        }
                                    </div>
                                    <div className="booked-user-details-container">
                                        <div className='booked-details-title'>Costumer Details</div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                            <div><span className="cust-details-headings">Customer Name:</span>{bookingData.users ? bookingData.users[0].customer_details.name : "N/A"}</div>
                                            <div><span className="cust-details-headings">Email:</span>{bookingData.users ? bookingData.users[0].customer_details.email_address : "N/A"}</div>
                                            <div><span className="cust-details-headings">Mobile No.:</span>{bookingData.users ? bookingData.users[0].phone : "N/A"}</div>
                                            <div><span className="cust-details-headings">Address:</span>{bookingData.users ? bookingData.users[0].customer_details.city : "N/A"} {bookingData.users ? bookingData.users[0].customer_details.state : "N/A"}</div>
                                        </div>
                                    </div>
                                    <div className="booked-status-container">
                                        <div className='booked-details-title'>Booked Status</div>
                                        <div className='booked-status'>{bookingData.status === 'pending' ? "Pending" : (bookingData.status)}</div>
                                        <div style={{ paddingTop: "10px", borderTop: "1px solid #09646D" }}>
                                            <div className="update-status-title">Update Status:</div>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <select value={bookingstatus} onChange={handleStatusChange} className="update-status-select">
                                                    <option value="pending">Pending</option>
                                                    <option value="approve">Approve</option>
                                                    <option value="reject">Reject</option>
                                                </select>
                                                <button onClick={handleUpdateStatus} className="update-status-button">Update</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <div className='booked-room-details'>Room Details</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div><span className="cust-details-headings">Room Title:</span>{bookingData.room_details[0].room_title}</div>
                                        <div className="cust-details-headings">Images</div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>{bookingData.room_details[0].photos.map(mp => (
                                            <img src={mp} alt="img" style={{ height: "200px", width: "200px", borderRadius: "10px" }}></img>
                                        ))}</div>
                                        <div><span className="cust-details-headings">Price:</span>{bookingData !== 0 ? bookingData.room_details[0].price : ""}</div>
                                    </div>
                                </div>
                                <div className="booked-rooms-container">

                                </div>
                            </div>}
                        </section>
                    </div>
                </div> */}
        {renderSuccessSB}
        {renderErrorSB}
        <Footer />
      </DashboardLayout>
    </>
  );
};

export default HotelBookingDetail;
