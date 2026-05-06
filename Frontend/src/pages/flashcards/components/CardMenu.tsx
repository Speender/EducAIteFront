export function CardMenu() {
  return (
    <div className="space-y-4 w-full">
      {/* Front Input */}
      <div className="group">
        <input
          type="text"
          placeholder="Enter the front"
          className="w-full rounded-[24px] border border-white/10 bg-white/[0.03] px-8 py-6 text-xl text-white placeholder:text-white/20 outline-none focus:border-[#00CEC8]/40 focus:bg-white/[0.05] transition-all"
        />
      </div>

      {/* Back Input */}
      <div className="group relative">
        <textarea
          placeholder="Enter the back"
          rows={6}
          className="w-full rounded-[24px] border border-white/10 bg-white/[0.03] px-8 py-6 text-xl text-white placeholder:text-white/20 outline-none focus:border-[#00CEC8]/40 focus:bg-white/[0.05] transition-all resize-none"
        />
        
        {/* Toolbar - Matching the icons from your screenshot */}
        <div className="flex items-center justify-between bg-[#0A0A0A] border border-white/10 rounded-full px-6 py-3 mt-4 shadow-xl">
          <div className="flex items-center gap-6">
            <button className="text-white/40 hover:text-[#00CEC8] transition-colors text-xl" title="Add Image">🖼️</button>
            <button className="text-white/40 hover:text-[#00CEC8] transition-colors text-xl font-mono" title="Code Block">{'< >'}</button>
            <button className="text-white/40 hover:text-[#00CEC8] transition-colors text-xl" title="List">☰</button>
            <button className="text-white/40 hover:text-[#00CEC8] transition-colors text-lg" title="Equation">∑</button>
          </div>
          
          <button className="bg-white text-black font-bold px-10 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider shadow-lg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
