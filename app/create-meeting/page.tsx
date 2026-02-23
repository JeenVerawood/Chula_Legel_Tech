"use client";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronDown, 
  AlertCircle, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Plus, 
  Trash2,
  RotateCcw,
  PenTool
} from "lucide-react";
import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function CreateMeetingPage() {
  // --- Data Options ---
  const options1 = ["บจก. (บริษัท จำกัด)", "บมจ. (บริษัท มหาชน จำกัด)"];
  const options2 = ["ประชุมสามัญผู้ถือหุ้น", "ประชุมวิสามัญผู้ถือหุ้น", "ประชุมคณะกรรมการ"];
  const options3 = ["สามัญ", "วิสามัญ"];
 
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const [callerName, setCallerName] = useState("");
  const [subject, setSubject] = useState("");
  const [meetingNo, setMeetingNo] = useState("");
  const [meetingSubType, setMeetingSubType] = useState("");
  const [attendees, setAttendees] = useState("");
  const [location, setLocation] = useState("");
  const [meetingDate, setMeetingDate] = useState(""); 
  const [meetingDateSent, setMeetingDateSent] = useState(""); 
  const [agendas, setAgendas] = useState([""]); 
  const [signerName, setSignerName] = useState(""); 
  const [signerPosition, setSignerPosition] = useState(""); 

  // --- UI Control States ---
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCalendarSent, setShowCalendarSent] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  // --- ✍️ Signature State & Ref ---
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  // --- Helper Functions ---
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const selectDate = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setMeetingDate(selected.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }));
    setShowCalendar(false);
    setErrors(prev => ({ ...prev, date: false }));
  };

  const selectDateSent = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setMeetingDateSent(selected.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }));
    setShowCalendarSent(false);
    setErrors(prev => ({ ...prev, dateSent: false }));
  };

  const addAgenda = () => setAgendas([...agendas, ""]);
  const updateAgenda = (index: number, value: string) => {
    const newAgendas = [...agendas];
    newAgendas[index] = value;
    setAgendas(newAgendas);
    if (value.trim()) setErrors(prev => ({ ...prev, agendas: false }));
  };
  const removeAgenda = (index: number) => {
    if (agendas.length > 1) setAgendas(agendas.filter((_, i) => i !== index));
  };

  // ล้างลายเซ็น
  const clearSignature = () => {
    sigCanvas.current?.clear();
    setIsSigned(false);
    setErrors(prev => ({ ...prev, signature: false }));
  };

  // --- 🔒 Validation Logic: รวมการเช็คลายเซ็น ---
  const handleSave = () => {
    const isSigEmpty = sigCanvas.current ? sigCanvas.current.isEmpty() : true;

    const newErrors: { [key: string]: boolean } = {
      companyType: !selected1,
      meetingType: !selected2,
      caller: !callerName.trim(),
      subject: !subject.trim(),
      meetingNo: !meetingNo.trim(),
      meetingSubType: !meetingSubType,
      attendees: !attendees.trim(),
      location: !location.trim(),
      date: !meetingDate,
      dateSent: !meetingDateSent,
      signer: !signerName.trim(),
      position: !signerPosition.trim(),
      agendas: agendas.some(a => !a.trim()),
      signature: isSigEmpty // บังคับให้เซ็น
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(isError => isError);

    if (hasError) {
      alert("กรุณากรอกข้อมูลและลงลายมือชื่อให้ครบถ้วน");
      return;
    }

    alert("✅ ข้อมูลครบถ้วน ระบบกำลังบันทึกและสร้างเอกสาร...");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 font-sans text-gray-800 pb-20">
      <div className="w-full max-w-md bg-white">
        <header className="flex items-center justify-between gap-4 py-4 mb-4">
          <Link href="/" className="p-1 hover:bg-gray-100 flex items-center rounded-full transition-colors">
            <ChevronLeft size={24} />
            <h1 className="text-xl font-bold ml-1">สร้างหนังสือเชิญประชุม</h1>
          </Link>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 py-6 flex flex-col gap-5 border border-gray-50">
          
          {/* 1. ประเภทบริษัท */}
          <div className="w-full relative">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">เลือกประเภทบริษัท</label>
                {errors.companyType && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <button onClick={() => {setIsOpen1(!isOpen1); setIsOpen2(false); setIsOpen3(false); setShowCalendar(false); setShowCalendarSent(false);}}
              className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-2xl transition-all ${errors.companyType ? "border-red-400 bg-red-50" : "border-gray-100"}`}>
              <span className={`text-[13px] ${selected1 ? "text-gray-700" : "text-gray-300"}`}>{selected1 || "คลิกเลือกประเภทบริษัท..."}</span>
              <ChevronDown className="text-gray-400" size={20} />
            </button>
            {isOpen1 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border z-[70] p-2">
                {options1.map(opt => (
                  <button key={opt} onClick={() => {setSelected1(opt); setIsOpen1(false); setErrors({...errors, companyType: false});}}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm hover:bg-gray-50">{opt}</button>
                ))}
              </div>
            )}
          </div>

          {/* 2. ประเภทการประชุม */}
          <div className="w-full relative">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">ประเภทการประชุม</label>
                {errors.meetingType && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <button onClick={() => {setIsOpen2(!isOpen2); setIsOpen1(false); setIsOpen3(false); setShowCalendar(false); setShowCalendarSent(false);}}
              className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-2xl transition-all ${errors.meetingType ? "border-red-400 bg-red-50" : "border-gray-100"}`}>
              <span className={`text-[13px] ${selected2 ? "text-gray-700" : "text-gray-300"}`}>{selected2 || "คลิกเลือกประเภท..."}</span>
              <ChevronDown className="text-gray-400" size={20} />
            </button>
            {isOpen2 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border z-[60] p-2">
                {options2.map(opt => (
                  <button key={opt} onClick={() => {setSelected2(opt); setIsOpen2(false); setErrors({...errors, meetingType: false});}}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm hover:bg-gray-50">{opt}</button>
                ))}
              </div>
            )}
          </div>

          {/* 3. ผู้เรียกประชุม */}
          <div className="w-full">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">ผู้เรียกประชุม</label>
                {errors.caller && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <input type="text" value={callerName} placeholder="ชื่อบริษัท หรือ ชื่อผู้เรียก..." 
              onChange={(e) => {setCallerName(e.target.value); setErrors({...errors, caller: false});}}
              className={`w-full px-5 py-3 border-2 rounded-2xl text-[13px] outline-none transition-all ${errors.caller ? "border-red-400 bg-red-50" : "border-gray-100 focus:border-blue-500"}`} />
          </div>

          {/* 4. เรื่อง */}
          <div className="w-full">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">เรื่อง</label>
                {errors.subject && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <input type="text" value={subject} placeholder="หนังสือนัดประชุม..." 
              onChange={(e) => {setSubject(e.target.value); setErrors({...errors, subject: false});}}
              className={`w-full px-5 py-3 border-2 rounded-2xl text-[13px] outline-none transition-all ${errors.subject ? "border-red-400 bg-red-50" : "border-gray-100 focus:border-blue-500"}`} />
          </div>

          {/* 5. เรียน */}
          <div className="w-full">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">เรียน</label>
                {errors.attendees && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <input type="text" value={attendees} placeholder="ผู้ถือหุ้น..." 
              onChange={(e) => {setAttendees(e.target.value); setErrors({...errors, attendees: false});}}
              className={`w-full px-5 py-3 border-2 rounded-2xl text-[13px] outline-none transition-all ${errors.attendees ? "border-red-400 bg-red-50" : "border-gray-100 focus:border-blue-500"}`} />
          </div>

          {/* 6. ครั้งที่ */}
          <div className="w-full">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">ครั้งที่</label>
                {(errors.meetingNo || errors.meetingSubType) && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <div className="flex gap-2">
              <input type="text" value={meetingNo} placeholder="1/2569" 
                onChange={(e) => {setMeetingNo(e.target.value); setErrors({...errors, meetingNo: false});}}
                className={`w-1/3 px-4 py-3 border-2 rounded-2xl text-[13px] text-center outline-none ${errors.meetingNo ? "border-red-400 bg-red-50" : "border-gray-100"}`} />
              <div className="relative flex-1">
                <button onClick={() => {setIsOpen3(!isOpen3); setIsOpen1(false); setIsOpen2(false);}}
                  className={`w-full h-full flex items-center justify-between px-4 py-3 border-2 rounded-2xl text-[13px] ${errors.meetingSubType ? "border-red-400 bg-red-50" : "border-gray-100"}`}>
                  <span className={meetingSubType ? "text-gray-700" : "text-gray-300"}>{meetingSubType || "เลือกประเภท..."}</span>
                  <ChevronDown size={18} className="text-gray-400"/>
                </button>
                {isOpen3 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border z-[50] p-2">
                    {options3.map(opt => (
                      <button key={opt} onClick={() => {setMeetingSubType(opt); setIsOpen3(false); setErrors({...errors, meetingSubType: false});}}
                        className="w-full text-left p-3 text-sm hover:bg-gray-50 rounded-xl">{opt}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 7. วันที่ประชุม */}
          <div className="w-full relative">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">วันที่ประชุม</label>
                {errors.date && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <button type="button" onClick={() => {setShowCalendar(!showCalendar); setShowCalendarSent(false); setIsOpen1(false); setIsOpen2(false); setIsOpen3(false);}}
              className={`w-full flex items-center justify-between px-5 py-3 border-2 rounded-2xl text-[13px] bg-white ${errors.date ? "border-red-400 bg-red-50" : "border-gray-100"}`}>
              <span className={meetingDate ? "text-gray-700" : "text-gray-300"}>{meetingDate || "กดเพื่อเลือกวันที่..."}</span>
              <CalendarIcon size={18} className="text-gray-400" />
            </button>
            {showCalendar && (
              <div className="absolute left-0 right-0 mt-3 p-4 bg-white rounded-[2rem] shadow-2xl border z-[100]">
                <div className="flex justify-between items-center mb-4">
                  <button onClick={() => changeMonth(-1)}><ChevronLeft size={18}/></button>
                  <span className="font-bold text-sm">{currentMonth.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => changeMonth(1)}><ChevronRight size={18}/></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(d => <span key={d} className="text-[10px] font-bold text-gray-400 py-1">{d}</span>)}
                  {Array.from({ length: firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => <div key={i} />)}
                  {Array.from({ length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => (
                    <button key={i} onClick={() => selectDate(i + 1)} className="aspect-square text-[12px] flex items-center justify-center rounded-xl hover:bg-blue-50">{i + 1}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 8. สถานที่ */}
          <div className="w-full">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">สถานที่</label>
                {errors.location && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <input type="text" value={location} placeholder="ระบุสถานที่ประชุม..." 
              onChange={(e) => {setLocation(e.target.value); setErrors({...errors, location: false});}}
              className={`w-full px-5 py-3 border-2 rounded-2xl text-[13px] outline-none transition-all ${errors.location ? "border-red-400 bg-red-50" : "border-gray-100 focus:border-blue-500"}`} />
          </div>

          {/* 9. วาระการประชุม */}
          <div className="w-full">
            <div className="flex justify-between mb-2 px-2">
              <label className="font-bold text-[15px]">วาระการประชุม</label>
              {errors.agendas && <p className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> กรุณากรอกวาระ</p>}
            </div>
            <div className="flex flex-col gap-3">
              {agendas.map((agenda, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">{index + 1}.</span>
                    <input type="text" value={agenda} placeholder={`วาระที่ ${index + 1}...`} 
                      onChange={(e) => updateAgenda(index, e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-2xl text-[13px] outline-none bg-gray-50/30 ${errors.agendas && !agenda.trim() ? "border-red-400 bg-red-50" : "border-gray-100"}`} />
                  </div>
                  {agendas.length > 1 && (
                    <button onClick={() => removeAgenda(index)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addAgenda}
                className="mt-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all group"
              >
                <div className="p-1 bg-gray-100 group-hover:bg-blue-100 rounded-full">
                  <Plus size={16} />
                </div>
                <span className="text-[13px] font-medium">เพิ่มวาระการประชุม</span>
              </button>
            </div>
          </div>

          <hr className="border-gray-50 my-2" />

          {/* 11. ลงชื่อ (ตัวพิมพ์) */}
          <div className="w-full">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">ลงชื่อ</label>
                {errors.signer && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <input type="text" value={signerName} placeholder="ชื่อ-นามสกุล ของผู้ลงนาม..." 
              onChange={(e) => {setSignerName(e.target.value); setErrors({...errors, signer: false});}}
              className={`w-full px-5 py-3 border-2 rounded-2xl text-[13px] outline-none transition-all ${errors.signer ? "border-red-400 bg-red-50" : "border-gray-100 focus:border-blue-500"}`} />
          </div>
          
          {/* 12. ตำแหน่ง */}
          <div className="w-full">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">ตำแหน่ง</label>
                {errors.position && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <input type="text" value={signerPosition} placeholder="เช่น กรรมการผู้มีอำนาจลงนาม..." 
              onChange={(e) => {setSignerPosition(e.target.value); setErrors({...errors, position: false});}}
              className={`w-full px-5 py-3 border-2 rounded-2xl text-[13px] outline-none transition-all ${errors.position ? "border-red-400 bg-red-50" : "border-gray-100 focus:border-blue-500"}`} />
          </div>

          {/* ✍️ เพิ่มใหม่: ช่องลงลายมือชื่อดิจิทัล */}
          <div className="w-full mt-2">
            <div className="flex justify-between items-center mb-2 px-2">
              <label className="font-bold text-[15px] flex items-center gap-2">
                <PenTool size={16} className="text-blue-500" />
                ลงลายมือชื่อ
              </label>
              <button 
                type="button"
                onClick={clearSignature}
                className="text-red-400 text-[11px] flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
              >
                <RotateCcw size={12} /> ล้างลายเส้น
              </button>
            </div>
            
            <div className={`relative w-full h-40 bg-gray-50 rounded-2xl border-2 transition-all overflow-hidden ${errors.signature ? "border-red-400 bg-red-50" : "border-gray-100"}`}>
              <SignatureCanvas 
                ref={sigCanvas}
                penColor="black"
                onBegin={() => {setIsSigned(true); setErrors({...errors, signature: false});}}
                canvasProps={{
                  className: "w-full h-full cursor-crosshair"
                }}
              />
              {!isSigned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 text-[12px]">
                  ใช้นิ้ววาดลายเซ็นที่นี่
                </div>
              )}
            </div>
            {/* แสดงวันที่ด้านล่างลายเซ็น */}
          </div>

          {/* 10. วันที่ส่งนัดหมาย */}
          <div className="w-full relative">
            <div className="flex justify-between mb-2 px-2">
                <label className="font-bold text-[15px]">วันที่ส่งนัดหมาย</label>
                {errors.dateSent && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle size={12}/> จำเป็น</span>}
            </div>
            <button type="button" onClick={() => {setShowCalendarSent(!showCalendarSent); setShowCalendar(false); setIsOpen1(false); setIsOpen2(false); setIsOpen3(false);}}
              className={`w-full flex items-center justify-between px-5 py-3 border-2 rounded-2xl text-[13px] bg-white ${errors.dateSent ? "border-red-400 bg-red-50" : "border-gray-100"}`}>
              <span className={meetingDateSent ? "text-gray-700" : "text-gray-300"}>{meetingDateSent || "เลือกวันที่ส่ง..."}</span>
              <CalendarIcon size={18} className="text-gray-400" />
            </button>
            <p className="mb-2 mt-2 px-2 block text-gray-400 text-[10px]"> * ต้องส่งไม่น้อยกว่า 7 วัน ก่อนวันประชุม (ถ้ามติพิเศษ ไม่น้อยกว่า 14 วัน) </p>

            {showCalendarSent && (
              <div className="absolute left-0 right-0 mt-3 p-4 bg-white rounded-[2rem] shadow-2xl border z-[100]">
                <div className="flex justify-between items-center mb-4">
                  <button onClick={() => changeMonth(-1)}><ChevronLeft size={18}/></button>
                  <span className="font-bold text-sm">{currentMonth.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => changeMonth(1)}><ChevronRight size={18}/></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(d => <span key={d} className="text-[10px] font-bold text-gray-400 py-1">{d}</span>)}
                  {Array.from({ length: firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => <div key={i} />)}
                  {Array.from({ length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => (
                    <button key={i} onClick={() => selectDateSent(i + 1)} className="aspect-square text-[12px] flex items-center justify-center rounded-xl hover:bg-blue-50">{i + 1}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button onClick={handleSave} className="mt-8 w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
          สร้างหนังสือเชิญประชุม
        </button>
      </div>
    </div>
  );
}