import React, { useState, useEffect } from 'react';
import { Trip, FamilyMember, TripNotification, Activity, MeetingAgendaItem, MeetingRecord, PackingItem } from './types';
import { INITIAL_MEMBERS, INITIAL_TRIPS, INITIAL_NOTIFICATIONS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { ItineraryView } from './components/ItineraryView';
import { MapPlanner } from './components/MapPlanner';
import { MeetingView } from './components/MeetingView';
import { BudgetAndPacking } from './components/BudgetAndPacking';
import { HistoryArchiveView } from './components/HistoryArchiveView';
import { ActivityEditModal } from './components/ActivityEditModal';
import { NewTripModal } from './components/NewTripModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ToastNotification } from './components/ToastNotification';
import { MemberManagementModal } from './components/MemberManagementModal';
import { ShareInviteModal } from './components/ShareInviteModal';
import { JoinInviteModal } from './components/JoinInviteModal';
import { Download, RefreshCw, KeyRound, Share2, Users } from 'lucide-react';

const STORAGE_KEY_TRIPS = 'family_trips_data_v2';
const STORAGE_KEY_NOTIFS = 'family_trips_notifs_v2';
const STORAGE_KEY_MEMBERS = 'family_trips_members_v2';
const STORAGE_KEY_CURRENT_MEMBER = 'family_trips_current_member_v2';
const STORAGE_KEY_JOINED_TRIPS = 'family_trips_joined_codes_v2';

export default function App() {
  // 從 LocalStorage 載入 Trips
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRIPS);
      return saved ? JSON.parse(saved) : INITIAL_TRIPS;
    } catch {
      return INITIAL_TRIPS;
    }
  });

  // 從 LocalStorage 載入家庭成員清單（支援完全自訂）
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEMBERS);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  // 當前使用者身分
  const [currentMember, setCurrentMember] = useState<FamilyMember>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_CURRENT_MEMBER);
      if (savedId) {
        const found = members.find((m) => m.id === savedId);
        if (found) return found;
      }
      return members[0] || INITIAL_MEMBERS[0];
    } catch {
      return members[0] || INITIAL_MEMBERS[0];
    }
  });

  // 通知紀錄
  const [notifications, setNotifications] = useState<TripNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // 當前選取的旅程
  const [activeTripId, setActiveTripId] = useState<string>(() => {
    return trips[0]?.id || 'trip-1';
  });

  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'meeting' | 'budget' | 'history'>('itinerary');
  const [activeDay, setActiveDay] = useState<number>(1);
  const [mapSelectedDay, setMapSelectedDay] = useState<number | 'all'>('all');
  const [highlightedActivityId, setHighlightedActivityId] = useState<string | null>(null);

  // 模態視窗 State
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Partial<Activity> | null>(null);
  const [editingDayNumber, setEditingDayNumber] = useState<number>(1);
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<TripNotification | null>(null);

  // 自訂成員管理 Modal & 邀請分享 Modal & 連結加入 Modal
  const [isMemberManageModalOpen, setIsMemberManageModalOpen] = useState(false);
  const [isShareInviteModalOpen, setIsShareInviteModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [urlInviteCode, setUrlInviteCode] = useState<string>('');

  // 檢查 URL 中的邀請碼 (invite link)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const invite = urlParams.get('invite');
      const tripId = urlParams.get('tripId');

      if (invite) {
        setUrlInviteCode(invite);
        // 如果帶有特定 tripId 或 invite 符合某旅程，切換至該旅程
        const matched = trips.find(
          (t) => t.id === tripId || t.inviteCode?.toUpperCase() === invite.toUpperCase()
        );
        if (matched) {
          setActiveTripId(matched.id);
        }

        // 檢查是否已加入過此旅程
        const joinedListStr = localStorage.getItem(STORAGE_KEY_JOINED_TRIPS);
        const joinedList: string[] = joinedListStr ? JSON.parse(joinedListStr) : [];
        const targetTripId = matched?.id || activeTripId;

        // 若尚未加入，彈出加入對話框自訂身分
        if (!joinedList.includes(targetTripId)) {
          setIsJoinModalOpen(true);
        }
      }
    } catch (e) {
      console.error('URL 解析邀請碼失敗:', e);
    }
  }, [trips, activeTripId]);

  // 本地儲存同步
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
    } catch (e) {
      console.error('儲存 trips 失敗:', e);
    }
  }, [trips]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error('儲存 members 失敗:', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      if (currentMember?.id) {
        localStorage.setItem(STORAGE_KEY_CURRENT_MEMBER, currentMember.id);
      }
    } catch (e) {
      console.error('儲存 currentMember 失敗:', e);
    }
  }, [currentMember]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.error('儲存 notifs 失敗:', e);
    }
  }, [notifications]);

  // 當前選中的 Trip
  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  // 新增通知輔助函式
  const pushNotification = (
    actionType: TripNotification['actionType'],
    title: string,
    message: string,
    activityId?: string
  ) => {
    const newNotif: TripNotification = {
      id: `notif-${Date.now()}`,
      tripId: activeTrip.id,
      tripTitle: activeTrip.title,
      memberId: currentMember.id,
      memberName: currentMember.name,
      actionType,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      activityId,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setToastNotification(newNotif);

    setTimeout(() => {
      setToastNotification((curr) => (curr?.id === newNotif.id ? null : curr));
    }, 6000);
  };

  // 儲存成員更新
  const handleUpdateMembers = (newMembers: FamilyMember[]) => {
    setMembers(newMembers);
    pushNotification(
      'edit',
      '家庭成員名單更新',
      `${currentMember.name} 更新了家庭成員名單與角色分工！`
    );
  };

  // 新成員透過專屬連結加入
  const handleJoinSuccess = (newMember: FamilyMember) => {
    // 加入成員清單
    setMembers((prev) => [...prev, newMember]);
    setCurrentMember(newMember);

    // 標記已加入此旅程
    try {
      const joinedListStr = localStorage.getItem(STORAGE_KEY_JOINED_TRIPS);
      const joinedList: string[] = joinedListStr ? JSON.parse(joinedListStr) : [];
      if (!joinedList.includes(activeTrip.id)) {
        joinedList.push(activeTrip.id);
        localStorage.setItem(STORAGE_KEY_JOINED_TRIPS, JSON.stringify(joinedList));
      }
    } catch (e) {
      console.error(e);
    }

    setIsJoinModalOpen(false);

    // 清理 URL 的 ?invite 參數，保持畫面整潔
    if (window.history.replaceState) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // 發送廣播通知
    pushNotification(
      'add',
      `新成員加入！🎉`,
      `歡迎 ${newMember.name} (${newMember.roleTitle}) 透過專屬連結加入「${activeTrip.title}」！`
    );
  };

  // 重設旅程邀請碼
  const handleRegenerateInviteCode = (newCode: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === activeTrip.id ? { ...t, inviteCode: newCode } : t))
    );
    pushNotification(
      'edit',
      '旅程邀請碼已重設',
      `${currentMember.name} 重新產生了專屬家庭邀請碼：${newCode}`
    );
  };

  // 儲存/更新行程活動
  const handleSaveActivity = (activityData: Activity, dayNumber: number, changeDescription: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTrip.id) return trip;

        const updatedDays = trip.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;

          const exists = day.activities.some((a) => a.id === activityData.id);
          let newActivities = exists
            ? day.activities.map((a) => (a.id === activityData.id ? activityData : a))
            : [...day.activities, activityData];

          newActivities.sort((a, b) => a.time.localeCompare(b.time));

          return { ...day, activities: newActivities };
        });

        return { ...trip, days: updatedDays, updatedAt: new Date().toISOString().split('T')[0] };
      })
    );

    const isEditing = editingActivity?.id;
    pushNotification(
      isEditing ? 'time' : 'add',
      isEditing ? `行程變更：${activityData.title}` : `新增景點：${activityData.title}`,
      changeDescription,
      activityData.id
    );
  };

  // 刪除行程活動
  const handleDeleteActivity = (activityId: string, dayNumber: number) => {
    const day = activeTrip.days.find((d) => d.dayNumber === dayNumber);
    const act = day?.activities.find((a) => a.id === activityId);
    const title = act?.title || '某項行程';

    if (!confirm(`確定要刪除「${title}」嗎？這項變更會通知所有家庭成員。`)) return;

    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTrip.id) return trip;
        const updatedDays = trip.days.map((d) => {
          if (d.dayNumber !== dayNumber) return d;
          return { ...d, activities: d.activities.filter((a) => a.id !== activityId) };
        });
        return { ...trip, days: updatedDays };
      })
    );

    pushNotification(
      'delete',
      `行程移除：${title}`,
      `${currentMember.name} 從第 ${dayNumber} 天移除了「${title}」`
    );
  };

  // 活動排序調整
  const handleMoveActivity = (dayNumber: number, index: number, direction: 'up' | 'down') => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTrip.id) return trip;
        const updatedDays = trip.days.map((d) => {
          if (d.dayNumber !== dayNumber) return d;
          const acts = [...d.activities];
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= acts.length) return d;
          const temp = acts[index];
          acts[index] = acts[targetIndex];
          acts[targetIndex] = temp;
          return { ...d, activities: acts };
        });
        return { ...trip, days: updatedDays };
      })
    );
  };

  // 活動投票
  const handleVoteActivity = (activityId: string, dayNumber: number, vote: 'yes' | 'maybe' | 'no') => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTrip.id) return trip;
        const updatedDays = trip.days.map((d) => {
          if (d.dayNumber !== dayNumber) return d;
          const acts = d.activities.map((a) => {
            if (a.id !== activityId) return a;
            return {
              ...a,
              votes: { ...(a.votes || {}), [currentMember.id]: vote },
            };
          });
          return { ...d, activities: acts };
        });
        return { ...trip, days: updatedDays };
      })
    );
  };

  // 從地圖點選快速新增景點
  const handleQuickAddLocation = (lat: number, lng: number, dayNumber: number) => {
    setEditingActivity({
      lat,
      lng,
      locationName: `自訂標記點 (${lat}, ${lng})`,
      category: 'attraction',
    });
    setEditingDayNumber(dayNumber);
    setIsActivityModalOpen(true);
  };

  // 聚焦至地圖
  const handleFocusMapLocation = (activityId: string) => {
    setHighlightedActivityId(activityId);
    setActiveTab('map');
  };

  // 加一天
  const handleAddDay = () => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTrip.id) return trip;
        const newDayNum = trip.days.length + 1;
        const lastDate = new Date(trip.days[trip.days.length - 1]?.date || trip.startDate);
        lastDate.setDate(lastDate.getDate() + 1);
        const dateStr = lastDate.toISOString().split('T')[0];

        const newDay = {
          dayNumber: newDayNum,
          date: dateStr,
          theme: `第 ${newDayNum} 天行程規劃`,
          activities: [],
        };

        return { ...trip, days: [...trip.days, newDay], endDate: dateStr };
      })
    );

    setActiveDay(activeTrip.days.length + 1);
    pushNotification('add', `行程天數增加`, `${currentMember.name} 為旅程增加了第 ${activeTrip.days.length + 1} 天！`);
  };

  // 更新會議議題
  const handleUpdateAgendas = (agendas: MeetingAgendaItem[]) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => (trip.id === activeTrip.id ? { ...trip, agendas } : trip))
    );
    pushNotification('vote', `新增會議投票議題`, `${currentMember.name} 發起了一項家庭表決議題`);
  };

  // 投票議題
  const handleVoteAgenda = (agendaId: string, optionId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTrip.id) return trip;
        const updatedAgendas = trip.agendas.map((ag) => {
          if (ag.id !== agendaId) return ag;
          const updatedOptions = ag.options?.map((opt) => {
            const votes = opt.votes.filter((id) => id !== currentMember.id);
            if (opt.id === optionId) {
              votes.push(currentMember.id);
            }
            return { ...opt, votes };
          });
          return { ...ag, options: updatedOptions };
        });
        return { ...trip, agendas: updatedAgendas };
      })
    );
  };

  // 拍板結案議題
  const handleCloseAgenda = (agendaId: string, winningText: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTrip.id) return trip;
        const updatedAgendas = trip.agendas.map((ag) =>
          ag.id === agendaId ? { ...ag, status: 'decided' as const, decision: winningText } : ag
        );
        return { ...trip, agendas: updatedAgendas };
      })
    );
    pushNotification('meeting', `議題表決拍板！`, `全家共識已定案：「${winningText}」`);
  };

  // 新增會議紀錄
  const handleAddMeetingRecord = (record: MeetingRecord) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === activeTrip.id
          ? { ...trip, meetingRecords: [record, ...(trip.meetingRecords || [])] }
          : trip
      )
    );
    pushNotification('meeting', `新會議紀錄發布`, `${currentMember.name} 記錄了「${record.title}」之結論`);
  };

  // 切換會議待辦項目
  const handleToggleActionItem = (recordId: string, actionId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== activeTrip.id) return trip;
        const updatedRecords = trip.meetingRecords.map((r) => {
          if (r.id !== recordId) return r;
          const acts = r.actionItems.map((a) => (a.id === actionId ? { ...a, done: !a.done } : a));
          return { ...r, actionItems: acts };
        });
        return { ...trip, meetingRecords: updatedRecords };
      })
    );
  };

  // 預算與行李清單更新
  const handleUpdateBudget = (budget: Trip['budget']) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => (trip.id === activeTrip.id ? { ...trip, budget } : trip))
    );
  };

  const handleUpdatePackingList = (packingList: PackingItem[]) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => (trip.id === activeTrip.id ? { ...trip, packingList } : trip))
    );
  };

  // 複製歷史行程為新旅程
  const handleCloneTripAsNew = (sourceTrip: Trip) => {
    const cloned: Trip = {
      ...sourceTrip,
      id: `trip-${Date.now()}`,
      title: `${sourceTrip.title} (全新復刻版)`,
      status: 'planning',
      inviteCode: `FT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      startDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setTrips((prev) => [cloned, ...prev]);
    setActiveTripId(cloned.id);
    setActiveTab('itinerary');
    alert(`🎉 已將「${sourceTrip.title}」複製為新旅程！您可以開始自由編輯。`);
  };

  // 模擬成員異動提醒
  const handleSimulateMemberChange = () => {
    const randomMember = members.find((m) => m.id !== currentMember.id) || members[0];
    const simulationPool = [
      {
        title: '微調 Day 2 出發集合時間',
        msg: `${randomMember.name} 將出發時間調整為 08:30，以避開排隊車潮！`,
        type: 'time' as const,
      },
      {
        title: '新增私房排隊美食景點',
        msg: `${randomMember.name} 推薦加排在地老牌扁食與知名烤玉米！`,
        type: 'add' as const,
      },
      {
        title: '發起晚餐餐廳意願表決',
        msg: `${randomMember.name} 發起投票：在地原民風味烤雞 vs 飯店百匯！`,
        type: 'vote' as const,
      },
    ];

    const pick = simulationPool[Math.floor(Math.random() * simulationPool.length)];
    const simNotif: TripNotification = {
      id: `notif-sim-${Date.now()}`,
      tripId: activeTrip.id,
      tripTitle: activeTrip.title,
      memberId: randomMember.id,
      memberName: randomMember.name,
      actionType: pick.type,
      title: pick.title,
      message: pick.msg,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setNotifications((prev) => [simNotif, ...prev]);
    setToastNotification(simNotif);
    setTimeout(() => {
      setToastNotification((curr) => (curr?.id === simNotif.id ? null : curr));
    }, 6000);
  };

  // 匯出資料
  const handleExportData = () => {
    const backupData = {
      trips,
      members,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `家庭旅遊會議紀錄備份_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 還原資料
  const handleResetData = () => {
    if (confirm('確定要還原為示範範本資料嗎？本地自訂資料將會被重設。')) {
      localStorage.removeItem(STORAGE_KEY_TRIPS);
      localStorage.removeItem(STORAGE_KEY_NOTIFS);
      localStorage.removeItem(STORAGE_KEY_MEMBERS);
      localStorage.removeItem(STORAGE_KEY_CURRENT_MEMBER);
      localStorage.removeItem(STORAGE_KEY_JOINED_TRIPS);
      setTrips(INITIAL_TRIPS);
      setMembers(INITIAL_MEMBERS);
      setCurrentMember(INITIAL_MEMBERS[0]);
      setNotifications(INITIAL_NOTIFICATIONS);
      setActiveTripId(INITIAL_TRIPS[0].id);
      alert('已恢復初始示範行程與家庭成員！');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* 頂部導覽列 */}
      <Navbar
        trips={trips}
        activeTrip={activeTrip}
        onSelectTrip={(id) => {
          setActiveTripId(id);
          setActiveDay(1);
        }}
        onOpenNewTripModal={() => setIsNewTripModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentMember={currentMember}
        onSelectMember={setCurrentMember}
        members={members}
        unreadNotifsCount={unreadCount}
        onOpenNotificationDrawer={() => setIsNotificationDrawerOpen(true)}
        onSimulateMemberChange={handleSimulateMemberChange}
        onOpenMemberManageModal={() => setIsMemberManageModalOpen(true)}
        onOpenShareInviteModal={() => setIsShareInviteModalOpen(true)}
        onOpenJoinCodeModal={() => {
          setUrlInviteCode('');
          setIsJoinModalOpen(true);
        }}
      />

      {/* 主工作區 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        {/* 頂部快速操作提示列 */}
        <div className="mb-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent p-3 rounded-2xl border border-blue-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <span>👨‍👩‍👧‍👦 目前操作成員：</span>
              <span className="text-sm">{currentMember.avatar}</span>
              <span className="underline decoration-blue-500 font-extrabold">{currentMember.name}</span>
              <span className="text-slate-500 font-normal">({currentMember.roleTitle})</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMemberManageModalOpen(true)}
              className="text-blue-700 hover:text-blue-900 font-bold hover:underline flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" />
              自訂角色與名單
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setIsShareInviteModalOpen(true)}
              className="text-indigo-700 hover:text-indigo-900 font-bold hover:underline flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              邀請專屬連結
            </button>
          </div>
        </div>

        {activeTab === 'itinerary' && (
          <ItineraryView
            trip={activeTrip}
            currentMember={currentMember}
            members={members}
            activeDay={activeDay}
            onSelectDay={setActiveDay}
            onAddActivity={(dayNum) => {
              setEditingActivity(null);
              setEditingDayNumber(dayNum);
              setIsActivityModalOpen(true);
            }}
            onEditActivity={(act, dayNum) => {
              setEditingActivity(act);
              setEditingDayNumber(dayNum);
              setIsActivityModalOpen(true);
            }}
            onDeleteActivity={handleDeleteActivity}
            onMoveActivity={handleMoveActivity}
            onVoteActivity={handleVoteActivity}
            onFocusMapLocation={handleFocusMapLocation}
            onAddDay={handleAddDay}
          />
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  🗺️ 互動地圖標記與路線導航
                </h2>
                <p className="text-xs text-slate-500">
                  標記各天景點與位置，點選地圖任意處可直接新增景點！
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingActivity(null);
                  setEditingDayNumber(mapSelectedDay === 'all' ? 1 : mapSelectedDay);
                  setIsActivityModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
              >
                ＋ 新增地圖景點標記
              </button>
            </div>

            <MapPlanner
              trip={activeTrip}
              selectedDay={mapSelectedDay}
              onSelectDay={setMapSelectedDay}
              onEditActivity={(act, dayNum) => {
                setEditingActivity(act);
                setEditingDayNumber(dayNum);
                setIsActivityModalOpen(true);
              }}
              onQuickAddLocation={handleQuickAddLocation}
              highlightedActivityId={highlightedActivityId}
            />
          </div>
        )}

        {activeTab === 'meeting' && (
          <MeetingView
            trip={activeTrip}
            currentMember={currentMember}
            members={members}
            onUpdateAgendas={handleUpdateAgendas}
            onAddMeetingRecord={handleAddMeetingRecord}
            onToggleActionItem={handleToggleActionItem}
            onVoteAgenda={handleVoteAgenda}
            onCloseAgenda={handleCloseAgenda}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetAndPacking
            trip={activeTrip}
            currentMember={currentMember}
            members={members}
            onUpdateBudget={handleUpdateBudget}
            onUpdatePackingList={handleUpdatePackingList}
          />
        )}

        {activeTab === 'history' && (
          <HistoryArchiveView
            trips={trips}
            activeTripId={activeTripId}
            onSelectTrip={(id) => {
              setActiveTripId(id);
              setActiveTab('itinerary');
            }}
            onCloneTripAsNew={handleCloneTripAsNew}
            members={members}
          />
        )}
      </main>

      {/* 頁尾工具列 */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white/60 text-slate-500 text-xs text-center flex flex-wrap items-center justify-center gap-4 px-4">
        <span>🏡 家聚遊記 FamilyTrip Hub · 凝聚全家共識的旅行規劃神器</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsShareInviteModalOpen(true)}
            className="hover:text-blue-600 font-semibold flex items-center gap-1 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            邀請家人專屬連結
          </button>
          <span>·</span>
          <button
            onClick={handleExportData}
            className="hover:text-blue-600 font-semibold flex items-center gap-1 transition"
          >
            <Download className="w-3.5 h-3.5" />
            匯出備份 JSON
          </button>
          <span>·</span>
          <button
            onClick={handleResetData}
            className="hover:text-amber-600 font-semibold flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            還原範本資料
          </button>
        </div>
      </footer>

      {/* 編輯/新增景點活動 Modal */}
      <ActivityEditModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activity={editingActivity}
        dayNumber={editingDayNumber}
        members={members}
        currentMember={currentMember}
        onSave={handleSaveActivity}
      />

      {/* 建立新旅程 Modal */}
      <NewTripModal
        isOpen={isNewTripModalOpen}
        onClose={() => setIsNewTripModalOpen(false)}
        onCreateTrip={(newTrip) => {
          setTrips((prev) => [newTrip, ...prev]);
          setActiveTripId(newTrip.id);
          setActiveDay(1);
          setActiveTab('itinerary');
          pushNotification('add', `全新旅遊專案`, `${currentMember.name} 建立了「${newTrip.title}」！`);
        }}
      />

      {/* 家庭成員與自訂角色管理 Modal */}
      <MemberManagementModal
        isOpen={isMemberManageModalOpen}
        onClose={() => setIsMemberManageModalOpen(false)}
        members={members}
        currentMember={currentMember}
        onUpdateMembers={handleUpdateMembers}
        onSelectCurrentMember={setCurrentMember}
      />

      {/* 邀請家人加入連結分享 Modal */}
      <ShareInviteModal
        isOpen={isShareInviteModalOpen}
        onClose={() => setIsShareInviteModalOpen(false)}
        trip={activeTrip}
        onRegenerateCode={handleRegenerateInviteCode}
      />

      {/* 專屬連結加入與身分建立 Modal */}
      <JoinInviteModal
        isOpen={isJoinModalOpen}
        targetTrip={activeTrip}
        inviteCodeFromUrl={urlInviteCode}
        onJoinSuccess={handleJoinSuccess}
        onClose={() => setIsJoinModalOpen(false)}
      />

      {/* 行程異動提醒抽屜 */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        members={members}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        }}
        onSelectNotification={(n) => {
          setIsNotificationDrawerOpen(false);
          if (n.activityId) {
            handleFocusMapLocation(n.activityId);
          } else {
            setActiveTab('meeting');
          }
        }}
      />

      {/* 即時變更推播 Toast */}
      <ToastNotification
        notification={toastNotification}
        onClose={() => setToastNotification(null)}
        onClick={() => {
          if (toastNotification) {
            setIsNotificationDrawerOpen(true);
            setToastNotification(null);
          }
        }}
      />
    </div>
  );
}
