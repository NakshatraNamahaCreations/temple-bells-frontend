import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
// import { ApiURL } from "../api";
import logo from "../assets/theweddingrentals.jpg";

const Login = ({ handleLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const ApiURL = "http://localhost:8077/api/master";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(`${ApiURL}/loginteammember`, {
        email,
        password,
      });
      if (response.status === 200) {
        toast.success("Login successful");
        const userData = response.data.user;

        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");
        console.log("Stored user data:", userData);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Invalid credentials or server error";
      toast.error(errorMsg);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f6f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Toaster />
      <div
        className="login-main-container"
        style={{
          display: "flex",
          width: "900px",
          maxWidth: "98vw",
          minHeight: "540px",
          background: "#fff",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >
        {/* Left Side - Login Form */}
        <div
          style={{
            flex: 1.1,
            background: "#fcfaef",
            padding: "48px 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <img
            src={logo}
            alt="Brand Logo"
            style={{
              width: "60px",
              marginBottom: "18px",
              marginLeft: "-6px",
              marginInline: "auto",
            }}
          />
          <h3 style={{ fontWeight: 700, color: "#222", marginBottom: "30px" }}>
            Log In To Your Account
          </h3>

          <Form onSubmit={handleSubmit} autoComplete="off">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label style={{ fontWeight: 600, color: "#222" }}>
                Email <span style={{ color: "#e67c52" }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "15px",
                  padding: "10px 12px",
                  background: "#fff",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label style={{ fontWeight: 600, color: "#222" }}>
                Password <span style={{ color: "#e67c52" }}>*</span>
              </Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "15px",
                    padding: "10px 38px 10px 12px",
                    background: "#fff",
                  }}
                />
                <span
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#aaa",
                    fontSize: "18px",
                  }}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="#aaa"
                        strokeWidth="2"
                        d="M3 3l18 18M10.7 10.7A3 3 0 0012 15a3 3 0 002.12-5.12M9.88 9.88A3 3 0 0112 9a3 3 0 013 3c0 .53-.14 1.03-.38 1.46"
                      />
                      <path
                        stroke="#aaa"
                        strokeWidth="2"
                        d="M2.46 12.12C4.6 7.94 8.06 5.5 12 5.5c2.04 0 3.97.64 5.54 1.74M21.54 12.12C19.4 16.3 15.94 18.74 12 18.74c-2.04 0-3.97-.64-5.54-1.74"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <ellipse
                        cx="12"
                        cy="12"
                        rx="9"
                        ry="6"
                        stroke="#aaa"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#aaa"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              className="w-100"
              disabled={loading}
              style={{
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "16px",
                padding: "10px 0",
                background: "#222",
                border: "none",
                letterSpacing: "1px",
                marginTop: "10px",
              }}
            >
              {loading ? "Logging in..." : "LOG IN"}
            </Button>
          </Form>
        </div>
        {/* Right Side - Image */}
        <div
          style={{
            flex: 1,
            minWidth: "320px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80"
            alt="Furniture"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              minHeight: "540px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
