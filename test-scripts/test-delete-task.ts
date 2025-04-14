import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface DeleteResponse {
  success: boolean;
  message?: string;
}

const taskClient = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    host: 'localhost',
    port: 3002,
  }
});

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTQ0M2U2ZC02NThlLTQ0ZDktODcyZC03MTRiMWY5Mjc4M2QiLCJpYXQiOjE3NDQ1MDkwOTEsImV4cCI6MTc0NDUwOTk5MX0.bU4nmdI47fE1M76qydwu9hHlkVzAcihPJQ3vx7OoUAU';

async function testDeleteTask() {
  try {
    console.log('Starting DELETE test...');
    
    const deletePayload = {
      taskId: '6c01664a-726b-43c9-bf6e-891d96e4b7d8', // Reemplaza con ID existente
      authorization: `Bearer ${JWT_TOKEN}`
    };

    console.log('⌛ Sending delete request...');
    const response = await firstValueFrom(
      taskClient.send<DeleteResponse>(
        { cmd: 'task.v1.delete' }, 
        deletePayload
      )
    );

    console.log('✅ Delete successful:');
    console.log('  Success:', response.success);
    if (response.message) {
      console.log('  Message:', response.message);
    }

    return response;
  } catch (err) {
    console.error('❌ Delete failed:');
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

testDeleteTask()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));