import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useComplaintStore } from "@/store/complaintStore";

const ComplaintForm: React.FC = () => {
  const navigate = useNavigate();
  const { addComplaint, fetchComplaints } = useComplaintStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    optionalName: "",
    reason: "",
    qr: null as File | null,
    images: [] as File[],
  });

  const [saveInfo, setSaveInfo] = useState(false);

  // Load saved user info on component mount
  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userComplaintInfo");
    if (savedUserInfo) {
      try {
        const parsedInfo = JSON.parse(savedUserInfo);
        setFormData(prev => ({
          ...prev,
          name: parsedInfo.name || "",
          email: parsedInfo.email || "",
          mobile: parsedInfo.mobile || "",
          house: parsedInfo.house || "",
          street: parsedInfo.street || "",
          city: parsedInfo.city || "",
          state: parsedInfo.state || "",
          pincode: parsedInfo.pincode || "",
        }));
        setSaveInfo(true);
      } catch (e) {
        console.error("Failed to parse saved user info", e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveInfo(e.target.checked);
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: Array.from(e.target.files || []),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save user info if requested
    if (saveInfo) {
      const userInfo = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        house: formData.house,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };
      localStorage.setItem("userComplaintInfo", JSON.stringify(userInfo));
    } else {
      // Clear saved info if user unchecks the option
      localStorage.removeItem("userComplaintInfo");
    }

    const fullComplaint = {
      name: formData.name,
      email: formData.email,
      complaint: `${formData.reason} | Address: ${formData.house}, ${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      status: "Pending" as const,
    };

    await addComplaint(fullComplaint);
    navigate("/complain_done");
  };

  const handleAutofill = () => {
    // For demo purposes, we'll fill with sample data
    setFormData(prev => ({
      ...prev,
      name: "John Doe",
      email: "johndoe@example.com",
      mobile: "9876543210",
      house: "123",
      street: "Main Street",
      city: "Indore",
      state: "Madhya Pradesh",
      pincode: "452001",
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-lg mt-8 border border-orange-350"
    >
      <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
        Submit Your Complaint 🚨
      </h2>

      <div className="mb-6">
        <button
          type="button"
          onClick={handleAutofill}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Autofill Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="optionalName" className="block text-sm font-medium text-gray-700 mb-1">
              Optional Name (For anonymous complaints)
            </label>
            <input
              type="text"
              id="optionalName"
              name="optionalName"
              value={formData.optionalName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Details
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="house" className="block text-xs text-gray-500 mb-1">
                House/Flat Number
              </label>
              <input
                type="text"
                id="house"
                name="house"
                value={formData.house}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="street" className="block text-xs text-gray-500 mb-1">
                Street/Area
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-xs text-gray-500 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-xs text-gray-500 mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="pincode" className="block text-xs text-gray-500 mb-1">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Complaint *
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Please describe the issue in detail..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Images (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="w-full"
          />
          {formData.images.length > 0 && (
            <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
              {formData.images.map((img, idx) => (
                <li key={idx}>{img.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="saveInfo"
            type="checkbox"
            checked={saveInfo}
            onChange={handleSaveInfoChange}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="saveInfo" className="ml-2 text-sm text-gray-700">
            Save my information for future complaints
          </label>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition"
        >
          Submit
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ComplaintForm;