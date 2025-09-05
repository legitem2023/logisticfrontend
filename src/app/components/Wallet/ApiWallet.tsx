// components/DigitalWallet.tsx
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { FiPlus, FiArrowUp, FiCreditCard, FiTruck, FiRefreshCw, FiX, FiLock, FiArrowDown } from 'react-icons/fi';

// Define the GraphQL query (CORRECTED)
export const WALLET = gql`
  query GetWallet($userId: String) {
    getWallet(userId: $userId) {
      id
      userId        
      user
      balance       
      currency      
      transactions {
        id
        deliveryId
        delivery
        type
        amount
        description
        status
        referenceId
        paymentMethod
        createdAt
      }
      createdAt
      updatedAt        
    }
  }
`;

interface Transaction {
  id: string;
  deliveryId: string;
  delivery: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  referenceId: string;
  paymentMethod: string;
  createdAt: string;
}

interface WalletData {
  getWallet: {
    id: string;
    userId: string;
    user: string;
    balance: number;
    currency: string;
    transactions: Transaction[];
    createdAt: string;
    updatedAt: string;
  };
}

interface ApiWalletProps {
  userId: string;
}

export default function ApiWallet({ userId }: ApiWalletProps) {
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState(50);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDescription, setPaymentDescription] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');
  const [promotions] = useState([
    { id: 1, title: 'First Top-up Bonus', description: 'Get 10% extra on your first top-up', validUntil: '2025-08-31' },
    { id: 2, title: 'Free Delivery', description: 'Free delivery on orders above $30', validUntil: '2025-08-20' },
    { id: 3, title: 'Referral Bonus', description: 'Get $5 for each friend you refer', validUntil: '2025-09-15' },
  ]);

  // Use the GraphQL query
  const { data, loading, error, refetch } = useQuery<WalletData>(WALLET, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  const wallet = data?.getWallet;
  const balance = wallet?.balance || 0;
  const currencySymbol = wallet?.currency === 'PHP' ? '₱' : '$';
  const transactions = wallet?.transactions || [];

  const handleTopup = () => {
    if (topupAmount <= 0) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      refetch();
      setIsProcessing(false);
      setShowTopupModal(false);
      setTopupAmount(50);
    }, 1500);
  };

  const handlePayment = () => {
    if (paymentAmount <= 0 || paymentAmount > balance || !paymentDescription.trim()) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      refetch();
      setIsProcessing(false);
      setShowPaymentModal(false);
      setPaymentAmount(0);
      setPaymentDescription('');
    }, 1500);
  };

  // Format transactions for display
  const formatTransactions = (transactions: Transaction[]) => {
    return transactions.map(txn => ({
      id: txn.id,
      type: txn.type.toLowerCase(),
      amount: txn.amount,
      date: new Date(txn.createdAt).toISOString().split('T')[0],
      description: txn.description,
      status: txn.status.toLowerCase(),
      icon: txn.type.toUpperCase() === 'TOPUP' ? <FiCreditCard /> : <FiTruck />
    }));
  };

  const formattedTransactions = formatTransactions(transactions);

  if (loading && !wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="animate-spin text-3xl text-green-600 mx-auto mb-4" />
          <p>Loading wallet data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading wallet: {error.message}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-green-600">{currencySymbol}</span> Logistics Wallet
            </h1>
            <p className="text-gray-600 mt-2">Manage your funds for seamless logistics payments</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => refetch()}
              className="bg-white rounded-full p-2 shadow hover:bg-gray-50"
            >
              <FiRefreshCw className="text-gray-600" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-dashed"></div>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg">Available Balance</p>
              <h2 className="text-4xl font-bold mt-2">{currencySymbol}{balance.toFixed(2)}</h2>
              <p className="mt-4 text-emerald-100">Logistics Wallet</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <FiLock className="text-2xl" />
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => setShowTopupModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-emerald-600 py-3 rounded-xl font-medium hover:bg-emerald-50 transition-colors"
            >
              <FiPlus /> Top-up
            </button>
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-800 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              <FiArrowUp /> Pay Now
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'wallet' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('wallet')}
          >
            Wallet
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'promotions' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('promotions')}
          >
            Promotions
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'security' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        {/* Wallet Content */}
        {activeTab === 'wallet' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-bold text-lg text-gray-800">Recent Transactions</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {formattedTransactions.length > 0 ? (
                formattedTransactions.map((txn) => (
                  <div key={txn.id} className="px-5 py-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        txn.type === 'topup' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {txn.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{txn.description}</div>
                        <div className="text-sm text-gray-500">{txn.date}</div>
                      </div>
                      <div className={`font-medium ${txn.type === 'topup' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'topup' ? '+' : ''}{currencySymbol}{Math.abs(txn.amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                    <FiArrowDown className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="mt-4 font-medium text-gray-900">No Transactions Yet</h3>
                  <p className="text-gray-500 mt-1">Your transactions will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Promotions Tab */}
        {activeTab === 'promotions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {promotions.map(promo => (
              <div key={promo.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{promo.title}</h3>
                    <p className="text-gray-600 mt-2 text-sm">{promo.description}</p>
                  </div>
                  <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Valid until: {promo.validUntil}</span>
                  <button className="text-sm text-amber-600 font-medium hover:text-amber-700">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-gray-700 mb-2">Transaction PIN</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Secure your payments with a PIN</p>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-gray-400"></div>
                      ))}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Set PIN
                  </button>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-gray-700 mb-2">Biometric Authentication</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Enable fingerprint or face recognition for payments</p>
                  <div className="relative inline-block w-12 h-6">
                    <input type="checkbox" className="opacity-0 w-0 h-0 peer" id="biometric" />
                    <label 
                      htmlFor="biometric" 
                      className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition duration-300 before:absolute before:w-4 before:h-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-6"
                    ></label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Payment Limits</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Set daily transaction limits</p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top-up Modal */}
        {showTopupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Top-up Wallet</h3>
                <button 
                  onClick={() => setShowTopupModal(false)} 
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isProcessing}
                >
                  <FiX />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top-up Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{currencySymbol}</span>
                  <input
                    type="number"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-3 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                    min="1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Minimum top-up amount is {currencySymbol}5
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Credit Card', 'Debit Card', 'PayPal'].map(method => (
                    <button
                      key={method}
                      className="border border-gray-300 rounded-lg p-3 text-center hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Code
                </label>
                <input
                  type="password"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  placeholder="Enter CVV"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  maxLength={3}
                />
              </div>
              
              <button
                onClick={handleTopup}
                disabled={isProcessing || topupAmount < 5 || securityCode.length < 3}
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-white font-medium ${
                  isProcessing || topupAmount < 5 || securityCode.length < 3
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <FiRefreshCw className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <FiPlus /> Top-up {currencySymbol}{topupAmount}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Pay for Logistics</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)} 
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isProcessing}
                >
                  <FiX />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{currencySymbol}</span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-3 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                    min="1"
                    max={balance}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Available balance: {currencySymbol}{balance.toFixed(2)}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Description
                </label>
                <input
                  type="text"
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="e.g. Furniture delivery to downtown"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction PIN
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <input
                      key={i}
                      type="password"
                      maxLength={1}
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                    />
                  ))}
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={isProcessing || paymentAmount <= 0 || paymentAmount > balance || !paymentDescription.trim()}
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-white font-medium ${
                  isProcessing || paymentAmount <= 0 || paymentAmount > balance || !paymentDescription.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <FiRefreshCw className="animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <FiArrowUp /> Pay {currencySymbol}{paymentAmount}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
    }
