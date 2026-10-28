import React, { useState } from 'react';
import { Trip } from '../types';
import {
  Link2,
  Copy,
  Check,
  Share2,
  Lock,
  RefreshCw,
  X,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

interface ShareInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onRegenerateCode?: (newCode: string) => void;
}

export const ShareInviteModal: React.FC<ShareInviteModalProps> = ({
  isOpen,
  onClose,
  trip,
  onRegenerateCode,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  // 取得完整加入網址 (附帶 invite code 與 tripId)
  const baseUrl = window.location.origin + window.location.pathname;
  const inviteUrl = `${baseUrl}?invite=${encodeURIComponent(trip.inviteCode || trip.id)}&tripId=${trip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyLineInvite = () => {
    const text = `👨‍👩‍👧‍👦 【家庭會議與旅遊規劃邀請】\n家人好！我們正在規劃「${trip.title}」✨\n\n📌 目的地：${trip.destination}\n📅 出發日期：${trip.startDate}\n🔐 專屬加入代碼：${trip.inviteCode}\n\n👉 點選專屬邀請連結，自訂你的角色並加入行程共編：\n${inviteUrl}\n\n快來投票想去的景點與美食吧！✈️`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  const handleRefreshCode = () => {
    if (!confirm('重設邀請碼後，先前的邀請連結將會失效，確定要重新產生嗎？')) return;
    const newCode = `FT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    if (onRegenerateCode) {
      onRegenerateCode(newCode);
    }
  };

  return (
    <div className="fixed inset-0 z-[1300] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                邀請家庭成員加入行程
              </h3>
              <p className="text-xs text-slate-500">
                僅限擁有專屬邀請連結或邀請碼的家人才能加入與共編
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 邀請碼專區 */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              專屬家庭邀請碼
            </span>
            {onRegenerateCode && (
              <button
                onClick={handleRefreshCode}
                title="重新產生新邀請碼"
                className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> 重設
              </button>
            )}
          </div>

          <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-blue-200">
            <span className="font-mono font-black text-base tracking-wider text-slate-900">
              {trip.inviteCode}
            </span>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 受保護存取
            </span>
          </div>
        </div>

        {/* 專屬連結複製 */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            專屬加入連結 (含授權權杖)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-600 truncate select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '已複製！' : '複製連結'}</span>
            </button>
          </div>
        </div>

        {/* LINE 邀請格式複製 */}
        <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h5 className="font-bold text-xs text-emerald-900 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              LINE 家庭群組邀請卡
            </h5>
            <p className="text-[11px] text-emerald-700">
              包含旅程資訊、專屬代碼與加入說明，複製後直接貼入家庭群組
            </p>
          </div>
          <button
            onClick={handleCopyLineInvite}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1 shrink-0 shadow-sm"
          >
            {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? '已複製！' : '複製邀請文案'}</span>
          </button>
        </div>

        {/* 提示 */}
        <div className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl leading-relaxed">
          💡 <strong>隱私安全提醒：</strong>
          收到此連結的家人點擊開啟後，即可在畫面中建立自己的角色稱謂與頭像，直接加入此旅程的共同編輯、行程投票與即時變更通知！
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow transition"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
