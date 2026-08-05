import React from "react";
import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../routes/ProtectedRoute";
import Login from "../pages/login";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Produk from "../pages/Produk";
import ProdukDetail from "../pages/ProdukDetail";
import Pesanan from "../pages/pesanan";

export default function App() {
    return(
        <AuthProvider>
            <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />}/>
                <Route path="/login" element={<Login/>}/>
                 
                <Route 
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout/>
                    </ProtectedRoute>
                }
                >
                    <Route index element={<Dashboard/>}/>
                    <Route path="produk" element={<Produk/>}/>
                    <Route path="produk/:id" element={<ProdukDetail/>}/>
                   <Route path="pesanan" element={<Pesanan/>}/>
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />}/>
            </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}