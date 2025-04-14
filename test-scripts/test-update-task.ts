import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface TaskResponse {
    id: string;
    title: string;
    status: 'PENDING' | 'COMPLETED';
    updatedAt: string;
}

const taskClient = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
        host: 'localhost',
        port: 3002,
    }
});

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTQ0M2U2ZC02NThlLTQ0ZDktODcyZC03MTRiMWY5Mjc4M2QiLCJpYXQiOjE3NDQ1MDkwOTEsImV4cCI6MTc0NDUwOTk5MX0.bU4nmdI47fE1M76qydwu9hHlkVzAcihPJQ3vx7OoUAU';

async function testUpdateTask() {
    try {
        console.log('Starting UPDATE test...');

        const updateData = {
            taskId: '6032cb71-2094-49c0-be9a-5bfbbd77e255', // Reemplaza con ID existente
            data: {
                title: 'Nuevo título 2',
                description: 'Descripción actualizada',
                priority: 'HIGH', // 'LOW' | 'MEDIUM' | 'HIGH'
                status: 'COMPLETED'
            },
            authorization: `Bearer ${JWT_TOKEN}`
        };

        console.log('⌛ Sending update request...');
        const response = await firstValueFrom(
            taskClient.send<TaskResponse>(
                { cmd: 'task.v1.update' },
                updateData
            )
        );

        console.log('✅ Update successful:');
        console.log('  ID:', response.id);
        console.log('  New Title:', response.title);
        console.log('  New Status:', response.status);
        console.log('  Last Updated:', new Date(response.updatedAt).toLocaleString());

        return response;
    } catch (err) {
        console.error('❌ Update failed:');
        console.error('  Error:', err.message);
        console.error('  Code:', err.code || 'N/A');
        if (err.details) {
            console.error('  Details:', err.details);
        }
        throw err;
    } finally {
        await taskClient.close();
        console.log('Connection closed');
    }
}

testUpdateTask()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));