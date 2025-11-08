import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Eye, AlertTriangle, TrendingUp, MapPin, Camera } from "lucide-react";
import AdminNavigation from "@/components/AdminNavigation";
import { detectBuildingEncroachmentAPI } from "@/data/buildingDetectionService";

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

const MonitoringPage = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setCameraStream(stream);
      setCameraActive(true);
      
      // Use setTimeout to ensure the video element is rendered before setting the srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      // Try again with default constraints if environment camera fails
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        setCameraStream(stream);
        setCameraActive(true);
        
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err2) {
        console.error('Error accessing any camera:', err2);
        alert('Could not access camera. Please ensure you have given camera permissions.');
      }
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
          
          <div className="flex-grow flex items-center justify-center relative bg-black">
            {!capturedImage ? (
              <>
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain max-h-[70vh]"
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
          Monitoring Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="bg-slate-800 shadow-xl rounded-2xl p-6 border border-slate-700"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-100 border-b border-slate-600 pb-2">
              Capture & Analyze
            </h2>
            <div className="flex flex-col items-center justify-center py-10">
              <Camera className="w-16 h-16 text-cyan-400 mb-4" />
              <p className="text-gray-300 mb-6 text-center">
                Use your device's camera to capture images for encroachment analysis
              </p>
              <button
                onClick={startCamera}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Open Camera
              </button>
            </div>
          </motion.div>

          {/* Monitoring Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="bg-slate-800 shadow-xl rounded-2xl p-6 border border-slate-700"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-100 border-b border-slate-600 pb-2">
              Monitoring Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Eye className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-gray-300">Active Zones</span>
                </div>
                <p className="text-2xl font-bold text-gray-100">127</p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-gray-300">Alerts Today</span>
                </div>
                <p className="text-2xl font-bold text-gray-100">8</p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-gray-300">High Risk</span>
                </div>
                <p className="text-2xl font-bold text-gray-100">24</p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-gray-300">Accuracy</span>
                </div>
                <p className="text-2xl font-bold text-gray-100">96%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-8 bg-slate-800 shadow-xl rounded-2xl p-6 border border-slate-700"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            How Monitoring Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-700 p-5 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold mb-3">01</div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Capture Images</h3>
              <p className="text-gray-400">
                Use the camera feature to capture images of areas you want to monitor for encroachments.
              </p>
            </div>
            
            <div className="bg-slate-700 p-5 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold mb-3">02</div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">AI Analysis</h3>
              <p className="text-gray-400">
                Our AI system analyzes the images to detect potential unauthorized constructions.
              </p>
            </div>
            
            <div className="bg-slate-700 p-5 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold mb-3">03</div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Get Results</h3>
              <p className="text-gray-400">
                Receive instant risk assessment and classification for the analyzed areas.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MonitoringPage;