import React, { useState } from 'react';
import { Trip, FamilyMember } from '../types';
import confetti from 'canvas-confetti';
import {
  Users,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Palette,
} from 'lucide-react';

interface JoinInviteModalProps {
  isOpen: boolean;
  targetTrip: Trip;
  inviteCodeFromUrl?: string;
  onJoinSuccess: (newMember: FamilyMember) => void;
  onClose?: () => void;
  onVerifyCode?: (inputCode: string) => boolean;
}

const PRESET_AVATARS = [
  '👨‍✈️', '👩‍💼', '👦', '👧', '👵', '👴', '👶', '🧑‍🍳',
  '👩‍🎨', '🧑‍💻', '🐱', '🐶', '🚗', '✈️', '📸', '🍦',
];

const PRESET_ROLES = [
  '行程總召 & 導航',
  '財務大臣 & 記帳',
  '美食地圖 & 打卡',
  '點心零食專員',
  '專屬駕駛員',
  '行李收納神隊友',
  '隨行自由攝影師',
];

export const JoinInviteModal: React.FC<JoinInviteModalProps> = ({
  isOpen,
  targetTrip,
  inviteCodeFromUrl,
  onJoinSuccess,
  onClose,
  onVerifyCode,
}) => {
  // 如果 URL 帶有正確邀請碼，直接進入身分自訂；若沒有或不正確，先驗證邀請碼
  const isCodePreVerified = Boolean(
    inviteCodeFromUrl &&
    (inviteCodeFromUrl === targetTrip.inviteCode || inviteCodeFromUrl === targetTrip.id)
  );

  const [step, setStep] = useState<'verify' | 'profile'>(
    isCodePreVerified ? 'profile' : 'verify'
  );
  const [manualCode, setManualCode] = useState(inviteCodeFromUrl || '');
  const [codeError, setCodeError] = useState('');

  // 自訂成員身分表單
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('行程隊員');
  const [avatar, setAvatar] = useState('👦');
  const [badge, setBadge] = useState('新成員');
  const [color, setColor] = useState('#2563eb');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = manualCode.trim().toUpperCase();
    if (cleanCode === targetTrip.inviteCode.toUpperCase() || cleanCode === targetTrip.id) {
      setCodeError('');
      setStep('profile');
    } else {
      setCodeError('邀請碼無效或已過期，請確認家庭邀請連結或代碼！');
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roleTitle.trim()) {
      alert('請填寫您的稱謂與角色職稱！');
      return;
    }

    const newMember: FamilyMember = {
      id: `m-join-${Date.now()}`,
      name: name.trim(),
      roleTitle: roleTitle.trim(),
      avatar,
      color,
      badge: badge.trim() || '隊員',
    };

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    onJoinSuccess(newMember);
  };

  return (
    <div className="fixed inset-0 z-[1400] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        {/* Banner 頂部 */}
        <div className="relative p-6 bg-gradient-to-tr from-blue-700 via-indigo-700 to-purple-800 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
              專屬邀請加入系統
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {step === 'verify' ? '請輸入專屬加入邀請碼' : '歡迎加入家庭旅遊規劃！'}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            旅程專案：<strong className="text-white">{targetTrip.title}</strong>
          </p>
        </div>

        {/* 內容區域 */}
        <div className="p-6">
          {step === 'verify' ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-xs text-slate-600 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 leading-relaxed">
                🔒 <strong>受保護的家庭空間：</strong>
                此旅程設定為私密共編，僅擁有受邀連結或專屬邀請代碼的家人才能加入。
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" /> 請輸入家庭邀請碼
                </label>
                <input
                  type="text"
                  required
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="例：FAMILY-2026-HUALIEN"
                  className="w-full text-sm font-mono uppercase tracking-wider px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {codeError && (
                  <p className="text-xs text-red-500 font-semibold mt-1.5">{codeError}</p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                  >
                    返回瀏覽
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 ml-auto"
                >
                  <span>驗證並下一步</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>邀請驗證成功！請建立您在家庭會議與旅程中的自訂稱謂。</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    您的名字 / 稱呼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例：二姐 (雅婷)、大舅、阿信"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    身分標籤 (2~4字)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="例：攝影、總務、導遊"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  自訂角色職稱與分工 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="例：隨行特約攝影師、美食探索官..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {PRESET_ROLES.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRoleTitle(r)}
                      className="text-[10px] bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-2 py-0.5 rounded-lg transition"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 選擇頭像 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  挑選專屬頭像 (目前: <span className="text-base">{avatar}</span>)
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition ${
                        avatar === av ? 'bg-blue-200 ring-2 ring-blue-600 scale-110' : 'hover:bg-slate-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    取消
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>正式加入家庭行程共編！</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
