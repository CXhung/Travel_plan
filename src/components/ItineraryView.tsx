import React from 'react';
import { Trip, Activity, FamilyMember } from '../types';
import { CATEGORY_CONFIG, DAY_COLORS, formatCurrency, getGoogleMapsUrl } from '../utils/helpers';
import {
  Clock,
  MapPin,
  Plus,
  Navigation,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink,
  ThumbsUp,
  CheckCircle2,
} from 'lucide-react';

interface ItineraryViewProps {
  trip: Trip;
  currentMember: FamilyMember;
  members: FamilyMember[];
  activeDay: number;
  onSelectDay: (day: number) => void;
  onAddActivity: (dayNumber: number) => void;
  onEditActivity: (activity: Activity, dayNumber: number) => void;
  onDeleteActivity: (activityId: string, dayNumber: number) => void;
  onMoveActivity: (dayNumber: number, index: number, direction: 'up' | 'down') => void;
  onVoteActivity: (activityId: string, dayNumber: number, vote: 'yes' | 'maybe' | 'no') => void;
  onFocusMapLocation: (activityId: string) => void;
  onAddDay: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  currentMember,
  members,
  activeDay,
  onSelectDay,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onMoveActivity,
  onVoteActivity,
  onFocusMapLocation,
  onAddDay,
}) => {
  const currentDayData = trip.days.find((d) => d.dayNumber === activeDay) || trip.days[0];
  const dayColor = DAY_COLORS[(activeDay - 1) % DAY_COLORS.length];

  return (
    <div className="space-y-6">
      {/* 天數切換分頁列 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {trip.days.map((day) => {
          const isActive = day.dayNumber === activeDay;
          const color = DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length];
          return (
            <button
              key={day.dayNumber}
              onClick={() => onSelectDay(day.dayNumber)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center gap-2 border ${
                isActive
                  ? 'text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              style={{
                backgroundColor: isActive ? color : undefined,
                borderColor: isActive ? color : undefined,
              }}
            >
              <span className="text-xs bg-white/25 px-2 py-0.5 rounded-full">
                Day {day.dayNumber}
              </span>
              <span>{day.date.split('-').slice(1).join('/')}</span>
              <span className="text-xs opacity-80 max-w-[120px] truncate">
                {day.theme || '自由活動'}
              </span>
            </button>
          );
        })}

        {/* 新增天數按鈕 */}
        <button
          onClick={onAddDay}
          className="flex-shrink-0 px-3.5 py-2.5 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-400 font-semibold text-xs transition flex items-center gap-1.5 bg-slate-50 hover:bg-blue-50/50"
        >
          <Plus className="w-4 h-4" />
          <span>加一天</span>
        </button>
      </div>

      {/* 當天主題與快速新增 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
            style={{ backgroundColor: dayColor }}
          >
            D{currentDayData?.dayNumber}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {currentDayData?.theme || `第 ${activeDay} 天行程`}
            </h2>
            <p className="text-xs text-slate-500">
              日期：{currentDayData?.date} · 共 {currentDayData?.activities.length || 0} 個預定活動
            </p>
          </div>
        </div>

        <button
          onClick={() => onAddActivity(activeDay)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>新增景點 / 行程</span>
        </button>
      </div>

      {/* 活動時間軸清單 */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-7 before:w-0.5 before:bg-slate-200 before:pointer-events-none">
        {(!currentDayData || currentDayData.activities.length === 0) ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <Sparkles className="w-10 h-10 mx-auto text-blue-500 mb-2 opacity-50" />
            <h3 className="text-base font-bold text-slate-700 mb-1">
              第 {activeDay} 天尚無行程活動
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              點擊下方按鈕或在地圖上點選任意地點，開始為家人規劃精采旅程！
            </p>
            <button
              onClick={() => onAddActivity(activeDay)}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 shadow transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              立即新增第一個景點
            </button>
          </div>
        ) : (
          currentDayData.activities.map((act, index) => {
            const catConf = CATEGORY_CONFIG[act.category];
            const assignedMember = members.find((m) => m.id === act.assignedMemberId);
            const userVote = act.votes?.[currentMember.id];

            return (
              <div
                key={act.id}
                className="relative pl-14 group"
              >
                {/* 時間軸節點小圖示 */}
                <div
                  className="absolute left-4.5 top-5 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-sm font-bold text-white z-10 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: dayColor }}
                >
                  {catConf.icon}
                </div>

                {/* 卡片本體 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:border-slate-300">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {act.time} {act.endTime ? `~ ${act.endTime}` : ''}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-lg font-bold border ${catConf.bgLight} ${catConf.border}`}
                      >
                        {catConf.label}
                      </span>
                      {act.isHighlight && (
                        <span className="text-xs px-2 py-0.5 rounded-lg font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                          ⭐ 重點行程
                        </span>
                      )}
                    </div>

                    {/* 操作工具鈕 */}
                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                      {index > 0 && (
                        <button
                          onClick={() => onMoveActivity(activeDay, index, 'up')}
                          title="往上移"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                      )}
                      {index < currentDayData.activities.length - 1 && (
                        <button
                          onClick={() => onMoveActivity(activeDay, index, 'down')}
                          title="往下移"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onFocusMapLocation(act.id)}
                        title="在地圖上定位"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-1 text-xs font-semibold"
                      >
                        <MapPin className="w-4 h-4" />
                        <span className="hidden sm:inline">在地圖看</span>
                      </button>
                      <button
                        onClick={() => onEditActivity(act, activeDay)}
                        title="編輯此行程"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteActivity(act.id, activeDay)}
                        title="刪除"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 標題與地點 */}
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {act.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-600 mb-2.5 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {act.locationName}
                    </span>
                    {act.address && (
                      <span className="text-slate-400">({act.address})</span>
                    )}
                    <a
                      href={getGoogleMapsUrl(act.locationName, act.lat, act.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-0.5 font-semibold"
                    >
                      Google 導航 <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* 備註與貼心提示 */}
                  {act.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 leading-relaxed">
                      💡 <strong>備註提醒：</strong>{act.notes}
                    </p>
                  )}

                  {/* 底部：負責成員、預算、表決與最後更新紀錄 */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 flex-wrap">
                      {assignedMember && (
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                          <span className="text-sm">{assignedMember.avatar}</span>
                          <span className="font-semibold">{assignedMember.name}</span>
                          <span className="text-[10px] text-slate-500 font-normal">帶隊</span>
                        </div>
                      )}
                      {act.cost !== undefined && act.cost > 0 && (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                          預估費用：{formatCurrency(act.cost)}
                        </span>
                      )}
                    </div>

                    {/* 成員表決投票區域 */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">我的意願:</span>
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                        <button
                          onClick={() => onVoteActivity(act.id, activeDay, 'yes')}
                          className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                            userVote === 'yes'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-blue-600'
                          }`}
                        >
                          👍 想去
                        </button>
                        <button
                          onClick={() => onVoteActivity(act.id, activeDay, 'maybe')}
                          className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                            userVote === 'maybe'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:text-amber-600'
                          }`}
                        >
                          🤔 考慮
                        </button>
                        <button
                          onClick={() => onVoteActivity(act.id, activeDay, 'no')}
                          className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                            userVote === 'no'
                              ? 'bg-slate-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-red-600'
                          }`}
                        >
                          🙅 Pass
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 共同編輯異動提示標籤 */}
                  {act.lastEditedBy && (
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                      <span>🕒 最近異動：</span>
                      <span className="font-semibold text-slate-600">
                        {act.lastEditedBy.memberName}
                      </span>
                      <span>「{act.lastEditedBy.action}」</span>
                      <span className="text-slate-400">({act.lastEditedBy.timestamp})</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
