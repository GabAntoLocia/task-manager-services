import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

async function createUser(userData: CreateUserDto) {
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  });

  try {
    console.log(`⌛ Attempting to create user: ${userData.email}`);
    
    const response = await firstValueFrom(
      client.send({ cmd: 'v1.api.auth.register' }, userData)
    );
    
    console.log('✅ User created successfully:', response);
    return response;
  } catch (err) {
    console.error('❌ User creation failed:', err.message || err);
    if (err.response) {
      console.error('Server response:', err.response);
    }
    throw err;
  } finally {
    await client.close();
  }
}

// Ejemplo de uso
async function main() {
  const testUsers: CreateUserDto[] = [
    {
      name: 'Usuario de Prueba 1',
      email: 'test@example2.com',
      password: 'SecurePass123!'
    },
    {
      name: 'Usuario de Prueba',
      email: 'test@example.com',
      password: 'TestPass456!'
    }
  ];

  for (const user of testUsers) {
    try {
      await createUser(user);
    } catch (err) {
      console.error(`Failed to create user ${user.email}:`, err.message);
    }
    console.log('\n---\n');
  }
}

main().catch(console.error);