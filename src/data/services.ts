import { 
  FaPaintBrush, 
  FaSocks, 
  FaEye, 
  FaSpa 
} from 'react-icons/fa';

export const services = [
  {
    id: 'manicure',
    name: 'Manicure',
    icon: FaPaintBrush,
    description: 'Cuidados completos para suas mãos e unhas',
    duration: '45min',
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    icon: FaSocks,
    description: 'Tratamento especializado para pés e unhas',
    duration: '50min',
  },
  {
    id: 'sobrancelhas',
    name: 'Design de Sobrancelhas',
    icon: FaEye,
    description: 'Design profissional para realçar seu olhar',
    duration: '30min',
  },
  {
    id: 'limpeza',
    name: 'Limpeza de Pele',
    icon: FaSpa,
    description: 'Tratamento completo para uma pele renovada',
    duration: '60min',
  },
] as const; 