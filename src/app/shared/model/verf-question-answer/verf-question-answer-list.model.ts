export class VerfQuestionAnswerListObj {
    VerfQuestionAnswerId: number;
    RefVerfAnswerTypeId: number;
    VerfQuestionCode: string;
    VerfQuestionText: string;
    VerfAnswer: string;
    IsActive: boolean;
    VerfSchemeHId: number;
    VerfQuestionGrpCode: string;
    VerfQuestionGrpName: string;
    VerfAnswerTypeCode: string;
    VerfAnswerTypeDescr: string;

    constructor() {
        this.VerfQuestionAnswerId = 0;
        this.RefVerfAnswerTypeId = 0;
        this.VerfQuestionCode = "";
        this.VerfQuestionText = "";
        this.VerfAnswer = "";
        this.IsActive = false;
        this.VerfSchemeHId = 0;
        this.VerfQuestionGrpCode = "";
        this.VerfQuestionGrpName = "";
        this.VerfAnswerTypeCode = "";
        this.VerfAnswerTypeDescr = "";
    }
}