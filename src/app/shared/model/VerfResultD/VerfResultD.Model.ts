export class VerfResultDObj {
    VerfResultDId: number;
    VerfResultHId: number;
    VerfQuestionAnswerId: number;
    VerfQuestionText: string;
    Answer: string;
    Notes: string;
    SeqNo: number;
    Score: number;
    VerfQuestionGroupCode: string;
    RowVersion: string;

    constructor() {
        this.VerfResultDId = 0;
        this.VerfResultHId = 0;
        this.VerfQuestionAnswerId = 0;
        this.VerfQuestionText = "";
        this.Answer = "";
        this.Notes = "";
        this.SeqNo = 0;
        this.Score = 0;
        this.VerfQuestionGroupCode = "";
        this.RowVersion = "";
    }
}
