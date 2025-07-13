import Image from 'next/image'; import { Button } from '@/components/ui/button'; import { Input } from '@/components/ui/input';

export default function LogisticsHomePage() { return ( <main className="min-h-screen bg-white text-gray-800"> {/* Hero Section */} <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-24 text-center text-white"> <div className="container mx-auto px-4"> <h1 className="text-5xl font-bold mb-6">Reliable Logistics for the Modern World</h1> <p className="text-lg mb-8">Seamlessly manage, track, and optimize your deliveries in real-time.</p> <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"> <Input placeholder="Enter tracking number..." className="w-full" /> <Button className="w-full sm:w-auto">Track Package</Button> </div> </div> </section>

{/* Features Section */}
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center mb-12">Our Core Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: '📍', title: 'Live Tracking', description: 'Track your packages in real-time from pickup to delivery.' },
          { icon: '⚡', title: 'Fast Dispatch', description: 'On-demand logistics optimized for speed and efficiency.' },
          { icon: '🔒', title: 'Secure Delivery', description: 'We guarantee safe handling for all shipments.' },
        ].map((feature, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* How It Works Section */}
  <section className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[ 
          { icon: '📝', title: 'Step 1', desc: 'Book a delivery via app or dashboard.' },
          { icon: '📦', title: 'Step 2', desc: 'Track the delivery in real-time.' },
          { icon: '✅', title: 'Step 3', desc: 'Receive your package safely.' },
        ].map((step, i) => (
          <div key={i} className="p-6 border rounded-xl">
            <div className="text-5xl mb-4">{step.icon}</div>
            <h4 className="text-xl font-semibold mb-1">{step.title}</h4>
            <p className="text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Call to Action */}
  <section className="py-20 bg-blue-700 text-white text-center">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6">Ready to simplify your logistics?</h2>
      <p className="text-lg mb-8">Join thousands of businesses using our platform to deliver faster and better.</p>
      <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">Get Started</Button>
    </div>
  </section>

  {/* Footer */}
  <footer className="py-10 bg-gray-900 text-white text-center">
    <p className="text-sm">© {new Date().getFullYear()} FastTrack Logistics. All rights reserved.</p>
  </footer>
</main>

); }

