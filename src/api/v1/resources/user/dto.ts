export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface IVerifyOtp {
  otp: string;
}

export interface IUserLogin {
  emailOrPhoneNumber: string;
  password: string;
}
export interface IUpdateProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface IProfilePicture {
  image: string; // Base64 encoded image or file path
}