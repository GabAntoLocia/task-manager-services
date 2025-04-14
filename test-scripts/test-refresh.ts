import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

async function main() {
    const client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
            host: '127.0.0.1',
            port: 3001,
        },
    });

    const payload = {
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjlmZjk1Mi1lZTM2LTRiN2EtYWMyYy0yOWJjNDBiZjhhMTMiLCJpYXQiOjE3NDQ1MTQ2OTYsImV4cCI6MTc0NDUxNDc1Nn0._wDb1JC2fJpePHASdcSL3dZxcPL01_lGLTxkdT_-fes',
    };

    try {
        const response = await firstValueFrom(client.send('auth.v1.refresh', payload));
        console.log('✅ Token refreshed:', response);
    } catch (err) {
        console.error('❌ Refresh error:', err.message || err);
    }
}

main();
