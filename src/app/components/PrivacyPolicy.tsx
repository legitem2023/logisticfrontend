'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, FileText, Globe, User, Trash2 } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Shield className="h-14 w-14 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-800">Privacy Policy</h1>
              <p className="text-gray-500 text-lg">
                Your privacy is our priority — here’s how we protect your information.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                <User className="h-5 w-5 text-emerald-600" /> Information We Collect
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We collect personal details you provide during account creation or service use, 
                including your name, contact number, email address, location data for deliveries, 
                and payment details when applicable.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                <Lock className="h-5 w-5 text-emerald-600" /> How We Use Your Data
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your data is used solely for the purpose of providing logistics services, 
                improving delivery efficiency, enhancing user experience, and complying with 
                legal obligations. We do not sell or trade your personal information.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                <Globe className="h-5 w-5 text-emerald-600" /> Data Sharing
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We only share your information with trusted service partners, such as delivery 
                drivers and payment processors, to fulfill our services. All partners are bound 
                by confidentiality agreements.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                <FileText className="h-5 w-5 text-emerald-600" /> Data Retention
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your data only for as long as necessary to provide our services and 
                comply with legal requirements. When no longer needed, your data is securely deleted.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                <Trash2 className="h-5 w-5 text-emerald-600" /> Your Rights
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You may request access, correction, or deletion of your data at any time. 
                Please contact us at <span className="font-medium text-emerald-700">support@logistics.com</span> 
                for assistance.
              </p>
            </section>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
