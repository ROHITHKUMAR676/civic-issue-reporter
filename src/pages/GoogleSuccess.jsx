import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleSuccess() {

  const navigate = useNavigate();

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/user");   // change if your dashboard path differs
    } else {
      navigate("/login");
    }

  }, []);

  return <h2 style={{textAlign:"center",marginTop:"100px"}}>Signing you in...</h2>;
}