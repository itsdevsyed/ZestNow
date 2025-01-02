import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IUser } from './User.model';

interface IShopLocation {
  type: 'Point';
  coordinates: [number, number];
}

interface IShopOwner extends Document {
  user: Types.ObjectId | IUser;
  name?: string;
  shop_location?: IShopLocation;
  phone_number?: string;
  shop_details?: string;
  shop_type: string; // Added shop type here
  createdAt: Date;
  updatedAt: Date;
}

const shopOwnerSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, trim: true, maxlength: 255 },
    shop_location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    phone_number: {
      type: String,
      validate: {
        validator: function (v: string) {
          return /^[0-9]{10}$/.test(v); // Basic 10 digit phone number validation
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
    },
    shop_details: { type: String, trim: true, maxlength: 255 },
    shop_type: {
      // Added shop type here
      type: String,
      required: true,
      enum: ['Grocery', 'Restaurant', 'Pharmacy', 'Other'], // <-- Case-sensitive enum
      // You can make this an enum for defined shop types
    },
  },
  { timestamps: true }
); // Added timestamps

const ShopOwner: Model<IShopOwner> = mongoose.model<IShopOwner>(
  'ShopOwner',
  shopOwnerSchema
);
export default ShopOwner;
export { IShopOwner };
