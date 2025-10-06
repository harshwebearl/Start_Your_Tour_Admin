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
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { NavLink } from "react-router-dom";
import { Card } from "@mui/material";
import { BASE_URL } from "BASE_URL";

const ManageCategory = () => {

  const [details, setDetails] = useState("");


  const Requirement = async () => {
    const res = await fetch(
      `${BASE_URL}bidpackage/biddetails?_id=${_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    setDetails(data.data[0]);
  };

  useEffect(() => {
    Requirement();
  }, []);


  const [isLoading, setIsLoading] = useState(false);
  const [vendorData, setVendorData] = useState(null);
  const { _id, agency_id } = useParams();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMembershipFeature, setSelectedMembershipFeature] = useState(null);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
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
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await fetch(
        `${BASE_URL}agency/agencydetails?_id=${agency_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVendorData(data.data);
        setIsLoading(false);
      } else {
        throw new Error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  const navigate = useNavigate();
  const openDeleteDialog = (membershipFeature) => {
    setSelectedMembershipFeature(membershipFeature);
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
  const bidElement = vendorData && vendorData[0]?.agencydetails[0]?.bid.find((item) => item._id === _id);
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
            Display Bid
          </MDTypography>
          <div style={{ position: "absolute", right: "4px", top: "0", bottom: "0" }}>
            <button style={{
              border: "1px solid #0d6efd",
              color: "#0d6efd",
              fontSize: "12px",
              borderRadius: "5px",
              padding: "4px 6px",
            }}>STATUS : Active</button>
          </div>
        </MDBox>
        <Grid container spacing={3}>
          {isLoading ? (
            <Grid item xs={12}>
              <Audio
                height="80"
                width="80"
                radius="9"
                color="green"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            </Grid>
          ) : (
            <Card style={{ width: "100%", marginTop: "2rem" }}>
              <Grid container spacing={2} style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: "2rem", marginBottom: "2rem" }}>
                {/* <ProfileInfoCard
                        key={bidElement._id}
                        id={bidElement._id}
                        title={`${bidElement.departure} to ${bidElement.destination}`}
                        info={{
                          total_days: bidElement.total_days || "",
                          total_nights: bidElement.total_nights || "",
                          price_per_person: bidElement.price_per_person || "",
                          meal_required: bidElement.meal_required.join(', ') || "",
                          meal_type: bidElement.meal_types.join(', ') || "",
                          travel_by: bidElement.travel_by || "",
                          hotel_type: bidElement.hotel_types.join(', ') || "",
                          more_details: bidElement.additional_requirement || "",
                          status: bidElement.status ? "Yes" : "No" || "",
                          include_service: bidElement.include_services.join(' , ') || "",
                          exclude_service: bidElement.exclude_services.join(' , ') || "",
                          sightseeing: bidElement.sightseeing || "",
                        }}
                        social={[]}
                        action={{ route: "", tooltip: "Edit Profile" }}
                        shadow={false} */}
                {/* // features={features} // Pass the extracted features as props
                      /> */}
                <div>
                  <div className="mb-3"><h5>OVERVIEW</h5></div>
                  <div>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Total days : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{details.total_days}</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Total nights : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{details.total_days}</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Price per person : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{details.price_per_person}</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Meal required : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{details.meal_required}</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Meal type : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{details.meal_types}</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Travel by : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{details.travel_by}</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Hotel type : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{details.hotel_types}</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>More details : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{details.total_days}</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>status : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{details.total_days}</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Include services :
                      {details.include_services && details.include_services.map((e) => {
                        return (
                          <>
                            <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{e.include_services_value}</span><br />
                          </>
                        )
                      })}
                    </h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Exclude services :
                      {details.exclude_services && details.exclude_services.map((e) => {
                        return (
                          <>
                            <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{e.exclude_services_value}</span><br />
                          </>
                        )
                      })}
                    </h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>sightseeing : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>{details.sightseeing}</span></h6>
                  </div>
                </div>
                <div>
                  <div className="mb-3"><h5>ITENERARY</h5></div>
                  <div>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Total days : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Total nights : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Price per person : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Meal required : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Meal type : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Travel by : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Hotel type : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>More details : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>status : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Include services : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Exclude services : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>sightseeing : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                  </div>
                </div>
                {/* <div>
                  <div className="mb-3"><h5>OVERVIEW</h5></div>
                  <div>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Total days : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Total nights : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Price per person : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Meal required : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Meal type : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Travel by : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Hotel type : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>More details : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>status : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Include services : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>Exclude services : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                    <h6 className="mb-3" style={{ color: "#344767", fontWeight: "700" }}>sightseeing : <span className="ms-2" style={{ color: "#7b809a", fontWeight: "400" }}>kjfk</span></h6>
                  </div>
                </div> */}
              </Grid>
              <MDBox pt={2} px={2} lineHeight={1.25} style={{ margin: "auto" }}>
                {/* <MDTypography variant="h6" fontWeight="medium">
                  Book Packages
                </MDTypography> */}
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={3}>
                  {/* {bidElement.book_package.length > 0 && bidElement.book_package.map((bid, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <NavLink to={`/bid/${bidElement._id}/${bidElement.agency_id}/${bid._id}`}>
                        <MDBox
                          component="li"
                          display="flex"
                          alignItems="center"
                          py={1}
                          mb={1}
                          style={{
                            backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            transition: "background-color 0.3s ease",
                            position: "relative",
                          }}
                        >

                          <MDBox mr={3} ml={3} py={1}>
                            <MDAvatar
                              src={bid.photo || "https://www.shutterstock.com/image-vector/grunge-green-category-word-round-260nw-1794170542.jpg"}
                              alt="something here"
                              shadow="md"
                            />
                          </MDBox>

                          <MDBox
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            justifyContent="center"
                          >
                            <MDTypography variant="button" fontWeight="medium">
                              {bid.user_name}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </NavLink>
                    </Grid>
                  ))} */}
                  {/* {bidElement.book_package.length == 0 &&
                    <h6 style={{ margin: "auto", marginTop: "1rem", color: "red" }}>There is no Booked Packages</h6>
                  } */}
                </Grid>
              </MDBox>
            </Card>
          )}
        </Grid>
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
              Are you sure you want to delete this category?
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
      )}
    </DashboardLayout>
  );
};

export default ManageCategory;
