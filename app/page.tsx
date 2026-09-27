"use client";

import { useState } from "react";

export default function HomePage() {
  const [location, setLocation] = useState("Chưa chọn vị trí");
  const [message, setMessage] = useState("Hãy cấp quyền vị trí hoặc tìm địa điểm để xem cảnh báo.");
  const useLocation = () => {
    if (!navigator.geolocation) { setMessage("Thiết bị không hỗ trợ GPS. Hãy tìm địa điểm thủ công."); return; }
    setMessage("Đang xác định vị trí…");
    navigator.geolocation.getCurrentPosition(
      (p) => { setLocation(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`); setMessage("Đã nhận vị trí theo quyền bạn cấp. Dữ liệu cảnh báo chính thức sẽ hiển thị tại đây."); },
      () => setMessage("Không lấy được vị trí. Bạn vẫn có thể tìm địa điểm thủ công."),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };
  return <main><section className="hero"><div className="badge">⚡ HUFF · SMART DISASTER ALERT</div><h1>Cảnh báo thiên tai<br/>theo vị trí của bạn</h1><p>Thời tiết, mưa lớn, ngập lụt, giông sét, động đất và sóng thần — rõ nguồn, rõ thời gian cập nhật.</p><button onClick={useLocation}>Dùng vị trí của tôi</button><p className="location">{location}</p></section><div className="ticker">Say Hi 2027 · Huff luôn đồng hành cùng bạn · Say Hi 2027</div><section className="grid">{[["🌧️","Mưa & ngập","Theo dõi nguồn khí tượng chính thức"],["⚡","Giông sét","Ưu tiên an toàn khi có cảnh báo"],["🌏","Động đất","Theo dõi nguồn địa chấn đáng tin cậy"],["🌊","Sóng thần","Luôn theo chỉ đạo sơ tán địa phương"]].map(([i,t,d])=><article key={t}><b>{i}</b><h2>{t}</h2><p>{d}</p></article>)}</section><section className="notice"><b>Trạng thái:</b> {message}<br/><small>Huff không tự tạo cảnh báo khẩn. Trong tình huống nguy hiểm, luôn tuân theo cơ quan chức năng.</small></section></main>;
}
