export class PhoneVerifObj {
  IdSource: any;
  Subject: any;
  SubjectName: any;
  PhoneNumber: any;
  PhoneType: any;
  DatetimeVerif: Date;
  Result: any;
  SubjectRelation: any;
  Notes: any;

  constructor() {
    this.IdSource = 0;
    this.Subject = "";
    this.SubjectName = "";
    this.PhoneNumber = "";
    this.PhoneType = "";
    this.Result = "";
    this.SubjectRelation = "";
    this.Notes = "";
  }
}
