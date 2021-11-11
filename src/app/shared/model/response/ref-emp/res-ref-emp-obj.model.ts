export class ResRefEmpObj {
    RefEmpId: number;
    EmpNo: string;
    EmpName: string;
    JoinDt: Date;
    Addr: string;
    Zipcode: string;
    AreaCode1: string;
    AreaCode2: string;
    AreaCode3: string;
    AreaCode4: string;
    City: string;
    PhnArea1: string;
    Phn1: string;
    PhnExt1: string;
    PhnArea2: string;
    Phn2: string;
    PhnExt2: string;
    PhnArea3: string;
    Phn3: string;
    PhnExt3: string;
    FaxArea: string;
    Fax: string;
    MobilePhnNo1: string;
    MobilePhnNo2: string;
    Email1: string;
    Email2: string;
    IsExt: boolean;
    TaxIdNo: string;
    MrIdTypeCode: string;
    IdNo: string;
    ImageLocation: string;
    Loginsoftphone: string;
    IsLeave: boolean;
    IsActive: boolean;

    constructor() {
        this.RefEmpId = 0;
        this.EmpNo = "";
        this.EmpName = "";
        this.JoinDt = new Date();
        this.Addr = "";
        this.Zipcode = "";
        this.AreaCode1 = "";
        this.AreaCode2 = "";
        this.AreaCode3 = "";
        this.AreaCode4 = "";
        this.City = "";
        this.PhnArea1 = "";
        this.Phn1 = "";
        this.PhnExt1 = "";
        this.PhnArea2 = "";
        this.Phn2 = "";
        this.PhnExt2 = "";
        this.PhnArea3 = "";
        this.Phn3 = "";
        this.PhnExt3 = "";
        this.FaxArea = "";
        this.Fax = "";
        this.MobilePhnNo1 = "";
        this.MobilePhnNo2 = "";
        this.Email1 = "";
        this.Email2 = "";
        this.IsExt = false;
        this.TaxIdNo = "";
        this.MrIdTypeCode = "";
        this.IdNo = "";
        this.ImageLocation = "";
        this.Loginsoftphone = "";
        this.IsLeave = false;
        this.IsActive = false;
    }
}

export class ResGetListRefEmpForLookupObj {
    RefEmpId: number;
    EmpName: string;
    EmpNo: string;
    RoleCode: string;
    RoleName: string;
    Username: string;

    constructor() {
        this.RefEmpId = 0;
        this.EmpName = "";
        this.EmpNo = "";
        this.RoleCode = "";
        this.RoleName = "";
        this.Username = "";
    }
}