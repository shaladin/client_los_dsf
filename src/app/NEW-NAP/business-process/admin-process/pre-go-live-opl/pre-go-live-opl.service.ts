export class PreGoLiveOplService {
    private ListTemp: Array<any>;

    SetList(ArrayObj: Array<any>){
        this.ListTemp = ArrayObj;
    }

    getList(){
        return (this.ListTemp);
    }

    clearList(){
        this.ListTemp.length = 0;
    }
}