import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

async function main() {
    const client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
            host: '127.0.0.1',
            port: 3001,
        },
    });

    const payload = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjlmZjk1Mi1lZTM2LTRiN2EtYWMyYy0yOWJjNDBiZjhhMTMiLCJpYXQiOjE3NDQ1MTUyODEsImV4cCI6MTc0NDUxNTM0MX0.31YIQ8ykr-2ASeK9RKYSTKiK9yqvv9muvcpjv0jcK2Y', // token de acceso válido
    };


    try {
        console.log('⌛ Attempting to retrieve profile...');
        const response = await firstValueFrom(
            client.send({ cmd: 'users.v1.getProfile' }, payload)
          );
        console.log('✅ Profile retrieved successfully:', response);

    } catch (err) {
        console.error('❌ Error retrieving profile:', err.message || err);
        if (err.response) {
            console.error('Server response:', err.response);
        }
    } finally {
        // Cerrar conexión
        await client.close();
      }

}

main()