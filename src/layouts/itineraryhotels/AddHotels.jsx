import React, { useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import countries from "../../CountryStateCity.json";
import { useNavigate } from "react-router-dom";
import MDInput from "components/MDInput";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Grid,
  Typography,
  IconButton,
  Modal,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const AddItineraryHotel = () => {
  const navigate = useNavigate();

  const selectedStates = countries.find((e) => e.name === "India");
  const [cities, setCities] = useState([]);
  const [hotelName, setHotelName] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [hotelCity, setHotelCity] = useState("");
  const [hotelState, setHotelState] = useState("");
  const [hotelType, setHotelType] = useState("");
  const [hotelDescription, setHotelDescription] = useState("");
  const [other, setOther] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const [meals, setMeals] = useState({
    breakfast: { checked: false, price: 0 },
    lunch: { checked: false, price: 0 },
    dinner: { checked: false, price: 0 },
  });

  const handleMealChange = (meal) => {
    setMeals((prevMeals) => ({
      ...prevMeals,
      [meal]: {
        ...prevMeals[meal],
        checked: !prevMeals[meal].checked,
        price: !prevMeals[meal].checked ? "" : 0,
      },
    }));
  };

  const handleMealPriceChange = (meal, price) => {
    setMeals((prevMeals) => ({
      ...prevMeals,
      [meal]: { ...prevMeals[meal], price: price },
    }));
  };

  const [roomModalShow, setRoomModalShow] = useState(false);
  const [roomType, setRoomType] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
  const [rooms, setRooms] = useState([]); // Store added rooms

  // Open and close modal
  const handleRoomModalOpen = () => setRoomModalShow(true);
  const handleRoomModalClose = () => {
    setRoomModalShow(false);
    setRoomType(""); // Clear inputs
    setRoomPrice("");
  };

  // Handle input change
  const handleRoomFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "room_type") setRoomType(value);
    if (name === "room_price") setRoomPrice(value);
  };

  // Add room data
  const handleAddRoomData = () => {
    if (roomType.trim() && roomPrice.trim()) {
      addRoomType(roomType, roomPrice);
      handleRoomModalClose();
    }
    if (!roomType.trim() || !roomPrice) {
      toast.error("Please fill all fields");
      return;
    }
  };

  // Delete a room
  const handleDeleteRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };

  const addRoomType = (newType, newPrice) => {
    // Check if the type already exists (case-insensitive)
    if (
      rooms.some((room) => room.type.toLowerCase() === newType.toLowerCase())
    ) {
      toast.error("Type is already exists", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    // If not exists, add the new type with price
    setRooms([...rooms, { type: newType, price: newPrice }]);
  };

  const validateFields = () => {
    if (
      !hotelName.trim() ||
      !hotelAddress.trim() ||
      !hotelCity.trim() ||
      !hotelState.trim() ||
      !hotelType.trim() ||
      !hotelDescription.trim() ||
      !photos.length
    ) {
      toast.error("Please fill in all required fields.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return false;
    }
    return true;
  };

  const handlePartnerSubmit = async () => {
    if (!validateFields()) return; // If validation fails, return early.

    // Check if any selected meal has no price
    for (const [mealName, mealData] of Object.entries(meals)) {
      if (mealData.checked && (!mealData.price || Number(mealData.price) === 0)) {
        toast.error(`Please enter a price for ${mealName}.`, {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }
    }

    if (rooms?.length < 1) {
      setErrorMessage("Enter Rooms Details.");
      openErrorSB();
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("sytAdmin");
    const formData = new FormData();

    formData.append("hotel_name", hotelName);
    formData.append("hotel_address", hotelAddress);
    formData.append("hotel_city", hotelCity);
    formData.append("hotel_state", hotelState);
    formData.append("hotel_type", hotelType);
    formData.append("hotel_description", hotelDescription);
    formData.append("other", other);

    Object.entries(meals).forEach(([mealName, mealData]) => {
      formData.append(`${mealName}`, mealData.checked ? "true" : "false"); // Pass true/false
      formData.append(
        `${mealName}_price`,
        mealData.checked ? Number(mealData.price) : 0
      ); // Pass price or 0
    });

    rooms.forEach((room, index) => {
      formData.append(`rooms[${index}][room_type]`, room.type);
      formData.append(`rooms[${index}][room_type_price]`, Number(room.price));
    });

    photos.forEach((photo) => {
      formData.append("hotel_photo", photo);
    });

    try {
      const response = await fetch(`${BASE_URL}api/hotel_itienrary/create`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        setTimeout(() => {
          navigate("/itinerary-hotels");
        }, 1000);
        setLoading(false);
        setSuccessMessage("Hotel added successfully");
        openSuccessSB();
        setHotelName("");
        setHotelAddress("");
        setHotelCity("");
        setHotelState("");
        setHotelType("");
        setHotelDescription("");
        setOther("");
        setPhotos([]);
      } else {
        setLoading(false);
        setErrorMessage("Failed to add hotel");
        openErrorSB();
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error during API call");
      openErrorSB();
    }
  };

  const handlePhotoSelect = (e) => {
    const selectedPhotos = Array.from(e.target.files);
    setPhotos([...photos, ...selectedPhotos]);
  };

  const handlePhotoDelete = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const handleStateChange = (e) => {
    const selected = e.target.value;
    setHotelState(selected);
    const selectedCity = selectedStates.states.find((e) => e.name === selected);
    setCities(selectedCity.cities);
  };

  const renderSelectedPhotos = photos.map((photo, index) => (
    <Grid item xs={2} key={index}>
      <Card
        style={{ position: "relative", height: "100px", overflow: "hidden" }}
      >
        <img
          src={URL.createObjectURL(photo)}
          alt={`Photo ${index}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Button
          onClick={() => handlePhotoDelete(index)}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            minWidth: "auto",
            padding: "5px",
          }}
        >
          <DeleteIcon fontSize="small" style={{ color: "red" }} />
        </Button>
      </Card>
    </Grid>
  ));

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Success"
      content={successMessage}
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
      content={errorMessage}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card style={{ padding: "20px" }}>
              <Box p={1}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <div className="mb-1">
                      <h6
                        className="mb-0"
                        style={{ fontSize: "12px", color: "#b8b8b8" }}
                      >
                        Hotel Name
                      </h6>
                    </div>
                    <MDInput
                      type="text"
                      name="hotel_name"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className="mb-1">
                      <h6
                        className="mb-0"
                        style={{ fontSize: "12px", color: "#b8b8b8" }}
                      >
                        Hotel Address
                      </h6>
                    </div>
                    <MDInput
                      type="text"
                      name="hotel_name"
                      value={hotelAddress}
                      onChange={(e) => setHotelAddress(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <h6
                      className="mb-1"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Hotel State
                    </h6>
                    <FormControl fullWidth>
                      <Select
                        labelId="hotel-state-label"
                        id="hotel-state"
                        value={hotelState}
                        onChange={handleStateChange}
                        style={{
                          color: "#7b809a",
                          background: "transparent",
                          borderRadius: "5px",
                          fontSize: "14px",
                          height: "45px",
                        }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {selectedStates &&
                          selectedStates?.states?.map((e) => (
                            <MenuItem
                              key={e.name}
                              value={e.name}
                              style={{ color: "#495057" }}
                            >
                              {e.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <h6
                      className="mb-1"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Hotel City
                    </h6>
                    <FormControl fullWidth>
                      <Select
                        labelId="hotel-city-label"
                        id="hotel-city"
                        value={hotelCity}
                        onChange={(e) => setHotelCity(e.target.value)}
                        style={{
                          color: "#7b809a",
                          background: "transparent",
                          borderRadius: "5px",
                          fontSize: "14px",
                          height: "45px",
                        }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {cities &&
                          cities?.map((e) => (
                            <MenuItem
                              key={e.name}
                              value={e.name}
                              style={{ color: "#495057" }}
                            >
                              {e.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <h6
                      className="mb-1"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Hotel Type
                    </h6>
                    <FormControl fullWidth>
                      <Select
                        labelId="hotel-type-label"
                        id="hotel-type"
                        value={hotelType}
                        onChange={(e) => setHotelType(e.target.value)}
                        style={{
                          color: "#7b809a",
                          background: "transparent",
                          borderRadius: "5px",
                          fontSize: "14px",
                          height: "45px",
                        }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="5 star" style={{ color: "#495057" }}>
                          5 Star
                        </MenuItem>
                        <MenuItem value="4 star" style={{ color: "#495057" }}>
                          4 Star
                        </MenuItem>
                        <MenuItem value="3 star" style={{ color: "#495057" }}>
                          3 Star
                        </MenuItem>
                        <MenuItem value="2 star" style={{ color: "#495057" }}>
                          2 Star
                        </MenuItem>
                        <MenuItem value="1 star" style={{ color: "#495057" }}>
                          1 Star
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      marginLeft: "25px",
                      marginTop: "20px",
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <h6 style={{ fontSize: "12px", color: "#b8b8b8" }}>
                        Meals
                      </h6>
                      {Object.keys(meals).map((meal) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // Pushes elements to edges
                            width: "40%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={meals[meal].checked}
                              onChange={() => handleMealChange(meal)}
                            />
                            <label
                              style={{ fontSize: "14px", color: "#495057" }}
                            >
                              {meal.charAt(0).toUpperCase() + meal.slice(1)}
                            </label>
                          </div>

                          {meals[meal].checked && (
                            <MDInput
                              value={meals[meal].price}
                              onChange={(e) =>
                                handleMealPriceChange(meal, e.target.value)
                              }
                              onInput={(e) => {
                                // Allow first digit to be 1-9, then allow any digit (0-9) after that
                                e.target.value = e.target.value.replace(
                                  /^0+|[^0-9.]/g,
                                  ""
                                );
                                // Ensure first digit is 1-9 if present
                                if (
                                  e.target.value.length > 0 &&
                                  !/^[1-9]/.test(e.target.value)
                                ) {
                                  e.target.value = "";
                                }
                              }}
                              placeholder="Price"
                              style={{
                                width: "100px",
                                textAlign: "right",
                                marginTop: "5px",
                                appearance: "none",
                                MozAppearance: "textfield",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </Grid>
                    <Grid item xs={12} md={6} style={{ paddingLeft: "14px" }}>
                      <Grid container spacing={3}>
                        {/* Room Title & Add Button */}
                        <Grid item xs={12} md={6}>
                          <h6
                            className="mb-3"
                            style={{ fontSize: "12px", color: "#b8b8b8" }}
                          >
                            Room Type
                          </h6>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <h6
                            style={{
                              fontSize: "12px",
                              color: "#b8b8b8",
                              padding: "0px 0px 20px 0px",
                            }}
                          >
                            Price
                          </h6>
                          <IconButton
                            onClick={handleRoomModalOpen}
                            color="primary"
                            // className="mb-6"
                            style={{ padding: "0px 0px 20px 0px" }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Grid>

                        {/* Display Added Rooms */}
                        <Grid item xs={12}>
                          <List>
                            {rooms.map((room, index) => (
                              <ListItem key={index} divider>
                                <ListItemText
                                  primary={
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        width: "60%",
                                        alignItems: "flex-start",
                                        gap: "10px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontWeight: "normal",
                                          fontSize: "14px",
                                          whiteSpace: "normal",
                                          wordBreak: "break-word",
                                          maxWidth: "60%",
                                          display: "block",
                                        }}
                                      >
                                        {room.type}
                                      </span>
                                      <span
                                        style={{
                                          fontWeight: "normal",
                                          fontSize: "14px",
                                          minWidth: "40px",
                                          textAlign: "right",
                                        }}
                                      >
                                        {room.price}
                                      </span>
                                    </div>
                                  }
                                />

                                <ListItemSecondaryAction>
                                  <IconButton
                                    edge="end"
                                    onClick={() => handleDeleteRoom(index)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        </Grid>

                        {/* Room Modal */}
                        <Modal
                          open={roomModalShow}
                          onClose={handleRoomModalClose}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 400,
                              backgroundColor: "white",
                              padding: 20,
                              borderRadius: 8,
                              boxShadow: 24,
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              Add Room
                            </Typography>
                            <TextField
                              label="Room Type"
                              name="room_type"
                              fullWidth
                              value={roomType}
                              onChange={handleRoomFormChange}
                              margin="normal"
                              inputProps={{ maxLength: 120 }}
                              onInput={(e) => {
                                // Allow only letters and spaces
                                e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                              }}
                            />
                            <TextField
                              label="Room Price"
                              name="room_price"
                              fullWidth
                              value={roomPrice}
                              onChange={handleRoomFormChange}
                              margin="normal"
                              inputProps={{ min: 0, step: 1 }}
                              onKeyDown={(e) => {
                                const isNumberKey = /^[0-9]$/.test(e.key);
                                const allowedKeys = [
                                  "Backspace",
                                  "Delete",
                                  "ArrowLeft",
                                  "ArrowRight",
                                  "Tab",
                                ];

                                // Prevent non-numeric and unwanted keys
                                if (
                                  !isNumberKey &&
                                  !allowedKeys.includes(e.key)
                                ) {
                                  e.preventDefault();
                                }

                                // Prevent leading 0
                                if (e.key === "0" && roomPrice === "") {
                                  e.preventDefault();
                                }
                              }}
                            />

                            <Grid
                              container
                              justifyContent="center"
                              spacing={2}
                              marginTop={2}
                            >
                              <Grid item>
                                <Button
                                  variant="contained"
                                  onClick={handleRoomModalClose}
                                  color="secondary"
                                  style={{ color: "white" }}
                                >
                                  Cancel
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  variant="contained"
                                  onClick={handleAddRoomData}
                                  color="primary"
                                  style={{ color: "white" }}
                                >
                                  Add
                                </Button>
                              </Grid>
                            </Grid>
                          </div>
                        </Modal>
                      </Grid>
                    </Grid>
                  </div>
                  <Grid item xs={12}>
                    <h6
                      className="mb-1"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Hotel Description
                    </h6>
                    <FormControl fullWidth>
                      <TextField
                        id="hotel-description"
                        name="hotelDescription"
                        value={hotelDescription}
                        onChange={(e) => setHotelDescription(e.target.value)}
                        multiline
                        rows={1}
                        variant="outlined"
                        style={{
                          color: "#7b809a",
                          background: "transparent",
                          borderRadius: "5px",
                          fontSize: "14px",
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <h6
                      className="mb-1"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Other
                    </h6>
                    <FormControl fullWidth>
                      <TextField
                        id="other"
                        name="other"
                        value={other}
                        onChange={(e) => setOther(e.target.value)}
                        multiline
                        rows={1} // Adjust rows to make it look like a textarea
                        variant="outlined"
                        style={{
                          color: "#7b809a",
                          background: "transparent",
                          borderRadius: "5px",
                          fontSize: "14px",
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <input
                      type="file"
                      onChange={handlePhotoSelect}
                      style={{ display: "none" }}
                      id="upload-photo"
                      multiple
                      accept="image/png, image/jpeg"
                    />
                    <label htmlFor="upload-photo">
                      <Button
                        variant="contained"
                        component="span"
                        color="primary"
                        style={{ color: "white" }}
                      >
                        Add Photos
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {renderSelectedPhotos}
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePartnerSubmit}
                      disabled={loading}
                      style={{ color: "white" }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
                {renderSuccessSB}
                {renderErrorSB}
              </Box>
            </Card>
          </Grid>
        </Grid>
        <ToastContainer position="bottom-right" style={{ fontSize: "15px" }} />
      </Box>
    </DashboardLayout>
  );
};

export default AddItineraryHotel;
