import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async onModuleInit() {
    if (this.connection.readyState === 1) {
      console.log('✅ MongoDB connected');
    }

    this.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    this.connection.on('error', (err) => {
      console.log('❌ MongoDB error:', err);
    });
  }
}
