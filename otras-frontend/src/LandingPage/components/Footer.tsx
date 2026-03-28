import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">OTRAS</h2>

          <p className="text-gray-400 leading-relaxed">
            OTRAS is an AI-powered career opportunity platform helping
            students discover jobs, internships, government exams,
            and personalized career guidance.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Platform</h3>

          <ul className="space-y-2">
            <li>
              <a href="#features" className="hover:text-white cursor-pointer">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-white cursor-pointer">
                How It Works
              </a>
            </li>
            <li>
              <a href="#opportunities" className="hover:text-white cursor-pointer">
                Opportunities
              </a>
            </li>
            <li>
              <a href="#testimonials" className="hover:text-white cursor-pointer">
                Testimonials
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>

          <ul className="space-y-2">
            <li>
              <a href="#about" className="hover:text-white cursor-pointer">
                About OTRAS
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white cursor-pointer">
                Contact
              </a>
            </li>
            <li>
              <a href="#privacy" className="hover:text-white cursor-pointer">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-white cursor-pointer">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        <div id="contact">
          <h3 className="text-white font-semibold mb-4">Contact</h3>

          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <Mail size={16} /> support@otras.ai
            </p>

            <p className="flex items-center gap-2">
              <Phone size={16} /> +91 9876543210
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={16} /> Andhra Pradesh, India
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
        © 2026 OTRAS Technologies. All rights reserved.
      </div>
    </footer>
  );
}