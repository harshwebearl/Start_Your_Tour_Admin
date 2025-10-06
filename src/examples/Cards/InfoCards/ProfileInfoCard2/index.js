import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import { NavLink } from "react-router-dom";

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
}) {
  const labels = [];
  const values = [];
  const { socialMediaColors } = colors;
  const { size } = typography;
  const [statusColor, setStatusColor] = useState("");

  if (info) {
    Object.keys(info).forEach((el) => {
      if (el.match(/[A-Z\s]+/)) {
        const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
        const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);
        labels.push(newElement);
      } else {
        labels.push(el);
      }
    });
    Object.values(info).forEach((el) => values.push(el));
  }

  const labelsWithoutKey = ["bio", "anotherLabel"];

  const handleStatusChange = (status) => {
    switch (status) {
      case "accept":
        setStatusColor("green");
        break;
      case "reject":
        setStatusColor("red");
        break;
      case "pending":
        setStatusColor("yellow");
        break;
      default:
        setStatusColor("");
        break;
    }
  };
  let renderFeatures;
  if(features){
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

  return (
    <Card
      sx={{ height: "100%", width: "95%", boxShadow: !shadow && "none" }}
      style={{ backgroundColor: "aliceblue", position: "relative" }}
    >
      <NavLink to={`/edit-membership-plan/${id}`}>
        <MDBox
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/84/84380.png"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            position: "absolute",
            top: "4rem",
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
          {features && features.length > 0  && (
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
    </Card>
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
