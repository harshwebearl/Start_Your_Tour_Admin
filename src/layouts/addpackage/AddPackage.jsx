import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { BASE_URL } from "BASE_URL";
import countries from "../../CountryStateCity.json";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import {
  Autocomplete,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { CardContent, CardMedia } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function getTomorrowDate() {
  const today = new Date();
  today.setDate(today.getDate() + 1); // Add 1 to the current date to get tomorrow
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const rightDate = (dateString) => {
  const [year, month, day] = dateString?.split("-");
  return `${day}-${month}-${year}`;
};

const sortDatesByMonth = (dates) => {
  if (!dates) return [];

  return [...dates].sort((a, b) => {
    const dateA = new Date(a.price_start_date);
    const dateB = new Date(b.price_start_date);
    return dateA - dateB;
  });
};

// import
const AddCustomeUser = () => {
  const { package_id } = useParams();

  const [priceDetails, setPriceDetails] = useState([]);

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const navigate = useNavigate();
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfully"
      content={successMessage}
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
      title="Filled Error"
      content={errorMessage}
      dateTime="1 sec ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Add a state to track if we're in update mode
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // Update useEffect to set update mode when package_id exists
  useEffect(() => {
    if (package_id) {
      setIsUpdateMode(true);
      packageDetail();
    }
  }, [package_id]);

  // syt start destination

  const [packageData, setPackageData] = useState("");
  console.log("packageData", packageData);
  const [destination, setDestination] = useState([]);
  const [placetovisit, setPlacetovisit] = useState([]);
  const [Destcat, setDestcat] = useState([]);
  const mealOptions = [
    { _id: "1", meal: "Breakfast" },
    { _id: "2", meal: "Lunch" },
    { _id: "3", meal: "Dinner" },
  ];
  const hotelTypeOptions = [
    { type: "5" },
    { type: "4" },
    { type: "3" },
    { type: "2" },
    { type: "1" },
  ];
  const days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];

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
  };

  const places = async () => {
    const token = localStorage.getItem("sytAdmin");

    const res = await fetch(`${BASE_URL}placetovisit`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setPlacetovisit(data.data);
  };

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}destinationcategory`, {
          headers: {
            Authorization: token,
          },
        });

        setDestcat(response.data.data);
      } catch (error) {}
    };
    fetchCategoryList();
  }, []);

  useEffect(() => {
    Dest();
  }, []);

  useEffect(() => {
    places();
  }, []);

  const [maxItineraries, setMaxItineraries] = useState(null);

  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  const [selectplacetovisit, setSelectplacetovisit] = useState("");
  const [packageName, setPackageName] = useState("");
  const [pricePerPersonAdult, setPricePerPersonAdult] = useState("");
  const [mealValue, setMealValue] = React.useState([]);
  const [destCatValue, setDestCatValue] = React.useState([]);
  const [selectedDays, setSelectedDays] = useState(0);
  const [selectedNights, setSelectedNights] = useState(0);
  const [selectedMealType, setSelectedMealType] = useState("");
  const [selectedTravelBy, setSelectedTravelBy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);
  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState([]);
  const [serviceInputEx, setServiceInputEx] = useState("");
  const [servicesEx, setServicesEx] = useState([]);
  const [moreDetails, setMoreDetails] = useState("");
  const [status, setStatus] = useState(false);
  const [sightseeing, setSightseeing] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [roomSharing, setRoomSharing] = useState(0);
  const [packageType, setPackageType] = useState("");
  const [selectedHotelTypes, setSelectedHotelTypes] = useState([]);

  const handleSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedDestinationId(selectedId);
  };

  const handleSelectPlace = (event) => {
    const selectedId = event.target.value;
    setSelectplacetovisit(selectedId);
  };

  const handleTravelSelect = (e) => {
    setSelectedTravelBy(e.target.value);
  };

  const handleMealTypeSelect = (e) => {
    setSelectedMealType(e.target.value);
  };

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);

    // Enable the End Date field after selecting a Start Date
    setIsEndDateDisabled(false);

    // Reset End Date if it's earlier than the new Start Date
    if (endDate && selectedStartDate > endDate) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    setEndDate(selectedEndDate);
  };

  const handleAddService = () => {
    if (serviceInput?.trim()) {
      // Ensure services is an array before spreading
      const updatedServices = Array.isArray(services)
        ? [...services, serviceInput.trim()]
        : [serviceInput.trim()];
      setServices(updatedServices);
      setServiceInput("");
    }
  };

  const handleDeleteService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleAddServiceEx = () => {
    if (serviceInputEx.trim()) {
      // Ensure servicesEx is an array before spreading
      const updatedServicesEx = Array.isArray(servicesEx)
        ? [...servicesEx, serviceInputEx.trim()]
        : [serviceInputEx.trim()];
      setServicesEx(updatedServicesEx);
      setServiceInputEx(""); // Clear the input field
    }
  };

  const handleDeleteServiceEx = (index) => {
    const updatedServices = servicesEx.filter((_, i) => i !== index);
    setServicesEx(updatedServices);
  };

  const handleDaysSelect = (e) => {
    setSelectedDays(e.target.value);
  };

  const handleNightsSelect = (e) => {
    setSelectedNights(e.target.value);
  };

  const [itineriesShow, setItineriesShow] = useState(false);

  const handleInsertPackage = async (e) => {
    e.preventDefault();

    // Destination validation
    if (!selectedDestinationId) {
      toast.error("Please select a destination", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Place to Visit validation
    if (!selectplacetovisit) {
      toast.error("Please select a place to visit", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Package Name validation
    if (!packageName || packageName.trim() === "") {
      toast.error("Please enter a package name", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Package Type validation
    if (!packageType) {
      toast.error("Please select a package type", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Hotel Type validation
    if (!selectedHotelTypes || selectedHotelTypes.length === 0) {
      toast.error("Please select at least one hotel type", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Room Sharing validation
    if (!roomSharing) {
      toast.error("Please select room sharing option", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Meal Required validation
    if (!mealValue || mealValue.length === 0) {
      toast.error("Please select at least one meal requirement", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Destination Category validation
    if (!destCatValue || destCatValue.length === 0) {
      toast.error("Please select at least one destination category", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Meal Type validation
    if (!selectedMealType) {
      toast.error("Please select a meal type", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Travel By validation
    if (!selectedTravelBy) {
      toast.error("Please select travel mode", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Total Days validation
    if (Number(selectedDays) === 0) {
      toast.error("Please select total number of days", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Total Nights validation
    if (Number(selectedNights) === 0) {
      toast.error("Please select total number of nights", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Include Services validation
    if (!services || services.length === 0) {
      toast.error("Please add at least one included service", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Exclude Services validation
    if (!servicesEx || servicesEx.length === 0) {
      toast.error("Please add at least one excluded service", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // More Details validation
    if (!moreDetails || moreDetails.trim() === "") {
      toast.error("Please enter more details about the package", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Sightseeing validation
    if (!sightseeing) {
      toast.error("Please select sightseeing option", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Price Details validation
    if (!priceDetails || priceDetails.length === 0) {
      toast.error("Please add at least one price detail", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // If all validations pass, proceed with the API call
    setLoading(true);
    const token = localStorage.getItem("sytAdmin");

    try {
      let response;
      const payload = {
        destination: selectedDestinationId,
        place_to_visit_id: selectplacetovisit,
        name: packageName,
        package_type: packageType,
        hotel_type: selectedHotelTypes,
        room_sharing: roomSharing,
        meal_required: mealValue,
        destination_category_id: destCatValue,
        total_days: selectedDays,
        total_nights: selectedNights,
        meal_type: selectedMealType,
        travel_by: selectedTravelBy,
        include_service: services,
        exclude_service: servicesEx,
        more_details: moreDetails,
        sightseeing: sightseeing,
        status: status,
        price_and_date: priceDetails,
      };

      if (isUpdateMode) {
        // Update existing package
        response = await axios.put(
          `${BASE_URL}package/${package_id}`,
          payload,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        setSuccessMessage("Package Updated Successfully");
      } else {
        // Create new package
        response = await axios.post(`${BASE_URL}package`, payload, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        setSuccessMessage("Package Added Successfully");
      }

      if (response.status === 200) {
        setItineriesShow(true);
        setLoading(false);
        openSuccessSB();
        localStorage.setItem("packageId", response?.data?.data?._id);
        if (!isUpdateMode) {
          // Only navigate for new package creation
          setTimeout(() => {
            navigate(`/insert-package/${response?.data?.data?._id}`);
          }, 2000);
        }
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response?.data?.message || "An error occurred");
      openErrorSB();
    }
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleAddItinerary = () => {
    const maxItineraries = getMaxItineraries();
    const currentItineraries = packageData?.Itinaries?.length || 0;

    // Check if we can add more itineraries
    if (currentItineraries >= maxItineraries) {
      setErrorMessage(`Cannot add more than ${maxItineraries} itineraries`);
      openErrorSB();
      return;
    }

    // Navigate to add itinerary page
    if (package_id) {
      navigate(`/insert-package-itinerary/${package_id}`);
    }
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
    console.log("data", data.data);
    const allData = data?.data?.[0];

    const idsArray = allData?.destination_category_id?.map((item) => item._id);

    if (Number(allData?.total_days) > Number(allData?.total_nights)) {
      setMaxItineraries(Number(allData?.total_days));
    } else {
      setMaxItineraries(Number(allData?.total_nights));
    }

    setPackageData(allData);
    setSelectplacetovisit(allData?.place_to_visit_id);
    setPackageName(allData?.name);
    setPackageType(allData?.package_type);
    setRoomSharing(allData?.room_sharing);
    setSelectedHotelTypes(allData?.hotel_type);
    setMealValue(allData?.meal_required);
    setDestCatValue(idsArray);
    setSelectedDays(allData?.total_days);
    setSelectedNights(allData?.total_nights);
    setSelectedMealType(allData?.meal_type);
    setSelectedTravelBy(allData?.travel_by);
    setStartDate(allData?.start_date?.slice(0, 10));
    setEndDate(allData?.end_date?.slice(0, 10));
    setSightseeing(allData?.sightseeing);
    setStatus(allData?.status);
    setMoreDetails(allData?.more_details);
    setPriceDetails(allData?.price_and_date || []);

    // Extract values from include_service array without the include_services_value key
    const services = allData?.include_service?.map(
      (service) => service.include_services_value
    );
    setServices(services || []);

    setSelectedDestinationId(allData?.destination?.[0]?._id);

    // Extract values from exclude_service array without the exclude_services_value key
    const servicesEx = allData?.exclude_service?.map(
      (service) => service.exclude_services_value
    );
    setServicesEx(servicesEx || []);
  };

  useEffect(() => {
    if (package_id !== "") {
      packageDetail();
    }
  }, [package_id]);

  const [openModal, setOpenModal] = useState(false);
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [pricePerPersonForChild, setPricePerPersonForChild] = useState("");
  const [pricePerPersonForInfant, setPricePerPersonForInfant] = useState("");
  const [priceStartDate, setPriceStartDate] = useState("");
  const [priceEndDate, setPriceEndDate] = useState("");

  const handleAddPriceDetail = () => {
    // Validate price inputs exist
    if (
      !pricePerPerson ||
      !pricePerPersonForChild ||
      !pricePerPersonForInfant
    ) {
      setErrorMessage("Please enter all price details");
      openErrorSB();
      return;
    }

    // Validate price hierarchy
    const adultPrice = Number(pricePerPerson);
    const childPrice = Number(pricePerPersonForChild);
    const infantPrice = Number(pricePerPersonForInfant);

    if (!(adultPrice > childPrice && childPrice > infantPrice)) {
      if (adultPrice <= childPrice) {
        setErrorMessage("Adult price should be greater than Children price.");
      } else if (childPrice <= infantPrice) {
        setErrorMessage("Children price should be greater than Infant price.");
      } else {
        setErrorMessage(
          "Ensure pricing decreases from Adult to Children to Infant."
        );
      }
      openErrorSB();
      return;
    }

    // Validate dates
    if (!priceStartDate || !priceEndDate) {
      setErrorMessage("Please select both start date and end date");
      openErrorSB();
      return;
    }

    // Check for date overlap
    const hasOverlap = priceDetails.some((detail) => {
      const existingStart = new Date(detail.price_start_date);
      const existingEnd = new Date(detail.price_end_date);
      const newStart = new Date(priceStartDate);
      const newEnd = new Date(priceEndDate);

      return (
        (newStart >= existingStart && newStart <= existingEnd) ||
        (newEnd >= existingStart && newEnd <= existingEnd) ||
        (existingStart >= newStart && existingStart <= newEnd)
      );
    });

    if (hasOverlap) {
      setErrorMessage("Selected dates overlap with existing dates");
      openErrorSB();
      return;
    }

    // Add new price detail if all validations pass
    const newDetail = {
      price_per_person: adultPrice,
      child_price: childPrice,
      infant_price: infantPrice,
      price_start_date: priceStartDate,
      price_end_date: priceEndDate,
    };

    setPriceDetails((prev) => sortDatesByMonth([...prev, newDetail]));

    // Reset form
    setPricePerPerson("");
    setPricePerPersonForChild("");
    setPricePerPersonForInfant("");
    setPriceStartDate("");
    setPriceEndDate("");
    setOpenModal(false);
  };

  const handleDelete = (index) => {
    const updatedDetails = [...priceDetails];
    updatedDetails.splice(index, 1);
    setPriceDetails(updatedDetails);
  };

  const [margin, setMargin] = useState([]);

  const fetchMargin = async () => {
    const token = localStorage.getItem("sytAdmin");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}api/package_profit_margin/all`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch margins, status:", res.status);
        return;
      }

      const data = await res.json();

      // Ensure destination is defined and selectedDestinationId is valid
      if (destination && selectedDestinationId) {
        const destinationName = destination.find(
          (e) => e?._id === selectedDestinationId
        );

        // Ensure destinationName is found
        if (destinationName) {
          const findMarginData = data?.data?.find(
            (ele) =>
              ele?.state_name?.toLowerCase() ===
              destinationName?.destination_name?.toLowerCase()
          );
          setMargin(findMarginData?.month_and_margin_user || []);
        } else {
          console.warn("No matching destination found.");
          setMargin([]);
        }
      } else {
        console.warn("Destination data or selectedDestinationId is missing.");
        setMargin([]);
      }
    } catch (error) {
      console.error("An error occurred while fetching margins:", error);
    }
  };

  useEffect(() => {
    fetchMargin();
  }, [selectedDestinationId]);

  // Add this state for tracking expanded state
  const [isExpanded, setIsExpanded] = useState(false);

  // Add this helper function
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return isExpanded ? text : text.substr(0, maxLength) + "...";
  };

  // First add the state for expanded items
  const [expandedItems, setExpandedItems] = useState({});

  // Add the toggle function
  const toggleReadMore = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const updateItinerary = (itineraryId) => {
    if (package_id) {
      navigate(`/update-package-itinerary/${package_id}/${itineraryId}`, {
        state: {
          maxDays: Math.max(Number(selectedDays), Number(selectedNights)),
          currentDays: packageData?.Itinaries?.length || 0,
        },
      });
    }
  };

  // Add this function to determine max itineraries
  const getMaxItineraries = () => {
    const daysNum = Number(selectedDays);
    const nightsNum = Number(selectedNights);
    return Math.max(daysNum, nightsNum);
  };

  // Add state to track expanded services
  const [expandedServices, setExpandedServices] = useState({});

  // Function to toggle Read More/Read Less
  const toggleServiceExpansion = (index) => {
    setExpandedServices((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the expanded state for the specific service
    }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Package Details" value="1" />
              <Tab label="Itinerary" value="2" />
            </TabList>
          </Box>

          <TabPanel value="1">
            <MDBox pt={2} pb={3}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Card>
                    <MDBox py={3} px={2}>
                      {/* user detail  */}

                      <Grid container pt={4} px={3}>
                        <Grid item xs={12} md={6} xl={6} px={2}>
                          {/* Destination */}
                          <MDBox mb={4}>
                            {/* <FormControl fullWidth>
                                                            <InputLabel id="destination-select-label">Destination</InputLabel>
                                                            <Select
                                                                labelId="destination-select-label"
                                                                id="destination-select"
                                                                value={selectedDestinationId}
                                                                onChange={handleSelect}
                                                                label="Destination"
                                                                style={{ backgroundColor: "transparent" }}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                {destination.map((e) => (
                                                                    <MenuItem key={e._id} value={e._id}>{e.destination_name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl> */}

                            <FormControl fullWidth variant="outlined">
                              <h6
                                className="mb-1"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Destination
                              </h6>
                              <Select
                                labelId="destination-label"
                                id="destination-select"
                                name="status"
                                value={selectedDestinationId}
                                onChange={handleSelect}
                                label="Destination"
                                style={{
                                  color: "#7b809a",
                                  fontSize: "14px",
                                  borderRadius: "5px",
                                  height: "44px",
                                  padding: "0px 0px 4px 0px",
                                }}
                              >
                                <MenuItem value="">Destination</MenuItem>
                                {destination.map((e) => (
                                  <MenuItem key={e._id} value={e._id}>
                                    {e.destination_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </MDBox>

                          {/* Package Name */}
                          <MDBox
                            mb={4}
                            sx={{
                              "& input": {
                                padding: "16px 10px",
                                fontSize: "14px",
                              },
                            }}
                          >
                            <div>
                              <h6
                                className="mb-0"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Package Name
                              </h6>
                            </div>
                            <MDInput
                              type="text"
                              name="name"
                              value={packageName}
                              onChange={(e) => setPackageName(e.target.value)}
                              fullWidth
                            />
                          </MDBox>

                          {/* Hotel Type */}
                          <MDBox
                            mb={4}
                            sx={{ "& input": { fontSize: "14px" } }}
                          >
                            <div>
                              <h6
                                className="mb-0"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Hotel Type
                              </h6>
                            </div>
                            <Autocomplete
                              multiple
                              id="hotel-type"
                              freeSolo={false} // Prevent entering custom values
                              value={hotelTypeOptions.filter((option) =>
                                selectedHotelTypes?.includes(option?.type)
                              )}
                              onChange={(event, newValue) => {
                                const selectedType = newValue.map(
                                  (option) => option.type
                                );
                                setSelectedHotelTypes(selectedType);
                              }}
                              options={hotelTypeOptions}
                              getOptionLabel={(option) => option.type}
                              renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => {
                                  const { key, ...tagProps } = getTagProps({
                                    index,
                                  });
                                  return (
                                    <Chip
                                      key={option || index}
                                      label={option.type}
                                      {...tagProps}
                                    />
                                  );
                                })
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select"
                                  inputProps={{
                                    ...params.inputProps,
                                    readOnly: true, // Make input box non-editable
                                  }}
                                />
                              )}
                            />
                          </MDBox>

                          {/* Meal Required */}
                          <MDBox mb={4}>
                            <Autocomplete
                              multiple
                              id="meal-required"
                              value={mealOptions.filter((option) =>
                                mealValue?.includes(option.meal)
                              )}
                              onChange={(event, newValue) => {
                                const selectedMeals = newValue.map(
                                  (option) => option.meal
                                );
                                setMealValue(selectedMeals);
                              }}
                              options={mealOptions}
                              getOptionLabel={(option) => option.meal}
                              renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => {
                                  const { key, ...tagProps } = getTagProps({
                                    index,
                                  });
                                  return (
                                    <Chip
                                      key={option._id || index}
                                      label={option.meal}
                                      {...tagProps}
                                    />
                                  );
                                })
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Meal Required"
                                  placeholder="Select"
                                  inputProps={{
                                    ...params.inputProps,
                                    readOnly: true, // Make input box non-editable
                                  }}
                                />
                              )}
                            />
                          </MDBox>

                          {/* Meal Type */}
                          <MDBox mb={4}>
                            {/* <FormControl fullWidth>
                                                            <InputLabel id="meal-type-select-label">Meal Type</InputLabel>
                                                            <Select
                                                                labelId="meal-type-select-label"
                                                                id="meal-type-select"
                                                                value={selectedMealType}
                                                                onChange={handleMealTypeSelect}
                                                                label="Meal Type"
                                                                style={{ backgroundColor: "transparent" }}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                <MenuItem value="Any">Any</MenuItem>
                                                                <MenuItem value="Veg">Veg</MenuItem>
                                                                <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                                                            </Select>
                                                        </FormControl> */}
                            <div>
                              <h6
                                className="mb-1"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Meal Type
                              </h6>
                              <FormControl fullWidth variant="outlined">
                                <Select
                                  labelId="meal-type-label"
                                  id="meal-type-select"
                                  name="meal-type-select"
                                  value={selectedMealType}
                                  onChange={handleMealTypeSelect}
                                  label="Meal Type"
                                  style={{
                                    color: "#7b809a",
                                    background: "transparent",
                                    fontSize: "14px",
                                    borderRadius: "5px",
                                    height: "44px",
                                    padding: "0px 0px 4px 0px",
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value="Any">Any</MenuItem>
                                  <MenuItem value="Veg">Veg</MenuItem>
                                  <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </MDBox>

                          {/* Total Days */}
                          <MDBox mb={5}>
                            {/* <FormControl fullWidth>
                                                            <InputLabel id="days-select-label">Total Days</InputLabel>
                                                            <Select
                                                                labelId="days-select-label"
                                                                id="days-select"
                                                                value={selectedDays}
                                                                onChange={handleDaysSelect}
                                                                label="Total Days"
                                                                style={{ backgroundColor: "transparent" }}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                {days.map((e, i) => (
                                                                    <MenuItem key={i} value={e}>{e}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl> */}
                            <div>
                              <h6
                                className="mb-1"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Total Days
                              </h6>
                              <FormControl fullWidth variant="outlined">
                                <Select
                                  labelId="total-days-label"
                                  id="total-days-select"
                                  name="days-select"
                                  value={selectedDays}
                                  onChange={handleDaysSelect}
                                  style={{
                                    color: "#7b809a",
                                    background: "transparent",
                                    fontSize: "14px",
                                    height: "44px",
                                    padding: "0px 0px 4px 0px",
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  {days.map((e, i) => (
                                    <MenuItem key={i} value={e.toString()}>
                                      {e}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                          </MDBox>

                          {/* Start Date */}
                          {/* <MDBox mb={4}>
                                                        <TextField
                                                            label="Start Date"
                                                            type="date"
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            value={startDate}
                                                            onChange={handleStartDateChange}
                                                        />
                                                    </MDBox> */}

                          {/* Include Services */}
                          <MDBox
                            mb={3}
                            sx={{
                              "& input": {
                                padding: "16px 10px",
                                fontSize: "14px",
                              },
                            }}
                          >
                            <MDBox mb={2} display="flex" alignItems="center">
                              <TextField
                                label="Include Service"
                                type="text"
                                fullWidth
                                value={serviceInput}
                                onChange={(e) =>
                                  setServiceInput(e.target.value)
                                }
                              />
                              <IconButton
                                onClick={handleAddService}
                                color="primary"
                              >
                                <AddIcon />
                              </IconButton>
                            </MDBox>
                            <MDBox>
                              <List>
                                {services?.map((service, index) => (
                                  <ListItem
                                    key={index}
                                    secondaryAction={
                                      <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() =>
                                          handleDeleteService(index)
                                        }
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <>
                                          {expandedServices[index] ||
                                          service.length <= 250
                                            ? service // Show full text if expanded or less than 250 characters
                                            : `${service.substring(
                                                0,
                                                250
                                              )}...`}{" "}
                                          {/* Truncate text */}
                                          {service.length > 250 && (
                                            <Button
                                              onClick={() =>
                                                toggleServiceExpansion(index)
                                              }
                                              sx={{
                                                color: "#348eed",
                                                fontSize: "12px",
                                                marginLeft: "8px",
                                              }}
                                            >
                                              {expandedServices[index]
                                                ? "Read Less"
                                                : "Read More"}
                                            </Button>
                                          )}
                                        </>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </MDBox>
                          </MDBox>

                          {/* More Details */}
                          <MDBox mb={4}>
                            <Grid container>
                              <Grid item xs={12}>
                                <MDTypography variant="h4">
                                  More Details
                                </MDTypography>
                              </Grid>
                              <Grid item xs={12} mb={3}>
                                <TextField
                                  multiline
                                  rows={4}
                                  variant="outlined"
                                  fullWidth
                                  value={moreDetails}
                                  onChange={(e) =>
                                    setMoreDetails(e.target.value)
                                  }
                                  InputProps={{
                                    style: {
                                      color: "#7b809a",
                                      background: "transparent",
                                      borderRadius: "5px",
                                    },
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </MDBox>
                        </Grid>

                        <Grid item xs={12} md={6} xl={6} px={2}>
                          {/* Place to Visit */}
                          <MDBox mb={4}>
                            {/* <FormControl fullWidth>
                                                            <InputLabel id="place-to-visit-label">Place to Visit</InputLabel>
                                                            <Select
                                                                labelId="place-to-visit-label"
                                                                id="place-to-visit"
                                                                onChange={handleSelectPlace}
                                                                value={selectplacetovisit}
                                                                label="Place to Visit"
                                                                style={{ backgroundColor: "transparent" }}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                {placetovisit.filter(e => e.destination_id === selectedDestinationId).map((e) => (
                                                                    <MenuItem key={e._id} value={e._id}>{e.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl> */}
                            <div>
                              <h6
                                className="mb-1"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Place to Visit
                              </h6>
                              <FormControl fullWidth variant="outlined">
                                <Select
                                  labelId="place-to-visit-label"
                                  id="place-to-visit-select"
                                  name="place-to-visit"
                                  onChange={handleSelectPlace}
                                  value={selectplacetovisit}
                                  label="Place to Visit"
                                  style={{
                                    color: "#7b809a",
                                    background: "transparent",
                                    fontSize: "14px",
                                    borderRadius: "5px",
                                    height: "44px",
                                    padding: "0px 0px 4px 0px",
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  {placetovisit
                                    .filter(
                                      (e) =>
                                        e.destination_id ===
                                        selectedDestinationId
                                    )
                                    .map((e) => (
                                      <MenuItem key={e._id} value={e._id}>
                                        {e.name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            </div>
                          </MDBox>

                          {/* Package Type */}
                          <MDBox mb={4}>
                            {/* <FormControl fullWidth>
                                                            <InputLabel id="package-type-label">Package Type</InputLabel>
                                                            <Select
                                                                labelId="package-type-label"
                                                                id="package-type"
                                                                onChange={(e) => setPackageType(e.target.value)}
                                                                value={packageType}
                                                                label="Package Type"
                                                                style={{ backgroundColor: "transparent" }}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                <MenuItem value="Land Package">Land Package</MenuItem>
                                                            </Select>
                                                        </FormControl> */}

                            <div>
                              <h6
                                className="mb-1"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Package Type
                              </h6>
                              <FormControl fullWidth variant="outlined">
                                <Select
                                  labelId="package-type-label"
                                  id="package-type-select"
                                  name="package-type"
                                  onChange={(e) =>
                                    setPackageType(e.target.value)
                                  }
                                  value={packageType}
                                  label="Package Type"
                                  style={{
                                    color: "#7b809a",
                                    background: "transparent",
                                    fontSize: "14px",
                                    borderRadius: "5px",
                                    height: "44px",
                                    padding: "0px 0px 4px 0px",
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value="Land Package">
                                    Land Package
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </MDBox>

                          {/* Room Sharing */}
                          <MDBox mb={4}>
                            {/* <FormControl fullWidth>
                                                            <InputLabel id="room-sharing-label">Room Sharing</InputLabel>
                                                            <Select
                                                                labelId="room-sharing-label"
                                                                id="room-sharing"
                                                                value={roomSharing}
                                                                onChange={(e) => setRoomSharing(e.target.value)}
                                                                label="Room Sharing"
                                                                style={{ backgroundColor: "transparent" }}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                <MenuItem value="single sharing">Single Sharing</MenuItem>
                                                                <MenuItem value="double sharing">Double Sharing</MenuItem>
                                                                <MenuItem value="triple sharing">Triple Sharing</MenuItem>
                                                            </Select>
                                                        </FormControl> */}
                            <div>
                              <h6
                                className="mb-1"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Room Sharing
                              </h6>
                              <FormControl fullWidth variant="outlined">
                                <Select
                                  labelId="room-sharing-label"
                                  id="room-sharing-select"
                                  name="room-sharing"
                                  value={roomSharing}
                                  onChange={(e) =>
                                    setRoomSharing(e.target.value)
                                  }
                                  label="Room Sharing"
                                  style={{
                                    color: "#7b809a",
                                    background: "transparent",
                                    fontSize: "14px",
                                    borderRadius: "5px",
                                    height: "44px",
                                    padding: "0px 0px 4px 0px",
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value="single sharing">
                                    Single Sharing
                                  </MenuItem>
                                  <MenuItem value="double sharing">
                                    Double Sharing
                                  </MenuItem>
                                  <MenuItem value="triple sharing">
                                    Triple Sharing
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </MDBox>

                          {/* Destination Category */}
                          <MDBox
                            mb={4}
                            sx={{
                              "& input": {
                                height: "20px",
                                padding: "15px 10px",
                                fontSize: "14px",
                              },
                            }}
                          >
                            <Autocomplete
                              multiple
                              id="destination-category"
                              value={Destcat?.filter((option) =>
                                destCatValue?.includes(option._id)
                              )}
                              onChange={(event, newValue) => {
                                const selectedIds = newValue.map(
                                  (option) => option._id
                                );
                                setDestCatValue(selectedIds);
                              }}
                              options={Destcat}
                              getOptionLabel={(option) => option.category_name}
                              renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => {
                                  const { key, ...tagProps } = getTagProps({
                                    index,
                                  });
                                  return (
                                    <Chip
                                      key={option._id || key}
                                      label={option.category_name}
                                      {...tagProps}
                                    />
                                  );
                                })
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Destination Category"
                                  placeholder="Select"
                                  inputProps={{
                                    ...params.inputProps,
                                    readOnly: true, // Make input box non-editable
                                  }}
                                />
                              )}
                            />
                          </MDBox>

                          {/* Travel By */}
                          <MDBox mb={4}>
                            {/* <FormControl fullWidth>
                                                            <InputLabel id="travel-by-label">Travel By</InputLabel>
                                                            <Select
                                                                labelId="travel-by-label"
                                                                id="travel-by"
                                                                value={selectedTravelBy}
                                                                onChange={handleTravelSelect}
                                                                label="Travel By"
                                                                style={{ backgroundColor: "transparent" }}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                <MenuItem value="Train">Train</MenuItem>
                                                                <MenuItem value="Flight">Flight</MenuItem>
                                                                <MenuItem value="Bus">Bus</MenuItem>
                                                                <MenuItem value="Car">Car</MenuItem>
                                                            </Select>
                                                        </FormControl> */}
                            <div>
                              <h6
                                className="mb-1"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Travel By
                              </h6>
                              <FormControl fullWidth variant="outlined">
                                <Select
                                  labelId="travel-by-label"
                                  id="travel-by-select"
                                  name="travel-by"
                                  value={selectedTravelBy}
                                  onChange={handleTravelSelect}
                                  label="Travel By"
                                  style={{
                                    color: "#7b809a",
                                    background: "transparent",
                                    fontSize: "14px",
                                    height: "44px",
                                    padding: "0px 0px 4px 0px",
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value="Train">Train</MenuItem>
                                  <MenuItem value="Flight">Flight</MenuItem>
                                  <MenuItem value="Bus">Bus</MenuItem>
                                  <MenuItem value="Car">Car</MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </MDBox>

                          {/* Total Nights */}
                          <MDBox mb={4}>
                            {/* <FormControl fullWidth>
                                                            <InputLabel id="total-nights-label">Total Nights</InputLabel>
                                                            <Select
                                                                labelId="total-nights-label"
                                                                id="total-nights"
                                                                value={selectedNights}
                                                                onChange={handleNightsSelect}
                                                                label="Total Nights"
                                                                style={{ backgroundColor: "transparent" }}
                                                                disabled={selectedDays === 0}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                <MenuItem value={selectedDays - 1}>{selectedDays - 1}</MenuItem>
                                                                <MenuItem value={selectedDays}>{selectedDays}</MenuItem>
                                                                <MenuItem value={selectedDays + 1}>{selectedDays + 1}</MenuItem>
                                                            </Select>
                                                        </FormControl> */}
                            <div>
                              <h6
                                className="mb-1"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Total Nights
                              </h6>
                              <FormControl fullWidth variant="outlined">
                                <Select
                                  labelId="total-nights-label"
                                  id="total-nights-select"
                                  name="total-nights"
                                  value={selectedNights}
                                  onChange={handleNightsSelect}
                                  label="Total Nights"
                                  style={{
                                    color: "#7b809a",
                                    fontSize: "14px",
                                    height: "44px",
                                    padding: "0px 0px 4px 0px",
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  <MenuItem value={selectedDays - 1}>
                                    {selectedDays - 1}
                                  </MenuItem>
                                  <MenuItem value={selectedDays}>
                                    {selectedDays}
                                  </MenuItem>
                                  <MenuItem value={Number(selectedDays) + 1}>
                                    {Number(selectedDays) + 1}
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </MDBox>

                          {/* End Date */}
                          {/* <MDBox mb={4}>
                                                        <TextField
                                                            label="End Date"
                                                            type="date"
                                                            fullWidth
                                                            InputLabelProps={{ shrink: true }}
                                                            value={endDate}
                                                            onChange={handleEndDateChange}
                                                            disabled={isEndDateDisabled}
                                                            inputProps={{ min: startDate }}
                                                        />
                                                    </MDBox> */}

                          {/* Exclude Services */}
                          <MDBox
                            mb={4}
                            mt={5}
                            sx={{
                              "& input": {
                                padding: "16px 10px",
                                fontSize: "14px",
                              },
                            }}
                          >
                            <MDBox display="flex" alignItems="center">
                              <TextField
                                label="Exclude Service"
                                type="text"
                                fullWidth
                                value={serviceInputEx}
                                onChange={(e) =>
                                  setServiceInputEx(e.target.value)
                                }
                              />
                              <IconButton
                                onClick={handleAddServiceEx}
                                color="primary"
                              >
                                <AddIcon />
                              </IconButton>
                            </MDBox>
                            <MDBox mt={1}>
                              <List>
                                {servicesEx?.map((service, index) => (
                                  <ListItem
                                    key={index}
                                    secondaryAction={
                                      <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() =>
                                          handleDeleteServiceEx(index)
                                        }
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <>
                                          {expandedServices[index] ||
                                          service.length <= 250
                                            ? service // Show full text if expanded or less than 250 characters
                                            : `${service.substring(
                                                0,
                                                250
                                              )}...`}{" "}
                                          {/* Truncate text */}
                                          {service.length > 250 && (
                                            <Button
                                              onClick={() =>
                                                toggleServiceExpansion(index)
                                              }
                                              sx={{
                                                color: "#348eed",
                                                fontSize: "12px",
                                                marginLeft: "8px",
                                              }}
                                            >
                                              {expandedServices[index]
                                                ? "Read Less"
                                                : "Read More"}
                                            </Button>
                                          )}
                                        </>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </MDBox>
                          </MDBox>

                          {/* Sightseeing */}
                          <MDBox mb={4}>
                            {/* <FormControl fullWidth>
                                                            <InputLabel id="sightseeing-label">Sightseeing</InputLabel>
                                                            <Select
                                                                labelId="sightseeing-label"
                                                                id="sightseeing"
                                                                value={sightseeing}
                                                                onChange={(e) => setSightseeing(e.target.value)}
                                                                label="Sightseeing"
                                                                style={{ backgroundColor: "transparent" }}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                <MenuItem value="yes">Yes</MenuItem>
                                                                <MenuItem value="no">No</MenuItem>
                                                            </Select>
                                                        </FormControl> */}

                            <MDBox mb={4}>
                              <div>
                                <h6
                                  className="mb-1"
                                  style={{ fontSize: "12px", color: "#b8b8b8" }}
                                >
                                  Sightseeing
                                </h6>
                                <FormControl fullWidth variant="outlined">
                                  <Select
                                    labelId="sightseeing-label"
                                    id="sightseeing-select"
                                    name="sightseeing"
                                    value={sightseeing}
                                    onChange={(e) =>
                                      setSightseeing(e.target.value)
                                    }
                                    style={{
                                      color: "#7b809a",
                                      background: "transparent",
                                      fontSize: "14px",
                                      height: "45px",
                                      padding: "0px 0px 4px 0px",
                                    }}
                                  >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="include">Include</MenuItem>
                                    <MenuItem value="exclude">Exclude</MenuItem>
                                  </Select>
                                </FormControl>
                              </div>
                            </MDBox>
                          </MDBox>

                          {/* Status */}
                          <MDBox mb={4}>
                            {/* <FormControl fullWidth>
                                                            <InputLabel id="status-label">Status</InputLabel>
                                                            <Select
                                                                labelId="status-label"
                                                                id="status"
                                                                value={status}
                                                                onChange={(e) => setStatus(e.target.value)}
                                                                label="Status"
                                                                style={{ backgroundColor: "transparent" }}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                <MenuItem value={true}>Active</MenuItem>
                                                                <MenuItem value={false}>Inactive</MenuItem>
                                                            </Select>
                                                        </FormControl> */}
                            <div>
                              <h6
                                className="mb-1"
                                style={{ fontSize: "12px", color: "#b8b8b8" }}
                              >
                                Status
                              </h6>
                              <FormControl fullWidth variant="outlined">
                                <Select
                                  labelId="status-label"
                                  id="status-select"
                                  name="status"
                                  value={status}
                                  onChange={(e) =>
                                    setStatus(e.target.value === "true")
                                  }
                                  style={{
                                    color: "#7b809a",
                                    background: "transparent",
                                    fontSize: "14px",
                                    height: "45px",
                                    padding: "0px 0px 4px 0px",
                                  }}
                                >
                                  <MenuItem value="">
                                    <em>Select</em>
                                  </MenuItem>
                                  <MenuItem value="true">Active</MenuItem>
                                  <MenuItem value="false">Inactive</MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} xl={12}>
                          {/* Price Details */}
                          <MDBox mb={4}>
                            <MDBox
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              mb={2}
                            >
                              <Typography variant="h6">
                                Price Details
                              </Typography>
                              <IconButton
                                onClick={() => setOpenModal(true)}
                                color="primary"
                              >
                                <AddIcon />
                              </IconButton>
                            </MDBox>

                            <div className="mb-4 mx-2">
                              <div
                                className="margin-pricing-agency"
                                style={{
                                  padding: "10px",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div
                                  className="margin-pricing-agency-header"
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      "1fr 1fr 1fr 1fr 1fr 1fr",
                                    gap: "10px",
                                    textAlign: "center",
                                    padding: "8px 0",
                                    borderRadius: "4px",
                                  }}
                                >
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      color: "#044711",
                                      marginBottom: "0",
                                    }}
                                  >
                                    Price Per Adult
                                  </h5>
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      color: "#044711",
                                      marginBottom: "0",
                                    }}
                                  >
                                    Price Per Children
                                  </h5>
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      color: "#044711",
                                      marginBottom: "0",
                                    }}
                                  >
                                    Price Per Infant
                                  </h5>
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      color: "#044711",
                                      marginBottom: "0",
                                    }}
                                  >
                                    Start Date
                                  </h5>
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      color: "#044711",
                                      marginBottom: "0",
                                    }}
                                  >
                                    End Date
                                  </h5>
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      color: "#044711",
                                      marginBottom: "0",
                                    }}
                                  >
                                    Actions
                                  </h5>
                                </div>
                                <hr
                                  style={{
                                    border: "none",
                                    borderTop: "1px solid #ddd",
                                    margin: "8px 0",
                                  }}
                                />
                                {priceDetails &&
                                  (() => {
                                    const sortedDates =
                                      sortDatesByMonth(priceDetails);
                                    let currentMonth = "";

                                    return sortedDates.map(
                                      (updatedItem, index) => {
                                        const startDate = new Date(
                                          updatedItem.price_start_date
                                        );
                                        const monthYear =
                                          startDate.toLocaleString("default", {
                                            month: "long",
                                            year: "numeric",
                                          });
                                        const showMonthHeader =
                                          monthYear !== currentMonth;
                                        currentMonth = monthYear;

                                        return (
                                          <React.Fragment key={index}>
                                            <div
                                              className="margin-pricing-agency-body"
                                              style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                  "1fr 1fr 1fr 1fr 1fr 1fr",
                                                gap: "10px",
                                                textAlign: "center",
                                                padding: "8px 0",
                                                fontSize: "15px",
                                                borderBottom: "1px solid #ddd",
                                              }}
                                            >
                                              <p
                                                style={{
                                                  margin: 0,
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                {updatedItem?.price_per_person}
                                              </p>
                                              <p
                                                style={{
                                                  margin: 0,
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                {updatedItem?.child_price}
                                              </p>
                                              <p
                                                style={{
                                                  margin: 0,
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                {updatedItem?.infant_price}
                                              </p>
                                              <p
                                                style={{
                                                  margin: 0,
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                {rightDate(
                                                  updatedItem?.price_start_date?.slice(
                                                    0,
                                                    10
                                                  )
                                                )}
                                              </p>
                                              <p
                                                style={{
                                                  margin: 0,
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                {rightDate(
                                                  updatedItem?.price_end_date?.slice(
                                                    0,
                                                    10
                                                  )
                                                )}
                                              </p>
                                              <p
                                                style={{
                                                  margin: 0,
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                <IconButton
                                                  onClick={() =>
                                                    handleDelete(index)
                                                  }
                                                  color="secondary"
                                                >
                                                  <DeleteIcon />
                                                </IconButton>
                                              </p>
                                            </div>
                                          </React.Fragment>
                                        );
                                      }
                                    );
                                  })()}
                              </div>
                            </div>

                            {/* <Table style={{ width: '100%' }}>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">Price Per Person</TableCell>
                                                                    <TableCell align="left">Start Date</TableCell>
                                                                    <TableCell align="left">End Date</TableCell>
                                                                    <TableCell align="center">Actions</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {priceDetails.map((detail, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell align="left">{detail.price_per_person}</TableCell>
                                                                        <TableCell align="left">{detail.price_start_date}</TableCell>
                                                                        <TableCell align="left">{detail.price_end_date}</TableCell>
                                                                        <TableCell align="center">
                                                                            <IconButton onClick={() => handleDelete(index)} color="secondary">
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table> */}
                          </MDBox>
                        </Grid>

                        <Grid item xs={12} md={6} xl={4}>
                          {/* Admin Margin */}
                          <div className="mb-4">
                            <div
                              className="margin-pricing-agency"
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <div
                                className="margin-pricing-agency-header"
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 3fr",
                                  gap: "10px",
                                  textAlign: "center",
                                  padding: "8px 0",
                                  borderRadius: "4px",
                                }}
                              >
                                <h5
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#044711",
                                    marginBottom: "0",
                                  }}
                                >
                                  Month
                                </h5>
                                <h5
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#044711",
                                    marginBottom: "0",
                                  }}
                                >
                                  Margin Percentage
                                </h5>
                              </div>
                              <hr
                                style={{
                                  border: "none",
                                  borderTop: "1px solid #ddd",
                                  margin: "8px 0",
                                }}
                              />
                              {margin &&
                                margin?.map((updatedItem) => {
                                  return (
                                    <div
                                      className="margin-pricing-agency-body"
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 3fr",
                                        gap: "10px",
                                        textAlign: "center",
                                        padding: "8px 0",
                                        borderBottom: "1px solid #ddd",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: "16px",
                                          fontWeight: "500",
                                          marginBottom: "0",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {updatedItem?.month_name}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: "16px",
                                          fontWeight: "500",
                                          marginBottom: "0",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {updatedItem?.margin_percentage}%
                                      </p>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </Grid>
                      </Grid>

                      <Modal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay background
                        }}
                      >
                        <MDBox
                          p={4}
                          bgcolor="white"
                          borderRadius={2}
                          style={{
                            width: "100%",
                            maxWidth: "500px",
                            backgroundColor: "#fff",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Add shadow for a clean look
                          }}
                        >
                          <Typography variant="h6" mb={3} align="center">
                            Add Price Details
                          </Typography>

                          <MDBox mt={2}>
                            <TextField
                              label="Price Per Person For Adult"
                              fullWidth
                              value={pricePerPerson}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === "" ||
                                  /^[1-9][0-9]*$/.test(value)
                                ) {
                                  setPricePerPerson(value);
                                }
                              }}
                              inputProps={{
                                inputMode: "numeric",
                                pattern: "[1-9][0-9]*",
                                style: {
                                  appearance: "textfield",
                                  MozAppearance: "textfield",
                                },
                              }}
                              sx={{
                                mb: 2,
                                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                  {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                  },
                              }}
                            />
                          </MDBox>

                          <MDBox mt={2}>
                            <TextField
                              label="Price Per Person For Children"
                              fullWidth
                              value={pricePerPersonForChild}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === "" ||
                                  /^[1-9][0-9]*$/.test(value)
                                ) {
                                  setPricePerPersonForChild(value);
                                }
                              }}
                              inputProps={{
                                inputMode: "numeric",
                                pattern: "[1-9][0-9]*",
                                style: {
                                  appearance: "textfield",
                                  MozAppearance: "textfield",
                                },
                              }}
                              sx={{
                                mb: 2,
                                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                  {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                  },
                              }}
                            />
                          </MDBox>

                          <MDBox mt={2}>
                            <TextField
                              label="Price Per Person For Infant"
                              fullWidth
                              value={pricePerPersonForInfant}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === "" ||
                                  /^[1-9][0-9]*$/.test(value)
                                ) {
                                  setPricePerPersonForInfant(value);
                                }
                              }}
                              inputProps={{
                                inputMode: "numeric",
                                pattern: "[1-9][0-9]*",
                                style: {
                                  appearance: "textfield",
                                  MozAppearance: "textfield",
                                },
                              }}
                              sx={{
                                mb: 2,
                                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                  {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                  },
                              }}
                            />
                          </MDBox>

                          {/* Date inputs */}
                          <MDBox mt={2}>
                            <TextField
                              label="Start Date"
                              type="date"
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                              value={priceStartDate}
                              onChange={(e) =>
                                setPriceStartDate(e.target.value)
                              }
                              sx={{ mb: 2 }}
                              inputProps={{
                                min: getTomorrowDate(), // Minimum start date is tomorrow
                              }}
                              onKeyDown={(e) => e.preventDefault()}
                            />
                          </MDBox>

                          <MDBox mt={2}>
                            <TextField
                              label="End Date"
                              type="date"
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                              value={priceEndDate}
                              onChange={(e) => setPriceEndDate(e.target.value)}
                              sx={{ mb: 3 }} // Larger margin for spacing before buttons
                              inputProps={{
                                min: priceStartDate || getTomorrowDate(), // Minimum end date is the selected start date or tomorrow
                              }}
                              onKeyDown={(e) => e.preventDefault()}
                              disabled={!priceStartDate} // Disable if start date is not selected
                            />
                          </MDBox>

                          {/* Buttons */}
                          <MDBox mt={3} display="flex" justifyContent="center">
                            <Button
                              variant="contained"
                              color="primary"
                              style={{ color: "white", padding: "8px 16px" }}
                              onClick={handleAddPriceDetail}
                              sx={{ minWidth: "120px" }}
                            >
                              Submit
                            </Button>
                          </MDBox>
                        </MDBox>
                      </Modal>

                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
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
                          <MDButton
                            variant="gradient"
                            color="info"
                            style={{ padding: "0px 50px" }}
                            type="submit"
                            onClick={handleInsertPackage}
                          >
                            {isUpdateMode ? "Update" : "Submit"}
                          </MDButton>
                        )}
                        {renderSuccessSB}
                        {renderErrorSB}
                      </div>

                      {renderSuccessSB}
                      {renderErrorSB}
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
          </TabPanel>

          <TabPanel value="2">
            <MDBox pt={2} pb={3}>
              <Grid container spacing={6}>
                {packageData &&
                  packageData?.Itinaries.map((hotel) => (
                    <Grid item xs={12} md={6} xl={4} key={hotel.id}>
                      <Card sx={{ position: "relative", paddingTop: "10px" }}>
                        <CardMedia
                          component="img"
                          image={hotel.photo}
                          alt={hotel.title}
                          sx={{
                            objectFit: "cover",
                            objectPosition: "center",
                            height: "200px",
                          }}
                        />
                        <CardContent>
                          <MDBox
                            sx={{ position: "absolute", top: 10, right: 10 }}
                          >
                            <IconButton
                              aria-label="edit"
                              onClick={() => updateItinerary(hotel._id)}
                              sx={{ color: "gray" }}
                            >
                              <EditIcon />
                            </IconButton>
                          </MDBox>
                          <Typography
                            variant="Hotel Name:"
                            sx={{
                              fontWeight: "bold",
                              color: "#344767",
                              borderRadius: "4px",
                              fontSize: "16px",
                            }}
                          >
                            Hotel Name: {hotel.hotel_name}
                          </Typography>
                          <MDBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="h6" component="div">
                              {hotel.title}
                            </Typography>
                            <Typography variant="h6" component="div">
                              Day {hotel.day}
                            </Typography>
                          </MDBox>

                          <>
                            <Typography variant="body2" color="textSecondary">
                              {expandedItems[hotel._id]
                                ? stripHtml(hotel.activity)
                                : stripHtml(hotel.activity).substring(0, 250) +
                                  "..."}
                            </Typography>
                            {stripHtml(hotel.activity).length > 250 && (
                              <Button
                                onClick={() => toggleReadMore(hotel._id)}
                                sx={{ color: "#348eed" }}
                              >
                                {expandedItems[hotel._id]
                                  ? "Read Less"
                                  : "Read More"}
                              </Button>
                            )}
                          </>

                          <MDBox
                            sx={{
                              backgroundColor: "#f0f7ff",
                              borderRadius: "8px",
                              padding: "8px 10px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            }}
                          >
                            {/* Room Details */}
                            <p
                              style={{
                                color: "#344767",
                                marginBottom: "1px",
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Room
                            </p>
                            <MDBox
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{
                                backgroundColor: "white",
                                borderRadius: "6px",
                                padding: "8px 15px",
                              }}
                            >
                              <Typography
                                variant="body2"
                                component="div"
                                sx={{ color: "#7b809a" }}
                              >
                                {hotel.rooms?.[0]?.room_type}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="div"
                                sx={{ color: "#7b809a" }}
                              >
                                ₹{hotel.rooms?.[0]?.room_type_price}
                              </Typography>
                            </MDBox>

                            {/* Meals Details */}
                            <p
                              style={{
                                color: "#344767",
                                marginBottom: "1px",
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Meals
                            </p>
                            <MDBox>
                              {/* Only render breakfast if hotel.breakfast is true */}
                              {hotel.breakfast === true && (
                                <MDBox
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  sx={{
                                    backgroundColor: "white",
                                    borderRadius: "6px",
                                    padding: "2px 15px",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{ color: "#7b809a" }}
                                  >
                                    Breakfast
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{ color: "#7b809a" }}
                                  >
                                    ₹{hotel.breakfast_price}
                                  </Typography>
                                </MDBox>
                              )}

                              {/* Only render lunch if hotel.lunch is true */}
                              {hotel.lunch === true && (
                                <MDBox
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  sx={{
                                    backgroundColor: "white",
                                    borderRadius: "6px",
                                    padding: "2px 15px",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{ color: "#7b809a" }}
                                  >
                                    Lunch
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{ color: "#7b809a" }}
                                  >
                                    ₹{hotel.lunch_price}
                                  </Typography>
                                </MDBox>
                              )}

                              {/* Only render dinner if hotel.dinner is true */}
                              {hotel.dinner === true && (
                                <MDBox
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  sx={{
                                    backgroundColor: "white",
                                    borderRadius: "6px",
                                    padding: "2px 15px",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{ color: "#7b809a" }}
                                  >
                                    Dinner
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{ color: "#7b809a" }}
                                  >
                                    ₹{hotel.dinner_price}
                                  </Typography>
                                </MDBox>
                              )}
                            </MDBox>
                          </MDBox>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>

              {/* Only show Add button if current itineraries are less than max allowed */}
              {packageData?.Itinaries?.length < getMaxItineraries() && (
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "100px",
                    zIndex: 1000,
                    borderRadius: "100%",
                    padding: "7px 0px",
                    fontSize: "30px",
                    color: "white",
                  }}
                  onClick={handleAddItinerary}
                >
                  +
                </Button>
              )}
            </MDBox>
          </TabPanel>
        </TabContext>
      </Box>
      <ToastContainer />
    </DashboardLayout>
  );
};

export default AddCustomeUser;