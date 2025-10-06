import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate } from "react-router-dom";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard2";
import EditNoteIcon from '@mui/icons-material/EditNote';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { NavLink } from "react-router-dom";
import { Card } from "@mui/material";
import { BASE_URL } from "BASE_URL";

const Places_to_visit = () => {


    const [Places , setPlaces] = useState("")

    const Call = async() => {
        const res = await fetch(`${BASE_URL}placetovisit/6229cd5813790a85a23a08dd`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        setPlaces(data.data[0]);
    };

    useEffect(() => {
        Call();
    }, []);


  const [plan, setPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [successSB, setSuccessSB] = useState(false);
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
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        // const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}package`);

        setPlan(response.data.data);
        setIsLoading(false);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryList();
  }, []);
  console.log(plan);
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
      console.log(error);
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

// for filter 




// end 



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
            Manage Destination
          </MDTypography>
          <Link to="/insert-destination" style={{ textDecoration: "none" }}>
            <MDButton
              variant="gradient"
              color="dark"
              style={{ position: "absolute", top: "-15%", right: "1%" }}
            >
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;{shouldShowAddButton() ? "" : "add new Destination"}
            </MDButton>
          </Link>
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
                {plan.map((plan, index) => {

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      key={plan._id}
                      style={{
                        marginBottom: "1rem",
                        marginTop: "1rem",
                      }}
                    >
                    <div className="">
                      <div className="px-2" >
                        <div className="px-2" style={{backgroundColor: "aliceblue"}}>
                            <div className="text-center">
                                <h4>{Places.name}</h4>
                            </div>
                            <div>
                            <img src={Places.photo} alt=""  className="float-start"/>
                                <p className="text-justify" style={{overflowWrap: "anywhere"}}>{Places.description}</p>
                            </div>
                        </div>
                      </div>
                    </div>
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
      )}
    </DashboardLayout>
  );
};

export default Places_to_visit;
