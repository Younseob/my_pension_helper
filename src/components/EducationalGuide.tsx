import React from 'react';
import { BookOpen, X, Shield, Zap, RefreshCw, Award, PieChart, CheckCircle2 } from 'lucide-react';

interface EducationalGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EducationalGuide({ isOpen, onClose }: EducationalGuideProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-50">초보자를 위한 연금 투자 핵심 개념 가이드</h3>
              <p className="text-xs text-slate-300">S&P 500, 나스닥 100, 70:30 자산배분, 그리고 4% 룰 완벽 이해하기</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Card 1: S&P 500 vs NASDAQ 100 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-sky-400 font-bold text-base">
                <Shield className="w-5 h-5" />
                <h4>S&P 500 지수 (70% 배분)</h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                미국 증시에 상장된 <strong className="text-white">대표 500개 우량 기업</strong>(애플, 마이크로소프트, 버크셔 해서웨이, 알파벳 등)의 주가를 모아놓은 대표 지수입니다.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>과거 90년간 연평균 수익률: <strong>약 9.8%~10%</strong></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>특징: 미국 경제 전체에 투자하는 단단한 뼈대 역할</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-pink-400 font-bold text-base">
                <Zap className="w-5 h-5" />
                <h4>NASDAQ 100 지수 (30% 배분)</h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                나스닥 시장에 상장된 금융주를 제외한 <strong className="text-white">상위 100개 혁신 기술 기업</strong>(엔비디아, 메타, 테슬라 등)에 집중 투자하는 고성장 지수입니다.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>과거 30년간 연평균 수익률: <strong>약 13.8%~14%</strong></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>특징: 변동성은 크지만 복리 자산을 빠르게 키우는 부스터</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Why 70:30 Portfolio? */}
          <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 rounded-2xl p-5 border border-emerald-500/20 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
              <PieChart className="w-5 h-5" />
              <h4>왜 S&P 500 : NASDAQ 100 = 70 : 30 조합인가요?</h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              나스닥 100% 투자는 장기 폭락장에서 버티기 힘들고, S&P 500 100% 투자는 수익률이 조금 아쉬울 수 있습니다. <br />
              <strong className="text-emerald-300">70%의 S&P 500으로 하방 안정성</strong>을 다지고, <strong className="text-emerald-300">30%의 NASDAQ 100으로 수익률 부스터</strong>를 다는 전략은 초보자도 안심하고 15년간 장기 모아가기에 가장 이상적인 골디락스(Goldilocks) 비중입니다.
            </p>
          </div>

          {/* Card 3: The 4% Rule Explained */}
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-base">
              <RefreshCw className="w-5 h-5" />
              <h4>4% 룰 (Trinity Study 연금 인출 법칙) 이란?</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="font-bold text-slate-50 mb-1">1. 은퇴시 자산 산정</div>
                <div className="text-slate-300">15년간 쌓아올린 은퇴 자산(예: 4.78억 원)을 확정합니다.</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="font-bold text-purple-300 mb-1">2. 첫해 4% 인출</div>
                <div className="text-slate-300">총 자산의 4%(예: 연 1,913만 원, 월 159만 원)를 떼어 은퇴 생활비로 씁니다.</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="font-bold text-emerald-400 mb-1">3. 남은 96% 자산 재투자</div>
                <div className="text-slate-300">남은 96% 자산이 연 7~11% 수익률로 계속 성장하여 자산이 마르지 않고 불어납니다.</div>
              </div>
            </div>
          </div>

          {/* Card 4: Tax-Saving Account Recommendation */}
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
              <Award className="w-5 h-5" />
              <h4>💡 실전 절세 계좌 활용 꿀팁 (ISA & 연금저축 & IRP)</h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              국내 상장 미국 S&P 500 / 나스닥 100 ETF(예: TIGER 미국S&P500, ACE 미국나스닥100 등)를 일반 계좌가 아닌 <strong className="text-amber-300">연금저축펀드, IRP, ISA 계좌</strong>에서 모아가면 배당소득세(15.4%) 과세이연 및 연말정산 세액공제 혜택을 받아 수익률이 훨씬 커집니다.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            확인했습니다 (닫기)
          </button>
        </div>
      </div>
    </div>
  );
}
