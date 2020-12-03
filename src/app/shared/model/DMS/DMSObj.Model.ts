import { DMSLabelValueObj } from "./DMSLabelValueObj.Model";

export class DMSObj{
    User : string;
    Role : string;
    ViewCode : string;
    MetadataParent : Array<DMSLabelValueObj> = new Array<DMSLabelValueObj>();
    MetadataObject : Array<DMSLabelValueObj> = new Array<DMSLabelValueObj>();
    Extdate: string;
    ViewCodeAwal: string;
    ViewThumb: string;
    Option : Array<DMSLabelValueObj> = new Array<DMSLabelValueObj>();
    constructor(){
    };
}