import React, { useState } from 'react';
import { Trip, FamilyMember } from '../types';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Archive,
  Bell,
  Plus,
  ChevronDown,
  Sparkles,
  Zap,
  Share2,
  UserCog,
  KeyRound,
  UserPlus,
} from 'lucide-react';

interface NavbarProps {
  trips: Trip[];
  activeTrip: Trip;
  onSelectTrip: (tripId: string) => void;
  onOpenNewTripModal: () => void;
  activeTab: 'itinerary' | 'map' | 'meeting' | 'budget' | 'history';
  onSelectTab: (tab: 'itinerary' | 'map' | 'meeting' | 'budget' | 'history') => void;
  currentMember: FamilyMember;
  onSelectMember: (member: FamilyMember) => void;
  members: FamilyMember[];
  unreadNotifsCount: number;
  onOpenNotificationDrawer: () => void;
  onSimulateMemberChange: () => void;
  onOpenMemberManageModal: () => void;
  onOpenShareInviteModal: () => void;
  onOpenJoinCodeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  trips,
  activeTrip,
  onSelectTrip,
  onOpenNewTripModal,
  activeTab,
  onSelectTab,
  currentMember,
  onSelectMember,
  members,
  unreadNotifsCount,
  onOpenNotificationDrawer,
  onSimulateMemberChange,
  onOpenMemberManageModal,
  onOpenShareInviteModal,
  onOpenJoinCodeModal,
}) => {
  const [showMemberMenu, setShowMemberMenu] = useState(false);
  const [showTripMenu, setShowTripMenu] = useState(false);

  return (
    <header className="sticky top-0 z-[1100] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* 上層：品牌、行程切換、邀請家人、角色自訂與通知 */}
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo & 標題 */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 text-lg sm:text-xl font-bold">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-slate-900 text-sm sm:text-lg tracking-tight">
                  家聚遊記
                </h1>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded-md hidden xs:inline">
                  家庭共編
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block">
                家庭會議 · 專屬連結加入 · 角色自訂
              </p>
            </div>
          </div>

          {/* 中間：當前旅程下拉選擇 */}
          <div className="relative">
            <button
              onClick={() => setShowTripMenu(!showTripMenu)}
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 hover:bg-slate-200/80 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 transition max-w-[130px] sm:max-w-xs truncate"
            >
              <span className="truncate">{activeTrip.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>

            {showTripMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTripMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase">
                    選擇家庭旅程專案
                  </div>
                  {trips.map((trip) => (
                    <button
                      key={trip.id}
                      onClick={() => {
                        onSelectTrip(trip.id);
                        setShowTripMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                        trip.id === activeTrip.id
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate font-semibold">{trip.title}</div>
                        <div className="text-[10px] text-slate-400">{trip.destination}</div>
                      </div>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 shrink-0">
                        {trip.status === 'completed' ? '歷史' : '進行中'}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowTripMenu(false);
                        onOpenNewTripModal();
                      }}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-1.5 rounded-xl flex items-center justify-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      建立新旅程
                    </button>
                    <button
                      onClick={() => {
                        setShowTripMenu(false);
                        onOpenJoinCodeModal();
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-1.5 rounded-xl flex items-center justify-center gap-1 transition"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                      輸入邀請碼加入
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 右側：邀請家人加入、角色管理、成員身分切換與通知 */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* 🔗 邀請家人加入連結按鈕 */}
            <button
              onClick={onOpenShareInviteModal}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="僅限擁有連結的使用者才能加入"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-100" />
              <span className="hidden sm:inline">邀請家人加入</span>
              <span className="sm:hidden">邀請</span>
            </button>

            {/* 👨‍👩‍👧‍👦 成員與角色管理按鈕 */}
            <button
              onClick={onOpenMemberManageModal}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1"
              title="自訂家庭人員名稱、角色分工與頭像"
            >
              <UserCog className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">自訂角色</span>
            </button>

            {/* 成員身分切換器 */}
            <div className="relative">
              <button
                onClick={() => setShowMemberMenu(!showMemberMenu)}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-1.5 sm:px-2.5 sm:py-1 rounded-2xl transition shadow-xs"
              >
                <span className="text-xl leading-none">{currentMember.avatar}</span>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentMember.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {currentMember.badge}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showMemberMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMemberMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                      <span>切換目前編輯成員</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-500">
                        {members.length} 位
                      </span>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      {members.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => {
                            onSelectMember(member);
                            setShowMemberMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition ${
                            member.id === currentMember.id
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'text-slate-700'
                          }`}
                        >
                          <span className="text-xl">{member.avatar}</span>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold truncate">{member.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{member.roleTitle}</div>
                          </div>
                          {member.id === currentMember.id && (
                            <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded shrink-0">
                              目前
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 mt-1 pt-1.5 px-2">
                      <button
                        onClick={() => {
                          setShowMemberMenu(false);
                          onOpenMemberManageModal();
                        }}
                        className="w-full text-xs font-bold text-blue-600 hover:bg-blue-50 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>自訂 / 新增成員與角色...</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 模擬成員更動 (小型圖示) */}
            <button
              onClick={onSimulateMemberChange}
              title="模擬其他成員更新行程，觸發提醒通知"
              className="p-1.5 text-amber-700 hover:bg-amber-100 bg-amber-50 rounded-xl transition border border-amber-200"
            >
              <Zap className="w-4 h-4 fill-amber-500" />
            </button>

            {/* 通知中心鈴鐺 */}
            <button
              onClick={onOpenNotificationDrawer}
              className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition"
              title="行程變更提醒中心"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 下層：功能標籤分頁 Tab 列 */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          <button
            onClick={() => onSelectTab('itinerary')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'itinerary'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>每日行程規劃</span>
          </button>

          <button
            onClick={() => onSelectTab('map')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>地圖標記與路線</span>
          </button>

          <button
            onClick={() => onSelectTab('meeting')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'meeting'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>家庭會議與表決</span>
          </button>

          <button
            onClick={() => onSelectTab('budget')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'budget'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>預算與行李清單</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'history'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>日後查看歷史行程</span>
          </button>
        </div>
      </div>
    </header>
  );
};
