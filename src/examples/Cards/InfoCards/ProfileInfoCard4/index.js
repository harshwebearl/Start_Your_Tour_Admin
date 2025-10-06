import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import { NavLink } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import MDButton from "components/MDButton";

const formatLabel = (label) => {
  // Split the label by underscores, capitalize each word, then join them back
  return label
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatDate = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year

  return `${day}-${month}-${year}`;
};

function getMonthWithMostDaysInRange(startDate, endDate) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const start = new Date(startDate);
  const end = new Date(endDate);

  // To store the count of days for each month in the range
  const monthDaysCount = Array(12).fill(0);

  // Loop through each day in the range and count how many days fall in each month
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const currentMonth = d.getMonth();
    monthDaysCount[currentMonth]++;
  }

  // Find the month with the maximum days
  let maxDays = 0;
  let monthWithMostDays = 0;

  for (let i = 0; i < monthDaysCount.length; i++) {
    if (monthDaysCount[i] > maxDays) {
      maxDays = monthDaysCount[i];
      monthWithMostDays = i;
    }
  }

  // Return the name of the month with the most days
  return months[monthWithMostDays];
}

// Add this helper function at the top of the file after imports
const formatFinalPrice = (price) => {
  if (!price) return 0;
  const decimalPart = price % 1;
  return decimalPart >= 0.5 ? Math.ceil(price) : Math.floor(price);
};

function ProfileInfoCard({
  title,
  description,
  info,
  social,
  action,
  shadow,
  features,
  id,
  status,
  itineraries,
  marginArray,
  monthPriceArray,
  hotelItinerary
}) {
  const labels = [];
  const values = [];
  const { socialMediaColors } = colors;
  const { size } = typography;

  const transformPriceAndDate = (priceAndDateArray) => {
    return priceAndDateArray?.map((item) => {
      const date = new Date(item?.price_start_date);
      const monthName = date?.toLocaleString("default", { month: "long" });

      // Return the transformed object
      return {
        month_name: monthName,
        price_per_person: item?.price_per_person,
      };
    });
  };

  // Assuming pDetails[0].price_and_date is the array you want to transform
  const transformedArray = transformPriceAndDate(monthPriceArray);

  if (info) {
    Object.keys(info).forEach((el) => {
      const formattedLabel = formatLabel(el);  // Format the label
      labels.push(formattedLabel);
    });

    Object.values(info).forEach((el) => values.push(el));
  }

  const labelsWithoutKey = ["bio", "anotherLabel"];

  let renderFeatures;
  if (features) {
    renderFeatures = features.map((feature, index) => (
      <MDBox
        component="li"
        key={index}
        variant="button"
        fontWeight="regular"
        color="text"
        style={{ fontSize: "1rem" }}
      >
        {feature}
      </MDBox>
    ));
  }

  const renderItems = labels.map((label, key) => {
    if (labelsWithoutKey.includes(label)) {
      return (
        <MDBox key={label} display="flex" py={1} pl={-2}>
          <MDTypography variant="button" fontWeight="bold" color="text">
            &nbsp;{values[key]}
          </MDTypography>
        </MDBox>
      );
    }
    const statusaccept = status === "accept";
    return (
      <MDBox key={label} display="flex" py={1} pr={2}>
        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
          {label}: &nbsp;
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{values[key]}
        </MDTypography>
      </MDBox>
    );
  });

  const renderSocial = social.map(({ link, icon, color }) => (
    <MDBox
      key={color}
      component="a"
      href={link}
      target="_blank"
      rel="noreferrer"
      fontSize={size.lg}
      color={socialMediaColors[color].main}
      pr={1}
      pl={0.5}
      lineHeight={1}
    >
      {icon}
    </MDBox>
  ));

  // Add this state at the top of the component
  const [expandedActivities, setExpandedActivities] = useState({});

  // Add this state at the top of your component
  const [expandedFields, setExpandedFields] = useState({});

  // Add this helper function
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    const strippedText = text.replace(/<\/?[^>]+(>|$)/g, "");
    return strippedText.length > maxLength ? 
      strippedText.substring(0, maxLength) + "..." : 
      strippedText;
  };

  // Add this helper function after truncateText
  const toggleExpand = (hotelId, field) => {
    setExpandedFields(prev => ({
      ...prev,
      [`${hotelId}-${field}`]: !prev[`${hotelId}-${field}`]
    }));
  };

  return (
    <div
      style={{ height: "100%", boxShadow: !shadow && "none", backgroundColor: "aliceblue", position: "relative", borderRadius: "10px", margin: "5px" }}
    >
      <NavLink to={`/update-package/${id}`}>
        <MDBox
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/84/84380.png"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            position: "absolute",
            top: "58px",
            right: "4rem",
            cursor: "pointer",
          }}
        // onClick={handleEdit}
        />
      </NavLink>

      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pt={2}
        px={2}
        style={{ justifyContent: "center" }}
      >
        <MDTypography
          variant="h5"
          style={{ display: "flex" }}
          fontWeight="medium"
          textTransform="capitalize"
        >
          {title}
        </MDTypography>
      </MDBox>
      <MDBox
        p={2}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MDBox>
          {renderItems}
          {features && features.length > 0 && (
            <MDBox py={1} pr={2}>
              <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                Features
              </MDTypography>
              <MDBox ml={1}>{renderFeatures}</MDBox>
            </MDBox>
          )}
          <MDBox display="flex" py={1} pr={2}>
            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
              &nbsp;
            </MDTypography>
            {renderSocial}
          </MDBox>
        </MDBox>

      </MDBox>

      <div className="mb-4 mx-4">
        <div
          className="margin-pricing-agency"
          style={{
            padding: '10px',
            // backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            className="margin-pricing-agency-header"
            style={{
              display: 'grid',
              gridTemplateColumns: '0.6fr 1fr 1.4fr 1fr',
              gap: '10px',
              textAlign: 'center',
              // backgroundColor: '#e6f7e6',
              padding: '8px 0',
              borderRadius: '4px',
            }}
          >
            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>Month</h5>
            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>Price per Person</h5>
            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>Admin Margin</h5>
            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>Final Price</h5>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '8px 0' }} />
          {monthPriceArray.map((updatedItem) => {

            const matching = getMonthWithMostDaysInRange(updatedItem.price_start_date, updatedItem?.price_end_date)

            const matchingItem = marginArray?.find(
              (e) => e.month_name === matching
            );
            return (
              <div
                className="margin-pricing-agency-body"
                key={updatedItem.month_name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '0.6fr 1fr 1.4fr 1fr',
                  gap: '10px',
                  textAlign: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {formatDate(updatedItem.price_start_date)} <br /> to <br /> {formatDate(updatedItem?.price_end_date)}
                </p>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {Math.round(updatedItem.price_per_person)}(A)
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {Math.round(updatedItem.child_price)}(C)
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {Math.round(updatedItem.infant_price)}(I)
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {updatedItem?.price_per_person && matchingItem?.margin_percentage
                      ? `${(Number(updatedItem.price_per_person) * (Number(matchingItem.margin_percentage) / 100))?.toFixed(2)} (${Number(matchingItem.margin_percentage)?.toFixed(2)}%)`
                      : 'N/A'}
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {updatedItem?.child_price && matchingItem?.margin_percentage
                      ? `${(Number(updatedItem.child_price) * (Number(matchingItem.margin_percentage) / 100))?.toFixed(2)} (${Number(matchingItem.margin_percentage)?.toFixed(2)}%)`
                      : 'N/A'}
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {updatedItem?.infant_price && matchingItem?.margin_percentage
                      ? `${(Number(updatedItem.infant_price) * (Number(matchingItem.margin_percentage) / 100))?.toFixed(2)} (${Number(matchingItem.margin_percentage)?.toFixed(2)}%)`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {formatFinalPrice(Number(updatedItem.price_per_person) + (Number(updatedItem.price_per_person) * (Number(matchingItem.margin_percentage) / 100)))}
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {formatFinalPrice(Number(updatedItem.child_price) + (Number(updatedItem.child_price) * (Number(matchingItem.margin_percentage) / 100)))}
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {formatFinalPrice(Number(updatedItem.infant_price) + (Number(updatedItem.infant_price) * (Number(matchingItem.margin_percentage) / 100)))}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      <div style={{ margin: "10px 20px" }}>
        <div >Itineraries details</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {itineraries.sort((a, b) => a.day - b.day).map((itinerary) => (
            <div key={itinerary._id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", width: "200px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
              <img src={itinerary.photo} alt={itinerary.title} style={{ width: "100%", height: "100px", borderRadius: "8px 8px 0 0" }} />
              <div style={{ margin: "16px 0 8px", fontSize: "15px" }}>{itinerary.title}</div>
              <p style={{ fontSize: "12px" }}><strong>Day:</strong> {itinerary.day}</p>
              <p style={{ fontSize: "12px" }}>
                <strong>Activity:</strong>{" "}
                {expandedActivities[itinerary._id] 
                  ? itinerary.activity.replace(/<\/?[^>]+(>|$)/g, "")
                  : truncateText(itinerary.activity, 250)}
                {itinerary.activity.replace(/<\/?[^>]+(>|$)/g, "").length > 250 && (
                  <MDButton
                    variant="text"
                    color="info"
                    size="small"
                    onClick={() => setExpandedActivities(prev => ({
                      ...prev,
                      [itinerary._id]: !prev[itinerary._id]
                    }))}
                    sx={{
                      p: 0,
                      ml: 1,
                      minWidth: "auto",
                      fontSize: "0.75rem"
                    }}
                  >
                    {expandedActivities[itinerary._id] ? "Read Less" : "Read More"}
                  </MDButton>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: "10px 20px" }}>
        <div >Hotels</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", flexWrap: "wrap", gap: "20px" }}>
          {hotelItinerary && [...hotelItinerary]?.reverse()?.map((hotel) => (
            <div key={hotel._id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
              <Carousel>
                {hotel && hotel?.hotel_photo?.map((e, i) => {
                  return (
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        style={{
                          height: "200px"
                        }}
                        src={e}
                      />
                    </Carousel.Item>
                  )
                })}
              </Carousel>
              <div className="d-flex justify-content-between" style={{ margin: "16px 0 8px", fontSize: "15px" }}>
                <h5>{hotel.hotel_name}({hotel?.hotel_type})</h5>
                <p className="mb-0">Day {hotel?.days?.split(',')
                  .map(Number) // Convert each item to a number for proper sorting
                  .sort((a, b) => a - b)
                  .join(',')}</p>
              </div>

              {/* Address */}
              <p className="mb-1" style={{ fontSize: "12px" }}>
                <strong>Address:</strong>{" "}
                {expandedFields[`${hotel._id}-address`] 
                  ? hotel?.hotel_address
                  : truncateText(hotel?.hotel_address, 250)}
                {hotel?.hotel_address?.length > 250 && (
                  <MDButton
                    variant="text"
                    color="info"
                    size="small"
                    onClick={() => toggleExpand(hotel._id, 'address')}
                    sx={{ p: 0, ml: 1, minWidth: "auto", fontSize: "0.75rem" }}
                  >
                    {expandedFields[`${hotel._id}-address`] ? "Read Less" : "Read More"}
                  </MDButton>
                )}
              </p>

              {/* Location */}
              <p className="mb-1" style={{ fontSize: "12px" }}>
                <strong>Location:</strong>{" "}
                {expandedFields[`${hotel._id}-location`]
                  ? `${hotel?.hotel_city}, ${hotel?.hotel_state}`
                  : truncateText(`${hotel?.hotel_city}, ${hotel?.hotel_state}`, 250)}
                {`${hotel?.hotel_city}, ${hotel?.hotel_state}`.length > 250 && (
                  <MDButton
                    variant="text"
                    color="info"
                    size="small"
                    onClick={() => toggleExpand(hotel._id, 'location')}
                    sx={{ p: 0, ml: 1, minWidth: "auto", fontSize: "0.75rem" }}
                  >
                    {expandedFields[`${hotel._id}-location`] ? "Read Less" : "Read More"}
                  </MDButton>
                )}
              </p>

              {/* Hotel Description */}
              <p className="mb-1" style={{ fontSize: "12px" }}>
                <strong>Hotel Description:</strong>{" "}
                {expandedFields[`${hotel._id}-description`]
                  ? hotel?.hotel_description.replace(/<\/?[^>]+(>|$)/g, "")
                  : truncateText(hotel?.hotel_description.replace(/<\/?[^>]+(>|$)/g, ""), 250)}
                {hotel?.hotel_description.replace(/<\/?[^>]+(>|$)/g, "").length > 250 && (
                  <MDButton
                    variant="text"
                    color="info"
                    size="small"
                    onClick={() => toggleExpand(hotel._id, 'description')}
                    sx={{ p: 0, ml: 1, minWidth: "auto", fontSize: "0.75rem" }}
                  >
                    {expandedFields[`${hotel._id}-description`] ? "Read Less" : "Read More"}
                  </MDButton>
                )}
              </p>

              {/* Other */}
              <p className="mb-1" style={{ fontSize: "12px" }}>
                <strong>Other:</strong>{" "}
                {expandedFields[`${hotel._id}-other`]
                  ? hotel?.other
                  : truncateText(hotel?.other, 250)}
                {hotel?.other?.length > 250 && (
                  <MDButton
                    variant="text"
                    color="info"
                    size="small"
                    onClick={() => toggleExpand(hotel._id, 'other')}
                    sx={{ p: 0, ml: 1, minWidth: "auto", fontSize: "0.75rem" }}
                  >
                    {expandedFields[`${hotel._id}-other`] ? "Read Less" : "Read More"}
                  </MDButton>
                )}
              </p>
              <div className="mb-1" >
                {/* Selected Room */}
                {hotel?.selected_rooms && hotel.selected_rooms.length > 0 && (
                  <div className="mb-1">
                    <p className="mb-1" style={{ fontSize: "12px" }}>
                      <strong>Room:</strong> {hotel.selected_rooms[0].room_type} - 
                      <span >
                        ₹{hotel.selected_rooms[0].room_type_price}
                      </span>
                    </p>
                  </div>
                )}

                {/* Selected Meals */}
                {(hotel?.breakfast || hotel?.lunch || hotel?.dinner) && (
                  <div className="mb-1">
                    <p className="mb-1" style={{ fontSize: "12px" }}>
                      <strong>Meals:</strong>
                    </p>
                    <div style={{ paddingLeft: '12px' }}>
                      {hotel?.breakfast && (
                        <p className="mb-0" style={{ fontSize: "12px" }}>
                          • Breakfast - <span >₹{hotel?.breakfast_price}</span>
                        </p>
                      )}
                      {hotel?.lunch && (
                        <p className="mb-0" style={{ fontSize: "12px" }}>
                          • Lunch - <span >₹{hotel?.lunch_price}</span>
                        </p>
                      )}
                      {hotel?.dinner && (
                        <p className="mb-0" style={{ fontSize: "12px" }}>
                          • Dinner - <span >₹{hotel?.dinner_price}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

ProfileInfoCard.defaultProps = {
  shadow: true,
};

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  info: PropTypes.objectOf(PropTypes.string),
  social: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
  status: PropTypes.string,
  features: PropTypes,
  id: PropTypes.string,
};

export default ProfileInfoCard;
