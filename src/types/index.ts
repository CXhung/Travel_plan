export type ActivityCategory = 'attraction' | 'food' | 'stay' | 'transport' | 'shopping' | 'other';

export interface FamilyMember {
  id: string;
  name: string;
  roleTitle: string; // 例如：爸爸 (行程總召)、媽媽 (財務大臣)
  avatar: string;
  color: string;
  badge: string;
}

export interface ActivityVote {
  memberId: string;
  memberName: string;
  vote: 'yes' | 'maybe' | 'no';
}

export interface Activity {
  id: string;
  time: string; // e.g. "09:30"
  endTime?: string; // e.g. "11:30"
  title: string;
  category: ActivityCategory;
  locationName: string;
  address?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  cost?: number;
  assignedMemberId?: string;
  votes: Record<string, 'yes' | 'maybe' | 'no'>; // memberId -> vote
  lastEditedBy?: {
    memberId: string;
    memberName: string;
    action: string;
    timestamp: string;
  };
  isHighlight?: boolean;
}

export interface TripDay {
  dayNumber: number;
  date: string;
  theme: string;
  activities: Activity[];
}

export interface BudgetItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  paidByMemberId: string;
  splitMembers: string[];
}

export interface PackingItem {
  id: string;
  item: string;
  category: string;
  assignedMemberId: string;
  checked: boolean;
}

export interface MeetingAgendaItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'discussing' | 'decided';
  decision?: string;
  proposerId: string;
  options?: {
    id: string;
    text: string;
    votes: string[]; // memberIds
  }[];
}

export interface MeetingRecord {
  id: string;
  date: string;
  title: string;
  attendeeIds: string[];
  summary: string;
  actionItems: {
    id: string;
    task: string;
    assigneeId: string;
    done: boolean;
  }[];
}

export interface TripNotification {
  id: string;
  tripId: string;
  tripTitle: string;
  memberId: string;
  memberName: string;
  actionType: 'add' | 'edit' | 'delete' | 'time' | 'vote' | 'meeting';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  activityId?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  status: 'planning' | 'confirmed' | 'completed';
  description: string;
  days: TripDay[];
  budget: {
    totalTarget: number;
    items: BudgetItem[];
  };
  packingList: PackingItem[];
  agendas: MeetingAgendaItem[];
  meetingRecords: MeetingRecord[];
  inviteCode: string; // 專屬邀請碼，用於擁有連結的使用者才能加入
  createdAt: string;
  updatedAt: string;
  notes?: string;
}
