// store/complaintStore.ts
import { create } from "zustand";

export interface Complaint {
  name: string;
  email: string;
  complaint: string;
  status: "Pending" | "Resolved";
  submittedAt?: string;
  _id?: string;
}

interface ComplaintStore {
  complaints: Complaint[];
  addComplaint: (complaint: Complaint) => Promise<void>;
  updateComplaintStatus: (index: number, status: "Pending" | "Resolved") => void;
  fetchComplaints: () => Promise<void>;
}

export const useComplaintStore = create<ComplaintStore>((set, get) => ({
  complaints: [],
  addComplaint: async (complaint) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaint),
      });

      const data = await response.json();

      if (data.success) {
        // Fetch updated complaints list
        get().fetchComplaints();
      } else {
        console.error("Failed to submit complaint:", data.message);
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  },
  updateComplaintStatus: (index, status) => {
    set((state) => {
      const updated = [...state.complaints];
      updated[index].status = status;
      return { complaints: updated };
    });
  },
  fetchComplaints: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/complaints`);
      const data = await response.json();

      if (data.success) {
        set({ complaints: data.complaints });
      } else {
        console.error("Failed to fetch complaints:", data.message);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  },
}));

export default useComplaintStore;