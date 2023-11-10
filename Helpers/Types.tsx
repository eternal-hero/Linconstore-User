export type addAddressDefaultValue = {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  phoneInput: string;
};
export interface IProducts {
  title: string;
  price: number;
  subcategory: string;
  shippingDetail: string;
  photo: string;
  shipping: any[];
  instruction: string;
  variants: any[];
  tags?: any;
  owner: TStoreId;
  _id: string;
  quantity: number;
}

export type addAddress = {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  zipCode: number;
  address: string;
  phoneNumber: string;
};
type stock = {
  name: number;
  price: number;
};
export type hey = {
  stock: stock[];
};
export type EditItemDefaultValue = {
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  subcategory: string;
  details: string;
  variation: string;
  tags?: [string];
  test: hey[];
  terms: boolean;
  standard: number;
  express: number;
  file: FileList[];
  // policy: string,
  care: string;
  africa: number;
  europe: number;
  northAmerica: number;
  southAmerica: number;
  oceania: number;
  antarctica: number;
  asia: number;
};
export type postItemDefaultValue = {
  template_title: string;
  title: string;
  condition: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  subcategory: string;
  details: string;
  variation: string;
  tags: string[];
  test: hey[];
  terms: boolean;
  standard: number;
  express: number;
  file: FileList[];
  // policy: string,
  care: string;
  africa: number;
  europe: number;
  northAmerica: number;
  southAmerica: number;
  oceania: number;
  antarctica: number;
  asia: number;
};
export type createUserDefaultValue = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  terms: boolean;
};
export type createUserStepOneDefaultValue = {
  phone: string;
  country: string;
};

export type createUserDefaultValueMongodb = {
  username: string;
  email: string;
  date: string;
  role: string;
};
export type loginUserDefaultValue = {
  email: string;
  password: string;
};
export type contactUsDefaultValue = {
  email: string;
  name: string;
  phone: string;
  message: string;
};
export type contactReplyDefaultValue = {
  contactId: string;
  title: string;
  message: string;
};
export type closeAccountDefaultValue = {
  reason: string;
  comment: string;
};
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}
export type viewUsersDefaultValue = {
  _id: string;
  username: string;
  role: string;
  email: string;
  date: string;
};
type Rating = {
  name: string;
  rating: number;
};

export type TProducts = {
  title: string;
  price: number;
  photo: string[];
  owner: TStoreId;
  ratingId: TRating;
  shipping: IShipping[];
  discount: number;
  _id: string;
};

export type IShipping = {
  express: IShippingDetail;
  standard: IShippingDetail;
};

export type IShippingDetail = {
  price: number;
  country: string;
};
export interface IOrders {
  updatedAt: string | number | Date;
  _id: string;
  createdAt: any;
  address: any;
  shipping: string;
  shippingCost: number;
  shippingProvider: string;
  trackingId: string;
  refund: boolean;
  productId: TProducts;
  name: string;
  status: string;
  variants: IVariants[];
  value: string;
  sellerId: {
    _id: string;
    name: string;
  };
}

export type TProductCart = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  photo: string;
};
export type TCart = {
  bill: number;
  products: TProductCart[];
};
export type TCat = {
  title: string;
};
export type IAdminProducts = {
  title: string;
  category: TCat;
  _id: string;
  price: number;
  active: boolean;
  publish: boolean;
  name: string;
  owner: any;
  photo: string[];
};
type IStoreOwner = {
  package: string;
  owner: IUser;
};
export type TAdminSeller = {
  account: string;
  name: string;
  listing: number;
  owner: IStoreOwner;
  isVerified: boolean;
  isPausedPayout: boolean;
  expenses: number;
  balance: number;
  _id: string;
  currency: string;
};
export type ISellerRequestMes = {
  message: string;
};

export type TAdminUser = {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  orders: number;
  _id: string;
  isClosed: boolean;
  isVerified: boolean;
  country: string;
};
export type Tseller = {
  location: string;
  accId: string | null;
  paypal: string | null;
  owner: string;
};
export type TStoreId = {
  name: string;
  _id: string;
  logo: string;
  sales: number;
  owner: Tseller;
  location: string;
  currency: string;
  disabled: boolean;
  domesticShipping: {
    standard: number;
    express: number;
  };
};
export type TStoreId1 = {
  name: string;
  _id: string;
  logo: string;
  balance: number;
  owner: Tseller;
  location: string;
  currency: string;
  disabled: boolean;
};
export type TRefunds = {
  _id: string;
  storeId: TStoreId;
  userId: createUserDefaultValue;
  status: string;
  reason: string;
};
export type TTransaction = {
  _id: string;
  account: string;
  method: string;
  amount: number;
  status: string;
  createdAt: Date;
}
export type TSellerStore = {
  _id: string;
  accId: string;
  paypal: string;
  name: string;
  isActive: boolean;
  owner: createUserDefaultValue;
  documentType: string;
  location: string;
  documentId: string;
  storeId: TStoreId1;
  file: string;
  isVerified: boolean;
  isPausedPayout: boolean;
  account: string;
  websiteUrl: string;
};
export type TSellerStore1 = {
  _id: string;
  name: string;
  logo: string;
};
export type IYearlyStats = {
  dec: number;
  nov: number;
  oct: number;
  sept: number;
  aug: number;
  july: number;
  jun: number;
  may: number;
  april: number;
  march: number;
  feb: number;
  jan: number;
};
export type IRound = {
  dec: number;
  number: number;
};
export interface IVariants {
  option: string;
  variant: string;
  _id: string;
}
type TRatings = {
  rating: number;
  userId: string;
};
export type TRating = {
  averageRating: number;
  ratings: TRatings[];
};
