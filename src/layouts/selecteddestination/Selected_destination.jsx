import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import { Audio } from "react-loader-spinner";
import { BASE_URL } from "BASE_URL";

// Fetches categories/packages for selected destinations and displays them.
export default function Selected_destination() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastFetch, setLastFetch] = useState({ tried: [], successUrl: null, errors: [], payloadLength: null });
  const [checkedDestinations, setCheckedDestinations] = useState({});

  // Fetch categories list from admin endpoint
  // Make fetchCategories callable so we can refresh after adding a category
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      const res = await axios.get(`${BASE_URL}destinationcategory`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const payload = res?.data?.data ?? res?.data ?? [];
      // Normalize to objects with id and name
      const list = Array.isArray(payload)
        ? payload.map((c) => {
            if (!c) return null;
            if (typeof c === "string") return { id: c, name: c };
            const id = c._id ?? c.id ?? c._doc?._id ?? null;
            const name = c.category_name ?? c.name ?? c.category ?? c.title ?? JSON.stringify(c);
            return { id, name };
          })
        : [];
      const unique = list.filter(Boolean).reduce((acc, cur) => {
        if (!acc.find((x) => x.id === cur.id)) acc.push(cur);
        return acc;
      }, []);
      setCategories(unique);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create a category (used by the header button). Tries two request shapes and refreshes list.
  const createCategory = async (name) => {
    const token = localStorage.getItem('sytAdmin');
    try {
      // try preferred shape
      const res = await axios.post(`${BASE_URL}destinationcategory`, { category_name: name }, {
        headers: { Authorization: token, 'Content-Type': 'application/json' },
      });
      const created = res?.data?.data ?? res?.data ?? null;
      // if backend returned the created category, select it
      if (created) {
        const id = created._id ?? created.id ?? null;
        if (id) setSelectedCategory(id);
      }
    } catch (err) {
      // try alternative shape
      try {
        const res2 = await axios.post(`${BASE_URL}destinationcategory`, { name }, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
        const created2 = res2?.data?.data ?? res2?.data ?? null;
        if (created2) {
          const id = created2._id ?? created2.id ?? null;
          if (id) setSelectedCategory(id);
        }
      } catch (err2) {
        // eslint-disable-next-line no-console
        console.error('Failed to create category', err, err2);
        alert('Failed to create category. Check console for details.');
      }
    } finally {
      // Refresh categories list after attempts
      await fetchCategories();
    }
  };

  // Fetch packages/categories payload (optionally filtered by category)
  useEffect(() => {
    const fetchData = async () => {
      // If no category selected, clear the items and skip fetch
      if (!selectedCategory) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const token = localStorage.getItem("sytAdmin");
        // Call the category-specific destinations endpoint.
        // Some backends expect the category id, others expect the category name.
        // Try the selected value first, then fall back to the other identifier if no results.
        const baseUrl = `${BASE_URL}api/selected-destination/admin/destinations/category/`;
        // selectedCategory now holds the category id (categoryId). Build primary URL with it.
        const categoryId = selectedCategory;
        const tryUrls = [baseUrl + encodeURIComponent(categoryId)];

        // Only request by categoryId (no fallback to name) since API requires id in the path

        // Deduplicate urls and try each until we find non-empty results
        const seen = new Set();
        const urls = tryUrls.filter((u) => {
          if (seen.has(u)) return false;
          seen.add(u);
          return true;
        });

        let payload = [];
        const errors = [];
        setLastFetch({ tried: urls, successUrl: null, errors: [], payloadLength: null });
        for (const url of urls) {
          try {
            // eslint-disable-next-line no-console
            console.debug("Fetching destinations from:", url);
            const res = await axios.get(url, {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            });
            payload = res?.data?.data ?? res?.data ?? [];
            // If payload is an object that contains an array property, prefer that array
            if (!Array.isArray(payload) && payload && typeof payload === 'object') {
              const nestedArray = Object.values(payload).find((v) => Array.isArray(v));
              if (Array.isArray(nestedArray)) {
                payload = nestedArray;
              }
            }

            // Debug logging to help diagnose UI/no-data issues
            // eslint-disable-next-line no-console
            console.debug('Fetched payload (normalized):', payload);
            if (Array.isArray(payload) && payload.length > 0) {
              // Found results, record success and stop trying other urls
              setLastFetch((s) => ({ ...s, successUrl: url, payloadLength: payload.length }));
              break;
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.debug("Request failed for", url, err?.message ?? err);
            const status = err?.response?.status;
            const data = err?.response?.data;
            const errText = `${url} -> ${err?.message ?? err} ${status ? `(status: ${status})` : ""}`;
            errors.push({ text: errText, status, data });
            setLastFetch((s) => ({ ...s, errors: errors.slice() }));
            // continue to next url
          }
        }

        const arr = Array.isArray(payload) ? payload : [];
  // Debug before setting items
  // eslint-disable-next-line no-console
  console.debug('Normalized result array length:', Array.isArray(arr) ? arr.length : 'not-array', arr && arr[0]);
  setItems(arr);
        if (!Array.isArray(payload) || payload.length === 0) {
          setLastFetch((s) => ({ ...s, payloadLength: Array.isArray(payload) ? payload.length : 0 }));
        }
      } catch (err) {
        console.error("Failed to fetch destinations for category:", err);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, categories]);

  // Log items state updates to help debug why UI isn't showing fetched data
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('items state updated:', items && items.length, items && items[0]);
  }, [items]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
                <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <MDTypography variant="h6" color="white">
                    {selectedCategory
                      ? `Destinations in ${categories.find((c) => c.id === selectedCategory)?.name ?? "Selected"}`
                      : "Select a Category to view Destinations"}
                  </MDTypography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/create-selected-destination')}
                    // Disable ripple and lock hover styles so it doesn't turn blue on hover
                    disableRipple
                    sx={{
                      background: '#ffffff',
                      color: '#000000',
                      boxShadow: 'none',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Create Selected Destination
                  </Button>
                </div>
              </MDBox>

              <MDBox p={3}>
                {/* Top filters: search + category dropdown */}
                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                  <Grid item xs={12} sm={6} md={6} lg={8}>
                    <TextField
                      fullWidth
                      id="search"
                      label="Search by name or description"
                      value={searchTerm}
                      variant="outlined"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': { height: '44px' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        id="category-select"
                        value={selectedCategory}
                        label="Category"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        sx={{
                          height: '56px',
                          fontSize: '14px',
                          '& .MuiSelect-select': { display: 'flex', alignItems: 'center', padding: '10px 14px' },
                        }}
                      >
                        <MenuItem value="">All</MenuItem>
                        {categories.map((c) => (
                          <MenuItem value={c.id} key={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                  </Grid>
                </Grid>

                {/* Checkbox list: destinations that have package count > 0 */}
                {selectedCategory ? (
                  <div style={{ marginTop: 12 }}>
                    <FormControl component="fieldset">
                      {items
                        .filter((it) => {
                          // helper to detect package count robustly
                          const getPackageCount = (d) => {
                            if (!d) return 0;
                            if (typeof d.package === 'number') return d.package;
                            if (typeof d.packages === 'number') return d.packages;
                            if (Array.isArray(d.packages)) return d.packages.length;
                            if (Array.isArray(d.package)) return d.package.length;
                            if (typeof d.package_count === 'number') return d.package_count;
                            if (typeof d.pack_count === 'number') return d.pack_count;
                            return 0;
                          };
                          return getPackageCount(it) > 0;
                        })
                        .map((it) => (
                          <FormControlLabel
                            key={it._id ?? it.id ?? it.destination_name ?? it.name}
                            control={(
                              <Checkbox
                                checked={!!checkedDestinations[it._id ?? it.id ?? it.destination_name ?? it.name]}
                                onChange={(e) => {
                                  const key = it._id ?? it.id ?? it.destination_name ?? it.name;
                                  setCheckedDestinations((s) => ({ ...s, [key]: e.target.checked }));
                                }}
                              />
                            )}
                            label={it.destination_name ?? it.name}
                          />
                        ))}
                    </FormControl>
                  </div>
                ) : null}

                {isLoading ? (
                  <MDBox display="flex" justifyContent="center">
                    <Audio height="60" width="60" radius="9" color="green" ariaLabel="loading" />
                  </MDBox>
                ) : !selectedCategory ? (
                  <MDTypography variant="body2">Please select a category to see destinations.</MDTypography>
                ) : items.length === 0 ? (
                  <>
                    <MDTypography variant="body2">No destinations found for this category.</MDTypography>
                    <MDBox mt={2} p={2} sx={{ background: '#f8f9fa', borderRadius: 1 }}>
                      <MDTypography variant="subtitle2">Debug info</MDTypography>
                      <MDTypography variant="caption">Selected value: {String(selectedCategory)}</MDTypography>
                      <MDTypography variant="caption">Categories: {JSON.stringify(categories.map((c) => ({ id: c.id, name: c.name })))}</MDTypography>
                      <MDTypography variant="caption">Tried URLs: {JSON.stringify(lastFetch.tried || [])}</MDTypography>
                      <MDTypography variant="caption">Success URL: {String(lastFetch.successUrl ?? 'none')}</MDTypography>
                      <MDTypography variant="caption">Payload length: {String(lastFetch.payloadLength ?? 0)}</MDTypography>
                      {lastFetch.errors && lastFetch.errors.length > 0 ? (
                        <MDTypography variant="caption">Errors: {JSON.stringify(lastFetch.errors)}</MDTypography>
                      ) : null}
                    </MDBox>
                  </>
                ) : (
                  <Grid container spacing={2}>
                    {items
                      .filter((it) => {
                        if (!searchTerm) return true;
                        const s = searchTerm.toLowerCase();
                        return (
                          (it.destination_name && it.destination_name.toLowerCase().includes(s)) ||
                          (it.name && it.name.toLowerCase().includes(s)) ||
                          (it.description && it.description.toLowerCase().includes(s))
                        );
                      })
                      .map((it, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={it._id ?? it.id ?? idx}>
                          <Card sx={{ p: 2, height: "100%" }}>
                            {/* show image if available */}
                            {it.photo || it.image ? (
                              <img src={it.photo ?? it.image} alt={it.name ?? it.destination_name ?? `dest-${idx}`} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 4 }} />
                            ) : null}
                            <MDTypography variant="h6" sx={{ mt: 1 }}>
                              {it.destination_name ?? it.name ?? `Item ${idx + 1}`}
                            </MDTypography>
                            {it.description ? (
                              <MDTypography variant="body2" sx={{ mt: 1 }}>
                                {it.description}
                              </MDTypography>
                            ) : null}
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
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
