"use client";

import { ChevronLeft, ChevronRight } from "lucide-react"; // เพิ่ม ChevronRight สำหรับปุ่มถัดไป
import Link from "next/link";
import { useState } from "react";
import Navbar from '../navbar/page';

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // ฟังก์ชันสำหรับเปลี่ยนเดือน
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // แสดงชื่อเดือนเป็นภาษาไทยเพื่อให้เข้ากับบริบท (หรือใช้ en-US ตามเดิมได้ครับ)
  const monthName = new Intl.DateTimeFormat("th-TH", { month: "long" }).format(currentDate);
  const yearThai = year + 543; // แปลงเป็น พ.ศ.

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 font-sans">
      <Navbar />
      <div className="w-full max-w-md bg-white">
        <header className="flex items-center justify-center gap-4 py-4 mb-4">
          <h1 className="text-xl font-bold text-gray-800 ml-1">ภาพรวมข้อมูล</h1>
        </header>

        {/* Calendar Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 mb-8 border border-gray-50">
          
          {/* Calendar Header สำหรับเปลี่ยนเดือน */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-lg font-bold text-gray-700 tracking-tight">
              {monthName} {yearThai}
            </h2>

            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 text-center text-[10px] font-black text-gray-300 mb-4 tracking-widest">
            <div>อา.</div><div>จ.</div><div>อ.</div><div>พ.</div><div>พฤ.</div><div>ศ.</div><div>ส.</div>
          </div>  
          
          <div className="grid grid-cols-7 text-center gap-y-3 text-gray-600 font-semibold">
            {emptySlots.map((slot) => <div key={`empty-${slot}`} />)}
            {daysArray.map((day) => (
              <div key={day} className="relative py-1 flex flex-col items-center">
                <div className={`
                  w-8 h-8 flex items-center justify-center rounded-xl text-[13px] transition-all
                  ${isToday(day) 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'hover:bg-gray-50 text-gray-700'}
                `}>
                  {day}
                </div>

                {/* จุดแจ้งเตือน (ตัวอย่างเงื่อนไข) */}
                <div className="absolute -bottom-1 flex justify-center w-full">
                  <div className="flex gap-0.5">
                    {/* แสดงจุดเฉพาะเดือนกุมภาพันธ์ 2569 ตามตัวอย่างเดิม */}
                    {month === 1 && year === 2026 && (day === 16 || day === 24) && (
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-sm"></div>
                    )}
                    {month === 1 && year === 2026 && day === 21 && (
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-sm"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* รายการการประชุม (ล้อตาม UI เดิมของคุณ) */}
        <div className="bg-slate-50 rounded-3xl p-6 mb-6 border border-slate-100">
          <h3 className="text-gray-800 font-bold mb-5 text-[15px]">การประชุมครั้งต่อไป</h3>
          {/* ... ส่วนรายการคงเดิม ... */}
        </div>
      </div>
    </div>
  );
}