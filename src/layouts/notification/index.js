import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import Data from "./data/authorsTableData";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Icon, Button, Modal, TextField, CircularProgress } from "@mui/material";
import MDButton from "components/MDButton";
import { BASE_URL } from "BASE_URL";
import MDSnackbar from "components/MDSnackbar";

const Notification = () => {
    const { columns, rows } = Data();

    const [openModal, setOpenModal] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successfull Added"
            content="Notification Sent Successfully."
            dateTime="1 sec"
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title="Filled Error"
            content={errorMessage}
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );

    const handleSubmit = async () => {
        
        if(!title || !message) {
            openErrorSB()
            setErrorMessage("Please fill all the fields.");
            return;
        }
        setLoading(true);

        try {
            const token = localStorage.getItem("sytAdmin");
            const response = await fetch(`${BASE_URL}notification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    title,
                    text: message,
                }),
            });

            if (response.ok) {
                openSuccessSB()
                setTitle("");
                setMessage("");
                handleCloseModal();
            } else {
                openErrorSB()
                setErrorMessage("Failed to send notification.");
            }
        } catch (error) {
            openErrorSB()
            setErrorMessage("An error occurred while sending the notification.");
        } finally {
            setLoading(false);
        }
    };

    const shouldShowAddButton = () => {
        const screenWidth =
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        return screenWidth < 650;
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={0} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card></Card>
                    </Grid>
                </Grid>
            </MDBox>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                    Notifications({rows.length})
                                </MDTypography>
                                <MDButton
                                    variant="gradient"
                                    color="dark"
                                    style={{ position: "absolute", top: "-1%", right: "8%" }}
                                    onClick={handleOpenModal}
                                >
                                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                                    &nbsp;{shouldShowAddButton() ? "" : "New Notification"}
                                </MDButton>
                            </MDBox>
                            <MDBox pt={2}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={7}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />

            {/* Modal */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <MDBox
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      xs: "300px", // for small screens
      sm: "400px", // for sm and up
    },
    background: "white",
    padding: "20px",
    borderRadius: "8px",
  }}
                >
                    <MDTypography variant="h5" mb={2}>
                        New Notification
                    </MDTypography>
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Message"
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <MDBox mt={2} display="flex" justifyContent="flex-end" width="100%">
                        <MDButton variant="contained" color="secondary" onClick={handleCloseModal} disabled={loading}>
                            Cancel
                        </MDButton>
                        <MDButton
                            variant="contained"
                            color="info"
                            onClick={handleSubmit}
                            style={{ marginLeft: "10px" }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} style={{ color: "white" }} /> : "Submit"}
                        </MDButton>
                    </MDBox>
                </MDBox>
            </Modal>
            {renderSuccessSB}
            {renderErrorSB}
        </DashboardLayout>
    );
};

export default Notification;
