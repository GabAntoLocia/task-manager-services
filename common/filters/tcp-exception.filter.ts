import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';

@Catch()
export class TcpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    const errorResponse = this.mapExceptionToErrorResponse(exception);

    // Logging detallado en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('TCP Error Handler:', {
        error: exception,
        stack: exception instanceof Error ? exception.stack : undefined,
        response: errorResponse
      });
    }

    return throwError(() => new RpcException(errorResponse));
  }

  private mapExceptionToErrorResponse(exception: unknown): {
    status: string;
    code: number;
    message: string;
    details?: Record<string, any>;
  } {
    // Mapeo de excepciones conocidas
    console.log('Mapping exception:', exception);
    console.log('Exception type:', typeof exception);
    console.log('Exception instance:', exception instanceof Error);
    console.log('Exception message:', (exception as Error).message);
    switch (true) {
      case exception instanceof NotFoundException:
        return {
          status: 'NOT_FOUND',
          code: 404,
          message: exception.message || 'Recurso no encontrado'
        };

      case exception instanceof ConflictException:
        return {
          status: 'CONFLICT',
          code: 409,
          message: exception.message || 'Conflicto detectado'
        };

      case exception instanceof BadRequestException:
        return {
          status: 'BAD_REQUEST',
          code: 400,
          message: exception.message || 'Petición inválida'
        };

      case exception instanceof UnauthorizedException:
        return {
          status: 'UNAUTHORIZED',
          code: 401,
          message: exception.message || 'No autorizado'
        };

      case exception instanceof RpcException:
        return {
          status: 'RPC_ERROR',
          code: 500,
          message: exception.message || 'Error en comunicación interna'
        };

      default:
        return {
          status: 'INTERNAL_ERROR',
          code: 500,
          message: 'Error interno del servidor',
          details: this.sanitizeUnknownError(exception)
        };
    }
  }

  private sanitizeUnknownError(error: unknown): Record<string, any> {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      };
    }
    return { originalError: String(error) };
  }
}