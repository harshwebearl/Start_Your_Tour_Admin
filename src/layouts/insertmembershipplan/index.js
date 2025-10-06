import React, { useEffect, useState } from "react";
import axios from "axios";
import './index.css'
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Button, Modal, TextField, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Link, useNavigate, useParams, } from "react-router-dom";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CloseIcon from '@mui/icons-material/Close';

import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";

// import
const ManageCategory = () => {


  const [showModal, setShowModal] = useState(false);

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

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
    status: true,
    start_date: "",
    end_date: "",
  });

  const [checkedItems, setCheckedItems] = useState("");
  console.log(checkedItems)

  const handleCheckboxChange = (event) => {
    const itemName = event.target.name;
    if (event.target.checked) {
      setCheckedItems([...checkedItems, itemName]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== itemName));
    }
  };


  const [destinationList, setDestinationList] = useState("");
  console.log(destinationList)

  const handleCheckboxChange2 = (event) => {
    const itemName = event.target.name;
    if (event.target.checked) {
      setDestinationList([...destinationList, itemName]);
    } else {
      setDestinationList(destinationList.filter((item) => item !== itemName));
    }
  };

  const [hotelType, setHotelType] = useState("");

  const handleCheckboxChange3 = (event) => {
    const itemName = event.target.name;
    if (event.target.checked) {
      setHotelType([...hotelType, itemName]);
    } else {
      setHotelType(hotelType.filter((item) => item !== itemName));
    }

  };
  const handleOptionChange = (event) => {
    const { name, value } = event.target;
    setFormData1({ ...formData1, [name]: value })
  };


  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(true)
  const [packageid, setpackageid] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    try {
      const token = localStorage.getItem("sytAdmin");

      const response = await axios.post(
        `${BASE_URL}package`,
        {
          name: formData1.name,
          price_per_person: Number(formData1.price_per_person),
          total_days: formData1.total_days,
          total_nights: formData1.total_nights,
          destination: selectedDestinationId,
          destination_category_id: destinationList,
          meal_required: checkedItems,
          meal_type: formData1.meal_type,
          travel_by: formData1.travel_by,
          hotel_type: hotelType,
          more_details: formData1.more_details,
          sightseeing: formData1.sightseeing,
          place_to_visit_id: selectplacetovisit,
          status: formData1.status,
          include_service: includeServices,
          exclude_service: excludeServices,
          start_date: formData1.start_date,
          end_date: formData1.end_date,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status == "OK") {
        setOpen3(false)
        setOpen2(true)
        setpackageid(response.data.data._id);
        openSuccessSB();
      }
    } catch (error) {

    }


  };





  // get api for select placetovisit

  const [placetovisit, setPlacetovisit] = useState([])


  const places = async () => {
    const token = localStorage.getItem("sytAdmin")

    const res = await fetch(`${BASE_URL}placetovisit`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setPlacetovisit(data.data);
    console.log(data.data);

  };

  useEffect(() => {
    places();
  }, []);


  const [selectplacetovisit, setSelectplacetovisit] = useState("");

  const handleSelectPlace = (event) => {
    const selectedId = event.target.value; // Get the selected option's ID
    setSelectplacetovisit(selectedId); // Update the state with the selected ID
  };



  // get api for select destination

  const [destination, setDestination] = useState([])



  const Dest = async () => {
    const token = localStorage.getItem("sytAdmin")

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

  useEffect(() => {
    Dest();
  }, []);

  // select for destination category 

  const [Destcat, setDestcat] = useState([]);

  useEffect(() => {
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
        console.log(error);
      }
    };
    fetchCategoryList();
  }, []);



  const [selectedDestinationId, setSelectedDestinationId] = useState("");

  const handleSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedDestinationId(selectedId);

  };

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


  const handleRemoveExclude = (index) => {
    // Create a new array without the item to be removed
    const updatedServices = excludeServices.filter((_, i) => i !== index);
    setexcludeServices(updatedServices);
  };

  const [itineraries, setItineraries] = useState([]);
  const [open, setOpen] = useState(false);
  const [formDatait, setFormDatait] = useState({
    title: '',
    photoFile: null,
    description: ''
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Get max number of itineraries allowed
  const maxItineraries = Math.max(Number(formData1.total_days), Number(formData1.total_nights));

  const handleOpen = (index = null) => {
    if (index !== null) {
      setIsEdit(true);
      setEditIndex(index);
      setFormDatait({
        ...itineraries[index],
      });
    } else {
      setIsEdit(false);
      setFormDatait({
        title: '',
        photoFile: null,
        description: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormDatait({
      title: '',
      photoFile: null,
      description: ''
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
    const { title, photoFile, description } = formDatait;
    // if (!title || !photoFile || !description || !selectedHotel) {
    //   alert("All fields are required.");
    //   return;
    // }
    const newItinerary = {
      title: formDatait.title,
      photoFile: formDatait.photoFile,
      description: formDatait.description
    };

    if (isEdit) {
      const updatedItineraries = [...itineraries];
      updatedItineraries[editIndex] = newItinerary;
      setItineraries(updatedItineraries);
    } else {
      setItineraries([...itineraries, newItinerary]);
    }

    handleClose();
  };

  const [selectedHotel, setSelectedHotel] = useState("")

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    if (!itineraries || itineraries.length === 0) {
      openErrorSB();
      return;
    }

    try {
      const token = localStorage.getItem("sytAdmin");

      const requests = itineraries.map((itinerary, index) => {
        const formData = new FormData();
        formData.append("package_id", packageid);
        formData.append("title", itinerary.title);
        formData.append("day", index + 1);
        formData.append("activity", itinerary.description);
        formData.append("hotel_itienrary_id", "66b4c6e78a7a419360f57fee");
        if (itinerary.photoFile) {
          formData.append("photo", itinerary.photoFile);
        }

        return fetch(`${BASE_URL}itinerary`, {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        }).then(response => response.json());
      });

      const responses = await Promise.all(requests);

      const allSuccessful = responses.every(response => response.data.status === "OK");
      console.log(allSuccessful)
      if (allSuccessful) {
        openSuccessSB();
        navigate("/manage-packages");
      }
    } catch (error) {
      console.error("Error submitting itineraries:", error);
    }
  };

  const [hotelList, setHotelList] = useState([])

  const fetchItineraryHotel = async () => {
    const token = localStorage.getItem("vendorToken");
    const res = await fetch(`${BASE_URL}api/hotel_itienrary/displayAgencyById`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    setHotelList(data?.data);
  };

  useEffect(() => {
    fetchItineraryHotel();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Add Package
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {open3 && <form style={{ padding: '20px', maxWidth: '600px', margin: ' 0px auto 50px', border: "2px solid black" }} role="form">
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <select onChange={handleSelect} name="Destinations" style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}>
                  <option selected disabled>Select Destination</option>
                  {destination.map((ele) => (
                    <option key={ele._id} value={ele._id}>{ele.destination_name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <select onChange={handleSelectPlace} name="Destinations" style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}>
                  <option selected disabled>Select Place To Visit</option>
                  {placetovisit.filter(ele => ele.destination_id === selectedDestinationId).map((ele) => (
                    <option key={ele._id} value={ele._id}>{ele.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter package name"
                  value={formData1.name}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '20px', flex: "1" }}>
                <input
                  type="number"
                  name="price_per_person"
                  placeholder="Enter price per person"
                  value={formData1.price_per_person}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px' }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "30px" }}>

              <div style={{ marginBottom: '20px', flex: "1" }}>
                <select
                  name="total_days"
                  value={formData1.total_days}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px' }}
                >
                  <option value="">Select days</option>
                  {[...Array(30).keys()].map(day => (
                    <option key={day + 1} value={day + 1}>{day + 1}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px', flex: "1" }}>
                <select
                  name="total_nights"
                  value={formData1.total_nights}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px' }}
                  disabled={!formData1.total_days}
                >
                  <option value="">Select nights</option>
                  {formData1.total_days && [-1, 0, 1].map(offset => {
                    const nightValue = parseInt(formData1.total_days) + offset;
                    if (nightValue > 0) {
                      return <option key={nightValue} value={nightValue}>{nightValue}</option>;
                    }
                    return null;
                  })}
                </select>
              </div>

            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <label style={{ fontSize: '14px', marginBottom: '8px' }}>Meal Required</label>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="checkbox" name="Breakfast" onChange={handleCheckboxChange} />
                  <label style={{ fontSize: '14px', color: darkMode ? '#ffffffcc' : '' }}>Breakfast</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="checkbox" name="Lunch" onChange={handleCheckboxChange} />
                  <label style={{ fontSize: '14px', color: darkMode ? '#ffffffcc' : '' }}>Lunch</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="checkbox" name="Dinner" onChange={handleCheckboxChange} />
                  <label style={{ fontSize: '14px', color: darkMode ? '#ffffffcc' : '' }}>Dinner</label>
                </div>
              </div>

              <div style={{ marginBottom: '20px', flex: "1" }}>
                <label style={{ fontSize: '14px', marginBottom: '8px' }}>Destination Category</label>
                {Destcat.map((feature) => (
                  <div key={feature._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <input type="checkbox" id={feature._id} name={feature._id} onChange={handleCheckboxChange2} />
                    <label style={{ fontSize: '14px', color: darkMode ? '#ffffffcc' : '', marginBottom: '8px' }} htmlFor={feature._id}>
                      {feature.category_name}
                    </label>
                  </div>
                ))}
              </div>

              {/* <div style={{ marginBottom: '20px', flex: "1" }}>
                <label style={{ fontSize: '14px', marginBottom: '8px' }}>Hotel Type</label>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="checkbox" name="5" onChange={handleCheckboxChange3} />
                  <label style={{ fontSize: '14px', color: darkMode ? '#ffffffcc' : '' }}>5 Star</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="checkbox" name="4" onChange={handleCheckboxChange3} />
                  <label style={{ fontSize: '14px', color: darkMode ? '#ffffffcc' : '' }}>4 Star</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="checkbox" name="3" onChange={handleCheckboxChange3} />
                  <label style={{ fontSize: '14px', color: darkMode ? '#ffffffcc' : '' }}>3 Star</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="checkbox" name="2" onChange={handleCheckboxChange3} />
                  <label style={{ fontSize: '14px', color: darkMode ? '#ffffffcc' : '' }}>2 Star</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input type="checkbox" name="1" onChange={handleCheckboxChange3} />
                  <label style={{ fontSize: '14px', color: darkMode ? '#ffffffcc' : '' }}>1 Star</label>
                </div>
              </div> */}
            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
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
                <select
                  name="travel_by"
                  value={formData1.travel_by}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}
                >
                  <option value="">Select Travel By</option>
                  <option value="Train">Train</option>
                  <option value="Flight">Flight</option>
                  <option value="Car">Car</option>
                  <option value="Bus">Bus</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <select
                  name="sightseeing"
                  value={formData1.sightseeing}
                  onChange={handleOptionChange}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}
                >
                  <option value="">Select Sightseeing</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
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
                        <span style={{ fontSize: "15px" }}>{e}</span>
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
                        <button type="button" onClick={() => handleRemoveExclude(index)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', height: "fit-content", fontSize: "10px" }}>Remove</button>
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
              <textarea
                placeholder="More Detail"
                cols="30"
                rows="7"
                name="more_details"
                value={formData1.more_details}
                onChange={handleOptionChange}
                style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <select
                name="status"
                value={formData1.status}
                onChange={handleOptionChange}
                style={{ width: '100%', padding: '9px 10px', fontSize: '14px', border: '1px solid rgb(216, 216, 216)', borderRadius: '6px', color: 'rgb(122, 131, 139)' }}
              >
                <option value="">Status</option>
                <option value={true}>Active</option>
                <option value={false}>InActive</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ marginBottom: '20px', flex: "1" }}>
                <label style={{ marginBottom: "8px" }}>
                  Start Date
                </label>
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
                <label style={{ marginBottom: "8px" }}>
                  End Date
                </label>
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={handleSubmit} style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px' }}>Submit</button>
            </div>
          </form>}
          {open2 && (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0px auto 50px', border: "2px solid black", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Itinerary</div>
                {itineraries.length < maxItineraries && <Button
                  variant="contained"
                  onClick={() => handleOpen()}
                  className="add-button"
                >
                  Add Itinerary
                </Button>}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {itineraries.map((itinerary, index) => (
                  <div key={index}>
                    <div>{"Day " + (index + 1)}</div>
                    <Card className="itinerary-card" style={{ width: "fit-content" }}>
                      <CardContent>
                        <Typography variant="h5">{itinerary.title}</Typography>
                        {itinerary.photoFile && (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(itinerary.photoFile)}
                            alt={itinerary.title}
                            className="itinerary-photo"
                          />
                        )}
                        <Typography variant="h6">{itinerary?.hotelName}</Typography>
                        <Typography style={{ fontSize: "12px" }}>{itinerary.description}</Typography>
                      </CardContent>
                      <Button onClick={() => handleOpen(index)}>Edit</Button>
                    </Card>
                  </div>
                ))}
              </div>

              <Modal open={open} onClose={handleClose}>
                <div className="modal-content-membershipplan">
                  <div className="modal-header">
                    <Typography variant="h5">{isEdit ? 'Edit Itinerary' : 'Add Itinerary'}</Typography>
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
                    accept="image/*"
                    onChange={handleChangeit}
                    name="photoFile"
                    className="photo-input"
                  />
                  {formDatait.photoFile &&
                    < img
                      src={URL.createObjectURL(formDatait.photoFile)}
                      alt="Preview"
                      className="preview-image"
                      style={{ height: "100px", width: "100px" }}
                    />
                  }
                  <div className='mb-2'>
                    <label htmlFor='text'>Select Hotel</label>
                    <div className='d-flex align-items-center'>
                      <input
                        type='text'
                        name='select_hotel'
                        className='flex-grow-1'
                        value={selectedHotel ? selectedHotel.hotel_name : ""}
                        readOnly
                      />
                      <Button
                        variant='primary'
                        className='ms-2'
                        onClick={() => setShowModal(true)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
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
                  <Button variant="contained" onClick={handleSaveit} className="submit-button">
                    Submit
                  </Button>
                </div>
              </Modal>

              <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body>
                  <div>
                    <h5 className="mb-0 mt-2 ms-2">Select Hotel</h5>
                    <hr />
                    {hotelList && hotelList.map((e, index) => (
                      <div key={index} className="d-flex align-items-start mb-3 mx-4 gap-3">
                        <input
                          type="radio"
                          name="selectedHotel"
                          value={e._id}
                          onChange={() => setSelectedHotel(e)}
                          checked={selectedHotel && selectedHotel._id === e._id}
                          className="mt-2"
                        />
                        <div>
                          <p className="mb-1 cmnp">{e.hotel_name}</p>
                          <p className="mb-1 cmnp">{e?.hotel_address}</p>
                          <p className="mb-1 cmnp">{e?.hotel_city},{e?.hotel_state}</p>
                        </div>
                      </div>
                    ))}
                    <div className="d-flex justify-content-center mt-4 mb-3">
                      <Button
                        variant="primary"
                        style={{
                          backgroundColor: "#155E75",
                        }}
                        onClick={() => setShowModal(false)}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>

              {itineraries.length >= maxItineraries && <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={handleSubmit2}
                  style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px' }}
                >
                  Submit
                </button>
              </div>}
            </div>
          )}


        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
};


export default ManageCategory;
