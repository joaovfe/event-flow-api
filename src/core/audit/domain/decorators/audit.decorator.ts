import { SetMetadata } from '@nestjs/common';

import { EAuditAction } from '../enums/audit-action.enum';
import { EAuditResource } from '../enums/audit-resource.enum';

export const AUDIT_KEY = 'audit';

export interface IAuditMetadata {
  resource: EAuditResource;
  action: EAuditAction;
  description?: string;
}

/**
 * Marca uma rota como administrativa para que o AuditInterceptor
 * capture a ação e publique um AuditEvent ao final da execução.
 */
export const Audit = (metadata: IAuditMetadata) =>
  SetMetadata(AUDIT_KEY, metadata);
