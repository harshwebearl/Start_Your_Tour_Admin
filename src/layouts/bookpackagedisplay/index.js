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
  const [isLoading, setIsLoading] = useState(true);
  const [vendorData, setVendorData] = useState(null);
  const {_id, agency_id, id} = useParams();
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
  const book_package_data = bidElement && bidElement.book_package.find((item) => item._id === id);
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
            Display Book Packages
          </MDTypography>
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
              <Grid container spacing={2} style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2rem",margimLeft: "2rem" , marginBottom: "2rem"}}>
              <ProfileInfoCard
                        key={bidElement._id}
                        id={bidElement._id}
                        title={`${bidElement.departure} to ${bidElement.destination}`}
                        info={{
                          user_name: book_package_data.user_name || "",
                          status: book_package_data.status || "",
                          total_adult: book_package_data.total_adult || "",
                          total_child: book_package_data.total_child || "",
                          total_infant: book_package_data.total_infant || "",
                          approx_start_date: book_package_data.approx_start_date || "",
                          departure: book_package_data.departure || "",
                          contact_number: book_package_data.contact_number || "",
                          email_id: book_package_data.email_id || "",
                          totaldays: book_package_data.totaldays || "",
                          totalnight: book_package_data.totalnight || "",
                          siteseeing: book_package_data.siteseeing || "",
                          transport_mode: book_package_data.transport_mode || "",
                          transport_include_exclude: book_package_data.transport_include_exclude || "",
                          hoteltype: book_package_data.hoteltype || "",
                          priceperperson: book_package_data.priceperperson || "",
                          total_person: book_package_data.total_person || "",
                          agency_contect_no: book_package_data.agency_contect_no || "",
                          category: book_package_data.category || "",
                          booked_include: book_package_data.booked_include.join(', ') || "",
                          booked_exclude: book_package_data.booked_exclude.join(', ') || "",
                          meal: book_package_data.meal.join(', ') || "",
                          meal_type: book_package_data.meal_type.join(', ') || "",
                          othere_requirement: book_package_data.othere_requirement || "",
                          personal_care: book_package_data.personal_care ? "Yes" : "No" || "",
                          include_service: bidElement.include_services.join(' , ') || "",
                          exclude_service: bidElement.exclude_services.join(' , ') || "",
                          sightseeing: bidElement.sightseeing || "",
                        }}
                        social={[]}
                        action={{ route: "", tooltip: "Edit Profile" }}
                        shadow={false}
                        // features={features} // Pass the extracted features as props
                      />
              </Grid>
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
