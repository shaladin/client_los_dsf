export class ResGetProdOfferingHObj {
  ProdOfferingHId: number;
  ProdOfferingId: number;
  ProdOfferingCode: string;
  ProdOfferingName: string;
  ProdOfferingDescr: string;
  ProdOfferingStat: string;
  ProdOfferingVersion: string;
  StartDt: Date;
  EndDt: Date;
  ProdHId: number;
  ProdName: String;
  ReturnNotes: string;
  RowVersion: string;

  constructor() {
    this.ProdOfferingHId = 0;
    this.ProdOfferingId = 0;
    this.ProdOfferingCode = "";
    this.ProdOfferingName = "";
    this.ProdOfferingDescr = "";
    this.ProdOfferingStat = "";
    this.ProdOfferingVersion = "";
    this.StartDt = new Date();
    this.EndDt = new Date();
    this.ProdHId = 0;
    this.ProdName = "";
    this.ReturnNotes = "";
    this.RowVersion = "";
  }
}


export class ResGetProdOfferingDCompntInfoObj {
  ReturnObject: ResProdOfferingDCompntObj

  constructor() {
    this.ReturnObject = new ResProdOfferingDCompntObj();
  }
}

class ResProdOfferingDCompntObj {
  ProdOffComponents: Array<ResProdOffDCompntObj>

  constructor() {
    this.ProdOffComponents = new Array<ResProdOffDCompntObj>();
  }
}

export class ResProdOffDCompntObj {
  GroupCode: string;
  GroupName: string;
  Components: Array<ResProdOffCompntObj>;

  constructor(){
      this.GroupCode = "";
      this.GroupName = "";
      this.Components= new Array<ResProdOffCompntObj>();
  }
}
class ResProdOffCompntObj {
  CompntValue: string;
  CompntValueDesc: string;
  MrProdBehaviourCode: string;
  ProdCompntName: string;
  ProdDId: number;
  ProdHId: number;
  RefProdCompntCode: string;
  RefProdCompntGrpCode: string;

  constructor(){
      this.CompntValue= "";
      this.CompntValueDesc= "";
      this.MrProdBehaviourCode= "";
      this.ProdCompntName= "";
      this.ProdDId= 0;
      this.ProdHId= 0;
      this.RefProdCompntCode= "";
      this.RefProdCompntGrpCode= "";
  }
}

export class ResProdOfferingDObj {
  GroupCode: string;
  GroupName: string;

  constructor() {
    this.GroupCode = "";
    this.GroupName = "";
  }
}

export class ResGetListProdOfferingHVersionObj {
  ReturnObject : Array<ResGetProdOfferingHVersionObj>

  constructor() {
    this.ReturnObject = new Array<ResGetProdOfferingHVersionObj>();
  }
}

export class ResGetProdOfferingHVersionObj {
  ProdOfferingHId: number;
  ProdOfferingId: number;
  ProdOfferingVersion: string;
  ProdStat: string;
  Descr: string;
  StartDt: Date;
  EndDt: Date;

  constructor() {
    this.ProdOfferingHId = 0;
    this.ProdOfferingId = 0;
    this.ProdOfferingVersion = "";
    this.ProdStat = "";
    this.Descr = "";
    this.StartDt = new Date();
    this.EndDt = new Date();
  }
}

export class ResGetProdOffHObj {
  ProdOfferingHId: number;
  ProdOfferingId: number;
  ProdHId: string;
  ProdOfferingStat: string;
  EndDt: Date;
  RowVersion: string;

  constructor() {
    this.ProdOfferingHId = 0;
    this.ProdOfferingId = 0;
    this.ProdHId = "";
    this.ProdOfferingStat = "";
    this.EndDt = new Date();
    this.RowVersion = "";
  }
}