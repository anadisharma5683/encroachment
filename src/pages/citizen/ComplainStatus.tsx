import React, { useEffect } from "react";
import { useComplaintStore } from "@/store/complaintStore";

const ComplaintStatus = () => {
  const { complaints, fetchComplaints } = useComplaintStore((state) => ({
    complaints: state.complaints,
    fetchComplaints: state.fetchComplaints
  }));

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Complaint Status</h2>
      {complaints.length === 0 ? (
        <p className="text-center text-gray-500">No complaints submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {complaints.map((c, idx) => (
            <li key={c._id || idx} className="p-4 border rounded shadow-sm bg-gray-50">
              <p><strong>Name:</strong> {c.name}</p>
              <p><strong>Email:</strong> {c.email}</p>
              <p><strong>Complaint:</strong> {c.complaint}</p>
              <p><strong>Status:</strong> <span className={`font-semibold ${c.status === "Resolved" ? "text-green-600" : "text-yellow-600"}`}>{c.status}</span></p>
              {c.submittedAt && (
                <p><strong>Submitted:</strong> {new Date(c.submittedAt).toLocaleString()}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComplaintStatus;