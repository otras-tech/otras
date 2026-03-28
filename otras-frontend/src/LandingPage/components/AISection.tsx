
import { BrainCircuit, SearchCheck, Route, BookOpenCheck } from "lucide-react";

const points = [
  {
    icon: BrainCircuit,
    title: "Skill Analysis",
    desc: "Understand your strengths, identify gaps, and improve readiness with intelligent analysis.",
  },
  {
    icon: Route,
    title: "Career Path Suggestions",
    desc: "Receive focused career suggestions aligned with your interests and long-term goals.",
  },
  {
    icon: SearchCheck,
    title: "Job Matching",
    desc: "Get matched with roles and opportunities based on your skill profile and preferences.",
  },
  {
    icon: BookOpenCheck,
    title: "Exam Preparation Guidance",
    desc: "Discover relevant exams and personalized preparation strategies that fit your ambition.",
  },
];

export default function AISection() {
  return (
    <section id="ai-engine" className="blue-section py-20">
      <div className="section">
        <div className="rounded-[36px] border border-blue-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 p-8 md:p-12">
          <div className="mb-10 max-w-3xl">
            <p className="section-tag">AI Feature Highlight</p>
            <h2 className="section-title">Smart Career Guidance Engine</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              OTRAS uses intelligent analysis to understand your profile, recommend opportunities, and guide your preparation journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {points.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="icon-box">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}