import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AddIcon from "@mui/icons-material/Add";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDSnackbar from "components/MDSnackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BASE_URL } from "BASE_URL";
import DeleteIcon from "@mui/icons-material/Delete";
import countries from "../../CountryStateCity.json";
import { useParams, useNavigate } from "react-router-dom"; // Assuming you are using react-router
import MDInput from "components/MDInput";
import { Autocomplete } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditItineraryHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

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
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [meals, setMeals] = useState({
    breakfast: { checked: false, price: 0 },
    lunch: { checked: false, price: 0 },
    dinner: { checked: false, price: 0 },
  });

  const [roomModalShow, setRoomModalShow] = useState(false);
  const [roomType, setRoomType] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
  const [rooms, setRooms] = useState([]);

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

  useEffect(() => {
    const fetchHotelData = async () => {
      const token = localStorage.getItem("sytAdmin");
      try {
        const response = await fetch(
          `${BASE_URL}api/hotel_itienrary/displayById/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        const selectedCity = selectedStates?.states?.find(
          (state) => state.name === data?.data.hotel_state
        );
        if (data?.success) {
          setHotelName(data?.data.hotel_name);
          setHotelAddress(data?.data.hotel_address);
          setHotelCity(data?.data.hotel_city);
          setHotelState(data?.data.hotel_state);
          setHotelType(data?.data.hotel_type);
          setHotelDescription(data?.data.hotel_description);
          setOther(data?.data.other);
          setPreviewPhotos(data?.data?.hotel_photo || []);
          setMeals({
            breakfast: {
              checked: Boolean(data?.data.breakfast_price),
              price: data?.data.breakfast_price || 0,
            },
            lunch: {
              checked: Boolean(data?.data.lunch_price),
              price: data?.data.lunch_price || 0,
            },
            dinner: {
              checked: Boolean(data?.data.dinner_price),
              price: data?.data.dinner_price || 0,
            },
          });
          setRooms(
            data?.data.rooms?.map((room) => ({
              type: room.room_type,
              price: room.room_type_price,
            })) || []
          );
        }
        setCities(selectedCity?.cities || []);
      } catch (error) {
        console.error("Failed to fetch hotel data", error);
      }
    };

    fetchHotelData();
  }, [id, selectedStates]);

  const handleUpdateSubmit = async () => {
    // Validation for empty or only spaces fields
    if (
      !hotelName.trim() ||
      !hotelAddress.trim() ||
      !hotelCity.trim() ||
      !hotelState.trim() ||
      !hotelType.trim() ||
      !hotelDescription.trim()
      // Add more fields if needed
    ) {
      toast.error("Please fill all fields properly. No field should be empty or only spaces.");
      return;
    }

    // NEW: Meals price validation
    for (const meal in meals) {
      if (meals[meal].checked && (!meals[meal].price || meals[meal].price.toString().trim() === "")) {
        toast.error(`Please enter a price for ${meal} if selected.`);
        return;
      }
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

    photos.forEach((photo) => {
      formData.append("hotel_photo", photo);
    });

    previewPhotos.forEach((photo) => {
      formData.append("previmages", photo);
    });

    Object.keys(meals).forEach((meal) => {
      formData.append(`${meal}_checked`, meals[meal].checked);
      formData.append(
        `${meal}_price`,
        meals[meal].checked ? meals[meal].price : 0
      );
    });

    try {
      const response = await fetch(
        `${BASE_URL}api/hotel_itienrary/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setLoading(false);
        setSuccessMessage("Hotel updated successfully");
        openSuccessSB();
        setTimeout(() => {
          navigate("/itinerary-hotels");
        }, 1000);
      } else {
        setLoading(false);
        setErrorMessage("Failed to update hotel");
        openErrorSB();
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error during API call");
      openErrorSB();
    }
  };

  const handleDeleteHotel = async () => {
    const token = localStorage.getItem("sytAdmin");
    try {
      const response = await fetch(
        `${BASE_URL}api/hotel_itienrary/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        navigate("/path-to-hotel-list");
      } else {
        setErrorMessage("Failed to delete hotel");
        openErrorSB();
      }
    } catch (error) {
      setErrorMessage("Error during API call");
      openErrorSB();
    }
  };

  const handleStateChange = (e) => {
    const selected = e.target.value;
    setHotelState(selected);
    const selectedCity = selectedStates.states.find((e) => e.name === selected);
    setCities(selectedCity.cities);
  };

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

  const handleRoomModalOpen = () => setRoomModalShow(true);
  const handleRoomModalClose = () => {
    setRoomModalShow(false);
    setRoomType("");
    setRoomPrice("");
  };

  const handleRoomFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "room_type") setRoomType(value);
    if (name === "room_price") setRoomPrice(value);
  };

  const handleAddRoomData = () => {
    if (roomType.trim() && roomPrice.trim()) {
      setRooms([...rooms, { type: roomType, price: roomPrice }]);
      handleRoomModalClose();
    }
    if (!roomType.trim() || !roomPrice) {
      toast.error("Please fill all fields");
      return;
    }
  };

  const handleDeleteRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };

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
                    {/* <TextField
                                            fullWidth
                                            label="Hotel Name"
                                            value={hotelName}
                                            onChange={(e) => setHotelName(e.target.value)}
                                        /> */}
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
                    {/* <TextField
                                            fullWidth
                                            label="Hotel Address"
                                            value={hotelAddress}
                                            onChange={(e) => setHotelAddress(e.target.value)}
                                        /> */}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <h6
                      className="mb-1"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Hotel State
                    </h6>
                    <Autocomplete
                      id="hotel-state-select"
                      options={
                        selectedStates?.states?.map((e) => ({
                          label: e.name,
                          value: e.name,
                        })) || []
                      }
                      getOptionLabel={(option) => option.label}
                      value={
                        hotelState
                          ? { label: hotelState, value: hotelState }
                          : null
                      }
                      onChange={(event, newValue) =>
                        handleStateChange({
                          target: { value: newValue ? newValue.value : "" },
                        })
                      }
                      disableClearable
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              color: "#7b809a",
                              background: "transparent",
                              borderRadius: "5px",
                              fontSize: "14px",
                              height: "45px",
                              padding: "0px 0px 4px 8px",
                            },
                          }}
                        />
                      )}
                    />
                    {/* <FormControl fullWidth>
                                            <InputLabel>Hotel State</InputLabel>
                                            <Select value={hotelState} onChange={handleStateChange}>
                                                <MenuItem value="">Select</MenuItem>
                                                {selectedStates &&
                                                    selectedStates.states.map((e) => (
                                                        <MenuItem value={e.name}>{e.name}</MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl> */}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <h6
                      className="mb-1"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Hotel City
                    </h6>
                    <Autocomplete
                      id="hotel-city-select"
                      options={
                        cities?.map((e) => ({
                          label: e.name,
                          value: e.name,
                        })) || []
                      }
                      getOptionLabel={(option) => option.label}
                      value={
                        hotelCity
                          ? { label: hotelCity, value: hotelCity }
                          : null
                      }
                      onChange={(event, newValue) =>
                        setHotelCity(newValue ? newValue.value : "")
                      }
                      disableClearable
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              color: "#7b809a",
                              background: "transparent",
                              borderRadius: "5px",
                              fontSize: "14px",
                              height: "45px",
                              padding: "0px 4px 0px 8px",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <h6
                      className="mb-1"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Hotel Type
                    </h6>
                    <Autocomplete
                      id="hotel-type-select"
                      options={[
                        { label: "5 Star", value: "5 star" },
                        { label: "4 Star", value: "4 star" },
                        { label: "3 Star", value: "3 star" },
                        { label: "2 Star", value: "2 star" },
                        { label: "1 Star", value: "1 star" },
                      ]}
                      getOptionLabel={(option) => option.label}
                      value={
                        hotelType
                          ? { label: hotelType, value: hotelType }
                          : null
                      }
                      onChange={(event, newValue) =>
                        setHotelType(newValue ? newValue.value : "")
                      }
                      disableClearable
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              color: "#7b809a",
                              background: "transparent",
                              borderRadius: "5px",
                              fontSize: "14px",
                              height: "45px",
                              padding: "0px 4px 0px 8px",
                            },
                          }}
                        />
                      )}
                    />
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
                          key={meal}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "40%",
                            marginBottom: "10px",
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
                                // Only allow first digit 1-9, then 0-9, optional decimal
                                let value = e.target.value.replace(/[^\d.]/g, "");
                                value = value.replace(/^0+/, ""); // Remove leading zeros
                                if (value.indexOf('.') !== -1) {
                                  const parts = value.split('.');
                                  value = parts[0] + '.' + parts.slice(1).join('');
                                }
                                e.target.value = value;
                              }}
                              placeholder="Price"
                              style={{
                                width: "100px",
                                textAlign: "right",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </Grid>
                    <Grid item xs={12} md={6} style={{ paddingLeft: "14px" }}>
                      <Grid container spacing={3}>
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
                            style={{ padding: "0px 0px 20px 0px" }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Grid>

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
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontWeight: "normal",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {room.type}
                                      </span>
                                      <span
                                        style={{
                                          fontWeight: "normal",
                                          fontSize: "14px",
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
                                // Allow only numbers (0-9), backspace, delete, and arrow keys
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  ![
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                  ].includes(e.key)
                                ) {
                                  e.preventDefault(); // Prevent any other key presses
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
                    <TextField
                      fullWidth
                      multiline
                      rows={1} // You can adjust the rows to your preference
                      value={hotelDescription}
                      onChange={(e) => setHotelDescription(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#7b809a",
                          background: "transparent",
                          borderRadius: "5px",
                          fontSize: "14px",
                          padding: "0px 4px 0px 0px",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <h6
                      className="mb-1"
                      style={{ fontSize: "12px", color: "#b8b8b8" }}
                    >
                      Other
                    </h6>
                    <TextField
                      fullWidth
                      multiline
                      rows={1} // You can adjust rows to your preference
                      value={other}
                      onChange={(e) => setOther(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#7b809a",
                          background: "transparent",
                          borderRadius: "5px",
                          fontSize: "14px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <input
                      type="file"
                      accept="image/jpg,image/jpeg"
                      onChange={(e) =>
                        setPhotos([...photos, ...Array.from(e.target.files)])
                      }
                      style={{ display: "none" }}
                      id="upload-photo"
                      multiple
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
                      {previewPhotos?.map((photo, index) => (
                        <Grid item xs={4} key={index}>
                          <Card
                            style={{
                              position: "relative",
                              height: "100px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={photo}
                              alt="image"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <Button
                              onClick={() =>
                                setPreviewPhotos(
                                  previewPhotos?.filter((_, i) => i !== index)
                                )
                              }
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                minWidth: "auto",
                                padding: "5px",
                              }}
                            >
                              <DeleteIcon fontSize="small" style={{color:"red"}} />
                            </Button>
                          </Card>
                        </Grid>
                      ))}
                      {photos?.map((photo, index) => (
                        <Grid item xs={4} key={index}>
                          <Card
                            style={{
                              position: "relative",
                              height: "120px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Photo ${index}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <Button
                              onClick={() =>
                                setPhotos(photos.filter((_, i) => i !== index))
                              }
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                minWidth: "auto",
                                padding: "5px",
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setOpenDeleteDialog(true)}
                      style={{ color: "white" }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateSubmit}
                      disabled={loading}
                      style={{ color: "white" }}
                    >
                      Update
                    </Button>
                  </Grid>
                </Grid>
                <MDSnackbar
                  color="success"
                  icon="check"
                  title="Success"
                  content={successMessage}
                  open={successSB}
                  onClose={() => setSuccessSB(false)}
                  close={() => setSuccessSB(false)}
                  bgWhite
                />
                <MDSnackbar
                  color="error"
                  icon="warning"
                  title="Error"
                  content={errorMessage}
                  open={errorSB}
                  onClose={() => setErrorSB(false)}
                  close={() => setErrorSB(false)}
                  bgWhite
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {renderSuccessSB}
      {renderErrorSB}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {"Are you sure you want to delete this hotel?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            This action cannot be undone. Please confirm if you want to proceed
            with the deletion.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteHotel} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="bottom-right" />
    </DashboardLayout>
  );
};

export default EditItineraryHotel;
