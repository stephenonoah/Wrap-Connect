import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";
import {
  Check, User, Mail, Phone, MapPin, Car, Info,
  ShieldCheck, Banknote, Calendar, UploadCloud, ArrowRight, ArrowLeft
} from "lucide-react";

// Initialize Supabase using Vite Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Apply() {
  const [step, setStep] = useState(1);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", location: "",
    year: "", make: "", model: "", color: "", habits: "", 
    terms: false,
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setForm((f) => ({ ...f, [name]: target.checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.terms || formStatus === "submitting") return;
    
    setFormStatus("submitting");

    try {
      let photoUrl = "";

      // 1. Compress & Upload Vehicle Photo to Supabase Storage
      if (photo) {
        // Client-side compression settings
        const compressionOptions = {
          maxSizeMB: 1,          // Compress to max 1MB
          maxWidthOrHeight: 1920, // Max resolution
          useWebWorker: true,
        };

        // Compress the image before uploading
        const compressedFile = await imageCompression(photo, compressionOptions);
        
        const fileExt = compressedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("vehicle-photos")
          .upload(fileName, compressedFile);

        if (uploadError) throw uploadError;
        
        // Generate Public URL for the compressed image
        const { data: publicUrlData } = supabase.storage
          .from("vehicle-photos")
          .getPublicUrl(uploadData.path);
          
        photoUrl = publicUrlData.publicUrl;
      }

      // 2. Save Application Data to Supabase Database
      const [city = form.location, state = ""] = form.location.split(",").map(s => s.trim());

      const { error: dbError } = await supabase
        .from("applications")
        .insert([{
          full_name: form.name,
          email_address: form.email,
          phone_number: form.phone,
          city: city,
          state: state || form.location,
          vehicle_make: form.make,
          vehicle_model: form.model,
          vehicle_year: form.year,
          vehicle_color: form.color || "Not specified",
          driving_habits: form.habits || "Not specified",
          vehicle_photo_url: photoUrl
        }]);

      if (dbError) throw dbError;

      // 3. Optional Brevo webhook integration can go here
      // fetch('/api/send-email', { ... })

      setFormStatus("success");
      setStep(1);
      setForm({ 
        name: "", email: "", phone: "", location: "", 
        year: "", make: "", model: "", color: "", habits: "", terms: false 
      });
      setPhoto(null);

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
                      <IconField icon={Mail} placeholder="Email Address" type="email" name="email" value={form.email} onChange={handleChange} />
                      <IconField icon={Phone} placeholder="Phone Number" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                      <IconField icon={MapPin} placeholder="City, State (e.g. Austin, TX)" name="location" value={form.location} onChange={handleChange} />
                    </div>
                  )}

                  {/* STEP 2: VEHICLE DETAILS */}
                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3 className="text-xl font-bold mb-4 text-blue-400">Vehicle & Driving</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <IconField icon={Car} placeholder="Make (e.g. Toyota)" name="make" value={form.make} onChange={handleChange} />
                        <IconField icon={Info} placeholder="Model (e.g. Camry)" name="model" value={form.model} onChange={handleChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <IconField icon={Calendar} placeholder="Year (e.g. 2020)" name="year" value={form.year} onChange={handleChange} />
                         <IconField icon={Info} placeholder="Color (e.g. Silver)" name="color" value={form.color} onChange={handleChange} />
                      </div>
                      
                      {/* File Upload UI */}
                      <div className="mt-6 pt-4 border-t border-slate-700">
                        <label className="block text-sm font-bold text-slate-300 mb-2">Upload Vehicle Photo (Outside View)</label>
                        <div className="relative group cursor-pointer">
                           <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                           <div className="w-full border-2 border-dashed border-slate-600 rounded-xl p-6 text-center group-hover:border-blue-500 group-hover:bg-slate-700/50 transition-all">
                              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-blue-400" />
                              <p className="text-slate-300 font-medium">{photo ? photo.name : "Tap to choose a clear photo of your vehicle"}</p>
                              <p className="text-xs text-slate-500 mt-1">JPEG, PNG, WebP (Will be auto-compressed)</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: REVIEW & SUBMIT */}
                  {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3 className="text-xl font-bold mb-4 text-blue-400">Final Review</h3>
                      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                         <p className="text-slate-300 mb-2"><strong className="text-white">Applicant:</strong> {form.name} ({form.location})</p>
                         <p className="text-slate-300 mb-2"><strong className="text-white">Vehicle:</strong> {form.year} {form.make} {form.model}</p>
                         <p className="text-slate-300"><strong className="text-white">Photo:</strong> {photo ? "Attached ✅" : "Missing ❌"}</p>
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
                        {formStatus === "submitting" ? "Submitting securely..." : "Submit Application"}
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

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <div className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                    <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-900 font-medium">
                      <strong className="block mb-1">Fraud Protection Guarantee</strong>
                      WrapConnect will <strong className="font-bold">never</strong> ask you to pay an application fee, purchase gift cards, or send money.
                    </p>
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