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

const authorsTableData = () => {
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
  const [isLoading, setIsLoading] = useState(false);

  const { _id } = useParams();

  User.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("sytAdmin")
      const response = await fetch(`${BASE_URL}user/userdetail?_id=${_id}`, {
        headers: {
          Authorization: token,
        },
      })
      const data = await response.json()

      if (response.ok) {
        setIsLoading(false)
        setUserList(data?.data?.[0]?.custom_requirement)
      }
    } catch (error) { }
  }
  useEffect(() => {
    fetchUserData()
  }, [])

  const columns = [
    { Header: "Destination", accessor: "destination", width: "14%", align: "left" },
    { Header: "departure", accessor: "departure", align: "left" },
    { Header: "Total Person", accessor: "person", align: "left" },
    { Header: "Travel Between", accessor: "travel", align: "left", width: "24%" },
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
    person: user?.total_adult + user?.total_child + user?.Infant,
    travel: formatDate(user?.start_date) + " - " + formatDate(user?.end_date),
    action: (
      <NavLink to={`/custom-reuirment-details/${_id}/${user._id}`}>
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

export default authorsTableData;
