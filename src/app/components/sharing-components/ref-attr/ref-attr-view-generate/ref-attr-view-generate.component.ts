import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RefAttrGenerateObj } from 'app/shared/model/ref-attr-generate.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
    selector: 'app-ref-attr-view-generate',
    templateUrl: './ref-attr-view-generate.component.html'
})
export class RefAttrViewGenerateComponent implements OnInit {
    @Input() ListAttrObjs: Array<RefAttrGenerateObj> = new Array();
    @Input() Title: string = "Ref Attribute Generate";

    constructor(private http: HttpClient) { }

    readonly AttrInputTypeText = CommonConstant.AttrInputTypeText;
    readonly AttrInputTypeDate = CommonConstant.AttrInputTypeDate;
    readonly AttrInputTypeNum = CommonConstant.AttrInputTypeNum;
    readonly AttrInputTypeNumPerc = CommonConstant.AttrInputTypeNumPerc;
    readonly AttrInputTypeList = CommonConstant.AttrInputTypeList;
    readonly AttrInputTypeTextArea = CommonConstant.AttrInputTypeTextArea;
    readonly AttrInputTypeRefMaster = CommonConstant.AttrInputTypeRefMaster;
    readonly AttrInputTypeSearchList: string = CommonConstant.AttrInputTypeSearchList;
    async ngOnInit() {
        console.log(this.ListAttrObjs);
        for (let index = 0; index < this.ListAttrObjs.length; index++) {
            const element = this.ListAttrObjs[index];

            switch (element.AttrInputType) {
                case this.AttrInputTypeRefMaster:
                    await this.SetAttrLookup(element);
                    break;
            }
        }
    }

    DictAttrValue: { [Id: string]: string } = {};
    private async SetAttrLookup(generateAttrContentObj: RefAttrGenerateObj) {
        let RefAttrCode: string = generateAttrContentObj.AttrCode;

        if (!generateAttrContentObj.AttrValue != null) {
            let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
                RefMasterTypeCode: generateAttrContentObj.MasterTypeCode,
                MasterCode: generateAttrContentObj.AttrValue
            };
            await this.http.post(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
                (response: KeyValueObj) => {
                    this.DictAttrValue[RefAttrCode] = response.Value;
                }
            );
            return;
        }
        this.DictAttrValue[RefAttrCode] = "-";
    }
}
