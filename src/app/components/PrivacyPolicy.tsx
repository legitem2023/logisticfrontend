'use client';

import { Card, CardContent } from "./ui/Card";
import { Shield, Lock, FileText, Globe, User, Trash2 } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 p-1">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border border-slate-200 bg-white/80 backdrop-blur-md">
          <CardContent className="space-y-10">
            
            {/* Header */}
<div className="bg-gradient-to-r from-emerald-600 to-green-600 shadow-md p-0 text-center text-white">
  <div className="flex justify-center mb-4">
    <Shield className="h-14 w-14 text-white drop-shadow-lg" />
  </div>
  <h1 className="text-3xl font-extrabold drop-shadow-sm">Privacy Policy</h1>
  <p className="mt-2 text-emerald-100 text-lg">
    Your privacy is our priority — here’s how we protect your information.
  </p>
</div>

            {/* Section 1 */}
            <section className="space-y-2">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
                <User className="h-6 w-6 text-emerald-600" /> Information We Collect
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We collect personal details you provide during account creation or service use, 
                including your name, contact number, email address, location data for deliveries, 
                and payment details when applicable.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
                <Lock className="h-6 w-6 text-emerald-600" /> How We Use Your Data
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Your data is used solely for the purpose of providing logistics services, 
                improving delivery efficiency, enhancing user experience, and complying with 
                legal obligations. We do not sell or trade your personal information.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
                <Globe className="h-6 w-6 text-emerald-600" /> Data Sharing
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We only share your information with trusted service partners, such as delivery 
                drivers and payment processors, to fulfill our services. All partners are bound 
                by confidentiality agreements.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
                <FileText className="h-6 w-6 text-emerald-600" /> Data Retention
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We retain your data only for as long as necessary to provide our services and 
                comply with legal requirements. When no longer needed, your data is securely deleted.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-2">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
                <Trash2 className="h-6 w-6 text-emerald-600" /> Your Rights
              </h2>
              <p className="text-slate-600 leading-relaxed">
                You may request access, correction, or deletion of your data at any time. 
                Please contact us at <span className="font-medium text-emerald-700">support@logistics.com</span> 
                for assistance.
              </p>
            </section>

            {/* Footer */}
            <div className="pt-8 border-t border-slate-200 text-sm text-slate-500 text-center">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
