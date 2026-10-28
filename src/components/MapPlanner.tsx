import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Activity, Trip } from '../types';
import { CATEGORY_CONFIG, DAY_COLORS, getGoogleMapsUrl } from '../utils/helpers';
import { MapPin, Navigation, Plus, Eye, Layers } from 'lucide-react';

interface MapPlannerProps {
  trip: Trip;
  selectedDay: number | 'all';
  onSelectDay: (day: number | 'all') => void;
  onEditActivity: (activity: Activity, dayNumber: number) => void;
  onQuickAddLocation: (lat: number, lng: number, dayNumber: number) => void;
  highlightedActivityId?: string | null;
}

export const MapPlanner: React.FC<MapPlannerProps> = ({
  trip,
  selectedDay,
  onSelectDay,
  onEditActivity,
  onQuickAddLocation,
  highlightedActivityId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [clickCoord, setClickCoord] = useState<{ lat: number; lng: number } | null>(null);

  // 初始化地圖
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // 預設以台灣中心為基準
      const map = L.map(mapContainerRef.current, {
        center: [23.9734, 121.6052],
        zoom: 10,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const polylineGroup = L.layerGroup().addTo(map);

      markersLayerRef.current = markersGroup;
      polylineLayerRef.current = polylineGroup;
      mapInstanceRef.current = map;

      // 監聽點擊地圖新增景點
      map.on('click', (e: L.LeafletMouseEvent) => {
        setClickCoord({ lat: Number(e.latlng.lat.toFixed(5)), lng: Number(e.latlng.lng.toFixed(5)) });
      });
    }

    return () => {
      // 保留實例或必要時清理
    };
  }, []);

  // 繪製 Markers 與軌跡線
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const polylineGroup = polylineLayerRef.current;
    if (!map || !markersGroup || !polylineGroup) return;

    markersGroup.clearLayers();
    polylineGroup.clearLayers();

    const bounds = L.latLngBounds([]);
    let hasCoords = false;

    // 依天數過濾
    const targetDays = selectedDay === 'all'
      ? trip.days
      : trip.days.filter((d) => d.dayNumber === selectedDay);

    targetDays.forEach((day) => {
      const dayColor = DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length];
      const dayCoords: L.LatLngTuple[] = [];

      day.activities.forEach((act, actIndex) => {
        if (selectedCategory !== 'all' && act.category !== selectedCategory) return;
        if (act.lat !== undefined && act.lng !== undefined) {
          const lat = act.lat;
          const lng = act.lng;
          hasCoords = true;
          const latLng = L.latLng(lat, lng);
          bounds.extend(latLng);
          dayCoords.push([lat, lng]);

          const catConf = CATEGORY_CONFIG[act.category];

          // 自訂精美標記圖示
          const isHighlighted = act.id === highlightedActivityId;
          const markerHtml = `
            <div style="
              background-color: ${dayColor};
              width: ${isHighlighted ? '38px' : '32px'};
              height: ${isHighlighted ? '38px' : '32px'};
              border-radius: 50%;
              border: 3px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 15px;
              color: white;
              font-weight: bold;
              cursor: pointer;
              transition: transform 0.2s;
              ${isHighlighted ? 'outline: 4px solid #f59e0b; transform: scale(1.15);' : ''}
            ">
              ${catConf?.icon || '📍'}
            </div>
          `;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-map-pin',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -18],
          });

          const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersGroup);

          // Popup 內容
          const popupHtml = `
            <div style="font-family: inherit; padding: 4px; min-width: 220px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="background-color: ${dayColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                  Day ${day.dayNumber} · ${act.time}
                </span>
                <span style="font-size: 11px; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">
                  ${catConf?.label}
                </span>
              </div>
              <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">
                ${act.title}
              </h4>
              <p style="font-size: 12px; color: #475569; margin: 0 0 8px 0; display: flex; align-items: center; gap: 4px;">
                📍 ${act.locationName}
              </p>
              ${act.notes ? `<p style="font-size: 11px; color: #64748b; background: #f8fafc; padding: 6px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid ${dayColor};">${act.notes}</p>` : ''}
              <div style="display: flex; gap: 6px; margin-top: 8px;">
                <a href="${getGoogleMapsUrl(act.locationName, act.lat, act.lng)}" target="_blank" rel="noopener noreferrer" style="
                  flex: 1;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  gap: 4px;
                  background-color: #2563eb;
                  color: white;
                  padding: 6px 10px;
                  border-radius: 6px;
                  font-size: 11px;
                  font-weight: 600;
                  text-decoration: none;
                ">
                  🗺️ Google 導航
                </a>
              </div>
            </div>
          `;

          marker.bindPopup(popupHtml);

          if (isHighlighted) {
            marker.openPopup();
          }
        }
      });

      // 繪製當天景點連線軌跡
      if (dayCoords.length > 1) {
        L.polyline(dayCoords, {
          color: dayColor,
          weight: 4,
          opacity: 0.75,
          dashArray: '6, 8',
        }).addTo(polylineGroup);
      }
    });

    if (hasCoords && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [trip, selectedDay, selectedCategory, highlightedActivityId]);

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 flex flex-col">
      {/* 頂部地圖工具條 */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200/80 pointer-events-auto">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-700">天數檢視:</span>
          <button
            onClick={() => onSelectDay('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
              selectedDay === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部天數
          </button>
          {trip.days.map((day) => {
            const color = DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length];
            return (
              <button
                key={day.dayNumber}
                onClick={() => onSelectDay(day.dayNumber)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition flex items-center gap-1 ${
                  selectedDay === day.dayNumber
                    ? 'text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={{
                  backgroundColor: selectedDay === day.dayNumber ? color : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: color }}
                />
                第 {day.dayNumber} 天
              </button>
            );
          })}
        </div>

        {/* 類別篩選 */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200/80 pointer-events-auto">
          <span className="text-xs font-bold text-slate-700">分類:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部分類</option>
            <option value="attraction">🏰 景點遊憩</option>
            <option value="food">🍜 美食品嚐</option>
            <option value="stay">🏨 飯店住宿</option>
            <option value="transport">🚗 交通接駁</option>
            <option value="shopping">🛍️ 名產購物</option>
          </select>
        </div>
      </div>

      {/* 點擊地圖彈出新增景點浮層 */}
      {clickCoord && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-xl border border-blue-200 max-w-sm pointer-events-auto animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              點選座標：{clickCoord.lat}, {clickCoord.lng}
            </span>
            <button
              onClick={() => setClickCoord(null)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            要將此地圖點加入到家庭旅遊規劃中嗎？
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const targetDay = selectedDay === 'all' ? 1 : selectedDay;
                onQuickAddLocation(clickCoord.lat, clickCoord.lng, targetDay);
                setClickCoord(null);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              新增為景點 (Day {selectedDay === 'all' ? 1 : selectedDay})
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${clickCoord.lat},${clickCoord.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              Google 地圖
            </a>
          </div>
        </div>
      )}

      {/* 提示小標 */}
      <div className="absolute bottom-3 right-3 z-[999] bg-white/80 backdrop-blur-sm text-[11px] text-slate-500 px-2.5 py-1 rounded-md shadow-sm pointer-events-none">
        💡 點選地圖任意位置可快速標記私房景點
      </div>

      {/* 地圖容器 */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
