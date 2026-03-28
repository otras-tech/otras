import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Otras from "../assets/Otras1.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">

      <div className="section flex items-center justify-between py-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">

          <img
            src={Otras}
            alt="OTRAS Logo"
            className="h-20 w-auto object-contain"
          />



        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#opportunities" className="nav-link">Opportunities</a>
          <a href="#ai-engine" className="nav-link">AI Engine</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
        </nav>

        {/* BUTTONS */}
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn-outline">
            Login
          </Link>

          <button
            onClick={() => navigate("/profile")}
            className="btn-primary"
          >
            Get Started
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-300 p-2 text-slate-700 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">

          <div className="section flex flex-col gap-4 py-4">

            <a href="#features" className="nav-link" onClick={() => setOpen(false)}>
              Features
            </a>

            <a href="#how-it-works" className="nav-link" onClick={() => setOpen(false)}>
              How It Works
            </a>

            <a href="#opportunities" className="nav-link" onClick={() => setOpen(false)}>
              Opportunities
            </a>

            <a href="#ai-engine" className="nav-link" onClick={() => setOpen(false)}>
              AI Engine
            </a>

            <a href="#testimonials" className="nav-link" onClick={() => setOpen(false)}>
              Testimonials
            </a>

            <Link
              to="/login"
              className="btn-outline justify-center"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="btn-primary justify-center w-full"
            >
              Get Started
            </button>

          </div>

        </div>
      )}
    </header>
  );
}