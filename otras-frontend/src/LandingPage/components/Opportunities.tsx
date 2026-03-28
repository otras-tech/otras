const jobs = [
  {
    title: "Frontend Developer Intern",
    organization: "TechNova Solutions",
    deadline: "25 Mar 2026",
    category: "Internship",
  },
  {
    title: "Software Engineer",
    organization: "CodeSphere Pvt Ltd",
    deadline: "30 Mar 2026",
    category: "Full Time",
  },
  {
    title: "Data Analyst Trainee",
    organization: "Insight Labs",
    deadline: "02 Apr 2026",
    category: "Entry Level",
  },
];

const exams = [
  {
    title: "SSC CGL 2026",
    organization: "Staff Selection Commission",
    deadline: "10 Apr 2026",
    category: "Government Exam",
  },
  {
    title: "RRB NTPC",
    organization: "Railway Recruitment Board",
    deadline: "18 Apr 2026",
    category: "Government Exam",
  },
  {
    title: "Bank PO Preparation Track",
    organization: "National Banking Path",
    deadline: "Open Now",
    category: "Preparation",
  },
];

const skills = [
  {
    title: "React Frontend Development",
    organization: "Trending Skill Track",
    deadline: "Start Anytime",
    category: "Skill",
  },
  {
    title: "Aptitude & Reasoning",
    organization: "Exam Prep Series",
    deadline: "Start Anytime",
    category: "Skill",
  },
  {
    title: "Data Analytics Foundations",
    organization: "Career Growth Program",
    deadline: "Start Anytime",
    category: "Skill",
  },
];

function OpportunityColumn({ title, data }) {
  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold text-slate-900">{title}</h3>
      <div className="grid gap-5">
        {data.map((item, index) => (
          <div key={index} className="premium-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-xl font-semibold text-slate-900">{item.title}</h4>
                <p className="mt-1 text-slate-600">{item.organization}</p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                {item.category}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-500">Deadline: {item.deadline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Opportunities() {
  return (
    <section id="opportunities" className="section py-20">
      <div className="mb-12 text-center">
        <p className="section-tag">Opportunities</p>
        <h2 className="section-title">Explore what’s trending right now</h2>
        <p className="section-subtitle">
          Discover the latest jobs, upcoming exams, and trending skills from a single platform.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <OpportunityColumn title="Latest Jobs" data={jobs} />
        <OpportunityColumn title="Upcoming Exams" data={exams} />
        <OpportunityColumn title="Trending Skills" data={skills} />
      </div>
    </section>
  );
}