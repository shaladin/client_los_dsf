import { NavigationConstant } from "../constant/NavigationConstant";

export class InputGridObj{
    resultData: any;
    searchComp: any;
    apiUrl: string;
    deleteUrl: any;
    pageNow: any;
    pageSize: any;
    pagingJson: string;
    navigationConst: any;

    constructor()
    {
        this.navigationConst = NavigationConstant;
    }
}