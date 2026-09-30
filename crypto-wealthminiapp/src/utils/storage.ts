const KEY = 'crypto_wealth_bot_v1';

export interface UserData {
  balance: number;
  vipLevel: number;
  totalEarned: number;
  totalPlayed: number;
  lastDaily: string | null;
}

const defaultData: UserData = {
  balance: 48920,
  vipLevel: 1,
  totalEarned: 12450,
  totalPlayed: 87,
  lastDaily: null,
};

export function loadData(): UserData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaultData, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultData };
}

export function saveData(data: UserData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function formatUSD(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
