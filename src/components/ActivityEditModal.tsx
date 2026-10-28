import React, { useState, useEffect, useRef } from 'react';
import { Activity, ActivityCategory, FamilyMember } from '../types';
import { CATEGORY_CONFIG, getGoogleMapsUrl } from '../utils/helpers';
import { POPULAR_LOCATIONS } from '../data/initialData';
import { TAIWAN_PLACES, searchLocalPlaces, searchOnlineGeocoding, LocationItem } from '../data/taiwanAttractions';
import {
  MapPin,
  Clock,
  DollarSign,
  User,
  FileText,
  Sparkles,
  X,
  Search,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from 'lucide-react';

interface ActivityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Partial<Activity> | null;
  dayNumber: number;
  members: FamilyMember[];
  currentMember: FamilyMember;
  onSave: (activityData: Activity, dayNumber: number, changeDescription: string) => void;
}

export const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  isOpen,
  onClose,
  activity,
  dayNumber,
  members,
  currentMember,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [category, setCategory] = useState<ActivityCategory>('attraction');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [cost, setCost] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [assignedMemberId, setAssignedMemberId] = useState('');
  const [changeReason, setChangeReason] = useState('');

  // 地圖自動建議與搜尋 State
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [autoFilledSuccess, setAutoFilledSuccess] = useState(false);

  const suggestionBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title || '');
      setTime(activity.time || '09:00');
      setEndTime(activity.endTime || '10:30');
      setCategory(activity.category || 'attraction');
      setLocationName(activity.locationName || '');
      setAddress(activity.address || '');
      setLat(activity.lat);
      setLng(activity.lng);
      setCost(activity.cost || 0);
      setNotes(activity.notes || '');
      setAssignedMemberId(activity.assignedMemberId || currentMember.id);
      setChangeReason('');
      setAutoFilledSuccess(Boolean(activity.address));
    } else {
      setTitle('');
      setTime('09:00');
      setEndTime('10:30');
      setCategory('attraction');
      setLocationName('');
      setAddress('');
      setLat(undefined);
      setLng(undefined);
      setCost(0);
      setNotes('');
      setAssignedMemberId(currentMember.id);
      setChangeReason('');
      setAutoFilledSuccess(false);
    }
    setSuggestions([]);
    setShowSuggestions(false);
  }, [activity, currentMember.id]);

  // 當使用者在景點名稱輸入文字時，即時搜尋並提供自動補齊
  const handleLocationNameChange = (val: string) => {
    setLocationName(val);
    if (!title) {
      setTitle(val);
    }

    if (val.trim().length >= 1) {
      const localMatches = searchLocalPlaces(val);
      if (localMatches.length > 0) {
        setSuggestions(localMatches.slice(0, 6));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 點選自動建議項目，自動帶入所有地圖資訊
  const handleSelectLocationItem = (item: LocationItem) => {
    setLocationName(item.name);
    if (!title || title === locationName) {
      setTitle(item.name);
    }
    setAddress(item.address);
    setLat(item.lat);
    setLng(item.lng);
    setCategory(item.category);
    setShowSuggestions(false);
    setAutoFilledSuccess(true);
  };

  // 主動點擊「從地圖查詢並自動帶入地址」
  const handleAutoSearchAddress = async () => {
    const query = (locationName || title).trim();
    if (!query) {
      alert('請先輸入景點或商家名稱！');
      return;
    }

    setIsSearchingMap(true);
    setAutoFilledSuccess(false);

    try {
      // 1. 先檢索本地高精準度景點庫
      const localMatches = searchLocalPlaces(query);
      if (localMatches.length > 0) {
        const best = localMatches[0];
        handleSelectLocationItem(best);
        setIsSearchingMap(false);
        return;
      }

      // 2. 檢索線上地理編碼
      const onlineResults = await searchOnlineGeocoding(query);
      if (onlineResults.length > 0) {
        const best = onlineResults[0];
        setAddress(best.address);
        setLat(best.lat);
        setLng(best.lng);
        setCategory(best.category);
        setAutoFilledSuccess(true);
      } else {
        // 如果都找不到，嘗試以地點名稱作為地址基底
        setAddress(`台灣 ${query}`);
        setAutoFilledSuccess(true);
      }
    } catch (e) {
      console.error(e);
      setAddress(`台灣 ${query}`);
    } finally {
      setIsSearchingMap(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = Boolean(activity?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim()) {
      alert('請填寫活動名稱與地點！');
      return;
    }

    const updatedActivity: Activity = {
      id: activity?.id || `act-${Date.now()}`,
      title: title.trim(),
      time,
      endTime,
      category,
      locationName: locationName.trim(),
      address: address.trim() || undefined,
      lat: lat !== undefined ? Number(lat) : undefined,
      lng: lng !== undefined ? Number(lng) : undefined,
      cost: Number(cost) || 0,
      notes: notes.trim() || undefined,
      assignedMemberId: assignedMemberId || undefined,
      votes: activity?.votes || { [currentMember.id]: 'yes' },
      lastEditedBy: {
        memberId: currentMember.id,
        memberName: currentMember.name,
        action: changeReason || (isEditing ? '更新行程內容與時間' : '新增全新行程景點'),
        timestamp: new Date().toLocaleString('zh-TW', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      },
      isHighlight: activity?.isHighlight ?? false,
    };

    const desc = changeReason || (isEditing ? `將「${title}」時間設定為 ${time}` : `新增景點「${title}」至第 ${dayNumber} 天`);
    onSave(updatedActivity, dayNumber, desc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1300] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/20 rounded-lg text-lg">
              {isEditing ? '✏️' : '✨'}
            </span>
            <div>
              <h3 className="font-bold text-base">
                {isEditing ? '編輯行程規劃項目' : '新增旅遊景點規劃'} (第 {dayNumber} 天)
              </h3>
              <p className="text-xs text-blue-100">
                目前編輯者：<span className="font-semibold underline">{currentMember.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* 地點 / 商家名稱 (自動聯想 + 地圖帶入地址核心) */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                旅遊景點 / 商家名稱 <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAutoSearchAddress}
                disabled={isSearchingMap}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-lg border border-blue-200 flex items-center gap-1 transition"
              >
                {isSearchingMap ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                    <span>查詢地圖中...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3 h-3 text-blue-600" />
                    <span>從地圖帶入地址</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => handleLocationNameChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                onFocus={() => {
                  if (locationName.trim().length >= 1) {
                    const matches = searchLocalPlaces(locationName);
                    if (matches.length > 0) {
                      setSuggestions(matches.slice(0, 6));
                      setShowSuggestions(true);
                    }
                  }
                }}
                placeholder="輸入景點名稱 (例：遠雄海洋公園、太魯閣、伯朗大道、七星潭...)"
                className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 shadow-xs"
              />
              <button
                type="button"
                onClick={handleAutoSearchAddress}
                title="自動搜尋 Google 地圖地址"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-1"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* 即時自動聯想下拉選單 */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionBoxRef}
                className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95"
              >
                <div className="p-2 bg-blue-50/70 text-[11px] font-bold text-blue-900 flex items-center justify-between">
                  <span>📍 點選自動從地圖帶入地址與座標：</span>
                  <span className="text-[10px] text-blue-600">共 {suggestions.length} 筆</span>
                </div>
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onMouseDown={() => handleSelectLocationItem(item)}
                    className="p-3 hover:bg-blue-50/60 cursor-pointer transition flex items-start justify-between gap-3"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded shrink-0">
                          {CATEGORY_CONFIG[item.category]?.label || '景點'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        {item.address}
                      </p>
                    </div>
                    <span className="text-[11px] text-blue-600 font-bold shrink-0 self-center bg-blue-50 px-2 py-1 rounded-lg">
                      帶入 ➔
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 自動帶入的景點詳細地址 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                景點詳細地址
                {autoFilledSuccess && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3 h-3" /> 已自動從地圖帶入
                  </span>
                )}
              </label>
              {locationName && (
                <a
                  href={getGoogleMapsUrl(locationName, lat, lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5 font-semibold"
                >
                  在 Google 地圖檢視 <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setAutoFilledSuccess(false);
              }}
              placeholder="輸入景點後自動帶入地址，或手動調整..."
              className={`w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                autoFilledSuccess
                  ? 'border-emerald-300 bg-emerald-50/30 text-emerald-950 font-medium'
                  : 'border-slate-300 bg-white text-slate-700'
              }`}
            />
          </div>

          {/* 活動名稱 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              行程活動名稱 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：遠雄海洋公園觀看海豚秀"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 時間與結束時間 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> 開始時間
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> 預估結束時間
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 活動類別 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              活動類別
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as ActivityCategory[]).map((cat) => {
                const conf = CATEGORY_CONFIG[cat];
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-2 text-xs rounded-xl border flex items-center justify-center gap-1.5 font-medium transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{conf.icon}</span>
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 地圖經緯度座標 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> 地圖經緯度座標 (輸入景點後自動填入)
              </span>
              {lat && lng && (
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  已標記於互動地圖 ({lat}, {lng})
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-500 block">緯度 Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat ?? ''}
                  onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="自動填入或手動輸入"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">經度 Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng ?? ''}
                  onChange={(e) => setLng(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="自動填入或手動輸入"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 費用預估與負責成員 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> 預估費用 (新台幣 TWD)
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                placeholder="0"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-purple-600" /> 負責 / 帶隊成員
              </label>
              <select
                value={assignedMemberId}
                onChange={(e) => setAssignedMemberId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.avatar} {m.name} ({m.badge})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 備忘與提醒事項 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" /> 備忘與貼心提醒
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例：先買好門票、帶孩子換洗衣物、預約導覽..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 異動原因（觸發全家推播提醒） */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <label className="block text-xs font-bold text-amber-900 mb-1">
              📢 異動說明 (會推播發送通知提醒全體成員)
            </label>
            <input
              type="text"
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="例：更新遠雄海洋公園地址與入園時間"
              className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>{isEditing ? '儲存並通知全家' : '新增並同步規劃'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
