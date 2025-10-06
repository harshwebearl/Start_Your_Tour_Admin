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
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ComplexStatisticsCard1 from "examples/Cards/StatisticsCards/ComplexStatisticsCard copy";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Audio } from "react-loader-spinner";
import axios from "axios";
import { BASE_URL } from "BASE_URL";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  // api call start here

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const token = localStorage.getItem("sytAdmin");

  useEffect(() => {
    // setIsLoading(false);
    getData();

  }, [])
  const getData = async () => {
    try {
      const result = await axios.get(`${BASE_URL}admin/display_dashboard_details`, {
        headers: {
          Authorization: token // Add the Authorization header with the token value
        }
      })
      setData(result.data.data);
      setIsLoading(false);
    } catch (error) {
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {
        isLoading ? <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        /> : (<>
          <MDBox py={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="weekend"
                    title1="User's"
                    title="Total"
                    count={data[0].Top_stats?.Total_User}
                    percentage={[{
                      color: "success",
                      amount: data[0].Top_stats?.This_Month_Male_User,
                      label: "Month's M",
                      title2: "Male",
                    }, {  
                      color: "success",
                      amount: data[0].Top_stats?.This_Year_Male_User,
                      label: "Year's M",
                    }
                      , {
                      color: "success",
                      amount: data[0].Top_stats?.Total_Male_User,
                      label: "Total M",
                    },
                    {
                      color: "success",
                      amount: data[0].Top_stats?.This_Month_Female_User,
                      label: "Month's F",
                    }, {
                      color: "success",
                      amount: data[0].Top_stats?.This_Year_Female_User,
                      label: "Year's F",
                    }
                      , {
                      color: "success",
                      amount: data[0].Top_stats?.Total_Female_User,
                      label: "Total F",
                    }]}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard1
                    icon="leaderboard"
                    title1="Booking"
                    title="Total"
                    count={data[0].Top_stats?.Total_booking}
                    percentage={[{
                      color: "success",
                      amount: data[0].Top_stats?.This_Month_booking,
                      label: "This Month",
                    }, {
                      color: "success",
                      amount: data[0].Top_stats?.This_Year_booking,
                      label: "This Year",
                    }
                      , {
                      color: "success",
                      amount: data[0].Top_stats?.Total_booking,
                      label: "Total",
                    }
                    ]}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard1
                    color="success"
                    icon="store"
                    title1="Package"
                    title="Total"
                    count={data[0].Top_stats?.Total_Custom_Pkg}
                    percentage={[{
                      color: "success",
                      amount: data[0].Top_stats?.This_Month_Custom_Pkg,
                      label: "This Month",
                    }, {
                      color: "success",
                      amount: data[0].Top_stats?.This_Year_Custom_Pkg,
                      label: "This Year",
                    }
                      , {
                      color: "success",
                      amount: data[0].Top_stats?.Total_Custom_Pkg,
                      label: "Total",
                    }
                    ]}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard1
                    color="primary"
                    icon="person_add"
                    title1="Agency"
                    title="Total"
                    count={data[0].Top_stats?.Total_Agency}
                    percentage={[{
                      color: "success",
                      amount: data[0].Top_stats?.This_Month_Agency,
                      label: "This Month",
                    }, {
                      color: "success",
                      amount: data[0].Top_stats?.This_Year_Agency,
                      label: "This Year",
                    }
                      , {
                      color: "success",
                      amount: data[0].Top_stats?.Total_Agency,
                      label: "Total",
                    }
                    ]}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <MDBox mt={4.5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsBarChart
                      color="info"
                      title="website views"
                      description="Last Campaign Performance"
                      date="campaign sent 2 days ago"
                      chart={reportsBarChartData}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsLineChart
                      color="success"
                      title="daily sales"
                      description={
                        <>
                          (<strong>+15%</strong>) increase in today sales.
                        </>
                      }
                      date="updated 4 min ago"
                      chart={sales}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsLineChart
                      color="dark"
                      title="completed tasks"
                      description="Last Campaign Performance"
                      date="just updated"
                      chart={tasks}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={8}>
                  {console.log(data[7])}
                  <Projects data={data}/>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <OrdersOverview data={data} />
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
          <Footer />
        </>)}
    </DashboardLayout>
  );
}

export default Dashboard;
