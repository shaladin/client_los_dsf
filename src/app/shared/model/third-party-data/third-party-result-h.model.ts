import { ThirdPartyDukcapilRsltObj } from "./third-party-dukcapil-rslt-obj.model";
import { ThirdPartyPefindoRsltObj } from "./third-party-pefindo-rslt-obj.model";
import { ThirdPartyProfindRsltObj } from "./third-party-profind-rslt-obj.model";
import { ThirdPartyRapindoRsltObj } from "./third-party-rapindo-rslt-obj.model";
import { ThirdPartySlikRsltObj } from "./third-party-slik-rslt-obj.model";

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