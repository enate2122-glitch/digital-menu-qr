import QRCode from 'qrcode';

export async function generateQrPng(uniqueQrId: string, restaurantName?: string): Promise<Buffer> {
  const domain = process.env.MENU_DOMAIN ?? 'localhost:5173';
  const protocol = domain.startsWith('localhost') || /^\d+\.\d+\.\d+\.\d+/.test(domain.split(':')[0])
    ? 'http'
    : 'https';
  const url = `${protocol}://${domain}/menu/${uniqueQrId}`;

  if (!restaurantName) {
    return QRCode.toBuffer(url, { type: 'png', width: 400, margin: 2 });
  }

  // Generate QR as SVG string, then inject restaurant name and logo area
  const svgString = await QRCode.toString(url, {
    type: 'svg',
    width: 400,
    margin: 2,
    color: { dark: '#0d0d1a', light: '#ffffff' },
  });

  // Truncate name if too long
  const name = restaurantName.length > 22 ? restaurantName.slice(0, 22) + '…' : restaurantName;

  // Inject: white rounded rect + restaurant name text at bottom, and a small logo area in center
  const enhanced = svgString
    .replace('</svg>', `
      <!-- Bottom label background -->
      <rect x="0" y="360" width="400" height="40" fill="#0d0d1a" />
      <!-- Restaurant name -->
      <text
        x="200" y="386"
        font-family="Georgia, serif"
        font-size="18"
        font-weight="bold"
        fill="#c9a84c"
        text-anchor="middle"
        dominant-baseline="middle"
        letter-spacing="1"
      >${escapeXml(name)}</text>
      <!-- Center white circle for logo feel -->
      <circle cx="200" cy="180" r="28" fill="white" />
      <!-- Fork icon in center -->
      <text x="200" y="188" font-size="26" text-anchor="middle" dominant-baseline="middle">🍽️</text>
      <!-- Gold ring around center -->
      <circle cx="200" cy="180" r="30" fill="none" stroke="#c9a84c" stroke-width="2.5" />
    </svg>`);

  // Return as SVG buffer (PNG-like, but SVG — change content type in router)
  return Buffer.from(enhanced, 'utf-8');
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
