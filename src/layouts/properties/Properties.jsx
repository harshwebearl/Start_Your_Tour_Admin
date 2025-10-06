import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate, NavLink } from "react-router-dom";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard2";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Swiper, SwiperSlide } from 'swiper/react';
import Carousel from 'react-bootstrap/Carousel';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { Card } from "@mui/material";
import { BASE_URL } from "BASE_URL";

const Blog = () => {
  const [plan, setPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [successSB, setSuccessSB] = useState(false);
  const [city, setCity] = useState([]);
  const [temp, setTemp] = useState();
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const fullNavigate = useNavigate();

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successful Deleted"
      content="Category is successfully Deleted."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const CityName = async () => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(`${BASE_URL}blogger/listblogger`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setCity(data.data);
    setTemp(data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    CityName();
    const fetchCategoryList = async () => {
      try {
        // const token = localStorage.getItem("sytAdmin");
        // const response = await axios.get(`${BASE_URL}package`);

        // dummy placeholder - remove once API ready
        // setPlan(response.data.data);
        setIsLoading(false);
      } catch (error) {}
    };
    fetchCategoryList();
  }, []);

  const navigate = useNavigate();

  const openDeleteDialog = (plan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleEdit = () => {
    navigate("/edit-membership-feature/:_id");
  };

  const shouldShowAddButton = () => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    return screenWidth < 650;
  };

  const handleFilter = (searchQuery) => {
    const filteredItems = city.filter((item) =>
      item.blog_owner_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    searchQuery === "" ? setTemp(city) : setTemp(filteredItems);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar onFilter={handleFilter} />
      <MDBox pt={6} pb={3} style={{ opacity: deleteDialogOpen ? 0.3 : 1 }}>
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
            Manage Properties
          </MDTypography>
          <Link to="/Addblogger" style={{ textDecoration: "none" }}>
            <MDButton
              variant="gradient"
              color="dark"
              sx={{
                padding: "6px 16px",
                fontSize: "14px",
                minWidth: { xs: "40px", sm: "auto" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              {!shouldShowAddButton() && "Add New Properties"}
            </MDButton>
          </Link>
        </MDBox>

        <div style={{ backgroundColor: "white" }}>
          {isLoading ? (
            <Audio
              height="80"
              width="80"
              radius="9"
              color="green"
              ariaLabel="loading"
              wrapperStyle
              wrapperClass
            />
          ) : (
            <div className="row">
              {temp &&
                temp.map((ele, index) => {
                  return (
                    <div className="col-sm-6 col-12" key={ele._id}>
                      <div className="py-4" style={{ height: "100%" }}>
                        <div
                          className="mx-4 px-4 pb-3"
                          style={{ backgroundColor: "aliceblue", height: "100%" }}
                        >
                          <div className="d-flex justify-content-between px-2">
                            <NavLink to={`/Bloggerfullinfo/${ele._id}`}>
                              <div className="row">
                                <div
                                  className="col-12 text-end pe-0"
                                  style={{ fontSize: "24px" }}
                                >
                                  <NavLink
                                    to={`/Editblogger/${ele._id}`}
                                    style={{ color: "black" }}
                                  >
                                    <EditNoteIcon />
                                  </NavLink>
                                </div>
                                <div className="col-md-6 col-sm-12 col-12 d-flex align-items-center">
                                  <img
                                    src={ele.blog_owner_photo}
                                    alt=""
                                    className="img-fluid h-100 w-100"
                                  />
                                </div>
                                <div className="col-md-6 col-sm-12 col-12 d-flex ">
                                  <div>
                                    <ul className="list-unstyled">
                                      <li>
                                        <p
                                          className="mb-1"
                                          style={{
                                            fontSize: "16px",
                                            color: "#7b809a",
                                            fontWeight: "700",
                                          }}
                                        >
                                          Name :{" "}
                                          <span
                                            style={{
                                              color: "#344767",
                                              fontWeight: "500",
                                            }}
                                          >
                                            {ele.blog_owner_name}
                                          </span>
                                        </p>
                                      </li>
                                      <li>
                                        <p
                                          className="mb-1"
                                          style={{
                                            fontSize: "16px",
                                            color: "#7b809a",
                                            fontWeight: "700",
                                          }}
                                        >
                                          Mobile number :{" "}
                                          <span
                                            style={{
                                              color: "#344767",
                                              fontWeight: "500",
                                            }}
                                          >
                                            {ele.mobile_number}
                                          </span>
                                        </p>
                                      </li>
                                      <li>
                                        <p
                                          className="mb-1"
                                          style={{
                                            fontSize: "16px",
                                            color: "#7b809a",
                                            fontWeight: "700",
                                          }}
                                        >
                                          Email :{" "}
                                          <span
                                            style={{
                                              color: "#344767",
                                              fontWeight: "500",
                                              overflowWrap: "anywhere",
                                            }}
                                          >
                                            {ele.emai_id}
                                          </span>
                                        </p>
                                      </li>
                                      <li>
                                        <p
                                          className="mb-1"
                                          style={{
                                            fontSize: "16px",
                                            color: "#7b809a",
                                            fontWeight: "700",
                                          }}
                                        >
                                          City :{" "}
                                          <span
                                            style={{
                                              color: "#344767",
                                              fontWeight: "500",
                                            }}
                                          >
                                            {ele.city}
                                          </span>
                                        </p>
                                      </li>
                                      <li>
                                        <p
                                          className="mb-1"
                                          style={{
                                            fontSize: "16px",
                                            color: "#7b809a",
                                            fontWeight: "700",
                                          }}
                                        >
                                          State :{" "}
                                          <span
                                            style={{
                                              color: "#344767",
                                              fontWeight: "500",
                                            }}
                                          >
                                            {ele.state}
                                          </span>
                                        </p>
                                      </li>
                                      <li>
                                        <p
                                          className="mb-1"
                                          style={{
                                            fontSize: "16px",
                                            color: "#7b809a",
                                            fontWeight: "700",
                                          }}
                                        >
                                          Country :{" "}
                                          <span
                                            style={{
                                              color: "#344767",
                                              fontWeight: "500",
                                            }}
                                          >
                                            {ele.country}
                                          </span>
                                        </p>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        {renderSuccessSB}
      </MDBox>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <>
          {/* Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          ></div>
          <MDBox
            backgroundColor="#fff"
            width="300px"
            padding="20px"
            borderRadius="4px"
            boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
            textAlign="center"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
              borderRadius: "1rem",
              zIndex: 1000,
            }}
          >
            <MDTypography variant="h6" fontWeight="bold" mb={3}>
              Confirm Deletion
            </MDTypography>
            <MDTypography variant="body1" mb={3}>
              Are you sure you want to delete this Plan?
            </MDTypography>
            <MDBox display="flex" justifyContent="center">
              <MDBox
                component="button"
                type="button"
                // onClick={handleDelete}
                style={{
                  marginRight: "10px",
                  backgroundColor: "red",
                  cursor: "pointer",
                }}
                padding="8px 16px"
                borderRadius="4px"
                border="none"
              >
                OK
              </MDBox>
              <MDBox
                component="button"
                type="button"
                onClick={closeDeleteDialog}
                padding="8px 16px"
                borderRadius="4px"
                border="none"
                cursor="pointer"
                style={{ backgroundColor: "green", cursor: "pointer" }}
              >
                Cancel
              </MDBox>
            </MDBox>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
};

export default Blog;