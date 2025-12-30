import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from '@common/decorators/roles.decorator';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    role: UserRole;
    [key: string]: any; // optional, in case JWT payload has more
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles required for this route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get typed request
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // Deny if user not present
    if (!user || !user.role) {
      return false;
    }

    // Allow if user role matches any required role
    return requiredRoles.some((role) => user.role === role);
  }
}
