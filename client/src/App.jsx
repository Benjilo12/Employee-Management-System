import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Employees from "./pages/Employees";
import Leave from "./pages/Leave";
import PaySlips from "./pages/PaySlips";
import PrintPayslip from "./pages/PrintPayslip";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import LoginForm from "./components/LoginForm";
function App() {
  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/login/admin"
          element={
            <LoginForm
              role="admin"
              title="Admin Portal"
              subtitle="Access your admin dashboard to manage the organization."
            />
          }
        />
        <Route
          path="/login/employee"
          element={
            <LoginForm
              role="employee"
              title="Employee Portal"
              subtitle="Access your employee dashboard to view your information and manage your leave."
            />
          }
        />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/payslips" element={<PaySlips />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/print/payslip/:id" element={<PrintPayslip />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
