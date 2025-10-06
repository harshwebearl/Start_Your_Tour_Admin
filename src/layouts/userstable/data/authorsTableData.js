import React, { useEffect, useState } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
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
  const [isLoading, setIsLoading] = useState(true);

  User.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  };
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}user/alluserlist`, {
          headers: {
            Authorization: token,
          },
        });

        setUserList(response.data.data);
        // console.log(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserList();
  }, []);
  console.log(userList[0]);
  const columns = [
    { Header: "User", accessor: "user", width: "25%", align: "left" },
    { Header: "gender", accessor: "gender", align: "left" },
    { Header: "mobile number", accessor: "phone", align: "center" },
    { Header: "state", accessor: "state", align: "center" },
    { Header: "city", accessor: "city", align: "center" },
    { Header: "registration date", accessor: "registration", align: "center" },
    { Header: "role", accessor: "role", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const userListArray = Array.isArray(userList) ? userList : [];
  console.log(userListArray);
  const rows = [...userListArray].reverse().map((user) => ({
    user: (
      <User
        image={
          user.customer_details[0] && user.customer_details[0].photo
            ? user.customer_details[0].photo
            : "https://www.shutterstock.com/image-vector/man-icon-vector-260nw-1040084344.jpg"
        }
        name={user.customer_details[0] ? user.customer_details[0].name : ""}
        email={user.customer_details[0] ? user.customer_details[0].email_address : ""}
      />
    ),
    phone: user.phone,
    state: user.customer_details[0] ? user.customer_details[0].state : "",
    gender: user.customer_details[0] ? user.customer_details[0].gender : "",
    city: user.customer_details[0] ? user.customer_details[0].city : "",
    registration: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB") : "",
    role: user.role,
    action: (
      <NavLink to={`/user-detail/${user._id}`}>
        <MDTypography
          component="a"
          // href={`/user-detail/${user._id}`}
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
