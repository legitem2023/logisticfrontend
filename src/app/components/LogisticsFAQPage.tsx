'use client';
import { useState, useEffect, useRef } from 'react';
import AnimatedCityscape from './AnimatedCityscape';

export default function LogisticsFAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const logisticsCategories = [
    { id: 'all', name: 'All Questions' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'tracking', name: 'Order Tracking' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'international', name: 'International' },
    { id: 'account', name: 'Account & Billing' },
  ];

  const faqItems = [
    { id: 1, question: "What shipping methods do you offer?", answer: "We offer standard, expedited, and next-day shipping options, plus international delivery to over 150 countries.", category: 'shipping' },
    { id: 2, question: "How can I track my order?", answer: "You'll receive a tracking number via email once your order ships. Use it in the 'Track Order' section for real-time updates.", category: 'tracking' },
    { id: 3, question: "What is your return policy?", answer: "30-day return policy with free domestic return labels. Initiate returns through your account's 'Order History'.", category: 'returns' },
    { id: 4, question: "How long does international shipping take?", answer: "Typically 7-14 business days, or 3-7 days for express. Customs may add delays.", category: 'international' },
  ];

  const toggleItem = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredItems = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-1">
      <div className="max-w-5xl mx-auto shadow-xl border border-green-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 p-0 relative">
          {/* Pattern overlay */}
          <AnimatedCityscape>
          <h2 className="text-2xl font-bold text-white text-center relative z-10">Frequently Asked Questions</h2>
          <p className="text-green-100 text-center mt-2 relative z-10">Find quick answers to our most common questions</p>
          </AnimatedCityscape>
        </div>

        <div className="p-8 bg-white">
          {/* Search and Categories */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="relative w-full md:w-64">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search questions..."
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex flex-wrap gap-2">
              {logisticsCategories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="border border-green-100 rounded-xl overflow-hidden transition-all hover:shadow-lg"
                >
                  <button
                    className="w-full flex justify-between items-center p-5 text-left bg-green-50 hover:bg-green-100"
                    onClick={() => toggleItem(item.id)}
                  >
                    <span className="font-medium text-green-800">{item.question}</span>
                    <svg 
                      className={`h-5 w-5 text-green-600 transition-transform ${
                        expandedItems.includes(item.id) ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedItems.includes(item.id) && (
                    <div className="p-5 bg-white border-t border-green-100">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-green-900">No questions found</h3>
                <p className="mt-1 text-green-600">Try a different search term or category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
