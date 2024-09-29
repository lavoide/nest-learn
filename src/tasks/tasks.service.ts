import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  @Cron('45 * * * * *', {
    name: 'test',
  })
  handleCron() {
    console.log('test');
  }
}