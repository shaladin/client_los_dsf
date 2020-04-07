import { VerfQuestionAnswerGrpListObj } from "./VerfQuestionAnswerGrpList.Model";

export class VerfQuestionAnswerCustomObj {
    VerfSchemeHId: number;
    VerfQuestionAnswerListObj: Array<VerfQuestionAnswerGrpListObj>;

    constructor() {
        this.VerfSchemeHId = 0;
        this.VerfQuestionAnswerListObj = new Array<VerfQuestionAnswerGrpListObj>();
    }
}
