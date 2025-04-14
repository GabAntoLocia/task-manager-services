import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('TASK_SERVICE') private taskClient: ClientProxy,
  ) { }

  async proxyRequest(service: string, dto: any = '', req: Request, res: Response) {
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {

        const client = this.getClient(service);
        const pattern = this.getPattern(req.path);
        const data = { ...req.body, ...req.query, ...req.params };

        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];

        data.authorization = token; // Agregar el token al objeto data
        const result = await firstValueFrom(
          client.send({ cmd: pattern }, data)
        );

        return res.status(200).json(result);
      } catch (error) {
        console.error('Error in proxyRequest:', error);
        attempts++;
        if (attempts === maxAttempts) {
          console.error(`Failed after ${maxAttempts} attempts to ${service}`);
          return res.status(502).json({ message: 'Service unavailable' });
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        return res.status(500).json({
          message: 'Error en el gateway',
          error: error.message,
        });

      }
    }

  }

  private getClient(service: string): ClientProxy {
    const client = {
      'USER_SERVICE': this.userClient,
      'TASK_SERVICE': this.taskClient,
    }[service];

    if (!client) {
      throw new Error(`Service ${service} is not recognized.`);
    }

    return client;
  }

  private getPattern(path: string): string {
    // Extrae el patrón de la URL
    if (this.hasDynamicParams(path)) {
      path = this.toPatternFromUrl(path);
    }
    return path.split('/').filter(Boolean).join('.');
  }

  private hasDynamicParams = (path: string): boolean => /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(path)
    ;

  private toPatternFromUrl = (path: string): string => {
    const isDynamic = this.hasDynamicParams(path);
    const cleaned = isDynamic ? path.replace(/\/[^\/]+$/, '') : path;
    return cleaned
  };
}