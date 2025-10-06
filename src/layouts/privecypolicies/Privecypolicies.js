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
const Pivecypolicies = () => {
  const [formData, setFormData] = useState({
    term_and_condition_content: "",
    term_and_condition_type: "",
    id: "",
  });

  const Call = async (ele) => {
    const token = localStorage.getItem("sytAdmin");
    const res = await fetch(`${BASE_URL}policy`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setFormData({
      term_and_condition_content: data.data[2].term_and_condition_content,
      term_and_condition_type: data.data[2].term_and_condition_type,
      id: data.data[2]._id,
    });
    console.log(data.data[2]);
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

  const handleSave = async (_id) => {
    // e.preventDefault();

    const token = localStorage.getItem("sytAdmin");

    const response = await axios.put(
      `${BASE_URL}policy/termandcondition?_id=${_id}`,
      {
        term_and_condition_content: formData.term_and_condition_content,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.status === "OK") {
      openSuccessSB();
      // navigate("/aboutus");
    }
  };

  const handleChange1 = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (checked) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          destination_category_id: [
            ...prevFormData.destination_category_id,
            name, // Add the _id to the array
          ],
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          destination_category_id: prevFormData.destination_category_id.filter(
            (categoryId) => categoryId !== name // Remove the _id from the array
          ),
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleOptionChange = (event) => {
    const { name, value, files } = event.target;
    const selectedValue = event.target.value;
    if (name === "photo") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0], // Store the first selected file
      }));
    } else if (name == "destination_id") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        destination_id: selectedValue,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
    console.log(formData);
  };
  console.log(formData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("sytAdmin");
      const response = await axios.put(
        `${BASE_URL}placetovisit?_id=${id}`,
        { ...formData, name: formData.title },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.status === "OK") {
        openSuccessSB();
        navigate("/manage-place-to-visit");
      }
    } catch (error) {
      console.log(error);
      // Handle error or show an error message
    }
    setFormData({
      photo: null,
      title: "",
      description: "",
      destination_id: "", // Empty array for storing checked feature _ids
    });
  };

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDBox
            textAlign="center"
            mb={4}
            style={{
              position: "relative",
            }}
          >
            <MDTypography variant="h4" fontWeight="bold">
              TERMS AND CONDITION
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox pt={4} pb={3} >
          <div className="w-full bg-white rounded-3xl">
            <div className="w-full p-2 sm:p-4 md:p-6">
              <div className="w-full">
                {/* Main content container */}
                <div className="w-full bg-[aliceblue] rounded-lg p-3 sm:p-4 md:p-6">
                  {/* Header */}
                  <h3 className="text-center mb-4 text-lg sm:text-xl md:text-2xl font-medium break-words px-2">
                    {formData.term_and_condition_type}
                  </h3>

                  {/* Editor Container */}
                  <div className="w-full min-h-[300px] sm:min-h-[400px]">
                    <div
                      className="w-full border border-gray-200 rounded-lg overflow-hidden"
                      ref={editorContainerRef}
                    >
                      <div className="w-full">
                        <div
                          ref={editorRef}
                          className="w-full prose prose-sm sm:prose lg:prose-lg max-w-none"
                          style={{fontSize: "17px"}}
                        >
                          {isLayoutReady && (
                            <CKEditor
                              data={formData.term_and_condition_content}
                              editor={ClassicEditor}
                              config={{
                                ...editorConfig,
                                width: "100%",
                                height: "auto",
                                removePlugins: ["Resize"],
                                toolbar: {
                                  items: [
                                    "undo",
                                    "redo",
                                    "|",
                                    "heading",
                                    "|",
                                    "bold",
                                    "italic",
                                    "underline",
                                    "|",
                                    "bulletedList",
                                    "numberedList",
                                    "|",
                                    "alignment",
                                    "|",
                                    "blockQuote",
                                  ],
                                  shouldNotGroupWhenFull: true,
                                },
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
                                  ],
                                },
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setFormData((prev) => ({
                                  ...prev,
                                  term_and_condition_content: data,
                                }));
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center text-center w-full mb-4 px-2 ">
                  <MDButton
                    variant="gradient"
                    color="info"
                    onClick={() => handleSave(formData.id)}
                    type="submit"
                    className="w-full max-w-[200px] min-w-[120px] py-2 sm:py-3 text-sm sm:text-base"
                  >
                    Save
                  </MDButton>
                  {renderSuccessSB}
                  {renderErrorSB}
                </div>
              </div>
            </div>
          </div>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default Pivecypolicies;
