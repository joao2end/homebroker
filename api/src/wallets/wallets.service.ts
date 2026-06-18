import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletAssetDto } from './dto/create-wallet-asset.dto';
import { WalletAsset } from './entities/wallet-asset.entity';

@Injectable()
export class WalletsService {

  constructor(
    @InjectModel(Wallet.name) private Walletschema: Model<Wallet>,
    @InjectModel(WalletAsset.name) private WalletAssetSchema: Model<WalletAsset>,
    @InjectConnection() private connection: Connection,
  ) {}

  create(createWalletDto: CreateWalletDto) {
    return this.Walletschema.create(createWalletDto);
  }

  findAll() {
    return this.Walletschema.find();
  }

  findOne(_id: string) {
    return this.Walletschema.findById({ _id }).populate([
      { 
        path: 'assets',
        populate: ['asset']
      }
    ]);
  }

  update(_id: string, updateWalletDto: UpdateWalletDto) {
    return this.Walletschema.findOneAndUpdate({ _id }, updateWalletDto, { new: true });
  }

  remove(_id: string) {
    return this.Walletschema.findOneAndDelete({ _id });
  }

  async createWalletAsset(createWalletAssetDto: CreateWalletAssetDto) {
    const session = await this.connection.startSession();

    try {
      return await session.withTransaction(async () => {
        const doc = await this.WalletAssetSchema.create([createWalletAssetDto], { session });
        const walletAsset = doc[0];
        await this.Walletschema.updateOne(
          { _id: createWalletAssetDto.wallet },
          { $push: { assets: walletAsset._id } },
          { session }
        ).exec();
        return walletAsset;
      });
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }
  }

}