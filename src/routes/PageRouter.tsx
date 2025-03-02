import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "../pages/home/HomePage";
import AdminPage from "../pages/customer/AdminPage";
import Dashboard from "../pages/customer/Dashboard";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";
import EventPage from "../pages/admin/EventPage";
export default function PageRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route element={<UserLayout />}>
            <Route path="/dashboard" index element={<Dashboard />}></Route>
            <Route path="/data" element={<AdminPage />}></Route>
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin/event" element={<EventPage />}></Route>
          </Route>
          {/* not found */}
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
