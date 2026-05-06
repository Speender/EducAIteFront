
// Reusable Info Icon SVG
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const Footer = () => {
  return (
    <footer id="contact" className="w-full bg-black text-white px-8 md:px-[10vw] py-20 antialiased z-50 relative">
      
      {/* --- TOP SECTION: FEATURES --- */}
      <div className="flex flex-col gap-12">
        {/* Top 4 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Feature 1 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <InfoIcon />
              <h3 className="font-semibold text-lg">Note Taking</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet. Est illo exercitationem ut asperiores tempore ut minima sint. Est fugit deleniti qui deserunt voluptate in eveniet modi ut temporibus unde!
            </p>
          </div>

          {/* Feature 2 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <InfoIcon />
              <h3 className="font-semibold text-lg">Grade Tracking</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet. Est illo exercitationem ut asperiores tempore ut minima sint. Est fugit deleniti qui deserunt voluptate in eveniet modi ut temporibus unde!
            </p>
          </div>

          {/* Feature 3 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <InfoIcon />
              <h3 className="font-semibold text-lg leading-tight">Quiz and Analysis Report</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet. Est illo exercitationem ut asperiores tempore ut minima sint. Est fugit deleniti qui deserunt voluptate in eveniet modi ut temporibus unde!
            </p>
          </div>

          {/* Feature 4 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <InfoIcon />
              <h3 className="font-semibold text-lg">Open AI</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet. Est illo exercitationem ut asperiores tempore ut minima sint. Est fugit deleniti qui deserunt voluptate in eveniet modi ut temporibus unde!
            </p>
          </div>

        </div>

        {/* Bottom Feature (Full Width) */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <InfoIcon />
            <h3 className="font-semibold text-lg">Resume Generator</h3>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-5xl">
            Lorem ipsum dolor sit amet. Est illo exercitationem ut asperiores tempore ut minima sint. Est fugit deleniti qui deserunt voluptate in eveniet modi ut temporibus unde!
          </p>
        </div>
      </div>

      {/* --- DIVIDER LINE --- */}
      <div className="w-full h-[1px] bg-white/20 my-16"></div>

      {/* --- BOTTOM SECTION: LINKS & SOCIALS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Logo & Socials */}
        <div className="flex flex-col gap-6">
          <div className="text-2xl font-bold tracking-tight">
            educ<span className="text-[#00CEC8]">AI</span>te
          </div>
          <div className="flex items-center gap-4 text-white">
            {/* X (Twitter) Icon */}
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#00CEC8] cursor-pointer transition-colors"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
            {/* Instagram Icon */}
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#00CEC8] cursor-pointer transition-colors"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            {/* YouTube Icon */}
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#00CEC8] cursor-pointer transition-colors"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            {/* LinkedIn Icon */}
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#00CEC8] cursor-pointer transition-colors"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </div>
        </div>

        {/* Column 2: Use Cases */}
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-sm mb-2">Use cases</h4>
          {['UI design', 'UX design', 'Wireframing', 'Diagramming', 'Brainstorming', 'Online whiteboard', 'Team collaboration'].map(link => (
            <a key={link} href="#" className="text-white/60 text-sm hover:text-white transition-colors">{link}</a>
          ))}
        </div>

        {/* Column 3: Explore */}
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-sm mb-2">Explore</h4>
          {['Design', 'Prototyping', 'Development features', 'Design systems', 'Collaboration features', 'Design process', 'FigJam'].map(link => (
            <a key={link} href="#" className="text-white/60 text-sm hover:text-white transition-colors">{link}</a>
          ))}
        </div>

        {/* Column 4: Resources */}
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-sm mb-2">Resources</h4>
          {['Blog', 'Best practices', 'Colors', 'Color wheel', 'Support', 'Developers', 'Resource library'].map(link => (
            <a key={link} href="#" className="text-white/60 text-sm hover:text-white transition-colors">{link}</a>
          ))}
        </div>

      </div>

    </footer>
  );
};

export default Footer;
