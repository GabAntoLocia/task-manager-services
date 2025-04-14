import { Controller, Post, Get, Body, Req, Res, Put, Delete } from '@nestjs/common';
import { AppService } from '../../app.service';
import { Request, Response } from 'express';
import { CreateUserDto } from 'apps/user-service/src/aplication/dto/create-user.dto';
import { LoginUserDto } from 'apps/user-service/src/aplication/dto/login-user.dto';
import { CreateTaskDto } from 'apps/task-service/src/aplication/dto/create-task.dto';
import { ApiAuthLogin, ApiAuthLogout, ApiAuthRegister, ApiController, ApiTaskCreate, ApiTaskDelete, ApiTaskGetAll, ApiTaskUpdate, ApiUserProfile } from 'apps/task-manager-services/api-gateway.decorators';


@ApiController()
@Controller({
  path: 'api',
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) { }

  // Authentication
  @ApiAuthRegister()
  @Post('auth/register')
  async authRegister(@Body() body, @Req() req: Request, @Res() res: Response) {
    return this.appService.proxyRequest('USER_SERVICE', CreateUserDto, req, res);
  }

  @ApiAuthLogin()
  @Post('auth/login')
  async authLogin(@Body() body, @Req() req: Request, @Res() res: Response) {
    return this.appService.proxyRequest('USER_SERVICE', LoginUserDto, req, res);
  }

  @ApiAuthLogout()
  @Post('auth/logout')
  async authLogout(@Body() body, @Req() req: Request, @Res() res: Response) {
    return this.appService.proxyRequest('USER_SERVICE', null, req, res);
  }

  // User
  @ApiUserProfile()
  @Get('users/profile')
  async getUserProfile(@Req() req: Request, @Res() res: Response) {
    return this.appService.proxyRequest('USER_SERVICE', null, req, res);
  }

  // Task
  @ApiTaskCreate()
  @Post('task/create')
  async createTask(@Body() body, @Req() req: Request, @Res() res: Response) {
    return this.appService.proxyRequest('TASK_SERVICE', CreateTaskDto, req, res);
  }

  @ApiTaskGetAll()
  @Get('task/getAll')
  async getAllTasks(@Req() req: Request, @Res() res: Response) {
    return this.appService.proxyRequest('TASK_SERVICE', null, req, res);
  }

  @ApiTaskUpdate()
  @Put('task/update/:taskId')
  async updateTask(@Body() body, @Req() req: Request, @Res() res: Response) {
    return this.appService.proxyRequest('TASK_SERVICE', null, req, res);
  }

  @ApiTaskDelete()
  @Delete('task/delete/:taskId')
  async deleteTask(@Req() req: Request, @Res() res: Response) {
    return this.appService.proxyRequest('TASK_SERVICE', null, req, res);
  }
}