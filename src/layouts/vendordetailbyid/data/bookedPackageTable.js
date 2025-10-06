import React, { useEffect, useState } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { BASE_URL } from "BASE_URL";

const bookedPackageTableData = () => {
  const User = ({ image, name, email }) => (
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

  const [userList, setUserList] = useState([]);
  const [isLoading1, setIsLoading1] = useState(false);

  const { _id } = useParams();

  User.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  };

  const fetchUserData = async () => {
    try {
      setIsLoading1(true)
      const token = localStorage.getItem("sytAdmin")
      const response = await fetch(`${BASE_URL}bookpackage/admin_booked_package_list?user_id=${_id}`, {
        headers: {
          Authorization: token,
        },
      })
      const data = await response.json()

      console.log(data.data)
      if (response.ok) {
        setIsLoading1(false)
        setUserList(data?.data)
      }
    } catch (error) { }
  }
  useEffect(() => {
    fetchUserData()
  }, [])

  const columns = [
    { Header: "Destination", accessor: "destination", width: "14%", align: "left" },
    { Header: "departure", accessor: "departure", align: "left" },
    { Header: "agency name", accessor: "agency", align: "left" },
    { Header: "Total Person", accessor: "person", align: "left" },
    { Header: "Booking Date", accessor: "travel", align: "left" },
    { Header: "status", accessor: "status", align: "left" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const userListArray = Array.isArray(userList) ? userList : [];

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // Formats as "dd/mm/yyyy"
  };

  const rows = [...userListArray].reverse().map((user) => ({
    destination: user?.destination,
    departure: user?.departure,
    agency: user?.agencyname,
    person: user?.total_person,
    status: user?.status,
    travel: formatDate(user?.bookdate),
    action: (
      <NavLink to={`/booked-package-detail/${user._id}`}>
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

  return { columns, rows, isLoading1 };
};

export default bookedPackageTableData;
