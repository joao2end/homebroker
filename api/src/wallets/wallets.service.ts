import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {

  constructor(@InjectModel(Wallet.name) private Walletschema: Model<Wallet>) {}

  create(createWalletDto: CreateWalletDto) {
    return this.Walletschema.create(createWalletDto);
  }

  findAll() {
    return this.Walletschema.find();
  }

  findOne(_id: string) {
    return this.Walletschema.findOne({ _id });
  }

  update(_id: string, updateWalletDto: UpdateWalletDto) {
    return this.Walletschema.findOneAndUpdate({ _id }, updateWalletDto, { new: true });
  }

  remove(_id: string) {
    return this.Walletschema.findOneAndDelete({ _id });
  }
}
