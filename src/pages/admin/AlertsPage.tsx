// src/pages/admin/AlertsPage.tsx
import React from 'react';
import AdminNavigation from '@/components/AdminNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminNavigation />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Alerts Management</h1>
        
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