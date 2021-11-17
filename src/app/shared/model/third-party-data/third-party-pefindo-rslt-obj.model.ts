export class ThirdPartyPefindoRsltObj {

    ThirdPartyPefindoRsltId: number;
    ThirdPartyRsltHId: number;
    Score: number;
    Grade: string;
    Risk: string;
    Color: string;
    ProbOfDef: number;
    Trend: string;

    constructor() {
        this.ThirdPartyPefindoRsltId = 0;
        this.ThirdPartyRsltHId = 0;
        this.Score = 0;
        this.ProbOfDef = 0;
    }
}