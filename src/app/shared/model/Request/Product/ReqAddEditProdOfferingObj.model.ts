import { ProdOfferingDObj } from "../../Product/ProdOfferingDObj.model";
import { ReqRFAObj } from "../RFA/ReqRFAObj.model";

export class ReqAddProdOfferingObj {
  ProdName: string;
  ProdOfferingCode: string;
  ProdOfferingName: string;
  ProdOfferingDescr: string;
  StartDt: Date;
  EndDt: Date;
  ProdOfferingStat: string;
  ProdOfferingHId: number;
  ProdHId: number;
  RowVersion: string;

  constructor() {
    this.ProdName = "";
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


export class ReqEditProdOfferingObj extends ReqAddProdOfferingObj {
  ProdOfferingId: number;

  constructor() {
    super();
    this.ProdOfferingId = 0;
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

export class ReqCopyProductOfferingObj {
  ProdOfferingHId: number;
  FromProdOfferingId: number;

  constructor() {
    this.ProdOfferingHId = 0;
    this.FromProdOfferingId = 0;
  }
}

export class ReqUpdateProdOfferingPostApprovalObj {
  ProdOfferingHId: number;
  TaskId: number;
  Result: string;
  Notes: string;
  Reason: string;
  ReasonType: string;

  constructor() {
    this.ProdOfferingHId = 0;
    this.TaskId = 0;
    this.Result = "";
    this.Notes = "";
    this.Reason = "";
    this.ReasonType = "";
  }
}

export class ReqReviewProdOfferingObj {
  ProdOfferingHId: number;
  ProdOfferingId: number;
  WfTaskListId: number;
  RequestRFAObj: any;

  constructor() {
    this.ProdOfferingHId = 0;
    this.ProdOfferingId = 0;
    this.WfTaskListId = 0;
  }
}
