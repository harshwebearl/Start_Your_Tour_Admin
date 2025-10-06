import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    AccessibilityHelp,
    Alignment,
    Autosave,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Indent,
    IndentBlock,
    Italic,
    List,
    Paragraph,
    SelectAll,
    Strikethrough,
    Underline,
    Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import './ck.css';


// import
const Editblog = () => {
    const [formData, setFormData] = useState({
        blog_title: "",
        blog_title_points: [],
        blog_category: "",
        blog_content: "",
        blog_title_photo: null,
    });
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const navigate = useNavigate();
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successfull Added"
            content="title is successfully added."
            dateTime="1 sec"
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );
    const india = Country.find((country) => country.name === "India");
    const states = india ? india.states : [];

    // Find the selected state
    const selectedState = states.find((state) => state.name === formData.state);
    const cities = selectedState ? selectedState.cities : [];
    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
           title="Filled Error"
            content="Please fill all fileds"
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "blog_title_points") {
            const highlightsArray = value.split(",").map((highlight) => highlight.trim());
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: highlightsArray,
            }));
        } else if (e.target.name === "image") {
            setFormData((prevData) => ({
                ...prevData,
                [e.target.name]: e.target.files[0],
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [e.target.name]: e.target.value,
            }));
        }
    };
    const [previewImage, setPreviewImage] = useState("https://dummyimage.com/200x200/cccccc/ffffff");

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            blog_title_photo: selectedImage,
        }));

        if (selectedImage) {
            // Generate preview image URL
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(selectedImage);
        } else {
            // If no image is selected, reset the preview image
            setPreviewImage("https://dummyimage.com/200x200/cccccc/ffffff");
        }
    };

    // get api 
    const getDetail = async () => {
        const token = localStorage.getItem("sytAdmin")

        const res = await fetch(`${BASE_URL}blogger/blogecontent?_id=${_id}`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        setFormData(
            {
                blog_title: data.data?.[0]?.blog_title,
                blog_title_points: data.data?.[0]?.blog_title_points,
                blog_category: data.data?.[0]?.blog_category,
                blog_title_photo: data.data?.[0]?.blog_title_photo,
                blog_content: data.data?.[0]?.blog_content,
            }
        )
    };
    useEffect(() => {
        // Dest();
        getDetail();
    }, []);





    const { _id } = useParams();
    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("sytAdmin");
            const formDataToSend = new FormData();
            formDataToSend.append("blog_title", formData.blog_title);
            formData.blog_title_points.forEach((highlight) => {
                formDataToSend.append("blog_title_points", highlight);
            });
            formDataToSend.append("blog_category", formData.blog_category);
            formDataToSend.append("blogger_syt_id", id);
            formDataToSend.append("blog_content", formData.blog_content);
            formDataToSend.append("blog_title_photo", formData.blog_title_photo);

            const response = await axios.put(
                `${BASE_URL}blogger/blogecontent?_id=${_id}`,
                formDataToSend,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (response.data.status === "OK") {
                openSuccessSB();
                navigate(`/Bloggerfullinfo/${id}`);
            }
        } catch (error) {
        }
        setFormData({
            title: "",
            image: null,
        });
        setPreviewImage("https://dummyimage.com/200x200/cccccc/ffffff");
    };

    // Delete api start
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("sytAdmin");
            const responseDelete = await axios.delete(
                `${BASE_URL}blogger/blogecontent?_id=${_id}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (responseDelete.data.status === "OK") {
                navigate(-1);
            }
        } catch (error) {
        }
    };
    //   Delete api close


    const style1 = {
        backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
    };

    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    }, []);


    const editorConfig = {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'selectAll',
                '|',
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                '|',
                'blockQuote',
                '|',
                'alignment',
                '|',
                'bulletedList',
                'numberedList',
                'indent',
                'outdent',
                '|',
                'accessibilityHelp'
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
            AccessibilityHelp,
            Alignment,
            Autosave,
            BlockQuote,
            Bold,
            Essentials,
            Heading,
            Indent,
            IndentBlock,
            Italic,
            List,
            Paragraph,
            SelectAll,
            Strikethrough,
            Underline,
            Undo
        ],
        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph'
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1'
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2'
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3'
                },
                {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'ck-heading_heading4'
                },
                {
                    model: 'heading5',
                    view: 'h5',
                    title: 'Heading 5',
                    class: 'ck-heading_heading5'
                },
                {
                    model: 'heading6',
                    view: 'h6',
                    title: 'Heading 6',
                    class: 'ck-heading_heading6'
                }
            ]
        },
        placeholder: 'Type or paste your content here!'
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox textAlign="center" mb={4}>
                    <MDTypography variant="h4" fontWeight="bold">
                        Insert title
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <form
                        // component="form"

                        style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", backgroundColor:"white", padding:"20px", borderRadius:"20px"}}

                        role="form"
                        // className="form_container demo"
                    >
                        <MDBox mb={1}>
                            <MDInput
                                type="text"
                                label="Enter Blog title"
                                name="blog_title"
                                value={formData.blog_title}
                                onChange={handleChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" className="mb-4">
                            <MDBox
                                component="img"
                                src={previewImage}
                                alt="Preview"
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    marginBottom: "20px"

                                }}
                            />
                            <MDInput
                                type="file"
                                name="blog_title_photo"
                                accept="image/*"
                                onChange={handleImageChange}
                                mb={2}
                                style={{ marginLeft: "20px" }}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Enter Blog poins"
                                name="blog_title_points"
                                value={formData.blog_title_points}
                                onChange={handleChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Enter blog category"
                                name="blog_category"
                                value={formData.blog_category}
                                onChange={handleChange}
                                fullWidth
                                style={{ marginBottom: "20px" }}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                        <div>
                                <div className="main-container">
                                    <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                                        <div className="editor-container__editor">
                                            <div ref={editorRef}>{isLayoutReady && <CKEditor
                                                data={formData.blog_content} editor={ClassicEditor} config={editorConfig}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    setFormData(prev => ({ ...prev, blog_content: data }))
                                                }}
                                            />}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MDBox>
                        <MDBox className="d-flex" mt={4} mb={1}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                onClick={handleSubmit}
                                // component={Link}
                                // to="/dashboard"
                                type="submit"
                                className="me-2"
                            >
                                Submit
                            </MDButton>
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                onClick={handleDelete}
                            >
                                delete
                            </MDButton>
                            {renderSuccessSB}
                            {renderErrorSB}
                        </MDBox>
                    </form>
                </MDBox>
            </MDBox>
            {/* <Footer /> */}
        </DashboardLayout>
    );
};

export default Editblog;
