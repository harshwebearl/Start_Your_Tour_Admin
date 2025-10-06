import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import "./edit.css"
import { BASE_URL } from "BASE_URL";

const Editcareer = () => {
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);

    // const []




    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);


    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successfully Update"
            content="Career is successfully Update."
            dateTime="1 sec"
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title="Fill Error"
            content="Please fill all fields"
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );

    const history = useNavigate();

    const navigate = useNavigate();

    const { _id } = useParams();
    console.log(_id);


    // const [selectedCareerCategory, setSelectedCareerCategory] = useState("");
    const [title, seTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [tag, setTag] = useState("");
    const [tit, setTit] = useState("");
    const [Ids, setId] = useState("");
    const [selectedCareerCategory, setSelectedCareerCategory] = useState("");
    console.log(selectedCareerCategory);
    const [careerData, setCareerData] = useState({
        career_title: "",
        career_desc: "",
        career_tag: [],
        // career_cat_value: "",
    });

    const Call2 = async (_id) => {
        const res = await fetch(`${BASE_URL}api/career/detail?_id=${_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await res.json();
        // seTitle(data.data);
        setCareerData(data?.data?.[0]);
        setId(data?.data?.[0]?._id);
        setSelectedCareerCategory(data?.data?.[0]?.career_category_id);
        console.log(data.data);
    };

    useEffect(() => {
        Call2(_id);
    }, [_id]);

    const handleNavigate = () => {
        history("/insertcareercategory");
    };

    const handleAdd = (e) => {
        const { name, value } = e.target;
        setCareerData({ ...careerData, [name]: value });
    };


    console.log(careerData);

    const [additionalValue, setAdditionalValue] = useState('');


    const handleAddButtonClick = (e) => {
        e.preventDefault(); // Prevent form submission or default behavior
        if (additionalValue.trim() !== '') {
            setCareerData({
                ...careerData,
                career_tag: [...careerData.career_tag, additionalValue],
            });
            setAdditionalValue('');
        } else {
            openErrorSB();
        }
    };

    const handleRemoveButtonClick = (index, e) => {
        e.preventDefault(); // Prevent form submission or default behavior
        const updatedCareerTags = [...careerData.career_tag];
        updatedCareerTags.splice(index, 1);
        setCareerData({
            ...careerData,
            career_tag: updatedCareerTags,
        });
    };




    const handleSubmit = async () => {
        const { career_title, career_tag, career_desc } = careerData;

        if (!career_title || !career_tag || !career_desc) {
            openErrorSB();
            return;
        }

        try {
            const token = localStorage.getItem("sytAdmin");
            const res = await fetch(`${BASE_URL}api/career?_id=${Ids}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    career_title,
                    career_desc,
                    career_tag,
                    career_category_id: selectedCareerCategory,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                openSuccessSB();

                setTimeout(() => {
                    navigate("/career")
                }, 2000);

            } else {
                openErrorSB();
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            openErrorSB();
        }
    };

    const [Yay, setYay] = useState([]);

    const Call = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}api/career_category`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await res.json();
            setYay(data.data);
            console.log(data.data);
        } catch (error) {
            console.error("Error fetching career categories:", error);
        }
    };


    useEffect(() => {
        Call();
    }, []);




    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pb={3}>
                <MDBox textAlign="center" mb={4}>
                    <MDTypography variant="h4" fontWeight="bold">
                        Edit Career
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <form
                        // style={{ backgroundColor: "rgb(26 46 79)" }}
                        role="form"
                        className="form_container demo"
                    >
                        <MDBox mb={2}>
                            {/* <p>Select Career Tag</p> */}
                            <div className="d-flex">
                                <select
                                    style={{
                                        color: "#7b809a",
                                        background: "transparent",
                                        border: "1px solid #dadbda",
                                        width: "100%",
                                        height: "40px",
                                        padding: "0px 15px",
                                        borderRadius: "5px",
                                        fontSize: "14px",
                                    }}
                                    value={selectedCareerCategory}
                                    onChange={(e) => setSelectedCareerCategory(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Career Tag
                                    </option>
                                    {Yay.map((e) => (
                                        <option key={e._id} value={e._id} style={{ color: "#495057" }}>
                                            {e.career_cat_value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Edit Career Title"
                                name="career_title"
                                value={careerData.career_title}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                                onChange={handleAdd}
                            />
                        </MDBox>
                        <MDBox mb={2}>

                            <textarea placeholder="Edit Career Description" cols="50" rows="7"
                                name="career_desc"
                                value={careerData.career_desc}
                                onChange={handleAdd}
                                style={{
                                    color: "rgb(122 131 139)",
                                    border: "1px solid rgb(216, 216, 216)",
                                    width: "100%",
                                    padding: "9px 10px",
                                    fontSize: "14px",
                                    borderRadius: "6px"
                                }}
                            >

                            </textarea>


                        </MDBox>


                        <div className='remove_text'>
                            <ul className="tag_list">
                                {careerData.career_tag.map((item, index) => (
                                    <li key={index} className=' d-flex justify-content-between mb-1'>
                                        {item}
                                        <button className='remove_btn' onClick={(e) => handleRemoveButtonClick(index, e)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                            <div className='add_text'>
                                <input
                                    type="text"
                                    value={additionalValue}
                                    onChange={(e) => setAdditionalValue(e.target.value)}
                                    placeholder='Add Tags.....'
                                />
                                <button className="add_btn" onClick={handleAddButtonClick}>Add</button>
                            </div>
                        </div>

                        <MDBox mt={4} mb={1}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                type="button"
                                onClick={handleSubmit}
                            >
                                Submit
                            </MDButton>

                            {renderSuccessSB}
                            {renderErrorSB}
                        </MDBox>
                    </form>
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
};

export default Editcareer;
