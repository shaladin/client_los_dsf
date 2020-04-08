import { VerfQuestionAnswerListObj } from "./verfQuestionAnswerList.Model";

export class VerfQuestionAnswerGrpListObj {
    VerfQuestionGrpCode: string;
    VerfQuestionGrpName: string;
    verfQuestionAnswerList: Array<VerfQuestionAnswerListObj>;

    constructor() {
        this.VerfQuestionGrpCode = "";
        this.VerfQuestionGrpName = "";
        this.verfQuestionAnswerList = new Array<VerfQuestionAnswerListObj>();
    }
}