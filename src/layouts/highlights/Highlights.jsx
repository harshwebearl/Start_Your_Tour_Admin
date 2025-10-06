import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Icon,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { BASE_URL } from "BASE_URL";

const Highlights = () => {
  const [photo_title, setPhoto_title] = useState([]);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [successSB, setSuccessSB] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchHighlights = async () => {
    const token = localStorage.getItem("sytAdmin");
    try {
      const res = await fetch(`${BASE_URL}highlight`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setPhoto_title(data.data || []);
    } catch (error) {
      console.error("Error fetching highlights:", error);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const shouldShowAddButton = () => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    return screenWidth < 650;
  };

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfully Added"
      content="Highlight is successfully added."
      dateTime="1 sec ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const imgurl = "/desk.png";

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3} px={{ xs: 1, sm: 2, md: 3 }}>
        <MDBox textAlign="center" mb={3}>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={{ xs: 2, sm: 1 }}
          >
            <MDTypography
              variant="h4"
              fontWeight="bold"
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
            >
              Hotel Highlights
            </MDTypography>
            <Link to="/add-new-highlight" style={{ textDecoration: "none" }}>
              <MDButton
                variant="gradient"
                color="dark"
                size="small"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: { xs: "40px", sm: "auto" },
                }}
              >
                <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                {!shouldShowAddButton() && "Add New Highlight"}
              </MDButton>
            </Link>
          </MDBox>
        </MDBox>
        <MDBox py={2}>
          <Box
            sx={{
              backgroundColor: "#f0f8ff",
              borderRadius: "16px",
              p: { xs: 2, sm: 3 },
            }}
          >
            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
              {photo_title.length === 0 ? (
                <Grid item xs={12}>
                  <MDTypography
                    textAlign="center"
                    sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                  >
                    No highlights available
                  </MDTypography>
                </Grid>
              ) : (
                photo_title.map((ele, index) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2.4}
                    key={index}
                  >
                    <Card
                      sx={{
                        backgroundColor: "#dee9fa",
                        borderRadius: "10px",
                        position: "relative",
                        textAlign: "center",
                        p: { xs: 1, sm: 2 },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <CardContent sx={{ width: "100%", p: { xs: "8px !important", sm: "16px !important" } }}>
                        <Box
                          sx={{
                            width: "100%",
                            height: { xs: "60px", sm: "80px" },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: { xs: 1, sm: 2 },
                          }}
                        >
                          <img
                            src={ele?.icon || imgurl}
                            alt={ele.title || "Highlight"}
                            style={{
                              width: { xs: "40px", sm: "60px" },
                              height: { xs: "40px", sm: "60px" },
                              objectFit: "contain",
                              borderRadius: "6px",
                              filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = imgurl;
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "500",
                            fontSize: { xs: "0.85rem", sm: "1rem" },
                            color: "#344767",
                            lineHeight: "1.3",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: { xs: 1, sm: 2 },
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {ele.title}
                        </Typography>
                      </CardContent>
                      <NavLink to={`/Edit-Highlights/${ele._id}`}>
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: { xs: 4, sm: 6 },
                            right: { xs: 4, sm: 6 },
                            color: "black",
                            backgroundColor: "rgba(255,255,255,0.8)",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,1)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease-in-out",
                            width: { xs: "24px", sm: "28px" },
                            height: { xs: "24px", sm: "28px" },
                          }}
                        >
                          <EditIcon sx={{ fontSize: { xs: "14px", sm: "16px" } }} />
                        </IconButton>
                      </NavLink>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </MDBox>
        {renderSuccessSB}
      </MDBox>
    </DashboardLayout>
  );
};

export default Highlights;