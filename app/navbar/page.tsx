"use client";

import { useState } from "react";
import { ChevronDown, Plus, LayoutDashboard, Bell, FileText } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const testMenus = ["test 1", "test 2", "test 3", "test 4"];

  return (
    <nav className="w-full bg-white border-b border-gray-ื100 p-4 py-4 items-center sticky top-0 z-[100]">
      {/* ฝั่งซ้าย: Logo และ Dropdown */}
      <div className="flex items-center justify-around  gap-6">
        <h1 className="text-xl font-black text-blue-600 tracking-tighter">PACTA</h1>
        
        
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex-col items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl transition-all text-sm font-bold text-gray-700"
          >
            Menu Test
            <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-[110]">
              {testMenus.map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link href="/create">
        <button className="flex items-center  text-blue-600 rounded-[1.2rem] shadow-blue-200 transition-all active:scale-95 text-sm font-bold">
            <Plus size={18} />
            Create
        </button>
        </Link>
      </div>
    </nav>
  );
}