import { useState } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleRegister = async () => {
    setError("");
    if (!email || !masterPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (masterPassword.length < 12) {
      setError("Password must be at least 12 characters");
      return;
    }
    if (masterPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await authAPI.register(email, masterPassword);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="email"
        />
        <Input
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          type="password"
          placeholder="set password"
        />
        <Input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="confirm your password"
        />
        <Button onClick={handleRegister}>Register</Button>
      </div>
    </div>
  );
}

export default Register;
