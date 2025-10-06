/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { NavLink } from "react-router-dom";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
// import data1 from "layouts/dashboard/components/Projects/data";

function Projects(data) {
  // const { columns1, rows1 } = data1();
  const [menu, setMenu] = useState(null);
  const [userList, setDataTd] = useState();
  console.log(userList?.[0]?.destination);
  console.log(userList?.[0]?.destination_arrival_date);
  const [userList1, setDataTd1] = useState();
  const [name, setName] = useState("Top 30 Booked Packages");
  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);
  // setDataTd(data?data.data[7].Top_30_book_packages:"");
  useEffect(() => {
    setDataTd(data?.data[7].Top_30_book_packages || "");
    setDataTd1(data?.data[8].Top_30_custom_req || "");
  }, [data]);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );


  //table data start's here
  const columns = [
    // { Header: "User", accessor: "user", width: "25%", align: "left" },
    { Header: "Booking Date", accessor: "bookingDate", align: "left" },
    { Header: "customer name", accessor: "customerName", align: "left" },
    { Header: "agency name", accessor: "agencyName", align: "left" },
    { Header: "departure", accessor: "departure", align: "left" },
    { Header: "destination", accessor: "destination", align: "left" },
    { Header: "departure date", accessor: "departureDate", align: "left" },
    { Header: "total price", accessor: "totalPrice", align: "left" },
    { Header: "status", accessor: "status", align: "left" },
    // { Header: "Community", accessor: "community", align: "left" },
    // { Header: "Home Town", accessor: "homeTown", align: "left" },
    // { Header: "Height", accessor: "height", align: "left" },
    // { Header: "Member Type", accessor: "member_type", align: "left" },

    { Header: "Action", accessor: "action", align: "center" },
  ];
  const userListArray = Array.isArray(userList) ? userList : [];
  const rows = userListArray.map((user) => ({

    // user: (
    //   <User
    //     image={
    //       user.profile_photo ||
    //       "https://www.shutterstock.com/image-vector/man-icon-vector-260nw-1040084344.jpg"
    //     }
    //     name={user.User_Details[0]?.user_name}
    //     motherTongue={user.User_Details[0]?.mother_tongue || "Hindi"}
    //   />
    // ),
    // age: user.age,
    bookingDate: new Date(user?.bookdate).toLocaleDateString(),
    customerName: user?.customer?.[0]?.customer_detail?.[0]?.name,
    agencyName : user.bids?.[0]?.AgencyPersonals?.[0]?.AgencyPersonalsDetails?.[0]?.full_name ?? "",
    departure: user.departure ? user.departure : "",
    destination: user?.destination || "", // Remove [0] as user is already the current item
    departureDate: user?.destination_arrival_date ? 
      new Date(user.destination_arrival_date).toLocaleDateString('en-GB') : "",
    
    // homeTown: user.home_town?user.home_town:"NULL",
    // height: user.height,
    // member_type:user.member_type,
    totalPrice: user?.total_amount,
    status: user?.status,

  
    action: (
      <NavLink to={`/user-detail/${user.user_registration_id}`}>
        <MDTypography
          component="a"
          // href={`/user-detail/${user._id}`}
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          View
        </MDTypography>
      </NavLink>
    ),
  }));
  //table 2 code start's here 
  const columns1 = [
    // { Header: "User", accessor: "user", width: "25%", align: "left" },
    { Header: "Departure", accessor: "Departure", align: "left" },
    { Header: "Destination", accessor: "Destination", align: "left" },
    { Header: "Customer Name", accessor: "CustomerName", align: "left" },
    { Header: "post date", accessor: "postdate", align: "left" },
    { Header: "Budget", accessor: "Budget", align: "left" },
    { Header: "Departure between", accessor: "Departurebetween", align: "left" },
    { Header: "total bid", accessor: "totalbid", align: "left" },
    { Header: "status", accessor: "status", align: "left" },
    // { Header: "Community", accessor: "community", align: "left" },
    // { Header: "Home Town", accessor: "homeTown", align: "left" },
    // { Header: "Height", accessor: "height", align: "left" },
    // { Header: "Member Type", accessor: "member_type", align: "left" },

    { Header: "Action", accessor: "action", align: "center" },
  ];
  const userListArray1 = Array.isArray(userList1) ? userList1 : [];
  const rows1 = userListArray1.map((user) => ({

    // user: (
    //   <User
    //     image={
    //       user.profile_photo ||
    //       "https://www.shutterstock.com/image-vector/man-icon-vector-260nw-1040084344.jpg"
    //     }
    //     name={user.User_Details[0]?.user_name}
    //     motherTongue={user.User_Details[0]?.mother_tongue || "Hindi"}
    //   />
    // ),
    // age: user.age,
    Departure: user?.departure,
    Destination: user?.destination,
    CustomerName: user.User_details[0]?user.User_details[0].name:"",
    postdate: new Date(user?.createdAt).toLocaleDateString(),
    Budget: user?.budget_per_person,
    Departurebetween: new Date(user?.start_date).toLocaleDateString()+" - "+new Date(user?.end_date).toLocaleDateString(),
    // homeTown: user.home_town?user.home_town:"NULL",
    // height: user.height,
    // member_type:user.member_type,
    totalbid: user.bids?user.bids.length:"",
    status: user?.status,
    // action: (
    //   // <MDTypography component="a" href={`/user-detail/${user._id}`} variant="caption" color="text" fontWeight="medium">
    //   <MDTypography        component="a" href={`/user-detail/${user._id}`}variant="caption"color="text"fontWeight="medium">
    //     Edit
    //   </MDTypography>
    //   // <Link to={`/venders-detail/${user._id}`}>
    //   //   <MDTypography component="span" variant="caption" color="text" fontWeight="medium">
    //   //     Edit
    //   //   </MDTypography>
    //   // </Link>
    // ),
    action: (
      <NavLink to={`/user-detail/${user._id}`}>
        <MDTypography
          component="a"
          // href={`/user-detail/${user._id}`}
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          View
        </MDTypography>
      </NavLink>
    ),
  }));


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {name}
          </MDTypography>
          <MDBox display="flex" gap={2} alignItems="center" lineHeight={0} flexWrap="wrap"  justifyContent="center">
            {/* <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>30 done</strong> this month
            </MDTypography> */}
             <MDButton
    variant="gradient"
    color="info"
    onClick={() => setName("Top 30 Booked Packages")}
    sx={{
      flex: { xs: "1 1 100%", sm: "1 1 0" }, // full width on mobile, equal share on larger
      minWidth: "160px", // ensures same min size
      flexGrow: 1        // makes them equal size
    }}
  >
    Booked <br /> Packages
  </MDButton>
              <MDButton
    variant="gradient"
    color="info"
    onClick={() => setName("Top 30 Custom Requirements")}
    sx={{
      flex: { xs: "1 1 100%", sm: "1 1 0" },
      minWidth: "160px",
      flexGrow: 1
    }}
  >
    Custom <br /> Requirements
  </MDButton>
            {/* <MDButton
            variant="gradient"
            color="info"
            // component={Link}
            // to="/dashboard"
            type="buttom"
            // onClick={handleSubmitDest}
            className="me-2"
            // style={{ width: "37%" }}
          >
            6 Month
          </MDButton>
          <MDButton
            variant="gradient"
            color="info"
            // component={Link}
            // to="/dashboard"
            type="buttom"
            // onClick={handleSubmitReqDest}
            className=""
          >
            12 Month
          </MDButton> */}
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <DataTable
          table={name === "Top 30 Booked Packages" ? { columns: columns, rows: rows } : { columns: columns1, rows: rows1 }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />

      </MDBox>
    </Card>
  );
}

export default Projects;
