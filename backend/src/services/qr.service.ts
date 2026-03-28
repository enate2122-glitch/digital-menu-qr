import QRCode from 'qrcode';

export async function generateQrPng(uniqueQrId: string): Promise<Buffer> {
  const domain = process.env.MENU_DOMAIN ?? 'localhost:5173';
  // Use http for local IPs, https for real domains
  const protocol = domain.startsWith('localhost') || /^\d+\.\d+\.\d+\.\d+/.test(domain.split(':')[0])
    ? 'http'
    : 'https';
  const url = `${protocol}://${domain}/menu/${uniqueQrId}`;
  return QRCode.toBuffer(url, { type: 'png', width: 400, margin: 2 });
}
