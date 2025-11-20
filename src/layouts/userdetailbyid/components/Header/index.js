import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import Pagination from "@mui/material/Pagination"; // Import Pagination
import { FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import breakpoints from "assets/theme/base/breakpoints";
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";
import { GlobleInfo } from "layouts/userdetailbyid";
import { GlobleInfo2 } from "layouts/customrequirmentlist/CustReqDetails";
import { BASE_URL } from "BASE_URL";

function Header({ children, selectedTab, onTabChange }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(selectedTab);
  const [page, setPage] = useState(1); // Current page state
  const itemsPerPage = 5; // Number of items per page

  let user = useContext(GlobleInfo);
  if (user === undefined) {
    user = useContext(GlobleInfo2);
  }

  const photo = "https://www.shutterstock.com/image-vector/man-icon-vector-260nw-1040084344.jpg";

  // Sample data extraction (adjust based on your actual data structure)
  const customRequirements = user?.[0]?.custom_requirements || [];
  const bookedPackages = user?.[0]?.booked_packages || [];
  const data = tabValue === 0 ? customRequirements : bookedPackages;

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get current page items
  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  useEffect(() => {
    setPage(1); // Reset to page 1 when tab changes
  }, [tabValue]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    onTabChange(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Status dropdown + confirmation modal
  const userId = user?.[0]?._id;
  const initialStatus =
    user?.[0]?.status || user?.[0]?.customer_details?.[0]?.status || "active";
  const [status, setStatus] = useState(initialStatus);
  const [pendingStatus, setPendingStatus] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const s = user?.[0]?.status || user?.[0]?.customer_details?.[0]?.status || "active";
    setStatus(s);
  }, [user]);

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setPendingStatus(value);
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("sytAdmin");
      const res = await fetch(`${BASE_URL}admin/customer/status?_id=${userId}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: pendingStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(pendingStatus);
        // Refresh the page so updated status is reflected across the UI
        window.location.reload();
      } else {
        // Optionally handle error (toast/log)
        console.error("Status update failed", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setOpenConfirm(false);
      setPendingStatus("");
    }
  };

  const handleCancel = () => {
    setPendingStatus("");
    setOpenConfirm(false);
  };

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -10,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar
              src={user?.[0]?.customer_details?.[0]?.photo || photo}
              alt="profile-image"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {user?.[0]?.customer_details?.[0]?.name || ""}
              </MDTypography>
              <MDTypography
                variant="button"
                color="text"
                fontWeight="regular"
                sx={{ display: "block" }}
              >
                {user?.[0]?.customer_details?.[0]?.email_address || ""}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {user?.[0]?.customer_details?.[0]
                  ? `${user[0].customer_details[0].city || ""}, ${user[0].customer_details[0].state || ""}`
                  : ""}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item>
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                minWidth: 160,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#fff',
                  transition: 'all 0.25s ease-in-out',

                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4f46e5', // hover color
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4338ca', // focus color
                    boxShadow: '0 0 0 3px rgba(79,70,229,0.15)',
                  },
                },

                '& .MuiInputLabel-root': {
                  color: '#6b7280',
                  fontSize: '14px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#4338ca',
                },
              }}
            >
              <InputLabel id="status-label">Status</InputLabel>

              <Select
                labelId="status-label"
                id="status-select"
                value={status}
                label="Status"
                onChange={handleStatusChange}
                sx={{
                  color: "#111827",
                  fontSize: "14px",
                  height: "44px",
                }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={6} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Custom Requirements"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      home
                    </Icon>
                  }
                />
                <Tab
                  label="Booked Packages"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      email
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {/* Render paginated content */}
        <MDBox mt={3}>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <MDBox key={index} mb={2} p={2} sx={{ border: "1px solid #ddd", borderRadius: "8px" }}>
                <MDTypography variant="body2">
                  {tabValue === 0 ? `Requirement: ${item.description}` : `Package: ${item.name}`}
                </MDTypography>
              </MDBox>
            ))
          ) : (
            <MDTypography variant="body2" color="text">
              No {tabValue === 0 ? "custom requirements" : "booked packages"} available.
            </MDTypography>
          )}
        </MDBox>
        {/* Pagination Control */}
        {totalPages > 1 && (
          <MDBox
            mt={3}
            display="flex"
            justifyContent={{ xs: "center", sm: "flex-end" }}
            sx={{ px: { xs: 1, sm: 2 } }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size={window.innerWidth < breakpoints.values.sm ? "small" : "medium"}
              sx={{
                "& .MuiPaginationItem-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
              }}
            />
          </MDBox>
        )}
        <Dialog 
  open={openConfirm} 
  onClose={handleCancel}
  sx={{
    '& .MuiDialog-paper': {
      backgroundColor: 'white', // dark background (optional)
      color: 'white',             // white text inside dialog
    },
    '& .MuiDialogTitle-root': {
      color: 'white',
    },
    '& .MuiDialogContent-root': {
      color: 'white',
    },
    '& .MuiButton-root': {
      color: 'white', // white text for buttons
    }
  }}
>
  <DialogTitle>Are you sure?</DialogTitle>

  <DialogContent>
    <MDTypography variant="body2" sx={{ color: "white" }}>
      Do you want to change status to "{pendingStatus}"?
    </MDTypography>
  </DialogContent>

  <DialogActions>
    <Button onClick={handleCancel} disabled={isSubmitting}>
      Cancel
    </Button>

    <Button
      onClick={handleConfirm}
      variant="contained"
      disabled={isSubmitting}
      sx={{ color: "#fff" }}
    >
      {isSubmitting ? "Saving..." : "Confirm"}
    </Button>
  </DialogActions>
</Dialog>


        {children}
      </Card>
    </MDBox>
  );
}

Header.defaultProps = {
  children: "",
};

Header.propTypes = {
  children: PropTypes.node,
  selectedTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default Header;