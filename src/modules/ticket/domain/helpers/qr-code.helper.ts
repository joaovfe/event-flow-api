import * as QRCode from 'qrcode';

export class QrCodeHelper {
  /**
   * Gera a representação do QR Code (data-URL PNG em base64) a partir do
   * conteúdo informado, normalmente o código único do ingresso.
   */
  public static async generate(content: string): Promise<string> {
    return await QRCode.toDataURL(content, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
    });
  }
}
