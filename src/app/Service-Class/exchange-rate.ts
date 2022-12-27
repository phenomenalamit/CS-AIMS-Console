export class ExchangeRate {
  exchangeRateId!:number;
  year!:number;
  currency!:string;
  mznAmount!:number;
  usdAmount!:number;
  unit:number;
  currencyFullName:string;
  currencyShortName:string;

  
}
export class ExchangeRateBean{
  yearInArray:string[]=[]
  currencyFullNameInArray:string[]=[]
}
