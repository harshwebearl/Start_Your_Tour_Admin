import React, { useEffect, useState } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Audio } from 'react-loader-spinner';
import { BASE_URL } from 'BASE_URL';

export default function Createselecteddestination() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allDestinations, setAllDestinations] = useState([]);
  const [checkedDestinations, setCheckedDestinations] = useState({});

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('sytAdmin');
      const res = await axios.get(`${BASE_URL}destinationcategory`, {
        headers: { Authorization: token, 'Content-Type': 'application/json' },
      });
      const payload = res?.data?.data ?? res?.data ?? [];
      const list = Array.isArray(payload)
        ? payload.map((c) => {
            if (!c) return null;
            if (typeof c === 'string') return { id: c, name: c };
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
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch destinations for selected category
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCategory) {
        setItems([]);
        setAllDestinations([]);
        setCheckedDestinations({});
        return;
      }
      setIsLoading(true);
      try {
        const token = localStorage.getItem('sytAdmin');
        // Fetch all destinations from the API and filter client-side by selected category
        const url = `${BASE_URL}destination/alldestination`;
        const res = await axios.get(url, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
        let payload = res?.data?.data ?? res?.data ?? [];
        if (!Array.isArray(payload) && payload && typeof payload === 'object') {
          const nestedArray = Object.values(payload).find((v) => Array.isArray(v));
          if (Array.isArray(nestedArray)) payload = nestedArray;
        }
        let arr = Array.isArray(payload) ? payload : [];

        // Keep the full API payload available for display/debugging
        setAllDestinations(arr);

        // If a category is selected, filter destinations by possible category fields
        if (selectedCategory) {
          arr = arr.filter((it) => {
            if (!it) return false;
            // possible category fields to check
            const candidates = [];
            if (it.category) candidates.push(it.category);
            if (it.category_id) candidates.push(it.category_id);
            if (it.categoryId) candidates.push(it.categoryId);
            if (it.category_name) candidates.push(it.category_name);
            if (it.category?.toString) candidates.push(it.category?.toString());
            if (it.category_id && typeof it.category_id === 'object') {
              candidates.push(it.category_id._id ?? it.category_id.id ?? it.category_id);
            }
            if (it.category && typeof it.category === 'object') {
              candidates.push(it.category._id ?? it.category.id ?? it.category);
            }
            // normalize and compare as strings
            return candidates
              .filter(Boolean)
              .map((c) => String(c))
              .some((c) => c === String(selectedCategory));
          });
        }
        setItems(arr);
        // reset checkedDestinations when items change
        const initialChecked = {};
        arr.forEach((it) => {
          const key = it._id ?? it.id ?? it.destination_name ?? it.name;
          initialChecked[key] = false;
        });
        setCheckedDestinations(initialChecked);
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

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

  const handleSave = async () => {
    try {
      if (!selectedCategory) return alert('Please select a category first');
      const selected = Object.entries(checkedDestinations || {}).filter(([k, v]) => v).map(([k]) => k);
      if (!selected || selected.length === 0) return alert('Please select at least one destination');

      const payload = {
        categoryId: selectedCategory,
        destinationIds: selected,
        isVisible: true,
      };

      console.debug('Posting selected-destination payload:', payload);
      const token = localStorage.getItem('sytAdmin');
      const url = `${BASE_URL}api/selected-destination/admin/packages/category/${encodeURIComponent(selectedCategory)}`;
      const res = await axios.post(url, payload, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
      // handle success loosely — backend may return created object or message
      console.debug('Save response:', res?.data ?? res);
      alert('Selected destinations saved successfully');
      navigate('/Selected-destination');
    } catch (err) {
      console.error('Failed to save selected destinations:', err);
      const msg = err?.response?.data?.message ?? err?.message ?? 'Save failed';
      alert(`Save failed: ${msg}`);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card sx={{ p: 3 }}>
          <MDTypography variant="h6">Create Selected Destination</MDTypography>

          <MDBox mt={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="">-- Select --</MenuItem>
                    {categories.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <MDBox mt={3}>
              <MDTypography variant="subtitle2">Active Destinations</MDTypography>
              {isLoading ? (
                <MDBox display="flex" justifyContent="center" mt={2}>
                  <Audio height="40" width="40" radius="9" color="green" ariaLabel="loading" />
                </MDBox>
              ) : (
                <div style={{ marginTop: 8 }}>
                  {items
                    .filter((it) => getPackageCount(it) > 0)
                    .map((it) => {
                      const key = it._id ?? it.id ?? it.destination_name ?? it.name;
                      return (
                        <div key={key}>
                          <FormControlLabel
                            control={(
                              <Checkbox
                                checked={!!checkedDestinations[key]}
                                onChange={(e) => setCheckedDestinations((s) => ({ ...s, [key]: e.target.checked }))}
                              />
                            )}
                            label={it.destination_name ?? it.name}
                          />
                        </div>
                      );
                    })}
                </div>
              )}
            </MDBox>

            <MDBox mt={3}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <MDTypography variant="subtitle2">All Destinations</MDTypography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    // select all visible active destinations
                    const visible = items.filter((it) => getPackageCount(it) > 0);
                    const updated = { ...checkedDestinations };
                    visible.forEach((it) => {
                      const key = it._id ?? it.id ?? it.destination_name ?? it.name;
                      updated[key] = true;
                    });
                    setCheckedDestinations(updated);
                  }}
                >
                  Select
                </Button>
              </div>

              {allDestinations.length === 0 ? (
                <MDTypography variant="body2" sx={{ mt: 1 }}>No destinations loaded.</MDTypography>
              ) : (
                // Responsive grid: 1 column on xs, 2 on sm, 3 on md, 5 on lg, 7 on xl
                <MDBox
                  sx={{
                    width: '100%',
                    display: 'grid',
                    gap: 2,
                    mt: 2,
                    // Force up to 5 columns on large and extra-large screens, fewer on smaller devices
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(5, 1fr)',
                      xl: 'repeat(5, 1fr)',
                    },
                  }}
                >
                  {allDestinations.map((it, idx) => {
                    const key = it._id ?? it.id ?? it.destination_name ?? it.name ?? idx;
                    return (
                      <MDBox
                        key={key}
                        sx={{
                          p: 2,
                          backgroundColor: '#fafafa',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minHeight: 64,
                          boxShadow: 'none',
                        }}
                      >
                        <div style={{ fontSize: 16, color: '#1f4058', lineHeight: 1.2 }}>{it.destination_name ?? it.name ?? '(no name)'}</div>
                        <Checkbox
                          checked={!!checkedDestinations[key]}
                          onChange={(e) => setCheckedDestinations((s) => ({ ...s, [key]: e.target.checked }))}
                          size="small"
                        />
                      </MDBox>
                    );
                  })}
                </MDBox>
              )}
            </MDBox>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
