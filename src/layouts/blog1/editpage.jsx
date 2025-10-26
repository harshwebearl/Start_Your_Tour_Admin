import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { BASE_URL } from "BASE_URL";
import { Card, Grid, Divider, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Editpage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    headline: "",
    image_1: "",
    subheading_1: "",
    text_1: "",
    subheading_2: "",
    text_2: "",
    subheading_3: "",
    image_2: "",
    image_3: "",
    image_4: "",
    image_5: "",
    image_6: "",
    image_7: "",
    image_8: "",
    image_9: "",
  });

  const [previewImages, setPreviewImages] = useState({});

  useEffect(() => {
    if (!_id) {
      setError("No ID provided in route");
      setLoading(false);
      return;
    }

    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("sytAdmin") || "";
        const res = await axios.get(`${BASE_URL}api/blogger/admin/detail/${_id}`, {
          headers: { Authorization: token },
          cancelToken: source.token,
        });

        const data = res.data?.data || res.data;

        const newForm = {
          headline: data.headline || data.blog_title || "",
          image_1: data.image_1 || data.image || data.blog_owner_photo || "",
          subheading_1: data.subheading_1 || "",
          text_1: data.text_1 || "",
          subheading_2: data.subheading_2 || "",
          text_2: data.text_2 || "",
          subheading_3: data.subheading_3 || "",
          image_2: data.image_2 || "",
          image_3: data.image_3 || "",
          image_4: data.image_4 || "",
          image_5: data.image_5 || "",
          image_6: data.image_6 || "",
          image_7: data.image_7 || "",
          image_8: data.image_8 || "",
          image_9: data.image_9 || "",
        };

        setForm(newForm);

        const previews = {};
        for (let i = 1; i <= 9; i++) {
          const key = `image_${i}`;
          if (newForm[key]) previews[key] = newForm[key];
        }
        setPreviewImages(previews);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Fetch error:", err);
          setError(err.response?.data?.message || "Failed to load data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      source.cancel("Component unmounted");
    };
  }, [_id]);

  useEffect(() => {
    return () => {
      Object.values(previewImages).forEach((url) => {
        try {
          if (typeof url === "string" && url.startsWith("blob:")) URL.revokeObjectURL(url);
        } catch (e) {
          // ignore
        }
      });
    };
  }, [previewImages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewImages[field]?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImages[field]);
    }

    setForm((prev) => ({ ...prev, [field]: file }));
    setPreviewImages((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
  };

  const handleRemoveImage = (field) => {
    if (previewImages[field]?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImages[field]);
    }
    setForm((prev) => ({ ...prev, [field]: "" }));
    setPreviewImages((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[field];
      return newPreviews;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("sytAdmin") || "";
      const formData = new FormData();

      formData.append("_id", _id);
      formData.append("blog_title", form.headline);

      Object.entries(form).forEach(([key, value]) => {
        const mappedKey = key;
        if (key.startsWith("image_")) {
          if (key === "image_1") {
            if (value instanceof File) {
              formData.append(mappedKey, value);
            } else {
              formData.append(mappedKey, value ?? "");
            }
          } else {
            if (value instanceof File) formData.append(mappedKey, value);
          }
        } else {
          formData.append(mappedKey, value ?? "");
        }
      });

      const res = await axios.put(`${BASE_URL}api/blogger/admin/detail/${_id}`, formData, {
        headers: { Authorization: token },
      });

      if (res?.data?.status === "OK" || res?.status === 200) {
        navigate(-1);
      } else {
        throw new Error(res?.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderImageField = (field, label) => (
    <Card
      sx={{
        p: 2,
        height: "100%",
        border: previewImages[field] ? "2px solid #1976d2" : "2px dashed #e0e0e0",
        transition: "all 0.3s ease",
      }}
    >
      <MDTypography variant="button" fontWeight="medium" mb={1} display="block">
        {label}
      </MDTypography>

      {previewImages[field] ? (
        <MDBox position="relative" mb={2}>
          <img
            src={previewImages[field]}
            alt={`preview-${field}`}
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <Tooltip title="Remove Image">
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": { bgcolor: "#fff" },
              }}
              size="small"
              onClick={() => handleRemoveImage(field)}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </MDBox>
      ) : (
        <MDBox
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 2,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            bgcolor: "#f5f5f5",
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: "#999" }} />
        </MDBox>
      )}

      <MDInput
        fullWidth
        multiline
        rows={2}
        label="Image URL"
        name={field}
        value={typeof form[field] === "string" ? form[field] : ""}
        onChange={handleChange}
        sx={{ mb: 1 }}
      />

      <MDButton variant="outlined" color="info" component="label" fullWidth startIcon={<CloudUploadIcon />}>
        Upload Image
        <input type="file" hidden accept="image/*" onChange={handleFileChange(field)} />
      </MDButton>
    </Card>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDTypography variant="h4" fontWeight="bold">
            Edit Blog Post
          </MDTypography>
          <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            Back
          </MDButton>
        </MDBox>

        {loading ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <MDTypography>Loading...</MDTypography>
          </Card>
        ) : error ? (
          <Card sx={{ p: 4, bgcolor: "#ffebee" }}>
            <MDTypography color="error" style={{ color: "#d32f2f" }}>
              Error: {error}
            </MDTypography>
          </Card>
        ) : (
          <form onSubmit={handleSave}>
            {/* Basic Information Section */}
            <Card sx={{ p: 3, mb: 3 }}>
              <MDTypography variant="h6" fontWeight="medium" mb={2}>
                Basic Information
              </MDTypography>
              <Divider sx={{ mb: 2 }} />

              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  multiline
                  rows={3}
                  label="Blog Headline"
                  name="headline"
                  value={form.headline}
                  onChange={handleChange}
                  required
                />
              </MDBox>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {renderImageField("image_1", "Main Featured Image")}
                </Grid>
              </Grid>
            </Card>

            {/* Content Section 1 */}
            <Card sx={{ p: 3, mb: 3 }}>
              <MDTypography variant="h6" fontWeight="medium" mb={2}>
                Content Section 1
              </MDTypography>
              <Divider sx={{ mb: 2 }} />

              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  multiline
                  rows={2}
                  label="Subheading 1"
                  name="subheading_1"
                  value={form.subheading_1}
                  onChange={handleChange}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  multiline
                  rows={6}
                  label="Content Text 1"
                  name="text_1"
                  value={form.text_1}
                  onChange={handleChange}
                />
              </MDBox>
            </Card>

            {/* Content Section 2 */}
            <Card sx={{ p: 3, mb: 3 }}>
              <MDTypography variant="h6" fontWeight="medium" mb={2}>
                Content Section 2
              </MDTypography>
              <Divider sx={{ mb: 2 }} />

              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  multiline
                  rows={2}
                  label="Subheading 2"
                  name="subheading_2"
                  value={form.subheading_2}
                  onChange={handleChange}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  multiline
                  rows={6}
                  label="Content Text 2"
                  name="text_2"
                  value={form.text_2}
                  onChange={handleChange}
                />
              </MDBox>
            </Card>

            {/* Content Section 3 */}
            <Card sx={{ p: 3, mb: 3 }}>
              <MDTypography variant="h6" fontWeight="medium" mb={2}>
                Content Section 3
              </MDTypography>
              <Divider sx={{ mb: 2 }} />

              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  multiline
                  rows={2}
                  label="Subheading 3"
                  name="subheading_3"
                  value={form.subheading_3}
                  onChange={handleChange}
                />
              </MDBox>
            </Card>

            {/* Gallery Section */}
            <Card sx={{ p: 3, mb: 3 }}>
              <MDTypography variant="h6" fontWeight="medium" mb={2}>
                Image Gallery
              </MDTypography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {[2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={n}>
                    {renderImageField(`image_${n}`, `Image ${n}`)}
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Action Buttons */}
            <MDBox display="flex" gap={2} justifyContent="flex-end">
              <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)} size="large">
                Cancel
              </MDButton>
              <MDButton type="submit" variant="gradient" color="info" disabled={loading} size="large">
                {loading ? "Saving..." : "Save Changes"}
              </MDButton>
            </MDBox>
          </form>
        )}
      </MDBox>
    </DashboardLayout>
  );
};

export default Editpage;
