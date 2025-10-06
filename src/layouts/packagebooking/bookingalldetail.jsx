import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import InputLabel from "@mui/material/InputLabel"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import SearchIcon from "@mui/icons-material/Search"
import { TextField, IconButton, Button } from "@mui/material"
import axios from "axios"

import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography"
import { Audio } from "react-loader-spinner"

import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"
import Footer from "examples/Footer"
import DataTable from "examples/Tables/DataTable"
import { useEffect, useState } from "react"

import authorsTableData from "layouts/packagebooking/data/authorsTableData"
import projectsTableData from "layouts/tables/data/projectsTableData"

function PackageBookings() {
    const { columns, rows: allRows, isLoading } = authorsTableData();
    const [filteredRows, setFilteredRows] = useState(allRows);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase()
        setSearchTerm(searchTerm)

        const filteredData = allRows.filter((row) => {
            const name = row.package_details?.toLowerCase() || ""
            const nameMatch = name.includes(searchTerm)
            return nameMatch;
        })

        setFilteredRows(filteredData)
    };

    useEffect(() => {
        setFilteredRows(allRows)
    }, [isLoading])

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xl={4}>
                        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <div style={{ flex: 1 }}>
                                <TextField
                                    fullWidth
                                    id='search'
                                    label='Search Package Name'
                                    value={searchTerm}
                                    variant='outlined'
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant='gradient'
                                bgColor='info'
                                borderRadius='lg'
                                coloredShadow='info'
                            >
                                <MDTypography variant='h6' color='white'>
                                    All Package Bookings ({filteredRows.length})
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
                                        table={{ columns, rows: filteredRows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                )}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default PackageBookings;

