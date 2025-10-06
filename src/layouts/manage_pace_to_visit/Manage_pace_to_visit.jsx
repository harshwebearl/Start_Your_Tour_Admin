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
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Box, FormControl, Select, MenuItem, Button } from "@mui/material";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import Places_to_visit from "./Places_to_visit";
import { BASE_URL } from "BASE_URL";

const Manage_pace_to_visit = () => {
  const [Places, setPlaces] = useState([]);
  const [temp, setTemp] = useState();
  const [open, setOpen] = React.useState(false);
  // const result = Places.description.slice(0, 100);

  // const Call = async () => {
  //   const res = await fetch("${BASE_URL}placetovisit/6229cd5813790a85a23a08dd", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await res.json();
  //   setPlaces(data.data[0]);
  // };

  // useEffect(() => {
  //   Call();
  // }, []);

  const [destination, setDestination] = useState([]);
  const [slct, setSclt] = useState({
    Destinations: "",
  });

  const Dest = async () => {
    const token = localStorage.getItem("sytAdmin");

    const res = await fetch(`${BASE_URL}destination/alldestination`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setDestination(data.data);
    console.log(data.data);
  };

  useEffect(() => {
    Dest();
  }, []);

  const txt = (e) => {
    const { name, value } = e.target;
    setSclt({ ...slct, [name]: value });
    console.log(e);
  };
  console.log(slct);
  const handleButtonClick = async () => {
    if (selectedOption) {
      try {
        const response = await axios.get(
          `${BASE_URL}placetovisit/${selectedOption}`,
          {
            headers: {
              Authorization: "Bearer your_token_here",
            },
          }
        );

        // Process the response data
        console.log(response.data);
        setPlaces(response.data.data);
        setTemp(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  console.log(Places);
  const [plcaeVisit, setPlaceVisit] = useState();
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
          prevCategoryList.filter(
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
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
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

  // for filter

  const handleFilter = (searchQuery) => {
    // Perform the filtering logic here using the searchQuery
    // Example: Filter an array of items based on a property matching the searchQuery
    const filteredItems = Places.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Do something with the filtered items
    console.log(filteredItems.length);
    const length = filteredItems.length;
    searchQuery == "" ? setTemp(Places) : setTemp(filteredItems);
    console.log(filteredItems);
  };

  // end

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
            Manage Place To Visit
          </MDTypography>
          <Link to="/Insert_place_to_visit" style={{ textDecoration: "none" }}>
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
              &nbsp;{shouldShowAddButton() ? "" : "add new place to visit"}
            </MDButton>
          </Link>
        </MDBox>

        <Box display="flex" justifyContent="center" alignItems="center">
          <FormControl sx={{ width: "50%" }}>
            <Select
              value={selectedOption}
              onChange={handleOptionChange}
              displayEmpty
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: "350px", // Limit dropdown height
                    overflowY: "auto", // Enable scrolling
                  },
                },
              }}
              sx={{
                border: "1px solid grey",
                borderRadius: 2,
                backgroundColor: "white",
                height: "40px",
              }}
            >
              <MenuItem disabled value="">
                Select Destination
              </MenuItem>
              {destination.map((ele) => (
                <MenuItem key={ele._id} value={ele._id}>
                  {ele.destination_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            sx={{
              ml: 2,
              width: 50,
              borderRadius: 2,
              backgroundColor: "#000000 !important", // Ensures black bg
              color: "#FFFFFF !important", // Ensures white text
              padding: "8px 0px",
              "&:hover": {
                backgroundColor: "#000000 !important",
              },
            }}
            onClick={handleButtonClick}
          >
            OK
          </Button>
        </Box>

        <div className="w-100 mt-4">
          <div
            className="row py-3"
            style={{ backgroundColor: "white", borderRadius: "10px" }}
          >
            {temp &&
              temp.map((ele) => (
                <div
                  className="col-sm-6 col-12 px-2 py-2 h-100"
                  style={{ height: "480px" }}
                >
                  <div
                    className="px-2 rounded"
                    style={{ backgroundColor: "aliceblue" }}
                  >
                    <div className="row py-3">
                      <div className="text-sm-center text-start col-12">
                        <div className="row">
                          <div className="col-sm-11 col-10">
                            <h4>{ele.name}</h4>
                          </div>
                          <div className="col-sm-1 col-2">
                            <NavLink
                              to={`/Edit_place_to_visit/${ele._id}`}
                              style={{ color: "black" }}
                            >
                              <EditNoteIcon />
                            </NavLink>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 mt-3 overflow-hidden">
                        <div className="row ">
                          <div className="col-sm-6 col-12">
                            <img
                              src={ele.photo}
                              alt=""
                              className="float-start img-fluid"
                            />
                          </div>
                          <div className="col-sm-6 col-12">
                            <p
                              className="text-justify "
                              style={{ fontSize: "15px" }}
                            >
                              {ele.description.slice(0, 250)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
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

export default Manage_pace_to_visit;
