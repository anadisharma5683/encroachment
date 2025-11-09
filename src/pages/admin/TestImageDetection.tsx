// Test page for image detection functionality
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import '@/components/ImageDetection.css';

const TestImageDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<Array<{id: string, risk: string, bbox: [number, number, number, number]}>>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectedObjects([]);
    }
  };

  const handleDetect = () => {
    // Generate mock detected objects
    const objects = [];
    const numObjects = Math.floor(Math.random() * 5) + 1; // 1-5 objects
    
    for (let i = 0; i < numObjects; i++) {
      const riskLevels = ['high', 'medium', 'low'];
      const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      
      // Generate random bounding box coordinates
      const x = Math.random() * 60 + 10; // 10-70%
      const y = Math.random() * 60 + 10; // 10-70%
      const width = Math.random() * 20 + 5; // 5-25%
      const height = Math.random() * 20 + 5; // 5-25%
      
      objects.push({
        id: `obj-${i}`,
        risk,
        bbox: [x, y, width, height] as [number, number, number, number]
      });
    }
    
    setDetectedObjects(objects);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Test Image Detection</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Image Upload and Detection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Test Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {previewUrl ? (
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-h-48 rounded-md object-contain"
                          />
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
                  <Button onClick={handleDetect} className="w-full">
                    Detect Objects
                  </Button>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Detection Results</h3>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previewUrl} 
                        alt="Preview with detections" 
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
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>Upload an image to see detection results</p>
                    </div>
                  )}
                </div>
                
                {detectedObjects.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      Detected <span className="font-semibold">{detectedObjects.length}</span> objects:
                      <span className="ml-2">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                        High ({detectedObjects.filter(o => o.risk === 'high').length})
                        <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1 ml-2"></span>
                        Medium ({detectedObjects.filter(o => o.risk === 'medium').length})
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1 ml-2"></span>
                        Low ({detectedObjects.filter(o => o.risk === 'low').length})
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestImageDetection;