import { useState, useEffect } from 'react';
import { X, Check, Link2, AlertCircle, RefreshCw, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { fetchEntries } from '../services/sheetApi';

interface UrlSettingsModalProps {
  isOpen: boolean;
  currentUrl: string;
  onSave: (url: string) => void;
  onClose: () => void;
  onOpenGuide: () => void;
}

export default function UrlSettingsModal({
  isOpen,
  currentUrl,
  onSave,
  onClose,
  onOpenGuide,
}: UrlSettingsModalProps) {
  const [url, setUrl] = useState(currentUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  useEffect(() => {
    setUrl(currentUrl);
    setTestResult(null);
  }, [currentUrl, isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setTestResult({
        success: false,
        message: 'Google Apps Script 웹 앱 URL을 먼저 입력해 주세요.',
      });
      return;
    }

    if (!trimmed.startsWith('https://script.google.com/')) {
      setTestResult({
        success: false,
        message: '유효한 Google Apps Script URL 형태가 아닙니다. (https://script.google.com/... 형식)',
      });
      return;
    }

    if (!trimmed.endsWith('/exec')) {
      setTestResult({
        success: false,
        message: '주의: URL 끝이 /exec 로 끝나지 않습니다. 반드시 웹 앱 배포 완료 후 제공되는 /exec URL을 사용해주세요.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const data = await fetchEntries(trimmed);
      setTestResult({
        success: true,
        message: `연결 성공! 구글 시트에서 총 ${data.length}개의 방명록을 확인했습니다.`,
        count: data.length,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `연결 실패: ${err.message || '요청 응답이 없습니다.'}\n(힌트: Apps Script 배포 설정에서 '액세스 권한: 모든 사용자(Anyone)'로 되어 있는지 확인해주세요.)`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSave(url.trim());
    onClose();
  };

  const handleSwitchToDemo = () => {
    setUrl('');
    onSave('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-xl">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">구글 시트 연동 URL 설정</h3>
              <p className="text-xs text-emerald-100">내 스프레드시트 Apps Script Web App 주소를 등록합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Google Apps Script 웹 앱 URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-4 py-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
              />
            </div>
            <p className="text-xs text-neutral-500">
              Apps Script에서 <strong>[새 배포] &gt; [웹 앱]</strong> 생성 시 발급되는 실행 URL입니다.
            </p>
          </div>

          {/* Test & Guide Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !url.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>시트 연결 확인 중...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-neutral-600" />
                  <span>연결 테스트하기</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGuide();
              }}
              className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>URL 만드는 법 가이드 보기</span>
            </button>
          </div>

          {/* Test Result Box */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-in fade-in flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="whitespace-pre-wrap">{testResult.message}</span>
            </div>
          )}

          {/* Demo Mode Notice */}
          {!currentUrl && !url && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">현재 데모(체험) 모드로 동작 중입니다.</p>
                <p className="mt-0.5 text-amber-700">
                  URL을 비워두면 브라우저 로컬 저장소를 활용해 바로 방명록 작성과 조회를 체험해 볼 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <div>
            {currentUrl && (
              <button
                type="button"
                onClick={handleSwitchToDemo}
                className="text-xs text-neutral-500 hover:text-rose-600 transition-colors underline"
              >
                연결 해제 (데모 모드로 전환)
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:bg-neutral-200/70 rounded-xl transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              저장 및 연결
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
