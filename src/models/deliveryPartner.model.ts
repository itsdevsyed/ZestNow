import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IUser } from './User.model';

interface IDeliveryPartnerLocation {
  type: 'Point';
  coordinates: [number, number];
}

interface IDeliveryPartner extends Document {
  user: Types.ObjectId | IUser;
  name?: string;
  default_location?: IDeliveryPartnerLocation;
  phone_number?: string;
  vehicle_details?: string;
  createdAt: Date;
  updatedAt: Date;
  // Additional fields for delivery partner such as vehicle details, phone number, etc
}

const deliveryPartnerSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, trim: true, maxlength: 255 },
    default_location: {
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
    vehicle_details: { type: String, trim: true, maxlength: 255 },
    // Additional fields for delivery partner such as vehicle details, phone number, etc
  },
  { timestamps: true }
); // Added timestamps

const DeliveryPartner: Model<IDeliveryPartner> =
  mongoose.model<IDeliveryPartner>('DeliveryPartner', deliveryPartnerSchema);
export default DeliveryPartner;
export { IDeliveryPartner };
