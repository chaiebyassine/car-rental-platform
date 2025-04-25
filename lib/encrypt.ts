const encoder = new TextEncoder();
const secret = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET;

if (!secret) {
  throw new Error('❌ ENCRYPTION_KEY is missing in environment variables');
}

const key = encoder.encode(secret);

// Hash function with key-based encryption
export const hash = async (plainPassword: string): Promise<string> => {
  const passwordData = encoder.encode(plainPassword);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign', 'verify']
  );

  const hashBuffer = await crypto.subtle.sign('HMAC', cryptoKey, passwordData);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const compare = async (
  plainPassword: string,
  encryptedPassword: string
): Promise<boolean> => {
  const hashedPassword = await hash(plainPassword);
  return hashedPassword === encryptedPassword;
};
