import { ProdOfferingDObj } from "../../Product/ProdOfferingDObj.model";
import { ReqRFAObj } from "../RFA/ReqRFAObj.model";

export class ReqAddEditProdOfferingObj {
    ProdName:string;
    ProdOfferingId: number;
    ProdOfferingCode: string;
    ProdOfferingName: string;
    ProdOfferingDescr: string;
    StartDt: Date;
    EndDt: Date;
    ProdOfferingStat :string;
    ProdOfferingHId: number;
    ProdHId: number;
    RowVersion: string;

  constructor() {
    this.ProdName= "";
    this.ProdOfferingId = 0;
    this.ProdOfferingCode = "";
    this.ProdOfferingName = "";
    this.ProdOfferingDescr = "";
    this.StartDt = new Date();
    this.EndDt = new Date();
    this.ProdOfferingStat = "";
    this.ProdOfferingHId = 0;
    this.ProdHId = 0;
    this.RowVersion = "";
  }
}

export class ReqAddEditProdOfferingDObj {
  ProdOfferingHId: number;
  ProdOfferingDetails: Array<ProdOfferingDObj>;
  RowVersion: string;

  constructor() { 
    this.ProdOfferingHId = 0;
    this.ProdOfferingDetails = new Array<ProdOfferingDObj>();
    this.RowVersion = "";
  }
}

export class ReqUpdateProdOfferingPostApvObj {
  ProdOfferingHId : number;
  TaskId : number;
  Result : string;
  Notes : string;
  Reason : string;
  ReasonType : string;

  constructor(){
      this.ProdOfferingHId = 0;
      this.TaskId = 0;
      this.Result = "";
      this.Notes = "";
      this.Reason = "";
      this.ReasonType = "";
  }
}

export class ReqReviewProdOfferingObj {
  ProdOfferingHId : number;
  ProdOfferingId : number;
  WfTaskListId: number;
  RequestRFAObj : ReqRFAObj;

  constructor(){
      this.ProdOfferingHId = 0;
      this.ProdOfferingId = 0;
      this.WfTaskListId = 0;
      this.RequestRFAObj = new ReqRFAObj();
  }
}
