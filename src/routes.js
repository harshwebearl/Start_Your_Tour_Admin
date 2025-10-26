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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard"
import Tables from "layouts/tables"
import UsersTable from "layouts/userstable"
import VendorsTable from "layouts/vendorstable"
// import PaidMembersTable from "layouts/PaidMembers";
// import UserDetails from "layouts/userdetails";
// import VendorDetails from "layouts/vendordetails";
import Billing from "layouts/billing"
// import RTL from "layouts/rtl";
import Notifications from "layouts/notifications"
import Profile from "layouts/profile"
// import OnlineUsers from "layouts/onlineusers";
import InsertCategory from "layouts/insertcategory"
// import InsertMembershipFeature from "layouts/insertmembershipfeature";
import InsertMembershipPlan from "layouts/insertmembershipplan"
import InsertDestination from "layouts/insertDestination"
import EditDestination from "layouts/editDestination"
import EditCategory from "layouts/editcategory"
import EditMembershipPlan from "layouts/editmembershipplan"
// import EditMembershipFeature from "layouts/editmembershipfeature";
// import MembershipFeature from "layouts/membership-features";
import ManageCategory from "layouts/managecategory"
import ManagePackages from "layouts/managepackages"
import Manage_destination from "layouts/managedestination/Manage_destination"
import Selected_destination from "layouts/selecteddestination/Selected_destination"
import Createselecteddestination from "layouts/selecteddestination/Createselecteddestination"
import BIDDisplay from "layouts/biddisplay"
import BookPackageDisplay from "layouts/bookpackagedisplay"
import SignIn from "layouts/authentication/sign-in"
import OTP from "layouts/authentication/otp"
import ChangePassword from "layouts/authentication/change-password"
import ResetPassword from "layouts/authentication/update-password"
import SignUp from "layouts/authentication/sign-up"
import ForgetPassword from "layouts/authentication/forget-password"
import Logout from "layouts/authentication/logout"
import UserDetailById from "layouts/userdetailbyid"
import VendorDetailById from "layouts/vendordetailbyid"
// @mui icons
import Icon from "@mui/material/Icon"
import CarRepairIcon from '@mui/icons-material/CarRepair';
import Fulldatailpackages from "layouts/managepackages/Fulldatailpackages"
import Manage_pace_to_visit from "layouts/manage_pace_to_visit/Manage_pace_to_visit"
import Places_to_visit from "layouts/manage_pace_to_visit/Places_to_visit"
import Insert_place_to_visit from "layouts/insertplacetovisit/Insert_place_to_visit"
import Edit_place_to_visit from "layouts/editplacetovisit/Edit_place_to_visit"
import Custome_req_list from "layouts/customrequirmentlist/CustomeReqList"
import CustReqDetails from "layouts/customrequirmentlist/CustReqDetails"
import Customvendor from "layouts/customrequirmentlist/Customvendor"
import Hotel from "layouts/hotels/Hotel"
import Aminities from "layouts/aminities/Aminities"
import Room from "layouts/rooms/Room"
import Highlights from "layouts/highlights/Highlights"
import Properties from "layouts/properties/Properties"
import Edithighlights from "layouts/highlights/Edithighlights"
import Editroom from "layouts/rooms/Editroom"
import Editaminities from "layouts/aminities/Editaminities"
import Addhotel from "layouts/hotels/Addhotel"
import Edithotel from "layouts/hotels/Edithotel"
import Fulldetail from "layouts/hotels/Fulldetail"
import Addroom from "layouts/rooms/Addroom"
import Addhighlight from "layouts/highlights/Addhighlight"
import Addaminities from "layouts/aminities/Addaminities"
import Editproperties from "layouts/properties/Editproperties"
import Addproperties from "layouts/properties/Addproperties"
import Blog from "layouts/blog1/BlogPage"
import Blogger from "layouts/blog1/BlogPage" 
import Bloggerfullinfo from "layouts/blog1/Bloggerfullinfo"
import Editpage from "layouts/blog1/editpage";
import AddBlog from "layouts/blog1/AddBlog";
// import Bloggerfullinfo from "layouts/Blog/Bloggerfullinfo"
// import Editblogger from "layouts/Blog/Editblogger"
import Subscription from "layouts/Subscription/Subscription"
// import Addblogger from "layouts/Blog/Addblogger"
// import Addblog from "layouts/Blog/Addblog"
// import Editblog from "layouts/Blog/EditBlog"
import Allfaqs from "layouts/faqs/Allfaqs"
import Addfaqs from "layouts/faqs/Addfaqs"
import Editfaqs from "layouts/faqs/Editfaqs"
import Aboutus from "layouts/aboutus/Aboutus"
import Cancel from "layouts/cancellationpolicies/Cancel"
import Privecypolicies from "layouts/privecypolicies/Privecypolicies"
import Paymentpolicies from "layouts/paymentpolicies/Paymentpolicies"
import BookedPackage from "layouts/bookedpackagedetail/BookePackage"
import HotelBookings from "layouts/hotelbooking/bookingalldetail"
import HotelBookingDetail from "layouts/hotelbooking/bookingdetailbyid"
import PackageBookings from "layouts/packagebooking/bookingalldetail"
// import PackageBookingDetail from "layouts/packagebooking/bookingdetailbyid"
import Car_list from "layouts/carlist/carlist"
import Car_Type_list from "layouts/carlist/Car_Type_list"
import VendorCarDetail from "layouts/vendorcardetail/VendorCarDetail"
import BookedCar from "layouts/bookedcardetail/BookedCar"
import Career from "layouts/career/career"
import AddCareer from "layouts/insertcareer/addcareer"
import Addcareercategory from "layouts/insertcareer/addcareercategory"
import Editcareer from "layouts/editcareer/editcareer"
import AddItineraryHotel from "layouts/itineraryhotels/AddHotels"
import ItineraryHotel from "layouts/itineraryhotels/ItineraryHotels"
import EditItineraryHotel from "layouts/itineraryhotels/EditHotels"
import AddCustomeUser from "layouts/addpackage/AddPackage"
import InsertItinerary from "layouts/addpackage/AddpackageItinerary"
import Profit from "layouts/profit-margin"
import AddProfitMargin from "layouts/profit-margin/Insert"
import Inquiries from "layouts/Inquiries"
import EditPackage from "layouts/addpackage/EditPackage"
import UpdateItinerary from "layouts/addpackage/EditPackageItinerary"
import EditHotel from "layouts/hotels/NewEditHotel"
import NewEditroom from "layouts/rooms/NewEditRoom"
import EditAmenities from "layouts/aminities/NewEditAmenities"
import NewEditProperties from "layouts/properties/NewEditProperties"
import Notification from "layouts/notification"
import AddCar from "layouts/carlist/Addcar"
import { ClassNames } from "@emotion/react"

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize='small'>dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "All Users",
    key: "all-users",
    icon: <Icon fontSize='small'>table_view</Icon>,
    route: "/all-users",
    component: <UsersTable />,
  },
  {
    type: "collapse",
    name: "All Vendors",
    key: "all-vendors",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/all-vendors",
    component: <VendorsTable />,
  },
  {
    type: "collapse",
    name: "Hotel",
    key: "hotel",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/hotel",
    component: <Hotel />,
  },
  {
    type: "collapse",
    name: "Aminities",
    key: "aminities",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/aminities",
    component: <Aminities />,
  },
  {
    type: "collapse",
    name: "Room",
    key: "room",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/room",
    component: <Room />,
  },
  {
    type: "collapse",
    name: "Highlights",
    key: "highlights",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/highlights",
    component: <Highlights />,
  },
  {
    type: "collapse",
    name: "Properties",
    key: "properties",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/properties",
    component: <Properties />,
  },
  {
    type: "collapse",
    name: "Hotel Bookings",
    key: "Hotel Bookings",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/hotel-bookings",
    component: <HotelBookings />,
  },
  {
    type: "collapse",
    name: "Itinerary Hotels",
    key: "Itinerary Hotels",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/itinerary-hotels",
    component: <ItineraryHotel />,
  },
  // {
  //   type: "collapse",
  //   name: "Blogger",
  //   key: "blogger",
  //   icon: <Icon fontSize='small'>backup_table</Icon>,
  //   route: "/blogger",
  //   component: <Blog />,
  // },
  {
    type: "collapse",
    name: "Blog",
    key: "blog",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/blog",
    component: <Blog />,
  },
  {
    type: "collapse",
    name: "Subscription",
    key: "subscription",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/subscription",
    component: <Subscription />,
  },
  {
    type: "collapse",
    name: "Manage Category",
    key: "manage-category",
    icon: <Icon fontSize='small'>category</Icon>,
    route: "/manage-category",
    component: <ManageCategory />,
  },
  {
    type: "collapse",
    name: "Manage Packages",
    key: "manage-packages",
    icon: <Icon fontSize='small'>category</Icon>,
    route: "/manage-packages",
    component: <ManagePackages />,
  },
  {
    type: "collapse",
    name: "Booked Packages",
    key: "manage-booked-packages",
    icon: <Icon fontSize='small'>category</Icon>,
    route: "/booked-packages",
    component: <PackageBookings />,
  },
  {
    type: "collapse",
    name: "Manage Destination",
    key: "manage-destination",
    icon: <Icon fontSize='small'>category</Icon>,
    route: "/manage-destination",
    component: <Manage_destination />,
  },
  {
    type: "collapse",
    name: "Selected Destination",
    key: "Selected-destination",
    icon: <Icon fontSize='small'>category</Icon>,
    route: "/Selected-destination",
    component: <Selected_destination />,
  },
  {
    type: "routes",
    name: "Create Selected Destination",
    key: "create-selected-destination",
    icon: <Icon fontSize='small'>add</Icon>,
    route: "/create-selected-destination",
    component: <Createselecteddestination />,
  },
  {
    type: "collapse",
    name: "Manage Place to Visit",
    key: "manage-place-to-visit",
    icon: <Icon fontSize='small'>category</Icon>,
    route: "/manage-place-to-visit",
    component: <Manage_pace_to_visit />,
  },
  {
    type: "collapse",
    name: "Custom Reqiurment List",
    key: "custom-Requirment-List",
    icon: <Icon fontSize='small'>category</Icon>,
    route: "/custom-Requirment-List",
    component: <Custome_req_list />,
  },
  {
    type: "collapse",
    name: "Car",
    key: "car-list",
    icon: <Icon fontSize='small'>C</Icon>,
    route: "/manage-cars",
    component: <Car_list />,
  },
  {
    type: "collapse",
    name: "Car Type",
    key: "car-type",
    icon: <CarRepairIcon fontSize='small' />,
    route: "/manage-cars-Type",
    component: <Car_Type_list />,
  },
  {
    type: "collapse",
    name: "faqs",
    key: "faqs",
    icon: <Icon fontSize='small'>assignment</Icon>,
    route: "/faqs",
    component: <Allfaqs />,
  },
  {
    type: "collapse",
    name: "Notification",
    key: "notification",
    icon: <Icon fontSize='small'>assignment</Icon>,
    route: "/notification",
    component: <Notification />,
  },
  {
    type: "collapse",
    name: "aboutus",
    key: "aboutus",
    icon: <Icon fontSize='small'>assignment</Icon>,
    route: "/aboutus",
    component: <Aboutus />,
  },
  {
    type: "collapse",
    name: "Cancellation Policy",
    key: "cancel",
    icon: <Icon fontSize='small'>assignment</Icon>,
    route: "/cancel",
    component: <Cancel />,
  },
  {
    type: "collapse",
    name: "Privacy Policy",
    key: "privecypolicies",
    icon: <Icon fontSize='small'>assignment</Icon>,
    route: "/privecypolicies",
    component: <Privecypolicies />,
  },
  {
    type: "collapse",
    name: "Payment Policy",
    key: "paymentpolicies",
    icon: <Icon fontSize='small'>assignment</Icon>,
    route: "/paymentpolicies",
    component: <Paymentpolicies />,
  },
  {
    type: "routes",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize='small'>login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Change Password",
    key: "change-password",
    icon: <Icon fontSize='small'>assignment</Icon>,
    route: "/authentication/change-password",
    component: <ChangePassword />,
  },
  {
    type: "routes",
    name: "Forget Password",
    key: "forget-password",
    icon: <Icon fontSize='small'>password</Icon>,
    route: "/authentication/forget-password",
    component: <ForgetPassword />,
  },
  {
    type: "routes",
    name: "OTP",
    key: "otp",
    icon: <Icon fontSize='small'>password</Icon>,
    route: "/authentication/otp",
    component: <OTP />,
  },
  {
    type: "routes",
    name: "Update Password",
    key: "update-password",
    icon: <Icon fontSize='small'>password</Icon>,
    route: "/authentication/reset-password",
    component: <ResetPassword />,
  },
  {
    type: "routes",
    name: "User Detail Id",
    key: "user-detail-id",
    icon: <Icon fontSize='small'>password</Icon>,
    route: "/user-detail/:_id",
    component: <UserDetailById />,
  },
  {
    type: "routes",
    name: "Vendor Detail Id",
    key: "vendor-detail-id",
    icon: <Icon fontSize='small'>password</Icon>,
    route: "/vendor-detail/:_id",
    component: <VendorDetailById />,
  },
  {
    type: "routes",
    name: "Insert Category",
    key: "insert-category",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/insert-category",
    component: <InsertCategory />,
  },
  {
    type: "routes",
    name: "Insert Addhotel",
    key: "insert-Addhotel",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/insert-Addhotel",
    component: <Addhotel />,
  },
  {
    type: "routes",
    name: "Insert Destination",
    key: "insert-destination",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/insert-destination",
    component: <InsertDestination />,
  },
  {
    type: "routes",
    name: "display places to visit",
    key: "display-places-to-visit",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/Place_to_visit",
    component: <Places_to_visit />,
  },
  {
    type: "routes",
    name: "insert places to visit",
    key: "insert-places-to-visit",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/Insert_place_to_visit",
    component: <Insert_place_to_visit />,
  },
  {
    type: "routes",
    name: "edit places to visit",
    key: "edit-places-to-visit",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/Edit_place_to_visit/:id",
    component: <Edit_place_to_visit />,
  },
  {
    type: "routes",
    name: "Edit Destination",
    key: "edit-destination",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/edit-destination/:id",
    component: <EditDestination />,
  },
  {
    type: "routes",
    name: "Edit hotel",
    key: "edit-hotel",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/edit-hotel/:id",
    component: <Edithotel />,
  },
  {
    type: "routes",
    name: "Update hotel",
    key: "update-hotel",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/update-hotel/:id",
    component: <EditHotel />,
  },
  {
    type: "routes",
    name: "Custome requirment details",
    key: "custome-requirment-details",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/custom-reuirment-details/:userid/:customid",
    component: <CustReqDetails />,
  },
  {
    type: "routes",
    name: "Edit Highlights",
    key: "Edit-Highlights",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/Edit-Highlights/:id",
    component: <Edithighlights />,
  },
  {
    type: "routes",
    name: "Edit Aminities",
    key: "Edit-Aminities",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/Edit-Aminities/:id/:hotel_id",
    component: <Editaminities />,
  },
  {
    type: "routes",
    name: "update-amenities",
    key: "update-amenities",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/update-amenities/:id/:hotel_id",
    component: <EditAmenities />,
  },
  {
    type: "routes",
    name: "Edit properties",
    key: "Edit-properties",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/Edit-properties/:id",
    component: <Editproperties />,
  },
  {
    type: "routes",
    name: "Update Properties",
    key: "update-properties",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/update-properties/:id",
    component: <NewEditProperties />,
  },
  {
    type: "routes",
    name: "Add properties",
    key: "Add-properties",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/Add-properties",
    component: <Addproperties />,
  },
  {
    type: "routes",
    name: "Edit Room",
    key: "Edit-Room",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/Edit-Room/:id",
    component: <Editroom />,
  },
  {
    type: "routes",
    name: "Update Room",
    key: "update-room",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/update-room/:id",
    component: <NewEditroom />,
  },
  {
    type: "routes",
    name: "Full detail",
    key: "Full-detail",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/Full-detail/:id",
    component: <Fulldetail />,
  },
  {
    type: "routes",
    name: "Insert Membership Plan",
    key: "insert-membership-plan",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/insert-membership-plan",
    component: <InsertMembershipPlan />,
  },
  {
    type: "routes",
    name: "Insert new room",
    key: "add-new-room",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/add-new-room",
    component: <Addroom />,
  },
  {
    type: "routes",
    name: "Insert new highlight",
    key: "add-new-highlight",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/add-new-highlight",
    component: <Addhighlight />,
  },
  {
    type: "routes",
    name: "Insert new aminities",
    key: "add-new-aminities",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/add-new-aminities",
    component: <Addaminities />,
  },
  {
    type: "routes",
    name: "Insert new FAQS",
    key: "add-new-FAQS",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/add-new-faqs",
    component: <Addfaqs />,
  },
  {
    type: "routes",
    name: "edit FAQS",
    key: "edit-FAQS",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/edit-faqs/:_id",
    component: <Editfaqs />,
  },
  {
    type: "routes",
    name: "bid display",
    key: "bid display",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/bid/:_id",
    component: <BIDDisplay />,
  },
  {
    type: "routes",
    name: "book package display",
    key: "book package display",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/bid/:_id/:agency_id/:id",
    component: <BookPackageDisplay />,
  },
  {
    type: "routes",
    name: "Edit Membership Plan",
    key: "edit-membership-plan",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/edit-category/:_id",
    component: <EditCategory />,
  },
  {
    type: "routes",
    name: "Edit Category",
    key: "edit-membership-plan",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/edit-membership-plan/:id",
    component: <EditMembershipPlan />,
  },
  {
    type: "routes",
    name: "Edit Category",
    key: "edit-membership-plan",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/full-details/:id",
    component: <Fulldatailpackages />,
  },
  {
    type: "routes",
    name: "Custome vendor",
    key: "custome-vendor",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/custom-requirment-compare/:id",
    component: <Customvendor />,
  },
  {
    type: "routes",
    name: "Blogger",
    key: "Blogger",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/Blogger",
    component: <Blogger/>,
  },
  {
    type: "routes",
    name: "Bloggerfullinfo",
    key: "Bloggerfullinfo",
    icon: <Icon fontSize='small'>article</Icon>,
    route: "/blogger/:_id",
    component: <Bloggerfullinfo />,
  },
  {
    type: "routes",
    name: "Edit Blog",
    key: "edit-blog",
    icon: <Icon fontSize='small'>edit</Icon>,
    route: "/blogger/edit/:_id",
    component: <Editpage />,
  },
  {
    type: "routes",
    name: "Add Blog",
    key: "add-blog",
    icon: <Icon fontSize='small'>add</Icon>,
    route: "/blogger/add",
    component: <AddBlog />,
  },
  // {
  //   type: "routes",
  //   name: "Bloggerfullinfo",
  //   key: "Bloggerfullinfo",
  //   icon: <Icon fontSize='small'>add_box</Icon>,
  //   route: "/Bloggerfullinfo/:_id",
  //   component: <Bloggerfullinfo />,
  // },
  // {
  //   type: "routes",
  //   name: "Editblogger",
  //   key: "Editblogger",
  //   icon: <Icon fontSize='small'>add_box</Icon>,
  //   route: "/Editblogger/:_id",
  //   component: <Editblogger />,
  // },
  // {
  //   type: "routes",
  //   name: "EditBlog",
  //   key: "EditBlog",
  //   icon: <Icon fontSize='small'>add_box</Icon>,
  //   route: "/EditBlog/:_id/:id",
  //   component: <Editblog />,
  // },
  // {
  //   type: "routes",
  //   name: "Addblogger",
  //   key: "Addblogger",
  //   icon: <Icon fontSize='small'>add_box</Icon>,
  //   route: "/Addblogger",
  //   component: <Addblogger />,
  // },
  {
    type: "routes",
    name: "BookedPackage",
    key: "BookedPackage",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/booked-package-detail/:bookid",
    component: <BookedPackage />,
  },
  {
    type: "routes",
    name: "HotelBookingDetail",
    key: "HotelBookingDetail",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/hotel-booking-detail/:id",
    component: <HotelBookingDetail />,
  },
  {
    type: "routes",
    name: "vendorCarDetail",
    key: "vendorCarDetail",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/vendor-car-detail/:id",
    component: <VendorCarDetail />,
  },
  {
    type: "routes",
    name: "BookedCar",
    key: "BookedCar",
    icon: <Icon fontSize='small'>add_box</Icon>,
    route: "/booked-car-detail/:bookid",
    component: <BookedCar />
  },
  {
    type: "collapse",
    name: "Career",
    key: "career",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/career",
    component: <Career />,
  },
  {
    type: "routes",
    name: "Add Career",
    key: "add-career",
    icon: <Icon fontSize="small">password</Icon>,
    route: "/insertcareer",
    component: <AddCareer />,
  },
  {
    type: "routes",
    name: "Add Career Category",
    key: "add-career-category",
    icon: <Icon fontSize="small">password</Icon>,
    route: "/insertcareercategory",
    component: <Addcareercategory />,
  },
  {
    type: "routes",
    name: "Edit Career Category",
    key: "edit-career-category",
    icon: <Icon fontSize="small">password</Icon>,
    route: "/editcareercategory/:_id",
    component: <Editcareer />,
  },
  {
    type: "collapse",
    name: "Profit Margin",
    key: "Profit Margin",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/profit-margin",
    component: <Profit />,
  },
  {
    type: "collapse",
    name: "Inquiries",
    key: "Inquiries",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/inquiries",
    component: <Inquiries />,
  },
  {
    type: "routes",
    name: "Insert Itinerary Hotels",
    key: "Insert Itinerary Hotels",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/insert-itinerary-hotels",
    component: <AddItineraryHotel />,
  },
  {
    type: "routes",
    name: "Edit Itinerary Hotels",
    key: "Edit Itinerary Hotels",
    icon: <Icon fontSize='small'>backup_table</Icon>,
    route: "/edit-itinerary-hotels/:id",
    component: <EditItineraryHotel />,
  },
  {
    type: "routes",
    name: "Insert Package",
    key: "inser-package",
    icon: <Icon fontSize="small">password</Icon>,
    route: "/insert-package/:package_id?",
    component: <AddCustomeUser />,
  },
  {
    type: "routes",
    name: "Update Package",
    key: "update-package",
    icon: <Icon fontSize="small">password</Icon>,
    route: "/update-package/:package_id",
    component: <EditPackage />,
  },
  {
    type: "routes",
    name: "Insert Package Itinerary",
    key: "inser-package-itinerary",
    icon: <Icon fontSize="small">password</Icon>,
    route: "/insert-package-itinerary/:package_id",
    component: <InsertItinerary />,
  },
  {
    type: "routes",
    name: "Update Package Itinerary",
    key: "update-package-itinerary",
    icon: <Icon fontSize="small">password</Icon>,
    route: "/update-package-itinerary/:package_id/:itinerary_id?",
    component: <UpdateItinerary />,
  },
  {
    type: "routes",
    name: "Insert Profit Margin",
    key: "insert-profit-margin",
    icon: <Icon fontSize="small">password</Icon>,
    route: "/insert-profit-margin/:_id?",
    component: <AddProfitMargin />,
  },
  {
    type: "routes",
    name: "Add Car",
    key: "add-car",
    icon: <Icon fontSize="small">password</Icon>,
    route: "/add-car/:_id?",
    component: <AddCar />,
  },
  // {
  //   type: "collapse",
  //   name: "Logout",
  //   key: "logout",
  //   icon: <Icon fontSize='small'>password</Icon>,
  //   route: "/logout",
  //   component: <Logout />,
  // },
]

export default routes
