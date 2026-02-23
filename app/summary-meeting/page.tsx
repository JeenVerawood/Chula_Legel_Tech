"use client";

import { ChevronLeft, User, Share2 } from "lucide-react";
import Link from "next/link";

export default function SummaryMeeting() {
  const meetingItems = [
    {
      title: "พิจารณารับรองรายงานการประชุมผู้ถือหุ้นครั้งก่อน พิจารณารับรองรายงานการประชุมผู้ถือหุ้",
      company: "ABC จำกัด",
      type: "การประชุมสามัญประจำปี",
      no: "1/2569",
      date: "24 มกราคม 2569",
      time: "14:00 น. - 16:00 น.",
      location: "ห้องประชุม 2",
      tags: ["bg-red-400", "bg-yellow-400"]
    },
    {
      title: "พิจารณาเลือกตั้งกรรมการแทนกรรมการที่ครบวาระ",
      company: "ABC จำกัด",
      type: "การประชุมสามัญประจำปี",
      no: "1/2569",
      date: "24 กุมภาพันธ์ 2569",
      time: "12:00 น. - 13:00 น.",
      location: "ห้องประชุม 5 และสื่ออิเล็กทรอนิกส์",
      tags: ["bg-yellow-400", "bg-green-400"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-4 font-sans text-gray-800 pb-20">
      <div className="w-full max-w-md">
        <header className="flex items-center justify-between gap-4 py-4 mb-4">
          <Link href="/" className="flex items-center transition-colors">
            <ChevronLeft size={24} className="text-gray-800" />
            <h1 className="text-xl font-bold ml-1 text-gray-800">สรุปการประชุมทั้งหมด</h1>
          </Link>
          <button className="
            group flex items-center gap-2 px-4 py-2 
            bg-white hover:bg-slate-900 
            text-slate-500 hover:text-white 
            rounded-2xl border border-slate-200 
            shadow-sm hover:shadow-md 
            active:scale-95 transition-all duration-300
            ">
            <Share2 
                size={16} 
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" 
            />
            <span className="text-xs font-bold tracking-wide">Share</span>
            </button>
        </header>

        <div className="flex flex-col gap-8">
          {meetingItems.map((item, index) => (
            <div key={index} className="relative pt-3">
              {/* แถบสีด้านบน (Tags) */}
              <div className="absolute top-0 left-8 flex gap-1 z-0">
                {item.tags.map((color, i) => (
                  <div key={i} className={`w-14 h-6 ${color} rounded-t-xl shadow-sm`} />
                ))}
              </div>

              {/* ตัวการ์ดขาว */}
              <div className="relative bg-white rounded-[2.5rem] p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)] z-10 border border-gray-50">
                
                {/* ส่วนหัวการ์ด: ไอคอน + ข้อความพาดหัว */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                    <User className="text-gray-300" size={26} />
                  </div>
                  
                  {/* กรอบข้อความสีเทา: ใช้ flex-grow และ min-w-0 เพื่อกันหลุดกรอบ */}
                  <div className="w-72 h-12 items-center flex justify-center min-w-0 ">
                    <h3 className="font-bold  text-[14px] leading-snug text-gray-800 ">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* ส่วนรายละเอียด: ดันไปทางขวาให้ตรงกับพาดหัว */}
                <div className="flex">

                  <div className="flex-grow">
                    <div className="grid grid-cols-[75px_1fr] gap-y-1.5 text-[13px]">
                      <span className="text-gray-400 text-right pr-4">บริษัท:</span>
                      <span className="font-bold text-gray-700">{item.company}</span>
                      
                      <span className="text-gray-400 text-right pr-4">ประเภท:</span>
                      <span className="font-bold text-gray-700">{item.type}</span>
                      
                      <span className="text-gray-400 text-right pr-4">ครั้งที่:</span>
                      <span className="font-bold text-gray-700">{item.no}</span>
                      
                      <span className="text-gray-400 text-right pr-4">วันที่:</span>
                      <span className="font-bold text-gray-700">{item.date}</span>
                      
                      <span className="text-gray-400 text-right pr-4">เวลา:</span>
                      <span className="font-bold text-gray-700">{item.time}</span>
                      
                      <span className="text-gray-400 text-right pr-4">สถานที่:</span>
                      <span className="font-bold text-gray-700 leading-tight">{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}