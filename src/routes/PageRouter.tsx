import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "../pages/customer/HomePage";
import RootLayout from "../layout/RootLayout";
import AdminPage from "../pages/admin/AdminPage";
import Dashboard from "../pages/admin/Dashboard";
import NotFound from "../pages/NotFound";
export default function PageRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route element={<RootLayout />}>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/data" element={<AdminPage />}></Route>
          </Route>
          {/* not found */}
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
