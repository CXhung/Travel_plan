import React, { useState } from 'react';
import { Trip, FamilyMember } from '../types';
import { formatCurrency, getGoogleMapsUrl } from '../utils/helpers';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Copy,
  Printer,
  ChevronRight,
  Archive,
  CheckCircle,
  FileText,
} from 'lucide-react';

interface HistoryArchiveViewProps {
  trips: Trip[];
  activeTripId: string;
  onSelectTrip: (tripId: string) => void;
  onCloneTripAsNew: (trip: Trip) => void;
  members: FamilyMember[];
}

export const HistoryArchiveView: React.FC<HistoryArchiveViewProps> = ({
  trips,
  activeTripId,
  onSelectTrip,
  onCloneTripAsNew,
  members,
}) => {
  const [selectedArchiveTripId, setSelectedArchiveTripId] = useState<string>(
    trips.find((t) => t.status === 'completed')?.id || trips[0]?.id
  );

  const selectedTrip = trips.find((t) => t.id === selectedArchiveTripId) || trips[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 頂部引言 */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
            <Archive className="w-3.5 h-3.5 text-indigo-300" />
            家庭旅遊記憶庫 · 日後行程回顧
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            歷年家庭旅行紀錄與規劃檔案
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            隨時隨地翻閱過去全家一起踩點的足跡、住宿評價與美好回憶；日後想重溫經典路線，還能一鍵複製為全新旅程！
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2 shadow"
        >
          <Printer className="w-4 h-4" />
          列印 / 匯出紀念手冊
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：歷年旅程卡片選單 */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            全部旅遊紀錄 ({trips.length})
          </h3>
          {trips.map((trip) => {
            const isCurrent = trip.id === selectedArchiveTripId;
            const totalActivities = trip.days.reduce(
              (acc, day) => acc + day.activities.length,
              0
            );

            return (
              <div
                key={trip.id}
                onClick={() => setSelectedArchiveTripId(trip.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isCurrent
                    ? 'bg-blue-50/80 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          trip.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {trip.status === 'completed' ? '✨ 已圓滿完成' : '🗓️ 籌備規劃中'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {trip.days.length} 天 {totalActivities} 景點
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {trip.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {trip.startDate} ~ {trip.endDate}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 右側：被選定旅程的完整回顧資訊 */}
        <div className="lg:col-span-2 space-y-5">
          {selectedTrip && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              {/* 橫幅照片與標題 */}
              <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56">
                <img
                  src={selectedTrip.coverImage}
                  alt={selectedTrip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold w-fit mb-1">
                    目的地：{selectedTrip.destination}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {selectedTrip.title}
                  </h3>
                  <p className="text-xs text-white/90 mt-1 line-clamp-2">
                    {selectedTrip.description}
                  </p>
                </div>
              </div>

              {/* 快速按鈕列 */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectTrip(selectedTrip.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    <span>切換至此行程工作台</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onCloneTripAsNew(selectedTrip)}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>以此行程為範本重新規劃</span>
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  建檔日期：{selectedTrip.createdAt}
                </span>
              </div>

              {/* 心得備忘錄 */}
              {selectedTrip.notes && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <h5 className="font-bold flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 日後旅遊參考心得筆記：
                  </h5>
                  {selectedTrip.notes}
                </div>
              )}

              {/* 每日回顧行程列表 */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> 每日規劃行程清單回顧
                </h4>

                <div className="space-y-4">
                  {selectedTrip.days.map((day) => (
                    <div
                      key={day.dayNumber}
                      className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50"
                    >
                      <div className="bg-slate-100/80 px-4 py-2.5 font-bold text-xs text-slate-800 flex items-center justify-between">
                        <span>
                          第 {day.dayNumber} 天 ({day.date})：{day.theme}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {day.activities.length} 個行程
                        </span>
                      </div>
                      <div className="p-3 divide-y divide-slate-100">
                        {day.activities.map((act) => (
                          <div
                            key={act.id}
                            className="py-2.5 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-blue-600">
                                  {act.time}
                                </span>
                                <span className="font-bold text-slate-900">
                                  {act.title}
                                </span>
                              </div>
                              <p className="text-slate-500 flex items-center gap-1 text-[11px]">
                                <MapPin className="w-3 h-3" /> {act.locationName}
                              </p>
                              {act.notes && (
                                <p className="text-slate-600 text-[11px] italic">
                                  備註：{act.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {act.cost ? (
                                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                  {formatCurrency(act.cost)}
                                </span>
                              ) : null}
                              <a
                                href={getGoogleMapsUrl(act.locationName, act.lat, act.lng)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-[11px] font-semibold"
                              >
                                地圖導航
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
