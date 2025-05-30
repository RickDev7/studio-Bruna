export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  category: 'nails' | 'face' | 'eyebrows' | 'lips';
}

export const services: Service[] = [
  // Serviços de Unhas
  {
    id: 'manicure',
    name: 'Manicure',
    description: 'Cuidados completos para suas mãos e unhas',
    duration: '45min',
    category: 'nails'
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    description: 'Cuidados completos para seus pés e unhas',
    duration: '60min',
    category: 'nails'
  },
  {
    id: 'nail-design',
    name: 'Design de Unhas',
    description: 'Arte e decoração personalizada',
    duration: '30min',
    category: 'nails'
  },
  {
    id: 'gel-nails',
    name: 'Unhas em Gel',
    description: 'Alongamento com gel para unhas mais resistentes',
    duration: '90min',
    category: 'nails'
  },
  {
    id: 'nail-removal',
    name: 'Remoção de Unhas',
    description: 'Remoção segura de unhas em gel ou acrílico',
    duration: '45min',
    category: 'nails'
  },

  // Serviços Faciais
  {
    id: 'facial-cleaning',
    name: 'Limpeza de Pele',
    description: 'Limpeza profunda e revitalização da pele',
    duration: '90min',
    category: 'face'
  },
  {
    id: 'facial-treatment',
    name: 'Tratamento Facial',
    description: 'Tratamento personalizado para sua pele',
    duration: '60min',
    category: 'face'
  },
  {
    id: 'facial-massage',
    name: 'Massagem Facial',
    description: 'Massagem relaxante e rejuvenescedora',
    duration: '45min',
    category: 'face'
  },

  // Serviços de Sobrancelhas
  {
    id: 'eyebrow-design',
    name: 'Design de Sobrancelhas',
    description: 'Design personalizado para harmonização facial',
    duration: '30min',
    category: 'eyebrows'
  },
  {
    id: 'eyebrow-lamination',
    name: 'Laminação de Sobrancelhas',
    description: 'Alinhamento e disciplina dos fios',
    duration: '60min',
    category: 'eyebrows'
  },
  {
    id: 'eyebrow-henna',
    name: 'Sobrancelha com Henna',
    description: 'Coloração natural e definição',
    duration: '45min',
    category: 'eyebrows'
  },

  // Serviços de Cílios
  {
    id: 'lash-lifting',
    name: 'Lifting de Cílios',
    description: 'Curvatura natural e duradoura',
    duration: '60min',
    category: 'eyebrows'
  },
  {
    id: 'lash-tinting',
    name: 'Tintura de Cílios',
    description: 'Coloração para realçar o olhar',
    duration: '30min',
    category: 'eyebrows'
  },

  // Serviços Labiais
  {
    id: 'lip-hydration',
    name: 'Hidratação Labial',
    description: 'Tratamento intensivo para lábios',
    duration: '30min',
    category: 'lips'
  },
  {
    id: 'lip-treatment',
    name: 'Revitalização Labial',
    description: 'Tratamento completo para lábios',
    duration: '45min',
    category: 'lips'
  }
]; 