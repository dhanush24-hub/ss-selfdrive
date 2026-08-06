export function validateAdminToken(
  authHeader: string | null | undefined
): boolean {
  if (!authHeader) return false
  let token = authHeader.trim()
  if (token.startsWith('Bearer ')) token = token.slice(7).trim()
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const secret  = process.env.ADMIN_SESSION_SECRET
    if (!secret) return false
    return decoded.includes(secret)
  } catch {
    return false
  }
}

export function validateAdminSecret(
  secret: string | null | undefined
): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return secret === expected
}
