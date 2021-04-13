import { ProdBranchMbrObj } from "../../Product/ProdBranchMbrObj.model";

export class ResGetProdBranchMbrObj {
    ReturnObject : Array<ProdBranchMbrObj>;

    constructor(){
        this.ReturnObject = new Array<ProdBranchMbrObj>();
    }
}