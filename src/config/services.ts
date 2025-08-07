export interface Service {
  id: string;
  name: string;
  category: 'nails' | 'face' | 'eyebrows' | 'waxing';
  description: string;
  translationKey: string;
}

export const services: Service[] = [
  // Serviços de Unhas
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Manicure com Shellac',
    category: 'nails',
    description: 'Manicure profissional com esmalte em gel Shellac para maior durabilidade',
    translationKey: 'services.nails.services.0'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Pedicure com Shellac',
    category: 'nails',
    description: 'Pedicure completa com esmalte em gel Shellac para um acabamento duradouro',
    translationKey: 'services.nails.services.1'
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Spa Pedicure',
    category: 'nails',
    description: 'Tratamento relaxante para os pés com esfoliação e massagem',
    translationKey: 'services.nails.services.2'
  },
  {
    id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    name: 'Unhas em Gel',
    category: 'nails',
    description: 'Alongamento ou cobertura em gel para unhas mais resistentes e bonitas',
    translationKey: 'services.nails.services.3'
  },
  {
    id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    name: 'Reparos de Unhas',
    category: 'nails',
    description: 'Consertos e reparos em unhas danificadas ou quebradas',
    translationKey: 'services.nails.services.4'
  },

  // Sobrancelhas & Cílios
  {
    id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
    name: 'Design de Sobrancelhas',
    category: 'eyebrows',
    description: 'Design personalizado para realçar o formato natural das sobrancelhas',
    translationKey: 'services.eyebrows.services.0'
  },
  {
    id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
    name: 'Coloração de Sobrancelhas',
    category: 'eyebrows',
    description: 'Coloração profissional para realçar e definir as sobrancelhas',
    translationKey: 'services.eyebrows.services.1'
  },
  {
    id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8',
    name: 'Brow Lamination',
    category: 'eyebrows',
    description: 'Alisamento e modelagem das sobrancelhas para um visual mais definido',
    translationKey: 'services.eyebrows.services.2'
  },
  {
    id: '6ba7b816-9dad-11d1-80b4-00c04fd430c8',
    name: 'Lifting de Pestanas',
    category: 'eyebrows',
    description: 'Curvatura permanente das pestanas naturais para um olhar mais aberto',
    translationKey: 'services.eyebrows.services.3'
  },
  {
    id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
    name: 'Tintura de Pestanas',
    category: 'eyebrows',
    description: 'Coloração das pestanas para um olhar mais marcante sem necessidade de máscara',
    translationKey: 'services.eyebrows.services.4'
  },

  // Tratamentos Faciais
  {
    id: '6ba7b818-9dad-11d1-80b4-00c04fd430c8',
    name: 'Limpeza Facial',
    category: 'face',
    description: 'Limpeza profunda da pele com extração de impurezas e hidratação',
    translationKey: 'services.facial.services.0'
  },
  {
    id: '6ba7b819-9dad-11d1-80b4-00c04fd430c8',
    name: 'Hidratação Labial',
    category: 'face',
    description: 'Tratamento de hidratação específico para os lábios',
    translationKey: 'services.facial.services.1'
  },
  {
    id: '6ba7b81a-9dad-11d1-80b4-00c04fd430c8',
    name: 'Técnica com Fios',
    category: 'face',
    description: 'Técnica de depilação facial com fios para resultados precisos',
    translationKey: 'services.facial.services.2'
  },


  // Serviços de Depilação
  {
    id: '6ba7b81c-9dad-11d1-80b4-00c04fd430c8',
    name: 'Depilação com Cera Quente',
    category: 'waxing',
    description: 'Depilação profissional com cera quente para resultados duradouros',
    translationKey: 'services.depilation.services.0'
  },
  {
    id: '6ba7b81d-9dad-11d1-80b4-00c04fd430c8',
    name: 'Depilação com Cera Fria',
    category: 'waxing',
    description: 'Depilação suave com cera fria, ideal para peles sensíveis',
    translationKey: 'services.depilation.services.1'
  },
  {
    id: '6ba7b81e-9dad-11d1-80b4-00c04fd430c8',
    name: 'Depilação Íntima',
    category: 'waxing',
    description: 'Depilação íntima com técnicas especializadas e produtos adequados',
    translationKey: 'services.depilation.services.2'
  },
  {
    id: '6ba7b81f-9dad-11d1-80b4-00c04fd430c8',
    name: 'Depilação Facial',
    category: 'waxing',
    description: 'Depilação facial com técnicas delicadas para pele do rosto',
    translationKey: 'services.depilation.services.3'
  },
  {
    id: '6ba7b820-9dad-11d1-80b4-00c04fd430c8',
    name: 'Depilação Corporal',
    category: 'waxing',
    description: 'Depilação corporal completa para uma pele macia e livre de pelos',
    translationKey: 'services.depilation.services.4'
  }
]; 