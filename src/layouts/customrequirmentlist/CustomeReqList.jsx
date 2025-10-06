// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Grid from "@mui/material/Grid";
// import { useMaterialUIController } from "context";
// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import { Audio } from "react-loader-spinner";
// import MDAvatar from "components/MDAvatar";
// import { Link } from "react-router-dom";
// import { NavLink } from "react-router-dom";
// import Bill from "layouts/billing/components/Bill";
// import Button from 'react-bootstrap/Button';
// import Offcanvas from 'react-bootstrap/Offcanvas';
// import { TextField, IconButton } from '@mui/material';


// // Material Dashboard 2 React example components
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Icon from "@mui/material/Icon";
// import MDButton from "components/MDButton";
// import MDSnackbar from "components/MDSnackbar";
// import { BASE_URL } from "BASE_URL";

// const rightDate = (dateString) => {
//     const [year, month, day] = dateString?.split('-');
//     return `${day}-${month}-${year}`;
// };

// const Custome_req_list = () => {
//     const [categoryList, setCategoryList] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [controller] = useMaterialUIController();
//     const { darkMode } = controller;
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [successSB, setSuccessSB] = useState(false);
//     const openSuccessSB = () => setSuccessSB(true);
//     const closeSuccessSB = () => setSuccessSB(false);
//     const renderSuccessSB = (
//         <MDSnackbar
//             color="success"
//             icon="check"
//             title="Successful Deleted"
//             content="Category is successfully Deleted."
//             dateTime="1 sec"
//             open={successSB}
//             onClose={closeSuccessSB}
//             close={closeSuccessSB}
//             bgWhite
//         />
//     );
//     useEffect(() => {
//         const fetchCategoryList = async () => {
//             try {
//                 const token = localStorage.getItem("sytAdmin");
//                 const response = await axios.get(
//                     `${BASE_URL}customrequirements/Adminshowdata`, {
//                     headers: {
//                         Authorization: token,
//                     },
//                 }
//                 );

//                 setCategoryList(response.data.data);
//                 setIsLoading(false);
//             } catch (error) {
//             }
//         };

//         fetchCategoryList();
//     }, []);


//     const openDeleteDialog = (category) => {
//         setSelectedCategory(category);
//         setDeleteDialogOpen(true);
//     };
//     const shouldShowAddButton = () => {
//         const screenWidth =
//             window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
//         return screenWidth < 650;
//     };
//     const closeDeleteDialog = () => {
//         setDeleteDialogOpen(false);
//     };

//     const [search, setSearch] = useState('');
//     const [show, setShow] = useState(false);

//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);

//     const [startdate, setStartdate] = useState('');
//     const [enddate, setEnddate] = useState('');
//     const [destination, setDestinationdate] = useState('');
//     const [departure, setDeparture] = useState('');
//     const [minbudget, setMinbudget] = useState(0);
//     const [maxbudget, setMaxbudget] = useState(10000000000000);

//     const handlestartdate = (e) => {
//         const selectedDate = e.target.value;
//         setStartdate(selectedDate);
//     }
//     const handleenddate = (e) => {
//         const endDate = e.target.value;
//         const date = new Date();

//         let day = date.getDate();
//         let month = date.getMonth() + 1;
//         let year = date.getFullYear();

//         let currentDate = `${day}-${month}-${year}`;
//         setEnddate(endDate);
//     }
//     const handledestination = (e) => {
//         const Sdate = e.target.value;
//         setDestinationdate(Sdate);
//     }
//     const handledeparture = (e) => {
//         const Sdate = e.target.value;
//         setDeparture(Sdate);
//     }
//     const handleminimumbudget = (e) => {
//         // Remove non-numeric characters using regex
//         const inputValue = e.target.value.replace(/\D/g, '');

//         // Update the state with the cleaned numeric value
//         setMinbudget(inputValue === "" ? 0 : parseInt(inputValue, 10));
//     }
//     const handlemaximumbudget = (e) => {
//         // Remove non-numeric characters using regex
//         const inputValue = e.target.value.replace(/[^0-9]/g, '');

//         // Update the state with the cleaned numeric value
//         setMaxbudget(inputValue === "" ? 10000000000000 : parseInt(inputValue, 10));
//     }

//     useEffect(() => {
//         const x = categoryList.filter((category) => {
//             const departureLower = departure.toLowerCase();
//             const destinationLower = destination.toLowerCase();
//             const matchesDeparture = departure ? category.departure.toLowerCase().includes(departureLower) : true;
//             const matchesDestination = destination ? category.destination.toLowerCase().includes(destinationLower) : true;
//             const matchesMinBudget = minbudget ? category.budget_per_person >= minbudget : true;
//             const matchesMaxBudget = maxbudget ? category.budget_per_person <= maxbudget : true;

//             return matchesDeparture && matchesDestination && matchesMinBudget && matchesMaxBudget;
//         })

//     }, [categoryList])



//     const [filteredRows, setFilteredRows] = useState()
//     const handleSubmit = async () => {

//     }


//     return (
//         <DashboardLayout>
//             <DashboardNavbar />
//             <MDBox pt={6} pb={3} style={{ opacity: deleteDialogOpen ? 0.3 : 1 }}>
//                 <MDBox
//                     textAlign="center"
//                     mb={4}
//                     style={{
//                         position: "relative",
//                     }}
//                 >
//                     <MDTypography variant="h4" fontWeight="bold">
//                         Custom  Requirment List
//                     </MDTypography>
//                     {/* <Button className="float-end" variant="" style={{ backgroundColor: "black", color: "white", position: "absolute", right: "0", top: "0" }} onClick={handleShow}>
//                         Filter
//                     </Button> */}

//                 </MDBox>
//                 <Grid container spacing={3}>

//                     <Grid item xl={2}>
//                         <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                             <div style={{ flex: 1 }}>
//                                 <TextField
//                                     fullWidth
//                                     id='search'
//                                     label='Departure'
//                                     variant='outlined'
//                                     onChange={handledeparture}
//                                 />
//                             </div>
//                         </div>
//                     </Grid>
//                     <Grid item xl={2}>
//                         <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                             <div style={{ flex: 1 }}>
//                                 <TextField
//                                     fullWidth
//                                     id='search'
//                                     label='Destination'
//                                     variant='outlined'
//                                     onChange={handledestination}
//                                 />
//                             </div>
//                         </div>
//                     </Grid>
//                     <Grid item xl={2}>
//                         <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                             <div style={{ flex: 1 }}>
//                                 <TextField
//                                     fullWidth
//                                     id='search'
//                                     label='Minimum Price'
//                                     variant='outlined'
//                                     onChange={handleminimumbudget}
//                                 />
//                             </div>
//                         </div>
//                     </Grid>
//                     <Grid item xl={2}>
//                         <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                             <div style={{ flex: 1 }}>
//                                 <TextField
//                                     fullWidth
//                                     id='search'
//                                     label='Maximum Price'
//                                     variant='outlined'
//                                     onChange={handlemaximumbudget}
//                                 />
//                             </div>
//                         </div>
//                     </Grid>
//                     <Grid item xl={2}>
//                         <TextField
//                             fullWidth
//                             id="start-date"
//                             label="Start Date"
//                             type="date"
//                             onChange={handlestartdate}
//                             value={startdate}
//                             InputLabelProps={{
//                                 shrink: true,
//                             }}
//                         />
//                     </Grid>
//                     <Grid item xl={2}>
//                         <TextField
//                             fullWidth
//                             id="end-date"
//                             label="End Date"
//                             type="date"
//                             onChange={handleenddate}
//                             value={enddate}
//                             InputLabelProps={{
//                                 shrink: true,
//                             }}
//                         />
//                     </Grid>
//                 </Grid>

//                 <Grid container spacing={3} className="mt-2">
//                     {/* {console.log(categoryList)} */}
//                     {isLoading ? (
//                         <Grid item xs={12}>
//                             <Audio
//                                 height="80"
//                                 width="80"
//                                 radius="9"
//                                 color="green"
//                                 ariaLabel="loading"
//                                 wrapperStyle
//                                 wrapperClass
//                             />
//                         </Grid>
//                     ) : (
//                         categoryList.filter((category) => {
//                             const departureLower = departure.toLowerCase();
//                             const destinationLower = destination.toLowerCase();
//                             const matchesDeparture = departure ? category.departure.toLowerCase().includes(departureLower) : true;
//                             const matchesDestination = destination ? category.destination.toLowerCase().includes(destinationLower) : true;
//                             const matchesMinBudget = minbudget ? category.budget_per_person >= minbudget : true;
//                             const matchesMaxBudget = maxbudget ? category.budget_per_person <= maxbudget : true;
//                             const matchesStartDate = startdate ? category.start_date >= startdate : true;
//                             const matchesEndDate = enddate ? category.end_date <= enddate : true;
//                             return matchesDeparture && matchesDestination && matchesMinBudget && matchesMaxBudget
//                                 && matchesStartDate && matchesEndDate;
//                         })
//                             .reverse()
//                             .map((category, index) => (
//                                 <Grid item xs={12} sm={6} md={4} key={category._id}>

//                                     <MDBox
//                                         component="li"
//                                         display="flex"
//                                         alignItems="center"
//                                         py={1}
//                                         mb={1}
//                                         style={{
//                                             backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
//                                             borderRadius: "8px",
//                                             boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//                                             transition: "background-color 0.3s ease",
//                                             position: "relative",
//                                         }}
//                                     >
//                                         <MDBox p={0} m={0}>
//                                             <Link to={`/custom-reuirment-details/${category.user_id}/${category._id}`} style={{ color: "black" }}>
//                                                 <div className="px-3 py-3">
//                                                     <h5 className="mb-3" style={{ color: "#344767" }}>{category.full_name}</h5>
//                                                     <div>
//                                                         <p className="mb-0" style={{ fontSize: "12px", color: "#7b809a", fontWeight: "700" }}>Departure to Destination : <span style={{ color: "#344767", fontWeight: "500" }}><span>{category.departure}</span> To <span>{category.destination}</span></span></p>
//                                                         <p className="mb-0" style={{ fontSize: "12px", color: "#7b809a", fontWeight: "700" }}>Date : <span style={{ color: "#344767", fontWeight: "500" }}><span>{rightDate(category.start_date.slice(0, 10))}</span> TO <span>{rightDate(category.end_date.slice(0, 10))}</span></span></p>
//                                                         <p className="mb-0" style={{ fontSize: "12px", color: "#7b809a", fontWeight: "700" }}>Budget : <span style={{ color: "#344767", fontWeight: "500" }}>{category.budget_per_person}</span></p>
//                                                         <p className="mb-0" style={{ fontSize: "12px", color: "#7b809a", fontWeight: "700" }}>Total Bid : <span style={{ color: "#344767", fontWeight: "500" }}>{category.bid_count}</span></p>
//                                                         <p className="mb-0" style={{ fontSize: "12px", color: "#7b809a", fontWeight: "700" }}>Bid Status : <span style={{ color: "#344767", fontWeight: "500" }}>{category.bid_count}</span></p>
//                                                     </div>
//                                                 </div>
//                                             </Link>
//                                         </MDBox>
//                                     </MDBox>
//                                 </Grid>
//                             ))
//                     )}
//                 </Grid>
//             </MDBox>
//         </DashboardLayout>
//     );
// };

// export default Custome_req_list;






































import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Bill from "layouts/billing/components/Bill";
import { TextField, IconButton } from '@mui/material';
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";

const rightDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.slice(0, 10).split('-');
    return `${day}-${month}-${year}`;
};

const Custome_req_list = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successful Deleted"
            content="Category is successfully Deleted."
            dateTime="1 sec"
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                const token = localStorage.getItem("sytAdmin");
                const response = await axios.get(
                    `${BASE_URL}customrequirements/Adminshowdata`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                setCategoryList(response.data.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategoryList();
    }, []);

    const openDeleteDialog = (category) => {
        setSelectedCategory(category);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    const [startdate, setStartdate] = useState('');
    const [enddate, setEnddate] = useState('');
    const [destination, setDestination] = useState('');
    const [departure, setDeparture] = useState('');
    const [minbudget, setMinbudget] = useState('');
    const [maxbudget, setMaxbudget] = useState('');

    const handlestartdate = (e) => {
        setStartdate(e.target.value);
    };

    const handleenddate = (e) => {
        setEnddate(e.target.value);
    };

    const handledestination = (e) => {
        setDestination(e.target.value);
    };

    const handledeparture = (e) => {
        setDeparture(e.target.value);
    };

    const handleminimumbudget = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setMinbudget(value);
    };

    const handlemaximumbudget = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setMaxbudget(value);
    };

    const filteredCategories = categoryList.filter((category) => {
        const departureLower = departure.toLowerCase();
        const destinationLower = destination.toLowerCase();
        const matchesDeparture = departure ? category.departure.toLowerCase().includes(departureLower) : true;
        const matchesDestination = destination ? category.destination.toLowerCase().includes(destinationLower) : true;
        const minBudgetNum = parseInt(minbudget) || 0;
        const maxBudgetNum = parseInt(maxbudget) || Infinity;
        const matchesMinBudget = category.budget_per_person >= minBudgetNum;
        const matchesMaxBudget = category.budget_per_person <= maxBudgetNum;
        const matchesStartDate = startdate ? category.start_date >= startdate : true;
        const matchesEndDate = enddate ? category.end_date <= enddate : true;
        return matchesDeparture && matchesDestination && matchesMinBudget && matchesMaxBudget
            && matchesStartDate && matchesEndDate;
    });

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={4} pb={3} px={{ xs: 2, sm: 3, md: 4 }} sx={{ opacity: deleteDialogOpen ? 0.3 : 1 }}>
                <MDBox textAlign="center" mb={3}>
                    <MDTypography variant="h4" fontWeight="bold">
                        Custom Requirement List
                    </MDTypography>
                </MDBox>

                <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} mb={3}>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <TextField
                            fullWidth
                            label="Departure"
                            variant="outlined"
                            value={departure}
                            onChange={handledeparture}
                            sx={{ mb: { xs: 1, sm: 0 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <TextField
                            fullWidth
                            label="Destination"
                            variant="outlined"
                            value={destination}
                            onChange={handledestination}
                            sx={{ mb: { xs: 1, sm: 0 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <TextField
                            fullWidth
                            label="Minimum Price"
                            variant="outlined"
                            value={minbudget}
                            onChange={handleminimumbudget}
                            inputProps={{ inputMode: 'numeric' }}
                            sx={{ mb: { xs: 1, sm: 0 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <TextField
                            fullWidth
                            label="Maximum Price"
                            variant="outlined"
                            value={maxbudget}
                            onChange={handlemaximumbudget}
                            inputProps={{ inputMode: 'numeric' }}
                            sx={{ mb: { xs: 1, sm: 0 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <TextField
                            fullWidth
                            id="start-date"
                            label="Start Date"
                            type="date"
                            value={startdate}
                            onChange={handlestartdate}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ inputProps: { min: new Date().toISOString().split('T')[0] } }}
                            sx={{ mb: { xs: 1, sm: 0 }, '& .MuiInputBase-root': { height: 44 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <TextField
                            fullWidth
                            id="end-date"
                            label="End Date"
                            type="date"
                            value={enddate}
                            onChange={handleenddate}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ inputProps: { min: startdate || new Date().toISOString().split('T')[0] } }}
                            sx={{ mb: { xs: 1, sm: 0 }, '& .MuiInputBase-root': { height: 44 } }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={{ xs: 2, sm: 3 }} className="mt-2">
                    {isLoading ? (
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <Audio
                                height="80"
                                width="80"
                                radius="9"
                                color="green"
                                ariaLabel="loading"
                            />
                        </Grid>
                    ) : (
                        filteredCategories
                            .reverse()
                            .map((category) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={category._id}>
                                    <MDBox
                                        component="li"
                                        display="flex"
                                        alignItems="center"
                                        py={2}
                                        mb={2}
                                        sx={{
                                            backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
                                            borderRadius: 2,
                                            boxShadow: 1,
                                            transition: "background-color 0.3s ease",
                                            position: "relative",
                                            height: "100%",
                                            textDecoration: "none",
                                            color: "inherit",
                                            '&:hover': {
                                                boxShadow: 3,
                                            }
                                        }}
                                    >
                                        <Link
                                            to={`/custom-reuirment-details/${category.user_id}/${category._id}`}
                                            style={{ textDecoration: "none", color: "inherit", width: "100%" }}
                                        >
                                            <MDBox p={2} sx={{ width: "100%" }}>
                                                <MDTypography variant="h6" mb={2} sx={{ color: "#344767" }}>
                                                    {category.full_name}
                                                </MDTypography>
                                                <MDTypography variant="body2" sx={{ mb: 1, fontSize: "14px", color: "#7b809a", fontWeight: 700 }}>
                                                    Departure to Destination: <span style={{ color: "#344767", fontWeight: 500 }}>{category.departure} To {category.destination}</span>
                                                </MDTypography>
                                                <MDTypography variant="body2" sx={{ mb: 1, fontSize: "14px", color: "#7b809a", fontWeight: 700 }}>
                                                    Date: <span style={{ color: "#344767", fontWeight: 500 }}>{rightDate(category.start_date)} TO {rightDate(category.end_date)}</span>
                                                </MDTypography>
                                                <MDTypography variant="body2" sx={{ mb: 1, fontSize: "14px", color: "#7b809a", fontWeight: 700 }}>
                                                    Budget: <span style={{ color: "#344767", fontWeight: 500 }}>{category.budget_per_person}</span>
                                                </MDTypography>
                                                <MDTypography variant="body2" sx={{ mb: 1, fontSize: "14px", color: "#7b809a", fontWeight: 700 }}>
                                                    Total Bid: <span style={{ color: "#344767", fontWeight: 500 }}>{category.bid_count}</span>
                                                </MDTypography>
                                                <MDTypography variant="body2" sx={{ fontSize: "14px", color: "#7b809a", fontWeight: 700 }}>
                                                    Bid Status: <span style={{ color: "#344767", fontWeight: 500 }}>{category.bid_count}</span>
                                                </MDTypography>
                                            </MDBox>
                                        </Link>
                                    </MDBox>
                                </Grid>
                            ))
                    )}
                </Grid>

                {renderSuccessSB}
            </MDBox>
        </DashboardLayout>
    );
};

export default Custome_req_list;