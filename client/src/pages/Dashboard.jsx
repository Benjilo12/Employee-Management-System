import { useEffect, useState } from "react";
import {
  dummyEmployeeDashboardData,
  dummyAdminDashboardData,
} from "../assets/assets";
import Loading from "../components/Loading";
import EmpolyeeDashboard from "../components/EmpolyeeDashboard";
import AdminDashboard from "../components/AdminDashboard";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(dummyAdminDashboardData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <p className="text-center text-slate-500 py-12 dark:text-stone-100">
        No data available
      </p>
    );
  }

  if (data.role === "ADMIN") {
    return <AdminDashboard data={data} />;
  } else {
    return <EmpolyeeDashboard data={data} />;
  }
};

export default Dashboard;
