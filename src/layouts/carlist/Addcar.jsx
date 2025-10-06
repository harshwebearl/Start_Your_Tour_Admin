import React, { useEffect, useState , useRef} from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import CarRepairIcon from '@mui/icons-material/CarRepair';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import { useLocation, useNavigate } from "react-router-dom";

const AddCar = () => {
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
  console.log(editData)
  const [photoFile, setPhotoFile] = useState(null);
  const [isAddMode, setIsAddMode] = useState(true);
  const [errors, setErrors] = useState({});

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const inputRef = useRef();

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
    setErrors((prevErrors) => ({ ...prevErrors, photo: "" }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [carTypes, setCarTypes] = useState([]);
  const [carTypesLoading, setCarTypesLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!editData.car_name) newErrors.car_name = "Car Name is required";
    if (!editData.model_number)
      newErrors.model_number = "Model Number is required";
    if (!editData.car_type) newErrors.car_type = "Car Type is required";
    if (!editData.fuel_type) newErrors.fuel_type = "Fuel Type is required";
    if (!editData.car_seats)
      newErrors.car_seats = "Number of Seats is required";
    if (!photoFile && isAddMode) newErrors.photo = "Photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      openErrorSB();
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const token = localStorage.getItem("sytAdmin");
      const formData = new FormData();
      Object.keys(editData).forEach((key) =>
        formData.append(key, editData[key])
      );
      if (photoFile) formData.append("photo", photoFile);

      const url = isAddMode
        ? `${BASE_URL}car_syt`
        : `${BASE_URL}car_syt?id=${editData._id}`;
      await axios({
        method: isAddMode ? "post" : "put",
        url,
        data: formData,
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      openSuccessSB();
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.error(error);
      openErrorSB();
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.carData) {
      // incoming carData may contain nested objects for some fields; normalize car_type to an id string
      const data = location.state.carData;
      const normalized = {
        ...data,
        car_type:
          data && data.car_type
            ? typeof data.car_type === "object"
              ? data.car_type._id || data.car_type.id || data.car_type
              : data.car_type
            : "",
      };
      setEditData(normalized);
      setIsAddMode(false);
    } else {
      setIsAddMode(true);
    }
  }, [location.state]);

  // Fetch car types for the dropdown
  useEffect(() => {
    let mounted = true;
    const fetchCarTypes = async () => {
      setCarTypesLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}api/car-types`);
        // assume response is either an array or { data: [...] }
        const items = res.data && Array.isArray(res.data) ? res.data : res.data?.data || [];
        if (mounted) setCarTypes(items);
      } catch (err) {
        console.error("Failed to load car types:", err);
      } finally {
        if (mounted) setCarTypesLoading(false);
      }
    };
    fetchCarTypes();
    return () => {
      mounted = false;
    };
  }, []);

  const displayVal = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") return val.name ?? val._id ?? JSON.stringify(val);
    return String(val);
  };

  // derive the human readable name for the currently selected car type
  const selectedCarType = carTypes.find(
    (ct) => (ct._id || ct.id || ct.name) === editData.car_type
  );
  const selectedCarTypeName = selectedCarType
    ? selectedCarType.name || selectedCarType.type || displayVal(selectedCarType)
    : displayVal(editData.car_type);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box
        p={4}
        maxWidth="600px"
        mx="auto"
        borderRadius={2}
        boxShadow={3}
        bgcolor="white"
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
          {isAddMode ? "Add Car" : "Edit Car Details"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Car Name"
              name="car_name"
              value={editData.car_name}
              onChange={handleEditChange}
              fullWidth
              error={!!errors.car_name}
              helperText={errors.car_name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Model Number"
              name="model_number"
              value={editData.model_number}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,4}$/.test(value)) {
                  handleEditChange(e);
                }
              }}
              fullWidth
              error={!!errors.model_number}
              helperText={errors.model_number}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel sx={{ backgroundColor: "#f0f2f5", px: "2px" }}>
                Fuel Type
              </InputLabel>
              <Select
                name="fuel_type"
                value={editData.fuel_type}
                onChange={handleEditChange}
                sx={{ py: "13px" }}
              >
                <MenuItem value="petrol">Petrol</MenuItem>
                <MenuItem value="diesel">Diesel</MenuItem>
                <MenuItem value="electric">Electric</MenuItem>
                <MenuItem value="Gas">Gas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel sx={{ backgroundColor: "#f0f2f5", px: "2px" }}>
                Car Type
              </InputLabel>
              <Select
                name="car_type"
                value={editData.car_type || ""}
                onChange={handleEditChange}
                sx={{ py: "13px" }}
                error={!!errors.car_type}
                renderValue={(selected) => {
                  if (!selected) return <em>None</em>;
                  const ct = carTypes.find(
                    (c) => (c._id || c.id || c.name) === selected
                  );
                  const label = ct ? ct.name || ct.type || displayVal(ct) : displayVal(selected);
                  return (
                    <>
                      <CarRepairIcon fontSize="small" sx={{ mr: 1 }} />
                      {label}
                    </>
                  );
                }}
              >
                {carTypesLoading ? (
                  <MenuItem value="">
                    <em>Loading...</em>
                  </MenuItem>
                ) : (
                  // return an explicit array of MenuItem nodes instead of a Fragment
                  [
                    <MenuItem key="none" value="">
                      <em>None</em>
                    </MenuItem>,
                    ...carTypes.map((ct) => (
                      <MenuItem key={ct._id || ct.id || ct.name} value={ct._id || ct.id || ct.name}>
                        <CarRepairIcon fontSize="small" sx={{ mr: 1 }} />
                        {ct.name || ct.type || ct.car_type_name || displayVal(ct)}
                      </MenuItem>
                    )),
                  ]
                )}
              </Select>
              {errors.car_type && (
                <Typography color="error" mt={1} variant="caption">
                  {errors.car_type}
                </Typography>
              )}
              {/* Show selected car type name below the select */}
              {editData.car_type && (
                <Typography mt={1} variant="body2" color="textSecondary">
                  <CarRepairIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                  Selected: {selectedCarTypeName}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Number of Seats"
              name="car_seats"
              value={editData.car_seats}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d{0,4}$/.test(value)) {
                  handleEditChange(e);
                }
              }}
              fullWidth
              error={!!errors.car_seats}
              helperText={errors.car_seats}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>

          <Grid item xs={12}>
      {/* Hidden input */}
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handlePhotoChange}
        ref={inputRef}
        style={{ display: "none" }}
      />

      {/* Styled button */}
      <Button variant="contained" color="primary" onClick={handleButtonClick} style={{ color: "white" }}>
        Select Image
      </Button>

      {/* Error message */}
      {errors.photo && (
        <Typography color="error" mt={1}>
          {errors.photo}
        </Typography>
      )}
    </Grid>
          <Grid item xs={12} textAlign="center">
            {photoFile ? (
              <img
                src={URL.createObjectURL(photoFile)}
                alt="Preview"
                width="100"
                height="100"
              />
            ) : (
              editData.photo && (
                <img
                  src={editData.photo}
                  alt="Preview"
                  width="100"
                  height="100"
                />
              )
            )}
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              style={{ color: "white" }}
              onClick={handleSaveChanges}
              disabled={isLoading} // Disable while loading
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
      {successSB && (
        <MDSnackbar
          color="success"
          title="Success"
          content="Car saved successfully!"
          open={successSB}
          onClose={closeSuccessSB}
        />
      )}
      {errorSB && (
        <MDSnackbar
          color="error"
          title="Error"
          content="Please fill all required fields."
          open={errorSB}
          onClose={closeErrorSB}
        />
      )}
    </DashboardLayout>
  );
};

export default AddCar;
