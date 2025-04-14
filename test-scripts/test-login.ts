import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

async function main() {
  // Configuración corregida del cliente TCP
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { 
      host: '127.0.0.1',
      port: 3001,
    }
  });

  const payload = {
    email: 'test@example2.com',
    password: 'SecurePass123!',
  };

  try {
    console.log('⌛ Attempting login...');
    const response = await firstValueFrom(
      client.send('auth.v1.login', payload) // Formato simplificado
    );
    console.log('✅ Login success:', response);
  } catch (err) {
    console.error('❌ Login error:', err.message || err);
    if (err.response) console.error('Server response:', err.response);
  } finally {
    // Cerrar conexión
    await client.close();
  }
}

main().catch(console.error);