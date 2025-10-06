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

const Manage_destination = () => {
  const [plan, setPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [successSB, setSuccessSB] = useState(false);
  const [city, setCity] = useState([]);
  const [temp,setTemp]=useState([])
  console.log(temp);
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
    const res = await fetch(`${BASE_URL}destination/alldestination`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      }
    })
    const data = await res.json();
    setCity(data.data);
    setTemp(data.data)
  }


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

  const handleFilter = (searchQuery) => {
    // Perform the filtering logic here using the searchQuery
    // Example: Filter an array of items based on a property matching the searchQuery
    const filteredItems = city.filter((item) =>
      item.destination_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const length=filteredItems.length;
    searchQuery==""?setTemp(city):setTemp(filteredItems);
    


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
            Manage Destination
          </MDTypography>
          <Link to="/insert-destination" style={{ textDecoration: "none" }}>
            <MDButton
              variant="gradient"
              color="dark"
              sx={{
          padding: "6px 16px",
          fontSize: "14px",
          minWidth: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
            >
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;{shouldShowAddButton() ? "" : "add new Destination"}
            </MDButton>
          </Link>
        </MDBox>
        <Grid container >
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
            <Card style={{ width: "100%", height: "100%", marginTop: "2rem" }}>
              <Grid container spacing={2}>
                {temp && temp.map((ele, index) => {

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      key={ele._id}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "1rem",
                        marginTop: "1rem",
                        position: "relative"
                      }}
                    >


                      <div className="mx-4 px-4 py-3 h-100" style={{ backgroundColor: "aliceblue" }}>
                        <div className="row">
                          <div className="col-sm-11 col-8 mb-3">
                            <h3>{ele.destination_name}</h3>
                          </div>
                          <div className="col-sm-1 col-4 text-end" style={{ fontSize: "30px", marginTop: "-10px" }}>
                            <NavLink to={`/edit-destination/${ele._id}`} style={{ color: "black" }}>
                              <EditNoteIcon />
                            </NavLink>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between px-2">
                          <div className="row">
                            <div className="col-sm-6 col-12 d-flex align-items-center">
                              <img src={ele.photo} alt="" className="img-fluid h-100 w-100" />
                            </div>
                            <div className="col-sm-6 col-12 d-flex ">
                              <div className="">
                                <ul className="list-unstyled ">
                                  <li><p style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>best time to visit : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.best_time_for_visit}</span></p></li>
                                  <li><p style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>how to reach : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.how_to_reach}</span></p></li>
                                  <li><p style={{ fontSize: "16px", color: "#7b809a", fontWeight: "700" }}>about destination : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.about_destination.slice(0, 50)}.....</span></p></li>
                                </ul>
                              </div>
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

export default Manage_destination;
