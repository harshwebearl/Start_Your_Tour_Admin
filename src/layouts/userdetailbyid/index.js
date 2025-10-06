import Grid from "@mui/material/Grid"
import { useNavigate } from "react-router-dom"


import { makeStyles } from "@mui/styles"
// Material Dashboard 2 React components
import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography"

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"
import Footer from "examples/Footer"


// Overview page components
import Header from "layouts/userdetailbyid/components/Header"

import Pagination from "@mui/lab/Pagination"
import { createTheme, useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"


import { useParams } from "react-router-dom"
import { createContext, useEffect, useState } from "react"
import { Audio } from "react-loader-spinner"
import { BASE_URL } from "BASE_URL"

import { Card, CardContent, CardActions, Button, Typography } from "@material-ui/core"
import DataTable from "examples/Tables/DataTable"
import authorsTableData from "layouts/vendordetailbyid/data/authorsTableData"
import bookedPackageTableData from "layouts/vendordetailbyid/data/bookedPackageTable"

export const GlobleInfo = createContext()
function UserDetail() {
  const { _id } = useParams()
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null)
  const [bookedData, setBookedData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const customTheme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 750,
        md: 1050,
        lg: 1280,
        xl: 1920,
      },
    },
  })
  const isMobile = useMediaQuery(customTheme.breakpoints.down("600px"))
  const isTablet = useMediaQuery(customTheme.breakpoints.between("sm", "md"))

  let entriesPerPage = 3
  if (isMobile) {
    entriesPerPage = 1
  } else if (isTablet) {
    entriesPerPage = 2
  }

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("sytAdmin")
      const response = await fetch(`${BASE_URL}user/userdetail?_id=${_id}`, {
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
  }, [])


  const fetchBookedData = async () => {
    try {
      const token = localStorage.getItem("sytAdmin")
      const response = await fetch(`${BASE_URL}bookpackage/admin_booked_package_list?user_id=${_id}`, {
        headers: {
          Authorization: token,
        },
      })
      const data = await response.json()

      if (response.ok) {
        setBookedData(data.data)
      } else {
        throw new Error("Error fetching user data")
      }
    } catch (error) { }
  }
  useEffect(() => {
    fetchBookedData()
  }, [])

  const { columns, rows: allRows, isLoading } = authorsTableData()
  const { columns: columns1, rows: allRows1, isLoading1 } = bookedPackageTableData();

  return (
    <GlobleInfo.Provider value={userData}>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
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
        <Header
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        >

          {selectedTab === 0 ?
            (<MDBox mt={5} mb={3}>

              <Grid item xs={12}>
                <Card>
                  <MDBox
                    py={2}
                    px={2}
                    variant='gradient'
                    bgColor='info'
                    borderRadius='lg'
                    coloredShadow='info'
                  >
                    <MDTypography variant='h6' color='white'>
                      Custome Requirments ({allRows.length})
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>
                    {isLoading ? (
                      <Audio
                        height='80'
                        width='80'
                        radius='9'
                        color='green'
                        ariaLabel='loading'
                        wrapperStyle
                        wrapperClass
                      />
                    ) : (
                      <DataTable
                        table={{ columns, rows: allRows }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                      />
                    )}
                  </MDBox>
                </Card>
              </Grid>
            </MDBox>
            )
            :
            (
              <MDBox mt={5} mb={3}>
                <Grid item xs={12}>
                  <Card>
                    <MDBox
                      py={2}
                      px={2}
                      variant='gradient'
                      bgColor='info'
                      borderRadius='lg'
                      coloredShadow='info'
                    >
                      <MDTypography variant='h6' color='white'>
                        Booked Package ({allRows1?.length})
                      </MDTypography>
                    </MDBox>
                    <MDBox pt={3}>
                      {isLoading1 ? (
                        <Audio
                          height='80'
                          width='80'
                          radius='9'
                          color='green'
                          ariaLabel='loading'
                          wrapperStyle
                          wrapperClass
                        />
                      ) : (
                        <DataTable
                          table={{ columns: columns1, rows: allRows1 }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                        />
                      )}
                    </MDBox>
                  </Card>
                </Grid>

              </MDBox>
            )}
        </Header>

        <Footer />
      </DashboardLayout>
    </GlobleInfo.Provider>
  )
}

export default UserDetail

{/* <h3 style={{ display: "flex", justifyContent: "center" }}>
  Booked Packages
</h3>
<Grid container spacing={1} style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>

  {bookedData != null &&
    bookedData
      .reverse()
      .map((requirement, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={index}
        >
          <Card style={{ display: "flex" }}>
            <CardContent style={{ width: "350px", height: "240px" }}>
              <Typography style={{ fontSize: "16px", textTransform: "capitalize" }} color="text.secondary" gutterBottom>
                {requirement.departure} - {requirement.destination || requirement.package_destination}
              </Typography>
              <Typography style={{ fontSize: "14px", marginBottom: "10px" }} color="text.secondary" gutterBottom>
                Travel Between:
                <div>{requirement.approx_start_date.slice(0, 10)} - {requirement.approx_end_date.slice(0, 10)}</div>
              </Typography>
              <Typography style={{ fontSize: "14px", marginBottom: "10px" }} color="text.secondary" gutterBottom>
                Total Persons: {requirement.total_adult + requirement.total_child + requirement.total_infant}
              </Typography>
              <Typography style={{ fontSize: "14px" }} component="div">
                Agency Contact number- {requirement.agency_phone_no || requirement.package_agency_phone_no}
              </Typography>
              <Typography style={{ fontSize: "14px", marginBottom: "10px" }} color="text.secondary">
                Package Price:{requirement.agencyprice || requirement.package_agencyprice}
              </Typography>
              <Typography style={{ fontSize: "14px" }} variant="body2">
                Booking Data : {requirement.bookdate.slice(0, 10)}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" style={{ alignSelf: "flex-end", color: "blue" }} onClick={() => navigate(`/booked-package-detail/${requirement._id}`)}>View</Button>
            </CardActions>
          </Card>

        </Grid>
      ))}
</Grid> */}