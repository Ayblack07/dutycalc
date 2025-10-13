import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary to-accent text-gray-200 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {/* Logo & About */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">DutyCalc.ng</h3>
          <p className="text-sm">
            Nigeria’s professional customs duty calculator and manifest lookup tool. 
            Instantly calculate import duties, view cargo manifests, and explore 
            tariff rates — built for traders and logistics professionals.
          </p>
        </div>

        {/* Tools */}
        <div>
          <h4 className="font-semibold text-white mb-3">Tools</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/calculator" className="hover:text-[#1B8B77]">
                Customs Duty Calculator
              </Link>
            </li>
            <li>
              <Link href="/tariff" className="hover:text-[#1B8B77]">
                Tariff Lookup
              </Link>
            </li>
            <li>
              <Link href="/manifest" className="hover:text-[#1B8B77]">
                Manifest Checker
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold text-white mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/exchange-rate" className="hover:text-[#1B8B77]">
                Exchange Rate
              </Link>
            </li>
            <li>
              <Link href="/prohibition-list" className="hover:text-[#1B8B77]">
                Prohibition List
              </Link>
            </li>
            <li>
              <Link href="/learning-hub" className="hover:text-[#1B8B77]">
                Learning Hub
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-white mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="hover:text-[#1B8B77]">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/api-docs" className="hover:text-[#1B8B77]">
                API Documentation
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#1B8B77]">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* SEO Text + Copyright */}
      <div className="mt-10 border-t border-gray-600 pt-6 text-center text-sm text-gray-300 space-y-2">
        <p>
          © {new Date().getFullYear()} DutyCalc.ng — Nigeria Customs Duty Calculator,
          Manifest Checker & Tariff Lookup Platform.
        </p>
        <p className="text-xs text-gray-400 max-w-3xl mx-auto px-4">
          DutyCalc helps importers, freight forwarders, and customs agents in Nigeria calculate 
          accurate customs duties, verify manifests, and find the correct tariff rates using 
          official data sources.
        </p>
      </div>
    </footer>
  );
}