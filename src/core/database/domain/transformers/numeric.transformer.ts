import { ValueTransformer } from 'typeorm';

/**
 * Transformer para colunas numéricas (decimal) do PostgreSQL, que por padrão
 * são retornadas como string pelo driver. Garante que o valor manipulado na
 * aplicação seja sempre um number.
 */
export class NumericTransformer implements ValueTransformer {
  public to(value?: number | null): number | null | undefined {
    return value;
  }

  public from(value?: string | null): number | null {
    if (value === null || value === undefined) return null;

    return parseFloat(value);
  }
}
