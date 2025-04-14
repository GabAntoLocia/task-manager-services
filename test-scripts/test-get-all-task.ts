import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

// Interface para la respuesta de tareas
interface TaskResponse {
    id: string;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'PENDING' | 'COMPLETED';
    userId: string;
    createdAt: string;
    updatedAt: string;
}

// Configuración del cliente TCP
const taskClient = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
        host: 'localhost',
        port: 3002, // Puerto del microservicio de tareas
    },
});

async function getTasksTest() {
    try {
        // 1. Token JWT (debes obtenerlo de tu sistema de autenticación)
        const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjlmZjk1Mi1lZTM2LTRiN2EtYWMyYy0yOWJjNDBiZjhhMTMiLCJpYXQiOjE3NDQ1MTUyODEsImV4cCI6MTc0NDUxNTM0MX0.31YIQ8ykr-2ASeK9RKYSTKiK9yqvv9muvcpjv0jcK2Y'; // Reemplaza con un token válido

        // 2. Parámetros opcionales de filtrado
        const filters = {
            pagination: {
                page: 1,            // Opcional: página actual
                limit: 20,         // Opcional: número de resultados
            }                                                          // Opcional: 'LOW' | 'MEDIUM' | 'HIGH' | undefined

        };

        // 3. Enviar solicitud para obtener tareas
        console.log('⌛ Fetching tasks...');
        const response = await firstValueFrom(
            taskClient.send<TaskResponse[]>(
                { cmd: 'task.v1.get-all' },
                {
                    
                   
                    authorization: `Bearer ${jwtToken}` // Autenticación
                }
            )
        );

        console.log('Response', response);

        // 4. Mostrar resultados
        console.log(`✅ Found ${response.length} tasks:`);
        response.forEach((task, index) => {
            console.log(`\nTask #${index + 1}:`);
            console.log(`  ID: ${task.id}`);
            console.log(`  Title: ${task.title}`);
            console.log(`  Status: ${task.status}`);
            console.log(`  Priority: ${task.priority}`);
            console.log(`  Created: ${new Date(task.createdAt).toLocaleString()}`);
        });

        return response;
    } catch (err) {
        console.error('❌ Failed to fetch tasks:', {
            message: err.message,
            code: err.code || 'N/A',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        throw err;
    } finally {
        // Cerrar conexión
        await taskClient.close();
        console.log('Connection closed');
    }
}

// Ejecutar prueba
getTasksTest()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));