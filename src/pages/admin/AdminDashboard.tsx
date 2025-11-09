import React, { useState, useEffect } from "react";
import { motion, Transition } from "framer-motion";
import { Camera, MapPin, AlertTriangle, CheckCircle, Clock, BarChart, Bell, Settings, Eye, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types
type Complaint = {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  location: string;
  status: "New" | "Pending" | "Resolved";
  date: string;
  submittedBy: string;
  submittedAt: string;
};

// Dummy data for initial display
const dummyComplaints: Complaint[] = [
  {
    id: 1,
    title: "Unauthorized 18-floor tower under construction",
    description: "A residential tower with more than 18 floors is being built without registry clearance.",
    location: "Scheme 78, Indore",
    status: "New",
    date: "2025-07-31",
    submittedBy: "Ramesh Verma",
    submittedAt: "2025-07-30T10:30:00Z",
  },
  {
    id: 2,
    title: "Encroachment on public road by builder",
    description: "Builder has occupied 6 feet of public road for construction material.",
    location: "MG Road, Indore",
    status: "Pending",
    date: "2025-07-30",
    submittedBy: "Suresh Joshi",
    submittedAt: "2025-07-29T14:20:00Z",
  },
  {
    id: 3,
    title: "Illegal 16-floor building without approval",
    description: "The building doesn't have municipal approval yet construction is in full swing.",
    location: "Rajendra Nagar, Indore",
    status: "Resolved",
    date: "2025-07-28",
    submittedBy: "Anjali Deshmukh",
    submittedAt: "2025-07-27T09:15:00Z",
  },
];

// Status Legend Component
const StatusLegend = () => {
  const legendData = [
    { name: "New", value: 12, color: "bg-red-500" },
    { name: "Pending", value: 5, color: "bg-yellow-500" },
    { name: "Resolved", value: 23, color: "bg-green-500" },
  ];

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {legendData.map((pld) => (
        <div key={pld.name} className="flex items-center">
          <div className={`w-4 h-4 ${pld.color} rounded-full mr-2`}></div>
          <p className="text-sm text-gray-300">
            {`${pld.name}: ${pld.value}`}
          </p>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>(dummyComplaints);
  const [popupComplaint, setPopupComplaint] = useState<Complaint | null>(null);
  const [showAllNew, setShowAllNew] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllResolved, setShowAllResolved] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ 
    predicted_class: string; 
    class_index: number; 
    probabilities: number[] 
  } | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/complaints`);
        const data = await response.json();
        
        if (data.success) {
          // Convert backend complaints to frontend format
          const formattedComplaints = data.complaints.map((complaint: any) => ({
            _id: complaint._id,
            title: complaint.name,
            description: complaint.complaint,
            location: "Not specified",
            status: complaint.status,
            date: new Date(complaint.submittedAt).toISOString().split('T')[0],
            submittedBy: complaint.name,
            submittedAt: complaint.submittedAt,
          }));
          
          setComplaints(formattedComplaints);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  const countByStatus = (status: string) =>
    complaints.filter((c) => c.status === status).length;

  const pieData = [
    { name: "New", value: countByStatus("New") },
    { name: "Pending", value: countByStatus("Pending") },
    { name: "Resolved", value: countByStatus("Resolved") },
  ];

  const resolutionRate =
    complaints.length > 0
      ? Math.round(
          (complaints.filter((c) => c.status === "Resolved").length /
            complaints.length) *
            100
        )
      : 0;

  // Filter complaints by status
  const newComplaints = complaints.filter((c) => c.status === "New");
  const pendingComplaints = complaints.filter((c) => c.status === "Pending");
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolved");

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 } as Transition,
    }),
  };

  const itemHover = {
    scale: 1.03,
    transition: { type: "spring" as const, stiffness: 400, damping: 10 },
  };

  // Navigation items
  const navItems = [
    { name: "Analytics", icon: BarChart, path: "/admin/analytics" },
    { name: "Map View", icon: MapPin, path: "/admin/map" },
    { name: "Alerts", icon: Bell, path: "/admin/alerts" },
    { name: "Services", icon: Settings, path: "/admin/services" },
    { name: "Monitoring", icon: Eye, path: "/admin/monitoring" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center"
        >
          Admin Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-slate-400 mt-2"
        >
          Monitor and manage encroachment complaints
        </motion.p>
      </header>

      {/* Navigation Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10"
      >
        {navItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors"
            onClick={() => navigate(item.path)}
          >
            <div className="flex flex-col items-center justify-center">
              <item.icon size={24} className="text-blue-400 mb-2" />
              <h3 className="text-sm font-semibold text-center">{item.name}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <div className="flex items-center">
            <AlertTriangle className="text-red-400 mr-3" size={24} />
            <h3 className="text-xl font-semibold">New Complaints</h3>
          </div>
          <p className="text-3xl font-bold mt-3 text-red-400">
            {countByStatus("New")}
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <div className="flex items-center">
            <Clock className="text-yellow-400 mr-3" size={24} />
            <h3 className="text-xl font-semibold">Pending</h3>
          </div>
          <p className="text-3xl font-bold mt-3 text-yellow-400">
            {countByStatus("Pending")}
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <div className="flex items-center">
            <CheckCircle className="text-green-400 mr-3" size={24} />
            <h3 className="text-xl font-semibold">Resolved</h3>
          </div>
          <p className="text-3xl font-bold mt-3 text-green-400">
            {countByStatus("Resolved")}
          </p>
        </div>
      </motion.div>

      {/* Resolution Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-10"
      >
        <h3 className="text-xl font-semibold mb-4">Resolution Rate</h3>
        <div className="flex items-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray={`${resolutionRate}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">{resolutionRate}%</span>
            </div>
          </div>
          <div className="ml-6">
            <p className="text-slate-300">
              {resolvedComplaints.length} out of {complaints.length} complaints resolved
            </p>
          </div>
        </div>
      </motion.div>

      {/* Complaints Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Encroachments */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <AlertTriangle className="text-red-400 mr-2" />
            {showAllNew ? "All New Encroachments" : "New Encroachments"}
          </h2>
          <div className="space-y-4">
            {(showAllNew ? newComplaints : newComplaints.slice(0, 3)).map(
              (complaint, i) => (
                <motion.div
                  key={complaint._id || complaint.id}
                  custom={i}
                  variants={fadeInUp}
                  whileHover={itemHover}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="cursor-pointer bg-slate-700 shadow-md hover:shadow-lg border border-slate-600 rounded-xl p-5 transition-all duration-200"
                  onClick={() => setPopupComplaint(complaint)}
                >
                  <h3 className="font-semibold text-lg text-gray-100 mb-1">
                    {complaint.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-1">
                    {complaint.location}
                  </p>
                  <p
                    className={`text-sm mb-2 font-medium ${
                      complaint.status === "Resolved"
                        ? "text-green-400"
                        : complaint.status === "Pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    Status: {complaint.status}
                  </p>
                  <p className="text-xs text-gray-500">{complaint.date}</p>
                </motion.div>
              )
            )}
          </div>
          {newComplaints.length > 3 && (
            <button
              onClick={() => setShowAllNew(!showAllNew)}
              className="mt-4 text-slate-400 hover:text-white transition-colors"
            >
              {showAllNew ? "Show Less" : "Show All"}
            </button>
          )}
        </motion.section>

        {/* Pending Encroachments */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Clock className="text-yellow-400 mr-2" />
            {showAllPending ? "All Pending Encroachments" : "Pending Encroachments"}
          </h2>
          <div className="space-y-4">
            {(showAllPending ? pendingComplaints : pendingComplaints.slice(0, 3)).map(
              (complaint, i) => (
                <motion.div
                  key={complaint._id || complaint.id}
                  custom={i}
                  variants={fadeInUp}
                  whileHover={itemHover}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="cursor-pointer bg-slate-700 shadow-md hover:shadow-lg border border-slate-600 rounded-xl p-5 transition-all duration-200"
                  onClick={() => setPopupComplaint(complaint)}
                >
                  <h3 className="font-semibold text-lg text-gray-100 mb-1">
                    {complaint.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-1">
                    {complaint.location}
                  </p>
                  <p
                    className={`text-sm mb-2 font-medium ${
                      complaint.status === "Resolved"
                        ? "text-green-400"
                        : complaint.status === "Pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    Status: {complaint.status}
                  </p>
                  <p className="text-xs text-gray-500">{complaint.date}</p>
                </motion.div>
              )
            )}
          </div>
          {pendingComplaints.length > 3 && (
            <button
              onClick={() => setShowAllPending(!showAllPending)}
              className="mt-4 text-slate-400 hover:text-white transition-colors"
            >
              {showAllPending ? "Show Less" : "Show All"}
            </button>
          )}
        </motion.section>
      </div>

      {/* Complaint Detail Popup */}
      {popupComplaint && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700">
            <h3 className="text-2xl font-bold mb-2 text-gray-100">
              {popupComplaint.title}
            </h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {popupComplaint.description}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {popupComplaint.location}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={
                    popupComplaint.status === "Resolved"
                      ? "text-green-400"
                      : popupComplaint.status === "Pending"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }
                >
                  {popupComplaint.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Submitted by:</span>{" "}
                {popupComplaint.submittedBy}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(popupComplaint.submittedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setPopupComplaint(null)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Legend */}
      <StatusLegend />
    </div>
  );
};

export default AdminDashboard;