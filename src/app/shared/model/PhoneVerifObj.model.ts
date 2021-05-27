export class PhoneVerifObj {
  IdSource: number;
  Subject: string;
  SubjectName: string;
  PhoneNumber: string;
  PhoneType: string;
  DatetimeVerif: string;
  Result: string;
  SubjectRelation: string;
  Notes: string;

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
