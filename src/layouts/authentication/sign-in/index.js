/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react"

// react-router-dom components
import { Link, useNavigate } from "react-router-dom"

// @mui material components
import Card from "@mui/material/Card"
import Switch from "@mui/material/Switch"
import Grid from "@mui/material/Grid"
import MuiLink from "@mui/material/Link"

// added
import axios from "axios"
import { useHistory } from "react-router-dom"

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook"
import GitHubIcon from "@mui/icons-material/GitHub"
import GoogleIcon from "@mui/icons-material/Google"

// Material Dashboard 2 React components
import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography"
import MDInput from "components/MDInput"
import MDButton from "components/MDButton"
import MDSnackbar from "components/MDSnackbar"

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout"

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg"
import { BASE_URL } from "BASE_URL"
import { CircularProgress } from "@mui/material"

function Basic() {
  const [rememberMe, setRememberMe] = useState(false)
  const [successSB, setSuccessSB] = useState(false)
  const openSuccessSB = () => setSuccessSB(true)
  const closeSuccessSB = () => setSuccessSB(false)
  const [errorSB, setErrorSB] = useState(false)
  const [errorSB1, setErrorSB1] = useState(false)
  const [errorSB3, setErrorSB3] = useState(false)

  const [errorSB2, setErrorSB2] = useState(false)

  const openErrorSB = () => setErrorSB(true)
  const closeErrorSB = () => setErrorSB(false)

  const openErrorSB1 = () => setErrorSB1(true)
  const closeErrorSB1 = () => setErrorSB1(false)

  const openErrorSB3 = () => setErrorSB3(true)
  const closeErrorSB3 = () => setErrorSB3(false)

  const openErrorSB2 = () => setErrorSB2(true)
  const closeErrorSB2 = () => setErrorSB2(false)

  const navigate = useNavigate()

  const renderSuccessSB = (
    <MDSnackbar
      color='success'
      icon='check'
      title='Successful Login'
      content='Login Successfully.'
      dateTime='1 sec'
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  )

  useEffect(() => {
    // Check if token is available in local storage
    const token = localStorage.getItem("sytAdmin")

    if (token) {
      // Token is available, navigate to /dashboard
      navigate("/dashboard")
    }
  }, [navigate])

  const renderErrorSB = (
    <MDSnackbar
      color='error'
      icon='warning'
      title='Invalid Id or Password'
      content='Please enter valid userId and Password'
      dateTime='1 sec ago'
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  )
  const renderErrorSB1 = (
    <MDSnackbar
      color='error'
      icon='warning'
      title='Empty input error'
      content='Please enter contact number'
      dateTime='1 sec ago'
      open={errorSB1}
      onClose={closeErrorSB1}
      close={closeErrorSB1}
      bgWhite
    />
  )

  const renderErrorSB3 = (
    <MDSnackbar
      color='error'
      icon='warning'
      title='Empty input error'
      content='Please enter password'
      dateTime='1 sec ago'
      open={errorSB3}
      onClose={closeErrorSB3}
      close={closeErrorSB3}
      bgWhite
    />
  )
  const renderErrorSB2 = (
    <MDSnackbar
      color='error'
      icon='warning'
      title='Wrong Information'
      content='Wrong contact number or password'
      dateTime='1 sec ago'
      open={errorSB2}
      onClose={closeErrorSB2}
      close={closeErrorSB2}
      bgWhite
    />
  )
  const handleSetRememberMe = () => setRememberMe(!rememberMe)

  const [formData, setFormData] = useState({
    contactNumber: "", // or 0
    password: "",
  })
  console.log(formData)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleContactNumberChange = (e) => {
    const { name, value } = e.target

    // Allow only numeric input
    const numericValue = value.replace(/\D/g, "")

    // Limit the input to 10 digits
    const limitedNumericValue = numericValue.slice(0, 10)

    setFormData({ ...formData, [name]: limitedNumericValue })
  }

  const [loading, setloading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true)
    if (!formData.contactNumber) {
      openErrorSB1()
      return
    }

    if (!formData.password) {
      openErrorSB3()
      return
    }

    if (formData.contactNumber.toString().length !== 10) {
      openErrorSB()
      return
    }
    try {
      const data = {
        phone: Number(formData.contactNumber),
        password: formData.password,
        role: "admin",
      }

      const response = await axios.post(`${BASE_URL}user/loginAll`, data)
      if (response.data.code == 200) {
        setloading(false)
        openSuccessSB()
        localStorage.setItem("sytAdmin", response.data.data.token)
        navigate("/dashboard")
      } else {
        setloading(false)
      }
    } catch (error) {
      setloading(false)
      openErrorSB2()
    }
  }
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant='gradient'
          bgColor='info'
          borderRadius='lg'
          coloredShadow='info'
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign='center'
        >
          <MDTypography variant='h4' fontWeight='medium' color='white' mt={1}>
            Sign in
          </MDTypography>
          <Grid
            container
            spacing={3}
            justifyContent='center'
            sx={{ mt: 1, mb: 2 }}
          ></Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component='form' role='form'>
            <MDBox mb={2}>
              <MDInput
                type='text'
                label='Contact Number'
                name='contactNumber'
                value={formData.contactNumber}
                onChange={handleContactNumberChange}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type='password'
                label='Password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                fullWidth
                onInput={(e) => {
                  e.target.value = e.target.value.replace(
                    /[^A-Za-z0-9!@#$%^&*()_+\-=[\]{}|;:'",.<>?/]/g,
                    "",
                  )
                }}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              {/* <MDButton variant="gradient" fullWidth color="info" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
              </MDButton> */}
              {loading ? (
                <MDButton
                  onClick={handleSubmit}
                  style={{ color: "white", borderRadius: "0.5rem" }}
                  variant='gradient'
                  fullWidth
                  color='info'
                >
                  <CircularProgress size={24} color="inherit" />
                </MDButton>
              ) : (
                <MDButton
                  onClick={handleSubmit}
                  style={{ color: "white", borderRadius: "0.5rem" }}
                  variant='gradient'
                  fullWidth
                  color='info'
                >
                  Submit
                </MDButton>
              )}
            </MDBox>
            {renderSuccessSB}
            {renderErrorSB}
            {renderErrorSB1}
            {renderErrorSB3}
            {renderErrorSB2}
            <MDBox mt={3} mb={1} textAlign='center'>
              <MDTypography variant='button' color='text'>
                Do you forget password?{" "}
                <MDTypography
                  component={Link}
                  to='/authentication/forget-password'
                  variant='button'
                  color='info'
                  fontWeight='medium'
                  textGradient
                >
                  forget password
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  )
}

export default Basic
