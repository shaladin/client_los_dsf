import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { formatDate } from '@angular/common';
import { RefAttrGenerate } from 'app/components/sharing-components/ref-attr/ref-attr-form-generate/RefAttrGenerate.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { MouCustCollateralRegistrationObj } from 'app/shared/model/mou-cust-collateral-registration-obj.model';
import { ChangeMouCustCollateralObj } from 'app/shared/model/change-mou-cust-collateral-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { GenericKeyValueListObj } from 'app/shared/model/generic/generic-key-value-list-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { RefAttrGenerateObj } from 'app/shared/model/ref-attr-generate.model';
import { ResMouCustCollateralAttrObj } from 'app/shared/model/mou-cust-collateral-attr-obj.model';

@Component({
    selector: 'app-change-mou-view-addcoll-detail-x',
    templateUrl: './change-mou-view-addcoll-detail-x.component.html'
})
export class ChangeMouViewAddcollDetailXComponent implements OnInit {
    @Input() ChangeMouCustCollateralId: number = 0;

    listMouCustCollateralDocObj: Array<any> = new Array();
    collateralRegistrationObj: MouCustCollateralRegistrationObj = new MouCustCollateralRegistrationObj();
    collateralObj: ChangeMouCustCollateralObj = new ChangeMouCustCollateralObj();
    OwnerProfessionName: string;

    constructor(private http: HttpClient) { }

    isReady: boolean = false;
    async ngOnInit() {
        this.GetAssetType();
        this.http.post(URLConstant.GetChangeMouCustCollateralDocByChangeMouCustCollateralId, { Id: this.ChangeMouCustCollateralId }).subscribe(
            (response: GenericListObj) => {
                let MouCustCollateralDocs = response.ReturnObject;
                if (MouCustCollateralDocs.length > 0) {
                    for (let i = 0; i < MouCustCollateralDocs.length; i++) {
                        let MouCustCollateralDocObj = {
                            DocCode: MouCustCollateralDocs[i].DocCode,
                            DocNo: MouCustCollateralDocs[i].DocNo,
                            ExpiredDt: formatDate(MouCustCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
                            DocNotes: MouCustCollateralDocs[i].DocNotes,
                            IsReceived: MouCustCollateralDocs[i].IsReceived
                        }
                        this.listMouCustCollateralDocObj.push(MouCustCollateralDocObj);                        
                    }
                }

            });

        await this.http.post(URLConstantX.GetChangeMouCustCollateralDataForUpdateByChangeMouCustCollateralIdX, { Id: this.ChangeMouCustCollateralId }).toPromise().then(
            (response) => {
                this.collateralObj = response["ChangeMouCustCollateral"];
                this.collateralRegistrationObj = response["ChangeMouCustCollateralRegistration"];

                this.GetSerialNo(this.collateralObj.AssetTypeCode);
                this.GetCollAttr(this.ChangeMouCustCollateralId, this.collateralObj.AssetTypeCode);
            })

        await this.GetProfessionName(this.collateralRegistrationObj.OwnerProfessionCode);
        this.isReady = true;
    }

    DictRefMaster: { [Id: string]: string } = {};
    GetAssetType() {
        this.http.post(URLConstant.GetListAssetTypeByCode, {}).subscribe(
            (response: GenericKeyValueListObj) => {
                let tempList = response.ReturnObject;
                for (let index = 0; index < tempList.length; index++) {
                    const element = tempList[index];
                    this.DictRefMaster[element.Key] = element.Value;
                }
            }
        )
    }

    ListSerialNo: Array<KeyValueObj> = new Array();
    GetSerialNo(AssetTypeCode: string) {
        this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: AssetTypeCode }).subscribe(
            (response: GenericListObj) => {
                for (let index = 0; index < response.ReturnObject.length; index++) {
                    const element = response.ReturnObject[index];
                    this.ListSerialNo.push({ Key: element.SerialNoLabel, Value: this.collateralObj["SerialNo" + (index + 1)] });
                }
            }
        );
    }

    async GetProfessionName(professionCode: string) {
        await this.http.post(URLConstant.GetRefProfessionByCode, { Code: professionCode }).toPromise().then(
            (response) => {
                this.OwnerProfessionName = response["ProfessionName"]
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
    }

    ListAttrObjs: Array<RefAttrGenerateObj> = new Array();
    GetCollAttr(MouCustCollId: number, assetTypeCode: string) {
        let GenObj = {
            ChangeMouCustCollateralId: MouCustCollId,
            AssetTypeCode: assetTypeCode,
            IsRefresh: false
        };
        this.http.post(URLConstant.GenerateChangeMouCollateralAttr, GenObj).subscribe(
            (response: ResMouCustCollateralAttrObj) => {
                for (let index = 0; index < response.MouCustCollateralAttrObjs.length; index++) {
                    const element = response.MouCustCollateralAttrObjs[index];
                    const tempObj: RefAttrGenerateObj = {
                        AttrCode: element.CollateralAttrCode,
                        AttrGroup: element.AttrGroup,
                        AttrInputType: element.AttrInputType,
                        AttrLength: element.AttrLength,
                        AttrName: element.CollateralAttrName,
                        AttrQuestionValue: RefAttrGenerate.BindListQuestionByListString(element.AttrQuestionValue),
                        AttrTypeCode: "",
                        AttrValue: element.AttrValue,
                        IsMandatory: element.IsMandatory,
                        MasterTypeCode: element.RefAttrValue,
                        PatternCode: element.PatternCode,
                        PatternValue: element.PatternValue,
                        RsvField1: "",
                        RsvField2: "",
                        RsvField3: "",
                        RsvField4: "",
                        RsvField5: "",
                    };
                    this.ListAttrObjs.push(tempObj);
                }
            }
        )
    }
}