import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Bill from "layouts/billing/components/Bill";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import Header from "layouts/userdetailbyid/components/Header";

export const GlobleInfo2 = createContext()

const CustReqDetails = () => {
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

    const [details, setDetails] = useState([]);
    const [biddetails, setBidDetails] = useState([]);
    
 
    const [userData, setUserData] = useState(null)

    // const navigate = useNavigate();
    const { userid, customid } = useParams();

    useEffect(() => {
        if (userData) {
            const user = userData[0]?.custom_requirement?.filter(ele => ele._id === customid)
            setDetails(user);
        }

    }, [userData])


    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("sytAdmin")
            const response = await fetch(`${BASE_URL}user/userdetail?_id=${userid}`, {
                headers: {
                    Authorization: token,
                },
            })
            const data = await response.json()

            if (response.ok) {
                setUserData(data.data)
            } else {
                throw new Error("Error fetching user data")
            }
        } catch (error) { }
    }
    useEffect(() => {
        fetchUserData()
    }, [userid])

    const bidDetail = async () => {
        const token = localStorage.getItem("sytAdmin");
        const res = await fetch(
            `${BASE_URL}bidpackage/displaybidpackages?custom_requirement_id=${customid}`,
            {
                method: "GET",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await res.json();
        setBidDetails(data.data);
    };


    useEffect(() => {
        bidDetail();
    }, [customid]);

    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                // const token = localStorage.getItem("sytAdmin");
                const response = await axios.get(
                    `${BASE_URL}destinationcategory`
                );

                setCategoryList(response.data.data);
                setIsLoading(false);
            } catch (error) {
            }
        };

        fetchCategoryList();
    }, []);

    return (
        <GlobleInfo2.Provider value={userData}>
            <DashboardLayout>
                <DashboardNavbar />
                {userData == null && (
                    <Audio
                        height='80'
                        width='80'
                        radius='9'
                        color='green'
                        ariaLabel='loading'
                        wrapperStyle={{ margin: "auto", display: "block" }}
                        wrapperClass=''
                    />
                )}
                {/* <Header> */}
                <MDBox pt={6} pb={3}>
                    <MDBox
                        textAlign="center"
                        mb={4}
                        style={{
                            position: "relative",
                        }}
                    >
                        <MDTypography variant="h4" fontWeight="bold">
                            Custom Requirment detail
                        </MDTypography>
                    </MDBox>
                    <Grid>
                        <div className="my-3" style={{
                            backgroundColor: "white",
                            borderRadius: "15px"
                        }}>
                        </div>
                        {details && details.map((ele) => {
                            return (
                                <>
                                    <div className="py-3 my-3" style={{
                                        backgroundColor: "white",
                                        width: "100%",
                                        borderRadius: "15px"
                                    }}>
                                        <div className="row m-1 gy-3">
                                            <div className="col-md-4 col-sm-6 col-12">
                                                <div className=" pt-4 px-4" style={{
                                                    backgroundColor: "aliceblue",
                                                    height: "240px"
                                                }}>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Departure : <span style={{ color: "#344767", fontWeight: "500", textTransform: "capitalize" }}>{ele.departure}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Destination : <span style={{ color: "#344767", fontWeight: "500", textTransform: "capitalize" }}>{ele.destination}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Travel By : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.travel_by}</span></h5>
                                                    <div>
                                                        <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Total People : </h5>
                                                        <div>
                                                            <p style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }} className="mb-0">Adults : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.total_adult}</span></p>
                                                            <p style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }} className="mb-0">Infants : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.Infant}</span></p>
                                                            <p style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }} className="mb-0">Children : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.total_child}</span></p>
                                                            <p style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }} className="mb-0">Total : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.total_adult + ele.Infant + ele.total_child}</span></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-4 col-sm-6 col-12">
                                                <div className=" pt-4 px-4" style={{
                                                    backgroundColor: "aliceblue",
                                                    height: "240px"
                                                }}>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Package id : <span style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }}>{ele._id}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Name : <span style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }}>{ele.full_name}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Email : <span style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }}>{ele.email_address}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Phone number : <span style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }}>{ele.mobile_no}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>City : <span style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }}>{ele.city}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Budget per person : <span style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }}>{ele.budget_per_person}</span></h5>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-6 col-12" >
                                                <div className=" pt-4 px-4" style={{
                                                    backgroundColor: "aliceblue",
                                                    height: "240px"
                                                }}>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Total travel days : <span style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }}>{ele.total_travel_days}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>hotel : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.hotel_type.join(', ')}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>meal required : <span style={{ color: "#344767", fontWeight: "500" }}>{ele.meal_require.join(', ')}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Personal care : <span style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }}>{ele.personal_care ? 'Yes' : 'No'}</span></h5>
                                                    <h5 style={{ fontSize: "15px", color: "#7b809a" }}>Extra requirments : <span style={{ color: "#344767", fontWeight: "500", fontSize: "12px" }}>{ele.additional_requirement}</span></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })}

                        <div><h5 className="mt-3">BIDS</h5></div>
                        <div className="py-3 mb-3 px-sm-5 px-0" style={{
                            backgroundColor: "white",
                            width: "100%",
                            borderRadius: "15px",
                            overflowX: "auto"
                        }}>
                            <table className="w-100" >
                                <tr className="">
                                    <th className="pb-2 px-md-0 px-sm-3 px-4 " style={{ borderBottom: "1px solid #f0f2f5", color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "13px" }}>Agency name</th>
                                    <th className="pb-2 px-md-0 px-sm-3 px-4 " style={{ borderBottom: "1px solid #f0f2f5", color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "13px" }}>Bid date</th>
                                    <th className="pb-2 px-md-0 px-sm-3 px-4 " style={{ borderBottom: "1px solid #f0f2f5", color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "13px" }}>Price</th>
                                    <th className="pb-2 px-md-0 px-sm-3 px-4 " style={{ borderBottom: "1px solid #f0f2f5", color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "13px" }}>Status</th>
                                    <th className="pb-2 px-md-0 px-sm-3 px-4 " style={{ borderBottom: "1px solid #f0f2f5", color: "#7b809a", fontWeight: "700", opacity: "0.7", fontSize: "13px" }}>More details</th>
                                </tr>
                                {biddetails && biddetails.map((ele) => {
                                    return (
                                        <>
                                            <tr>
                                                <td className="py-1 px-md-0 px-sm-3 px-4" style={{ color: "#344767", fontWeight: "600", fontSize: "15px" }}>
                                                    {typeof ele.Agency === 'string'
                                                        ? ele.Agency
                                                        : (ele.Agency?.agency_name || ele.Agency?.full_name || ele.Agency?.agency_personal_details?.[0]?.full_name || '')}
                                                </td>
                                                <td className="py-1 px-md-0 px-sm-3 px-4" style={{ color: "#7b809a", fontWeight: "600", opacity: "1", fontSize: "14px" }}>{ele.Date}</td>
                                                <td className="py-1 px-md-0 px-sm-3 px-4" style={{ color: "#7b809a", fontWeight: "600", opacity: "1", fontSize: "14px" }}>{ele.total_amount}</td>
                                                <td className="py-1 px-md-0 px-sm-3 px-4" style={{ color: "#7b809a", fontWeight: "600", opacity: "1", fontSize: "14px" }}>{ele?.bid_status}</td>
                                                <td className="py-1 px-md-0 px-sm-3 px-4" style={{ color: "#7b809a", fontWeight: "400", opacity: "1", fontSize: "14px" }}><Link to={`/custom-requirment-compare/${ele._id}`} style={{ color: "#7b809a" }}>view</Link></td>
                                            </tr>
                                        </>
                                    )
                                })}
                            </table>
                        </div>
                    </Grid>
                </MDBox>

                {/* </Header> */}
                {/* Delete Confirmation Dialog */}
                {/* {deleteDialogOpen && (
                    <>
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background: "rgba(0, 0, 0, 0.5)",
                                zIndex: 999,
                            }}
                        ></div>
                        <MDBox
                            backgroundColor="#fff"
                            width="300px"
                            padding="20px"
                            borderRadius="4px"
                            boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
                            textAlign="center"
                            style={{
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
                                borderRadius: "1rem",
                                zIndex: 1000,
                            }}
                        >
                            <MDTypography variant="h6" fontWeight="bold" mb={3}>
                                Confirm Deletion
                            </MDTypography>
                            <MDTypography variant="body1" mb={3}>
                                Are you sure you want to delete this category?
                            </MDTypography>
                            <MDBox display="flex" justifyContent="center">
                                <MDBox
                                    component="button"
                                    type="button"
                                    onClick={handleDelete}
                                    style={{ marginRight: "10px", backgroundColor: "red", cursor: "pointer" }}
                                    padding="8px 16px"
                                    borderRadius="4px"
                                    border="none"
                                >
                                    OK
                                </MDBox>
                                <MDBox
                                    component="button"
                                    type="button"
                                    onClick={closeDeleteDialog}
                                    padding="8px 16px"
                                    borderRadius="4px"
                                    border="none"
                                    cursor="pointer"
                                    style={{ backgroundColor: "green", cursor: "pointer" }}
                                >
                                    Cancel
                                </MDBox>
                            </MDBox>
                        </MDBox>
                    </>
                )} */}
            </DashboardLayout>
        </GlobleInfo2.Provider>

    );
};

export default CustReqDetails;
