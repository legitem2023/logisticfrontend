// components/ApiWallet.tsx
import { useState, useEffect } from 'react';
import { FiCopy, FiEye, FiEyeOff, FiRefreshCw, FiTrash2, FiPlus, FiLock, FiShield, FiActivity, FiCheck, FiX } from 'react-icons/fi';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
  usage: number;
  status: 'active' | 'revoked';
  scopes: string[];
}

export default function ApiWallet() {
  const [keys, setKeys] = useState<ApiKey[]>();
  
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [scopes, setScopes] = useState({
    read: true,
    write: false,
    delete: false
  });
  const [copied, setCopied] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('keys');
  const [usageData, setUsageData] = useState([
    { day: 'Mon', requests: 120 },
    { day: 'Tue', requests: 200 },
    { day: 'Wed', requests: 150 },
    { day: 'Thu', requests: 180 },
    { day: 'Fri', requests: 90 },
    { day: 'Sat', requests: 60 },
    { day: 'Sun', requests: 30 }
  ]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const toggleKeyVisibility = (id: string) => {
    const newSet = new Set(revealedKeys);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setRevealedKeys(newSet);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const revokeKey = (id: string) => {
    setKeys(keys.map(key => 
      key.id === id ? {...key, status: 'revoked'} : key
    ));
    setConfirmRevoke(null);
  };

  const regenerateKey = (id: string) => {
    setKeys(keys.map(key => 
      key.id === id ? {
        ...key, 
        key: `sk_${Math.random().toString(36).slice(2, 18)}`,
        lastUsed: null,
        usage: 0
      } : key
    ));
    setRevealedKeys(new Set([...revealedKeys, id]));
  };

  const createNewKey = () => {
    if (!newKeyName.trim()) return;
    
    const selectedScopes = Object.entries(scopes)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_${Math.random().toString(36).slice(2, 18)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: null,
      usage: 0,
      status: 'active',
      scopes: selectedScopes
    };
    
    setKeys([...keys, newKey]);
    setNewKeyName('');
    setShowModal(false);
    setRevealedKeys(new Set([...revealedKeys, newKey.id]));
    setScopes({
      read: true,
      write: false,
      delete: false
    });
  };

  const toggleScope = (scope: string) => {
    setScopes(prev => ({ ...prev, [scope]: !prev[scope as keyof typeof prev] }));
  };

  const activeKeys = keys.filter(k => k.status === 'active').length;
  const totalRequests = keys.reduce((sum, key) => sum + key.usage, 0);
  const todayRequests = 327; // Mock data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiLock className="text-indigo-600" /> API Wallet
            </h1>
            <p className="text-gray-600 mt-2">Manage your API keys and monitor usage</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg mt-4 sm:mt-0"
          >
            <FiPlus /> Create New Key
          </button>
        </div>

        {/* Security Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-5 text-white mb-8 flex flex-col md:flex-row items-center gap-4 shadow-lg">
          <div className="flex-shrink-0">
            <FiShield className="text-3xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Security Recommendations</h3>
            <p className="text-indigo-100 mt-1">
              Never share your API keys publicly. Treat them like passwords and store them securely.
              Regenerate keys regularly for enhanced security.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'keys' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('keys')}
          >
            API Keys
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'usage' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('usage')}
          >
            Usage Analytics
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'security' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('security')}
          >
            Security Settings
          </button>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FiActivity className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Total Requests</h3>
                <p className="text-3xl font-bold mt-1">{totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiLock className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Active Keys</h3>
                <p className="text-3xl font-bold mt-1">{activeKeys}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiRefreshCw className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Today's Requests</h3>
                <p className="text-3xl font-bold mt-1">{todayRequests.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Keys List */}
        {activeTab === 'keys' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <div className="hidden md:grid grid-cols-12 px-6 py-3 text-sm font-medium text-gray-500">
                <div className="col-span-3">Name</div>
                <div className="col-span-4">API Key</div>
                <div className="col-span-2">Created</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {keys.map((apiKey) => (
                <div key={apiKey.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{apiKey.name}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          apiKey.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {apiKey.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {apiKey.scopes.map(scope => (
                          <span key={scope} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="md:col-span-4">
                      <div className="flex items-center">
                        <div className="font-mono bg-gray-100 px-3 py-1.5 rounded text-sm flex-1 truncate">
                          {revealedKeys.has(apiKey.id) 
                            ? apiKey.key 
                            : '•'.repeat(24)
                          }
                        </div>
                        <div className="flex ml-2">
                          <button 
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            aria-label={revealedKeys.has(apiKey.id) ? "Hide key" : "Reveal key"}
                          >
                            {revealedKeys.has(apiKey.id) ? <FiEyeOff /> : <FiEye />}
                          </button>
                          <button 
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            aria-label="Copy to clipboard"
                          >
                            <FiCopy />
                          </button>
                        </div>
                      </div>
                      {apiKey.lastUsed && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last used: {apiKey.lastUsed}
                        </p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2 text-gray-600">
                      <span className="md:hidden text-xs text-gray-500">Created: </span>
                      {apiKey.created}
                    </div>
                    
                    <div className="md:col-span-3 flex justify-end gap-2">
                      <button 
                        onClick={() => regenerateKey(apiKey.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        disabled={apiKey.status === 'revoked'}
                      >
                        <FiRefreshCw /> <span className="hidden sm:inline">Regenerate</span>
                      </button>
                      <button 
                        onClick={() => setConfirmRevoke(apiKey.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        <FiTrash2 /> <span className="hidden sm:inline">
                          {apiKey.status === 'active' ? 'Revoke' : 'Delete'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {keys.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                  <FiLock className="text-gray-400 text-2xl" />
                </div>
                <h3 className="mt-4 font-medium text-gray-900">No API Keys</h3>
                <p className="text-gray-500 mt-1">Get started by creating a new API key</p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FiPlus /> Create New Key
                </button>
              </div>
            )}
          </div>
        )}

        {/* Usage Analytics Tab */}
        {activeTab === 'usage' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Usage Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Requests by Day (Last 7 Days)</h3>
                <div className="space-y-3">
                  {usageData.map((day, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-16 text-gray-500">{day.day}</div>
                      <div className="flex-1 flex items-center">
                        <div 
                          className="bg-indigo-600 h-6 rounded flex items-center justify-end pr-2 text-white text-xs"
                          style={{ width: `${Math.min(100, day.requests / 2)}%` }}
                        >
                          {day.requests}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Key Usage</h3>
                <div className="space-y-4">
                  {keys.filter(k => k.usage > 0).map(key => (
                    <div key={key.id}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{key.name}</span>
                        <span>{key.usage.toLocaleString()} requests</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, key.usage / 20)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-gray-700 mb-2">Two-Factor Authentication</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Enable 2FA
                  </button>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-gray-700 mb-2">Session Management</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">View and manage your active sessions</p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                    Manage Sessions
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Audit Logs</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Review security-related events and activities</p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                    View Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Key Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Create New API Key</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production Server"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Describe where this key will be used
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {Object.entries(scopes).map(([scope, enabled]) => (
                    <div key={scope} className="flex items-center">
                      <button
                        onClick={() => toggleScope(scope)}
                        className={`w-5 h-5 rounded border flex items-center justify-center mr-2 ${
                          enabled 
                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                            : 'border-gray-300'
                        }`}
                      >
                        {enabled && <FiCheck size={14} />}
                      </button>
                      <span className="capitalize">{scope}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewKey}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Generate Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Revoke Confirmation Modal */}
        {confirmRevoke && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Confirm Action</h3>
              <p className="text-gray-600 mb-6">
                {keys.find(k => k.id === confirmRevoke)?.status === 'active'
                  ? 'Are you sure you want to revoke this API key? Any applications using this key will stop working immediately.'
                  : 'Are you sure you want to permanently delete this API key? This action cannot be undone.'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmRevoke(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => revokeKey(confirmRevoke)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {keys.find(k => k.id === confirmRevoke)?.status === 'active' ? 'Revoke Key' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Copied notification */}
        {copied && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <FiCheck /> Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}
