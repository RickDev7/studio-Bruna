import { User, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

interface ClientFormProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export function ClientForm({
  clientName,
  clientEmail,
  clientPhone,
  onNameChange,
  onEmailChange,
  onPhoneChange
}: ClientFormProps) {
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false
  });

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPhoneValid = (phone: string) => {
    return phone.length >= 10;
  };

  const getInputStatus = (field: 'name' | 'email' | 'phone') => {
    if (!touched[field]) return 'default';
    
    switch (field) {
      case 'name':
        return clientName.length >= 3 ? 'valid' : 'invalid';
      case 'email':
        return isEmailValid(clientEmail) ? 'valid' : 'invalid';
      case 'phone':
        return isPhoneValid(clientPhone) ? 'valid' : 'invalid';
      default:
        return 'default';
    }
  };

  const getInputClasses = (status: 'default' | 'valid' | 'invalid') => {
    const baseClasses = "mt-1 block w-full rounded-lg shadow-sm focus:ring-[#FF69B4] transition-colors duration-200";
    
    switch (status) {
      case 'valid':
        return `${baseClasses} border-green-500 focus:border-green-500 bg-green-50`;
      case 'invalid':
        return `${baseClasses} border-red-500 focus:border-red-500 bg-red-50`;
      default:
        return `${baseClasses} border-gray-300 focus:border-[#FF69B4]`;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label 
          htmlFor="clientName" 
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <User className="w-4 h-4 text-[#FF69B4]" />
          Nome
        </label>
        <div className="relative">
          <input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Nome completo do cliente"
            className={getInputClasses(getInputStatus('name'))}
            required
          />
          {touched.name && clientName.length < 3 && (
            <p className="mt-1 text-xs text-red-500">
              Nome deve ter pelo menos 3 caracteres
            </p>
          )}
        </div>
      </div>

      <div>
        <label 
          htmlFor="clientEmail" 
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <Mail className="w-4 h-4 text-[#FF69B4]" />
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="clientEmail"
            value={clientEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="email@exemplo.com"
            className={getInputClasses(getInputStatus('email'))}
            required
          />
          {touched.email && !isEmailValid(clientEmail) && (
            <p className="mt-1 text-xs text-red-500">
              Por favor, insira um email válido
            </p>
          )}
        </div>
      </div>

      <div>
        <label 
          htmlFor="clientPhone" 
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <Phone className="w-4 h-4 text-[#FF69B4]" />
          Telefone
        </label>
        <div className="relative">
          <input
            type="tel"
            id="clientPhone"
            value={clientPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder="(00) 00000-0000"
            className={getInputClasses(getInputStatus('phone'))}
            required
          />
          {touched.phone && !isPhoneValid(clientPhone) && (
            <p className="mt-1 text-xs text-red-500">
              Insira um número de telefone válido
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 