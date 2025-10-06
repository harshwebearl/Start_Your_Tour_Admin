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
import React, { useState, useEffect } from 'react';
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview(data) {
  useEffect(() => {
    // setData1(data.data[5].top_5_booking_dest);
    // setTitle("Destination");
    handleSubmitDest();
    // handleSubmittravelAgency();
  }, [data])
  const [data1, setData1] = useState();
  const [title, setTitle] = useState();
  const [showSecondRow, setShowSecondRow] = useState(false);
  const handleSubmitDest = () => {
    setShowSecondRow(false);
    setData1(data.data[5].top_5_booking_dest);
    setTitle("Destination");
  }
  const handleSubmitReqDest = () => {
    setShowSecondRow(false);
    setData1(data.data[6].top_5_custom_req_dest);
    setTitle("Custom Request");
  }
  const handleSubmittravelAgency = () => {
    setShowSecondRow(true);
    setData1(data.data[1].top_agency_1_month);
    setTitle("Travel Agency Monthly");
  }
  const handleSubmittravelAgency3 = () => {
    setShowSecondRow(true);
    setData1(data.data[2].top_agency_3_month);
    setTitle("Travel Agency Quarterly");
  }
  const handleSubmittravelAgency6 = () => {
    setShowSecondRow(true);
    setData1(data.data[3].top_agency_6_month);
    setTitle("Travel Agency Semi-annually");
  }
  const handleSubmittravelAgency12 = () => {
    setShowSecondRow(true);
    setData1(data.data[4].top_agency_12_month);
    setTitle("Travel Agency Annually");
  }
  function generateTimelineItems(data) {
    const items = Object.entries(data);
    return Object.entries(data).map(([city, count], index) => (
      <TimelineItem
        key={`${city}-${count}-${index}`} // Generate a unique key using city, count, and index
        color="success"
        icon="notifications"
        title={`${city}: ${count}`}
        // dateTime="22 DEC 7:20 PM"
        {...(index === items.length - 1 && { lastItem: true })} // Add lastItem prop to the last item
      />
    ));
  }
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Top 5 {title}
        </MDTypography>
        {/* <MDBox mt={0} mb={2}> */}
        {/* <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            this month
          </MDTypography> */}
        {/* <MDButton
            variant="gradient"
            color="info"
            // component={Link}
            // to="/dashboard"
            type="buttom"
            onClick={handleSubmitDest}
            className="me-2"
            style={{ width: "37%" }}
          >
            Destination
          </MDButton>
          <MDButton
            variant="gradient"
            color="info"
            // component={Link}
            // to="/dashboard"
            type="buttom"
            onClick={handleSubmitReqDest}
            className=""
          >
            Custom Request
          </MDButton>
        </MDBox> */}
        <div className="row mt-1">
          <div className="col-lg-6 col-md-6 col-sm-12 mb-1">
            <MDButton
              variant="gradient"
              color="info"
              // component={Link}
              // to="/dashboard"
              type="buttom"
              onClick={handleSubmitDest}
              className="w-100 h-100 w-sm-50 "
              // style={{ width: "100%" }}
            >
              Destination
            </MDButton>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mb-1 ml-2" >
            <MDButton
              variant="gradient"
              color="info"
              // component={Link}
              // to="/dashboard"
              type="buttom"
              onClick={handleSubmitReqDest}
              className="w-100 h-100 w-sm-50"
            >
              Custom Request
            </MDButton>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mb-1 mt-1">
            <MDButton
              variant="gradient"
              color="info"
              // component={Link}
              // to="/dashboard"
              type="buttom"
              onClick={handleSubmittravelAgency}
              className="w-100 h-100 w-md-50 w-lg-50 "
            >
              travel agency
            </MDButton>
          </div>
        </div>
        {showSecondRow && ( <div className="row">
          <div className="col-lg-3 col-md-4 col-sm-12 mb-1">
            <MDButton
              variant="gradient"
              color="info"
              // component={Link}
              // to="/dashboard"
              type="buttom"
              onClick={handleSubmittravelAgency}
              className="w-100 h-100 w-sm-50"
              // style={{ width: "37%" }}
            >
              Monthly
            </MDButton>
          </div>
          <div className="col-lg-3 col-md-4 col-sm-12 mb-1" >
            <MDButton
              variant="gradient"
              color="info"
              // component={Link}
              // to="/dashboard"
              type="buttom"
              onClick={handleSubmittravelAgency3}
              className="w-100 h-100 w-sm-50"
            >
              Quar-terly
            </MDButton>
          </div>
          <div className="col-lg-3 col-md-4 col-sm-12 mb-1 ">
            <MDButton
              variant="gradient"
              color="info"
              // component={Link}
              // to="/dashboard"
              type="buttom"
              onClick={handleSubmittravelAgency6}
              className="w-100 h-100 w-md-50"
            >
              Semi-annually
            </MDButton>
          </div>
          <div className="col-lg-3 col-md-4 col-sm-12 mb-1 ">
            <MDButton
              variant="gradient"
              color="info"
              // component={Link}
              // to="/dashboard"
              type="buttom"
              onClick={handleSubmittravelAgency12}
              className="w-100 h-100 w-md-50"
            >
              Annu-ally
            </MDButton>
          </div>
        </div>)}
      </MDBox>
      <MDBox p={2}>
        {/* <TimelineItem
          color="success"
          icon="notifications"
          title="$2400, Design changes"
          dateTime="22 DEC 7:20 PM"
        />
        <TimelineItem
          color="error"
          icon="inventory_2"
          title="New order #1832412"
          dateTime="21 DEC 11 PM"
        />
        <TimelineItem
          color="info"
          icon="shopping_cart"
          title="Server payments for April"
          dateTime="21 DEC 9:34 PM"
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="New card added for order #4395133"
          dateTime="20 DEC 2:20 AM"
        />
        <TimelineItem
          color="primary"
          icon="vpn_key"
          title="New card added for order #4395133"
          dateTime="18 DEC 4:54 AM"
          lastItem
        />
         <TimelineItem
          color="success"
          icon="notifications"
          title="$2400, Design changes"
          dateTime="22 DEC 7:20 PM"
        />
        <TimelineItem
          color="error"
          icon="inventory_2"
          title="New order #1832412"
          dateTime="21 DEC 11 PM"
        />
        <TimelineItem
          color="info"
          icon="shopping_cart"
          title="Server payments for April"
          dateTime="21 DEC 9:34 PM"
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="New card added for order #4395133"
          dateTime="20 DEC 2:20 AM"
        />
        <TimelineItem
          color="primary"
          icon="vpn_key"
          title="New card added for order #4395133"
          dateTime="18 DEC 4:54 AM"
          lastItem
        /> */}
        {/* {data1?.map((item, index) => (
          <TimelineItem
            key={index} // Use the index as the key for simplicity
            color="success"
            icon="notifications"
            title={`${item.city}: ${item.count}`}
            dateTime="22 DEC 7:20 PM"
          />
        ))} */}

        {generateTimelineItems(data1 ? data1 : [])}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
