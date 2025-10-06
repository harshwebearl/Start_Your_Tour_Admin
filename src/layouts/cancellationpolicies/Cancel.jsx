import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
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

const Cancel = () => {
  const [formData, setFormData] = useState({
    term_and_condition_content: "",
    term_and_condition_type: "",
    id: "",
  });

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const Call = async () => {
    try {
      const token = localStorage.getItem("sytAdmin");
      if (!token) {
        throw new Error("Token not found");
      }

      const res = await fetch(`${BASE_URL}policy`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setFormData({
        term_and_condition_content: data.data[0].term_and_condition_content,
        term_and_condition_type: data.data[0].term_and_condition_type,
        id: data.data[0]._id,
      });
    } catch (error) {
      console.error("Failed to fetch policy data:", error);
      openErrorSB();
    }
  };

  useEffect(() => {
    Call();
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const handleSave = async (_id) => {
    try {
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
      }
    } catch (error) {
      console.error("Failed to save policy data:", error);
      openErrorSB();
    }
  };

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfully Saved"
      content="Terms and conditions are successfully saved."
      dateTime="Just now"
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
      title="Error"
      content="Failed to save terms and conditions. Please try again."
      dateTime="Just now"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

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
      shouldNotGroupWhenFull: true,
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
        { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
        { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
        { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
        { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
        { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
        { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
        { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
      ],
    },
    placeholder: "Type or paste your content here!",
    fontSize: {
      options: ["tiny", "small", "default", "big", "huge"],
    },
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={{ xs: 3, sm: 4, md: 6 }} pb={3} px={{ xs: 1, sm: 2, md: 3 }}>
        <MDBox textAlign="center" mb={{ xs: 2, sm: 3, md: 4 }}>
          <MDTypography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            }}
          >
            Terms and Conditions
          </MDTypography>
        </MDBox>
        <MDBox>
          <div className="w-full bg-white rounded-2xl p-3 sm:p-4 md:p-6">
            <div className="w-full">
              <div className="w-full bg-[#F0F8FF] rounded-xl p-3 sm:p-4 md:p-6">
                <h3
                  className="text-center mb-4 md:mb-6 text-base sm:text-lg md:text-xl font-medium break-words"
                  style={{ color: darkMode ? "#fff" : "#344767" }}
                >
                  {formData.term_and_condition_type || "Terms and Conditions"}
                </h3>
                <div className="w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
                  <div
                    className="w-full border border-gray-200 rounded-lg"
                    ref={editorContainerRef}
                  >
                    <div className="w-full">
                      <div
                        ref={editorRef}
                        className="w-full prose max-w-none"
                        style={{
                          fontSize: { xs: "0.875rem", sm: "1rem", md: "1.0625rem" },
                        }}
                      >
                        {isLayoutReady && (
                          <CKEditor
                            data={formData.term_and_condition_content}
                            editor={ClassicEditor}
                            config={{
                              ...editorConfig,
                              width: "100%",
                              height: { xs: "250px", sm: "300px", md: "400px" },
                              removePlugins: ["Resize"],
                              toolbar: {
                                ...editorConfig.toolbar,
                                shouldNotGroupWhenFull: true,
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
              <MDBox display="flex" justifyContent="center" mt={{ xs: 3, sm: 4, md: 6 }}>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => handleSave(formData.id)}
                  sx={{
                    px: { xs: 3, sm: 4 },
                    py: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    textTransform: "none",
                    borderRadius: "8px",
                    minWidth: { xs: "120px", sm: "160px" },
                    maxWidth: { xs: "160px", sm: "200px" },
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    "&:hover": {
                      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Save
                </MDButton>
              </MDBox>
            </div>
            {renderSuccessSB}
            {renderErrorSB}
          </div>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
};

export default Cancel;