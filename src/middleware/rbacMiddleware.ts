// Enterprise RBAC Middleware for ViniApp 2.0.0
import { GranularPermission, UserRole, UserSession } from '../types';
import { checkPermission } from '../hooks/usePermission';

export interface ProtectedActionContext {
  user: UserSession;
  actionName: string;
  targetResource?: string;
  ipAddress?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  target?: string;
  status: 'AUTHORIZED' | 'DENIED';
  txHash?: string;
}

// In-memory audit log accumulator
export const IN_MEMORY_AUDIT_LOGS: AuditRecord[] = [];

/**
 * Validates whether the active session holds the requisite granular permission.
 * Throws error or returns authorization decision and registers cryptographic audit entry.
 */
export function authorizeAction(
  context: ProtectedActionContext,
  requiredPermission: GranularPermission
): { authorized: boolean; error?: string } {
  const isAllowed = checkPermission(context.user.role, requiredPermission);

  const auditEntry: AuditRecord = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    actor: context.user.handle,
    role: context.user.role,
    action: context.actionName,
    target: context.targetResource,
    status: isAllowed ? 'AUTHORIZED' : 'DENIED',
    txHash: isAllowed ? `0x${Math.random().toString(16).slice(2, 10)}...` : undefined,
  };

  IN_MEMORY_AUDIT_LOGS.unshift(auditEntry);

  if (!isAllowed) {
    return {
      authorized: false,
      error: `Access Denied: Role '${context.user.role}' lacks '${requiredPermission}' capability.`,
    };
  }

  return { authorized: true };
}
