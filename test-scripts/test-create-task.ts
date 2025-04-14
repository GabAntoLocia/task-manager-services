import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

// Interface para la estructura de datos
interface CreateTaskDto {
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'PENDING' | 'COMPLETED';
}

// Configuración del cliente TCP
const taskClient = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
        host: 'localhost',
        port: 3002, // Puerto del microservicio de tareas
    },
});

async function createTaskTest() {
    try {
        // 1. Preparar datos de la tarea
        const taskData: CreateTaskDto = {
            title: 'New Task 5',
            description: 'This is a test task 5',
            priority: 'LOW',
            status: 'PENDING',
        };

        // 2. Token JWT (debes obtenerlo de tu sistema de autenticación)
        const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjlmZjk1Mi1lZTM2LTRiN2EtYWMyYy0yOWJjNDBiZjhhMTMiLCJpYXQiOjE3NDQ1MTUxMTYsImV4cCI6MTc0NDUxNTE3Nn0._RJTybgIANG11NxY0mNhPFiSVcaiedyTp6gqLfHjXQA'; // Reemplaza con un token válido

        // 3. Enviar solicitud para crear tarea con autenticación
        console.log('⌛ Attempting to create task...');
        const response = await firstValueFrom(
            taskClient.send(
                { cmd: 'task.v1.create-task' },
                {
                    ...taskData,
                    // El guard espera el token en authorization o directamente en token
                    authorization: `Bearer ${jwtToken}`,
                    // Alternativamente puedes usar:
                    // token: jwtToken
                }
            )
        );

        // 4. Verificar respuesta
        console.log('✅ Task created successfully:', {
            id: response.id,
            title: response.title,
            status: response.status,
            userId: response.userId // El userId viene del token decodificado
        });

        return response;
    } catch (err) {
        console.log("err", err);
        console.error('❌ Task creation failed:', {
            message: err.message,
            code: err.code || 'N/A',
            details: err.details || 'No additional details',
        });
        throw err;
    } finally {
        // Cerrar conexión
        taskClient.close();
    }
}

// Ejecutar prueba
createTaskTest()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));