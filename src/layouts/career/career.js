import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate } from "react-router-dom";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import { BASE_URL } from "BASE_URL";

function Career() {
  const [isLoading, setIsLoading] = useState(true);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      if (selectedCategory) {
        const token = localStorage.getItem("sytAdmin");
        const responseDelete = await axios.delete(
          `${BASE_URL}api/career?_id=${selectedCategory._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (responseDelete.status === "OK") {
          openSuccessSB();
        }
        setCareerList((prevcareerList) =>
          prevcareerList.filter(
            (category) => category._id !== selectedCategory._id
          )
        );
        setSelectedCategory(null);
      }
    } catch (error) {
      console.log(error);
    }

    // Close the delete dialog
    setDeleteDialogOpen(false);
  };
  const handleEdit = () => {
    navigate("/edit-category/:_id");
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };
  const shouldShowAddButton = () => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    return screenWidth < 650;
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const [value, setValue] = useState("1");
  const [currentTabData, setCurrentTabData] = useState(null);
  console.log(currentTabData);

  const handleChange = async (event, newValue) => {
    setValue(newValue);
    await Call2(newValue);
  };

  const [title, seTitle] = useState("");

  const Call = async () => {
    const res = await fetch(`${BASE_URL}api/career_category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    seTitle(data.data);
    if (data.data.length > 0) {
      const firstTabId = data.data[0]._id;
      setValue(firstTabId);
      await Call2(firstTabId); // Call the function for the first tab data
    }
  };

  const Call2 = async (id) => {
    const res = await fetch(`${BASE_URL}api/career?career_category_id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "aplication/json",
      },
    });
    const data = await res.json();
    console.log(data.data);
    setCurrentTabData(data.data);
  };

  useEffect(() => {
    Call();
    Call2();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3} style={{ opacity: deleteDialogOpen ? 0.3 : 1 }}>
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
            Manage Career
          </MDTypography>
          <Link to="/insertcareer" style={{ textDecoration: "none" }}>
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
              &nbsp;{shouldShowAddButton() ? "" : "add new Career"}
            </MDButton>
          </Link>
        </MDBox>
        <Box sx={{ width: "100%", padding: 0 }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", gap: 6 }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                TabIndicatorProps={{
                  sx: { backgroundColor: "rgba(207, 22, 111, 0.5)" },
                }}
                sx={{
                  "& button": { fontFamily: "poppins" },
                  "& button:active": { color: "rgba(207, 22, 111, 0.5)" },
                  "& button.Mui-selected": { color: "rgba(207, 22, 111, 0.5)" },
                }}
              >
                {title &&
                  title.map((item) => (
                    <Tab
                      label={item.career_cat_value}
                      value={item._id}
                      key={item._id}
                    />
                  ))}
              </TabList>
            </Box>
            {title &&
              title.map((item) => (
                <TabPanel value={item._id} key={item._id} sx={{ padding: 0 }}>
                  {currentTabData &&
                    currentTabData.map((job) => (
                      <>
                        {job?.[0]?.career_title}
                        <Accordion
                          sx={{
                            padding: "10px 0px 10px 20px",
                            marginTop: "10px",
                            boxShadow: "none",
                          }}
                        >
                          <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                              padding: "0px 0px",
                              height: "100%",
                              width: "100%",
                              div: {
                                margin: 0,
                              },
                            }}
                          >
                            <div className="jobpositioncard">
                              <div>
                                <h3 className="job__title">
                                  {job.career_title}
                                </h3>
                                {job.career_tag && (
                                  <span className="job__details">
                                    {job.career_tag.map((e, index) => (
                                      <React.Fragment key={index}>
                                        {index > 0 && " || "}
                                        {e}
                                      </React.Fragment>
                                    ))}
                                  </span>
                                )}
                                <NavLink to={`/editcareercategory/${job._id}`}>
                                  <MDBox
                                    component="img"
                                    src="https://cdn-icons-png.flaticon.com/512/84/84380.png"
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      position: "absolute",
                                      top: "4%",
                                      right: "8%",
                                      cursor: "pointer",
                                    }}
                                    // onClick={handleEdit}
                                  />
                                </NavLink>
                                <MDBox
                                  component="img"
                                  src="https://w7.pngwing.com/pngs/895/550/png-transparent-black-and-white-logo-computer-icons-symbol-free-of-close-button-icon-miscellaneous-trademark-sign-thumbnail.png"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    backgroundColor: "green",
                                    position: "absolute",
                                    top: "4%",
                                    right: "1%",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => openDeleteDialog(job)}
                                />
                              </div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <AccordionDetails>
                              <div
                                className="job_accordion_details"
                                dangerouslySetInnerHTML={{
                                  __html: job.career_desc,
                                }}
                              />
                            </AccordionDetails>
                          </AccordionDetails>
                        </Accordion>
                      </>
                    ))}
                </TabPanel>
              ))}
          </TabContext>
        </Box>
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
              backgroundColor: darkMode ? "rgb(26 46 79)" : "#f5f5f5",
              borderRadius: "1rem",
              zIndex: 1000,
            }}
          >
            <MDTypography variant="h6" fontWeight="bold" mb={3}>
              Confirm Deletion
            </MDTypography>
            <MDTypography variant="body1" mb={3}>
              Are you sure you want to delete this career?
            </MDTypography>
            <MDBox display="flex" justifyContent="center">
              <MDBox
                component="button"
                type="button"
                onClick={handleDelete}
                style={{
                  marginRight: "10px",
                  color: "#f5f5f5",
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
                style={{
                  backgroundColor: "green",
                  color: "#f5f5f5",
                  cursor: "pointer",
                }}
              >
                Cancel
              </MDBox>
            </MDBox>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}

export default Career;
