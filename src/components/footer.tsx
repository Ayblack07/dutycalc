import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary to-accent text-gray-200 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {/* Logo & Description */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">DutyCalc Pro</h3>
          <p className="text-sm">
            Professional customs duty calculation platform for import/export
            operations in Nigeria.
          </p>
        </div>

        {/* Tools */}
        <div>
          <h4 className="font-semibold text-white mb-3">Tools</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/calculator" className="hover:text-[#1B8B77]">
                Duty Calculator
              </Link>
            </li>
            <li>
              <Link href="/tariff" className="hover:text-[#1B8B77]">
                Tariff Lookup
              </Link>
            </li>
            <li>
              <Link href="/manifest" className="hover:text-[#1B8B77]">
                Manifest Check
              </Link>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h4 className="font-semibold text-white mb-3">Community</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/learning-hub" className="hover:text-[#1B8B77]">
                Learning Hub
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#1B8B77]">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-white mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-[#1B8B77]">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#1B8B77]">
                API Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-600 pt-6 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} DutyCalc. Built for professionals.
      </div>
    </footer>
  );
}