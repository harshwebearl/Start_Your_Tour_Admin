import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard2";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Swiper, SwiperSlide } from 'swiper/react';
import Carousel from 'react-bootstrap/Carousel';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { NavLink } from "react-router-dom";
import { Card } from "@mui/material";
import { BASE_URL } from "BASE_URL";

const Bloggerfullinfo = () => {
    const [plan, setPlan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [successSB, setSuccessSB] = useState(false);
    const [city, setCity] = useState([]);
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

    // full information of blogger get api 

    const { _id } = useParams();

    const CityName = async () => {
        const token = localStorage.getItem("sytAdmin");
        const res = await fetch(`${BASE_URL}blogger/blogecontentbybloggerid?_id=${_id}`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            }
        })
        const data = await res.json();
        setCity(data.data);
    }


    // get api end 



    useEffect(() => {
        CityName();
        const fetchCategoryList = async () => {
            try {
                // const token = localStorage.getItem("sytAdmin");
                const response = await axios.get(`${BASE_URL}package`);

                setPlan(response.data.data);
                setIsLoading(false);
            } catch (error) {
            }
        };
        fetchCategoryList();
    }, []);
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
                }
                setPlan((prevMembershipFeatureList) =>
                    prevMembershipFeatureList.filter(
                        (plan) =>
                            plan._id !== selectedPlan._id
                    )
                );
                setSelectedPlan(null);
            }
        } catch (error) {
        }
        // Close the delete dialog
        setDeleteDialogOpen(false);
    };
    const navigate = useNavigate();
    const openDeleteDialog = (plan) => {
        setSelectedPlan(plan);
        setDeleteDialogOpen(true);
    };
    const shouldShowAddButton = () => {
        const screenWidth =
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        return screenWidth < 650;
    };
    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };
    const handleEdit = () => {
        navigate("/edit-membership-feature/:_id");
    };
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3} style={{ opacity: deleteDialogOpen ? 0.3 : 1 }}>
                <MDBox
                    textAlign="center"
                    mb={4}
                    style={{
                        position: "relative",
                    }}
                >
                    <MDTypography variant="h4" fontWeight="bold">
                        Manage Blogger Full Detail
                    </MDTypography>
                    <Link to={`/Addblog/${_id}`} style={{ textDecoration: "none" }}>
                        <MDButton
                            variant="gradient"
                            color="dark"
                            style={{ position: "absolute", top: "-15%", right: "1%" }}
                        >
                            <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                            &nbsp;{shouldShowAddButton() ? "" : "add new blog"}
                        </MDButton>
                    </Link>
                </MDBox>

                <div style={{ backgroundColor: "white" }}>
                    <div className="row">
                        {city && city.map((ele, index) => {
                            return (
                                <div className="col-md-4 col-sm-6 col-12 py-4">
                                    <div className="mx-4 px-4 pb-3" style={{ backgroundColor: "aliceblue" }}>
                                        <div className="d-flex justify-content-between px-2">
                                            <div className="row">
                                                <div className="col-12 text-end pe-0" style={{ fontSize: "24px" }}>
                                                    <NavLink to={`/EditBlog/${ele._id}/${_id}`} style={{ color: "black" }}>
                                                        <EditNoteIcon />
                                                    </NavLink>
                                                </div>
                                                <div className="col-12">
                                                    <p className="mb-1" style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>{ele.blog_title}</p>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-12">
                                                    <div className="text-center">
                                                        <img src={ele.blog_title_photo} alt="" className="" style={{height: "250px" , width: "100%"}} />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-12 d-flex ">
                                                    <div className="">
                                                        <ul className="list-unstyled ">
                                                            <li><p className="mb-1" style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>Blog category : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.blog_category}</span></p></li>
                                                            <li><p className="mb-1" style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>content : <div style={{ color: "#344767", fontWeight: "500" }} dangerouslySetInnerHTML={{ __html: ele.blog_content }}></div></p></li>
                                                            <li><p className="mb-1" style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>points : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.blog_title_points}</span></p></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </MDBox>


            {/* Delete Confirmation Dialog */}
            {
                deleteDialogOpen && (
                    <>
                        Overlay
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
                                    onClick={handleDelete}
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
                )
            }
        </DashboardLayout >
    );
};

export default Bloggerfullinfo;
