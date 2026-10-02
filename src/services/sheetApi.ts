import { GuestbookEntry } from '../types';
import { INITIAL_DEMO_ENTRIES } from '../constants/gasScript';

const STORAGE_KEY_URL = 'sheet_guestbook_gas_url';
const STORAGE_KEY_DEMO_ENTRIES = 'sheet_guestbook_demo_entries';

export function getSavedGasUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_URL) || '';
  } catch {
    return '';
  }
}

export function saveGasUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
  } catch (e) {
    console.error('Failed to save GAS URL to localStorage', e);
  }
}

export function getLocalDemoEntries(): GuestbookEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DEMO_ENTRIES);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load demo entries', e);
  }
  return INITIAL_DEMO_ENTRIES;
}

export function saveLocalDemoEntries(entries: GuestbookEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DEMO_ENTRIES, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save demo entries', e);
  }
}

export async function fetchEntries(gasUrl: string): Promise<GuestbookEntry[]> {
  const trimmedUrl = gasUrl.trim();
  if (!trimmedUrl) {
    // 데모 모드 데이터 반환
    return getLocalDemoEntries();
  }

  try {
    const res = await fetch(trimmedUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      redirect: 'follow',
    });

    if (!res.ok) {
      throw new Error(`HTTP 오류: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.data)) {
      return json.data;
    } else if (Array.isArray(json)) {
      return json;
    } else {
      throw new Error(json.message || '응답 형식이 올바르지 않습니다.');
    }
  } catch (error: any) {
    console.error('구글 시트 데이터 로드 실패:', error);
    throw error;
  }
}

export async function submitEntry(
  gasUrl: string,
  entryData: { name: string; message: string; theme: string }
): Promise<GuestbookEntry> {
  const trimmedUrl = gasUrl.trim();

  // 1. 데모 모드일 때
  if (!trimmedUrl) {
    await new Promise((res) => setTimeout(res, 600)); // 자연스러운 로딩 스피너 체험
    const newEntry: GuestbookEntry = {
      id: 'demo_' + Date.now(),
      name: entryData.name || '익명 친구',
      message: entryData.message,
      theme: (entryData.theme as any) || 'yellow',
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    const current = getLocalDemoEntries();
    const updated = [newEntry, ...current];
    saveLocalDemoEntries(updated);
    return newEntry;
  }

  // 2. 실제 구글 시트 연동 모드
  // Google Apps Script는 simple request(text/plain)로 전송해야 브라우저의 OPTIONS preflight CORS 차단을 회피할 수 있습니다.
  try {
    const res = await fetch(trimmedUrl, {
      method: 'POST',
      body: JSON.stringify(entryData),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      redirect: 'follow',
    });

    if (!res.ok) {
      throw new Error(`전송 실패 (HTTP ${res.status})`);
    }

    const result = await res.json();
    if (result.status === 'success' && result.data) {
      return result.data;
    } else if (result.status === 'success') {
      return {
        id: 'msg_' + Date.now(),
        name: entryData.name,
        message: entryData.message,
        theme: entryData.theme as any,
        createdAt: new Date().toISOString(),
        likes: 0,
      };
    } else {
      throw new Error(result.message || '시트 저장 실패');
    }
  } catch (err: any) {
    console.error('시트 저장 요청 에러:', err);
    throw err;
  }
}

export async function likeEntry(gasUrl: string, entryId: string): Promise<number> {
  const trimmedUrl = gasUrl.trim();

  if (!trimmedUrl) {
    // 데모 모드 로컬 반영
    const list = getLocalDemoEntries();
    let newLikes = 1;
    const updated = list.map((item) => {
      if (item.id === entryId) {
        newLikes = (item.likes || 0) + 1;
        return { ...item, likes: newLikes };
      }
      return item;
    });
    saveLocalDemoEntries(updated);
    return newLikes;
  }

  try {
    const res = await fetch(trimmedUrl, {
      method: 'POST',
      body: JSON.stringify({ action: 'like', id: entryId }),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      redirect: 'follow',
    });
    const result = await res.json();
    if (result.status === 'success' && typeof result.likes === 'number') {
      return result.likes;
    }
    return 1;
  } catch (err) {
    console.warn('좋아요 전송 에러 (로컬 반영만 유지):', err);
    return 1;
  }
}
