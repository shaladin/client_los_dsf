import { ReqAddTrxSrcDataForAsliRIXObj } from "./req-add-trx-src-data-for-asli-ri-x-obj.model";
import { ResAsliRiXObj } from "./res-asli-ri-x-obj.model";

export class ResTrxAsliRiXObj{ 
  JobId: string;
  RequestDt: Date;
  ResultDt: Date;
  ReqAsliRiObj: ReqAddTrxSrcDataForAsliRIXObj;
  ResAsliRiObj: ResAsliRiXObj;
  
  constructor(){
    this.ReqAsliRiObj = new ReqAddTrxSrcDataForAsliRIXObj();
    this.ResAsliRiObj = new ResAsliRiXObj();
  }
}