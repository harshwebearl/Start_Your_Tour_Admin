import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";

const ManageCategory = () => {
  const [categoryList, setCategoryList] = useState([]);
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
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        // const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(
          `${BASE_URL}destinationcategory`
        );

        setCategoryList(response.data.data);
        setIsLoading(false);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategoryList();
  }, []);

  const handleDelete = async () => {
    try {
      if (selectedCategory) {
        const token = localStorage.getItem("sytAdmin");
        const responseDelete = await axios.delete(
          `${BASE_URL}destinationcategory/${selectedCategory._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (responseDelete.data.status === "OK") {
          openSuccessSB();
        }
        setCategoryList((prevCategoryList) =>
          prevCategoryList.filter((category) => category._id !== selectedCategory._id)
        );
        setSelectedCategory(null);
      }
    } catch (error) {
      console.log(error);
    }

    // Close the delete dialog
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
            Manage Category
          </MDTypography>
          <Link to="/insert-category" style={{ textDecoration: "none" }}>
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
              &nbsp;{shouldShowAddButton() ? "" : "add new Category"}
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
            categoryList.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={category._id}>
                <MDBox
                  component="li"
                  display="flex"
                  alignItems="center"
                  py={1}
                  mb={1}
                  style={{
                    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s ease",
                    position: "relative",
                  }}
                >
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
                    onClick={() => openDeleteDialog(category)}
                  />
                  <NavLink to={`/edit-category/${category._id}`}>
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
                    />
                  </NavLink>
                  <MDBox mr={3} ml={3} py={1}>
                    <MDAvatar
                      src={
                        category.photo
                          ? category.photo
                          : "https://www.shutterstock.com/image-vector/grunge-green-category-word-round-260nw-1794170542.jpg"
                      }
                      alt="something here"
                      shadow="md"
                    />
                  </MDBox>
                  <MDBox
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="center"
                  >
                    <MDTypography variant="button" fontWeight="medium">
                      {category.category_name}
                    </MDTypography>
                  </MDBox>
                  {renderSuccessSB}
                </MDBox>
              </Grid>
            ))
          )}
        </Grid>
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
              backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
              borderRadius: "1rem",
              zIndex: 1000,
            }}
          >
            <MDTypography variant="h6" fontWeight="bold" mb={3}>
              Confirm Deletion
            </MDTypography>
            <MDTypography variant="body1" mb={3}>
              Are you sure you want to delete this category?
            </MDTypography>
            <MDBox display="flex" justifyContent="center">
              <MDBox
                component="button"
                type="button"
                onClick={handleDelete}
                style={{ marginRight: "10px", backgroundColor: "red", cursor: "pointer" }}
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

export default ManageCategory;
