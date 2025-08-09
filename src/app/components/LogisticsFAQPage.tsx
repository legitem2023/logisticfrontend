import { useState, useEffect, useRef } from 'react';

export default function LogisticsFAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);
  const searchRef = useRef(null);

  const logisticsCategories = [
    { id: 'all', name: 'All Questions' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'tracking', name: 'Order Tracking' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'international', name: 'International' },
    { id: 'account', name: 'Account & Billing' },
  ];

  const faqItems = [
    {
      id: 1,
      question: "What shipping methods do you offer?",
      answer: "We offer a variety of shipping options including standard ground shipping (3-5 business days), expedited shipping (2 business days), and next-day air shipping. International shipping is available to over 150 countries.",
      category: 'shipping'
    },
    {
      id: 2,
      question: "How can I track my order?",
      answer: "Once your order has shipped, you'll receive a tracking number via email. You can enter this tracking number in the 'Track Order' section of our website for real-time updates on your shipment's location and estimated delivery time.",
      category: 'tracking'
    },
    {
      id: 3,
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy on most items. To initiate a return, please log in to your account and navigate to the 'Order History' section. Select the item(s) you wish to return and follow the instructions. Return shipping labels are provided for domestic returns.",
      category: 'returns'
    },
    {
      id: 4,
      question: "How long does international shipping take?",
      answer: "International shipping times vary by destination. For most countries, delivery takes 7-14 business days after processing. Express international shipping is available for faster delivery in 3-7 business days. Please note that customs processing may add additional time.",
      category: 'international'
    },
    {
      id: 5,
      question: "Can I change my shipping address after placing an order?",
      answer: "Yes, you can change your shipping address if your order hasn't entered the fulfillment process yet. Please contact our support team immediately with your order number and updated address. Once an order has shipped, address changes may not be possible.",
      category: 'shipping'
    },
    {
      id: 6,
      question: "What should I do if my package is damaged?",
      answer: "If your package arrives damaged, please take photos of the packaging and the damaged item before opening. Contact our support team within 48 hours of delivery with your order number and photos. We'll arrange for a replacement or refund.",
      category: 'returns'
    },
    {
      id: 7,
      question: "Do you offer bulk shipping discounts?",
      answer: "Yes, we offer significant discounts for bulk shipments. For orders over 50 units, please contact our corporate sales team at sales@logisticscorp.com to discuss customized pricing and shipping solutions tailored to your business needs.",
      category: 'account'
    },
    {
      id: 8,
      question: "How do I calculate shipping costs?",
      answer: "Shipping costs are calculated based on package weight, dimensions, destination, and shipping speed. You can get an instant quote by entering these details in our shipping calculator. For complex shipments, our support team can provide a custom quote.",
      category: 'shipping'
    },
    {
      id: 9,
      question: "What customs duties apply to international shipments?",
      answer: "Customs duties and import taxes vary by country and are determined by the destination country's customs authority. These fees are typically the responsibility of the recipient. We recommend checking with your local customs office for specific information.",
      category: 'international'
    },
    {
      id: 10,
      question: "Can I schedule a specific delivery time?",
      answer: "Yes, we offer scheduled delivery for an additional fee. During checkout, select the 'Scheduled Delivery' option and choose your preferred date and time window. Availability depends on your location and the service selected.",
      category: 'shipping'
    },
  ];

  const toggleItem = (id) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(itemId => itemId !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
              <div className="relative w-full md:w-64">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search questions..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {logisticsCategories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div 
                    key={item.id} 
                    className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md"
                  >
                    <button
                      className="w-full flex justify-between items-center p-5 text-left bg-gray-50 hover:bg-gray-100"
                      onClick={() => toggleItem(item.id)}
                    >
                      <span className="font-medium text-gray-800">{item.question}</span>
                      <svg 
                        className={`h-5 w-5 text-gray-500 transition-transform ${
                          expandedItems.includes(item.id) ? 'transform rotate-180' : ''
                        }`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedItems.includes(item.id) && (
                      <div className="p-5 bg-white border-t border-gray-100">
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No questions found</h3>
                  <p className="mt-1 text-gray-500">Try a different search term or category</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
