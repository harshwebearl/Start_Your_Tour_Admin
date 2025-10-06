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

  useEffect(() => {
    const fetchMonthList = async () => {
      try {
        const token = localStorage.getItem("sytAdmin");
        const response = await axios.get(`${BASE_URL}api/package_profit_margin/all`, {
          headers: {
            Authorization: token,
          },
        });

        setMonthList(response.data?.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMonthList();
  }, []);

  return {
    columns: [
      { Header: "State", accessor: "state", width: "10%", align: "left" },
      { Header: "User", accessor: "user", align: "center", width: "10%", },
      { Header: "Vendor", accessor: "vendor", align: "center", width: "10%", },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: monthList.map((e) => ({
      state: (
        <MDTypography component="span" variant="button" color="text" fontWeight="medium">
          {e.state_name}
        </MDTypography>
      ),
      user: (
        <>
          <Grid container>
            {e?.month_and_margin_user?.map((ele) => (
              <Grid item xs={4}>
                <MDTypography component="h5" href="#" variant="caption" color="text" fontWeight="medium">
                  {ele?.month_name}: {ele.margin_percentage}%
                </MDTypography>
              </Grid>
            ))}
          </Grid>
        </>
      ),
      vendor: (
        <>
          <Grid container>
            {e?.month_and_margin_agency?.map((ele) => (
              <Grid item xs={4}>
                <MDTypography component="h5" href="#" variant="caption" color="text" fontWeight="medium">
                  {ele?.month_name}: {ele.margin_percentage}%
                </MDTypography>
              </Grid>
            ))}
          </Grid>
        </>
      ),
      action: (
        <MDTypography component="a" href={`/insert-profit-margin/${e?._id}`} color="text">
          <Icon>edit</Icon>
        </MDTypography>

      ),
    })),
  };
}
