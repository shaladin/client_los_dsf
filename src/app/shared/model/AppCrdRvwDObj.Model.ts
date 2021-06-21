export class AppCrdRvwDObj{
    AppCrdRvwDId: number;
    AppCrdRvwHId: number;
    MrAnalysisItemCode: string;
    AnalysisResult: any;
    RowVersion: string;

    constructor(){
        this.RowVersion = "";
    }
}