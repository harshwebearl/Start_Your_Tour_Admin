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
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}subscribe`, {
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

  const columns = [
    { Header: "Name", accessor: "name", width: "25%", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Created At", accessor: "created_at", align: "center" },
  ];

  const userListArray = Array.isArray(userList) ? userList : [];
  const rows = userListArray.map((user) => ({
    name: user.Userid || "",
    created_at: user.createdAt.slice(0, 10) || "",
    email: user.Emailid || "",
  }));

  return { columns, rows, isLoading };
};

export default authorsTableData;

