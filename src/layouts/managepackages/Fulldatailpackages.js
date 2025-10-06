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
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard4";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { NavLink } from "react-router-dom";
import { Card } from "@mui/material";
import { BASE_URL } from "BASE_URL";

const Fulldatailpackages = () => {
  const [plan, setPlan] = useState([]);
  console.log(plan);
  const [isLoading, setIsLoading] = useState(true);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
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

  const [expandedDetails, setExpandedDetails] = useState({});

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const renderMoreDetails = (text, id) => {
    if (!text) return "";
    const isExpanded = expandedDetails[id];
    const truncatedText = truncateText(text, 250);

    return (
      <MDBox
        sx={{
          width: "100%",
          maxWidth: "100%",
          wordBreak: "break-word",
          whiteSpace: "pre-line",
          overflow: "hidden",
          position: "relative",
          lineHeight: "1.5",
          padding: "4px 0"
        }}
      >
        <MDTypography
          variant="body2"
          component="div"
          sx={{
            fontSize: "0.875rem",
            color: "text.secondary",
            overflow: "hidden"
          }}
        >
          {isExpanded ? text : truncatedText}
          {text.length > 250 && (
            <MDButton
              variant="text"
              color="info"
              onClick={() =>
                setExpandedDetails((prev) => ({
                  ...prev,
                  [id]: !prev[id],
                }))
              }
              sx={{
                p: 0,
                ml: 1,
                minWidth: "auto",
                fontSize: "0.800rem",
                display: "inline-block",
                verticalAlign: "baseline"
              }}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </MDButton>
          )}
        </MDTypography>
      </MDBox>
    );
  };

  const renderServices = (services, id, type) => {
    if (!services?.length) return "";
    const servicesArray = services.map(ele => ele[`${type}_services_value`]);
    const isExpanded = expandedDetails[`${type}_${id}`];
    const displayServices = isExpanded ? servicesArray : servicesArray.slice(0, 5);
  
    return (
      <MDBox 
        sx={{
          width: "100%",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap"
        }}
      >
        {displayServices.map((service, index) => (
          <MDBox key={index}>
            <MDTypography
              variant="body2"
              component="div"
              sx={{ 
                display: "flex",
                alignItems: "flex-start",
                fontSize: "0.875rem",
                mb: 0.5
              }}
            >
              <span style={{ marginRight: '4px' }}>•</span>
              <span>
                {expandedDetails[`${type}_${id}_${index}`] 
                  ? service 
                  : truncateText(service, 250)}
                {service.length > 250 && (
                  <MDButton
                    variant="text"
                    color="info"
                    onClick={() => setExpandedDetails(prev => ({
                      ...prev,
                      [`${type}_${id}_${index}`]: !prev[`${type}_${id}_${index}`]
                    }))}
                    sx={{
                      ml: 1,
                      minWidth: "auto",
                      fontSize: "0.800rem",
                      display: "inline"
                    }}
                  >
                    {expandedDetails[`${type}_${id}_${index}`] ? "Read Less" : "Read More"}
                  </MDButton>
                )}
              </span>
            </MDTypography>
          </MDBox>
        ))}
        
        {servicesArray.length > 5 && (
          <MDButton
            variant="text"
            color="info"
            onClick={() => setExpandedDetails(prev => ({
              ...prev,
              [`${type}_${id}`]: !prev[`${type}_${id}`]
            }))}
            sx={{
              p: 0,
              mt: 1,
              minWidth: "auto",
              fontSize: "0.800rem",
            }}
          >
            {isExpanded ? "Show Less" : `Show ${servicesArray.length - 5} more...`}
          </MDButton>
        )}
      </MDBox>
    );
  };

  const { id } = useParams();
  const storedId = localStorage.getItem("packageId") || id;
  localStorage.setItem("packageId", id);

  const fetchCategoryList = async () => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(
      `${BASE_URL}package/getPackageData?package_id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const data = await res.json();
    setPlan(data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategoryList();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (selectedPlan) {
        const token = localStorage.getItem("sytAdmin");
        const responseDelete = await axios.delete(
          `${BASE_URL}package/${selectedPlan._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (responseDelete.data.status === "OK") {
          openSuccessSB();
          // Add delay to show success message before navigation
          setTimeout(() => {
            navigate("/manage-packages");
          }, 1500);
        }
        setPlan((prevMembershipFeatureList) =>
          prevMembershipFeatureList.filter(
            (plan) => plan._id !== selectedPlan._id
          )
        );
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error("Error deleting package:", error);
    }
    setDeleteDialogOpen(false);
  };
  const navigate = useNavigate();
  const openDeleteDialog = (plan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
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
            Package Details
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
            <Card style={{ width: "100%", marginTop: "2rem" }}>
              <Grid container spacing={2}>
                {plan &&
                  plan?.map((plan, index) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        key={plan._id}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                          margin: "auto",
                        }}
                      >
                        {/* <div style={{position: "relative"}}> */}
                        <MDBox
                          component="img"
                          src="https://w7.pngwing.com/pngs/895/550/png-transparent-black-and-white-logo-computer-icons-symbol-free-of-close-button-icon-miscellaneous-trademark-sign-thumbnail.png"
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            position: "absolute",
                            top: "5rem",
                            zIndex: "100",
                            right: "2.5rem",
                            cursor: "pointer",
                          }}
                          onClick={() => openDeleteDialog(plan)}
                        />

                        <ProfileInfoCard
                          key={plan?._id}
                          id={plan?._id}
                          title={plan?.name}
                          info={{
                            destination:
                              plan?.destination?.[0]?.destination_name || "",
                            destination_category:
                              plan?.destination_category_id
                                ?.map((cat) => cat.category_name)
                                .join(", ") || "",
                            price_per_person:
                              plan?.vender_price_per_person || "",
                            total_days: plan?.total_days || "",
                            total_nights: plan?.total_nights || "",
                            package_type: plan?.package_type || "",
                            meal_required: plan?.meal_required.join(", ") || "",
                            meal_type: plan?.meal_type || "",
                            travel_by: plan?.travel_by || "",
                            hotel_type: plan?.hotel_type.join(", ") || "",
                            room_sharing: plan?.room_sharing || "",
                            sightseeing: plan.sightseeing || "",
                            more_details: renderMoreDetails(
                              plan?.more_details.replace(
                                /<\/?[^>]+(>|$)/g,
                                ""
                              ),
                              plan?._id
                            ),
                            status: (
                              <span
                                style={{
                                  color: plan.status ? "green" : "red", // Green for Active, Red for InActive
                                  fontWeight: "bold",
                                }}
                              >
                                {plan.status ? "Active" : "InActive"}
                              </span>
                            ) || "",
                            include_service: renderServices(plan?.include_service, plan?._id, "include"),
                            exclude_service: renderServices(plan?.exclude_service, plan?._id, "exclude"),
                           
                          }}
                          social={[]}
                          marginArray={
                            plan?.profitMargin?.[0]?.month_and_margin_user
                          }
                          monthPriceArray={plan?.price_and_date}
                          itineraries={plan?.Itinaries}
                          hotelItinerary={plan?.hotel_itienrary}
                          action={{ route: "", tooltip: "Edit Profile" }}
                          shadow={false}
                        />
                        {/* </div> */}
                      </Grid>
                    );
                  })}
              </Grid>
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
              Are you sure you want to delete this Package?
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

export default Fulldatailpackages;
