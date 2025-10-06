import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate, useParams, } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import InputLabel from "@mui/material/InputLabel";
import { Button, Modal, TextField, Card, CardContent, Typography, IconButton } from '@mui/material';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDSnackbar from "components/MDSnackbar";
import CloseIcon from '@mui/icons-material/Close';
import { BASE_URL } from "BASE_URL";

// import
const ManageCategory = () => {

  const [editroom, setEditroom] = useState("")


  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const responseDelete = await axios.delete(
        `${BASE_URL}package/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (responseDelete.data.status === "OK") {
        navigate("/manage-packages");
      }
    } catch (error) {
    }
  };

  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);
  const [formData2, setFormData2] = useState("");
  const [formData1, setFormData1] = useState({
    name: "",
    price_per_person: "",
    total_days: "",
    total_nights: "",
    destination: "",
    destination_category_id: "",
    meal_required: "",
    meal_type: "",
    travel_by: "",
    hotel_type: "",
    more_details: "",
    sightseeing: "",
    place_to_visit_id: "",
    start_date :"",
    end_date: "",
  });





  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedItems2, setCheckedItems2] = useState([]);
  console.log(checkedItems);

  const handleCheckboxChange = (event) => {
    const itemName = event.target.name;
    if (event.target.checked) {
      setCheckedItems([...checkedItems, itemName]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== itemName));
    }
  };


  const [selectedDestinations, setSelectedDestinations] = useState([]);

  const handleCheckboxChange2 = (event) => {
    const itemName = event.target.name;

    if (event.target.checked) {
      setSelectedDestinations([...selectedDestinations, itemName]);
    } else {
      setSelectedDestinations(
        selectedDestinations.filter((item) => item !== itemName)
      );
    }
  };


  const handleCheckboxChange3 = (event) => {
    const itemName = event.target.name;
    if (event.target.checked) {
      setCheckedItems2([...checkedItems2, itemName]);
    } else {
      setCheckedItems2(checkedItems2.filter((item) => item !== itemName));
    }
  };


  const handleOptionChange = (event) => {
    const { name, value } = event.target;
    setFormData1({ ...formData1, [name]: value })
  };


  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const navigate = useNavigate();
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull Added"
      content="Category is successfully added."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  // const { id } = useParams();
  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Filled Error"
      content="Please fill all fileds"
      dateTime="1 sec ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const { id } = useParams();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("sytAdmin");

      if (
        !formData1.name ||
        !formData1.price_per_person ||
        !formData1.total_days ||
        !formData1.total_nights ||
        !formData1.meal_type ||
        !formData1.travel_by ||
        !formData1.more_details ||
        !formData1.sightseeing ||
        !formData1.start_date ||
        !formData1.end_date
      ) {
        // If any field is missing, show the error snackbar and return
        openErrorSB();
        return;
      }

      const response = await axios.put(
        `${BASE_URL}package/${id}`,
        {
          name: formData1.name,
          price_per_person: formData1.price_per_person,
          total_days: formData1.total_days,
          total_nights: formData1.total_nights,
          destination_category_id: selectedDestinations,
          meal_required: checkedItems,
          meal_type: formData1.meal_type,
          travel_by: formData1.travel_by,
          hotel_type: checkedItems2,
          more_details: formData1.more_details,
          sightseeing: formData1.sightseeing,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === "OK") {
        openSuccessSB();
        setTimeout(() => {
          navigate("/manage-packages");
        }, 2000);
      }
    } catch (error) {
    }
  };

  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
  };


  // get api for select placetovisit

  const [placetovisit, setPlacetovisit] = useState([])
  const [place, setPlace] = useState({
    Destinations: ""
  })

  const places = async () => {
    const token = localStorage.getItem("sytAdmin")

    const res = await fetch(`${BASE_URL}package/getPackageData?package_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data.data[0]);
    setSelectedDestinations(
      data.data[0].destination_category_id.map((category) => category._id)
    )
    setCheckedItems(data.data[0].meal_required || "")
    setCheckedItems2(data.data[0].hotel_type || "")
    setFormData1({
      name: data.data[0].name || "",
      price_per_person: data.data[0].price_per_person || "",
      total_days: data.data[0].total_days || "",
      total_nights: data.data[0].total_nights || "",
      destination: data.data[0].destination || "",
      meal_type: data.data[0].meal_type || "",
      travel_by: data.data[0].travel_by || "",
      more_details: data.data[0].more_details || "",
      sightseeing: data.data[0].sightseeing || "",
      place_to_visit_id: data.data[0].place_to_visit_id || "",
      start_date: data.data[0].start_date.slice(0, 10) || "",
      end_date: data.data[0].end_date.slice(0, 10) || "",
    });

    setIncludeServices(data.data[0].include_service.map(ele => ele.include_services_value))
    setexcludeServices(data.data[0].exclude_service.map(ele => ele.include_services_value))
  };

  useEffect(() => {
    places();
  }, []);




  const [Destcat, setDestcat] = useState([])


  const fetchCategoryList = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await axios.get(
        `${BASE_URL}destinationcategory`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setDestcat(response.data.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);


  // get api for display data 

  const displayData = async () => {
    const token = localStorage.getItem("sytAdmin")

    const res = await fetch(`${BASE_URL}destination/alldestination`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setFormData2(data.data);
  };

  useEffect(() => {
    displayData();
  }, []);

  // end of get api 


  const mealRequired = ["Breakfast", "Lunch", "Dinner"];
  const hotelType = ["5", "4", "3", "2", "1"];




  const [includeServices, setIncludeServices] = useState([]);
  const [newService, setNewService] = useState("");

  const handleAddService = () => {
    if (newService.trim() !== "") {
      setIncludeServices((prevServices) => [...prevServices, newService]);
      setNewService("");
    }
  };


  const handleRemoveService = (index) => {
    // Create a new array without the item to be removed
    const updatedServices = includeServices.filter((_, i) => i !== index);
    setIncludeServices(updatedServices);
  };



  const [excludeServices, setexcludeServices] = useState([]);
  const [exclude, setExclude] = useState("");

  const handleAddExclude = () => {
    if (exclude.trim() !== "") {
      setexcludeServices((prevServices) => [...prevServices, exclude]);
      setExclude(""); // Clear the input field after adding
    }
  };


  const [itineraries, setItineraries] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formDatait, setFormDatait] = useState({
    title: '',
    photoFile: null,
    photoURL: '',
    hotelName: '',
    description: '',
    _id: '',
    day: ''
  });

  const getItinerary = async () => {
    const token = localStorage.getItem("sytAdmin");

    const res = await fetch(`${BASE_URL}itinerary?_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setItineraries(data.data?.sort((a, b) => a.day - b.day));
  };

  useEffect(() => {
    getItinerary();
  }, []);

  const handleOpen = (index) => {
    setEditIndex(index);
    setFormDatait({
      title: itineraries[index].title,
      photoFile: itineraries[index].photoFile || null,
      photoURL: itineraries[index].photo,
      hotelName: itineraries[index].hotel_name,
      description: itineraries[index].activity,
      _id: itineraries[index]._id,
      day: itineraries[index].day
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormDatait({
      title: '',
      photoFile: null,
      photoURL: '',
      hotelName: '',
      description: '',
      _id: '',
      day: ''
    });
  };

  const handleChangeit = (e) => {
    if (e.target.name === 'photoFile') {
      setFormDatait({ ...formDatait, photoFile: e.target.files[0] });
    } else {
      const { name, value } = e.target;
      setFormDatait({ ...formDatait, [name]: value });
    }
  };

  const handleSaveit = () => {
    const newItinerary = {
      title: formDatait.title,
      photoFile: formDatait.photoFile || null,
      hotel_name: formDatait.hotelName,
      activity: formDatait.description,
      _id: formDatait._id,
      day: formDatait.day // Preserve the day property
    };

    const updatedItineraries = [...itineraries];
    updatedItineraries[editIndex] = newItinerary;
    setItineraries(updatedItineraries);
    setFormDatait({
      title: '',
      photoFile: null,
      photoURL: '',
      hotelName: '',
      description: '',
      _id: '',
      day: ''
    });
    handleClose();
  };

  const [selectedHotel, setSelectedHotel] = useState("")

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    console.log(itineraries);
    if (!itineraries || itineraries.length === 0) {
      openErrorSB();
      return;
    }

    try {
      const token = localStorage.getItem("sytAdmin");

      // Create an array of promises for the API calls
      const requests = itineraries.map((itinerary) => {
        const formData = new FormData();
        formData.append("title", itinerary.title);
        formData.append("activity", itinerary.activity);
        formData.append("hotel_itienrary_id", selectedHotel?._id);
        formData.append("day", itinerary.day);
        if (itinerary.photoFile) {
          formData.append("photo", itinerary.photoFile);
        }

        return fetch(`${BASE_URL}itinerary?_id=${itinerary._id}`, {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body: formData,
        }).then(response => response.json());
      });

      // Wait for all the promises to resolve
      const responses = await Promise.all(requests);

      // Check the responses
      const allSuccessful = responses.every(response => response.status === "OK");

      if (allSuccessful) {
        openSuccessSB();
        setTimeout(() => {
          navigate("/manage-packages");
        }, 2000);
      }
    } catch (error) {
      // Handle errors here
      console.error("Error submitting itineraries:", error);
    }
  };


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Edit Package
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }} role="form">
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <MDInput
                  type="text"
                  name="name"
                  label="Enter package name"
                  value={formData1.name}
                  onChange={handleOptionChange}
                  fullWidth
                  style={{ marginBottom: '20px', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <MDInput
                  type="textarea"
                  name="price_per_person"
                  label="Price per person"
                  value={formData1.price_per_person}
                  onChange={handleOptionChange}
                  fullWidth
                  style={{ marginBottom: '20px', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px' }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <MDInput
                  type="text"
                  name="total_days"
                  label="Total days"
                  value={formData1.total_days}
                  onChange={handleOptionChange}
                  fullWidth
                  style={{ marginBottom: '20px', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <MDInput
                  type="text"
                  name="total_nights"
                  label="Total nights"
                  value={formData1.total_nights}
                  onChange={handleOptionChange}
                  fullWidth
                  style={{ marginBottom: '20px', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px' }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <InputLabel style={{ marginBottom: "8px" }}>
                  Meal Required
                </InputLabel>
                {mealRequired.map((option) => (
                  <MDBox key={option} display="flex" alignItems="center" style={{ marginBottom: '10px' }}>
                    <input
                      type="checkbox"
                      name={option.toLowerCase()}
                      style={{ marginRight: '10px' }}
                      onChange={handleCheckboxChange}
                      checked={checkedItems.includes(option)}
                    />
                    <label style={{ color: darkMode ? '#ffffffcc' : '', fontSize: "13px" }}>{option}</label>
                  </MDBox>
                ))}
              </div>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <InputLabel style={{ marginBottom: "8px" }}>
                  Destination Category
                </InputLabel>
                {Destcat.map((feature) => (
                  <MDBox key={feature._id} display="flex" alignItems="center" style={{ marginBottom: '10px' }}>
                    <input
                      type="checkbox"
                      id={feature._id}
                      name={feature._id}
                      checked={selectedDestinations.includes(feature._id)}
                      onChange={handleCheckboxChange2}
                      style={{ marginRight: "10px" }}
                    />
                    <label
                      style={{
                        color: darkMode ? "#ffffffcc" : "",
                        fontSize: "13px",
                      }}
                      htmlFor={feature._id}
                    >
                      {feature.category_name}
                    </label>
                  </MDBox>
                ))}
              </div>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <InputLabel style={{ marginBottom: "8px" }}>
                  Hotel Type
                </InputLabel>
                {hotelType.map((option) => (
                  <MDBox key={option} display="flex" alignItems="center" style={{ marginBottom: '10px' }}>
                    <input
                      type="checkbox"
                      name={option.toLowerCase()}
                      style={{ marginRight: '10px' }}
                      onChange={handleCheckboxChange3}
                      checked={checkedItems2.includes(option)}
                    />
                    <label style={{ color: darkMode ? '#ffffffcc' : '', fontSize: "13px" }}>{option}</label>
                  </MDBox>
                ))}
              </div>


            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <InputLabel style={{ marginBottom: "8px" }}>
                  Meal Type
                </InputLabel>
                <select
                  name="meal_type"
                  value={formData1.meal_type}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}
                >
                  <option value="">Select Meal type</option>
                  <option value="Any">Any</option>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <InputLabel style={{ marginBottom: "8px" }}>
                  Travel By
                </InputLabel>
                <select
                  name="travel_by"
                  value={formData1.travel_by}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}
                >
                  <option value="">Select Travel By</option>
                  <option value="Train">Train</option>
                  <option value="Flight">Flight</option>
                  <option value="Bus">Car</option>
                  <option value="Bus">Bus</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <InputLabel style={{ marginBottom: "8px" }}>
                  Sightseeing
                </InputLabel>
                <select
                  name="sightseeing"
                  value={formData1.sightseeing}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}
                >
                  <option value="">Sightseeing</option>
                  <option value="yes">Include</option>
                  <option value="no">Exclude</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <h6>Include Services</h6>
                <div style={{ border: '1px solid #b7b7b7', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                  <ul>
                    {includeServices.map((e, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: "1px solid black", paddingBottom: "5px", marginBottom: "5px", alignItems: "center" }}>
                        <span style={{ fontSize: "15px" }} >{e}</span>
                        <button type="button" onClick={() => handleRemoveService(index)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', height: "fit-content", fontSize: "10px" }}>Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <input
                    type="text"
                    placeholder="Enter Include Services"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', paddingRight: "80px" }}
                  />
                  <button type="button" onClick={handleAddService} style={{ position: 'absolute', top: '50%', right: '0px', transform: 'translateY(-50%)', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px' }}>Add</button>
                </div>
              </div>

              <div style={{ marginBottom: '20px', flex: "1" }}>
                <h6>Exclude Services</h6>
                <div style={{ border: '1px solid #b7b7b7', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                  <ul>
                    {excludeServices.map((e, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: "1px solid black", paddingBottom: "5px", marginBottom: "5px", alignItems: "center" }}>
                        <span style={{ fontSize: "15px" }}>{e}</span>
                        <button type="button" onClick={() => handleRemoveService(index)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', height: "fit-content", fontSize: "10px" }}>Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <input
                    type="text"
                    placeholder="Enter Exclude Services"
                    value={exclude}
                    onChange={(e) => setExclude(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', paddingRight: "80px" }}
                  />
                  <button type="button" onClick={handleAddExclude} style={{ position: 'absolute', top: '50%', right: '0px', transform: 'translateY(-50%)', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px' }}>Add</button>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <InputLabel style={{ marginBottom: "8px" }}>
                More detail
              </InputLabel>
              <textarea
                placeholder="More Detail"
                cols="30"
                rows="7"
                name="more_details"
                value={formData1.more_details}
                onChange={handleOptionChange}
                style={{
                  color: "rgb(122 131 139)",
                  border: "1px solid rgb(216, 216, 216)",
                  width: "100%",
                  padding: "9px 10px",
                  fontSize: "14px",
                  borderRadius: "6px"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <InputLabel style={{ marginBottom: "8px" }}>
                  Start Date
                </InputLabel>
                <input
                  type="date"
                  name="start_date"
                  value={formData1.start_date}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}
                >

                </input>
              </div>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <InputLabel style={{ marginBottom: "8px" }}>
                  End Date
                </InputLabel>
                <input
                  type="date"
                  name="end_date"
                  value={formData1.end_date}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}
                >
                </input>
              </div>
            </div>
            <MDBox className="d-flex" mt={4} mb={1} style={{ display: 'flex', justifyContent: 'center' }}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleSubmit}
                className="me-2"
                style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px', marginRight: '10px' }}
              >
                Submit
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleDelete}
                style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px' }}
              >
                Delete
              </MDButton>
              {renderSuccessSB}
              {renderErrorSB}
            </MDBox>
          </form>

          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto 50px', border: "2px solid black", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Itinerary</div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {itineraries?.map((itinerary, index) => (
                <div key={index}>
                  <div>{"Day " + (itinerary.day)}</div>
                  <Card className="itinerary-card" style={{ width: "fit-content" }}>
                    <CardContent>
                      <Typography variant="h5">{itinerary.title}</Typography>
                      {itinerary.photoFile ? (
                        <img
                          style={{ height: "100px", width: "100px" }}
                          src={URL.createObjectURL(itinerary.photoFile)}
                          alt={itinerary.title}
                          className="itinerary-photo"
                        />
                      ) : (
                        <img
                          style={{ height: "100px", width: "100px" }}
                          src={itinerary.photo}
                          alt={itinerary.title}
                          className="itinerary-photo"
                        />
                      )}
                      <Typography variant="h6">{itinerary.hotel_name}</Typography>
                      <Typography style={{ fontSize: "12px" }}>{itinerary.activity}</Typography>
                    </CardContent>
                    <Button onClick={() => handleOpen(index)}>Edit</Button>
                  </Card>
                </div>
              ))}
            </div>

            <Modal open={open} onClose={handleClose}>
              <div className="modal-content">
                <div className="modal-header">
                  <Typography variant="h5">Edit Itinerary</Typography>
                  <IconButton onClick={handleClose} className="close-button">
                    <CloseIcon />
                  </IconButton>
                </div>
                <TextField
                  label="Title"
                  name="title"
                  value={formDatait.title}
                  onChange={handleChangeit}
                  fullWidth
                  margin="normal"
                />
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleChangeit}
                  name="photoFile"
                  className="photo-input"
                />
                {formDatait.photoFile ? (
                  <img
                    src={URL.createObjectURL(formDatait.photoFile)}
                    alt="Preview"
                    className="preview-image"
                    style={{ height: "100px", width: "100px" }}
                  />
                ) : (
                  <img
                    src={formDatait.photoURL}
                    alt="Preview"
                    className="preview-image"
                    style={{ height: "100px", width: "100px" }}
                  />
                )}
                <TextField
                  label="Hotel Name"
                  name="hotelName"
                  value={formDatait.hotelName}
                  onChange={handleChangeit}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formDatait.description}
                  onChange={handleChangeit}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                />
                <Button variant="contained" onClick={handleSaveit} className="submit-button">Submit</Button>
              </div>
            </Modal>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={handleSubmit2} style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px' }}>Submit</button>
            </div>
          </div>
        </MDBox>
      </MDBox>
    </DashboardLayout>

  );
};


export default ManageCategory;
