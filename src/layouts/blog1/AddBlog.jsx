import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { BASE_URL } from "BASE_URL";

const AddBlog = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		headline: "",
		subheading_1: "",
		text_1: "",
		subheading_2: "",
		text_2: "",
		subheading_3: "",
		// keep image slots null by default
		image_1: null,
		image_2: null,
		image_3: null,
		image_4: null,
		image_5: null,
		image_6: null,
		image_7: null,
		image_8: null,
		image_9: null,
	});

	const [preview1, setPreview1] = useState("https://dummyimage.com/200x200/cccccc/ffffff");
	const [successSB, setSuccessSB] = useState(false);
	const [errorSB, setErrorSB] = useState(false);
	const openSuccessSB = () => setSuccessSB(true);
	const closeSuccessSB = () => setSuccessSB(false);
	const openErrorSB = () => setErrorSB(true);
	const closeErrorSB = () => setErrorSB(false);

	const fileInputRefs = useRef({});

	useEffect(() => {
		return () => {
			// revoke preview object URL if any (we used data URL here so nothing to revoke)
		};
	}, []);

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((p) => ({ ...p, [name]: value }));
	}

	function handleFileChange(e) {
		const { name, files } = e.target;
		const file = files && files[0] ? files[0] : null;
		setForm((p) => ({ ...p, [name]: file }));
		if (name === "image_1") {
			if (file) {
				const reader = new FileReader();
				reader.onload = () => setPreview1(reader.result);
				reader.readAsDataURL(file);
			} else {
				setPreview1("https://dummyimage.com/200x200/cccccc/ffffff");
			}
		}
	}

	const renderSuccessSB = (
		<MDSnackbar
			color="success"
			icon="check"
			title="Success"
			content="Blog added successfully"
			dateTime="now"
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
			title="Error"
			content="Please fill required fields"
			dateTime="now"
			open={errorSB}
			onClose={closeErrorSB}
			close={closeErrorSB}
			bgWhite
		/>
	);

	const handleSubmit = async (ev) => {
		ev.preventDefault();
		// minimal validation: headline required
		if (!form.headline) {
			openErrorSB();
			return;
		}

		try {
			const token = localStorage.getItem("sytAdmin");
			const fd = new FormData();
			// append text fields
			fd.append("headline", form.headline || "");
			fd.append("subheading_1", form.subheading_1 || "");
			fd.append("text_1", form.text_1 || "");
			fd.append("subheading_2", form.subheading_2 || "");
			fd.append("text_2", form.text_2 || "");
			fd.append("subheading_3", form.subheading_3 || "");

			// append images if present
			for (let i = 1; i <= 9; i++) {
				const key = `image_${i}`;
				if (form[key]) fd.append(key, form[key]);
			}

			const res = await fetch(`${BASE_URL}api/blogger/blogecontent`, {
				method: "POST",
				headers: token ? { Authorization: token } : {},
				body: fd,
			});
			const data = await res.json();
			if (res.ok && data.status === "OK") {
				openSuccessSB();
				// navigate to blog list after a short delay so snackbar shows
				setTimeout(() => navigate("/blogger"), 900);
			} else {
				console.error("Add blog failed", data);
				openErrorSB();
			}
		} catch (err) {
			console.error(err);
			openErrorSB();
		}
	};

	return (
		<DashboardLayout>
			<DashboardNavbar />
			<MDBox pt={6} pb={3} px={3}>
				<MDBox textAlign="center" mb={4}>
					<MDTypography variant="h4" fontWeight="bold">
						Add Blog 
					</MDTypography>
				</MDBox>

				<form onSubmit={handleSubmit} style={{ maxWidth: 900, margin: "0 auto" }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<MDInput
								label="Headline"
								name="headline"
								value={form.headline}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>

						<Grid item xs={12} sm={4}>
							<MDBox component="img" src={preview1} alt="preview" sx={{ width: 120, height: 120, borderRadius: 1 }} />
						</Grid>
						<Grid item xs={12} sm={8}>
							<MDInput type="file" name="image_1" onChange={handleFileChange} fullWidth accept="image/*" />
						</Grid>

						<Grid item xs={12} sm={6}>
							<MDInput label="Subheading 1" name="subheading_1" value={form.subheading_1} onChange={handleChange} fullWidth />
						</Grid>
						<Grid item xs={12} sm={6}>
							<MDInput label="Subheading 2" name="subheading_2" value={form.subheading_2} onChange={handleChange} fullWidth />
						</Grid>

						<Grid item xs={12}>
							<MDInput label="Text 1" name="text_1" value={form.text_1} onChange={handleChange} fullWidth multiline minRows={4} />
						</Grid>

						<Grid item xs={12}>
							<MDInput label="Text 2" name="text_2" value={form.text_2} onChange={handleChange} fullWidth multiline minRows={4} />
						</Grid>

						<Grid item xs={12} sm={4}>
							<MDInput type="file" name="image_2" onChange={handleFileChange} fullWidth accept="image/*" />
						</Grid>
						<Grid item xs={12} sm={4}>
							<MDInput type="file" name="image_3" onChange={handleFileChange} fullWidth accept="image/*" />
						</Grid>
						<Grid item xs={12} sm={4}>
							<MDInput type="file" name="image_4" onChange={handleFileChange} fullWidth accept="image/*" />
						</Grid>

						<Grid item xs={12} sm={4}>
							<MDInput type="file" name="image_5" onChange={handleFileChange} fullWidth accept="image/*" />
						</Grid>
						<Grid item xs={12} sm={4}>
							<MDInput type="file" name="image_6" onChange={handleFileChange} fullWidth accept="image/*" />
						</Grid>
						<Grid item xs={12} sm={4}>
							<MDInput type="file" name="image_7" onChange={handleFileChange} fullWidth accept="image/*" />
						</Grid>

						<Grid item xs={12} sm={6}>
							<MDInput type="file" name="image_8" onChange={handleFileChange} fullWidth accept="image/*" />
						</Grid>
						<Grid item xs={12} sm={6}>
							<MDInput type="file" name="image_9" onChange={handleFileChange} fullWidth accept="image/*" />
						</Grid>

						<Grid item xs={12}>
							<MDButton variant="gradient" color="info" type="submit" fullWidth>
								Submit
							</MDButton>
						</Grid>
					</Grid>
				</form>

				{renderSuccessSB}
				{renderErrorSB}
			</MDBox>
		</DashboardLayout>
	);
};

export default AddBlog;
