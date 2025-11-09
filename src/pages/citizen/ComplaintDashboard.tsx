import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PlusCircle } from "lucide-react";

// --- Type Definitions (Kept the same) ---
type Complainer = {
  name: string;
  age: number;
  phone: string;
  address: string;
};

type Address = {
  area: string;
  building: string;
  streetName: string;
  colonyName: string;
  landmark: string;
  wardNumber: string;
  pinCode: string;
  city: string;
  state: string;
};

type Complaint = {
  id: number;
  title: string;
  area: string;
  details: {
    address: Address;
    complainer: Complainer;
  };
};

// Simplified COLORS: Only need one for the single state
const COLORS = ["#f87171"];

// --- Utility Components ---

// Card to display a single complaint item
const ComplaintCard: React.FC<{
  complaint: Complaint;
  statusColor: string;
  onClick: () => void;
  buttonLabel: string;
}> = ({ complaint, statusColor, onClick, buttonLabel }) => (
  <div
    className={`p-4 border-l-4 ${statusColor} bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 cursor-pointer flex justify-between items-center`}
    onClick={onClick}
  >
    <div>
      <p className="font-bold text-gray-800 truncate">{complaint.title}</p>
      <p className="text-xs text-gray-500">{complaint.area}</p>
    </div>
    <button
      className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 text-sm rounded transition"
      onClick={onClick}
    >
      {buttonLabel}
    </button>
  </div>
);

// --- Main Dashboard Component ---

const ComplaintDashboard: React.FC = () => {
  // --- State Hooks: Simplified to only hold all initial complaints ---
  const [allComplaints] = useState<Complaint[]>([
    {
      id: 1,
      title: "Illegal Construction",
      area: "Sector 15",
      details: {
        address: {
          area: "Sector 15",
          building: "12-A",
          streetName: "Main Street",
          colonyName: "Green Park Colony",
          landmark: "Near City Mall",
          wardNumber: "22",
          pinCode: "452001",
          city: "Indore",
          state: "Madhya Pradesh",
        },
        complainer: {
          name: "Raj",
          age: 45,
          phone: "1234567890",
          address: "Boys Hostel,IET DAVV,Indore(M.P)",
        },
      },
    },
    {
      id: 2,
      title: "Unauthorized Shop Extension",
      area: "MG Road",
      details: {
        address: {
          area: "MG Road",
          building: "23-B",
          streetName: "Central Avenue",
          colonyName: "Rajwada Area",
          landmark: "Opp. Treasure Island Mall",
          wardNumber: "11",
          pinCode: "452001",
          city: "Indore",
          state: "Madhya Pradesh",
        },
        complainer: {
          name: "Sunita Sharma",
          age: 38,
          phone: "9876543210",
          address: "Flat 304, Shree Residency, Vijay Nagar, Indore",
        },
      },
    },
    {
      id: 3,
      title: "Illegal Parking Space",
      area: "Vijay Nagar",
      details: {
        address: {
          area: "Vijay Nagar",
          building: "B-45",
          streetName: "LIG Square Road",
          colonyName: "Saket Nagar",
          landmark: "Near Apollo Tower",
          wardNumber: "18",
          pinCode: "452010",
          city: "Indore",
          state: "Madhya Pradesh",
        },
        complainer: {
          name: "Ankit Verma",
          age: 30,
          phone: "7894561230",
          address: "D-12, MIG Colony, Indore",
        },
      },
    },
    {
      id: 4,
      title: "Blocked Drainage System",
      area: "Annapurna Nagar",
      details: {
        address: {
          area: "Annapurna Nagar",
          building: "67-C",
          streetName: "Temple Street",
          colonyName: "Rani Bagh",
          landmark: "Behind Annapurna Temple",
          wardNumber: "34",
          pinCode: "452009",
          city: "Indore",
          state: "Madhaya Pradesh",
        },
        complainer: {
          name: "Meera Joshi",
          age: 52,
          phone: "7412589630",
          address: "House No. 101, Rani Bagh, Indore",
        },
      },
    },
    {
      id: 5,
      title: "Garbage Dump on Road",
      area: "Bhavarkua",
      details: {
        address: {
          area: "Bhavarkua",
          building: "9-A",
          streetName: "University Road",
          colonyName: "Moti Tabela",
          landmark: "Near DAVV Main Gate",
          wardNumber: "27",
          pinCode: "452001",
          city: "Indore",
          state: "Madhya Pradesh",
        },
        complainer: {
          name: "Rahul Singh",
          age: 26,
          phone: "9517538426",
          address: "Room 15, Boys Hostel, IET DAVV, Indore",
        },
      },
    },
  ]);

  const [popupComplaint, setPopupComplaint] = useState<Complaint | null>(null);

  // --- Handlers: Simplified ---
  const handleViewDetails = (complaint: Complaint) => {
    setPopupComplaint(complaint);
  };

  // --- Chart Data: Simplified to show total ---
  const chartData = [
    { name: "Total Complaints", value: allComplaints.length },
  ];

  // --- Rendered Component ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center">
          Civic Issues Dashboard 🚨
        </h2>
        <p className="text-center text-gray-600 mt-1">
          A list of all reported issues awaiting action.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* === Left Column: Complaint Chart === */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-80 sticky top-10">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Total Overview</h3>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[0]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Right Column: All Complaints List --- */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-600 flex items-center">
                <PlusCircle className="w-5 h-5 mr-2" /> All Reported Complaints
              </h3>
              <span className="text-2xl font-extrabold text-red-500 bg-red-100 px-3 py-1 rounded-full">
                {allComplaints.length}
              </span>
            </div>
            <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
              {allComplaints.length === 0 ? (
                <p className="text-gray-500 italic">No complaints reported yet.</p>
              ) : (
                allComplaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    statusColor="border-red-500"
                    onClick={() => handleViewDetails(complaint)}
                    buttonLabel="View Details"
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* --- Complaint Detail Popup (Simplified) --- */}
      {popupComplaint && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all scale-100">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">
                Complaint #{popupComplaint.id}: {popupComplaint.title}
              </h3>
              <div className="space-y-4 text-sm md:text-base">
                {/* Address Details */}
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <h4 className="font-bold text-gray-700 flex items-center mb-2">
                    <span className="mr-2">📍</span> Full Address Details
                  </h4>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
                    {Object.entries(popupComplaint.details.address).map(([key, value]) => (
                      <li key={key} className="flex flex-col">
                        <strong className="capitalize text-xs text-gray-500">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </strong>
                        <span className="font-medium">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Complainer Info */}
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h4 className="font-bold text-indigo-700 flex items-center mb-2">
                    <span className="mr-2">👤</span> Complainer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
                    <p>
                      <strong className="capitalize text-xs text-gray-500">Name:</strong>{" "}
                      <span className="font-medium">{popupComplaint.details.complainer.name}</span>
                    </p>
                    <p>
                      <strong className="capitalize text-xs text-gray-500">Age:</strong>{" "}
                      <span className="font-medium">{popupComplaint.details.complainer.age}</span>
                    </p>
                    <p className="col-span-2">
                      <strong className="capitalize text-xs text-gray-500">Phone:</strong>{" "}
                      <span className="font-medium">{popupComplaint.details.complainer.phone}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6 border-t pt-4">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition shadow-md"
                  onClick={() => setPopupComplaint(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDashboard;