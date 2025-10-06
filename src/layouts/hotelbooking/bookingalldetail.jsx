import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, IconButton, Button } from "@mui/material";
import axios from "axios";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useEffect, useState } from "react";

import authorsTableData from "layouts/hotelbooking/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import { Autocomplete } from "@mui/material";

function HotelBookings() {
  const { columns, rows: allRows, isLoading } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  console.log(allRows);

  const [filteredRows, setFilteredRows] = useState(allRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    // Apply filtering
    applyFilter(searchTerm, status);
  };

  const handleStausSearch = (event) => {
    const status = event.target.value.toLowerCase();
    setStatus(status);

    // Apply filtering
    applyFilter(searchTerm, status);
  };

  const applyFilter = (searchTerm, status) => {
    const filteredData = allRows.filter((row) => {
      const name = row.hotel_details ? String(row.hotel_details).toLowerCase() : "";
      const nameMatch = name.includes(searchTerm);
  
      const statusHave = row?.status ? String(row.status).toLowerCase() : "";
      const statusMatch = !status || statusHave === status;
  
      return nameMatch && statusMatch;
    });
  
    setFilteredRows(filteredData);
  };

  useEffect(() => {
    setFilteredRows(allRows);
  }, [isLoading]);

  const handleStatus = (eve) => {
    setStatus(eve.target.value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} px={{ xs: 1, sm: 2, md: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="search"
              label="Search Hotel Name"
              value={searchTerm}
              variant="outlined"
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <SearchIcon sx={{ color: "#7b809a" }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  marginBottom:'20px',
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  height: { xs: "40px", sm: "45px" },
                },
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              id="status-select"
              options={[
                { label: "Status", value: "" },
                { label: "Pending", value: "pending" },
                { label: "Booked", value: "booked" },
                { label: "Rejected", value: "reject" },
                { label: "Approved", value: "approve" },
                { label: "Cancelled", value: "cancel" },
              ]}
              getOptionLabel={(option) => option.label}
              value={
                status
                  ? {
                      label: status.charAt(0).toUpperCase() + status.slice(1),
                      value: status,
                    }
                  : null
              }
              onChange={(event, newValue) =>
                handleStausSearch({
                  target: { value: newValue ? newValue.value : "" },
                })
              }
              disableClearable
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Status"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#7b809a",
                      background: "transparent",
                      borderRadius: "8px",
                      marginBottom:'20px',
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      height: { xs: "40px", sm: "45px" },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  All Hotel Bookings ({filteredRows.length})
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={{ xs: 1, sm: 2 }}>
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
                  <DataTable
                    table={{ columns, rows: filteredRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default HotelBookings;