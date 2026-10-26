/**
 * Normalize a Sri Lankan phone number to international format.
 * Accepts formats like: 0771234567, +94771234567, 94771234567, 077-123-4567
 * Returns: +94771234567 or empty string if invalid.
 */
export function normalizeLKPhone(raw: string): string {
  // Strip all non-digit characters except leading +
  const cleaned = raw.replace(/[^\d+]/g, '');

  // Remove leading +
  const digits = cleaned.replace(/^\+/, '');

  // Sri Lankan numbers: country code 94, then 9 digits
  if (digits.startsWith('94') && digits.length === 11) {
    return `+${digits}`;
  }

  // Local format: 0XX XXXXXXX (10 digits starting with 0)
  if (digits.startsWith('0') && digits.length === 10) {
    return `+94${digits.slice(1)}`;
  }

  // Already 9 digits without country code or leading 0
  if (!digits.startsWith('0') && !digits.startsWith('94') && digits.length === 9) {
    return `+94${digits}`;
  }

  return '';
}

/**
 * Generate a tel: link for a phone number.
 */
export function telLink(phone: string): string {
  const normalized = normalizeLKPhone(phone);
  if (!normalized) return '';
  return `tel:${normalized}`;
}

/**
 * Generate a WhatsApp link (wa.me) for a phone number.
 * Uses the normalized number without + prefix as wa.me expects.
 */
export function whatsappLink(phone: string): string {
  const normalized = normalizeLKPhone(phone);
  if (!normalized) return '';
  // wa.me expects number without + and without spaces
  return `https://wa.me/${normalized.replace('+', '')}`;
}

/**
 * Format phone number for display: +94 77 123 4567
 */
export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizeLKPhone(phone);
  if (!normalized) return phone;
  // +94XXXXXXXXX -> +94 XX XXX XXXX
  const digits = normalized.replace('+94', '');
  return `+94 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
}
