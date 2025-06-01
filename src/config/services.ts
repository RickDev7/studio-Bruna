export interface Service {
  id: string;
  name: string;
  category: 'nails' | 'face' | 'eyebrows' | 'lips';
  duration: number;
}

export const services: Service[] = [
  // Serviços de Unhas
  {
    id: 'manicure-shellac',
    name: 'Manicure com Shellac',
    category: 'nails',
    duration: 60
  },
  {
    id: 'pedicure-shellac',
    name: 'Pedicure com Shellac',
    category: 'nails',
    duration: 60
  },
  {
    id: 'spa-pedicure',
    name: 'Spa Pedicure',
    category: 'nails',
    duration: 90
  },
  {
    id: 'gel-nails',
    name: 'Unhas em Gel',
    category: 'nails',
    duration: 120
  },
  {
    id: 'nail-repair',
    name: 'Reparos de Unhas',
    category: 'nails',
    duration: 30
  },

  // Serviços Faciais
  {
    id: 'facial-cleaning',
    name: 'Limpeza Facial',
    category: 'face',
    duration: 90
  },
  {
    id: 'anti-aging',
    name: 'Tratamento Anti-idade',
    category: 'face',
    duration: 60
  },
  {
    id: 'facial-hydration',
    name: 'Hidratação Facial',
    category: 'face',
    duration: 45
  },
  {
    id: 'microneedling',
    name: 'Microagulhamento',
    category: 'face',
    duration: 60
  },
  {
    id: 'facial-masks',
    name: 'Máscaras Faciais',
    category: 'face',
    duration: 30
  },

  // Serviços de Sobrancelhas e Cílios
  {
    id: 'eyebrow-design',
    name: 'Design de Sobrancelhas',
    category: 'eyebrows',
    duration: 30
  },
  {
    id: 'eyebrow-coloring',
    name: 'Coloração de Sobrancelhas',
    category: 'eyebrows',
    duration: 45
  },
  {
    id: 'brow-lamination',
    name: 'Brow Lamination',
    category: 'eyebrows',
    duration: 60
  },
  {
    id: 'lash-lifting',
    name: 'Lifting de Pestanas',
    category: 'eyebrows',
    duration: 60
  },

  // Serviços de Cílios
  {
    id: 'lash-tinting',
    name: 'Tintura de Cílios',
    category: 'eyebrows',
    duration: 30
  },

  // Serviços Labiais
  {
    id: 'lip-hydration',
    name: 'Hidratação Labial',
    category: 'lips',
    duration: 30
  },
  {
    id: 'lip-treatment',
    name: 'Revitalização Labial',
    category: 'lips',
    duration: 45
  }
]; 