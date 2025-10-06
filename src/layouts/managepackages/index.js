import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
import { Link, useNavigate, NavLink } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  Icon,
} from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Audio } from "react-loader-spinner";
import { BASE_URL } from "BASE_URL";
import { State } from "country-state-city";

const statesList = State.getStatesOfCountry("IN");

const ManageCategory = () => {
  const [plan, setPlan] = useState([]);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        setIsLoading(true);
        let url = `${BASE_URL}package`;
        if (filter !== "all") url += `?filter=${filter}`;
        const response = await axios.get(url);
        setPlan(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setIsLoading(false);
      }
    };
    fetchCategoryList();
  }, [filter]);

  const handleDelete = async () => {
    try {
      if (selectedPlan) {
        const token = localStorage.getItem("sytAdmin");
        const response = await axios.delete(`${BASE_URL}package/${selectedPlan._id}`, {
          headers: { Authorization: token },
        });
        if (response.data.status === "OK") openSuccessSB();
        setPlan((prev) => prev.filter((item) => item._id !== selectedPlan._id));
        setSelectedPlan(null);
      }
    } catch (err) {
      console.error("Deletion failed:", err);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
   <MDBox pt={6} pb={3} style={{ opacity: deleteDialogOpen ? 0.3 : 1 }}>
  {/* Heading and Add Button */}
  <MDBox
    display="flex"
    flexDirection={{ xs: "column", md: "row" }}
    alignItems="center"
    justifyContent="space-between"
    mb={3}
    px={{ xs: 2, sm: 0 }}
    gap={2}
  >
    <MDTypography
      variant="h4"
      fontWeight="bold"
      textAlign={{ xs: "center", md: "left" }}
      width="100%"
    >
      Manage Packages
    </MDTypography>

    <Link to="/insert-package" style={{ textDecoration: "none" }}>
      <MDButton
        variant="gradient"
        color="dark"
        size="medium"
        sx={{
          minWidth: { xs: "50px", md: "180px" },
          px: { xs: 0, md: 2 },
          py: { xs: 1.5, md: 1 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: "50px", md: "auto" },
          color: "#fff", // white color
        }}
      >
        <Icon sx={{ fontSize: "20px", color: "#fff" }}>add</Icon>
        <MDTypography
          sx={{
            display: { xs: "none", md: "inline" },
            ml: 1,
            fontSize: "0.875rem",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Add New Package
        </MDTypography>
      </MDButton>
    </Link>
  </MDBox>

  {/* Filters */}
  <Grid container spacing={2} justifyContent="center" mb={4}>
    <Grid item xs={12} sm={6} md={3}>
      <FormControl fullWidth variant="outlined" sx={{ height: "60px" }}>
        <InputLabel>User Type</InputLabel>
        <Select
          value={filter}
          label="User Type"
          onChange={(e) => setFilter(e.target.value)}
          sx={{ height: "60px" }}
        >
          <MenuItem value="all">All Packages</MenuItem>
          <MenuItem value="admin">Admin Packages</MenuItem>
          <MenuItem value="agency">Agency Packages</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <FormControl fullWidth variant="outlined" sx={{ height: "60px" }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ height: "60px" }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <TextField
        label="Price"
        type="number"
        fullWidth
        variant="outlined"
        value={priceFilter}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || parseInt(value) >= 0) {
            setPriceFilter(value);
          }
        }}
        sx={{ height: "60px" }}
        InputProps={{
          sx: { height: "60px" },
        }}
      />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <FormControl fullWidth variant="outlined" sx={{ height: "60px" }}>
        <InputLabel>State</InputLabel>
        <Select
          value={selectedState}
          label="State"
          onChange={(e) => setSelectedState(e.target.value)}
          sx={{ height: "60px" }}
        >
          <MenuItem value="all">All States</MenuItem>
          {statesList.map((state) => (
            <MenuItem key={state.isoCode} value={state.name}>
              {state.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  </Grid>

  {/* Packages Display */}
  <Grid container>
    {isLoading ? (
      <Grid item xs={12} display="flex" justifyContent="center">
        <Audio height="80" width="80" color="green" ariaLabel="loading" />
      </Grid>
    ) : (
      <Card style={{ width: "100%" }}>
        <Grid container spacing={2}>
          {plan
            .slice()
            .reverse()
            .filter((p) => {
              if (statusFilter === "active" && !p.status) return false;
              if (statusFilter === "inactive" && p.status) return false;
              if (priceFilter !== "all" && priceFilter !== "") {
                const price = Number(p.price_per_person);
                if (isNaN(price) || price > Number(priceFilter)) return false;
              }
              if (
                selectedState !== "all" &&
                (!p.destination_name || !p.destination_name.includes(selectedState))
              )
                return false;
              return true;
            })
            .map((p) => (
              <Grid item xs={12} sm={6} key={p._id}>
                <Card sx={{ p: 2, position: "relative", backgroundColor: "aliceblue" }}>
                  <NavLink to={`/full-details/${p._id}`} style={{ textDecoration: "none" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        <MDTypography variant="h5" fontWeight="medium">
                          {p.name}
                        </MDTypography>
                        <MDBox
                          component="span"
                          sx={{
                            backgroundColor: p.status ? "green" : "red",
                            color: "white",
                            px: 2,
                            py: 0.5,
                            borderRadius: "10px",
                            fontSize: "12px",
                          }}
                        >
                          {p.status ? "Active" : "Inactive"}
                        </MDBox>
                      </Grid>
                      <Grid item xs={2} textAlign="right">
                        <NavLink to={`/update-package/${p._id}`} style={{ color: "black" }}>
                          <EditNoteIcon />
                        </NavLink>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} sm={5}>
                        <img
                          src={p.photo}
                          alt=""
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={7}>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                          <li>Price: ₹{p.price_per_person}</li>
                          <li>Destination: {p.destination_name?.[0]}</li>
                          <li>Hotel Type: {p.hotel_type?.join(", ")}</li>
                          <li>Travel by: {p.travel_by}</li>
                          <li>Meal: {p.meal_required?.join(", ")}</li>
                          <li>Sightseeing: {p.sightseeing}</li>
                          <li>Total Days: {p.total_days}</li>
                          <li>User Type: {p.package_type}</li>
                        </ul>
                      </Grid>
                    </Grid>
                  </NavLink>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Card>
    )}
  </Grid>
</MDBox>



      {/* Success Snackbar */}
      <MDSnackbar
        color="success"
        icon="check"
        title="Package Deleted"
        content="The package was successfully removed."
        open={successSB}
        onClose={closeSuccessSB}
        close={() => setSuccessSB(false)}
        bgWhite
      />
    </DashboardLayout>
  );
};

export default ManageCategory;
