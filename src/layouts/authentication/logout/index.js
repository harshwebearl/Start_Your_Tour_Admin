import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Logout() {
  const navigate = useNavigate()
  useEffect(() => {
    localStorage.removeItem("token")
    navigate("/authentication/sign-in")
  }, [])
  return null
}

export default Logout
