import { InputLookupAddr } from "./InputLookupAddr.Model";

export class InputFieldObj{
    addr: string;
    areaCode4: string;
    areaCode3: string;
    phnArea1: string;
    phn1: string;
    phnExt1: string;
    phnArea2: string;
    phn2: string;
    phnExt2: string;
    faxArea: string;
    fax: string;
    subZipCode: string;
    areaCode2: string;
    areaCode1: string;
    city: string;
    inputLookupObj: InputLookupAddr;

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
        this.inputLookupObj = new InputLookupAddr();
    }
}