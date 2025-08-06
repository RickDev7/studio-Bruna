export interface Service {
  id: string;
  name: string;
  category: 'nails' | 'face' | 'eyebrows';
  description: string;
}

export const services: Service[] = [
  // Serviços de Unhas
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Manicure com Shellac',
    category: 'nails',
    description: 'Manicure profissional com esmalte em gel Shellac para maior durabilidade'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Pedicure com Shellac',
    category: 'nails',
    description: 'Pedicure completa com esmalte em gel Shellac para um acabamento duradouro'
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Spa Pedicure',
    category: 'nails',
    description: 'Tratamento relaxante para os pés com esfoliação e massagem'
  },
  {
    id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    name: 'Unhas em Gel',
    category: 'nails',
    description: 'Alongamento ou cobertura em gel para unhas mais resistentes e bonitas'
  },
  {
    id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    name: 'Reparos de Unhas',
    category: 'nails',
    description: 'Consertos e reparos em unhas danificadas ou quebradas'
  },

  // Sobrancelhas & Cílios
  {
    id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
    name: 'Design de Sobrancelhas',
    category: 'eyebrows',
    description: 'Design personalizado para realçar o formato natural das sobrancelhas'
  },
  {
    id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
    name: 'Coloração de Sobrancelhas',
    category: 'eyebrows',
    description: 'Coloração profissional para realçar e definir as sobrancelhas'
  },
  {
    id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8',
    name: 'Brow Lamination',
    category: 'eyebrows',
    description: 'Alisamento e modelagem das sobrancelhas para um visual mais definido'
  },
  {
    id: '6ba7b816-9dad-11d1-80b4-00c04fd430c8',
    name: 'Lifting de Pestanas',
    category: 'eyebrows',
    description: 'Curvatura permanente dos cílios naturais para um olhar mais aberto'
  },
  {
    id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
    name: 'Tintura de Cílios',
    category: 'eyebrows',
    description: 'Coloração dos cílios para um olhar mais marcante sem necessidade de máscara'
  },

  // Tratamentos Faciais
  {
    id: '6ba7b818-9dad-11d1-80b4-00c04fd430c8',
    name: 'Limpeza Facial',
    category: 'face',
    description: 'Limpeza profunda da pele com extração de impurezas e hidratação'
  },
  {
    id: '6ba7b819-9dad-11d1-80b4-00c04fd430c8',
    name: 'Hidratação Labial',
    category: 'face',
    description: 'Tratamento de hidratação específico para os lábios'
  },
  {
    id: '6ba7b81a-9dad-11d1-80b4-00c04fd430c8',
    name: 'Técnica com Fios',
    category: 'face',
    description: 'Técnica de depilação facial com fios para resultados precisos'
  },
  {
    id: '6ba7b81b-9dad-11d1-80b4-00c04fd430c8',
    name: 'Depilação com Cera',
    category: 'face',
    description: 'Depilação facial com cera quente para resultados duradouros'
  }
]; 