import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-slate-800/80 bg-slate-950 py-2 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[11px]">
          © {new Date().getFullYear()} My Pension Helper. Disclaimer: For educational purposes only.
        </p>
      </div>
    </footer>
  );
}