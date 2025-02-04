import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendResetPasswordRequest,
  verifySecurityAnswer,
  forgotPasswordReset,
} from "../api-helpers/helpers";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrorMessage("");
    setPasswordError("");
    setSuccessMessage("");
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await sendResetPasswordRequest(identifier);
      setSecurityQuestion(response.securityQuestion);
      setUserId(response.userId);
      setIsLoading(false);
    } catch (err) {
      console.error("Error requesting password reset:", err);
      setErrorMessage(err.message);
      setIsLoading(false);
    }
  };

  const handleVerifyAnswer = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await verifySecurityAnswer(identifier, securityAnswer);
      if (response.isCorrect) {
        setIsVerified(true);
      } else {
        setErrorMessage("Incorrect security answer. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying security answer:", err);
      setErrorMessage("Error verifying security answer. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match. Please re-enter.");
      return;
    }

    const isValid = validatePassword(newPassword);
    if (!isValid) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long."
      );
      return;
    }

    setErrorMessage("");
    setPasswordError("");
    try {
      if (!userId) {
        setErrorMessage("User ID is missing. Please request a new reset.");
        return;
      }

      await forgotPasswordReset(userId, newPassword);
      setSuccessMessage("Password changed successfully! Redirecting...");
      setTimeout(() => {
        navigate("/loginSignup");
      }, 1500);
    } catch (err) {
      console.error("Error resetting password:", err);
      setErrorMessage("Failed to reset password. Please try again.");
    }
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCancel = () => {
    setIdentifier("");
    setSecurityAnswer("");
    setNewPassword("");
    setConfirmPassword("");
    setSecurityQuestion("");
    setIsVerified(false);
    setUserId(null);
    setIsLoading(false);
    setErrorMessage("");
    setPasswordError("");
    setSuccessMessage("");

    navigate("/loginSignup");
  };

  return (
    <>
      <img
        className="signup-logo"
        src={`${process.env.PUBLIC_URL}/Logo_black_Green.svg`}
        alt="Wander Frames Logo"
        onClick={() => navigate("/")}
      />
      <div className="container forgotPassword">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {passwordError && <div className="error-message">{passwordError}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {!securityQuestion ? (
          <form onSubmit={handleRequestReset}>
            <h2>Forgot Password</h2>
            <div>
              <label htmlFor="identifier">Username or Email:</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={handleInputChange(setIdentifier)}
                required
              />
            </div>
            <div className="button-row">
              <button type="submit" className="button-1">
                Submit
              </button>
              <button className="button-2" type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        ) : !isVerified ? (
          <form onSubmit={handleVerifyAnswer}>
            <h2>Security Question</h2>
            <div>
              <p className="security-question">{securityQuestion}</p>
              <label htmlFor="securityAnswer"></label>
              <input
                type="text"
                id="securityAnswer"
                value={securityAnswer}
                onChange={handleInputChange(setSecurityAnswer)}
                required
              />
            </div>
            <div className="button-row">
              <button type="submit" className="button-1">
                Verify
              </button>
              <button className="button-2" type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form className="reset-pass" onSubmit={handleResetPassword}>
            <h2 className="reset-pass-head">Reset Password</h2>
            <div className="password-field">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={handleInputChange(setNewPassword)}
                required
              />
              <p
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="toggle-password"
              >
                {showNewPassword ? "Hide" : "Show"}
              </p>
            </div>
            <div className="password-field">
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
                required
              />
              <p
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="toggle-password"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </p>
            </div>
            <div className="button-row">
              <button type="submit" className="button-1">
                Save
              </button>
              <button className="button-2" type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ForgotPassword;
