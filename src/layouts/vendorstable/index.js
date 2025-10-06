import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Pagination from "@mui/material/Pagination";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/vendorstable/data/authorsTableData";
import axios from "axios";
import { BASE_URL } from "BASE_URL";

function VendorsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [business, setBusiness] = useState("");
  const [status, setStatus] = useState("");
  const [searchGst, setSearchGst] = useState("");

  const [vendorData, setVendorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}agency/agencylist`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        setVendorData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const { columns, rows } = authorsTableData(
    vendorData || [],
    searchTerm,
    searchGst,
    business,
    status
  );

  // Pagination logic
  const paginatedRows = rows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  // Handlers
  const handleSearch = (event) => setSearchTerm(event.target.value);
  const handleGst = (event) => setSearchGst(event.target.value);
  const handleBusiness = (event) => setBusiness(event.target.value);
  const handleStatus = (event) => setStatus(event.target.value);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={2} mb={3}>
          {/* Filter for Agency Name */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              id="search"
              label="Search Agency"
              value={searchTerm}
              variant="outlined"
              onChange={handleSearch}
            />
          </Grid>

          {/* Filter for GST */}
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              fullWidth
              id="gst"
              label="Search by GST"
              value={searchGst}
              variant="outlined"
              onChange={handleGst}
            />
          </Grid>

          {/* Filter for Business Type */}
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="business-label" sx={{ color: "#7b809a" }}>
                Business Type & GST
              </InputLabel>
              <Select
                labelId="business-label"
                id="business-select"
                value={business}
                onChange={handleBusiness}
                label="Business Type & GST"
                sx={{
                  color: "#7b809a",
                  borderRadius: "8px",
                  fontSize: "14px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#dadbda",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b0b0b0",
                  },
                  height: "44px",
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Corporate">Corporate</MenuItem>
                <MenuItem value="Sole Proprietor">Sole Proprietor</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Filter for Status */}
          <Grid item xs={12} sm={6} md={2} lg={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-label" sx={{ color: "#7b809a" }}>
                Status
              </InputLabel>
              <Select
                labelId="status-label"
                id="status-select"
                value={status}
                onChange={handleStatus}
                label="Status"
                sx={{
                  color: "#7b809a",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginBottom:'20px',
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#dadbda",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b0b0b0",
                  },
                  height: "44px",
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container>
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
                <MDTypography variant="h6" color="white" >
                  Vendors Table ({rows?.length})
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {isLoading ? (
                  <Audio
                    height="80"
                    width="80"
                    radius="9"
                    color="green"
                    ariaLabel="loading"
                  />
                ) : (
                  <>
                    <DataTable
                      table={{ columns, rows: paginatedRows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                    <MDBox
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                        pb: { xs: 1, sm: 2 },
                      }}
                    >
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        color="standard"
                        shape="rounded"
                        siblingCount={0}
                        boundaryCount={1}
                        size="medium"
                        sx={{
                          "& .Mui-selected": {
                            bgcolor: "#e0e0e0 !important",
                            color: "#26334d !important",
                            borderRadius: "8px",
                          },
                          "& .MuiPaginationItem-root": {
                            fontWeight: 600,
                          },
                        }}
                      />
                    </MDBox>
                  </>
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

export default VendorsTable;
