import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import coffeesConfig from './config/coffees.config';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @Inject(COFFEE_BRANDS) private readonly coffeeBrands: string[],
    // private readonly configService: ConfigService,
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>
  ){
    // const databaseHost = this.configService.get('database.host');
    // console.log(databaseHost);
    // const coffeesConfig = this.configService.get('coffees.foo')
    // console.log(coffeesConfig)
    console.log(coffeesConfiguration.foo)
  }
  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findById(id).exec();
    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
    return coffee
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id}, { $set: updateCoffeeDto }, { new: true })
      .exec();
    if(!existingCoffee) throw new NotFoundException(`Coffee #${id} not found`);
    return existingCoffee
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return coffee.deleteOne()
  }

  async recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      coffee.recommendations++

      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeID: coffee.id },
      });

      await recommendEvent.save({ session });
      await coffee.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      await session.endSession()
    }
  }
}
