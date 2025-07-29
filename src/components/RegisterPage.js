// src/components/RegisterPage.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, loading, error, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

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

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await register({
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "danger";
      case 2:
      case 3:
        return "warning";
      case 4:
      case 5:
        return "success";
      default:
        return "secondary";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
      case 3:
        return "Medium";
      case 4:
      case 5:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="flex h-[650px]">
      {/* Left Side - Image Section */}
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white p-4 w-full max-w-md bg-white p-8 rounded-xl shadow-md mx-auto">
        <div className="w-100" style={{ maxWidth: "550px" }}>
          {/* Brand Logo */}
          <div className="text-center ">
            <h1 className="text-2xl font-bold text-green-600 no-underline">
              FreshMart
            </h1>{" "}
          </div>

          {/* Title */}
          <h2 className="text-center fw-bold mb-1">Create Account</h2>
          <p className="text-center text-muted mb-4">
            Fill in your details to get started
          </p>

          {/* Error Message */}
          {error && (
            <Alert
              variant="danger"
              className="rounded mb-4 p-3"
              style={{
                backgroundColor: "rgba(220, 53, 69, 0.1)",
                borderColor: "rgba(220, 53, 69, 0.3)",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Form onSubmit={handleSubmit} className="text-left">
            {/* Name Fields in Two Columns */}
            <div className="row g-3 mb-3 ">
              <div className="col-md-6 ">
                <Form.Group>
                  <Form.Label className="form-label fw-semibold">
                    First Name
                  </Form.Label>
                  <Form.Control
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    isInvalid={!!validationErrors.firstName}
                    className="py-2 rounded"
                  />
                  <Form.Control.Feedback type="invalid" className="text-start">
                    {validationErrors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="form-label fw-semibold">
                    Last Name
                  </Form.Label>
                  <Form.Control
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    isInvalid={!!validationErrors.lastName}
                    className="py-2 rounded"
                  />
                  <Form.Control.Feedback type="invalid" className="text-start">
                    {validationErrors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label className="form-label fw-semibold">
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!validationErrors.email}
                className="py-2 rounded"
              />
              <Form.Control.Feedback type="invalid" className="text-start">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label className="form-label fw-semibold">
                Password
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.password}
                  className="py-2 rounded pe-5"
                />
                <Button
                  variant="link"
                  className="position-absolute top-50 end-0 translate-middle-y pe-3"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ zIndex: 5 }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback type="invalid" className="text-start">
                  {validationErrors.password}
                </Form.Control.Feedback>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <ProgressBar
                    now={(passwordStrength / 5) * 100}
                    variant={getPasswordStrengthColor()}
                    className="h-1"
                  />
                  <div className="text-muted small mt-1 text-start">
                    Password strength:{" "}
                    <span
                      className={`text-${getPasswordStrengthColor()} fw-medium`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                </div>
              )}
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group className="mb-4">
              <Form.Label className="form-label fw-semibold">
                Confirm Password
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.confirmPassword}
                  className="py-2 rounded pe-5"
                />
                <Button
                  variant="link"
                  className="position-absolute top-50 end-0 translate-middle-y pe-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ zIndex: 5 }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback type="invalid" className="text-start">
                  {validationErrors.confirmPassword}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="dark"
              className="w-100 py-2 rounded fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </Form>

          {/* Login Link */}
          <p className="text-center text-muted mt-4 mb-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary fw-medium text-decoration-none"
              state={{ from: location.state?.from }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
      <div
        className="d-none d-md-block col-md-6 position-relative overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZyUyMGhhbGx8ZW58MHx8MHx8fDA%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay Content */}
        <div
          className="position-absolute bottom-0 start-0 p-5 text-white"
          style={{ zIndex: 10 }}
        >
          <h3 className="text-3xl font-bold mb-4">Join Our Community</h3>
          <p className="text-white/90 text-lg leading-relaxed">
            Trusted by leading brands and individuals for exceptional events.
          </p>
        </div>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(transparent 60%, rgba(0,0,0,0.7))",
            zIndex: 1,
          }}
        />
      </div>

      {/* Right Side - Register Form */}
      
    </div>
  );
};

export default RegisterPage;
