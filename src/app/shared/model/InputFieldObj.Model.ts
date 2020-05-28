import { InputLookupObj } from "./InputLookupObj.Model";

export class InputFieldObj{
    addr: any;
    areaCode4: any;
    areaCode3: any;
    phnArea1: any;
    phn1: any;
    phnExt1: any;
    phnArea2: any;
    phn2: any;
    phnExt2: any;
    faxArea: any;
    fax: any;
    subZipCode: any;
    areaCode2: any;
    areaCode1: any;
    city: any;
    inputLookupObj: InputLookupObj;

    constructor()
    {
        this.addr = "";
        this.areaCode4 = "";
        this.areaCode3 = "";
        this.phnArea1 = "";
        this.phn1 = "";
        this.phnExt1 = "";
        this.phnArea2 = "";
        this.phn2 = "";
        this.phnExt2 = "";
        this.faxArea = "";
        this.fax = "";
        this.subZipCode = "";
        this.areaCode2 = "";
        this.areaCode1 = "";
        this.city = "";
        this.inputLookupObj = new InputLookupObj();
    }
}