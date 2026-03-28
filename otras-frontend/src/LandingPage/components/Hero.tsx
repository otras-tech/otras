import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, GraduationCap, BrainCircuit, Sparkles } from "lucide-react";

const heroSlides = [
  {
    language: "English",
    headline: "Find the Right Career Opportunity with AI",
    subtext:
      "Discover jobs, internships, exams, mock tests, and personalized guidance — all in one smart platform.",
  },
  {
    language: "తెలుగు",
    headline: "AI తో మీకు సరైన కెరీర్ అవకాశాన్ని కనుగొనండి",
    subtext:
      "ఉద్యోగాలు, ఇంటర్న్‌షిప్‌లు, పరీక్షలు, మాక్ టెస్టులు, వ్యక్తిగత కెరీర్ మార్గదర్శకత — అన్నీ ఒకే స్మార్ట్ ప్లాట్‌ఫార్మ్‌లో.",
  },
  {
    language: "हिंदी",
    headline: "AI के साथ सही करियर अवसर खोजें",
    subtext:
      "नौकरियां, इंटर्नशिप, परीक्षाएं, मॉक टेस्ट और व्यक्तिगत करियर मार्गदर्शन — सब कुछ एक ही स्मार्ट प्लेटफ़ॉर्म में.",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const current = heroSlides[index];

  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_25%)]" />

      <div className="section relative grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            
            Smart Career Platform • {current.language}
          </div>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
            {current.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50 md:text-xl">
            {current.subtext}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={() => navigate("/dashboard")} 
              className="hero-btn-primary"
            >
              Get Started <ArrowRight size={18} />
            </button>

            <a href="#opportunities" className="hero-btn-secondary">
              Explore Opportunities
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="hero-chip-blue">
              <BriefcaseBusiness size={16} />
              Jobs & Internships
            </div>
            <div className="hero-chip-blue">
              <GraduationCap size={16} />
              Exams & Practice
            </div>
            <div className="hero-chip-blue">
              <BrainCircuit size={16} />
              AI Recommendations
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="glass-card-blue p-6 md:p-8">
            <div className="grid gap-5">
              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
                <p className="text-sm text-slate-500">AI Career Match Score</p>
                <h3 className="mt-2 text-5xl font-bold text-blue-900">92%</h3>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-blue-100">
                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Recommended Path</p>
                  <h4 className="mt-2 text-2xl font-bold text-slate-900">
                    Software Engineer
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Based on your skills, interests, and growth trends.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Upcoming Alert</p>
                  <h4 className="mt-2 text-2xl font-bold text-slate-900">
                    SSC CGL 2026
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Registration opens soon. Stay ready with practice tests.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 p-5">
                <p className="text-sm font-medium text-slate-600">One platform for everything</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl border border-blue-100 bg-white p-3 font-medium text-blue-900 shadow-sm">
                    Jobs
                  </div>
                  <div className="rounded-2xl border border-blue-100 bg-white p-3 font-medium text-blue-900 shadow-sm">
                    Exams
                  </div>
                  <div className="rounded-2xl border border-blue-100 bg-white p-3 font-medium text-blue-900 shadow-sm">
                    AI Guide
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-300/30 blur-3xl" />
        </div>
      </div>
    </section>
  );
}