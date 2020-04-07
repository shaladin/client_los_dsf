export class VerfResultHObj {
    VerfResultHId: number;
    VerfResultId: number;
    VerfSchemeHId: number;
    MrVerfObjectCode: string;
    MrVerfSubjectRelationCode: string;
    MrVerfSubjectRelationName: string;
    VerfDt: Date;
    MrVerfResultHStatCode: string;
    MrVerfResultHStatName: string;
    Phn: string;
    PhnType: string;
    Notes: string;
    Version: number;
    Score: number;
    RowVersion: string;

    constructor() {
        this.VerfResultHId = 0;
        this.VerfResultId = 0;
        this.VerfSchemeHId = 0;
        this.MrVerfObjectCode = "";
        this.MrVerfSubjectRelationCode = "";
        this.MrVerfSubjectRelationName = "";
        this.VerfDt = new Date();
        this.MrVerfResultHStatCode = "";
        this.MrVerfResultHStatName = "";
        this.Phn = "";
        this.PhnType = "";
        this.Notes = "";
        this.Version = 0;
        this.Score = 0;
        this.RowVersion = "";
    }
}
