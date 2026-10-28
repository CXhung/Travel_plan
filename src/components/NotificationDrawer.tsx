import React, { useState } from 'react';
import { TripNotification, FamilyMember } from '../types';
import { Bell, CheckCheck, Clock, Share2, Sparkles, AlertCircle, X } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: TripNotification[];
  members: FamilyMember[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notification: TripNotification) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  members,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  const [filter, setFilter] = useState<'all' | 'time' | 'edit' | 'vote'>('all');
  const [copiedLine, setCopiedLine] = useState(false);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'time') return n.actionType === 'time';
    if (filter === 'vote') return n.actionType === 'vote' || n.actionType === 'meeting';
    if (filter === 'edit') return n.actionType === 'edit' || n.actionType === 'add';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleCopyLineSummary = () => {
    const recentNotifs = notifications.slice(0, 5);
    const text = `📢 【家庭旅遊行程異動提醒】\n各位家人好！近期行程有以下最新變更：\n\n` +
      recentNotifs.map((n, i) => `${i + 1}. [${n.memberName}] ${n.title}：${n.message}`).join('\n') +
      `\n\n請大家打開家庭 App 確認最新每日行程與集合時間喔！👨‍👩‍👧‍👦✈️`;

    navigator.clipboard.writeText(text);
    setCopiedLine(true);
    setTimeout(() => setCopiedLine(false), 3000);
  };

  const getActionBadge = (type: TripNotification['actionType']) => {
    switch (type) {
      case 'time':
        return <span className="bg-amber-100 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> 時間異動</span>;
      case 'add':
        return <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" /> 新增行程</span>;
      case 'edit':
        return <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 內容更新</span>;
      case 'vote':
      case 'meeting':
        return <span className="bg-purple-100 text-purple-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">🗳️ 會議投票</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] overflow-hidden">
      {/* 遮罩 */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  行程變更提醒中心
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                      {unreadCount} 則新通知
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">掌握家庭成員即時修改與最新動態</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Tools */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${filter === 'all' ? 'bg-white shadow text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter('time')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${filter === 'time' ? 'bg-white shadow text-amber-700 font-bold' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                ⏰ 時間異動
              </button>
              <button
                onClick={() => setFilter('edit')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${filter === 'edit' ? 'bg-white shadow text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                📝 內容更新
              </button>
              <button
                onClick={() => setFilter('vote')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${filter === 'vote' ? 'bg-white shadow text-purple-700 font-bold' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                🗳️ 表決
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                全部已讀
              </button>
            )}
          </div>

          {/* LINE 廣播輔助列 */}
          <div className="mx-3 mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                💬 廣播行程異動至 LINE
              </p>
              <p className="text-[11px] text-emerald-700">一鍵複製最新異動彙整，貼至家庭群組</p>
            </div>
            <button
              onClick={handleCopyLineSummary}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedLine ? '已複製！' : '複製提醒'}
            </button>
          </div>

          {/* 列表內容 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
                <p className="text-sm font-medium">目前沒有此類別的行程變更紀錄</p>
                <p className="text-xs text-slate-400 mt-1">任何成員修改行程，通知都會即時顯示於此</p>
              </div>
            ) : (
              filteredNotifications.map((n) => {
                const member = members.find((m) => m.id === n.memberId);
                return (
                  <div
                    key={n.id}
                    onClick={() => onSelectNotification(n)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer relative hover:shadow-md ${
                      !n.isRead
                        ? 'bg-blue-50/70 border-blue-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {!n.isRead && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-600" />
                    )}
                    <div className="flex items-start gap-3">
                      <div className="text-2xl select-none pt-0.5">
                        {member?.avatar || '👤'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-xs text-slate-800">
                            {n.memberName}
                          </span>
                          {getActionBadge(n.actionType)}
                          <span className="text-[11px] text-slate-400 ml-auto">
                            {n.timestamp}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mb-1">
                          {n.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {n.message}
                        </p>
                        <div className="mt-2 text-[11px] text-blue-600 font-medium flex items-center gap-1">
                          <span>點擊跳轉至該行程查看詳情 →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
