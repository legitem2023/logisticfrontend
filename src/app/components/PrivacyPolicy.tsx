'use client';

import { Card, CardContent, CardHeader } from "./ui/Card";
import { Shield, Lock, FileText, Globe, User, Trash2 } from "lucide-react";
import AnimatedCityscape from './AnimatedCityscape';

export default function PrivacyPolicy() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100 p-1">
      <div className="max-w-8xl mx-auto">
        <Card className="shadow-2xl border border-slate-200 bg-white/80 backdrop-blur-md overflow-hidden">
          {/* Header */}
          <CardHeader className="relative bg-gradient-to-r from-green-800 to-green-600 p-0 text-white">
            {/* Pattern overlay */}
            <AnimatedCityscape>
              <h1 className="text-2xl font-extrabold tracking-tight drop-shadow-lg">
                Privacy Policy
              </h1>
              <p className="mt-3 text-emerald-100 text-lg max-w-2xl leading-relaxed">
                Your privacy is our priority — here’s how we protect your
                information.
              </p>
              </AnimatedCityscape>
          </CardHeader>

          <CardContent className="px-4 py-6 space-y-10">
            {[
              {
                icon: <User className="h-6 w-6 text-emerald-600" />,
                title: "Information We Collect",
                text: `We collect personal details you provide during account creation or 
                service use, including your name, contact number, email address, location 
                data for deliveries, and payment details when applicable.`,
              },
              {
                icon: <Lock className="h-6 w-6 text-emerald-600" />,
                title: "How We Use Your Data",
                text: `Your data is used solely for the purpose of providing logistics 
                services, improving delivery efficiency, enhancing user experience, and 
                complying with legal obligations. We do not sell or trade your personal 
                information.`,
              },
              {
                icon: <Globe className="h-6 w-6 text-emerald-600" />,
                title: "Data Sharing",
                text: `We only share your information with trusted service partners, 
                such as delivery drivers and payment processors, to fulfill our services. 
                All partners are bound by confidentiality agreements.`,
              },
              {
                icon: <FileText className="h-6 w-6 text-emerald-600" />,
                title: "Data Retention",
                text: `We retain your data only for as long as necessary to provide our 
                services and comply with legal requirements. When no longer needed, your 
                data is securely deleted.`,
              },
              {
                icon: <Trash2 className="h-6 w-6 text-emerald-600" />,
                title: "Your Rights",
                text: `You may request access, correction, or deletion of your data at 
                any time. Please contact us at support@logistics.com for assistance.`,
              },
            ].map((section, index) => (
              <section
                key={index}
                className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100"
              >
                <h2 className="flex items-center gap-3 text-2xl font-semibold text-slate-800 mb-3">
                  {section.icon} {section.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">{section.text}</p>
              </section>
            ))}

            {/* Footer */}
            <div className="pt-6 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
