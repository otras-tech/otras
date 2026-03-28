import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="section py-20">
      <div className="rounded-[36px] bg-gradient-to-r from-blue-800 via-indigo-700 to-sky-600 p-10 text-center shadow-xl md:p-16">
        <h2 className="text-3xl font-extrabold text-white md:text-5xl">
          Start Your Career Journey Today
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-50">
          Join OTRAS to explore opportunities, prepare smarter, and move ahead with AI-powered guidance.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/signup" className="hero-btn-white">
            Create Account
          </Link>
          <a href="#opportunities" className="hero-btn-glass">
            Explore Opportunities
          </a>
        </div>
      </div>
    </section>
  );
}