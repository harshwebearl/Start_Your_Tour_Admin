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

const bookingsList = () => {
  const [bookingsData, setbookingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}bookpackage/admin_booked_package_list_with_token`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        
        setbookingsData(response.data.data);
        setIsLoading(false);
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
  // };
  const columns = [
    { Header: "package_details", accessor: "package_details", width: "25%", align: "left" },
    { Header: "user_name", accessor: "user_name", width: "25%", align: "left" },
    { Header: "user_contact_no", accessor: "user_contact_no", width: "25%", align: "left" },
    { Header: "amount", accessor: "amount", width: "25%", align: "left" },
    { Header: "destination", accessor: "destination", align: "left" },
    { Header: "departure", accessor: "departure", align: "left" },
    { Header: "total_persons", accessor: "total_persons", align: "left" },
    { Header: "approx_start_date", accessor: "approx_start_date", align: "left" },
    { Header: "approx_end_date_date", accessor: "approx_end_date", align: "left" },
    { Header: "action", accessor: "action", align: "center" },
  ];
  const bookingsListArray = Array.isArray(bookingsData) ? bookingsData : [];
  const rows = [...bookingsListArray]?.reverse()?.map((bookings) => ({

    package_details: bookings.title ? bookings.title: "",
    user_name: bookings.user_name ? bookings.user_name: "",
    user_contact_no: bookings.contact_number ? bookings.contact_number: "",
    destination: bookings?.destination,
    departure: bookings.departure ? bookings.departure: "",
    total_persons: Number(bookings.total_person),
    approx_start_date: formatDate(bookings?.approx_start_date),
    approx_end_date: formatDate(bookings?.approx_end_date),
    amount: bookings?.total_amount,

    action: (
      <NavLink to={`/booked-package-detail/${bookings._id}`}>
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
