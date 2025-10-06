import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import { useEffect, useState } from "react";
import { BASE_URL } from "BASE_URL";
import axios from "axios";
import Grid from "@mui/material/Grid";

export default function data() {
  const [monthList, setMonthList] = useState([]);
  console.log(monthList)

  const User = ({ name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Address = ({ state, city }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
        {city},{state}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  useEffect(() => {
    const fetchMonthList = async () => {
      try {
        const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}api/inquiry/getAll`, {
          headers: {
            Authorization: token,
          },
        });
        console.log(response.data?.data)
        setMonthList(response.data?.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMonthList();
  }, []);

  return {
    columns: [
      { Header: "Fullname", accessor: "fullname", width: "10%", align: "left" },
      { Header: "contact no", accessor: "mobile_number" },
      { Header: "departure", accessor: "departure" },
      { Header: "Address", accessor: "state" },
      { Header: "adults", accessor: "adults" },
      { Header: "childrens", accessor: "childrens" },
      { Header: "infants", accessor: "infants" },
      { Header: "Inquiries Date", accessor: "Inquiries" },
    ],

    rows: monthList.map((e) => ({
      fullname: (
        <User
          name={e?.fullname}
          email={e?.email}
        />
      ),
      mobile_number: (
        <MDTypography component="span" variant="button" color="text" fontWeight="medium">
          {e.number}
        </MDTypography>
      ),
      departure: (
        <MDTypography component="span" variant="button" color="text" fontWeight="medium">
          {e.departure}
        </MDTypography>
      ),
      state: (
        <Address
          state={e?.state}
          city={e?.city}
        />
      ),
      adults: (
        <MDTypography component="span" variant="button" color="text" fontWeight="medium">
          {e.total_adult}
        </MDTypography>
      ),
      childrens: (
        <MDTypography component="span" variant="button" color="text" fontWeight="medium">
          {e.total_child}
        </MDTypography>
      ),
      infants: (
        <MDTypography component="span" variant="button" color="text" fontWeight="medium">
          {e.total_infants}
        </MDTypography>
      ),
      Inquiries: (
        <MDTypography component="span" variant="button" color="text" fontWeight="medium">
          {new Date(e.inquiry_date).toLocaleDateString("en-GB")}
        </MDTypography>
      ),
      // action: (
      //   <MDTypography component="a" href={`/insert-profit-margin/${e?._id}`} color="text">
      //     <Icon>edit</Icon>
      //   </MDTypography>

      // ),
    })),
  };
}
