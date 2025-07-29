// src/components/LoginPage.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex h-[650px]">
      {/* Left Side - Image Section */}
      <div
        className="d-none d-lg-block col-lg-6 position-relative overflow-hidden"
        style={{
          backgroundImage: `url('https://www.brides.com/thmb/JcdtVSFkiDT_FojuI32P0SQlrss=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/37-redwoods-outdoor-chapel-wedding-reception-dance-floor-ryan-ray-0524-65f65fcbd02f49e789f42482b59e8749.JPG')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay Gradient */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
            zIndex: 10,
          }}
        ></div>

        {/* Overlay Content */}
        <div
          className="position-absolute bottom-0 start-0 p-5 text-white"
          style={{ zIndex: 20, maxWidth: "500px" }}
        >
          <h3 className="display-5 fw-bold mb-3">Welcome Back</h3>
          <p className="fs-5" style={{ opacity: 0.9 }}>
            Trusted by thousands to manage events that inspire and impress.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:p-12 mt-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm mx-auto">
          {/* Brand Logo */}
          <div className="text-center ">
            <h1 className="text-2xl font-bold text-green-600 no-underline">
              FreshMart
            </h1>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Hey there!
            </h2>
            <p className="text-gray-600">
              Enter your email and password to login
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert
              variant="danger"
              className="rounded-lg mb-4 p-3"
              style={{
                backgroundColor: "rgba(220, 53, 69, 0.1)",
                borderColor: "rgba(220, 53, 69, 0.3)",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Form onSubmit={handleSubmit}>
            {/* Email Field */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-dark text-left mb-2">
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!validationErrors.email}
                className="w-full p-2 border rounded"
                style={{ fontSize: "1rem" }}
              />
              <Form.Control.Feedback type="invalid" className="d-block mt-1">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-left text-dark mb-2">
                Password
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.password}
                  className="w-full p-2 border rounded"
                  style={{ fontSize: "1rem" }}
                />
                <Button
                  variant="link"
                  className="position-absolute end-0 top-50 translate-middle-y me-3"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    color: "#6c757d",
                    transform: "translateY(-50%)",
                    zIndex: 5,
                  }}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </Button>
                <Form.Control.Feedback type="invalid" className="d-block mt-1">
                  {validationErrors.password}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="dark"
              size="lg"
              className="w-100 rounded p-2 fw-bold mb-4"
              disabled={loading}
              style={{ fontSize: "1.1rem" }}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-muted">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="no-underline fw-semibold "
                style={{ color: "#0d6efd" }}
                state={{ from: location.state?.from }}
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
