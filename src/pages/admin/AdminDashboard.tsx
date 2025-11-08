import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from "recharts";
import { complaints as dummyComplaints } from "../../data/complaints";
import ComplaintPopup from "../../components/ComplaintPopup";
import type { Complaint } from "@/types";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, TrendingUp, Eye, Camera } from "lucide-react";
import AdminNavigation from "@/components/AdminNavigation";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { detectBuildingEncroachmentAPI } from "@/data/buildingDetectionService";

// Colors for Pie Chart (New, Pending, Resolved)
const COLORS = ["#f87171", "#facc15", "#4ade80"]; // red, yellow, green

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const cardHover = {
  y: -5,
  scale: 1.02,
  transition: { duration: 0.2 }
};

const itemHover = {
  scale: 1.03,
  transition: { duration: 0.2 }
};

// --- TypeScript Interface for StatCard ---
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass: string;
  index: number;
}

// Stat Card Component
const StatCard = ({
  icon,
  label,
  value,
  colorClass,
  index,
}: StatCardProps) => (
  <motion.div
    custom={index}
    variants={fadeInUp}
    whileHover={cardHover}
    className="bg-slate-800 shadow-lg rounded-2xl p-6 flex items-center border border-slate-700"
  >
    <div
      className={`w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mr-4 ${colorClass}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-100">{value}</p>
    </div>
  </motion.div>
);

// Custom Tooltip component for type safety
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
        <p className="label text-sm text-gray-200">{`${label}`}</p>
        {payload.map((pld, index) => (
          <p key={index} style={{ color: pld.color }} className="text-xs">
            {`${pld.name}: ${pld.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(dummyComplaints);
  const [popupComplaint, setPopupComplaint] = useState<Complaint | null>(null);
  const [showAllNew, setShowAllNew] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllResolved, setShowAllResolved] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const countByStatus = (status: string) =>
    complaints.filter((c) => c.status === status).length;

  const pieData = [
    { name: "New", value: countByStatus("New") },
    { name: "Pending", value: countByStatus("Pending") },
    { name: "Resolved", value: countByStatus("Resolved") },
  ];

  const resolutionRate =
    complaints.length > 0
      ? Math.round((countByStatus("Resolved") / complaints.length) * 100)
      : 0;
      
  // Sample data for predictive analytics
  const riskZones = [
    { zone: "Zone A", risk: 85, cases: 12 },
    { zone: "Zone B", risk: 72, cases: 8 },
    { zone: "Zone C", risk: 65, cases: 6 },
    { zone: "Zone D", risk: 58, cases: 4 },
    { zone: "Zone E", risk: 45, cases: 3 },
  ];

  const renderSection = (
    status: string,
    showAll: boolean,
    toggleShow: () => void,
    animationIndex: number
  ) => {
    const filtered = complaints.filter((c) => c.status === status);
    const visibleComplaints = showAll ? filtered : filtered.slice(0, 3); // Changed to 3 for a tighter grid

    return (
      <motion.div
        custom={animationIndex}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="bg-slate-800 shadow-xl rounded-2xl p-6 mb-8 border border-slate-700"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-100 border-b border-slate-600 pb-2">
          {status} Encroachments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleComplaints.map((complaint, i) => (
            <motion.div
              key={complaint.id}
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
          ))}
        </div>
        {filtered.length > 3 && (
          <div className="mt-6 text-center">
            <button
              onClick={toggleShow}
              className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors"
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer rear camera on mobile
      });
      setCameraStream(stream);
      setCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please ensure you have given camera permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
    setCapturedImage(null);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL and set as captured image
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    try {
      // Convert data URL to Blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // Create File object
      const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
      
      // Send to detection service
      const result = await detectBuildingEncroachmentAPI(file);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing image:', err);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">
      <AdminNavigation />

      {/* Camera UI Overlay */}
      {cameraActive && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[2000] flex flex-col">
          <div className="p-4 text-white flex justify-between items-center">
            <h2 className="text-xl font-bold">Camera</h2>
            <button 
              onClick={stopCamera}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
          
          <div className="flex-grow flex items-center justify-center relative">
            {!capturedImage ? (
              <>
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={captureImage}
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center"
                >
                  <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="max-h-[70vh] object-contain"
                />
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Retake
                  </button>
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Image'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
      
      {/* Analysis Results Modal */}
      {analysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[2001] flex items-center justify-center">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700">
            <h3 className="text-xl font-bold mb-4 text-gray-100">Analysis Results</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Predicted Risk Level</p>
                <p className={`text-2xl font-bold ${
                  analysisResult.predicted_class === 'High Risk' ? 'text-red-400' :
                  analysisResult.predicted_class === 'Medium Risk' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {analysisResult.predicted_class}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Confidence Scores</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>High Risk</span>
                      <span>{(analysisResult.probabilities[0] * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${analysisResult.probabilities[0] * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Medium Risk</span>
                      <span>{(analysisResult.probabilities[1] * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${analysisResult.probabilities[1] * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Low Risk</span>
                      <span>{(analysisResult.probabilities[2] * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${analysisResult.probabilities[2] * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setCapturedImage(null);
                  stopCamera();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 md:p-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
        >
          Encroachment Monitoring Dashboard
        </motion.h1>

        {/* Stats Overview */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <StatCard
            index={1}
            icon={<Eye className="w-6 h-6" />}
            label="Total Cases"
            value={complaints.length}
            colorClass="text-blue-400"
          />
          <StatCard
            index={2}
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Pending"
            value={countByStatus("Pending")}
            colorClass="text-yellow-400"
          />
          <StatCard
            index={3}
            icon={<MapPin className="w-6 h-6" />}
            label="New Reports"
            value={countByStatus("New")}
            colorClass="text-red-400"
          />
          <StatCard
            index={4}
            icon={<TrendingUp className="w-6 h-6" />}
            label="Resolution Rate"
            value={`${resolutionRate}%`}
            colorClass="text-green-400"
          />
          {/* Camera Button Card */}
          <motion.div
            custom={5}
            variants={fadeInUp}
            whileHover={cardHover}
            className="bg-slate-800 shadow-lg rounded-2xl p-6 flex items-center justify-center cursor-pointer border border-slate-700 hover:border-cyan-500 transition-colors"
            onClick={startCamera}
          >
            <div className="flex flex-col items-center">
              <Camera className="w-8 h-8 text-cyan-400 mb-2" />
              <span className="text-sm text-gray-300 text-center">Capture & Analyze</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart Section */}
          <motion.div
            custom={5}
            variants={fadeInUp}
            whileHover={cardHover}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-slate-800 shadow-xl rounded-2xl p-6 border border-slate-700"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              Encroachment Status Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  wrapperStyle={{ color: "#d1d5db", paddingTop: "10px" }}
                />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Risk Zones Chart */}
          <motion.div
            custom={6}
            variants={fadeInUp}
            whileHover={cardHover}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-slate-800 shadow-xl rounded-2xl p-6 border border-slate-700"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              High-Risk Zones (Predictive Analytics)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskZones}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="zone" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ color: "#d1d5db", paddingTop: "10px" }}
                />
                <Bar dataKey="risk" fill="#f87171" name="Risk Score" />
                <Bar dataKey="cases" fill="#4ade80" name="Current Cases" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Complaint Sections */}
        {renderSection("New", showAllNew, () => setShowAllNew(!showAllNew), 7)}
        {renderSection(
          "Pending",
          showAllPending,
          () => setShowAllPending(!showAllPending),
          8
        )}
        {renderSection(
          "Resolved",
          showAllResolved,
          () => setShowAllResolved(!showAllResolved),
          9
        )}

        {/* Complaint Popup */}
        {popupComplaint && (
          <ComplaintPopup
            complaint={popupComplaint}
            onClose={() => setPopupComplaint(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;