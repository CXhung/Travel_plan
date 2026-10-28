import React, { useState } from 'react';
import { Trip, FamilyMember, BudgetItem, PackingItem } from '../types';
import { formatCurrency } from '../utils/helpers';
import {
  DollarSign,
  PackageCheck,
  Plus,
  Trash2,
  PieChart,
  CheckCircle2,
  Circle,
  AlertCircle,
} from 'lucide-react';

interface BudgetAndPackingProps {
  trip: Trip;
  currentMember: FamilyMember;
  members: FamilyMember[];
  onUpdateBudget: (budget: Trip['budget']) => void;
  onUpdatePackingList: (packingList: PackingItem[]) => void;
}

export const BudgetAndPacking: React.FC<BudgetAndPackingProps> = ({
  trip,
  currentMember,
  members,
  onUpdateBudget,
  onUpdatePackingList,
}) => {
  const [activeTab, setActiveTab] = useState<'budget' | 'packing'>('budget');

  // 新增預算項目 state
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('餐飲');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number>(0);
  const [newExpensePaidBy, setNewExpensePaidBy] = useState(currentMember.id);

  // 新增行李項目 state
  const [newPackItem, setNewPackItem] = useState('');
  const [newPackCat, setNewPackCat] = useState('日常備品');
  const [newPackAssignee, setNewPackAssignee] = useState(currentMember.id);

  const budgetItems = trip.budget?.items || [];
  const totalSpent = budgetItems.reduce((acc, item) => acc + item.amount, 0);
  const totalTarget = trip.budget?.totalTarget || 35000;
  const remainingBudget = totalTarget - totalSpent;
  const budgetPercentage = Math.min(100, Math.round((totalSpent / totalTarget) * 100));

  const packingItems = trip.packingList || [];
  const checkedPackingCount = packingItems.filter((i) => i.checked).length;
  const packingProgress =
    packingItems.length > 0 ? Math.round((checkedPackingCount / packingItems.length) * 100) : 0;

  // 新增預算
  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim() || newExpenseAmount <= 0) return;

    const newItem: BudgetItem = {
      id: `b-${Date.now()}`,
      name: newExpenseName.trim(),
      category: newExpenseCategory,
      amount: Number(newExpenseAmount),
      paidByMemberId: newExpensePaidBy,
      splitMembers: members.map((m) => m.id),
    };

    onUpdateBudget({
      totalTarget,
      items: [...budgetItems, newItem],
    });

    setNewExpenseName('');
    setNewExpenseAmount(0);
  };

  const handleDeleteBudgetItem = (id: string) => {
    onUpdateBudget({
      totalTarget,
      items: budgetItems.filter((b) => b.id !== id),
    });
  };

  // 新增行李
  const handleAddPackingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackItem.trim()) return;

    const newItem: PackingItem = {
      id: `p-${Date.now()}`,
      item: newPackItem.trim(),
      category: newPackCat,
      assignedMemberId: newPackAssignee,
      checked: false,
    };

    onUpdatePackingList([...packingItems, newItem]);
    setNewPackItem('');
  };

  const handleTogglePacking = (id: string) => {
    onUpdatePackingList(
      packingItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeletePackingItem = (id: string) => {
    onUpdatePackingList(packingItems.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 分頁切換 */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition ${
            activeTab === 'budget'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>家庭旅遊預算與分帳</span>
        </button>
        <button
          onClick={() => setActiveTab('packing')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition ${
            activeTab === 'packing'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>全家行李準備清單 ({checkedPackingCount}/{packingItems.length})</span>
        </button>
      </div>

      {activeTab === 'budget' ? (
        <div className="space-y-6">
          {/* 預算統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                預算目標上限
              </span>
              <span className="text-2xl font-black text-slate-900">
                {formatCurrency(totalTarget)}
              </span>
              <div className="mt-2 text-[11px] text-slate-400">
                家庭會議拍板之最高支出目標
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                目前累計已規劃支出
              </span>
              <span className="text-2xl font-black text-emerald-600">
                {formatCurrency(totalSpent)}
              </span>
              <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    budgetPercentage > 90 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                剩餘可用額度
              </span>
              <span
                className={`text-2xl font-black ${
                  remainingBudget >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(remainingBudget)}
              </span>
              <div className="mt-2 text-[11px] text-slate-400">
                {remainingBudget >= 0 ? '預算控制良好，尚有餘裕！' : '⚠️ 已超出預算目標！'}
              </div>
            </div>
          </div>

          {/* 新增費用表單 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <span>➕</span> 快速新增費用支出 / 訂金
            </h4>
            <form onSubmit={handleAddBudgetItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                value={newExpenseName}
                onChange={(e) => setNewExpenseName(e.target.value)}
                placeholder="費用項目 (例：花蓮海產大餐)"
                className="text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={newExpenseCategory}
                onChange={(e) => setNewExpenseCategory(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
              >
                <option value="住宿">住宿</option>
                <option value="餐飲">餐飲</option>
                <option value="交通">交通 / 油資</option>
                <option value="門票">門票活動</option>
                <option value="伴手禮">伴手禮</option>
                <option value="其他">其他雜項</option>
              </select>
              <input
                type="number"
                min="1"
                required
                value={newExpenseAmount || ''}
                onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
                placeholder="金額 TWD"
                className="text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
              >
                加入記帳
              </button>
            </form>
          </div>

          {/* 支出明細列表 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between">
              <span>支出項目明細</span>
              <span>共 {budgetItems.length} 筆</span>
            </div>
            <div className="divide-y divide-slate-100">
              {budgetItems.map((item) => {
                const payer = members.find((m) => m.id === item.paidByMemberId);
                return (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                      <span className="font-bold text-xs text-slate-800">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {payer && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          {payer.avatar} {payer.name.split(' ')[0]} 代墊
                        </span>
                      )}
                      <span className="font-bold text-sm text-slate-900">
                        {formatCurrency(item.amount)}
                      </span>
                      <button
                        onClick={() => handleDeleteBudgetItem(item.id)}
                        className="text-slate-300 hover:text-red-500 p-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* 行李清單分頁 */
        <div className="space-y-6">
          {/* 打包進度進度條 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700">全家行李打包進度</span>
                <span className="text-xs font-bold text-blue-600">{packingProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${packingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* 新增行李表單 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <span>➕</span> 指派攜帶裝備與行李
            </h4>
            <form onSubmit={handleAddPackingItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                value={newPackItem}
                onChange={(e) => setNewPackItem(e.target.value)}
                placeholder="物品名稱 (例：折疊傘、行動電源)"
                className="text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newPackCat}
                onChange={(e) => setNewPackCat(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
              >
                <option value="重要證件">重要證件</option>
                <option value="日常備品">日常備品</option>
                <option value="醫藥用品">醫藥用品</option>
                <option value="攝影器材">攝影器材</option>
                <option value="衣物用品">衣物用品</option>
                <option value="車載裝備">車載裝備</option>
                <option value="零食備糧">零食備糧</option>
              </select>
              <select
                value={newPackAssignee}
                onChange={(e) => setNewPackAssignee(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.avatar} {m.name} 負責
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
              >
                加入清單
              </button>
            </form>
          </div>

          {/* 清單列表 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packingItems.map((item) => {
              const assignee = members.find((m) => m.id === item.assignedMemberId);
              return (
                <div
                  key={item.id}
                  onClick={() => handleTogglePacking(item.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    item.checked
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={item.checked ? 'text-blue-600' : 'text-slate-300'}>
                      {item.checked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </span>
                    <div>
                      <span className="font-bold text-xs block">{item.item}</span>
                      <span className="text-[10px] text-slate-400">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {assignee && (
                      <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        {assignee.avatar} {assignee.name.split(' ')[0]}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePackingItem(item.id);
                      }}
                      className="text-slate-300 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
