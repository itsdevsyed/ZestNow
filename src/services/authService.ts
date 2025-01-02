import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User.model';
import generateToken from '../utils/generateToken';
import { config } from '../config/config';
import Customer from '../models/customer.model';
import ShopOwner, { IShopOwner } from '../models/shopOwner.model';
import DeliveryPartner from '../models/deliveryPartner.model';

interface ILocation {
  type: 'Point';
  coordinates: [number, number];
}

interface IRegistrationResponse {
  data: {
    token: string;
    id: string;
    role: string;
    location?: ILocation;
    shopId?: string;
    shopType?: string;
  };
}

async function registerUser(
  userData: IUser,
  locationData: ILocation | undefined,
  shopType?: string
): Promise<IRegistrationResponse> {
  const { username, email, password, role, phone_number } = userData;
  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(config.saltRounds)
  );
  try {
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      phone_number,
    });
    await user.save();

    let location = null;
    let roleModel: any = null;
    let shopId: string | undefined = undefined;

    if (locationData) {
      location = {
        type: 'Point',
        coordinates: [locationData.coordinates[0], locationData.coordinates[1]],
      };
    }

    if (role === 'customer') {
      roleModel = new Customer({
        user: user._id,
        default_location: location,
      });
    } else if (role === 'shop_owner') {
      console.log('shopType value before creating ShopOwner model', shopType); // Log the value to check
      roleModel = new ShopOwner({
        user: user._id,
        shop_location: location,
        shop_type: shopType,
      });
      if (roleModel && roleModel._id) {
        shopId = roleModel._id.toString();
      }
    } else if (role === 'delivery_partner') {
      roleModel = new DeliveryPartner({
        user: user._id,
        default_location: location,
      });
    }

    if (roleModel) {
      await roleModel.save();
    }

    const token = generateToken(user);
    const responseData: any = { token, id: user._id, role: user.role, shopId };

    if (location) {
      responseData.location = location;
    }
    if (shopType) {
      responseData.shopType = shopType;
    }

    return { data: responseData } as IRegistrationResponse;
  } catch (err: any) {
    console.error('Registration error: ', err);
    throw new Error(err.message || 'Registration failed');
  }
}

async function loginUser(
  email: string,
  password: string
): Promise<IRegistrationResponse | null> {
  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, user.password || '');

  if (!passwordMatch) {
    return null;
  }

  const token = generateToken(user);
  let location = null;
  let roleModel = null;
  let shopId: string | undefined = undefined;
  let shopType: string | undefined = undefined;

  if (user.role === 'customer') {
    roleModel = await Customer.findOne({ user: user._id });
    if (roleModel && roleModel.default_location) {
      location = roleModel.default_location;
    }
  } else if (user.role === 'shop_owner') {
    roleModel = await ShopOwner.findOne({ user: user._id });
    if (roleModel && roleModel.shop_location) {
      location = roleModel.shop_location;
    }
    if (roleModel && roleModel._id) {
      shopId = roleModel._id.toString();
    }
    shopType = roleModel?.shop_type;
  } else if (user.role === 'delivery_partner') {
    roleModel = await DeliveryPartner.findOne({ user: user._id });
    if (roleModel && roleModel.default_location) {
      location = roleModel.default_location;
    }
  }

  const responseData: any = { token, id: user._id, role: user.role, shopId };

  if (location) {
    responseData.location = location;
  }
  if (shopType) {
    responseData.shopType = shopType;
  }

  return { data: responseData } as IRegistrationResponse;
}

export default { registerUser, loginUser };
