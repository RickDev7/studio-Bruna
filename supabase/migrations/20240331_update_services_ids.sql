-- Primeiro, vamos limpar a tabela de serviços existente
TRUNCATE TABLE services CASCADE;

-- Inserir os serviços com UUIDs
INSERT INTO services (id, name, category, duration, price, description) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Manicure com Shellac', 'nails', 60, 80.00, 'Manicure profissional com esmalte em gel Shellac para maior durabilidade'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Pedicure com Shellac', 'nails', 60, 90.00, 'Pedicure completa com esmalte em gel Shellac para um acabamento duradouro'),
  ('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Spa Pedicure', 'nails', 90, 120.00, 'Tratamento relaxante para os pés com esfoliação e massagem'),
  ('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Unhas em Gel', 'nails', 120, 150.00, 'Alongamento ou cobertura em gel para unhas mais resistentes e bonitas'),
  ('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'Reparos de Unhas', 'nails', 30, 50.00, 'Consertos e reparos em unhas danificadas ou quebradas'),
  ('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 'Design de Sobrancelhas', 'eyebrows', 45, 60.00, 'Design personalizado para realçar o formato natural das sobrancelhas'),
  ('6ba7b814-9dad-11d1-80b4-00c04fd430c8', 'Coloração de Sobrancelhas', 'eyebrows', 45, 70.00, 'Coloração profissional para realçar e definir as sobrancelhas'),
  ('6ba7b815-9dad-11d1-80b4-00c04fd430c8', 'Brow Lamination', 'eyebrows', 90, 150.00, 'Alisamento e modelagem das sobrancelhas para um visual mais definido'),
  ('6ba7b816-9dad-11d1-80b4-00c04fd430c8', 'Lifting de Pestanas', 'eyebrows', 90, 130.00, 'Curvatura permanente dos cílios naturais para um olhar mais aberto'),
  ('6ba7b817-9dad-11d1-80b4-00c04fd430c8', 'Tintura de Cílios', 'eyebrows', 45, 80.00, 'Coloração dos cílios para um olhar mais marcante sem necessidade de máscara'),
  ('6ba7b818-9dad-11d1-80b4-00c04fd430c8', 'Limpeza Facial', 'face', 120, 180.00, 'Limpeza profunda da pele com extração de impurezas e hidratação'),
  ('6ba7b819-9dad-11d1-80b4-00c04fd430c8', 'Hidratação Labial', 'face', 30, 50.00, 'Tratamento de hidratação específico para os lábios'),
  ('6ba7b81a-9dad-11d1-80b4-00c04fd430c8', 'Técnica com Fios', 'face', 30, 40.00, 'Técnica de depilação facial com fios para resultados precisos'),
  ('6ba7b81b-9dad-11d1-80b4-00c04fd430c8', 'Depilação com Cera', 'face', 30, 45.00, 'Depilação facial com cera quente para resultados duradouros'); 