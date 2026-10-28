import React, { useState } from 'react';
import { FamilyMember } from '../types';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Palette,
} from 'lucide-react';

interface MemberManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  currentMember: FamilyMember;
  onUpdateMembers: (newMembers: FamilyMember[]) => void;
  onSelectCurrentMember: (member: FamilyMember) => void;
}

const PRESET_AVATARS = [
  '👨‍✈️', '👩‍💼', '👦', '👧', '👵', '👴', '👶', '🧑‍🍳',
  '👩‍🎨', '🧑‍💻', '👨‍🔧', '🕵️', '🐱', '🐶', '🐰', '🐼',
  '🚗', '✈️', '📸', '🍦', '🌸', '⭐', '🎒', '🏕️',
];

const PRESET_ROLES = [
  '行程總召 & 首席導航',
  '財務大臣 & 住宿策劃',
  '美食地圖 & 拍照打卡',
  '點心零食專員 & 氣氛組',
  '行李後勤 & 裝備長',
  '專屬司機 & 交通隊長',
  '養生顧問 & 家庭長老',
  '自由探險家',
];

const PRESET_COLORS = [
  '#2563eb', // blue
  '#db2777', // pink
  '#059669', // emerald
  '#d97706', // amber
  '#7c3aed', // violet
  '#dc2626', // red
  '#0891b2', // cyan
  '#4f46e5', // indigo
];

export const MemberManagementModal: React.FC<MemberManagementModalProps> = ({
  isOpen,
  onClose,
  members,
  currentMember,
  onUpdateMembers,
  onSelectCurrentMember,
}) => {
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // 表單 state
  const [formName, setFormName] = useState('');
  const [formRoleTitle, setFormRoleTitle] = useState('');
  const [formAvatar, setFormAvatar] = useState('👨‍✈️');
  const [formColor, setFormColor] = useState('#2563eb');
  const [formBadge, setFormBadge] = useState('隊員');

  if (!isOpen) return null;

  const startAdd = () => {
    setEditingMemberId(null);
    setFormName('');
    setFormRoleTitle('行程隊員');
    setFormAvatar('👦');
    setFormColor('#059669');
    setFormBadge('隊員');
    setIsAddingNew(true);
  };

  const startEdit = (m: FamilyMember) => {
    setIsAddingNew(false);
    setEditingMemberId(m.id);
    setFormName(m.name);
    setFormRoleTitle(m.roleTitle);
    setFormAvatar(m.avatar);
    setFormColor(m.color);
    setFormBadge(m.badge || '成員');
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingMemberId(null);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRoleTitle.trim()) {
      alert('請填寫姓名與角色職稱！');
      return;
    }

    if (isAddingNew) {
      const newMember: FamilyMember = {
        id: `m-${Date.now()}`,
        name: formName.trim(),
        roleTitle: formRoleTitle.trim(),
        avatar: formAvatar,
        color: formColor,
        badge: formBadge.trim() || '成員',
      };
      onUpdateMembers([...members, newMember]);
      setIsAddingNew(false);
    } else if (editingMemberId) {
      const updated = members.map((m) =>
        m.id === editingMemberId
          ? {
              ...m,
              name: formName.trim(),
              roleTitle: formRoleTitle.trim(),
              avatar: formAvatar,
              color: formColor,
              badge: formBadge.trim() || '成員',
            }
          : m
      );
      onUpdateMembers(updated);
      // 若剛好是當前成員，同步更新
      if (currentMember.id === editingMemberId) {
        const refreshed = updated.find((m) => m.id === editingMemberId);
        if (refreshed) onSelectCurrentMember(refreshed);
      }
      setEditingMemberId(null);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (members.length <= 1) {
      alert('至少需保留一位家庭成員！');
      return;
    }
    const target = members.find((m) => m.id === memberId);
    if (!confirm(`確定要將「${target?.name}」從家庭成員名單中移除嗎？`)) return;

    const remaining = members.filter((m) => m.id !== memberId);
    onUpdateMembers(remaining);

    // 若刪除的是當前操作者，切換至第一位
    if (currentMember.id === memberId) {
      onSelectCurrentMember(remaining[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-[1300] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal 頂部 */}
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">家庭人員與角色自訂管理</h3>
              <p className="text-xs text-blue-100">
                自由新增、編輯家庭成員稱謂、專屬頭像、職責與顏色
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal 主體 */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 新增/編輯 表單區 */}
          {(isAddingNew || editingMemberId) && (
            <form
              onSubmit={handleSaveMember}
              className="p-5 rounded-2xl border-2 border-blue-500 bg-blue-50/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  {isAddingNew ? '✨ 新增家庭成員' : '✏️ 編輯成員資訊與角色'}
                </span>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  取消
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    成員稱呼 / 姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="例：二姐 (雅婷)、爺爺、皮皮 (毛孩)"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    身分簡稱標籤 (2~4字)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="例：導遊、總務、攝影"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 自訂角色職稱 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  自訂角色職稱與分工 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formRoleTitle}
                  onChange={(e) => setFormRoleTitle(e.target.value)}
                  placeholder="例：首席駕駛 & 行程總召、行李收納大師..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* 快速填寫標籤 */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500 font-semibold self-center">
                    快速套用:
                  </span>
                  {PRESET_ROLES.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormRoleTitle(r)}
                      className="text-[11px] bg-white border border-slate-200 hover:border-blue-400 text-slate-600 px-2 py-0.5 rounded-lg transition"
                    >
                      {r.split('&')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 選擇頭像 Emoji */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  選擇專屬頭像 (目前: <span className="text-base">{formAvatar}</span>)
                </label>
                <div className="flex flex-wrap gap-2 p-2.5 bg-white border border-slate-200 rounded-xl max-h-28 overflow-y-auto">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormAvatar(av)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition ${
                        formAvatar === av
                          ? 'bg-blue-100 ring-2 ring-blue-600 scale-110 shadow-xs'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* 代表色彩 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-blue-600" />
                  個人專屬代表色
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        formColor === c ? 'scale-125 ring-2 ring-offset-2 ring-blue-600' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-blue-200">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition"
                >
                  {isAddingNew ? '確認新增' : '儲存變更'}
                </button>
              </div>
            </form>
          )}

          {/* 成員列表 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                家庭現有成員 ({members.length} 位)
              </span>
              {!isAddingNew && !editingMemberId && (
                <button
                  onClick={startAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  自訂新增成員
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {members.map((m) => {
                const isCurrent = m.id === currentMember.id;

                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-xs border-2 border-white shrink-0"
                        style={{ backgroundColor: `${m.color}25` }}
                      >
                        {m.avatar}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 truncate">
                            {m.name}
                          </span>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                            style={{ backgroundColor: m.color }}
                          >
                            {m.badge || '成員'}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                              目前身分
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {m.roleTitle}
                        </p>
                      </div>
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isCurrent && (
                        <button
                          onClick={() => onSelectCurrentMember(m)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition"
                        >
                          切換至此身分
                        </button>
                      )}
                      <button
                        onClick={() => startEdit(m)}
                        title="編輯此成員"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {members.length > 1 && (
                        <button
                          onClick={() => handleDeleteMember(m.id)}
                          title="移除成員"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal 底部 */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow transition"
          >
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
};
