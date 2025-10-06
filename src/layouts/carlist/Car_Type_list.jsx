import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400, md: 500 },
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: { xs: 2, sm: 3, md: 4 },
    maxHeight: "90vh",
    overflowY: "auto",
};

const CarTypeList = () => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [isLoading, setIsLoading] = useState(true);
    const [types, setTypes] = useState([]);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState({ car_type: "" });
    const [isAddMode, setIsAddMode] = useState(true);
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [errorMsg, setErrorMsg] = useState("Please fill in all required fields.");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = (msg) => {
        if (msg) setErrorMsg(msg);
        setErrorSB(true);
    };
    const closeErrorSB = () => setErrorSB(false);

    const fetchTypes = async () => {
        try {
            const res = await axios.get(`${BASE_URL}api/car-types`);
            setTypes(res.data?.data ?? res.data ?? []);
        } catch (err) {
            console.error("GET /api/car-types error:", err?.response ?? err);
            if (err?.response?.data?.message) openErrorSB(err.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleOpenAdd = () => {
        setEditData({ car_type: "" });
        setIsAddMode(true);
        setOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditData(item);
        setIsAddMode(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditData({ car_type: "" });
    };

    const handleChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

    const handleSave = async () => {
        const trimmedType = (editData.car_type || "").toString().trim();
        if (!trimmedType) {
            openErrorSB();
            return;
        }
        try {
            if (isAddMode) {
                const payload = { car_type: trimmedType, name: trimmedType };
                await axios.post(`${BASE_URL}api/car-types`, payload);
            } else {
                const token = localStorage.getItem("sytAdmin");
                const payload = { ...editData, car_type: trimmedType, name: trimmedType };
                await axios.put(`${BASE_URL}api/car-types/${editData._id}`, payload, { headers: { Authorization: token } });
            }
            await fetchTypes();
            openSuccessSB();
            handleClose();
        } catch (err) {
            console.error("Save car type error:", err?.response ?? err);
            const serverMsg = err?.response?.data?.message || err?.response?.data || err.message;
            openErrorSB(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("sytAdmin");
            await axios.delete(`${BASE_URL}api/car-types/${deleteId}`, { headers: { Authorization: token } });
            await fetchTypes();
            setDeleteConfirmOpen(false);
            openSuccessSB();
        } catch (err) {
            console.error("Delete car type error:", err?.response ?? err);
            const serverMsg = err?.response?.data?.message || err?.response?.data || err.message;
            openErrorSB(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={4} pb={3} px={{ xs: 2, sm: 3, md: 4 }}>
                <MDBox textAlign="center" mb={3}>
                    <MDTypography variant="h4" fontWeight="bold">
                        Car Types
                    </MDTypography>
                </MDBox>

                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button className="text-white" variant="contained" onClick={handleOpenAdd}>
                            Add Car Type
                        </Button>
                    </Grid>
                </Grid>

                {isLoading ? (
                    <Grid container>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
                        </Grid>
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                                lg: "repeat(5, 1fr)",
                            },
                        }}
                    >
                        {(types || [])
                            .slice()
                            .reverse()
                            .map((type, idx) => (
                                <Box key={(type && (type._id || type.id)) || idx}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            bgcolor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
                                            borderRadius: 2,
                                            boxShadow: 3,
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" fontWeight="medium">
                                                {type && (type.car_type || type.name || type.type || type.title) || (typeof type === "string" ? type : "Unnamed Car Type")}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                                            <Button size="small" onClick={() => handleOpenEdit(type)}>
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    setDeleteId(type._id);
                                                    setDeleteConfirmOpen(true);
                                                }}
                                                sx={{ color: "#000" }}
                                            >
                                                Delete
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Box>
                            ))}
                    </Box>
                )}

                <Modal open={open} onClose={handleClose}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" mb={2}>
                            {isAddMode ? "Add Car Type" : "Edit Car Type"}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Car Type"
                                    name="car_type"
                                    value={editData.car_type}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} display="flex" justifyContent="space-between">
                                <Button variant="contained" color="success" onClick={handleSave} sx={{ color: "#000000fc" , background:"#2bdc17fc" }}>
                                    Save
                                </Button>
                                <Button variant="outlined" onClick={handleClose} sx={{ color: "#000" }}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>

                <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" mb={2}>
                            Confirm Delete
                        </Typography>
                        <Typography mb={3}>Are you sure you want to delete this car type?</Typography>
                            <Box display="flex" justifyContent="space-between">
                                <Button variant="contained" onClick={handleDelete} sx={{ color: "#000",background:"#e81212fc" }}>
                                    Delete
                                </Button>
                                <Button variant="outlined" onClick={() => setDeleteConfirmOpen(false)} sx={{ color: "#000" }}>
                                    Cancel
                                </Button>
                            </Box>
                    </Box>
                </Modal>

                {successSB && (
                    <MDSnackbar
                        color="success"
                        icon="check"
                        title="Successful"
                        content="Operation was successful."
                        dateTime="1 sec"
                        open={successSB}
                        onClose={closeSuccessSB}
                        close={closeSuccessSB}
                        bgWhite
                    />
                )}

                {errorSB && (
                    <MDSnackbar
                        color="error"
                        icon="warning"
                        title="Error"
                        content={errorMsg}
                        dateTime="1 sec"
                        open={errorSB}
                        onClose={closeErrorSB}
                        close={closeErrorSB}
                        bgWhite
                    />
                )}
            </MDBox>
        </DashboardLayout>
    );
};

export default CarTypeList;
