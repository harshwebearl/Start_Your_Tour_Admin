import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { TextField, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { Country, State, City } from "country-state-city";
import authorsTableData from "layouts/userstable/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

function UsersTable() {
  const { columns, rows: allRows, isLoading } = authorsTableData();
  const [filteredRows, setFilteredRows] = useState(allRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [gender, setGender] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [state, setState] = useState();
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    setFilteredRows(allRows);
  }, [isLoading, allRows]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredData = allRows.filter((row) => {
      const name = row.user.props.name?.toLowerCase() || "";
      return name.includes(searchTerm);
    });
    setFilteredRows(filteredData);
  };

  const handleChange = (e) => {
    const selectedGender = e.target.value;
    setGender(selectedGender);
    const filteredData = allRows.filter((row) => {
      const genderMatch = selectedGender === "" || row.gender === selectedGender;
      const name = row.user.props.name?.toLowerCase() || "";
      return genderMatch && name.includes(searchTerm);
    });
    setFilteredRows(filteredData);
  };

  const handleStateChange = (event) => {
    const selectedStateValue = State.getStatesOfCountry("IN").find(
      (state) => state.isoCode === event.target.value
    );
    const selectedState1 = selectedStateValue?.name ?? "";
    setSelectedState(selectedStateValue);
    setSelectedCity("");
    setState(selectedStateValue?.name ?? "");
    const filteredData = allRows.filter((row) => {
      const genderMatch = gender === "" || row.gender === gender;
      const stateMatch = selectedState1 === "" || row.state === selectedState1;
      const name = row.user?.props?.name?.toLowerCase() || "";
      return genderMatch && name.includes(searchTerm) && stateMatch;
    });
    setFilteredRows(filteredData);
  };

  const handleCityChangee = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);
    const filteredData = allRows.filter((row) => {
      const genderMatch = gender === "" || row.gender === gender;
      const cityMatch = selectedCity === "" || row.city === selectedCity;
      const stateMatch = state === "" || row.state === state;
      const name = row.user.props.name?.toLowerCase() || "";
      return genderMatch && name.includes(searchTerm) && stateMatch && cityMatch;
    });
    setFilteredRows(filteredData);
  };

  const handleRole = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    const filteredData = allRows.filter((row) => {
      const genderMatch = gender === "" || row.gender === gender;
      const cityMatch = selectedCity === "" || row.city === selectedCity;
      const stateMatch = state === "" || row.state === state;
      const name = row.user.props.name?.toLowerCase() || "";
      const roleMatch = selectedRole === "" || row.role === selectedRole;
      return roleMatch && genderMatch && name.includes(searchTerm) && stateMatch && cityMatch;
    });
    setFilteredRows(filteredData);
  };

  // Pagination logic
  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Responsive, simple pagination (only prev, current, next)
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              id="search"
              label="Search User"
              variant="outlined"
              onChange={handleSearch}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2} lg={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="gender-label" sx={{ color: "#7b809a" }}>
                Gender
              </InputLabel>
              <Select
                labelId="gender-label"
                id="demo-simple-select"
                value={gender}
                onChange={handleChange}
                label="Gender"
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
                  height: "42px",
                }}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2} lg={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="state-label" sx={{ color: "#7b809a" }}>
                State
              </InputLabel>
              <Select
                labelId="state-label"
                id="state-select"
                value={selectedState ? selectedState.isoCode : ""}
                onChange={handleStateChange}
                label="State"
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
                  height: "42px",
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 350,
                      width: 50,
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
              >
                <MenuItem value="">Select State</MenuItem>
                {State.getStatesOfCountry("IN").map((state) => (
                  <MenuItem key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2} lg={2}>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              disabled={!selectedState}
            >
              <InputLabel id="city-label" sx={{ color: "#7b809a" }}>
                City
              </InputLabel>
              <Select
                labelId="city-label"
                id="city-select"
                value={selectedCity}
                onChange={handleCityChangee}
                label="City"
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
                  height: "42px",
                }}
              >
                <MenuItem value="">
                  <span style={{ color: "#7b809a" }}>Select City</span>
                </MenuItem>
                {selectedState &&
                  City.getCitiesOfState(
                    selectedState.countryCode,
                    selectedState.isoCode
                  ).map((city) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
<Grid item xs={12} sm={6} md={2} lg={2}>
  <FormControl fullWidth variant="outlined" size="small">
    <InputLabel id="role-label" sx={{ color: "#7b809a" }}>
      Role
    </InputLabel>
    <Select
      labelId="role-label"
      id="role-select"
      value={role}
      onChange={handleRole}
      label="Role"
      sx={{
        color: "#7b809a",
        borderRadius: "8px",
        marginBottom:'20px',
        fontSize: { xs: "13px", sm: "14px" }, 
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#dadbda",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#b0b0b0",
        },
        minHeight: { xs: "38px", sm: "42px" }, // no fixed height, responsive
      }}
    >
      <MenuItem value="">
        <span style={{ color: "#7b809a" }}>Select Role</span>
      </MenuItem>
      <MenuItem value="customer">Customer</MenuItem>
      <MenuItem value="vendor">Vendor</MenuItem>
      <MenuItem value="admin">Admin</MenuItem>
    </Select>
  </FormControl>
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
                  Users Table ({filteredRows.length})
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
                    {/* Custom Responsive Pagination */}
                    <MDBox
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                        pb: { xs: 1, sm: 2 },
                        px: { xs: 0.5, sm: 2, md: 4 },
                      }}
                    >
                      <MDBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: { xs: "100%", sm: "auto" },
                          maxWidth: 240, // smaller max width
                          mx: "auto",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
                          bgcolor: "#f7f7fa",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <IconButton
                          onClick={() => page > 1 && setPage(page - 1)}
                          disabled={page === 1}
                          sx={{
                            borderRadius: 0,
                            bgcolor: page === 1 ? "#f7f7fa" : "#fff",
                            borderRight: "1px solid #e0e0e0",
                            width: { xs: 32, sm: 36 }, // smaller button
                            height: { xs: 32, sm: 36 },
                            "&:hover": {
                              bgcolor: page === 1 ? "#f7f7fa" : "#f0f0f0",
                            },
                          }}
                        >
                          <ArrowBackIosNewIcon fontSize="small" sx={{ color: "#616161" }} />
                        </IconButton>
                        <MDBox
                          sx={{
                            flex: 1,
                            textAlign: "center",
                            bgcolor: "#f1f2f6",
                            fontWeight: 700,
                            color: "#26334d",
                            fontSize: { xs: "1rem", sm: "1.1rem" }, // smaller font
                            borderLeft: "none",
                            borderRight: "none",
                            minWidth: { xs: 36, sm: 44 }, // smaller min width
                            py: { xs: 0.2, sm: 0.4 }, // less vertical padding
                            letterSpacing: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {page}
                        </MDBox>
                        <IconButton
                          onClick={() => page < totalPages && setPage(page + 1)}
                          disabled={page === totalPages}
                          sx={{
                            borderRadius: 0,
                            bgcolor: page === totalPages ? "#f7f7fa" : "#fff",
                            borderLeft: "1px solid #e0e0e0",
                            width: { xs: 32, sm: 36 }, // smaller button
                            height: { xs: 32, sm: 36 },
                            "&:hover": {
                              bgcolor: page === totalPages ? "#f7f7fa" : "#f0f0f0",
                            },
                          }}
                        >
                          <ArrowForwardIosIcon fontSize="small" sx={{ color: "#616161" }} />
                        </IconButton>
                      </MDBox>
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

export default UsersTable;