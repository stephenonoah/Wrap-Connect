import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Check, User, Mail, Phone, MapPin, Car, Info,
  ShieldCheck, Banknote, Calendar
} from "lucide-react";

export default function Apply() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", location: "",
    year: "", make: "", model: "", terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.terms) return;
    
    setFormStatus("submitting");

    try {
      // Send data to the Vercel serverless function
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Show success UI and clear the form
      setFormStatus("success");
      setForm({ 
        name: "", email: "", phone: "", location: "", 
        year: "", make: "", model: "", terms: false 
      });

    } catch (error) {
      console.error("Submission error:", error);
      setFormStatus("idle");
      alert("There was an error submitting your application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-20">
      
      {/* STATIC NAVBAR */}
      <nav className="w-full bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-1">
            <span className="text-slate-900">Wrap</span>
            <span className="text-blue-600">Connect</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/" className="hover:text-blue-600 transition-colors">How It Works</Link>
            <Link to="/" className="hover:text-blue-600 transition-colors">Legitimacy</Link>
          </div>
          <Link to="/" className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold hover:bg-blue-200 transition">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* TOP SECTION: WHITE BACKGROUND (Job Requirements & Earnings) */}
      <div className="bg-white pt-20 pb-48 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Earn Money Driving — <br /> Apply Now
            </h1>
            <div className="w-16 h-2 bg-blue-600 mt-6 mb-8 rounded-full"></div>
            
            <p className="text-lg text-slate-600 font-medium mb-8">
              Review the campaign requirements below. If your vehicle and driving habits qualify, you can earn competitive passive income just by driving your normal daily route.
            </p>

            {/* Requirements Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-xl"><Banknote className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h4 className="font-bold text-slate-900">Campaign Earnings</h4>
                  <p className="text-sm text-slate-600 mt-1 font-medium">Payouts vary by campaign, vehicle, and route. Paid monthly.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-xl"><Car className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h4 className="font-bold text-slate-900">Vehicle Requirements</h4>
                  <p className="text-sm text-slate-600 mt-1 font-medium">Original factory paint required. No pre-existing body damage.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-xl"><ShieldCheck className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h4 className="font-bold text-slate-900">Zero Fees</h4>
                  <p className="text-sm text-slate-600 mt-1 font-medium">No application fees. Professional installation is completely free.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: NAVY BACKGROUND (Form & Overlapping Card) */}
      <div className="px-6 lg:px-12 -mt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT: THE FORM */}
          <div className="lg:col-span-7 relative z-10 text-white">
            {formStatus === "success" ? (
              <div className="bg-white/10 backdrop-blur-md p-10 rounded-[2rem] text-center border border-white/20">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Application Received</h3>
                <p className="mt-4 text-slate-300 font-medium leading-relaxed max-w-sm mx-auto">
                  Thank you for applying. Our team will review your vehicle details and contact you if a campaign matches your profile.
                </p>
                <button onClick={() => setFormStatus("idle")} className="mt-8 px-6 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition">
                  Submit Another Vehicle
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Personal Info</h3>
                  <IconField icon={User} placeholder="Full Name" name="name" value={form.name} onChange={handleChange} />
                  <IconField icon={Mail} placeholder="Email Address" type="email" name="email" value={form.email} onChange={handleChange} />
                  <IconField icon={Phone} placeholder="Phone Number" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                  <IconField icon={MapPin} placeholder="State and City (e.g. Ikeja, Lagos)" name="location" value={form.location} onChange={handleChange} />
                </div>

                <div className="space-y-4 pt-6">
                  <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Vehicle Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <IconField icon={Calendar} placeholder="Year (e.g. 2018)" name="year" value={form.year} onChange={handleChange} />
                    <IconField icon={Car} placeholder="Make (e.g. Toyota)" name="make" value={form.make} onChange={handleChange} />
                  </div>
                  <IconField icon={Info} placeholder="Model (e.g. Camry)" name="model" value={form.model} onChange={handleChange} />
                </div>

                <div className="pt-6">
                  <label className="flex items-start gap-4 text-sm cursor-pointer">
                    <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} required className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-800 accent-blue-500" />
                    <span className="text-slate-400 font-medium leading-relaxed">
                      I confirm my vehicle has original factory paint in good condition. I understand WrapConnect will <strong className="text-white">never</strong> ask me for an application fee.
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={!form.terms || formStatus === "submitting"} className="mt-8 w-full md:w-auto inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-slate-900 font-extrabold text-lg hover:bg-slate-100 disabled:opacity-50 transition-all shadow-xl">
                  {formStatus === "submitting" ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: OVERLAPPING CARD EXACTLY LIKE MOCKUP */}
          <div className="lg:col-span-5 relative z-20">
            <div className="bg-[#0B1528] rounded-[2rem] p-8 lg:-mt-48 shadow-2xl border border-slate-800">
              <h2 className="text-white text-3xl font-extrabold mb-8">What<br/>Happens<br/>Next</h2>
              
              {/* Progress Bar Graphic */}
              <div className="flex items-center gap-2 mb-8">
                <div className="h-1 flex-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>

              {/* White Inner Steps Card */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-slate-900" />
                  </div>
                  <div className="font-bold text-slate-900 text-lg">Application Review</div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-slate-900" />
                  </div>
                  <div className="font-bold text-slate-900 text-lg">Campaign Match</div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Car className="w-6 h-6 text-slate-900" />
                  </div>
                  <div className="font-bold text-slate-900 text-lg">Wrap & Earn</div>
                </div>

                <div className="pt-4">
                  <Link to="/" className="w-full inline-flex justify-center items-center py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Input Field with Icon for the dark background
function IconField({ icon: Icon, placeholder, name, value, onChange, type = "text" }: any) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type={type} name={name} value={value} onChange={onChange} required placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/50 font-bold transition-all shadow-inner"
      />
    </div>
  );
}