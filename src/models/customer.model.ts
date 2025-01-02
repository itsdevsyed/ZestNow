import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IUser } from './User.model';

interface ICustomerLocation {
  type: 'Point';
  coordinates: [number, number];
}

interface ICustomer extends Document {
  user: Types.ObjectId | IUser;
  name?: string;
  default_location?: ICustomerLocation;
  phone_number?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  // Additional fields for customer such as phone number, address etc
}

const customerSchema: Schema = new Schema(
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
    address: {
      type: String,
      trim: true,
      maxlength: 255,
    }, // Address of the customer
  },
  { timestamps: true }
); // Added timestamps

const Customer: Model<ICustomer> = mongoose.model<ICustomer>(
  'Customer',
  customerSchema
);
export default Customer;
export { ICustomer };
