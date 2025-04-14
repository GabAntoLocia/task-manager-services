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
    token: 'ACCESS_TOKEN_JWT_AQUÍ', // token de acceso válido
  };

  try {
    const response = await firstValueFrom(client.send('auth.v1.logout', payload));
    console.log('✅ Logout success:', response);
    return;
  } catch (err) {
    console.error('❌ Logout error:', err.message || err);
  }
}

main();