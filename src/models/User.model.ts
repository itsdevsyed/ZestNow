import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  // Remove the following line
  //  _id: string;
  username: string;
  email: string;
  password?: string;
  phone_number?: string;
  role: 'customer' | 'shop_owner' | 'delivery_partner';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    phone_number: {
      type: String,
      unique: true,
      required: false,
      validate: {
        validator: function (v: string) {
          return /^[0-9]{10}$/.test(v); // Basic 10 digit phone number validation
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
    },
    role: {
      type: String,
      enum: ['customer', 'shop_owner', 'delivery_partner'],
      required: true,
    },
  },
  { timestamps: true }
); // Added timestamps

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
export { IUser };
