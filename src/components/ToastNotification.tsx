import React from 'react';
import { TripNotification } from '../types';
import { Bell, X, ArrowRight } from 'lucide-react';

interface ToastNotificationProps {
  notification: TripNotification | null;
  onClose: () => void;
  onClick: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  notification,
  onClose,
  onClick,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[1500] max-w-sm w-full bg-white rounded-2xl shadow-2xl border-2 border-blue-500 p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              🔔 行程變更即時提醒
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-xs font-bold text-slate-900 truncate">
            {notification.memberName}：{notification.title}
          </h4>
          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">{notification.timestamp}</span>
            <button
              onClick={onClick}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              查看詳情 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
