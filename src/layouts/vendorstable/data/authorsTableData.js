// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import { useNavigate } from "react-router-dom";

function convertDateFormat(dateString) {
  if (!dateString) return ""; // Handle empty or undefined input
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

// Add this helper function to convert date string to comparable format
const getDateForSort = (dateString) => {
  if (!dateString) return new Date(0);
  const [year, month, day] = dateString.split("-");
  return new Date(year, month - 1, day);
};

export default function AuthorsTableData(vendorData, searchTerm, searchGst, business, status) {
  const navigate = useNavigate();

  const Vendor = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );
  const BusinessDetails = ({ businessType, gst }) => (
    <MDBox display="flex" flexDirection="column" lineHeight={1}>
      <MDTypography display="block" variant="button"  style={{color:"#7b809a" , fontWeight:"normal"}} >
        {businessType}
      </MDTypography>
      <MDTypography variant="caption" color="text" style={{color:"#7b809a" , fontWeight:"normal"}}>
        {gst || "No GST"}
      </MDTypography>
    </MDBox>
  );

  const handleNavigate = (id) => {
    navigate(`/vendor-detail/${id}`);
  };

  return {
    columns: [
      { Header: "vendor", accessor: "vendor", width: "25%", align: "left" },
      { Header: "agency name", accessor: "agency_name", align: "left" },
      { Header: "mobile number", accessor: "mobile_number", align: "left" },
      // { Header: "GST no", accessor: "gst", align: "left" },
      { Header: "business type & GST", accessor: "business_type", align: "center" },
      { Header: "agency address", accessor: "agency_address", align: "left" },
      // { Header: "website", accessor: "website", align: "left" },
      { Header: "registration", accessor: "registration", align: "left" },
      { Header: "status", accessor: "status", align: "left" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: vendorData
      ?.filter(
        (vendor) =>
          vendor?.agencypersonal?.[0]?.agency_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          vendor?.agencypersonal?.[0]?.GST_NO?.includes(searchGst) &&
          vendor?.agencypersonal?.[0]?.business_type?.includes(business) &&
          vendor?.agencypersonal?.[0]?.status?.includes(status)
      )
      ?.sort((a, b) => {
        const dateA = getDateForSort(a?.agencypersonal?.[0]?.createdAt?.slice(0, 10));
        const dateB = getDateForSort(b?.agencypersonal?.[0]?.createdAt?.slice(0, 10));
        return dateB - dateA; // Descending order - newest first
      })
      ?.map((vendor) => ({
        vendor: (
          <Vendor
            image={
              vendor?.agencypersonal?.[0]?.agency_logo ||
              "https://www.shutterstock.com/image-vector/man-icon-vector-260nw-1040084344.jpg"
            }
            name={vendor?.agencypersonal?.[0]?.full_name}
            email={vendor?.agencypersonal?.[0]?.email_address}
          />
        ),
        agency_name: vendor?.agencypersonal?.[0]?.agency_name,
        mobile_number: vendor?.agencypersonal?.[0]?.mobile_number,
        business_type: (
          <BusinessDetails
            businessType={vendor?.agencypersonal?.[0]?.business_type}
            gst={vendor?.agencypersonal?.[0]?.GST_NO}
          />
        ),
        
        agency_address: vendor?.agencypersonal?.[0]?.agency_address,
        // website: vendor?.agencypersonal?.[0]?.website,
        registration: convertDateFormat(vendor?.agencypersonal?.[0]?.createdAt?.slice(0, 10)),
        status: vendor?.agencypersonal?.[0]?.status,
        action: (
          <MDTypography
            component="h5"
            variant="caption"
            color="text"
            fontWeight="medium"
            onClick={() => handleNavigate(vendor?._id)}
            style={{ cursor: "pointer" }}
          >
            View
          </MDTypography>
        ),
      })),
  };
}

