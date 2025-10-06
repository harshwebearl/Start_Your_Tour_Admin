import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import { BASE_URL } from "BASE_URL";

function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

function convertTo12HourFormat(isoDateString) {
    const date = new Date(isoDateString);

    // Extract hours, minutes, and seconds
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Determine AM/PM and convert hours to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

    // Format time components to have leading zeros if needed
    const formattedTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
    ].join(':');

    return `${formattedTime} ${ampm}`;
}

const Data = () => {

    const [user, setuser] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("sytAdmin");

                const response = await fetch(
                    `${BASE_URL}notification/admin`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                const responseData = await response.json();
                
                setuser(responseData?.data)
            } catch (error) {
                console.error("Error fetching data from the backend", error);
            }
        };

        fetchData();
    }, []);

    return {
        columns: [
            {
                Header: "title",
                accessor: "title",
                width: "10%",
                align: "left",
            },
            {
                Header: "message",
                accessor: "message",
                width: "10%",
                align: "left",
            },
            // { Header: "email", accessor: "email",width: "10%", align: "center" },
            {
                Header: "date & time",
                accessor: "date",
                width: "10%",
                align: "center",
            },
            // { Header: "view", accessor: "view", width: "10%", align: "center" },
        ],

        rows:
            user && user?.map((e) => ({
                title: (
                    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                        {e?.title}
                    </MDTypography>
                ),
                message: (
                    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                        {e?.text}
                    </MDTypography>
                ),
                date: (
                    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                        {convertTo12HourFormat(e?.createdAt)},
                        {convertDateFormat(e?.createdAt?.slice(0, 10))}
                    </MDTypography>
                ),
                view: (
                    <MDTypography
                        component="a"
                        href={
                            e?.title === "Match Started"
                                ? `/score-board/${e?.match_id}`
                                : "/team-Leaguge"
                        }
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                    >
                        VIEW
                    </MDTypography>

                ),
            })),
    };
};

export default Data;