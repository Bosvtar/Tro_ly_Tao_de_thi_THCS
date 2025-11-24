import React, { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { getApiKey, saveApiKey, hasApiKey } from '../lib/apiKeyStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySaved?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onApiKeySaved }) => {
  console.log('SettingsModal: Component rendered');
  console.log('SettingsModal: Received props - isOpen =', isOpen, 'typeof =', typeof isOpen);
  
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Load existing API key (masked)
      const existingKey = getApiKey();
      if (existingKey) {
        // Show last 4 characters only
        const masked = '•'.repeat(Math.max(0, existingKey.length - 4)) + existingKey.slice(-4);
        setApiKey(masked);
      } else {
        setApiKey('');
      }
      setShowKey(false);
      setSaveStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Vui lòng nhập API key');
      setSaveStatus('error');
      return;
    }

    // If it's a masked key (contains •), don't save
    if (apiKey.includes('•')) {
      setErrorMessage('Vui lòng nhập API key mới hoặc xóa và nhập lại');
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      // Basic validation: Gemini API keys usually start with "AIza" and are ~39 chars
      if (apiKey.length < 20) {
        throw new Error('API key quá ngắn. Vui lòng kiểm tra lại.');
      }

      saveApiKey(apiKey.trim());
      setSaveStatus('success');
      
      // Callback to notify parent
      if (onApiKeySaved) {
        onApiKeySaved();
      }

      // Auto close after 1.5s
      setTimeout(() => {
        onClose();
        setSaveStatus('idle');
      }, 1500);
    } catch (error: any) {
      setSaveStatus('error');
      setErrorMessage(error.message || 'Lỗi khi lưu API key');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setShowKey(false);
    setErrorMessage('');
    setSaveStatus('idle');
  };

  // Debug: Log when modal should open
  useEffect(() => {
    if (isOpen) {
      console.log('SettingsModal: Opening modal, isOpen =', isOpen);
      console.log('SettingsModal: Component should render now');
    } else {
      console.log('SettingsModal: Modal closed, isOpen =', isOpen);
    }
  }, [isOpen]);

  const existingKey = getApiKey();
  const isEditing = !apiKey.includes('•') && apiKey.trim() !== '';

  console.log('SettingsModal: About to render, isOpen =', isOpen, 'will render:', isOpen);

  // Always render but control visibility
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          console.log('SettingsModal: Backdrop clicked, closing');
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in"
        style={{
          position: 'relative',
          zIndex: 10000,
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '28rem',
          width: '100%',
          padding: '1.5rem'
        }}
        onClick={(e) => {
          e.stopPropagation();
          console.log('SettingsModal: Content clicked');
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Key className="text-indigo-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Cài đặt API Key</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800 mb-3">
            <strong>Làm thế nào để lấy API Key?</strong>
          </p>
          
          {/* Direct Link Button */}
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full mb-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Key size={16} />
            Mở Google AI Studio để lấy API Key
            <ExternalLink size={14} />
          </a>

          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside mb-3">
            <li>Đăng nhập bằng tài khoản Google</li>
            <li>Click "Create API Key" hoặc chọn key có sẵn</li>
            <li>Copy API key và paste vào ô bên dưới</li>
          </ol>
          
          {existingKey && (
            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2 mt-2">
              <CheckCircle size={14} />
              <span>Đã có API key được lưu</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setErrorMessage('');
                setSaveStatus('idle');
              }}
              placeholder={existingKey ? "Nhập API key mới để thay thế" : "Nhập API key của bạn"}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                saveStatus === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${saveStatus === 'success' ? 'border-green-300 bg-green-50' : ''}`}
              disabled={isSaving}
            />
            {apiKey && (
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
          
          {errorMessage && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
              <CheckCircle size={16} />
              <span>Đã lưu API key thành công!</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {existingKey && (
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              Xóa & Nhập mới
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || !isEditing}
            className={`flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors ${
              (isSaving || !isEditing) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu API Key'}
          </button>
        </div>

        {/* Security Note */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          API key được lưu cục bộ trên trình duyệt của bạn và không được gửi đến server nào khác.
        </p>
      </div>
    </div>
  );
};

