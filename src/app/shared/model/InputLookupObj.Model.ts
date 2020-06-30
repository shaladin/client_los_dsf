export class InputLookupObj{
    urlJson: any
    urlQryPaging: any
    urlEnviPaging: any
    _url: any
    nameSelect: any
    idSelect: any
    jsonSelect: any
    addCritInput: any
    isRequired: boolean
    pagingJson: any
    genericJson: any
    isReadonly: boolean 
    isReady: boolean
    ddlEnvironments : any
    title: any;

    constructor()
    {
        this.jsonSelect = "";
        this.idSelect = "";
        this.nameSelect = "";
        this.addCritInput = null;
        this.isRequired = true;
        this.isReadonly = true;
        this.isReady = false;
        this.title = "";
    }
}