// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import CardMedia from "@mui/material/CardMedia";
// import CardContent from "@mui/material/CardContent";
// import CardActions from "@mui/material/CardActions";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import TextField from '@mui/material/TextField';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// // import Footer from "examples/Footer";
// import { BASE_URL as Base } from "../../BASE_URL";
// import DOMPurify from "dompurify";

// // Replaced static sample data with dynamic fetch from /api/blogger

// export default function BlogPage() {
// 	const navigate = useNavigate();
// 	const [blogs, setBlogs] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);
// 	const [editOpen, setEditOpen] = useState(false);
// 	const [currentId, setCurrentId] = useState(null);
// 	const [detail, setDetail] = useState({});
// 	const [jsonFields, setJsonFields] = useState([]);
// 	const [saving, setSaving] = useState(false);
// 	const [confirmOpenDelete, setConfirmOpenDelete] = useState(false);
// 	const [deleteTargetId, setDeleteTargetId] = useState(null);

// 	// use ref to guard against state updates after unmount
// 	const mountedRef = useRef(true);

// 	const fetchBlogs = async () => {
// 		try {
// 			setLoading(true);
// 			// read token from localStorage (project convention uses key 'sytAdmin')
// 			const token = localStorage.getItem("sytAdmin");
// 			const headers = { "Content-Type": "application/json" };
// 			if (token) headers.Authorization = token.startsWith(' ') ? token : ` ${token}`;

// 			const res = await fetch(`${Base}api/blogger`, { headers });
// 			// Log status for debugging when network shows 200 but UI is empty
// 			console.debug("Blog API status:", res.status, res.statusText);
// 			const data = await res.json();
// 			console.debug("Blog API response payload:", data);

// 			// Try to extract an array from common wrapper fields if API wraps the array
// 			let blogArray = [];
// 			if (Array.isArray(data)) blogArray = data;
// 			else if (Array.isArray(data.data)) blogArray = data.data;
// 			else if (Array.isArray(data.blogs)) blogArray = data.blogs;
// 			else if (Array.isArray(data.results)) blogArray = data.results;
// 			else if (Array.isArray(data.items)) blogArray = data.items;
// 			else {
// 				// Fallback: search first array value in object
// 				for (const key in data) {
// 					if (Array.isArray(data[key])) {
// 						blogArray = data[key];
// 						break;
// 					}
// 				}
// 			}

// 			if (!Array.isArray(blogArray)) {
// 				throw new Error('Unexpected blog payload shape');
// 			}

// 			if (mountedRef.current) setBlogs(blogArray);
// 		} catch (err) {
// 			if (mountedRef.current) setError(err.message || "Failed to load blogs");
// 		} finally {
// 			if (mountedRef.current) setLoading(false);
// 		}
// 	};

// 	// helper to load detail for editing
// 	const loadDetail = async (id) => {
// 		if (!id) return;
// 		setError(null);
// 		try {
// 			setLoading(true);
// 			const token = localStorage.getItem('sytAdmin');
// 			const headers = { 'Content-Type': 'application/json' };
// 			if (token) headers.Authorization = token.startsWith(' ') ? token : ` ${token}`;
// 			const res = await fetch(`${Base}api/blogger/admin/detail/${id}`, { headers });
// 			const data = await res.json();
// 			if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
// 			// Build editable detail object: stringify nested objects/arrays and record json field keys
// 			const editable = {};
// 			const jsonKeys = [];
// 			Object.keys(data).forEach((k) => {
// 				const v = data[k];
// 				if (v !== null && typeof v === 'object') {
// 					jsonKeys.push(k);
// 					try { editable[k] = JSON.stringify(v, null, 2); } catch { editable[k] = String(v); }
// 				} else {
// 					editable[k] = v;
// 				}
// 			});
// 			setJsonFields(jsonKeys);
// 			setDetail(editable);
// 			setCurrentId(id);
// 			setEditOpen(true);
// 		} catch (err) {
// 			setError(err.message || 'Failed to load detail');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleUpdate = async (id) => {
// 		if (!id) return;
// 		setSaving(true);
// 		setError(null);
// 		try {
// 			const token = localStorage.getItem('sytAdmin');
// 			const headers = { 'Content-Type': 'application/json' };
// 			if (token) headers.Authorization = token.startsWith(' ') ? token : ` ${token}`;
// 			// prepare payload, parse any jsonFields back to objects
// 			const payload = {};
// 			Object.keys(detail || {}).forEach((k) => {
// 				if (jsonFields.includes(k)) {
// 					try { payload[k] = JSON.parse(detail[k]); } catch { payload[k] = detail[k]; }
// 				} else {
// 					payload[k] = detail[k];
// 				}
// 			});
// 			const res = await fetch(`${Base}api/blogger/admin/detail/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
// 			const data = await res.json();
// 			if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
// 			setEditOpen(false);
// 			// refresh list
// 			await fetchBlogs();
// 		} catch (err) {
// 			setError(err.message || 'Failed to update');
// 		} finally {
// 			setSaving(false);
// 		}
// 	};

// 	// when user clicks Delete we open a confirmation dialog; actual delete is performed in performDelete
// 	const handleDelete = (id) => {
// 		if (!id) return;
// 		setDeleteTargetId(id);
// 		setConfirmOpenDelete(true);
// 	};

// 	const performDelete = async () => {
// 		const id = deleteTargetId;
// 		if (!id) return;
// 		setConfirmOpenDelete(false);
// 		setSaving(true);
// 		setError(null);
// 		try {
// 			const token = localStorage.getItem('sytAdmin');
// 			const headers = { 'Content-Type': 'application/json' };
// 			if (token) headers.Authorization = token.startsWith(' ') ? token : ` ${token}`;
// 			// call the deletion endpoint as requested
// 			const res = await fetch(`${Base}blogger/blogecontent?_id=${id}`, { method: 'DELETE', headers });
// 			const data = await res.json();
// 			if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
// 			setEditOpen(false);
// 			await fetchBlogs();
// 		} catch (err) {
// 			setError(err.message || 'Failed to delete');
// 		} finally {
// 			setSaving(false);
// 			setDeleteTargetId(null);
// 		}
// 	};

// 	useEffect(() => {
// 		mountedRef.current = true;
// 		fetchBlogs();
// 		return () => { mountedRef.current = false; };
// 	}, []);

// 	// Prepare the content to render to avoid nested JSX ternary issues
// 	let content;
// 	if (loading) {
// 		content = <MDTypography variant="body1">Loading...</MDTypography>;
// 	} else if (error) {
// 		content = <MDTypography variant="body1" color="error">{error}</MDTypography>;
// 	} else {
// 			content = (
// 				<>
// 					<Grid container spacing={3}>
// 				{blogs.map((blog, idx) => (
// 					<Grid item xs={12} sm={6} md={4} key={blog.id || idx}>
// 						<Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
// 							<CardMedia
// 								component="img"
// 								height="160"
// 								image={blog.image_1 || blog.image || "/assets/images/illustrations/travel-1.jpg"}
// 								alt={blog.headline || `blog-${idx}`}
// 								sx={{ objectFit: "cover" }}
// 							/>
// 							<CardContent sx={{ flexGrow: 1 }}>
// 								<MDTypography variant="h6" fontWeight="medium" gutterBottom>
// 									<span
// 										dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.headline || "") }}
// 									/>
// 								</MDTypography>
// 								<MDBox mt={1} mb={2}>
// 									<MDTypography variant="body2" color="text">
// 										<span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.text_1 || "") }} />
// 									</MDTypography>
// 								</MDBox>
// 							</CardContent>
// 							<CardActions disableSpacing sx={{ px: 2, pb: 2, mt: "auto" }}>
// 								<MDButton size="small" color="info">
// 									Read More
// 								</MDButton>
// 								<MDButton size="small" color="info">
// 									Delete
// 								</MDButton>
// 								<MDButton size="small" color="dark" onClick={() => {
// 									const id = blog._id || blog.id || blog._id;
// 									navigate(`/blogger/edit/${id}`);
// 								}}>Edit</MDButton>
// 								<MDBox ml="auto">
// 									<Tooltip title="Share">
// 										<IconButton aria-label="share">
// 											<svg
// 												xmlns="http://www.w3.org/2000/svg"
// 												width="20"
// 												height="20"
// 												viewBox="0 0 24 24"
// 												fill="none"
// 												stroke="currentColor"
// 												strokeWidth="2"
// 												strokeLinecap="round"
// 												strokeLinejoin="round"
// 											>
// 												<circle cx="18" cy="5" r="3"></circle>
// 												<circle cx="6" cy="12" r="3"></circle>
// 												<circle cx="18" cy="19" r="3"></circle>
// 												<path d="M8.59 13.51L15.42 17.49"></path>
// 												<path d="M15.41 6.51L8.59 10.49"></path>
// 											</svg>
// 										</IconButton>
// 									</Tooltip>
// 								</MDBox>
// 							</CardActions>
							
						
// 						</Card>
// 					</Grid>
// 				))}
// 					</Grid>

// 					{/* Single dynamic edit dialog */}
// 					<Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="md">
// 					<DialogTitle>Edit Blog</DialogTitle>
// 					<DialogContent>
// 						{Object.keys(detail || {}).length === 0 && <MDTypography variant="body2">No fields to edit.</MDTypography>}
// 						{Object.keys(detail || {}).map((key) => {
// 							const value = detail[key];
// 							const isJson = jsonFields.includes(key);
// 							if (typeof value === 'boolean') {
// 								return (
// 									<FormControlLabel key={key} control={<Checkbox checked={!!value} onChange={e => setDetail(d => ({ ...d, [key]: e.target.checked }))} />} label={key} />
// 								);
// 							}
// 							if (isJson) {
// 								return (
// 									<TextField key={key} margin="dense" label={key} fullWidth multiline minRows={6} value={value} onChange={e => setDetail(d => ({ ...d, [key]: e.target.value }))} />
// 								);
// 							}
// 							if (typeof value === 'string' && value.length > 120) {
// 								return (
// 									<TextField key={key} margin="dense" label={key} fullWidth multiline minRows={4} value={value} onChange={e => setDetail(d => ({ ...d, [key]: e.target.value }))} />
// 								);
// 							}
// 							return (
// 								<TextField key={key} margin="dense" label={key} fullWidth value={value ?? ''} onChange={e => setDetail(d => ({ ...d, [key]: e.target.value }))} />
// 							);
// 						})}
// 					</DialogContent>
// 					<DialogActions>
// 						<MDButton variant="text" color="dark" onClick={() => setEditOpen(false)}>Cancel</MDButton>
// 						<MDButton variant="text" color="error" onClick={() => handleDelete(currentId)} disabled={saving}>Delete</MDButton>
// 						<MDButton variant="gradient" color="info" onClick={() => handleUpdate(currentId)} disabled={saving}>{saving ? 'Saving...' : 'Update'}</MDButton>
// 					</DialogActions>
// 				</Dialog>
				
// 				{/* Delete confirmation dialog */}
// 				<Dialog open={confirmOpenDelete} onClose={() => setConfirmOpenDelete(false)}>
// 					<DialogTitle>Confirm delete</DialogTitle>
// 					<DialogContent>
// 						<MDTypography>Are you sure you want to delete this blog?</MDTypography>
// 					</DialogContent>
// 					<DialogActions>
// 						<MDButton variant="text" color="dark" onClick={() => setConfirmOpenDelete(false)}>Cancel</MDButton>
// 						<MDButton variant="text" color="error" onClick={performDelete} disabled={saving}>Delete</MDButton>
// 					</DialogActions>
// 				</Dialog>
// 				</>
// 				);
// 	}

// 	return (
// 		<DashboardLayout>
// 			<DashboardNavbar />
// 			<MDBox pt={6} pb={3} px={2}>
// 				<MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
// 					<MDTypography variant="h4" fontWeight="bold">
// 						Blog
// 					</MDTypography>
// 					<MDButton variant="gradient" color="info" size="small" onClick={() => navigate('/blogger/add')}>
// 						New Post
// 					</MDButton>
// 				</MDBox>

// 				{content}
// 			</MDBox>
// 		</DashboardLayout>
// 	);
// }


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { BASE_URL as Base } from "../../BASE_URL";
import DOMPurify from "dompurify";

export default function BlogPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [detail, setDetail] = useState({});
  const [jsonFields, setJsonFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [confirmOpenDelete, setConfirmOpenDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const mountedRef = useRef(true);

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("sytAdmin");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = token.trim().startsWith("") ? token.trim() : ` ${token.trim()}`;
    }
    return headers;
  };

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${Base}api/blogger`, { headers: getAuthHeaders() });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.debug("Blog API response:", data);

      let blogArray = [];
      if (Array.isArray(data)) blogArray = data;
      else if (data?.data && Array.isArray(data.data)) blogArray = data.data;
      else if (data?.blogs && Array.isArray(data.blogs)) blogArray = data.blogs;
      else if (data?.results && Array.isArray(data.results)) blogArray = data.results;
      else if (data?.items && Array.isArray(data.items)) blogArray = data.items;
      else {
        for (const key in data) {
          if (Array.isArray(data[key])) {
            blogArray = data[key];
            break;
          }
        }
      }

      if (!Array.isArray(blogArray)) {
        throw new Error("Invalid blog data format");
      }

      if (mountedRef.current) setBlogs(blogArray);
    } catch (err) {
      if (mountedRef.current) setError(err.message || "Failed to load blogs");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // Load single blog for editing
  const loadDetail = async (id) => {
    if (!id) return;
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`${Base}api/blogger/admin/detail/${id}`, { headers: getAuthHeaders() });
     
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const editable = {};
      const jsonKeys = [];

      Object.keys(data).forEach((k) => {
        const v = data[k];
        if (v !== null && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date)) {
          jsonKeys.push(k);
          try {
            editable[k] = JSON.stringify(v, null, 2);
          } catch {
            editable[k] = String(v);
          }
        } else {
          editable[k] = v;
        }
      });

      setJsonFields(jsonKeys);
      setDetail(editable);
      setCurrentId(id);
      setEditOpen(true);
    } catch (err) {
      setError(err.message || "Failed to load blog details");
    } finally {
      setLoading(false);
    }
  };

  // Update blog
  const handleUpdate = async () => {
    if (!currentId) return;
    setSaving(true);
    setError(null);
    try {
      const payload = { ...detail };
      jsonFields.forEach((k) => {
        try {
          payload[k] = JSON.parse(detail[k]);
        } catch {
          payload[k] = detail[k]; // keep as string if invalid JSON
        }
      });

      const res = await fetch(`${Base}api/blogger/admin/detail/${currentId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || `HTTP ${res.status}`);
      }

      setEditOpen(false);
      await fetchBlogs();
    } catch (err) {
      setError(err.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  // Open delete confirmation
  const openDeleteConfirm = (id) => {
    setDeleteTargetId(id);
    setConfirmOpenDelete(true);
  };

  // Perform delete
  const performDelete = async () => {
    if (!deleteTargetId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${Base}api/blogger/blogecontent?_id=${deleteTargetId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || `HTTP ${res.status}`);
      }

      setConfirmOpenDelete(false);
      await fetchBlogs();
    } catch (err) {
      setError(err.message || "Failed to delete blog");
    } finally {
      setSaving(false);
      setDeleteTargetId(null);
    }
  };

  // Initial load
  useEffect(() => {
    mountedRef.current = true;
    fetchBlogs();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Render content
  let content;
  if (loading && blogs.length === 0) {
    content = <MDTypography variant="body1">Loading blogs...</MDTypography>;
  } else if (error) {
    content = <MDTypography variant="body1" color="error">{error}</MDTypography>;
  } else if (blogs.length === 0) {
    content = <MDTypography variant="body1">No blogs found.</MDTypography>;
  } else {
    content = (
      <Grid container spacing={3}>
        {blogs.map((blog) => {
          const id = blog._id || blog.id;
          const title = DOMPurify.sanitize(blog.headline || "Untitled");
          const excerpt = DOMPurify.sanitize((blog.text_1 || blog.content || "").slice(0, 150) + "...");
          const image = blog.image_1 || blog.image || "/assets/images/illustrations/travel-1.jpg";

          return (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={image}
                  alt={blog.headline || "Blog image"}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                    <span dangerouslySetInnerHTML={{ __html: title }} />
                  </MDTypography>
                  <MDBox mt={1} mb={2}>
                    <MDTypography variant="body2" color="text">
                      <span dangerouslySetInnerHTML={{ __html: excerpt }} />
                    </MDTypography>
                  </MDBox>
                </CardContent>
                <CardActions disableSpacing sx={{ px: 2, pb: 2, mt: "auto", justifyContent: "space-between" }}>
                  {/* <MDButton
                    size="small"
                    color="info"
                    onClick={() => navigate(`/blogger/${id}`)}
                  >
                    Read More
                  </MDButton> */}

                  <MDButton
                    size="small"
                    color="error"
                    onClick={() => openDeleteConfirm(id)}
                  >
                    Delete
                  </MDButton>

                  <MDButton
                    size="small"
                    color="dark"
                    onClick={() => navigate(`/blogger/edit/${id}`)}
                  >
                    Edit
                  </MDButton>

                  {/* <Tooltip title="Share">
                    <IconButton aria-label="share">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <path d="M8.59 13.51L15.42 17.49" />
                        <path d="M15.41 6.51L8.59 10.49" />
                      </svg>
                    </IconButton>
                  </Tooltip> */}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} px={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDTypography variant="h4" fontWeight="bold">
            Blog
          </MDTypography>
          <MDButton
            variant="gradient"
            color="info"
            size="small"
            onClick={() => navigate("/blogger/add")}
          >
            New Post
          </MDButton>
        </MDBox>

        {content}

        {/* Edit Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>Edit Blog</DialogTitle>
          <DialogContent dividers>
            {Object.keys(detail).length === 0 ? (
              <MDTypography variant="body2">Loading blog details...</MDTypography>
            ) : (
              Object.keys(detail).map((key) => {
                const value = detail[key];
                const isJson = jsonFields.includes(key);

                if (typeof value === "boolean") {
                  return (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={!!value}
                          onChange={(e) =>
                            setDetail((d) => ({ ...d, [key]: e.target.checked }))
                          }
                        />
                      }
                      label={key}
                    />
                  );
                }

                const isLongText = typeof value === "string" && value.length > 120;

                return (
                  <TextField
                    key={key}
                    margin="dense"
                    label={key}
                    fullWidth
                    multiline={isJson || isLongText}
                    minRows={isJson ? 6 : isLongText ? 4 : 1}
                    value={value ?? ""}
                    onChange={(e) =>
                      setDetail((d) => ({ ...d, [key]: e.target.value }))
                    }
                    disabled={saving}
                  />
                );
              })
            )}
            {error && (
              <MDTypography color="error" variant="caption" display="block" mt={1}>
                {error}
              </MDTypography>
            )}
          </DialogContent>
          <DialogActions>
            <MDButton onClick={() => setEditOpen(false)} disabled={saving}>
              Cancel
            </MDButton>
            <MDButton
              color="error"
              onClick={() => {
                setEditOpen(false);
                openDeleteConfirm(currentId);
              }}
              disabled={saving}
            >
              Delete
            </MDButton>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving ? "Saving..." : "Update"}
            </MDButton>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={confirmOpenDelete} onClose={() => setConfirmOpenDelete(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <MDTypography>
              Are you sure you want to delete this blog? This action cannot be undone.
            </MDTypography>
          </DialogContent>
          <DialogActions>
            <MDButton
              onClick={() => setConfirmOpenDelete(false)}
              disabled={saving}
            >
              Cancel
            </MDButton>
            <MDButton
              color="error"
              onClick={performDelete}
              disabled={saving}
            >
              {saving ? "Deleting..." : "Delete"}
            </MDButton>
          </DialogActions>
        </Dialog>
      </MDBox>
    </DashboardLayout>
  );
}