import React, { useEffect, useState } from "react";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import { NavLink } from "react-router-dom";

import MDBadge from "components/MDBadge";
import PropTypes from "prop-types";
import { BASE_URL } from "BASE_URL";

const rightDate = (dateString) => {
  // Check if dateString is a valid string and matches the yyyy-mm-dd format
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
  // If not valid, return the original value
  return dateString;
};

const bookingsList = () => {
  const [bookingsData, setbookingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}hotel_booking_syt/displayAllBookedhotel`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        setbookingsData(response.data.data);
        setIsLoading(false);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const bookings = ({ image, name, email }) => (
    // ... rest of the component code
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );
  bookings.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  };

  const User = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
  // };
  const columns = [
    { Header: "hotel details", accessor: "hotel_details", width: "25%", align: "left" },
    { Header: "status", accessor: "status", align: "left" },
    { Header: "total persons", accessor: "total_persons", align: "left" },
    { Header: "total rooms booked", accessor: "total_rooms_booked", align: "center" },
    { Header: "total amount", accessor: "amount", align: "center" },
    { Header: "check in date", accessor: "check_in_date", align: "left" },
    { Header: "check out date", accessor: "check_out_date", align: "left" },
    { Header: "action", accessor: "action", align: "center" },
  ];
  const bookingsListArray = Array.isArray(bookingsData) ? bookingsData : [];
  const rows = bookingsListArray.map((bookings) => ({

    // hotel_details: bookings.hotel_details[0] ? bookings.hotel_details[0].hotel_name : "",
    hotel_details: (
      <User
        image={
          bookings.hotel_details[0] && bookings.hotel_details[0].hotel_photo
            ? bookings.hotel_details[0].hotel_photo?.[0]
            : "https://www.shutterstock.com/image-vector/man-icon-vector-260nw-1040084344.jpg"
        }
        name={bookings.hotel_details[0].hotel_name}
      />
    ),
    status: bookings.status ? bookings.status : "",
    total_persons: bookings.total_adult && bookings.total_child ? bookings.total_adult + bookings.total_child : "",
    total_rooms_booked: bookings.total_booked_rooms ? bookings.total_booked_rooms : "",
    check_in_date: bookings.check_in_date ? rightDate(bookings.check_in_date.slice(0, 10)) : "",
    check_out_date: bookings.check_out_date ? rightDate(bookings.check_out_date.slice(0, 10)) : "",
    amount: bookings?.price ? bookings?.price : "",

    action: (
      <NavLink to={`/hotel-booking-detail/${bookings._id}`}>
        <MDTypography
          component="a"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          View
        </MDTypography>
      </NavLink>
    ),
  }));
  return { columns, rows, isLoading };
};

export default bookingsList;
