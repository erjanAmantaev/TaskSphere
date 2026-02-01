export interface User {
  id: number;
  username: string;
  email: string;
  karma: number;
  current_streak: number;
  highest_streak: number;
  is_2fa_enabled: boolean;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  is_overdue: boolean;
  priority: 'low' | 'medium' | 'important' | 'very_important' | 'extremely_important';
  due_date?: string;
  reminder?: string;
  expired: boolean;
  is_recurring: boolean;
  category?: Category;
  tags: Tag[];
  created_at: string;
  updated_at: string;
  subtasks_completion_percentage?: number;
  recurrence_rule?: RecurrenceRule;
  parent_recurring_task?: number;
}

export interface SubTask {
  id: number;
  title: string;
  parent_task: number;
  is_completed: boolean;
}

export interface Category {
  id: number;
  name: string;
  owner: number;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
  owner: number;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  next_occurance: string;
}

export interface Badge {
  id: number;
  name: string;
  karma_min: number;
  karma_max: number;
  earned?: boolean;
  is_current_level?: boolean;
  karma_needed?: number;
}

export interface UserBadge {
  id: number;
  name: string;
  awarded_at: string;
  karma_range: string;
}

export interface ProfileData {
  username: string;
  karma: number;
  current_badge_level: {
    name: string;
    karma_min: number;
    karma_max: number;
    progress_percentage: number;
    karma_to_next_level: number;
  } | null;
  earned_badges: UserBadge[];
  current_streak: number;
  highest_streak: number;
  start_date: string;
  end_date: string;
  total_amount_of_completed_tasks: number;
  total_amount_of_completed_tasks_for_the_past_7d: number;
  amount_of_tasks_completed_on_each_day_for_the_past_7d: {
    date: string;
    count: number;
    day_name: string;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  karma: number;
  current_streak: number;
  highest_streak: number;
  current_badge_level: string;
}

export interface KarmaTransaction {
  id: number;
  amount: number;
  reason: string;
  created_at: string;
  type: 'earned' | 'lost';
}

export interface LoginResponse {
  message: string;
  user_id: number;
  user_email: string;
  username?: string;
  refresh_token: string;
  access_token: string;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
  user_email: string;
  refresh_token: string;
  access_token: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: string;
  due_date?: string;
  reminder?: string;
  category?: number;
  tags?: number[];
  is_recurring?: boolean;
  recurrence_rule?: {
    frequency: string;
    interval: number;
  };
  subtasks?: { title: string }[];
}
