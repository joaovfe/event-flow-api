import { randomBytes } from 'crypto';

export class TicketCodeHelper {
  public static generate(): string {
    const random = randomBytes(6).toString('hex').toUpperCase();
    return `EVF-${random}`;
  }
}
