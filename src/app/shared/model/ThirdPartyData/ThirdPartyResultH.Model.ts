import { ThirdPartyDukcapilRsltObj } from "./ThirdPartyDukcapilRsltObj.Model";
import { ThirdPartyPefindoRsltObj } from "./ThirdPartyPefindoRsltObj.Model";
import { ThirdPartyProfindRsltObj } from "./ThirdPartyProfindRsltObj.Model";
import { ThirdPartyRapindoRsltObj } from "./ThirdPartyRapindoRsltObj.Model";
import { ThirdPartySlikRsltObj } from "./ThirdPartySlikRsltObj.Model";

export class ThirdPartyResultHObj {

    ThirdPartyDukcapilRsltObj: ThirdPartyDukcapilRsltObj;
    ThirdPartyPefindoRsltObj: ThirdPartyPefindoRsltObj;
    ThirdPartyProfindRsltObj: ThirdPartyProfindRsltObj;
    ListThirdPartyRapindoRsltObj: Array<ThirdPartyRapindoRsltObj>;
    ThirdPartySlikRsltObj: ThirdPartySlikRsltObj;

    constructor() {
        this.ThirdPartyDukcapilRsltObj = new ThirdPartyDukcapilRsltObj();
        this.ThirdPartyPefindoRsltObj = new ThirdPartyPefindoRsltObj();
        this.ThirdPartyProfindRsltObj = new ThirdPartyProfindRsltObj();
        this.ListThirdPartyRapindoRsltObj = new Array<ThirdPartyRapindoRsltObj>();
        this.ThirdPartySlikRsltObj = new ThirdPartySlikRsltObj();
    }
}