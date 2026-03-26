import {
  Brain,
  Briefcase,
  BellRing,
  FileCheck,
  BarChart3,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Career Guidance",
    desc: "Get intelligent recommendations based on your interests, strengths, and long-term career goals.",
  },
  {
    icon: Briefcase,
    title: "Job & Internship Opportunities",
    desc: "Explore curated jobs and internships from trusted organizations and hiring partners.",
  },
  {
    icon: BellRing,
    title: "Government Exam Alerts",
    desc: "Stay updated with real-time notifications for government exams and deadlines.",
  },
  {
    icon: FileCheck,
    title: "Mock Tests & Practice",
    desc: "Prepare smarter with mock tests, skill-building content, and readiness tracking.",
  },
  {
    icon: BarChart3,
    title: "Application Tracking",
    desc: "Track all your applications, deadlines, and next steps from one dashboard.",
  },
  {
    icon: Target,
    title: "Personalized Recommendations",
    desc: "Receive suggestions for jobs, exams, and skills tailored to your profile.",
  },
];

export default function Features() {
  return (
    <section id="features" className="section py-20">
      <div className="mb-12 text-center">
        <p className="section-tag">Features</p>
        <h2 className="section-title">Everything you need to shape your future</h2>
        <p className="section-subtitle">
          OTRAS brings together opportunities, guidance, and preparation in one powerful platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="premium-card">
              <div className="icon-box">
                <Icon size={24} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}