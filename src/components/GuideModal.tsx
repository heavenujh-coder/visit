import { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  FileSpreadsheet,
  Cpu,
  Globe,
  Link,
  Sparkles
} from 'lucide-react';
import { APPS_SCRIPT_CODE } from '../constants/gasScript';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export default function GuideModal({ isOpen, onClose, onOpenSettings }: GuideModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'structure' | 'code' | 'faq'>('steps');

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = APPS_SCRIPT_CODE;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-xs">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                구글 시트 연동 초보자 완벽 가이드
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 border border-emerald-300/30">
                  무료 & 서버 0원
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5">
                구글 스프레드시트를 나만의 실시간 데이터베이스(JSON API)로 3분 만에 연결하세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'steps'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            5단계 연동 방법
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'structure'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            시트 구조 (A~F열 자동생성)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'code'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Apps Script 코드 (복사하기)
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'faq'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            자주 묻는 질문 & 주의사항
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-700 text-sm">
          {activeTab === 'steps' && (
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4 items-start p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm shrink-0">
                  1
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                    구글 스프레드시트 새로 만들기
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    새 스프레드시트를 생성합니다. 파일 이름은 자유롭게 정하세요 (예: <code>방명록_DB</code>).
                    시트의 1행 헤더나 서식은 스크립트가 첫 실행 시 <strong>자동으로 생성</strong>해 주므로 빈 시트 그대로 두셔도 됩니다.
                  </p>
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors"
                  >
                    <span>새 구글 시트 바로 열기 (sheets.new)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm shrink-0">
                  2
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-neutral-900 text-base">
                    Apps Script 편집기 열기
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    스프레드시트 상단 메뉴에서{' '}
                    <span className="font-semibold text-neutral-800 bg-neutral-200 px-1.5 py-0.5 rounded text-xs">
                      확장 프로그램
                    </span>{' '}
                    &gt;{' '}
                    <span className="font-semibold text-neutral-800 bg-neutral-200 px-1.5 py-0.5 rounded text-xs">
                      Apps Script
                    </span>
                    를 클릭합니다. 새 탭으로 스크립트 에디터가 열립니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm shrink-0">
                  3
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-neutral-900 text-base">
                      제공된 코드 붙여넣기 및 저장
                    </h3>
                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? '복사 완료!' : '스크립트 코드 복사'}
                    </button>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    기존 에디터에 적혀 있는 <code>function myFunction() &#123;&#125;</code> 내용을 모두 지우고,
                    위의 <strong>[스크립트 코드 복사]</strong> 버튼을 눌러 복사한 코드를 그대로 붙여넣은 뒤 <strong>저장(Ctrl+S / Cmd+S)</strong> 아이콘을 누릅니다.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 items-start p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm shrink-0">
                  4
                </div>
                <div className="flex-1 space-y-2.5">
                  <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
                    웹 앱으로 배포하기 (가장 중요한 단계! ⭐)
                  </h3>
                  <p className="text-neutral-700 text-sm">
                    에디터 우측 상단의 파란색{' '}
                    <span className="font-bold text-neutral-900 bg-white border border-neutral-300 px-1.5 py-0.5 rounded text-xs">
                      [배포]
                    </span>{' '}
                    버튼 &gt;{' '}
                    <span className="font-bold text-neutral-900 bg-white border border-neutral-300 px-1.5 py-0.5 rounded text-xs">
                      [새 배포]
                    </span>
                    를 클릭합니다.
                  </p>
                  <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 space-y-2 text-xs sm:text-sm">
                    <p className="font-semibold text-neutral-900">배포 창 옵션 설정:</p>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                      <li>
                        <strong>유형 선택 (톱니바퀴):</strong> <span className="text-emerald-700 font-bold">웹 앱(Web App)</span> 선택
                      </li>
                      <li>
                        <strong>설명:</strong> <code>방명록 API</code> (자유롭게 입력)
                      </li>
                      <li>
                        <strong>다음 사용자로 실행:</strong> <span className="font-semibold text-neutral-900">나 (내 이메일)</span>
                      </li>
                      <li>
                        <strong>액세스 권한이 있는 사용자:</strong>{' '}
                        <span className="bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded border border-rose-200">
                          모든 사용자 (Anyone)
                        </span>{' '}
                        <span className="text-rose-600 font-medium">← 반드시 이것으로 선택해야 로그인 없이 방명록 등록이 됩니다!</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-xs text-neutral-500 bg-neutral-100 p-2.5 rounded-md flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      최초 배포 시 <strong>[액세스 승인]</strong> 팝업이 뜰 수 있습니다. 본인 구글 계정을 선택한 후,
                      '확인되지 않은 앱' 화면에서 <strong>[고급] &gt; [안전하지 않은 페이지로 이동]</strong>을 누르고 허용하시면 됩니다.
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 items-start p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm shrink-0">
                  5
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                    배포된 웹 앱 URL 복사하여 연결
                  </h3>
                  <p className="text-neutral-700 text-sm">
                    배포 완료 창에 표시되는 <strong>웹 앱 URL</strong> (예:{' '}
                    <code>https://script.google.com/macros/s/.../exec</code>)을 복사합니다.
                  </p>
                  <p className="text-neutral-700 text-sm">
                    이 웹앱 상단의 <strong>[시트 연동 설정]</strong> 버튼을 누르고 복사한 URL을 붙여넣으면 즉시 실시간 구글 시트 연동이 완료됩니다!
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSettings();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all mt-1"
                  >
                    <Link className="w-4 h-4" />
                    지금 웹 앱 URL 등록하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-6">
              {/* Auto Create Notice Box */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-950 text-sm">
                    사용자가 직접 열(헤더)을 만들지 않아도 괜찮습니다! (100% 자동 생성)
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    제공해 드린 스크립트 안에 <strong>헤더 자동 생성 로직</strong>(<code>getOrCreateSheet()</code>)이 내장되어 있습니다.
                    따라서 <strong>빈 구글 스프레드시트</strong> 상태 그대로 스크립트를 연결하셔도, 첫 번째 글이 등록되거나 조회될 때 자동으로 첫 번째 행에 6개의 열이 생성됩니다.
                  </p>
                </div>
              </div>

              {/* Visual Spreadsheet Mockup */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    스프레드시트에 자동 구성되는 테이블 구조
                  </h4>
                  <span className="text-xs text-neutral-400 font-mono">시트 이름: 방명록 또는 기본 시트1</span>
                </div>

                <div className="border border-neutral-300 rounded-xl overflow-x-auto shadow-xs bg-white">
                  <table className="w-full text-xs text-left border-collapse min-w-[620px]">
                    <thead>
                      {/* Column Letters */}
                      <tr className="bg-neutral-100 text-neutral-500 font-mono text-[11px] border-b border-neutral-200">
                        <th className="w-10 px-2 py-1.5 text-center bg-neutral-200/60 border-r border-neutral-300">#</th>
                        <th className="px-3 py-1.5 border-r border-neutral-200">A</th>
                        <th className="px-3 py-1.5 border-r border-neutral-200">B</th>
                        <th className="px-3 py-1.5 border-r border-neutral-200">C</th>
                        <th className="px-3 py-1.5 border-r border-neutral-200">D</th>
                        <th className="px-3 py-1.5 border-r border-neutral-200">E</th>
                        <th className="px-3 py-1.5">F</th>
                      </tr>
                      {/* Row 1: Headers */}
                      <tr className="bg-neutral-200/80 font-bold text-neutral-900 border-b-2 border-neutral-300 text-xs">
                        <td className="px-2 py-2 text-center bg-neutral-200/90 border-r border-neutral-300 font-mono text-neutral-500">1</td>
                        <td className="px-3 py-2 border-r border-neutral-300 text-emerald-900">ID</td>
                        <td className="px-3 py-2 border-r border-neutral-300 text-emerald-900">작성자</td>
                        <td className="px-3 py-2 border-r border-neutral-300 text-emerald-900">응원한마디</td>
                        <td className="px-3 py-2 border-r border-neutral-300 text-emerald-900">테마</td>
                        <td className="px-3 py-2 border-r border-neutral-300 text-emerald-900">작성일시</td>
                        <td className="px-3 py-2 text-emerald-900">좋아요</td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 font-mono text-neutral-700">
                      {/* Row 2: Sample 1 */}
                      <tr className="hover:bg-neutral-50/80">
                        <td className="px-2 py-2 text-center bg-neutral-100 border-r border-neutral-200 text-neutral-400">2</td>
                        <td className="px-3 py-2 border-r border-neutral-200 text-neutral-500 text-[11px]">msg_171123456</td>
                        <td className="px-3 py-2 border-r border-neutral-200 font-sans font-semibold text-neutral-800">민트초코러버 🌿</td>
                        <td className="px-3 py-2 border-r border-neutral-200 font-sans text-neutral-700 max-w-[200px] truncate">구글 스프레드시트 연동 최고입니다! 🎉</td>
                        <td className="px-3 py-2 border-r border-neutral-200"><span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">mint</span></td>
                        <td className="px-3 py-2 border-r border-neutral-200 text-neutral-500 text-[11px]">2026-03-31T14:20:00.000Z</td>
                        <td className="px-3 py-2 font-bold text-rose-600">5</td>
                      </tr>
                      {/* Row 3: Sample 2 */}
                      <tr className="hover:bg-neutral-50/80">
                        <td className="px-2 py-2 text-center bg-neutral-100 border-r border-neutral-200 text-neutral-400">3</td>
                        <td className="px-3 py-2 border-r border-neutral-200 text-neutral-500 text-[11px]">msg_171123982</td>
                        <td className="px-3 py-2 border-r border-neutral-200 font-sans font-semibold text-neutral-800">코딩하는 라이언 🦁</td>
                        <td className="px-3 py-2 border-r border-neutral-200 font-sans text-neutral-700 max-w-[200px] truncate">서버 비용 0원으로 방명록 완성 ✨</td>
                        <td className="px-3 py-2 border-r border-neutral-200"><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">yellow</span></td>
                        <td className="px-3 py-2 border-r border-neutral-200 text-neutral-500 text-[11px]">2026-03-31T15:10:00.000Z</td>
                        <td className="px-3 py-2 font-bold text-rose-600">12</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Column Breakdown Cards */}
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-900 text-sm">각 열(Column)에 들어가는 데이터 설명</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-800">
                      <span className="w-5 h-5 rounded-md bg-neutral-200 text-neutral-700 flex items-center justify-center font-mono">A</span>
                      <span>ID (고유 식별자)</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      각 방명록 글마다 부여되는 중복 없는 고유 ID입니다 (좋아요 집계 시 사용).
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-800">
                      <span className="w-5 h-5 rounded-md bg-neutral-200 text-neutral-700 flex items-center justify-center font-mono">B</span>
                      <span>작성자 (닉네임)</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      방문자가 입력한 이름이나 닉네임입니다. 미입력 시 '익명 친구'로 기록됩니다.
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-800">
                      <span className="w-5 h-5 rounded-md bg-neutral-200 text-neutral-700 flex items-center justify-center font-mono">C</span>
                      <span>응원한마디 (내용)</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      작성자가 남긴 방명록 본문 메시지(최대 300자)가 텍스트로 저장됩니다.
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-800">
                      <span className="w-5 h-5 rounded-md bg-neutral-200 text-neutral-700 flex items-center justify-center font-mono">D</span>
                      <span>테마 (카드 색상)</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      선택한 배경 색상 코드 (<code>yellow</code>, <code>mint</code>, <code>peach</code> 등).
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-800">
                      <span className="w-5 h-5 rounded-md bg-neutral-200 text-neutral-700 flex items-center justify-center font-mono">E</span>
                      <span>작성일시 (ISO 시각)</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      글이 저장된 시각 (예: <code>2026-03-31T14:20:00.000Z</code>).
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-800">
                      <span className="w-5 h-5 rounded-md bg-neutral-200 text-neutral-700 flex items-center justify-center font-mono">F</span>
                      <span>좋아요 (하트 수)</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      기본 0에서 시작하여 방문자가 하트를 누를 때마다 +1씩 증가합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Manual setup tip */}
              <div className="p-3.5 bg-neutral-100 rounded-xl text-xs text-neutral-600 space-y-1">
                <p className="font-semibold text-neutral-800">💡 미리 수동으로 시트에 헤더를 적어두고 싶으신가요?</p>
                <p>
                  스프레드시트 1행의 A1부터 F1까지 순서대로{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-300 font-bold text-neutral-900">
                    ID | 작성자 | 응원한마디 | 테마 | 작성일시 | 좋아요
                  </code>
                  를 적어두셔도 스크립트와 완벽히 호환됩니다.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-neutral-100 rounded-xl">
                <div>
                  <p className="font-bold text-neutral-900 text-sm">Google Apps Script 전체 소스코드</p>
                  <p className="text-xs text-neutral-500">
                    GET(목록 조회)과 POST(신규 등록 및 좋아요)를 자동으로 처리하는 검증된 코드입니다.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '전체 코드 복사 완료!' : '코드 1클릭 복사하기'}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 text-neutral-100">
                <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-mono ml-2">Code.gs</span>
                  </div>
                  <span>JavaScript (Apps Script)</span>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto max-h-[420px] leading-relaxed text-emerald-300">
                  {APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1.5">
                <h4 className="font-bold text-neutral-900 flex items-center gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Q1. 글을 등록했는데 구글 시트에 안 들어가거나 오류가 나요!
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  가장 흔한 이유는 <strong>[액세스 권한]</strong>이 '나만 볼 수 있음'으로 되어 있기 때문입니다.
                  Apps Script에서 <strong>[배포] &gt; [배포 관리] &gt; 수정(연필 아이콘)</strong>을 누른 후,
                  액세스 권한을 반드시 <strong>'모든 사용자(Anyone)'</strong>로 변경하고 버전을 <strong>'새 버전'</strong>으로 선택하여 다시 배포해 주세요.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1.5">
                <h4 className="font-bold text-neutral-900 flex items-center gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Q2. 코드를 수정한 뒤에는 어떻게 해야 적용되나요?
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Apps Script는 코드를 수정한 후 그냥 저장만 하면 기존 배포 URL에는 반영되지 않습니다.
                  반드시 <strong>[배포] &gt; [배포 관리] &gt; 연필(수정) 아이콘 &gt; 버전: [새 버전] &gt; [배포]</strong>를 눌러야 새 코드가 반영됩니다.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1.5">
                <h4 className="font-bold text-neutral-900 flex items-center gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Q3. URL 끝이 /exec 로 끝나야 하나요?
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  네, 맞습니다! <code>https://script.google.com/macros/s/.../exec</code> 형태로 끝나는 URL이 외부 웹 요청을 처리할 수 있는 실제 실행 URL입니다.
                  (<code>/dev</code>로 끝나는 테스트 URL은 본인 계정으로 로그인되어 있을 때만 동작하므로 <strong>/exec</strong> URL을 사용하세요.)
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1.5">
                <h4 className="font-bold text-neutral-900 flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Q4. 구글 시트 데이터는 언제 확인 가능한가요?
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  방명록에서 [응원 남기기]를 누르는 즉시 구글 스프레드시트의 새 행으로 추가됩니다!
                  스프레드시트를 띄워놓고 방명록을 등록해 보세요. 실시간으로 한 줄씩 차곡차곡 쌓이는 마법을 보실 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-500 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-neutral-400" />
            <span>무료 구글 계정만 있으면 서버 호스팅 비용 영구 0원</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-200/80 font-semibold text-xs sm:text-sm transition-colors"
            >
              닫기
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <Link className="w-4 h-4" />
              시트 URL 입력하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
