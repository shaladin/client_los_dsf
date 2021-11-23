import { VerfQuestionAnswerGrpListObj } from "./verf-question-answer-grp-list.model";

export class VerfQuestionAnswerCustomObj {
    VerfSchemeHId: number;
    VerfQuestionAnswerListObj: Array<VerfQuestionAnswerGrpListObj>;

    constructor() {
        this.VerfSchemeHId = 0;
        this.VerfQuestionAnswerListObj = new Array<VerfQuestionAnswerGrpListObj>();
    }
}
