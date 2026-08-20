import React from 'react';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenTargetCalc: () => void;
  onResetDefaults: () => void;
  onExportCSV: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenGuide, onOpenTargetCalc, onResetDefaults, onExportCSV }) => {
  return (
    <div className="p-4 border-b border-slate-800">
      <h1 className="text-xl font-bold text-emerald-400 mb-4">연금 도우미</h1>
      <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto">
        <button onClick={onOpenGuide} className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition text-left whitespace-nowrap flex-shrink-0">
          가이드
        </button>
        <button onClick={onOpenTargetCalc} className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition text-left whitespace-nowrap flex-shrink-0">
          역산기
        </button>
        <button onClick={onResetDefaults} className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition text-left whitespace-nowrap flex-shrink-0">
          초기화
        </button>
        <button onClick={onExportCSV} className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition text-left whitespace-nowrap flex-shrink-0">
          CSV
        </button>
      </div>
    </div>
  );
};

export default Header;