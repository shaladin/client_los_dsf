import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { formatDate } from '@angular/common';
import { RefAttrGenerate } from 'app/components/sharing-components/ref-attr/ref-attr-form-generate/RefAttrGenerate.service';
import { MouCustCollateralStatXObj } from 'app/impl/shared/model/MouCustCollateralStatXObj.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { MouCustCollateralRegistrationObj } from 'app/shared/model/mou-cust-collateral-registration-obj.model';
import { MouCustCollateralObj } from 'app/shared/model/mou-cust-collateral-obj.model';
import { GenericKeyValueListObj } from 'app/shared/model/generic/generic-key-value-list-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { RefAttrGenerateObj } from 'app/shared/model/ref-attr-generate.model';
import { ResMouCustCollateralAttrObj } from 'app/shared/model/mou-cust-collateral-attr-obj.model';
@Component({
  selector: 'app-mou-view-addcoll-detail-x',
  templateUrl: './mou-view-addcoll-detail-x.component.html',
})
export class MouViewAddcollDetailXComponent implements OnInit {
  @Input() MouCustCollateralId: number;

  listMouCustCollateralDocObj: Array<any> = new Array();
  collateralRegistrationObj: MouCustCollateralRegistrationObj = new MouCustCollateralRegistrationObj();
  collateralObj: MouCustCollateralObj = new MouCustCollateralObj();
  OwnerProfessionName: string;
  CollateralStatObj: MouCustCollateralStatXObj = new MouCustCollateralStatXObj();

  constructor(private http: HttpClient) { }

  isReady: boolean = false;
  async ngOnInit() {
    const collObj = { Id: this.MouCustCollateralId };
    this.http.post<MouCustCollateralStatXObj>(URLConstantX.GetMouCustCollateralStatXByMouCustCollateralIdX, collObj).subscribe(
      (response) => {
        this.CollateralStatObj = response;
      });

    this.GetAssetType();
    this.http.post(URLConstant.GetListMouCustCollateralDocsByMouCustCollateralId, { Id: this.MouCustCollateralId }).subscribe(
      (response) => {
        let MouCustCollateralDocs = response["MouCustCollateralDocs"];
        if (MouCustCollateralDocs["length"] > 0) {
          for (let i = 0; i < MouCustCollateralDocs.length; i++) {
            if (this.MouCustCollateralId == MouCustCollateralDocs[i].MouCustCollateralId) {

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
        }

      });

    await this.http.post(URLConstantX.GetMouCustCollateralDataForUpdateByMouCustCollateralIdX, { Id: this.MouCustCollateralId }).toPromise().then(
      (response) => {
        this.collateralObj = response['MouCustCollateral'];
        this.collateralRegistrationObj = response['MouCustCollateralRegistration'];

        this.GetSerialNo(this.collateralObj.AssetTypeCode);
        this.GetCollAttr(this.MouCustCollateralId, this.collateralObj.AssetTypeCode);
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
      MouCustCollateralId: MouCustCollId,
      AssetTypeCode: assetTypeCode,
      IsRefresh: false
    };
    this.http.post(URLConstant.GenerateMouCollateralAttr, GenObj).subscribe(
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