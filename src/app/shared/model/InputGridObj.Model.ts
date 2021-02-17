import { NavigationConstant } from "../constant/NavigationConstant";

export class InputGridObj{
    resultData: any;
    searchComp: any;
    apiUrl: any;
    deleteUrl: any;
    pageNow: any;
    pageSize: any;
    pagingJson: any;
    navigationConst: any;

    constructor()
    {
        this.navigationConst = NavigationConstant;
    }
}