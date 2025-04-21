export interface ICreateUser { 
     firstName:string;
     lastName:string;
     email:string;
     phoneNumber:string;
     password:string;
}
export interface IVerifyOpt {
    otp:string;
}

export interface IUserLogin {
     emailOrPhoneNumber:string;
     password:string;
}