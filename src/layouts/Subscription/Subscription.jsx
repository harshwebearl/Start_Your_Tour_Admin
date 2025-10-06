
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import authorsTableData from "layouts/Subscription/data/authorsTableData";

function Subscription() {
  const { columns, rows: allRows, isLoading } = authorsTableData();
  const [filteredRows, setFilteredRows] = useState(allRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    setFilteredRows(allRows);
  }, [allRows, isLoading]);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = allRows.filter((row) => {
      const email = row.email?.toLowerCase() || "";
      const emailMatch = email.includes(searchValue);
      const dateMatch = selectedDate
        ? row.created_at?.slice(0, 10) === selectedDate
        : true;
      return emailMatch && dateMatch;
    });

    setFilteredRows(filteredData);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3} px={{ xs: 2, sm: 3, md: 4 }}>
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} mb={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              label="Search Email"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ mb: { xs: 1, sm: 0 }, "& .MuiInputBase-root": { height: 44 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: new Date().toISOString().split("T")[0] }}
              sx={{ mb: { xs: 1, sm: 0 }, "& .MuiInputBase-root": { height: 44 } }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={2}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Subscribers
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={2} px={2}>
                {isLoading ? (
                  <MDBox display="flex" justifyContent="center">
                    <Audio
                      height="80"
                      width="80"
                      radius="9"
                      color="green"
                      ariaLabel="loading"
                    />
                  </MDBox>
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

export default Subscription;