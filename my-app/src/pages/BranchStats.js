import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";

const BranchStats = () => {
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper to assign different colors to bars
  const getColor = (index) => {
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff8042",
      "#a4de6c",
      "#d0ed57",
    ];
    return colors[index % colors.length];
  };

  const getBranchKeys = (data) => {
    const keys = new Set();
    data.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key !== "year") keys.add(key);
      });
    });
    return Array.from(keys);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/alumni/branch-stats")
      .then((res) => {
        const transformed = {};

        res.data.forEach(({ _id, count }) => {
          const year = _id.batch || "Unknown";
          const branch = _id.branch || "Unknown";

          if (!transformed[year]) transformed[year] = { year };
          transformed[year][branch] = count;
        });

        setBranchData(Object.values(transformed));
      })
      .catch((err) => {
        console.error("Error fetching alumni stats:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <AdminHeader />
      <div style={{ padding: "2rem" }}>
        <h2>📊 Alumni Distribution by Branch & Year</h2>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Back to Dashboard
        </button>

        {loading ? (
          <p>Loading graph...</p>
        ) : branchData.length === 0 ? (
          <p>No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={branchData}
              margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />

              {getBranchKeys(branchData).map((branch, index) => (
                <Bar key={branch} dataKey={branch} fill={getColor(index)} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <AdminFooter />
    </>
  );
};

export default BranchStats;
