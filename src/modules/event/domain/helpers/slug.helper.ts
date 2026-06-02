const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');

export class SlugHelper {
  public static generate(value: string): string {
    return value
      .normalize('NFD')
      .replace(DIACRITICS, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
