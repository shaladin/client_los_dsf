import { KeyValueObj } from "../../KeyValueObj.Model";

export class ResGetKvpRefFinMapByLobCode {
    RefPurposeOfFin : Array<KeyValueObj>;
    RefWayOfFin : Array<KeyValueObj>; 
    RefProdType : Array<KeyValueObj>;

    constructor(){
        this.RefPurposeOfFin = new Array<KeyValueObj>();
        this.RefWayOfFin = new Array<KeyValueObj>();
        this.RefProdType = new Array<KeyValueObj>();
    }

}