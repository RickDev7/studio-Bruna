export interface Service {
  id: string;
  name: string;
  category: 'nails' | 'face' | 'eyebrows' | 'lips';
}

export const services: Service[] = [
  // Serviços de Unhas
  {
    id: 'manicure-shellac',
    name: 'Manicure com Shellac',
    category: 'nails'
  },
  {
    id: 'pedicure-shellac',
    name: 'Pedicure com Shellac',
    category: 'nails'
  },
  {
    id: 'spa-pedicure',
    name: 'Spa Pedicure',
    category: 'nails'
  },
  {
    id: 'gel-nails',
    name: 'Unhas em Gel',
    category: 'nails'
  },
  {
    id: 'nail-repair',
    name: 'Reparos de Unhas',
    category: 'nails'
  },

  // Serviços Faciais
  {
    id: 'facial-cleaning',
    name: 'Limpeza Facial',
    category: 'face'
  },
  {
    id: 'anti-aging',
    name: 'Tratamento Anti-idade',
    category: 'face'
  },
  {
    id: 'facial-hydration',
    name: 'Hidratação Facial',
    category: 'face'
  },
  {
    id: 'microneedling',
    name: 'Microagulhamento',
    category: 'face'
  },
  {
    id: 'facial-masks',
    name: 'Máscaras Faciais',
    category: 'face'
  },

  // Serviços de Sobrancelhas e Cílios
  {
    id: 'eyebrow-design',
    name: 'Design de Sobrancelhas',
    category: 'eyebrows'
  },
  {
    id: 'eyebrow-coloring',
    name: 'Coloração de Sobrancelhas',
    category: 'eyebrows'
  },
  {
    id: 'brow-lamination',
    name: 'Brow Lamination',
    category: 'eyebrows'
  },
  {
    id: 'lash-lifting',
    name: 'Lifting de Pestanas',
    category: 'eyebrows'
  },

  // Serviços de Cílios
  {
    id: 'lash-tinting',
    name: 'Tintura de Cílios',
    category: 'eyebrows'
  },

  // Serviços Labiais
  {
    id: 'lip-hydration',
    name: 'Hidratação Labial',
    category: 'lips'
  },
  {
    id: 'lip-treatment',
    name: 'Revitalização Labial',
    category: 'lips'
  }
]; 