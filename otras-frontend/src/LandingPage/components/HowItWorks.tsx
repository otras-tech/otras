const steps = [
  "Create your account",
  "Set your profile and career interests",
  "Receive AI-based recommendations",
  "Apply to jobs or prepare for exams",
  "Track your progress",
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="blue-section  py-20">
      <div className="section grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="section-tag">How It Works</p>
          <h2 className="section-title">Simple steps, smarter outcomes</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            OTRAS helps students and job seekers move from confusion to clarity with a simple, guided flow.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-700 to-blue-600 font-bold text-white">
                {index + 1}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">{step}</h3>
                <p className="mt-1 text-slate-600">
                  Complete this step and move closer to the right career or exam path.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}