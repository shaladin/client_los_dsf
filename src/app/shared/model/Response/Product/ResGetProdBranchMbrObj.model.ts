import { ProdBranchMbrObj } from "../../Product/ProdBranchMbrObj.model";

export class ResGetProdBranchMbrObj {
    ReturnObj : Array<ProdBranchMbrObj>;

    constructor(){
        this.ReturnObj = new Array<ProdBranchMbrObj>();
    }
}