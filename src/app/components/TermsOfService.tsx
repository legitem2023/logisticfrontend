'use client';

import { Card, CardContent, CardHeader } from "./ui/Card";
import { BookOpen, Scale, AlertTriangle, Mail, Clock, Shield } from "lucide-react";
import AnimatedCityscape from './AnimatedCityscape';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 p-1">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-2xl border border-slate-200 bg-white/80 backdrop-blur-md overflow-hidden">
          {/* Header */}
          <CardHeader className="relative bg-gradient-to-r from-blue-800 to-blue-600 p-0 text-white">
            {/* Pattern overlay */}
            <AnimatedCityscape>
              <h1 className="text-2xl font-extrabold tracking-tight drop-shadow-lg">
                Terms of Service
              </h1>
              <p className="mt-3 text-blue-100 text-lg max-w-2xl leading-relaxed">
                Please read these terms carefully before using our logistics tracking services.
              </p>
              </AnimatedCityscape>
          </CardHeader>

          <CardContent className="px-4 py-6 space-y-10">
            {[
              {
                icon: <BookOpen className="h-6 w-6 text-blue-600" />,
                title: "Acceptance of Terms",
                text: `By accessing or using our logistics tracking services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.`,
              },
              {
                icon: <Scale className="h-6 w-6 text-blue-600" />,
                title: "Service Description",
                text: `Our platform provides real-time logistics tracking services for shipments, including status updates, estimated delivery times, and location tracking. We reserve the right to modify or discontinue any service at any time.`,
              },
              {
                icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
                title: "User Responsibilities",
                text: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate information and comply with all applicable laws.`,
              },
              {
                icon: <Shield className="h-6 w-6 text-blue-600" />,
                title: "Intellectual Property",
                text: `All content, features, and functionality of our services are owned by us and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our permission.`,
              },
              {
                icon: <Clock className="h-6 w-6 text-blue-600" />,
                title: "Limitation of Liability",
                text: `We are not liable for any delays in delivery, incorrect tracking information, or other issues beyond our reasonable control. Our liability is limited to the maximum extent permitted by law.`,
              },
              {
                icon: <Mail className="h-6 w-6 text-blue-600" />,
                title: "Contact Information",
                text: `For questions about these Terms of Service, please contact us at legal@logistics.com.`,
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
