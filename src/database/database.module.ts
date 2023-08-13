import { DynamicModule, Module } from '@nestjs/common';
import { createConnection } from 'mongoose';

@Module({})
export class DatabaseModule {
    static register(url: string): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'CONNECTION',
                    useValue: createConnection(url)
                }
            ]
        }
    }
}
