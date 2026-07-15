import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Check, Star, Menu, X, ShieldCheck, Wallet, Calendar, AlertCircle,
  ArrowRight, Car, Building2, UserCircle
} from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle the navbar blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-0 md:p-8 xl:p-12 flex justify-center items-start font-sans selection:bg-blue-600 selection:text-white">
      
      {/* GLOBAL FLOATING APP CONTAINER */}
      <div className="w-full max-w-7xl bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* NAVBAR */}
        <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm" : "bg-white border-b border-transparent"}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
            <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-1">
              <span className="text-slate-900">Wrap</span>
              <span className="text-blue-600">Connect</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
              <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
              <a href="#how" className="hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#legitimacy" className="hover:text-blue-600 transition-colors">Legitimacy</a>
              <a href="#reviews" className="hover:text-blue-600 transition-colors">Reviews</a>
            </div>
            <Link to="/apply" className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="md:hidden text-slate-900" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 px-6 py-6 flex flex-col gap-6 text-base font-bold shadow-xl absolute w-full">
              <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
              <a href="#how" onClick={() => setMenuOpen(false)}>How It Works</a>
              <a href="#legitimacy" onClick={() => setMenuOpen(false)}>Legitimacy</a>
              <a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
              <Link to="/apply" onClick={() => setMenuOpen(false)} className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-blue-600 text-white">Apply Now</Link>
            </div>
          )}
        </nav>

        {/* HERO SECTION */}
        <section id="home" className="relative w-full min-h-[85vh] md:min-h-0 md:aspect-[16/9] lg:min-h-[600px] flex items-center overflow-hidden bg-slate-900 py-24 md:py-0">
          <div className="absolute inset-0 w-full h-full">
            <img src="/hero.jpeg" alt="WrapConnect branded SUV" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-slate-950/70 md:bg-transparent md:bg-gradient-to-r md:from-slate-950/90 md:via-slate-950/50 md:to-transparent" />
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-start justify-center">
            <div className="max-w-xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Turn Every Mile Into <span className="text-blue-500">Opportunity</span>
              </h1>
              <p className="mt-6 text-lg text-slate-200 leading-relaxed font-medium">
                Drivers Earn. Brands Get Seen. Everyone Wins. WrapConnect connects businesses with everyday drivers through professional vehicle advertising campaigns.
              </p>
              <div className="mt-8 flex gap-4 flex-wrap">
                <Link to="/apply" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-600/30">
                  Apply to Drive <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#how" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 backdrop-blur-md transition">
                  See how it works
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT / POSITIONING */}
        <section id="about" className="py-20 bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">Our Role</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">The Ultimate Marketing Intermediary</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              WrapConnect is not the company physically wrapping vehicles. We manage relationships, coordinate campaigns, and distribute payments securely across three parties.
            </p>
            <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <Building2 className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900">Brands & Advertisers</h3>
                <p className="mt-3 text-slate-600 font-medium">Companies looking to advertise their products or services on a massive mobile scale.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <ShieldCheck className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900">Wrap Companies</h3>
                <p className="mt-3 text-slate-600 font-medium">Professional vehicle wrap installers who print and apply the advertisements safely.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <UserCircle className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900">Qualified Drivers</h3>
                <p className="mt-3 text-slate-600 font-medium">Individuals who earn extra income by seamlessly displaying ads on their personal vehicles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-12 grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <span className="text-sm font-bold uppercase tracking-widest text-blue-600">For Drivers</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">Turn your daily drive into extra income.</h2>
              <div className="mt-12 space-y-10">
                {[
                  { n: "01", t: "Apply", d: "Complete our online application with your vehicle details and contact information." },
                  { n: "02", t: "Vehicle Review", d: "Our team reviews your vehicle to determine eligibility based on campaign requirements, condition, and driving habits." },
                  { n: "03", t: "Campaign Matching", d: "When a brand selects vehicles matching your profile, we'll contact you with duration and estimated compensation." },
                  { n: "04", t: "Professional Wrap", d: "Your vehicle is wrapped by an approved partner using high-quality materials that protect your paint." },
                  { n: "05", t: "Get Paid", d: "After installation, receive payments according to the campaign agreement." },
                  { n: "06", t: "Wrap Removal", d: "When the campaign ends, the wrap is professionally removed at no cost to you." }
                ].map((step) => (
                  <div key={step.n} className="flex gap-6">
                    <div className="font-extrabold text-3xl text-blue-100 pt-1">{step.n}</div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{step.t}</h3>
                      <p className="mt-2 text-slate-600 font-medium leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-slate-900 rounded-[2rem] p-10 text-white sticky top-32 shadow-xl shadow-slate-900/10">
                <span className="text-sm font-bold uppercase tracking-widest text-blue-400">For Businesses</span>
                <h3 className="mt-4 text-2xl font-extrabold">Tell the world about your brand.</h3>
                <p className="mt-4 text-slate-300 font-medium leading-relaxed">
                  Partner with WrapConnect to launch mobile advertising campaigns that generate thousands of daily impressions. Our team handles everything:
                </p>
                <ul className="mt-8 space-y-4 font-medium text-slate-200">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> Plan your advertising campaign</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> Recruit qualified drivers</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> Coordinate professional wrapping</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> Monitor campaign progress</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> Manage driver payments</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT EVERY APPLICANT SHOULD KNOW (LEGITIMACY) */}
        <section id="legitimacy" className="py-20 bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">Transparency Matters</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 max-w-2xl">What every applicant should know.</h2>
            
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <Wallet className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No Upfront Fees</h3>
                <p className="mt-2 text-slate-600 font-medium">Drivers are never required to pay to apply. All approved wrapping costs are covered as part of the campaign.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <Car className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Professional Installation Only</h3>
                <p className="mt-2 text-slate-600 font-medium">Installed by approved partners using premium vinyl designed for vehicles. It is completely safe for factory paint.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <Calendar className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Campaign Payments</h3>
                <p className="mt-2 text-slate-600 font-medium">Compensation varies by campaign duration, vehicle type, and location. Payments are made securely on a schedule.</p>
              </div>
              <div className="bg-red-50 p-8 rounded-2xl shadow-sm border border-red-100">
                <AlertCircle className="w-8 h-8 text-red-600 mb-4" />
                <h3 className="text-lg font-bold text-red-900">Fraud Awareness</h3>
                <p className="mt-2 text-red-800 font-medium">WrapConnect will never ask you to pay an application fee, purchase gift cards, or send money from your purse.</p>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">Testimonials</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">What they are saying.</h2>
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {[
                { n: "David M.", l: "Seattle, WA", q: "The application process was simple, and the team kept me informed throughout the campaign. Installation was professional, and payments arrived on schedule." },
                { n: "Amanda R.", l: "Tacoma, WA", q: "I never imagined my daily commute could generate extra income. Everything was handled professionally from start to finish." },
                { n: "Jason T.", l: "Bellevue, WA", q: "Excellent customer service and clear communication. The wrap looked amazing, and removal was quick when the campaign ended." },
                { n: "Marketing Director", l: "Regional Retail Company", q: "WrapConnect helped us launch a regional advertising campaign that significantly increased our local brand visibility. Their coordination and communication were outstanding." }
              ].map((r, i) => (
                <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-blue-500 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
                    <p className="text-slate-700 font-medium leading-relaxed">"{r.q}"</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="font-bold text-slate-900">{r.n}</p>
                    <p className="text-sm text-slate-500 font-medium">{r.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MINIMAL FOOTER */}
        <footer className="bg-slate-950 text-slate-400 py-10 text-center text-sm font-medium border-t-4 border-blue-600">
          <p>© 2026 WrapConnect. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
}