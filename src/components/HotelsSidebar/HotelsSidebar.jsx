import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Checkbox,
  Typography,
  Box,
  Divider,
  Paper,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";


const HotelsSidebar = ({
  open,
  onClose,
  hotels,
  onSelectionChange,
  selectedHotel,
  selectedRoom,
  selectedMeals,
  packageId,
}) => {
  const [currentHotel, setCurrentHotel] = useState(selectedHotel || null);
  const [currentRoom, setCurrentRoom] = useState(selectedRoom || null);
  const [currentMeals, setCurrentMeals] = useState({
    selectedMeals: [],
    meal_prices: {}
  });
  const [packageData, setPackageData] = useState(null);
 

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const storedId = localStorage.getItem("packageId") 
        const response = await fetch(
          `https://start-your-tour-api.onrender.com/package/getPackageData?package_id=${storedId}`
        );
        

        if (!response.ok) {
          throw new Error("Failed to fetch package data");
        }

        const data = await response.json();
        setPackageData(data);
        setError(null);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchPackageData();
  }, [packageId]);

  useEffect(() => {
    // Set initial state when sidebar opens
    if (selectedHotel) {
      setCurrentHotel(selectedHotel);
    }
    if (selectedRoom) {
      setCurrentRoom(selectedRoom);
    }
    if (selectedMeals) {
      setCurrentMeals({
        selectedMeals: selectedMeals.selectedMeals || [],
        meal_prices: selectedMeals.meal_prices || {}
      });
    }
  }, [selectedHotel, selectedRoom, selectedMeals]);

  // Add this useEffect to handle meals initialization when sidebar opens
  useEffect(() => {
    if (open && selectedMeals) {
      // Convert the selectedMeals object to array of selected meal types
      const selectedMealTypes = [];
      const mealPrices = {};
      
      // Check for each meal type
      if (selectedMeals.breakfast) {
        selectedMealTypes.push('breakfast');
        mealPrices.breakfast = selectedMeals.breakfast_price;
      }
      if (selectedMeals.lunch) {
        selectedMealTypes.push('lunch');
        mealPrices.lunch = selectedMeals.lunch_price;
      }
      if (selectedMeals.dinner) {
        selectedMealTypes.push('dinner');
        mealPrices.dinner = selectedMeals.dinner_price;
      }

      setCurrentMeals({
        selectedMeals: selectedMealTypes,
        meal_prices: mealPrices
      });
    }
  }, [open, selectedMeals]);

  const validateSelectionForSubmit = () => {
    if (!currentRoom) {
      toast.error("Please select a room for this hotel", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return false;
    }

    return true;
  };

  const handleHotelSelect = (hotelId) => {
    const hotel = hotels.find((h) => h._id === hotelId);
    setCurrentHotel(hotel);
    setCurrentRoom(null);
    setCurrentMeals({
      selectedMeals: [],
      meal_prices: {}
    });
  };

  const handleRoomSelect = (roomId) => {
    const room = currentHotel?.rooms.find((r) => r._id === roomId);
    setCurrentRoom(room);
  };

  const handleMealSelect = (meal) => {
    
    // Check if meal is required in package
    const isRequired = packageData?.data?.[0]?.meal_required?.includes(
      meal.charAt(0).toUpperCase() + meal.slice(1)
    );

    // If meal is required in package, don't allow unselection
    if (isRequired) {
      return;
    }

    const newSelectedMeals = [...currentMeals.selectedMeals];
    const newMealPrices = { ...currentMeals.meal_prices };

    const mealIndex = newSelectedMeals.indexOf(meal);
    
    if (mealIndex === -1) {
      // Add meal if not selected
      newSelectedMeals.push(meal);
      newMealPrices[meal] = currentHotel[`${meal}_price`];
    } else {
      // Remove meal if already selected
      newSelectedMeals.splice(mealIndex, 1);
      delete newMealPrices[meal];
    }

    const updatedMeals = {
      selectedMeals: newSelectedMeals,
      meal_prices: newMealPrices
    };

    setCurrentMeals(updatedMeals);
  };

  // Initial state setup with package required meals
  useEffect(() => {
    if (packageData?.data?.[0]?.meal_required) {
      const requiredMeals = packageData.data[0].meal_required.map(meal => 
        meal.toLowerCase()
      );
      
      const mealPrices = {};
      requiredMeals.forEach(meal => {
        if (currentHotel) {
          mealPrices[meal] = currentHotel[`${meal}_price`];
        }
      });

      setCurrentMeals(prev => ({
        selectedMeals: [...new Set([...prev.selectedMeals, ...requiredMeals])],
        meal_prices: { ...prev.meal_prices, ...mealPrices }
      }));
    }
  }, [packageData, currentHotel]);

  const handleSubmit = () => {
    if (validateSelectionForSubmit()) {
      onSelectionChange({
        hotel: currentHotel,
        room: currentRoom,
        meals: currentMeals,
      });
      onClose();
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: "90vw",
            overflowX: "hidden", // Prevent horizontal scroll
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            p: 3,
            overflowY: "auto", // Enable vertical scroll
            overflowX: "hidden", // Hide horizontal scroll
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Select Itinerary Hotel
          </Typography>
          <RadioGroup
            value={currentHotel?._id || ""}
            onChange={(e) => handleHotelSelect(e.target.value)}
          >
            <List>  
              {hotels &&
                [...hotels]?.reverse()?.map((hotel) => (
                  <Paper
                    key={hotel._id}
                    elevation={3}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor:
                        currentHotel?._id === hotel._id ? "#E3F2FD" : "white",
                      border:
                        currentHotel?._id === hotel._id
                          ? "1px solid #1976D2"
                          : "none",
                      transition: "all 0.2s ease",
                      "& .MuiTypography-subtitle1": {
                        color:
                          currentHotel?._id === hotel._id
                            ? "#1976D2"
                            : "inherit",
                      },
                    }}
                  >
                    <ListItem>
                      <FormControlLabel
                        value={hotel._id}
                        control={
                          <Radio
                            sx={{
                              color:
                                currentHotel?._id === hotel._id
                                  ? "#1976D2"
                                  : "inherit",
                              "&.Mui-checked": {
                                color: "#1976D2",
                              },
                            }}
                          />
                        }
                        label={
                          <ListItemText
                            primary={
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: "bold",
                                  transition: "color 0.2s ease",
                                }}
                              >
                                {hotel.hotel_name}
                              </Typography>
                            }
                            secondary={`${hotel.hotel_type}, ${hotel.hotel_city}, ${hotel.hotel_state}`}
                          />
                        }
                      />
                    </ListItem>

                    <Divider />
                    <Typography
                      variant="subtitle2"
                      sx={{ mt: 2, mb: 1, fontWeight: "bold" }}
                    >
                      Rooms
                    </Typography>
                    <RadioGroup
                      value={currentRoom?._id || ""}
                      onChange={(e) => handleRoomSelect(e.target.value)}
                    >
                      {hotel?.rooms?.map((room) => (
                        <ListItem key={room._id}>
                          <FormControlLabel
                            value={room._id}
                            control={
                              <Radio
                                disabled={currentHotel?._id !== hotel._id}
                              />
                            }
                            label={
                              <ListItemText
                                primary={`${room.room_type} - ₹${room.room_type_price}`}
                              />
                            }
                          />
                        </ListItem>
                      ))}
                    </RadioGroup>

                    {currentHotel?._id === hotel._id && (
                      <>
                        <Divider />
                        <Typography
                          variant="subtitle2"
                          sx={{ mt: 2, mb: 1, fontWeight: "bold" }}
                        >
                          Meals
                        </Typography>
                        <List>
                          {hotel.breakfast && (
                            <ListItem>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    disabled={currentHotel?._id !== hotel._id}
                                    checked={
                                      currentMeals.selectedMeals.includes("breakfast") || 
                                      packageData?.data?.[0]?.meal_required?.includes("Breakfast")
                                    }
                                    onChange={() => handleMealSelect("breakfast")}
                                  />
                                }
                                label={`Breakfast - ₹${hotel.breakfast_price}`}
                              />
                            </ListItem>
                          )}

                          {hotel.lunch && (
                            <ListItem>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    disabled={currentHotel?._id !== hotel._id}
                                    checked={
                                      currentMeals.selectedMeals.includes("lunch") || 
                                      packageData?.data?.[0]?.meal_required?.includes("Lunch")
                                    }
                                    onChange={() => handleMealSelect("lunch")}
                                  />
                                }
                                label={`Lunch - ₹${hotel.lunch_price}`}
                              />
                            </ListItem>
                          )}

                          {hotel.dinner && (
                            <ListItem>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    disabled={currentHotel?._id !== hotel._id}
                                    checked={
                                      currentMeals.selectedMeals.includes("dinner") || 
                                      packageData?.data?.[0]?.meal_required?.includes("Dinner")
                                    }
                                    onChange={() => handleMealSelect("dinner")}
                                  />
                                }
                                label={`Dinner - ₹${hotel.dinner_price}`}
                              />
                            </ListItem>
                          )}
                        </List>
                      </>
                    )}

                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={
                          !currentHotel || currentHotel._id !== hotel._id
                        }
                        onClick={handleSubmit}
                        sx={{
                          color: "#ffffff !important",
                          fontWeight: 500,
                          backgroundColor:
                            currentHotel?._id === hotel._id
                              ? "#1976D2"
                              : "rgba(0, 0, 0, 0.12)",
                          "&:hover": {
                            backgroundColor:
                              currentHotel?._id === hotel._id
                                ? "#1565C0"
                                : "rgba(0, 0, 0, 0.12)",
                          },
                          "&.Mui-disabled": {
                            backgroundColor: "rgba(0, 0, 0, 0.12)",
                            color: "rgba(255, 255, 255, 0.7) !important",
                          },
                        }}
                      >
                        {currentHotel?._id === hotel._id
                          ? "Add Selected Hotel"
                          : "Select This Hotel"}
                      </Button>
                    </Box>
                  </Paper>
                ))}
            </List>
          </RadioGroup>
        </Box>
      </Drawer>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default HotelsSidebar;
