import { EAuditAction } from '../enums/audit-action.enum';
import { EAuditResource } from '../enums/audit-resource.enum';

export const AUDIT_EVENT = 'audit.action';

export class AuditEvent {
  public action: EAuditAction;
  public resource: EAuditResource;
  public description: string;
  public actorId?: number;
  public actorName?: string;
  public actorEmail?: string;
  public actorRole?: string;
  public targetId?: string;
  public httpMethod: string;
  public path: string;
  public statusCode: number;
  public success: boolean;
  public ipAddress?: string;
  public metadata?: Record<string, unknown>;

  public constructor(data: AuditEvent) {
    Object.assign(this, data);
  }
}
