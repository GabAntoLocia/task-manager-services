import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateUserDto } from 'apps/user-service/src/aplication/dto/create-user.dto';
import { LoginUserDto } from 'apps/user-service/src/aplication/dto/login-user.dto';
import { CreateTaskDto } from 'apps/task-service/src/aplication/dto/create-task.dto';

// Decorador para el controlador
export function ApiController() {
  return applyDecorators(
    ApiTags('API Gateway'),
    ApiBearerAuth(),
  );
}

// Decoradores para Auth
export function ApiAuthRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo usuario' }),
    ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' }),
    ApiResponse({ status: 400, description: 'Datos inválidos' }),
    ApiBody({ type: CreateUserDto }),
  );
}

export function ApiAuthLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Iniciar sesión' }),
    ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' }),
    ApiResponse({ status: 401, description: 'Credenciales inválidas' }),
    ApiBody({ type: LoginUserDto }),
  );
}

export function ApiAuthLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Cerrar sesión' }),
    ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' }),
    ApiBearerAuth('JWT'),
    ApiResponse({ status: 401, description: 'No autorizado' }),
    ApiResponse({ status: 500, description: 'Error interno del servidor' }),
    ApiResponse({ status: 403, description: 'Acceso denegado' }),
    ApiResponse({ status: 404, description: 'Usuario no encontrado' }),
    ApiResponse({ status: 400, description: 'Solicitud inválida' }),
    ApiResponse({ status: 429, description: 'Demasiadas solicitudes' }),
    
  );
}

// Decoradores para User
export function ApiUserProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener perfil de usuario' }),
    ApiResponse({ status: 200, description: 'Perfil de usuario obtenido' }),
    ApiResponse({ status: 401, description: 'No autorizado' }),
  );
}

// Decoradores para Task
export function ApiTaskCreate() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear una nueva tarea' }),
    ApiResponse({ status: 201, description: 'Tarea creada exitosamente' }),
    ApiResponse({ status: 400, description: 'Datos inválidos' }),
    ApiBody({ type: CreateTaskDto }),
  );
}

export function ApiTaskGetAll() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener todas las tareas' }),
    ApiResponse({ status: 200, description: 'Lista de tareas obtenida' }),
    ApiResponse({ status: 401, description: 'No autorizado' }),
  );
}

export function ApiTaskUpdate() {
  return applyDecorators(
    ApiOperation({ summary: 'Actualizar una tarea' }),
    ApiResponse({ status: 200, description: 'Tarea actualizada' }),
    ApiResponse({ status: 404, description: 'Tarea no encontrada' }),
    ApiParam({ name: 'taskId', type: 'string' }),
  );
}

export function ApiTaskDelete() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar una tarea' }),
    ApiResponse({ status: 200, description: 'Tarea eliminada' }),
    ApiResponse({ status: 404, description: 'Tarea no encontrada' }),
    ApiParam({ name: 'taskId', type: 'string' }),
    ApiResponse({ status: 500, description: 'Error interno del servidor' }),
  );
}