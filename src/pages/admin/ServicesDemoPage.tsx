// src/pages/admin/ServicesDemoPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  MapPin, 
  Image as ImageIcon, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye
} from 'lucide-react';
import AdminNavigation from '@/components/AdminNavigation';
import { notificationService, Notification, Alert } from '@/services/notificationService';
import { geospatialService, GeoPoint, BoundingBox } from '@/services/geospatialService';
import { imageProcessingService, ProcessedImageData, ImageAnalysisResult } from '@/services/imageProcessingService';

const ServicesDemoPage = () => {
  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    recipients: ''
  });
  
  // Alert state
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertForm, setAlertForm] = useState({
    type: 'encroachment',
    lat: 22.7196,
    lng: 75.8577,
    severity: 'medium' as 'low' | 'medium' | 'high',
    description: ''
  });
  
  // Geospatial state
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([
    { lat: 22.7196, lng: 75.8577 },
    { lat: 22.7201, lng: 75.8582 },
    { lat: 22.7192, lng: 75.8572 }
  ]);
  const [boundingBox, setBoundingBox] = useState<BoundingBox>({
    north: 22.721,
    south: 22.719,
    east: 75.859,
    west: 75.856
  });
  const [distanceResult, setDistanceResult] = useState<number | null>(null);
  const [areaResult, setAreaResult] = useState<number | null>(null);
  
  // Image processing state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImageData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial data
  useEffect(() => {
    // Load notifications
    const userNotifications = notificationService.getUserNotifications('admin');
    setNotifications(userNotifications);
    
    // Load alerts
    const allAlerts = notificationService.getAllAlerts();
    setAlerts(allAlerts);
    
    // Calculate initial distance
    if (geoPoints.length >= 2) {
      const distance = geospatialService.calculateDistance(geoPoints[0], geoPoints[1]);
      setDistanceResult(distance);
    }
    
    // Calculate initial area
    if (geoPoints.length >= 3) {
      const area = geospatialService.calculatePolygonArea(geoPoints);
      setAreaResult(area);
    }
  }, [geoPoints]);

  // Handle notification form changes
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNotificationForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle notification form submission
  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const recipients = notificationForm.recipients ? notificationForm.recipients.split(',').map(r => r.trim()) : [];
    
    const id = notificationService.createNotification(
      notificationForm.title,
      notificationForm.message,
      notificationForm.priority,
      recipients
    );
    
    // Update notifications list
    const updatedNotifications = notificationService.getUserNotifications('admin');
    setNotifications(updatedNotifications);
    
    // Reset form
    setNotificationForm({
      title: '',
      message: '',
      priority: 'medium',
      recipients: ''
    });
  };

  // Handle alert form changes
  const handleAlertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAlertForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle alert severity change
  const handleSeverityChange = (value: 'low' | 'medium' | 'high') => {
    setAlertForm(prev => ({ ...prev, severity: value }));
  };

  // Handle alert type change
  const handleAlertTypeChange = (value: string) => {
    setAlertForm(prev => ({ ...prev, type: value }));
  };

  // Handle alert form submission
  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    
    const id = notificationService.createAlert(
      alertForm.type,
      { lat: parseFloat(alertForm.lat.toString()), lng: parseFloat(alertForm.lng.toString()) },
      alertForm.severity,
      alertForm.description
    );
    
    // Update alerts list
    const updatedAlerts = notificationService.getAllAlerts();
    setAlerts(updatedAlerts);
    
    // Reset form
    setAlertForm({
      type: 'encroachment',
      lat: 22.7196,
      lng: 75.8577,
      severity: 'medium',
      description: ''
    });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProcessedImage(null);
      setAnalysisResult(null);
    }
  };

  // Process selected image
  const handleProcessImage = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    try {
      const processed = await imageProcessingService.processImage(selectedFile);
      setProcessedImage(processed);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Analyze processed image
  const handleAnalyzeImage = async () => {
    if (!processedImage) return;
    
    setIsProcessing(true);
    try {
      const result = await imageProcessingService.analyzeImage(processedImage);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate distance between first two points
  const calculateDistance = () => {
    if (geoPoints.length >= 2) {
      const distance = geospatialService.calculateDistance(geoPoints[0], geoPoints[1]);
      setDistanceResult(distance);
    }
  };

  // Calculate area of polygon
  const calculateArea = () => {
    if (geoPoints.length >= 3) {
      const area = geospatialService.calculatePolygonArea(geoPoints);
      setAreaResult(area);
    }
  };

  // Add a new point
  const addPoint = () => {
    setGeoPoints(prev => [...prev, { lat: 22.72, lng: 75.858 }]);
  };

  // Update a point
  const updatePoint = (index: number, field: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    setGeoPoints(prev => {
      const newPoints = [...prev];
      newPoints[index] = { ...newPoints[index], [field]: numValue };
      return newPoints;
    });
  };

  // Remove a point
  const removePoint = (index: number) => {
    if (geoPoints.length <= 3) return; // Keep at least 3 points
    setGeoPoints(prev => prev.filter((_, i) => i !== index));
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    notificationService.markNotificationRead(id);
    const updatedNotifications = notificationService.getUserNotifications('admin');
    setNotifications(updatedNotifications);
  };

  // Acknowledge an alert
  const acknowledgeAlert = (id: string) => {
    notificationService.acknowledgeAlert(id);
    const updatedAlerts = notificationService.getAllAlerts();
    setAlerts(updatedAlerts);
  };

  // Resolve an alert
  const resolveAlert = (id: string) => {
    notificationService.resolveAlert(id);
    const updatedAlerts = notificationService.getAllAlerts();
    setAlerts(updatedAlerts);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminNavigation />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Services Demo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notification Service */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Bell className="mr-2" />
                Notification Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateNotification} className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="title" className="text-gray-700">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={notificationForm.title}
                    onChange={handleNotificationChange}
                    required
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-gray-700">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={notificationForm.message}
                    onChange={handleNotificationChange}
                    required
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="priority" className="text-gray-700">Priority</Label>
                  <Select
                    value={notificationForm.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => setNotificationForm(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="recipients" className="text-gray-700">Recipients (comma separated)</Label>
                  <Input
                    id="recipients"
                    name="recipients"
                    value={notificationForm.recipients}
                    onChange={handleNotificationChange}
                    placeholder="user1,user2,user3"
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Create Notification</Button>
              </form>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Recent Notifications</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg border ${
                        notification.read ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2">
                            <Badge variant={
                              notification.priority === 'high' ? 'destructive' :
                              notification.priority === 'medium' ? 'default' : 'secondary'
                            }>
                              {notification.priority}
                            </Badge>
                            <span className="text-xs text-gray-500 ml-2">
                              {notification.createdAt.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {!notification.read && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => markAsRead(notification.id)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Alert Service */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <AlertTriangle className="mr-2" />
                Alert Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAlert} className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="type" className="text-gray-700">Alert Type</Label>
                  <Select
                    value={alertForm.type}
                    onValueChange={handleAlertTypeChange}
                  >
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="encroachment">Encroachment</SelectItem>
                      <SelectItem value="violation">Violation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lat" className="text-gray-700">Latitude</Label>
                    <Input
                      id="lat"
                      name="lat"
                      type="number"
                      step="0.0001"
                      value={alertForm.lat}
                      onChange={handleAlertChange}
                      required
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lng" className="text-gray-700">Longitude</Label>
                    <Input
                      id="lng"
                      name="lng"
                      type="number"
                      step="0.0001"
                      value={alertForm.lng}
                      onChange={handleAlertChange}
                      required
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="severity" className="text-gray-700">Severity</Label>
                  <Select
                    value={alertForm.severity}
                    onValueChange={handleSeverityChange}
                  >
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-gray-700">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={alertForm.description}
                    onChange={handleAlertChange}
                    required
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Create Alert</Button>
              </form>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Active Alerts</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {alerts.filter(a => a.status !== 'resolved').map(alert => (
                    <div key={alert.id} className="p-3 rounded-lg border bg-white border-gray-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium capitalize text-gray-900">{alert.type}</h4>
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
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
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
                              {alert.createdAt.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {alert.status === 'new' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                              Acknowledge
                            </Button>
                          )}
                          {alert.status !== 'resolved' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => resolveAlert(alert.id)}
                              className="border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Geospatial Service */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <MapPin className="mr-2" />
                Geospatial Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Points</h3>
                  <div className="space-y-2">
                    {geoPoints.map((point, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            step="0.0001"
                            value={point.lat}
                            onChange={(e) => updatePoint(index, 'lat', e.target.value)}
                            placeholder="Latitude"
                            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <Input
                            type="number"
                            step="0.0001"
                            value={point.lng}
                            onChange={(e) => updatePoint(index, 'lng', e.target.value)}
                            placeholder="Longitude"
                            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {geoPoints.length > 3 && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => removePoint(index)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-100" 
                    onClick={addPoint}
                  >
                    Add Point
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={calculateDistance} className="bg-blue-500 hover:bg-blue-600">
                    Calculate Distance
                  </Button>
                  <Button onClick={calculateArea} className="bg-blue-500 hover:bg-blue-600">
                    Calculate Area
                  </Button>
                </div>
                
                {distanceResult !== null && (
                  <div className="p-3 bg-blue-5 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      Distance between first two points: {distanceResult.toFixed(2)} meters
                    </p>
                  </div>
                )}
                
                {areaResult !== null && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      Area of polygon: {areaResult.toFixed(2)} square meters
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Bounding Box</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-gray-700">North</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={boundingBox.north}
                        onChange={(e) => setBoundingBox(prev => ({ ...prev, north: parseFloat(e.target.value) || 0 }))}
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">South</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={boundingBox.south}
                        onChange={(e) => setBoundingBox(prev => ({ ...prev, south: parseFloat(e.target.value) || 0 }))}
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">East</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={boundingBox.east}
                        onChange={(e) => setBoundingBox(prev => ({ ...prev, east: parseFloat(e.target.value) || 0 }))}
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">West</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={boundingBox.west}
                        onChange={(e) => setBoundingBox(prev => ({ ...prev, west: parseFloat(e.target.value) || 0 }))}
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Image Processing Service */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <ImageIcon className="mr-2" />
                Image Processing Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="image-upload" className="text-gray-700">Upload Image</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {selectedFile && (
                  <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleProcessImage} 
                    disabled={!selectedFile || isProcessing}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isProcessing ? 'Processing...' : 'Process Image'}
                  </Button>
                  
                  {processedImage && (
                    <Button 
                      onClick={handleAnalyzeImage} 
                      disabled={isProcessing}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {isProcessing ? 'Analyzing...' : 'Analyze Image'}
                    </Button>
                  )}
                </div>
                
                {processedImage && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-5 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        Processed: {processedImage.width}x{processedImage.height} pixels
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-2 border-gray-300">
                      <img 
                        src={processedImage.dataUrl} 
                        alt="Processed" 
                        className="max-w-full h-auto"
                      />
                    </div>
                  </div>
                )}
                
                {analysisResult && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Analysis Results</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-green-700">
                        <span className="font-medium">Predicted Class:</span> {analysisResult.predictedClass}
                      </p>
                      <p className="text-sm text-green-700">
                        <span className="font-medium">Confidence Scores:</span>
                      </p>
                      <div className="space-y-1">
                        {analysisResult.probabilities.map((prob: number, index: number) => (
                          <div key={index} className="flex items-center">
                            <span className="text-xs w-20 text-green-700">Class {index}:</span>
                            <div className="flex-1 ml-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${prob * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-xs ml-2 text-green-700">{(prob * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServicesDemoPage;