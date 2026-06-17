import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return this.orderModel.create({...createOrderDto, partial: createOrderDto.shares, status: 'PENDING'});
  }

  findAll(filter: { walletId?: string, assetId?: string, type?: string, status?: string } = {}) {
    return this.orderModel.find(filter);
  }

  findOne(id: string) {
    return this.orderModel.findById(id);
  }

}
