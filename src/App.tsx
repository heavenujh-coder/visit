/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Sparkles,
  BookOpen,
  ArrowUpDown,
  Heart,
  MessageSquareHeart,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import Header from './components/Header';
import EntryForm from './components/EntryForm';
import EntryCard from './components/EntryCard';
import GuideModal from './components/GuideModal';
import UrlSettingsModal from './components/UrlSettingsModal';
import Toast from './components/Toast';
import { GuestbookEntry, CardTheme, ToastMessage } from './types';
import {
  getSavedGasUrl,
  saveGasUrl,
  fetchEntries,
  submitEntry,
  likeEntry,
} from './services/sheetApi';

export default function App() {
  const [gasUrl, setGasUrl] = useState<string>('');
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTheme, setFilterTheme] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular'>('newest');

  // Modals & Toasts
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load initial URL and entries
  const loadData = useCallback(async (targetUrl: string, silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await fetchEntries(targetUrl);
      setEntries(data);
    } catch (err: any) {
      addToast(
        'error',
        '방명록 목록 불러오기 실패',
        `${err.message || '데이터를 가져오지 못했습니다.'}\n구글 시트의 Apps Script 배포 URL 및 권한 설정을 확인해주세요.`
      );
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    const saved = getSavedGasUrl();
    setGasUrl(saved);
    loadData(saved);
  }, [loadData]);

  // Handle URL change
  const handleSaveGasUrl = async (newUrl: string) => {
    setGasUrl(newUrl);
    saveGasUrl(newUrl);
    if (newUrl.trim()) {
      addToast('success', '구글 시트 URL 저장 완료', '이제 모든 방명록이 내 구글 스프레드시트와 실시간 연동됩니다!');
    } else {
      addToast('info', '데모 모드로 전환', '브라우저 로컬 저장소를 사용하는 체험 모드로 전환되었습니다.');
    }
    await loadData(newUrl);
  };

  // Submit new entry
  const handleSubmitEntry = async (data: { name: string; message: string; theme: CardTheme }) => {
    setIsSubmitting(true);
    try {
      const newEntry = await submitEntry(gasUrl, data);
      setEntries((prev) => [newEntry, ...prev.filter((e) => e.id !== newEntry.id)]);
      addToast(
        'success',
        '등록 완료 🎉',
        gasUrl
          ? `'${data.name}'님의 응원 한마디가 구글 시트에 안전하게 저장되었습니다!`
          : `'${data.name}'님의 응원 한마디가 등록되었습니다! (데모 모드)`
      );
    } catch (err: any) {
      addToast(
        'error',
        '시트 등록 실패',
        `${err.message || '저장 중 문제가 발생했습니다.'}\nApps Script 배포 시 '액세스 권한: 모든 사용자'인지 확인해 주세요.`
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like an entry
  const handleLike = async (id: string) => {
    try {
      const updatedLikes = await likeEntry(gasUrl, id);
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, likes: updatedLikes } : e))
      );
    } catch {
      // ignore
    }
  };

  // Filtered & sorted entries
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Theme filter
    if (filterTheme !== 'all') {
      result = result.filter((e) => e.theme === filterTheme);
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (e) =>
          (e.name && e.name.toLowerCase().includes(query)) ||
          (e.message && e.message.toLowerCase().includes(query))
      );
    }

    // Sort order
    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOrder === 'popular') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    return result;
  }, [entries, filterTheme, searchQuery, sortOrder]);

  const totalLikes = useMemo(
    () => entries.reduce((sum, item) => sum + (item.likes || 0), 0),
    [entries]
  );

  return (
    <div className="min-h-screen bg-neutral-50/60 text-neutral-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Header */}
      <Header
        gasUrl={gasUrl}
        isLoading={isLoading}
        onRefresh={() => loadData(gasUrl)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalCount={entries.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Demo Mode / Connect Banner */}
        {!gasUrl.trim() && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 sm:p-6 text-white shadow-lg shadow-emerald-700/10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3분 만에 구글 시트 연결</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  내 구글 스프레드시트를 실시간 데이터베이스로 사용해보세요!
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                  현재는 데모 모드입니다. 무료 구글 시트에 Apps Script 코드를 붙여넣기만 하면,
                  추가 서버 비용 0원으로 방문자들의 방명록을 내 시트에 실시간으로 기록할 수 있습니다.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>초보자 연동 가이드 보기</span>
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-4 py-2.5 bg-emerald-800/60 hover:bg-emerald-800/80 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5"
                >
                  <span>시트 URL 바로 등록</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Decorative background shapes */}
            <div className="absolute -right-8 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          </div>
        )}

        {/* Content Layout: Form & Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Form & About Box (lg: 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Input Form */}
            <EntryForm
              onSubmit={handleSubmitEntry}
              isSubmitting={isSubmitting}
              isConnected={!!gasUrl.trim()}
            />

            {/* Mini Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>구글 시트 DB의 장점</span>
              </h3>
              <ul className="text-xs text-neutral-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>완전 무료 & 서버 불필요:</strong> 구글 클라우드가 무중단 무료 API 호스팅을 제공합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>스프레드시트에서 즉시 확인:</strong> 관리자 페이지 없이도 엑셀처럼 시트에서 직접 보고 수정/삭제 가능합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>실시간 데이터 저장:</strong> 작성된 글은 스프레드시트의 새 행에 즉시 차곡차곡 쌓입니다.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Guestbook Board Grid (lg: 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Control Bar: Search, Stats, Filters */}
            <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="작성자 또는 응원글 검색..."
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
                    >
                      지우기
                    </button>
                  )}
                </div>

                {/* Sort Order Selector */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="px-3 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="newest">최신순</option>
                    <option value="oldest">과거순</option>
                    <option value="popular">응원 많은순</option>
                  </select>
                </div>
              </div>

              {/* Theme Filter & Quick Stats */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  <span className="text-neutral-400 text-[11px] font-medium shrink-0">테마:</span>
                  {[
                    { id: 'all', label: '전체' },
                    { id: 'yellow', label: '옐로우' },
                    { id: 'mint', label: '민트' },
                    { id: 'peach', label: '피치' },
                    { id: 'lavender', label: '라벤더' },
                    { id: 'sky', label: '스카이' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFilterTheme(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                        filterTheme === t.id
                          ? 'bg-neutral-900 text-white font-semibold'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="text-neutral-500 text-[11px] font-medium flex items-center gap-2">
                  <span>
                    총 <strong className="text-neutral-900">{filteredEntries.length}</strong>개
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-rose-600 font-semibold">
                    <Heart className="w-3 h-3 fill-rose-500" />
                    {totalLikes}
                  </span>
                </div>
              </div>
            </div>

            {/* Guestbook Cards Grid */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-2xl border border-neutral-200/80">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-neutral-800">
                    {gasUrl ? '구글 스프레드시트에서 데이터를 불러오는 중...' : '방명록을 불러오는 중...'}
                  </p>
                  <p className="text-xs text-neutral-400">잠시만 기다려주세요.</p>
                </div>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="py-16 px-6 text-center bg-white rounded-2xl border border-neutral-200/80 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <MessageSquareHeart className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-neutral-800 text-base">
                    {searchQuery ? '검색된 응원글이 없습니다.' : '아직 등록된 방명록이 없습니다.'}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
                    {searchQuery
                      ? '다른 검색어로 검색해 보거나 필터를 재설정해 보세요.'
                      : '좌측 폼에서 첫 번째 따뜻한 응원의 한마디를 남겨보세요!'}
                  </p>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterTheme('all');
                    }}
                    className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    필터 초기화
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onLike={handleLike}
                    onCopySuccess={() =>
                      addToast('info', '복사 완료', '응원글 내용이 클립보드에 복사되었습니다.')
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-neutral-800">시트방명록 (SheetGuestbook)</span>
            <span>—</span>
            <span>Google Apps Script JSON API 기반</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-emerald-700 transition-colors"
            >
              연동 가이드 & 코드
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-emerald-700 transition-colors"
            >
              시트 URL 설정
            </button>
            <span>•</span>
            <a
              href="https://sheets.new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
            >
              <span>sheets.new</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <UrlSettingsModal
        isOpen={isSettingsOpen}
        currentUrl={gasUrl}
        onSave={handleSaveGasUrl}
        onClose={() => setIsSettingsOpen(false)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
