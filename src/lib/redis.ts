// Arquivo desativado - não estamos usando Redis
export const redis = null;

// Funções mock para manter a compatibilidade
export async function setWithExpiry<T>() {
  return null;
}

export async function getJson<T>() {
  return null;
}

export async function increment() {
  return 1; // Retorna 1 para permitir sempre o acesso
}

export async function deleteKey() {
  return null;
} 