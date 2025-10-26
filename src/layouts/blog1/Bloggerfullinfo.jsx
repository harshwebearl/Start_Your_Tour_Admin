import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { styled } from '@mui/material/styles';
import { BASE_URL as Base } from "../../BASE_URL";
import DOMPurify from "dompurify";

// Styled wrapper for rendering HTML content coming from the API (lists, headings, etc.)
const HtmlContent = styled('div')(({ theme }) => ({
  '& ul': { paddingLeft: '1.5rem', margin: '0.5rem 0' },
  '& li': { marginBottom: '0.5rem' },
  '& h2': { margin: '1.5rem 0 1rem', fontWeight: 600 },
  '& p': { margin: '0.6rem 0' },
  '& img': { maxWidth: '100%', height: 'auto', borderRadius: 8, display: 'block', margin: '0.5rem 0' },
}));

function prettyDate(d) {
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleString();
  } catch {
    return d;
  }
}

function renderValue(key, value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    if (Array.isArray(value)) return value.join(", ");
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

export default function Bloggerfullinfo() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJsonFields, setShowJsonFields] = useState({});
  const mountedRef = useRef(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("sytAdmin");
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = token.startsWith(" ") ? token : ` ${token}`;
    return headers;
  };

  useEffect(() => {
    mountedRef.current = true;
    const fetchDetail = async () => {
      if (!_id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${Base}api/blogger/admin/detail/${_id}`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (mountedRef.current) setBlog(data);
      } catch (err) {
        if (mountedRef.current) setError(err.message || "Failed to load blog");
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      mountedRef.current = false;
    };
  }, [_id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} px={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDTypography variant="h4" fontWeight="bold">
            Blog Detail
          </MDTypography>
          <MDBox>
            <MDButton variant="outlined" color="dark" size="small" onClick={() => navigate(-1)} sx={{ mr: 1 }}>
              Back
            </MDButton>
            <MDButton variant="gradient" color="info" size="small" onClick={() => navigate(`/blogger/edit/${_id}`)}>
              Edit
            </MDButton>
          </MDBox>
        </MDBox>

        {loading ? (
          <MDTypography>Loading...</MDTypography>
        ) : error ? (
          <MDTypography color="error">{error}</MDTypography>
        ) : !blog ? (
          <MDTypography>No blog found.</MDTypography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }} elevation={1}>
                {/* Field-based layout (headline, hero, sections, gallery) */}
                {(() => {
                  const {
                    headline,
                    image_1,
                    text_1,
                    subheading_1,
                    image_2,
                    text_2,
                    image_3,
                    subheading_2,
                    image_4,
                    image_5,
                    image_6,
                    image_7,
                    image_8,
                    image_9,
                    subheading_3,
                  } = blog;

                  const galleryImages = [image_4, image_5, image_6, image_7, image_8, image_9].filter(Boolean);

                  return (
                    <Container maxWidth="lg" sx={{ px: 0 }}>
                      {/* Headline */}
                      <MDTypography
                        variant="h3"
                        component="h1"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 700, mb: 4 }}
                      >
                        {headline}
                      </MDTypography>

                      {/* Image 1 */}
                      {image_1 && (
                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                          <img
                            src={image_1}
                            alt="Hero"
                            style={{ width: '100%', maxHeight: 500, objectFit: 'cover', borderRadius: 12 }}
                          />
                        </Box>
                      )}

                      {/* Text 1 */}
                      {text_1 && (
                        <HtmlContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text_1) }} sx={{ mb: 4 }} />
                      )}

                      {/* Subheading 1 */}
                      {subheading_1 && (
                        <HtmlContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subheading_1) }} sx={{ mb: 3 }} />
                      )}

                      {/* Image 2 */}
                      {image_2 && (
                        <Box sx={{ my: 3, textAlign: 'center' }}>
                          <img
                            src={image_2}
                            alt="Section 2"
                            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 12 }}
                          />
                        </Box>
                      )}

                      {/* Text 2 */}
                      {text_2 && (
                        <HtmlContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text_2) }} sx={{ mb: 4 }} />
                      )}

                      {/* Image 3 */}
                      {image_3 && (
                        <Box sx={{ my: 3, textAlign: 'center' }}>
                          <img
                            src={image_3}
                            alt="Section 3"
                            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 12 }}
                          />
                        </Box>
                      )}

                      {/* Subheading 2 */}
                      {subheading_2 && (
                        <HtmlContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subheading_2) }} sx={{ mb: 4 }} />
                      )}

                      {/* Gallery */}
                      {galleryImages.length > 0 && (
                        <>
                          <MDTypography variant="h4" gutterBottom sx={{ mt: 5, mb: 3 }}>
                            Gallery
                          </MDTypography>
                          <Grid container spacing={2}>
                            {galleryImages.map((src, idx) => (
                              <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                                  <img
                                    src={src}
                                    alt={`Gallery ${idx + 1}`}
                                    style={{ width: '100%', height: 250, objectFit: 'cover' }}
                                  />
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>
                        </>
                      )}

                      {/* Subheading 3 */}
                      {subheading_3 && (
                        <HtmlContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subheading_3) }} sx={{ mt: 5 }} />
                      )}
                    </Container>
                  );
                })()}

                {/* Render any additional fields (images, arrays, objects) */}
                {Object.keys(blog).map((k) => {
                  if (["headline", "text_1", "text_2", "content", "image", "image_1", "sections", "author", "createdAt", "category", "tags"].includes(k)) return null;
                  const v = blog[k];
                  if (v === null || v === undefined) return null;

                  // Images array or string
                  if (Array.isArray(v) && v.every(it => typeof it === 'string' && (it.startsWith('http') || it.endsWith('.jpg') || it.endsWith('.png') || it.endsWith('.jpeg')))) {
                    return (
                      <MDBox key={k} mb={2}>
                        <MDTypography variant="subtitle2" gutterBottom>{k}</MDTypography>
                        <Stack direction="row" spacing={1}>
                          {v.map((src, i) => (
                            <CardMedia key={i} component="img" image={src} alt={`${k}-${i}`} sx={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 1 }} />
                          ))}
                        </Stack>
                      </MDBox>
                    );
                  }

                    if (typeof v === 'object') {
                      // don't dump the entire response by default — show a concise summary with optional JSON expand
                      const isShown = !!showJsonFields[k];
                      const preview = Array.isArray(v)
                        ? v.slice(0, 5).map(it => (typeof it === 'object' ? JSON.stringify(it) : String(it))).join(', ') + (v.length > 5 ? ', ...' : '')
                        : Object.keys(v).slice(0, 8).join(', ');

                      return (
                        <MDBox key={k} mb={2}>
                          <MDTypography variant="subtitle2" gutterBottom>{k}</MDTypography>
                          <MDTypography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>{preview}</MDTypography>
                          <MDButton size="small" variant="text" onClick={() => setShowJsonFields(s => ({ ...s, [k]: !s[k] }))}>
                            {isShown ? 'Hide JSON' : 'Show JSON'}
                          </MDButton>
                          {isShown && (
                            <Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, mt: 1 }}>
                              {JSON.stringify(v, null, 2)}
                            </Paper>
                          )}
                        </MDBox>
                      );
                    }

                    return (
                      <MDBox key={k} mb={1}>
                        <MDTypography variant="subtitle2" color="textSecondary">{k}</MDTypography>
                        <MDTypography variant="body2">{renderValue(k, v)}</MDTypography>
                      </MDBox>
                    );
                })}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }} elevation={1}>
                <MDTypography variant="h6" gutterBottom>Details</MDTypography>
                <Divider sx={{ mb: 1 }} />

                {blog.tags ? (
                  <MDBox mb={2}>
                    <MDTypography variant="subtitle2">Tags</MDTypography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                      {(Array.isArray(blog.tags) ? blog.tags : String(blog.tags || '').split(',')).filter(Boolean).map((t, i) => (
                        <Chip key={i} label={t.trim()} size="small" />
                      ))}
                    </Stack>
                  </MDBox>
                ) : null}

                {blog.readTime && (
                  <MDBox mb={1}>
                    <MDTypography variant="subtitle2">Read time</MDTypography>
                    <MDTypography variant="body2">{blog.readTime}</MDTypography>
                  </MDBox>
                )}

                {blog.author && (
                  <MDBox mb={1}>
                    <MDTypography variant="subtitle2">Author</MDTypography>
                    <MDTypography variant="body2">{blog.author}</MDTypography>
                  </MDBox>
                )}

                {blog.createdAt && (
                  <MDBox mb={1}>
                    <MDTypography variant="subtitle2">Published</MDTypography>
                    <MDTypography variant="body2">{prettyDate(blog.createdAt)}</MDTypography>
                  </MDBox>
                )}

                {blog.status && (
                  <MDBox mb={1}>
                    <MDTypography variant="subtitle2">Status</MDTypography>
                    <Chip label={String(blog.status)} size="small" />
                  </MDBox>
                )}

                <Divider sx={{ my: 2 }} />

                <MDButton variant="outlined" color="dark" fullWidth size="small" onClick={() => navigate(`/blogger/edit/${_id}`)} sx={{ mb: 1 }}>
                  Edit Post
                </MDButton>
                <MDButton variant="text" color="error" fullWidth size="small" onClick={() => {
                  // fallback: try to call delete endpoint then navigate back
                  if (confirm('Delete this blog?')) {
                    fetch(`${Base}api/blogger/blogecontent?_id=${_id}`, { method: 'DELETE', headers: getAuthHeaders() })
                      .then(r => r.json().catch(() => ({}))).then(() => navigate(-1)).catch(() => alert('Delete failed'));
                  }
                }}>Delete</MDButton>
              </Paper>
            </Grid>
          </Grid>
        )}
      </MDBox>
    </DashboardLayout>
  );
}
