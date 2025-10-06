import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Icon,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import { Link, useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";

const CarList = () => {
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [editData, setEditData] = useState({
    car_name: "",
    model_number: "",
    car_type: "",
    photo: "",
    fuel_type: "",
    car_seats: "",
  });
  const [open, setOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteCarId, setDeleteCarId] = useState(null);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successful"
      content="Car Type Edit / Update / Delete  successful."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Error"
      content="Please fill in all required fields."
      dateTime="1 sec"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const fetchCategoryList = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await axios.get(`${BASE_URL}car_syt`, {
        headers: { Authorization: token },
      });
      setCategoryList(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const [carname, setCarname] = useState("");
  const [modelnumber, setModelnumber] = useState("");
  const [fueltype, setFueltype] = useState("");

  // Helper to safely convert a field to a display string.
  // Some fields (e.g. car_type or fuel_type) may be objects like { _id, name }.
  // displayVal returns a sensible string for those cases so React doesn't try to render an object.
  const displayVal = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") return val.name ?? val._id ?? JSON.stringify(val);
    return String(val);
  };

  const valToLower = (val) => displayVal(val).toLowerCase();

  const handlecarname = (e) => setCarname(e.target.value);
  const handlemodelnumber = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setModelnumber(value);
  };
  const handlefueltype = (e) => setFueltype(e.target.value);

  const handleClose = () => {
    setEditData({
      car_name: "",
      model_number: "",
      car_type: "",
      photo: "",
      fuel_type: "",
      car_seats: "",
    });
    setPhotoFile(null);
    setOpen(false);
  };

  const handleOpen = (category) => {
    setEditData(category);
    setIsAddMode(false);
    setOpen(true);
  };

  const handleAddOpen = () => {
    setEditData({
      car_name: "",
      model_number: "",
      car_type: "",
      photo: "",
      fuel_type: "",
      car_seats: "",
    });
    setPhotoFile(null);
    setIsAddMode(true);
    setOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const validateForm = () => {
    if (
      !editData.car_name ||
      !editData.model_number ||
      !editData.car_type ||
      !editData.fuel_type ||
      !editData.car_seats
    ) {
      openErrorSB();
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("sytAdmin");
      const formData = new FormData();
      formData.append("car_name", editData.car_name);
      formData.append("model_number", editData.model_number);
      formData.append("car_type", editData.car_type);
      formData.append("car_seats", editData.car_seats);
      formData.append("fuel_type", editData.fuel_type);
      if (photoFile) formData.append("photo", photoFile);

      if (isAddMode) {
        await axios.post(`${BASE_URL}car_syt`, formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.put(`${BASE_URL}car_syt?id=${editData._id}`, formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      fetchCategoryList();
      openSuccessSB();
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      await axios.delete(`${BASE_URL}car_syt?id=${deleteCarId}`, {
        headers: { Authorization: token },
      });
      fetchCategoryList();
      openSuccessSB();
    } catch (error) {
      console.error(error);
    }
    setDeleteConfirmOpen(false);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400, md: 500 },
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: { xs: 2, sm: 3, md: 4 },
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3} px={{ xs: 2, sm: 3, md: 4 }}>
        <MDBox textAlign="center" mb={3}>
          <MDTypography variant="h4" fontWeight="bold">
            Car List
          </MDTypography>
        </MDBox>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Car Name"
              variant="outlined"
              value={carname}
              onChange={handlecarname}
              sx={{ mb: { xs: 2, sm: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Car Model Number"
              variant="outlined"
              value={modelnumber}
              onChange={handlemodelnumber}
              inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
              sx={{ mb: { xs: 2, sm: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Fuel Type</InputLabel>
              <Select
                value={fueltype}
                onChange={handlefueltype}
                label="Fuel Type"
                sx={{ height: 44 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="petrol">Petrol</MenuItem>
                <MenuItem value="diesel">Diesel</MenuItem>
                <MenuItem value="electric">Electric</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={1} display="flex" justifyContent="center">
            <MDButton
              variant="gradient"
              color="dark"
              onClick={() => navigate("/add-car")}
              sx={{
                width: { xs: "100%", sm: "auto" },
                minWidth: 120,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ mr: 1 }}>add</Icon>
              Add Car
            </MDButton>
          </Grid>
        </Grid>

        {/* Use CSS Grid to achieve exactly 5 columns at large screens (lg) */}
        {isLoading ? (
          <Grid container>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
            </Grid>
          </Grid>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(5, 1fr)",
              },
            }}
          >
            {categoryList
              .filter((category) => {
                const carnameLower = carname.toLowerCase();
                const modelnumberLower = modelnumber.toLowerCase();
                return (
                  (carname ? valToLower(category?.car_name).includes(carnameLower) : true) &&
                  (modelnumber ? valToLower(category?.model_number).includes(modelnumberLower) : true) &&
                  (fueltype ? valToLower(category?.fuel_type) === fueltype.toLowerCase() : true)
                );
              })
              .reverse()
              .map((category) => (
                <Box key={category._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  >
                    <CardMedia
                      sx={{ height: 140, objectFit: "cover" }}
                      image={category.photo}
                      title={category.car_name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="medium">
                        {displayVal(category.car_name)} ({displayVal(category.fuel_type)})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Model: {category.model_number}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Type: {displayVal(category.car_type)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Seats: {category.car_seats}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                      <Button
                        size="small"
                        onClick={() => navigate("/add-car", { state: { carData: category } })}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          setDeleteCarId(category._id);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
          </Box>
        )}

        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              {isAddMode ? "Add Car" : "Edit Car Details"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Car Name"
                  name="car_name"
                  value={editData.car_name}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Model Number"
                  name="model_number"
                  value={editData.model_number}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Fuel Type</InputLabel>
                  <Select
                    label="Fuel Type"
                    name="fuel_type"
                    value={editData.fuel_type}
                    onChange={handleEditChange}
                    sx={{ height: 44 }}
                  >
                    <MenuItem value="petrol">Petrol</MenuItem>
                    <MenuItem value="diesel">Diesel</MenuItem>
                    <MenuItem value="electric">Electric</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Car Type"
                  name="car_type"
                  value={editData.car_type}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Number of Seats"
                  name="car_seats"
                  value={editData.car_seats}
                  onChange={handleEditChange}
                  variant="outlined"
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Photo
                  <input type="file" hidden onChange={handlePhotoChange} />
                </Button>
                {(photoFile || (!isAddMode && editData.photo)) && (
                  <Box mt={2} display="flex" justifyContent="center">
                    <img
                      src={photoFile ? URL.createObjectURL(photoFile) : editData.photo}
                      alt="car"
                      style={{ maxWidth: "100%", height: "auto", maxHeight: 150 }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="space-between">
                <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>

        <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              Confirm Delete
            </Typography>
            <Typography mb={3}>Are you sure you want to delete this car?</Typography>
            <Box display="flex" justifyContent="space-between">
              <Button variant="contained" color="error" onClick={handleDelete} sx={{ background: "#ff0000fc" , color:"#040404fc"}}>
                Delete
              </Button>
              <Button variant="outlined" onClick={() => setDeleteConfirmOpen(false)} sx={{ color:"#040404fc"}} >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {renderSuccessSB}
        {renderErrorSB}
      </MDBox>
    </DashboardLayout>
  );
};

export default CarList;