import { useState } from "react";
import Navbar from "./components/navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import AdminRoute from "./components/admin/AdminRoute";

function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-2 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
