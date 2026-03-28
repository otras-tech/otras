const testimonials = [
  {
    name: "Ananya Reddy",
    role: "B.Tech Student",
    text: "OTRAS helped me find internship opportunities and gave me better clarity about my career path.",
  },
  {
    name: "Rahul Verma",
    role: "Government Exam Aspirant",
    text: "I like how exam alerts, preparation support, and tracking are all in one place. It saves a lot of time.",
  },
  {
    name: "Sneha Kulkarni",
    role: "Final Year Student",
    text: "The AI recommendations feel useful and practical. It’s like having a career guide built into the platform.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="blue-section py-20">
      <div className="section">
        <div className="mb-12 text-center">
          <p className="section-tag">Testimonials</p>
          <h2 className="section-title">What students say about OTRAS</h2>
          <p className="section-subtitle">
            A platform designed to make career discovery and preparation easier, smarter, and faster.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <div key={index} className="premium-card">
              <p className="leading-8 text-slate-600">“{item.text}”</p>
              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}