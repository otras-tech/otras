const benefits = [
  "Real-time opportunities",
  "Personalized dashboard",
  "One platform for jobs and exams",
  "AI-powered insights",
  "Application tracking",
  "Preparation support for skills and exams",
];

export default function Benefits() {
  return (
    <section className="section py-20">
      <div className="mb-12 text-center">
        <p className="section-tag">Student Benefits</p>
        <h2 className="section-title">Built for ambitious students and job seekers</h2>
        <p className="section-subtitle">
          Whether you are preparing for exams or exploring jobs, OTRAS keeps everything organized and smart.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-200 bg-white p-6 text-lg font-semibold text-slate-800 shadow-sm"
          >
            {benefit}
          </div>
        ))}
      </div>
    </section>
  );
}