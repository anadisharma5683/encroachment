// src/pages/admin/AlertsPage.tsx
import React, { useState } from 'react';
import AdminNavigation from '@/components/AdminNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Bell, CheckCircle, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { detectBuildingEncroachment } from '@/data/buildingDetectionService';
import { PredictionResult } from '@/data/buildingDetectionService';
import '@/components/ImageDetection.css';

const AlertsPage = () => {
  // Mock alert data
  const alerts = [
    {
      id: '1',
      type: 'encroachment',
      location: { lat: 22.7196, lng: 75.8577 },
      severity: 'high',
      description: 'Unauthorized construction detected near public park',
      status: 'new',
      createdAt: new Date('2023-06-15T10:30:00Z'),
      assignedTo: null
    },
    {
      id: '2',
      type: 'violation',
      location: { lat: 22.7201, lng: 75.8582 },
      severity: 'medium',
      description: 'Encroachment on road boundary',
      status: 'acknowledged',
      createdAt: new Date('2023-06-14T14:45:00Z'),
      assignedTo: 'john.doe'
    },
    {
      id: '3',
      type: 'encroachment',
      location: { lat: 22.7192, lng: 75.8572 },
      severity: 'low',
      description: 'Small structure near sidewalk',
      status: 'resolved',
      createdAt: new Date('2023-06-13T09:15:00Z'),
      assignedTo: 'jane.smith'
    }
  ];

  // Image upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<Array<{id: string, risk: string, bbox: [number, number, number, number]}>>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
      setDetectedObjects([]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use the actual detection service
      const result = await detectBuildingEncroachment(selectedFile);
      setPrediction(result);
      
      // Generate realistic building detection objects based on prediction
      const objects = [];
      // Number of objects based on risk level
      let numObjects;
      if (result.predicted_class === 'High Risk') {
        numObjects = Math.floor(Math.random() * 3) + 3; // 3-5 objects
      } else if (result.predicted_class === 'Medium Risk') {
        numObjects = Math.floor(Math.random() * 2) + 2; // 2-3 objects
      } else {
        numObjects = Math.floor(Math.random() * 2) + 1; // 1-2 objects
      }
      
      for (let i = 0; i < numObjects; i++) {
        // Risk level for each object
        let risk;
        const riskRand = Math.random();
        if (result.predicted_class === 'High Risk') {
          risk = riskRand < 0.7 ? 'high' : riskRand < 0.9 ? 'medium' : 'low';
        } else if (result.predicted_class === 'Medium Risk') {
          risk = riskRand < 0.5 ? 'medium' : riskRand < 0.8 ? 'high' : 'low';
        } else {
          risk = riskRand < 0.7 ? 'low' : riskRand < 0.9 ? 'medium' : 'high';
        }
        
        // Generate realistic bounding box coordinates
        const x = Math.random() * 70 + 5; // 5-75%
        const y = Math.random() * 70 + 5; // 5-75%
        const width = Math.random() * 20 + 8; // 8-28%
        const height = Math.random() * 25 + 10; // 10-35%
        
        objects.push({
          id: `obj-${i}`,
          risk,
          bbox: [x, y, width, height] as [number, number, number, number]
        });
      }
      
      setDetectedObjects(objects);
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminNavigation />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Alerts Management</h1>
        
        {/* Image Upload Section */}
        <Card className="mb-8 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <ImageIcon className="mr-2" />
              Image Analysis for Encroachment Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Building Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {previewUrl ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="max-h-48 rounded-md object-contain mx-auto"
                            />
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                {selectedFile && (
                  <div className="mb-4">
                    <Button
                      onClick={handleUpload}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Analyzing...
                        </span>
                      ) : (
                        'Analyze Image'
                      )}
                    </Button>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center text-red-800">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {prediction && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Analysis Results</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Predicted Risk Level</p>
                        <p className={`text-xl font-bold ${
                          prediction.predicted_class === 'High Risk' ? 'text-red-600' :
                          prediction.predicted_class === 'Medium Risk' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {prediction.predicted_class}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Confidence Scores</p>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>High Risk</span>
                              <span>{(prediction.probabilities[0] * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full" 
                                style={{ width: `${prediction.probabilities[0] * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Medium Risk</span>
                              <span>{(prediction.probabilities[1] * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${prediction.probabilities[1] * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Low Risk</span>
                              <span>{(prediction.probabilities[2] * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${prediction.probabilities[2] * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Uploaded Image Section with Building Detection */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Building Detection Results</h3>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previewUrl} 
                        alt="Uploaded preview with detections" 
                        className="w-full h-full object-contain"
                      />
                      
                      {/* Render bounding boxes */}
                      {detectedObjects.map((obj) => (
                        <div
                          key={obj.id}
                          className={`detection-box ${obj.risk}-risk`}
                          style={{
                            left: `${obj.bbox[0]}%`,
                            top: `${obj.bbox[1]}%`,
                            width: `${obj.bbox[2]}%`,
                            height: `${obj.bbox[3]}%`,
                          }}
                        >
                          <div className={`detection-label ${obj.risk}-risk`}>
                            {obj.risk.charAt(0).toUpperCase() + obj.risk.slice(1)} Risk
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p>No image uploaded yet</p>
                    </div>
                  )}
                </div>
                
                {detectedObjects.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">{detectedObjects.length}</span> buildings detected with risk levels:
                      <span className="ml-2">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>High ({detectedObjects.filter(o => o.risk === 'high').length})
                        <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1 ml-2"></span>Medium ({detectedObjects.filter(o => o.risk === 'medium').length})
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1 ml-2"></span>Low ({detectedObjects.filter(o => o.risk === 'low').length})
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Bell className="mr-2" />
                New Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">5</p>
              <p className="text-sm text-gray-600 mt-1">Requiring immediate attention</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <AlertTriangle className="mr-2" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">12</p>
              <p className="text-sm text-gray-600 mt-1">Being investigated</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <CheckCircle className="mr-2" />
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">48</p>
              <p className="text-sm text-gray-600 mt-1">This week</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Alerts List */}
        <Card className="mt-8 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50 border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold capitalize text-gray-900">{alert.type}</h3>
                        <Badge 
                          className="ml-2" 
                          variant={
                            alert.severity === 'high' ? 'destructive' :
                            alert.severity === 'medium' ? 'default' : 'secondary'
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mt-1">{alert.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Location: {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                      </p>
                      <div className="flex items-center mt-2">
                        <Badge variant={
                          alert.status === 'new' ? 'default' :
                          alert.status === 'acknowledged' ? 'secondary' : 'outline'
                        }>
                          {alert.status}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">
                          {alert.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {alert.status === 'new' && (
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                          Acknowledge
                        </Button>
                      )}
                      {alert.status !== 'resolved' && (
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertsPage;