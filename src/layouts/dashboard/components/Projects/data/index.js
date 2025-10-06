// /* eslint-disable react/prop-types */
// /* eslint-disable react/function-component-definition */
// /**
// =========================================================
// * Material Dashboard 2 React - v2.2.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2023 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */

// // @mui material components
// import Tooltip from "@mui/material/Tooltip";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDAvatar from "components/MDAvatar";
// import MDProgress from "components/MDProgress";

// // Images
// import logoXD from "assets/images/small-logos/logo-xd.svg";
// import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
// import logoSlack from "assets/images/small-logos/logo-slack.svg";
// import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
// import logoJira from "assets/images/small-logos/logo-jira.svg";
// import logoInvesion from "assets/images/small-logos/logo-invision.svg";
// import team1 from "assets/images/team-1.jpg";
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";

// export default function data() {
//   const avatars = (members) =>
//     members.map(([image, name]) => (
//       <Tooltip key={name} title={name} placeholder="bottom">
//         <MDAvatar
//           src={image}
//           alt="name"
//           size="xs"
//           sx={{
//             border: ({ borders: { borderWidth }, palette: { white } }) =>
//               `${borderWidth[2]} solid ${white.main}`,
//             cursor: "pointer",
//             position: "relative",

//             "&:not(:first-of-type)": {
//               ml: -1.25,
//             },

//             "&:hover, &:focus": {
//               zIndex: "10",
//             },
//           }}
//         />
//       </Tooltip>
//     ));

//   const Company = ({ image, name }) => (
//     <MDBox display="flex" alignItems="center" lineHeight={1}>
//       <MDAvatar src={image} name={name} size="sm" />
//       <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
//         {name}
//       </MDTypography>
//     </MDBox>
//   );

//   return {
//     columns: [
//       { Header: "companies", accessor: "companies", width: "45%", align: "left" },
//       { Header: "members", accessor: "members", width: "10%", align: "left" },
//       { Header: "budget", accessor: "budget", align: "center" },
//       { Header: "completion", accessor: "completion", align: "center" },
//     ],

//     rows: [
//       {
//         companies: <Company image={logoXD} name="Material UI XD Version" />,
//         members: (
//           <MDBox display="flex" py={1}>
//             {avatars([
//               [team1, "Ryan Tompson"],
//               [team2, "Romina Hadid"],
//               [team3, "Alexander Smith"],
//               [team4, "Jessica Doe"],
//             ])}
//           </MDBox>
//         ),
//         budget: (
//           <MDTypography variant="caption" color="text" fontWeight="medium">
//             $14,000
//           </MDTypography>
//         ),
//         completion: (
//           <MDBox width="8rem" textAlign="left">
//             <MDProgress value={60} color="info" variant="gradient" label={false} />
//           </MDBox>
//         ),
//       },
//       {
//         companies: <Company image={logoAtlassian} name="Add Progress Track" />,
//         members: (
//           <MDBox display="flex" py={1}>
//             {avatars([
//               [team2, "Romina Hadid"],
//               [team4, "Jessica Doe"],
//             ])}
//           </MDBox>
//         ),
//         budget: (
//           <MDTypography variant="caption" color="text" fontWeight="medium">
//             $3,000
//           </MDTypography>
//         ),
//         completion: (
//           <MDBox width="8rem" textAlign="left">
//             <MDProgress value={10} color="info" variant="gradient" label={false} />
//           </MDBox>
//         ),
//       },
//       {
//         companies: <Company image={logoSlack} name="Fix Platform Errors" />,
//         members: (
//           <MDBox display="flex" py={1}>
//             {avatars([
//               [team1, "Ryan Tompson"],
//               [team3, "Alexander Smith"],
//             ])}
//           </MDBox>
//         ),
//         budget: (
//           <MDTypography variant="caption" color="text" fontWeight="medium">
//             Not set
//           </MDTypography>
//         ),
//         completion: (
//           <MDBox width="8rem" textAlign="left">
//             <MDProgress value={100} color="success" variant="gradient" label={false} />
//           </MDBox>
//         ),
//       },
//       {
//         companies: <Company image={logoSpotify} name="Launch our Mobile App" />,
//         members: (
//           <MDBox display="flex" py={1}>
//             {avatars([
//               [team4, "Jessica Doe"],
//               [team3, "Alexander Smith"],
//               [team2, "Romina Hadid"],
//               [team1, "Ryan Tompson"],
//             ])}
//           </MDBox>
//         ),
//         budget: (
//           <MDTypography variant="caption" color="text" fontWeight="medium">
//             $20,500
//           </MDTypography>
//         ),
//         completion: (
//           <MDBox width="8rem" textAlign="left">
//             <MDProgress value={100} color="success" variant="gradient" label={false} />
//           </MDBox>
//         ),
//       },
//       {
//         companies: <Company image={logoJira} name="Add the New Pricing Page" />,
//         members: (
//           <MDBox display="flex" py={1}>
//             {avatars([[team4, "Jessica Doe"]])}
//           </MDBox>
//         ),
//         budget: (
//           <MDTypography variant="caption" color="text" fontWeight="medium">
//             $500
//           </MDTypography>
//         ),
//         completion: (
//           <MDBox width="8rem" textAlign="left">
//             <MDProgress value={25} color="info" variant="gradient" label={false} />
//           </MDBox>
//         ),
//       },
//       {
//         companies: <Company image={logoInvesion} name="Redesign New Online Shop" />,
//         members: (
//           <MDBox display="flex" py={1}>
//             {avatars([
//               [team1, "Ryan Tompson"],
//               [team4, "Jessica Doe"],
//             ])}
//           </MDBox>
//         ),
//         budget: (
//           <MDTypography variant="caption" color="text" fontWeight="medium">
//             $2,000
//           </MDTypography>
//         ),
//         completion: (
//           <MDBox width="8rem" textAlign="left">
//             <MDProgress value={40} color="info" variant="gradient" label={false} />
//           </MDBox>
//         ),
//       },
//     ],
//   };
// }
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import PropTypes from "prop-types";

// Images
import logoXD from "assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

export default function data() {
  const User = ({ image, name, motherTongue }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      {/* <MDAvatar src={image} name={name} size="sm" /> */}
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{motherTongue}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  User.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    motherTongue: PropTypes.string,
  };
  // useEffect(() => {
  //   const fetchUserList = async () => {
  //     // alert("hello from project")
  //     try {
  //       const token = localStorage.getItem("sytAdmin");
  //       const response = await axios.get("http://4.224.45.103:4000/admin/display_dashboard_details", {
  //         headers: {
  //           Authorization: token,
  //         },
  //       });
  //       setUserList(response.data.data[7].Top_30_book_packages);
  //       setIsLoading(false);
  //     } catch (error) {
  //     }
  //   };
  //   fetchUserList();
  // }, []);
  const columns = [
    // { Header: "User", accessor: "user", width: "25%", align: "left" },
    { Header: "booking date", accessor: "bookingDate", align: "left" },
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
    bookingDate: new Date (user?.bookdate).toLocaleDateString(),
    customerName: user.customer[0]?.name,
    agencyName: user?.agency_name,
    departure: user?.departure,
    destination: user?.destination,
    departureDate: user?.departure_date,
    // homeTown: user.home_town?user.home_town:"NULL",
    // height: user.height,
    // member_type:user.member_type,
    totalPrice:user?.total_person * user?.priceperperson,
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
      <NavLink to={`/user-detail/${user.customer[0]._id}`}>
      {/* 64b679cd935481b5598bbd26 */}
      {/* 64b4ed6ec3f5099c79c82289 */}
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
  return {
    
columns,rows,isLoading
   
  };
}
