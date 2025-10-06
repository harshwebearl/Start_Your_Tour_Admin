import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
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
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import { CKEditor } from "@ckeditor/ckeditor5-react";
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
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "./ck.css";

// import
const Aboutus = () => {
  const [formData, setFormData] = useState({
    description: "",
  });

  const Call = async (ele) => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(`${BASE_URL}about`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setFormData(data.data);
  };

  useEffect(() => {
    Call();
  }, []);

  const shouldShowAddButton = () => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    return screenWidth < 650;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("sytAdmin");

    const response = await axios.put(
      `${BASE_URL}about`,
      {
        description: formData.description,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.status === "OK") {
      openSuccessSB();
      navigate("/aboutus");
    }

    // Reset the form fields
    setFormData({
      question: "",
      answer: "",
    });
  };

  const handleChange1 = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
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
        "undo",
        "redo",
        "|",
        "selectAll",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "blockQuote",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "indent",
        "outdent",
        "|",
        "accessibilityHelp",
      ],
      shouldNotGroupWhenFull: false,
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
      Undo,
    ],
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    placeholder: "Type or paste your content here!",
  };

  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
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
      content="Category is successfully added."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  const { id } = useParams();
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDBox
            textAlign="center"
            mb={4}
            style={{
              position: "relative",
            }}
          >
            <MDTypography variant="h4" fontWeight="bold">
              ABOUT Us
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox pb={1}>
          <div style={{ backgroundColor: "white", borderRadius: "25px" }}>
            <div className="row mx-2 py-4">
              <div className="col-12">
                <div
                 
                  style={{
                  
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <div>
                    <h3 className="text-center mb-3">Detail Description</h3>
                    {/* <input type="text" name="description" onChange={handleChange1} value={formData.description} id="" style={{ width: "100%", height: "70vh", wordWrap: "break-word" }} /> */}

                    {/* <textarea name="description" id="" style={{width: "100%"}} rows="10" onChange={handleChange1} value={formData.description}></textarea> */}

                    <div className="w-full  mx-auto">
                      <div className="flex flex-col space-y-4">
                        <div className="bg-white rounded-3xl">
                          <div className="p-4 sm:p-6">
                            <div className="bg-[aliceblue] rounded-lg relative">
                              <div className="p-3 sm:p-4">
                                <div className="editor-wrapper w-full overflow-hidden">
                                  <div className="main-container w-full">
                                    <div
                                      className="editor-container"
                                      ref={editorContainerRef}
                                    >
                                      <div
                                        className="editor-content w-full"
                                        style={{
                                          minHeight: "400px",
                                          height: "auto",
                                          fontSize: "16px",
                                        }}
                                      >

                                        
                                        <div ref={editorRef}>
                                          {isLayoutReady && (
                                            <CKEditor
                                              data={formData?.description || ''} // Add default empty string
                                              editor={ClassicEditor}
                                              config={{
                                                ...editorConfig,
                                                height: "400px",
                                                toolbar: {
                                                  items: editorConfig.toolbar.items || [],  // Add default empty array
                                                  shouldNotGroupWhenFull: true,
                                                  viewportTopOffset: 60
                                                },
                                              }}
                                              onReady={editor => {
                                                // Initialize the editor properly
                                                editor.setData(formData?.description || '');
                                              }}
                                              onChange={(event, editor) => {
                                                const data = editor.getData();
                                                if (data !== undefined) { // Add null check
                                                  setFormData((prev) => ({
                                                    ...prev,
                                                    description: data,
                                                  }));
                                                }
                                              }}
                                            />
                                          )}
                                        </div>


                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MDBox>
        <MDBox className="d-flex justify-content-center" mb={1}>
          <MDButton
            variant="gradient"
            color="info"
            fullWidth
            onClick={handleSave}
            // component={Link}
            // to="/dashboard"
            type="submit"
            style={{
              width: "25%",
            }}
          >
            Save
          </MDButton>
          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default Aboutus;
