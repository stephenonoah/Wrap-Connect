import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  Check, User, Mail, Phone, MapPin, Car, Info,
  Banknote, Calendar, ArrowRight, ArrowLeft, Home, Map, Route, Briefcase
} from "lucide-react";

// Initialize Supabase using Vite Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Apply() {
  const [step, setStep] = useState(1);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "",
    age: "", gender: "", job: "",
    type: "", make: "", year: "", miles: "", license: "", wrapType: "",
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setForm((f) => ({ ...f, [name]: target.checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.terms || formStatus === "submitting") return;
    
    setFormStatus("submitting");

    try {
      // 1. Save Application Data to Supabase Database
      const { error: dbError } = await supabase
        .from("applications")
        .insert([{
          full_name: form.name,
          email_address: form.email,
          phone_number: form.phone,
          home_address: form.address,
          city: form.city,
          state: form.state,
          age: form.age,
          gender: form.gender,
          current_job: form.job,
          vehicle_type: form.type,
          vehicle_make: form.make,
          vehicle_year: form.year,
          average_miles: form.miles,
          has_license: form.license,
          wrap_preference: form.wrapType
        }]);

      if (dbError) throw dbError;

      // 2. Call the Vercel API Route to trigger the Brevo Email
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            age: form.age,
            gender: form.gender,
            job: form.job,
            type: form.type,
            make: form.make,
            year: form.year,
            miles: form.miles,
            license: form.license,
            wrapType: form.wrapType
          })
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

      // 3. Reset Form on Success
      setFormStatus("success");
      setStep(1);
      setForm({ 
        name: "", email: "", phone: "", address: "", city: "", state: "", 
        age: "", gender: "", job: "", type: "", make: "", year: "", 
        miles: "", license: "", wrapType: "", terms: false 
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
      <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-1">
            <span className="text-slate-900">Wrap</span>
            <span className="text-blue-600">Connect</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/#how" className="hover:text-blue-600 transition-colors">How It Works</Link>
            <Link to="/#legitimacy" className="hover:text-blue-600 transition-colors">Legitimacy</Link>
          </div>
          <Link to="/" className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold hover:bg-blue-200 transition">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* MAIN APPLICATION AREA */}
      <div className="px-6 lg:px-12 pt-10 md:pt-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT: THE MULTI-STEP FORM */}
          <div className="lg:col-span-7 relative z-10 text-white">
            {formStatus === "success" ? (
              <div className="bg-white/10 backdrop-blur-md p-10 rounded-[2rem] text-center border border-white/20 mt-10">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-extrabold text-white">Thank You!</h3>
                <p className="mt-4 text-slate-300 font-medium leading-relaxed max-w-md mx-auto text-lg">
                  Your application has been received. Our team will review your information and contact you if your vehicle matches one of our current advertising campaigns.
                </p>
                <button onClick={() => setFormStatus("idle")} className="mt-10 px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xl">
                  Return to Application
                </button>
              </div>
            ) : (
              <div className="bg-slate-800/50 p-8 md:p-10 rounded-[2rem] border border-slate-700">
                
                {/* Header & Step Indicator */}
                <div className="mb-10">
                  <h1 className="text-3xl font-extrabold text-white mb-6">Driver Application</h1>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-700 rounded-full -z-10"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full -z-10 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                    
                    {[1, 2, 3].map((num) => (
                      <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-700 text-slate-400'}`}>
                        {num}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mt-3 uppercase tracking-wider">
                    <span>Personal</span>
                    <span>Vehicle</span>
                    <span>Submit</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  
                  {/* STEP 1: PERSONAL INFO */}
                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3 className="text-xl font-bold mb-4 text-blue-400">Basic Information</h3>
                      <IconField icon={User} placeholder="Full Name" name="name" value={form.name} onChange={handleChange} />
                      <div className="grid grid-cols-2 gap-4">
                        <IconField icon={Mail} placeholder="Email Address" type="email" name="email" value={form.email} onChange={handleChange} />
                        <IconField icon={Phone} placeholder="Phone Number" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <IconField icon={User} placeholder="Age" name="age" value={form.age} onChange={handleChange} type="number" />
                        <div className="flex items-center gap-4 bg-slate-900/50 rounded-xl border border-slate-600 px-4">
                          <label className="flex items-center gap-2 cursor-pointer py-4">
                            <input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleChange} required className="w-4 h-4 accent-blue-500 bg-slate-800 border-slate-600" />
                            <span className="text-slate-300 font-bold text-sm">Male</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer py-4">
                            <input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleChange} required className="w-4 h-4 accent-blue-500 bg-slate-800 border-slate-600" />
                            <span className="text-slate-300 font-bold text-sm">Female</span>
                          </label>
                        </div>
                      </div>

                      <IconField icon={Briefcase} placeholder="Current Job" name="job" value={form.job} onChange={handleChange} />
                      
                      <div className="pt-2">
                        <IconField icon={Home} placeholder="Home Address" name="address" value={form.address} onChange={handleChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <IconField icon={MapPin} placeholder="City" name="city" value={form.city} onChange={handleChange} />
                        <IconField icon={Map} placeholder="State" name="state" value={form.state} onChange={handleChange} />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: VEHICLE DETAILS & WRAP PREFERENCE */}
                  {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-blue-400">Vehicle Details</h3>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                          <IconField icon={Car} placeholder="Vehicle Type (e.g. SUV, Sedan, Truck)" name="type" value={form.type} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <IconField icon={Info} placeholder="Make (e.g. Toyota)" name="make" value={form.make} onChange={handleChange} />
                           <IconField icon={Calendar} placeholder="Year (e.g. 2020)" name="year" value={form.year} onChange={handleChange} />
                        </div>
                        <div className="mt-4">
                          <IconField icon={Route} placeholder="Average miles driven per week" name="miles" value={form.miles} onChange={handleChange} type="number" />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        <label className="block text-sm font-bold text-slate-300 mb-4">Do you have a valid Driver's License?</label>
                        <div className="flex gap-4">
                          {["Yes", "No"].map((option) => (
                            <label key={option} className="flex-1 flex items-center gap-3 cursor-pointer bg-slate-900/50 p-4 rounded-xl border border-slate-600 hover:border-blue-500 transition-colors">
                              <input 
                                type="radio" name="license" value={option} 
                                checked={form.license === option} onChange={handleChange} 
                                required className="w-5 h-5 accent-blue-500 bg-slate-800 border-slate-600" 
                              />
                              <span className="text-white font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        <label className="block text-sm font-bold text-slate-300 mb-4">Brand Wrap Size Preference:</label>
                        <div className="space-y-3">
                          {["Full", "Half", "Doors only"].map((option) => (
                            <label key={option} className="flex items-center gap-4 cursor-pointer bg-slate-900/50 p-4 rounded-xl border border-slate-600 hover:border-blue-500 transition-colors">
                              <input 
                                type="radio" name="wrapType" value={option} 
                                checked={form.wrapType === option} onChange={handleChange} 
                                required className="w-5 h-5 accent-blue-500 bg-slate-800 border-slate-600" 
                              />
                              <span className="text-white font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* STEP 3: REVIEW & SUBMIT */}
                  {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3 className="text-xl font-bold mb-4 text-blue-400">Final Review</h3>
                      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-3 text-slate-300">
                         <p><strong className="text-white">Applicant:</strong> {form.name} ({form.age}, {form.gender})</p>
                         <p><strong className="text-white">Location:</strong> {form.city}, {form.state}</p>
                         <p><strong className="text-white">Job:</strong> {form.job}</p>
                         <p><strong className="text-white">Vehicle:</strong> {form.year} {form.make} {form.type}</p>
                         <p><strong className="text-white">License:</strong> {form.license}</p>
                         <p><strong className="text-white">Preference:</strong> {form.wrapType} Wrap</p>
                      </div>

                      <div className="pt-4">
                        <label className="flex items-start gap-4 text-sm cursor-pointer bg-slate-900/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
                          <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} required className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-800 accent-blue-500" />
                          <span className="text-slate-300 font-medium leading-relaxed">
                            I confirm my vehicle has original factory paint in good condition and all provided information is accurate. I agree to be contacted by WrapConnect regarding advertising opportunities.
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Form Navigation Buttons */}
                  <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-700">
                    {step > 1 ? (
                      <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-700 text-white font-bold hover:bg-slate-600 transition">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                    ) : <div></div>}

                    {step < 3 ? (
                      <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button type="submit" disabled={!form.terms || formStatus === "submitting"} className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-green-500 text-white font-extrabold text-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-green-500/20">
                        {formStatus === "submitting" ? "Submitting..." : "Submit Application"}
                      </button>
                    )}
                  </div>

                </form>
              </div>
            )}
          </div>

          {/* RIGHT: WHAT HAPPENS NEXT CARD */}
          <div className="lg:col-span-5 relative z-20 mt-10 lg:mt-0">
            <div className="bg-[#0B1528] rounded-[2rem] p-8 shadow-2xl border border-slate-800 sticky top-32">
              <h2 className="text-white text-3xl font-extrabold mb-8">What<br/>Happens<br/>Next?</h2>
              
              <div className="bg-white rounded-2xl p-6 lg:p-8 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">1. We Review</div>
                    <div className="text-sm text-slate-500 font-medium">We assess your vehicle and location details.</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">2. We Contact You</div>
                    <div className="text-sm text-slate-500 font-medium">If matched to a campaign, we reach out within 2-5 days.</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">3. Get Started</div>
                    <div className="text-sm text-slate-500 font-medium">Free professional installation and you begin earning.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Input Field with Icon
function IconField({ icon: Icon, placeholder, name, value, onChange, type = "text" }: any) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type={type} name={name} value={value} onChange={onChange} required placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-600 bg-slate-900/50 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-bold transition-all shadow-inner"
      />
    </div>
  );
}