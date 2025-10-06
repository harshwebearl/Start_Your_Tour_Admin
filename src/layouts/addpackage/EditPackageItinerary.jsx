import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import HotelsSidebar from "components/HotelsSidebar/HotelsSidebar";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  Modal,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import AddIcon from "@mui/icons-material/Add"; // Add icon for the + button
import { BASE_URL } from "BASE_URL";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

const UpdateItinerary = () => {
  const [packageData, setPackageData] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Store File object
  const [title, setTitle] = useState("");
  const [hotelName, setHotelName] = useState("");

  const [description, setDescription] = useState("");
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [temp, setTemp] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(""); // State for selected hotel ID
  const [selectedHotelName, setSelectedHotelName] = useState("");
  const navigate = useNavigate();
  const [days, setDays] = useState(null);

  const { package_id, itinerary_id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  console.log("HEHE",selectedHotel)
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState({});
  console.log("selectedMeals",selectedMeals)
  const [hotels, setHotels] = useState([]);

  const hotelsForItinerary = async () => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(
      `${BASE_URL}api/hotel_itienrary/displayAgencyById`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    setTemp(data.data);
    setHotels(data.data); // Make sure to set both temp and hotels
  };

  const handleSelectionChange = (selection) => {
    setSelectedHotel(selection.hotel);
    setSelectedRoom(selection.room);
    
    // Update this part to properly handle meals
    setSelectedMeals({
      breakfast: selection.meals.selectedMeals.includes('breakfast'),
      lunch: selection.meals.selectedMeals.includes('lunch'),
      dinner: selection.meals.selectedMeals.includes('dinner'),
      breakfast_price: selection.meals.meal_prices.breakfast || 0,
      lunch_price: selection.meals.meal_prices.lunch || 0,
      dinner_price: selection.meals.meal_prices.dinner || 0
    });

    // Only display hotel name
    const hotelName = selection.hotel?.hotel_name || "";
    setSelectedHotelName(hotelName);
    setSidebarOpen(false);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  const packageDetail = async () => {
    const token = localStorage.getItem("sytAdmin");

    const res = await fetch(
      `${BASE_URL}package/getPackageData?package_id=${package_id}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    setPackageData(data?.data?.[0]);
  };

  useEffect(() => {
    if (package_id !== "") {
      packageDetail();
    }
  }, [package_id]);

  useEffect(() => {
    // Fetch hotel data on component mount
    hotelsForItinerary();
  }, []);

  // Update the getItineraryDetails function
  const getItineraryDetails = async () => {
    const token = localStorage.getItem("sytAdmin");

    try {
      const res = await fetch(`${BASE_URL}itinerary/byid?_id=${itinerary_id}`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        const itinerary = data?.data?.[0];
        const hotelDetails = itinerary?.hotel_itienrary?.[0];

        // Set initial values
        setTitle(itinerary.title);
        setDays(itinerary.day);
        setDescription(itinerary.activity);
        setSelectedHotel(hotelDetails); // Set selected hotel
        setSelectedHotelId(itinerary.hotel_itienrary_id);
        setSelectedHotelName(hotelDetails?.hotel_name);
        setImage(itinerary.photo);

        // Set selected room
        if (hotelDetails?.selected_rooms?.[0]) {
          const selected = hotelDetails.selected_rooms[0];
          setSelectedRoom({
            _id: selected._id,
            room_type: selected.room_type,
            room_type_price: selected.room_type_price,
          });
        }

        // Set selected meals
        setSelectedMeals({
          breakfast: itinerary.breakfast || false,
          lunch: itinerary.lunch || false,
          dinner: itinerary.dinner || false,
          breakfast_price: itinerary.breakfast_price || 0,
          lunch_price: itinerary.lunch_price || 0,
          dinner_price: itinerary.dinner_price || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching itinerary:", error);
    }
  };

  useEffect(() => {
    if (itinerary_id) {
      getItineraryDetails();
    }
  }, [itinerary_id]);

  const handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]); // Store the File object
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleRadioChange = (event) => {
    const selectedId = event.target.value;
    const selectedHotel = temp.find((hotel) => hotel._id === selectedId);
    setSelectedHotelId(selectedId);
    setSelectedHotelName(selectedHotel ? selectedHotel.hotel_name : "");
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if either a new hotel is selected or we have an existing hotel ID
      if (!selectedHotel?._id && !selectedHotelId) {
        toast.error("Please select a hotel", {
          position: "bottom-right",
          autoClose: 3000,
        });
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("sytAdmin");
      const formData = new FormData();

      // Add required fields
      formData.append("package_id", package_id);
      formData.append("title", title);
      formData.append("activity", description);

      // Use either selected hotel or existing hotel ID
      formData.append(
        "hotel_itienrary_id",
        selectedHotel?._id || selectedHotelId
      );

      // Add room details with validation
      if (selectedRoom?._id) {
        formData.append("room_id", selectedRoom._id);
      }

      // Add meals with proper validation
      formData.append("breakfast", selectedMeals?.breakfast || false);
      formData.append("lunch", selectedMeals?.lunch || false);
      formData.append("dinner", selectedMeals?.dinner || false);
      formData.append("breakfast_price", selectedMeals?.breakfast ? (selectedMeals.breakfast_price || 0) : 0);
      formData.append("lunch_price", selectedMeals?.lunch ? (selectedMeals.lunch_price || 0) : 0);
      formData.append("dinner_price", selectedMeals?.dinner ? (selectedMeals.dinner_price || 0) : 0);

      // Add image if selected
      if (selectedImage) {
        formData.append("photo", selectedImage);
      }

      const response = await fetch(`${BASE_URL}itinerary?_id=${itinerary_id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Itinerary updated successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        toast.error(result.message || "Update failed!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating itinerary:", error);
      toast.error("Error updating itinerary", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box p={3} sx={{ backgroundColor: "white", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Add Hotel Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 120))} // Limit input to 120 characters
                  helperText={`${120 - title.length} characters remaining`}
                  FormHelperTextProps={{
                    style: { color: title.length === 120 ? "red" : "black" }, // Change color to red when limit is reached
                  }}
                  inputProps={{
                    maxLength: 120, // Enforce max length at the input level
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  value={days}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <span style={{ fontWeight: "bold" }}>Day:</span>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12} container alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <TextField
                    fullWidth
                    value={selectedHotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    required
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span style={{ fontWeight: "bold" }}>
                            Hotel Name:
                          </span>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => setSidebarOpen(true)}
                    sx={{ ml: 2 }}
                  >
                    <AddIcon />
                  </IconButton>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={description.replace(/<[^>]+>/g, "")}
                  // Remove HTML tags
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={1} md={10}>
                {/* Selected Room Display */}
                {selectedRoom && (
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="#344767"
                      style={{ fontSize: "15px" }}
                    >
                      Room
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        bgcolor: "white",
                        p: 1,
                        borderRadius: 1,
                        mt: 1,
                      }}
                    >
                      <Typography color="#7b809a" style={{ fontSize: "15px" }}>
                        {selectedRoom.room_type}
                      </Typography>
                      <Typography color="#7b809a" style={{ fontSize: "15px" }}>
                        ₹{selectedRoom.room_type_price}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {/* Selected Meals Display */}
                {Object.entries(selectedMeals).some(([key, value]) => 
                  ['breakfast', 'lunch', 'dinner'].includes(key) && value
                ) && (
                  <Box sx={{ p: 2, borderRadius: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="#344767"
                      style={{ fontSize: "15px" }}
                    >
                      Meals
                    </Typography>
                    {selectedMeals.breakfast && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          bgcolor: "white",
                          p: 1,
                          borderRadius: 1,
                          mt: 1,
                        }}
                      >
                        <Typography color="#7b809a" style={{ fontSize: "15px" }}>
                          Breakfast
                        </Typography>
                        <Typography color="#7b809a" style={{ fontSize: "15px" }}>
                          ₹{selectedMeals.breakfast_price || 0}
                        </Typography>
                      </Box>
                    )}
                    {selectedMeals.lunch && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          bgcolor: "white",
                          p: 1,
                          borderRadius: 1,
                          mt: 1,
                        }}
                      >
                        <Typography color="#7b809a" style={{ fontSize: "15px" }}>
                          Lunch
                        </Typography>
                        <Typography color="#7b809a" style={{ fontSize: "15px" }}>
                          ₹{selectedMeals.lunch_price || 0}
                        </Typography>
                      </Box>
                    )}
                    {selectedMeals.dinner && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          bgcolor: "white",
                          p: 1,
                          borderRadius: 1,
                          mt: 1,
                        }}
                      >
                        <Typography color="#7b809a" style={{ fontSize: "15px" }}>
                          Dinner
                        </Typography>
                        <Typography color="#7b809a" style={{ fontSize: "15px" }}>
                          ₹{selectedMeals.dinner_price || 0}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>
              <Box mt={3} ml={3}>
                {loading ? (
                  <MDButton
                    variant="gradient"
                    color="info"
                    style={{ padding: "0px 50px" }}
                    type="submit"
                  >
                    Proccessing...
                  </MDButton>
                ) : (
                  <Button
                    onClick={handleSubmit2}
                    variant="contained"
                    color="primary"
                    style={{ color: "white" }}
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                component="label"
                style={{ color: "white" }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>

              {image && (
                <Card
                  sx={{ maxWidth: 300, mt: 2, pb: 2, position: "relative" }}
                >
                  <IconButton
                    onClick={() => {
                      setImage(null);
                      setSelectedImage(null);
                    }}
                    sx={{
                      position: "absolute",
                      right: 5,
                      top: 5,
                    }}
                  >
                    <DeleteIcon sx={{ color: "red", margin: "5px 5px 0 0" }} />
                  </IconButton>
                  <CardMedia
                    component="img"
                    height="140"
                    image={image}
                    alt="Selected Image"
                  />
                </Card>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={{ ...modalStyle }}>
            <Typography id="modal-title" variant="h6" component="h2">
              Select Hotel
            </Typography>
            <RadioGroup
              aria-labelledby="modal-title"
              name="hotel-radio-group"
              value={selectedHotelId}
              onChange={handleRadioChange}
            >
              {temp.map((hotel) => (
                <FormControlLabel
                  key={hotel._id}
                  value={hotel._id}
                  control={<Radio />}
                  label={hotel.hotel_name}
                />
              ))}
            </RadioGroup>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              style={{ color: "white" }}
              sx={{
                mt: 2,
                backgroundColor: "#1e40af",
                "&:hover": {
                  backgroundColor: "#1e3a8a", // Tailwind's blue-700
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
      <HotelsSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        hotels={hotels}
        onSelectionChange={handleSelectionChange}
        selectedHotel={selectedHotel}
        selectedRoom={selectedRoom}
        selectedMeals={{
          breakfast: selectedMeals.breakfast,
          lunch: selectedMeals.lunch,
          dinner: selectedMeals.dinner,
          breakfast_price: selectedMeals.breakfast_price,
          lunch_price: selectedMeals.lunch_price,
          dinner_price: selectedMeals.dinner_price
        }}
      />
      <ToastContainer />
    </DashboardLayout>
  );
};

// Style for modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default UpdateItinerary;
