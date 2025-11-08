import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const BG_IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/8/87/Rajwada_Indore_01.jpg";

interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  // -------------------------
  // State Management
  // -------------------------
  const [username, setUsername] = useState<string>("");
  const [passcode, setPasscode] = useState<string>("");
  const [role, setRole] = useState<string>("citizen");
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // -------------------------
  // Event Handlers
  // -------------------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Make API call to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: passcode,
          role: role,
        }),
      });

      const data: RegisterResponse = await response.json();

      if (data.success) {
        // Registration successful
        setSuccess("User registered successfully!");
        // Clear form
        setUsername("");
        setPasscode("");
        setRole("citizen");
      } else {
        // Registration failed
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Component Render
  // -------------------------
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-gray-900">
      {/* ---------- Left Side (Form) ---------- */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-gray-50 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6">
            Create Account
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 text-center"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm mb-4 text-center"
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-medium">
                User ID
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Passcode */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="passcode" className="text-sm font-medium">
                Passcode
              </label>
              <div className="relative">
                <input
                  id="passcode"
                  type={showPasscode ? "text" : "password"}
                  placeholder="Create password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                >
                  {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="citizen">Citizen</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? "Registering..." : "Register"}
            </motion.button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* ---------- Right Side (Image) ---------- */}
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <img
          src={BG_IMAGE_URL}
          alt="Rajwada Palace, Indore"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="absolute bottom-10 left-10 text-white space-y-2"
        >
          <h3 className="text-3xl font-bold drop-shadow-lg">
            City of Poise and Progress
          </h3>
          <p className="text-sm opacity-90">Indore — Where Innovation Meets Heritage</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;