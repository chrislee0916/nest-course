import { Injectable, Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';
import { Event, EventSchema } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Injectable()
export class CoffeeBrandsFacotry {
  create() {
    return ['buddy brew', 'nestcafe']
  }
}

@Module({
  imports: [
    ConfigModule.forFeature(coffeesConfig),
    MongooseModule.forFeature([
      {
        name: Coffee.name,
        schema: CoffeeSchema
      },
      {
        name: Event.name,
        schema: EventSchema
      }
    ])
  ],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    // CoffeeBrandsFacotry,
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory:(coffeeBrandsFacotry: CoffeeBrandsFacotry) => coffeeBrandsFacotry.create(),
    //   inject: [CoffeeBrandsFacotry]
    // },
    Connection,
    {
      provide: COFFEE_BRANDS,
      useFactory: async (connection: Connection): Promise<string[]> => {
        // const coffeeBrands = await connection.query('SELECT * ...')'
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nestcafe'])
        return coffeeBrands
      },
      inject: [Connection]
    }
  ],
  exports: [CoffeesService]
})
export class CoffeesModule { }
