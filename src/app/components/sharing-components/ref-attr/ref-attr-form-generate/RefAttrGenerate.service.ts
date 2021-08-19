import { KeyValueObj } from "app/shared/model/KeyValue/KeyValueObj.model";

export class RefAttrGenerate {

    public static BindListQuestionByListString(listQuestion: Array<string>): Array<KeyValueObj>{
        let tempList:Array<KeyValueObj>=new Array();
        for (let index = 0; index < listQuestion.length; index++) {
          const element = listQuestion[index];
          tempList.push({ Key: element, Value: element });
        }
        return tempList;
    }

    public static BindListQuestionByString(listQuestion: string): Array<KeyValueObj>{
        let tempListSplited: Array<string> = listQuestion.split(";");
        let tempList:Array<KeyValueObj>=new Array();
        for (let index = 0; index < tempListSplited.length; index++) {
          const element = tempListSplited[index];
          tempList.push({ Key: element, Value: element });
        }
        return tempList;
    }
}