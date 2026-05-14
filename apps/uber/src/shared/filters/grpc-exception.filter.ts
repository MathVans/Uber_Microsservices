import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { type Response, type Request } from 'express';
import { status as GrpcStatus } from '@grpc/grpc-js';

type GrpcError = {
  code?: number;
  details?: string;
  message?: string;
};

const GRPC_TO_HTTP: Record<number, HttpStatus> = {
  [GrpcStatus.OK]: HttpStatus.OK,
  [GrpcStatus.CANCELLED]: HttpStatus.REQUEST_TIMEOUT,
  [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
  [GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
  [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
  [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
  [GrpcStatus.ABORTED]: HttpStatus.CONFLICT,
  [GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
  [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
  [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};

const isHttpStatusCode = (code?: number): code is HttpStatus =>
  typeof code === 'number' && code >= 100 && code < 600;

const mapGrpcCodeToHttp = (code?: number): HttpStatus => {
  if (isHttpStatusCode(code)) {
    return code;
  }

  if (typeof code === 'number' && code in GRPC_TO_HTTP) {
    return GRPC_TO_HTTP[code];
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
};

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      response.status(status).json(body);
      return;
    }

    const grpcError = exception as GrpcError;
    const status = mapGrpcCodeToHttp(grpcError.code);
    const message = grpcError.details || grpcError.message || 'Erro interno.';

    response.status(status).json({
      statusCode: status,
      message,
      error: message,
      path: request?.url,
      timestamp: new Date().toISOString(),
    });
  }
}
