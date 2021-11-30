import { VerfQuestionAnswerListObj } from "./verf-question-answer-list.model";

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