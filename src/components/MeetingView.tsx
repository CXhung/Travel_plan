import React, { useState, useEffect } from 'react';
import { Trip, FamilyMember, MeetingAgendaItem, MeetingRecord } from '../types';
import confetti from 'canvas-confetti';
import {
  Users,
  Vote,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckCircle2,
  ListTodo,
  FileText,
  Award,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface MeetingViewProps {
  trip: Trip;
  currentMember: FamilyMember;
  members: FamilyMember[];
  onUpdateAgendas: (agendas: MeetingAgendaItem[]) => void;
  onAddMeetingRecord: (record: MeetingRecord) => void;
  onToggleActionItem: (recordId: string, actionId: string) => void;
  onVoteAgenda: (agendaId: string, optionId: string) => void;
  onCloseAgenda: (agendaId: string, winningText: string) => void;
}

export const MeetingView: React.FC<MeetingViewProps> = ({
  trip,
  currentMember,
  members,
  onUpdateAgendas,
  onAddMeetingRecord,
  onToggleActionItem,
  onVoteAgenda,
  onCloseAgenda,
}) => {
  // 會議計時器 state
  const [timerSeconds, setTimerSeconds] = useState(15 * 60); // 預設 15 分鐘
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 新增議題 state
  const [showNewAgendaModal, setShowNewAgendaModal] = useState(false);
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [newAgendaDesc, setNewAgendaDesc] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['', '']);

  // 新增會議紀錄 state
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [recordTitle, setRecordTitle] = useState('');
  const [recordSummary, setRecordSummary] = useState('');
  const [attendeeIds, setAttendeeIds] = useState<string[]>(members.map((m) => m.id));
  const [actionTasks, setActionTasks] = useState<{ task: string; assigneeId: string }[]>([
    { task: '', assigneeId: members[0]?.id || '' },
  ]);

  // 計時器 Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert('⏰ 家庭會議時間到！大家取得共識了嗎？');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCreateAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaTitle.trim()) return;

    const validOptions = newOptions.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('請至少填寫兩個表決選項！');
      return;
    }

    const newAgenda: MeetingAgendaItem = {
      id: `ag-${Date.now()}`,
      title: newAgendaTitle.trim(),
      description: newAgendaDesc.trim(),
      status: 'discussing',
      proposerId: currentMember.id,
      options: validOptions.map((text, idx) => ({
        id: `opt-${idx}-${Date.now()}`,
        text,
        votes: [],
      })),
    };

    onUpdateAgendas([...(trip.agendas || []), newAgenda]);
    setNewAgendaTitle('');
    setNewAgendaDesc('');
    setNewOptions(['', '']);
    setShowNewAgendaModal(false);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordTitle.trim() || !recordSummary.trim()) return;

    const validActions = actionTasks
      .filter((a) => a.task.trim() !== '')
      .map((a, i) => ({
        id: `act-${Date.now()}-${i}`,
        task: a.task.trim(),
        assigneeId: a.assigneeId,
        done: false,
      }));

    const newRecord: MeetingRecord = {
      id: `mr-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: recordTitle.trim(),
      attendeeIds,
      summary: recordSummary.trim(),
      actionItems: validActions,
    };

    onAddMeetingRecord(newRecord);
    setShowNewRecordModal(false);
    setRecordTitle('');
    setRecordSummary('');
    setActionTasks([{ task: '', assigneeId: members[0]?.id || '' }]);
  };

  const handleOptionVote = (agendaId: string, optionId: string) => {
    onVoteAgenda(agendaId, optionId);
  };

  const handleDecide = (agendaId: string, winningText: string) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onCloseAgenda(agendaId, winningText);
  };

  return (
    <div className="space-y-6">
      {/* 頂部會議核心看板與倒數計時 */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-blue-200" />
            家庭會議中心 · 共同決策
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            全家出遊行前會議室
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            透過即時投票表決景點、討論晚餐喜好、紀錄結論並分派準備工作，讓全家每一位成員都參與旅行規劃！
          </p>
        </div>

        {/* 開會計時器 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4">
          <div className="text-center">
            <span className="text-[11px] text-blue-200 font-semibold block uppercase tracking-wider">
              高效會議倒數
            </span>
            <span className="text-3xl font-mono font-black tracking-wider text-white">
              {formatTimer(timerSeconds)}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-2 rounded-xl font-bold text-xs flex items-center justify-center transition shadow-md ${
                isTimerRunning
                  ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                  : 'bg-emerald-400 text-emerald-950 hover:bg-emerald-300'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(15 * 60);
              }}
              title="重設 15 分鐘"
              className="p-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30 text-xs transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 區塊一：正在進行的家庭表決議題 (Agendas & Voting) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                景點與行程表決區
              </h3>
              <p className="text-xs text-slate-500">
                當家人意見不同時，透過民主投票表決最佳方案！
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNewAgendaModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            發起新議題表決
          </button>
        </div>

        {/* 議題清單 */}
        {(!trip.agendas || trip.agendas.length === 0) ? (
          <div className="py-10 text-center text-slate-400">
            <Vote className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm">目前沒有進行中的表決議題</p>
            <button
              onClick={() => setShowNewAgendaModal(true)}
              className="mt-3 text-xs text-blue-600 font-bold hover:underline"
            >
              ＋ 發起第一個家庭投票
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trip.agendas.map((agenda) => {
              const proposer = members.find((m) => m.id === agenda.proposerId);
              const isDecided = agenda.status === 'decided';
              const totalVotes = agenda.options?.reduce((acc, opt) => acc + opt.votes.length, 0) || 0;

              return (
                <div
                  key={agenda.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDecided
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white border-blue-200 shadow-sm hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        isDecided
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {isDecided ? '✅ 已拍板定案' : '🔥 正在熱烈投票中'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      由 {proposer?.name || '家庭成員'} 提案
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    {agenda.title}
                  </h4>
                  {agenda.description && (
                    <p className="text-xs text-slate-600 mb-3">{agenda.description}</p>
                  )}

                  {isDecided ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 font-medium">
                      🎯 <strong>全家表決結論：</strong> {agenda.decision}
                    </div>
                  ) : (
                    <div className="space-y-2 mt-3">
                      {agenda.options?.map((opt) => {
                        const hasVoted = opt.votes.includes(currentMember.id);
                        const percentage = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;

                        return (
                          <div
                            key={opt.id}
                            className="bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200 transition"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                              <span className="flex items-center gap-1.5">
                                {opt.text}
                                {hasVoted && (
                                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                                    我投這票
                                  </span>
                                )}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 font-normal">
                                  {opt.votes.length} 票 ({percentage}%)
                                </span>
                                <button
                                  onClick={() => handleOptionVote(agenda.id, opt.id)}
                                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${
                                    hasVoted
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-blue-50'
                                  }`}
                                >
                                  {hasVoted ? '已投' : '投此項'}
                                </button>
                              </div>
                            </div>

                            {/* 投票百分比進度條 */}
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>

                            {/* 顯示投給該選項的成員頭貼 */}
                            {opt.votes.length > 0 && (
                              <div className="flex items-center gap-1 mt-1.5">
                                {opt.votes.map((voterId) => {
                                  const voter = members.find((m) => m.id === voterId);
                                  return (
                                    <span
                                      key={voterId}
                                      title={voter?.name}
                                      className="text-xs"
                                    >
                                      {voter?.avatar || '👤'}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* 拍板定案按鈕 */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            const topOpt = agenda.options?.reduce((prev, current) =>
                              prev.votes.length > current.votes.length ? prev : current
                            );
                            handleDecide(agenda.id, topOpt?.text || '多數表決通過！');
                          }}
                          className="text-xs bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          拍板定案並宣布結果
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 區塊二：會議紀錄與行動待辦分工 (Meeting Notes & Action Items) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                會議紀錄與行動待辦清單
              </h3>
              <p className="text-xs text-slate-500">
                紀錄每次家庭會議的決議，並將待辦事項分配給每位成員落實！
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNewRecordModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            新增會議紀錄
          </button>
        </div>

        {/* 會議紀錄清單 */}
        {(!trip.meetingRecords || trip.meetingRecords.length === 0) ? (
          <div className="py-8 text-center text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm">目前尚無會議紀錄，開會後可隨時記錄結論！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trip.meetingRecords.map((record) => (
              <div
                key={record.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>📌</span> {record.title}
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    會議日期：{record.date}
                  </span>
                </div>

                {/* 出席人員 */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-500 font-semibold">出席成員:</span>
                  {record.attendeeIds.map((attId) => {
                    const member = members.find((m) => m.id === attId);
                    return (
                      <span
                        key={attId}
                        className="text-xs bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        {member?.avatar} {member?.name}
                      </span>
                    );
                  })}
                </div>

                {/* 結論摘要 */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <strong>💡 會議共識摘要：</strong> {record.summary}
                </div>

                {/* 行動清單 */}
                {record.actionItems.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-slate-700 block">
                      ✅ 決議待辦分工事項 (點選可完成):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {record.actionItems.map((item) => {
                        const assignee = members.find((m) => m.id === item.assigneeId);
                        return (
                          <div
                            key={item.id}
                            onClick={() => onToggleActionItem(record.id, item.id)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2 ${
                              item.done
                                ? 'bg-emerald-50 border-emerald-200 text-slate-400 line-through'
                                : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 text-xs font-semibold flex-1">
                              <span className={item.done ? 'text-emerald-600' : 'text-slate-300'}>
                                <CheckCircle2 className="w-4 h-4" />
                              </span>
                              <span>{item.task}</span>
                            </div>
                            {assignee && (
                              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                                {assignee.avatar} {assignee.name.split(' ')[0]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 新增議題 Modal */}
      {showNewAgendaModal && (
        <div className="fixed inset-0 z-[1300] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base">
              發起家庭旅遊投票表決議題
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                議題名稱
              </label>
              <input
                type="text"
                required
                value={newAgendaTitle}
                onChange={(e) => setNewAgendaTitle(e.target.value)}
                placeholder="例：Day 2 晚餐想去東大門夜市還是海鮮餐廳？"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                補充說明
              </label>
              <textarea
                rows={2}
                value={newAgendaDesc}
                onChange={(e) => setNewAgendaDesc(e.target.value)}
                placeholder="說明考量點，例如價位、車程距離或長輩長程步行問題..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                表決選項 (至少兩項)
              </label>
              <div className="space-y-2">
                {newOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newOptions];
                      updated[i] = e.target.value;
                      setNewOptions(updated);
                    }}
                    placeholder={`選項 ${i + 1}`}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setNewOptions([...newOptions, ''])}
                className="mt-2 text-xs text-blue-600 font-bold hover:underline"
              >
                ＋ 新增更多選項
              </button>
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => setShowNewAgendaModal(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                取消
              </button>
              <button
                onClick={handleCreateAgenda}
                className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
              >
                發布投票
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增會議紀錄 Modal */}
      {showNewRecordModal && (
        <div className="fixed inset-0 z-[1300] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base">
              新增家庭旅遊會議紀錄
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                會議主題
              </label>
              <input
                type="text"
                required
                value={recordTitle}
                onChange={(e) => setRecordTitle(e.target.value)}
                placeholder="例：行前一週行程與裝備盤點會議"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                會議結論與共識備忘
              </label>
              <textarea
                rows={3}
                required
                value={recordSummary}
                onChange={(e) => setRecordSummary(e.target.value)}
                placeholder="紀錄討論重點，如出發集合時間、雨天備案、防曬與防蚊液攜帶..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                分派行動待辦事項
              </label>
              <div className="space-y-2">
                {actionTasks.map((act, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={act.task}
                      onChange={(e) => {
                        const updated = [...actionTasks];
                        updated[i].task = e.target.value;
                        setActionTasks(updated);
                      }}
                      placeholder="任務內容，如：買防蚊液、租借羽球拍..."
                      className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-xl focus:outline-none"
                    />
                    <select
                      value={act.assigneeId}
                      onChange={(e) => {
                        const updated = [...actionTasks];
                        updated[i].assigneeId = e.target.value;
                        setActionTasks(updated);
                      }}
                      className="text-xs px-2 py-1.5 border border-slate-300 rounded-xl bg-white"
                    >
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.avatar} {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setActionTasks([...actionTasks, { task: '', assigneeId: members[0]?.id || '' }])
                }
                className="mt-2 text-xs text-purple-600 font-bold hover:underline"
              >
                ＋ 新增一項待辦任務
              </button>
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => setShowNewRecordModal(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                取消
              </button>
              <button
                onClick={handleCreateRecord}
                className="px-4 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow"
              >
                儲存會議紀錄
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
