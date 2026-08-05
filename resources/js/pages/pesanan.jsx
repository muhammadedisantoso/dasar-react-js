import React from "react";
import { ShoppingCart } from "lucide-react";

export default function Pesanan() {
    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold text-slate-800 mb-1">pesanan</h1>
            <p className="text-sm text-slate-500 mb-6">daftar pesanan dari pengguna.</p>

            <div className="bg-white rounded-xl border border-slate-200 p-10 flex flex-col items-center justify-center text-center ">
                <ShoppingCart className="w-8 h-8 text-slate-300 mb-2"/>
                <p className="text-sm text-slate-400">Belum ada pesanan masuk</p>
            </div>
        </div>
    )
}