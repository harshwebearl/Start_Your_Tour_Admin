import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import AddIcon from "@mui/icons-material/Add"; // Add icon for the + button
import { BASE_URL } from "BASE_URL";
import MDBox from "components/MDBox";
import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  Autosave,
  BlockQuote,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  List,
  Paragraph,
  SelectAll,
  Strikethrough,
  Underline,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import HotelsSidebar from "components/HotelsSidebar/HotelsSidebar";
// import './ck.css';

const InsertItinerary = () => {
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [packageData, setPackageData] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Store File object
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [temp, setTemp] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(""); // State for selected hotel ID
  const [selectedHotelName, setSelectedHotelName] = useState(""); // State for selected hotel name

  const { package_id, itinerary_id } = useParams();

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
      setHotels(data.data);
    };

    hotelsForItinerary();
  }, []);

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

    if (!title) {
      setErrorMessage("Please Enter Title");
      openErrorSB();
      return;
    }

    if (!description) {
      setErrorMessage("Please Enter Description");
      openErrorSB();
      return;
    }

    if (!selectedImage) {
      setErrorMessage("Please Select Itinerary Image");
      openErrorSB();
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("sytAdmin");
      const formData = new FormData();

      formData.append("package_id", package_id);
      formData.append("title", title);
      formData.append("day", packageData?.Itinaries?.length + 1);
      formData.append("activity", description);
      if (selectedImage) {
        formData.append("photo", selectedImage);
      }
      formData.append("hotel_itienrary_id", selectedHotel?._id);
      formData.append("room_id", selectedRoom?._id);
      formData.append(
        "breakfast",
        selectedMeals?.selectedMeals?.includes("breakfast") ? "true" : "false"
      );
      formData.append(
        "lunch",
        selectedMeals?.selectedMeals?.includes("lunch") ? "true" : "false"
      );
      formData.append(
        "dinner",
        selectedMeals?.selectedMeals?.includes("dinner") ? "true" : "false"
      );

      if (selectedMeals?.selectedMeals?.includes("breakfast")) {
        formData.append(
          "breakfast_price",
          selectedHotel?.breakfast_price || "0"
        );
      }
      if (selectedMeals?.selectedMeals?.includes("lunch")) {
        formData.append("lunch_price", selectedHotel?.lunch_price || "0");
      }
      if (selectedMeals?.selectedMeals?.includes("dinner")) {
        formData.append("dinner_price", selectedHotel?.dinner_price || "0");
      }

      const response = await fetch(`${BASE_URL}itinerary`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        navigate(`/insert-package/${package_id}`);
      } else {
        console.error("Submission failed:", result.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error submitting itinerary:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "selectAll",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "blockQuote",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "indent",
        "outdent",
        "|",
        "accessibilityHelp",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autosave,
      BlockQuote,
      Bold,
      Essentials,
      Heading,
      Indent,
      IndentBlock,
      Italic,
      List,
      Paragraph,
      SelectAll,
      Strikethrough,
      Underline,
      Undo,
    ],
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    placeholder: "Type or paste your content here!",
  };

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleHotelSelect = (hotelId) => {
    const selectedHotel = hotels.find((hotel) => hotel.id === hotelId);
    setSelectedHotelId(hotelId);
    setSelectedHotelName(selectedHotel.name);
    setSidebarOpen(false);
  };

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState({});

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [tempSelection, setTempSelection] = useState(null);
  const handleSelectionChange = (selection) => {
    // Check if no meals are selected
    const hasMeals = selection.meals?.selectedMeals?.length > 0;

    if (!hasMeals) {
      // Changed condition from hasMeals to !hasMeals
      setTempSelection(selection);
      setOpenConfirmDialog(true);
    } else {
      applySelection(selection);
    }
  };

  const applySelection = (selection) => {
    if (selection && selection.hotel) {
      setSelectedHotel(selection.hotel);
      setSelectedRoom(selection.room);
      setSelectedMeals(selection.meals || {});
      setSelectedHotelName(selection.hotel.hotel_name || "");
    }
    setSidebarOpen(false);
  };

  const handleConfirmNo = () => {
    if (tempSelection) {
      applySelection(tempSelection);
    }
    setOpenConfirmDialog(false);
  };

  const handleConfirmYes = () => {
    // This should be for choosing different meals
    setSidebarOpen(true);
    setOpenConfirmDialog(false);
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
                  onChange={(e) => {
                    if (e.target.value.length <= 120) {
                      setTitle(e.target.value);
                    }
                  }}
                  helperText={`${120 - title.length} characters remaining`}
                  FormHelperTextProps={{
                    style: { color: title.length === 120 ? "red" : "black" }, // Change color to red when limit is reached
                  }}
                  required
                />
                <TextField
                  fullWidth
                  label="Day"
                  value={packageData?.Itinaries?.length + 1}
                  style={{ marginTop: "30px" }}
                  InputProps={{ readOnly: true }} // Make it read-only
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
                    label="Hotel Name"
                    value={selectedHotelName}
                    InputProps={{ readOnly: true }}
                    required
                    sx={{ flexGrow: 1 }} // Ensures TextField takes up all available space
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
                <CKEditor
                  data={description}
                  editor={ClassicEditor}
                  config={editorConfig}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setDescription(data);
                  }}
                />
                {/* <TextField
                                    fullWidth
                                    label="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    multiline
                                    rows={4}
                                    required
                                /> */}
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
                    style={{
                      color: "white",
                    }}
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
          <Grid item xs={12} md={5}>
            <Button
              variant="contained"
              component="label"
              style={{
                color: "white",
              }}
            >
              Upload Image
              <input
                type="file"
                accept="image/jpeg , image/png"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {image && (
              <Card
                sx={{
                  maxWidth: 345,
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={image}
                  alt="Selected Image"
                  sx={{
                    mb: 2,
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </Card>
            )}
          </Grid>
        </Grid>

        <HotelsSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          hotels={hotels}
          onSelectionChange={handleSelectionChange}
        />

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
              color="primary"
              sx={{ mt: 2, color: "white" }}
            >
              Close
            </Button>
          </Box>
        </Modal>

        {/* Meals Confirmation Modal */}
        <Modal
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          aria-labelledby="meal-confirm-title"
          aria-describedby="meal-confirm-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography id="meal-confirm-description" mb={3}>
              Are you sure you want to proceed with selected meals?
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained" // Changed from outlined to contained
                onClick={handleConfirmNo}
                style={{
                  color: "white",
                  bgcolor: "#1a73e8",
                }}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmYes}
                style={{
                  color: "white",
                  bgcolor: "#1a73e8",
                }}
              >
                No
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
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

export default InsertItinerary;
