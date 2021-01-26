import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { CrdRvwExposureDObj } from 'app/shared/model/CreditReview/CrdRvwExposureDObj.Model';
import { CrdRvwExposureHObj } from 'app/shared/model/CreditReview/CrdRvwExposureHObj.Model';
import { CrdRvwExposureObj } from 'app/shared/model/CreditReview/CrdRvwExposureObj.Model';
import { CrdRvwOvdObj } from 'app/shared/model/CreditReview/CrdRvwOvdObj.Model';

@Component({
  selector: 'app-crd-rvw-fam-guar',
  templateUrl: './crd-rvw-fam-guar.component.html',
  styleUrls: ['./crd-rvw-fam-guar.component.scss']
})
export class CrdRvwFamGuarComponent implements OnInit {

  @Input() appId: number = 0;
  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();

  readonly CustTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany: string = CommonConstant.CustTypeCompany;
  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;

  //#region RefMasterTypeCode
  readonly RefMasterTypeCustPersonalRelationship = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
  readonly RefMasterTypeCustCompanyRelationship = CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
  readonly RefMasterTypeCustGuarCompanyRelationship = CommonConstant.RefMasterTypeCodeGuarCompanyRelationship;
  readonly RefMasterTypeCodeGuarPersonalRelationship = CommonConstant.RefMasterTypeCodeGuarPersonalRelationship;
  //#endregion

  //#region RelationType
  readonly RelationTypeCustomer = CommonConstant.CrdRvwRelationTypeCustomer;
  readonly RelationTypeFamily = CommonConstant.CrdRvwRelationTypeFamily;
  readonly RelationTypeShrholder = CommonConstant.CrdRvwRelationTypeShrholder;
  readonly RelationTypeGuarantor = CommonConstant.CrdRvwRelationTypeGuarantor;
  //#endregion
  Title: string = "";
  isReady: boolean = false;
  
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    this.SetTitle();
    await this.GetListRefMasterByRefMasterTypeCodes();
    await this.GetListCrdRvwExposureByCrdRvwCustInfoId();
    await this.GetListAppCustFamilyMainDataByAppId();
    await this.GetListAppCustShareholderMainDataByAppId();
    await this.GetListAppCustGuarantorMainDataByAppId();
    this.isReady = true;
  }

  SetTitle() {
    if (this.crdRvwCustInfoObj.MrCustTypeCode == this.CustTypePersonal) {
      this.Title = this.RelationTypeFamily;
    }
    else {
      this.Title = this.RelationTypeShrholder;
    }
  }

  //#region Get Data
  ListAppCustFamily: Array<AppCustObj> = new Array<AppCustObj>();
  async GetListAppCustFamilyMainDataByAppId() {
    if (this.crdRvwCustInfoObj.MrCustTypeCode != this.CustTypePersonal) return;
    await this.http.post<{ ListAppCustObj: Array<AppCustObj> }>(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.appId, IsFamily: true }).toPromise().then(
      (response) => {
        this.ListAppCustFamily = response.ListAppCustObj;
        for (let index = 0; index < this.ListAppCustFamily.length; index++) {
          const element = this.ListAppCustFamily[index];
          if(element.MrCustTypeCode == this.CustTypePersonal){
            this.ListAppCustFamily[index].MrCustRelationshipCodeDesc = this.DictRefMaster[this.RefMasterTypeCustPersonalRelationship + element.MrCustRelationshipCode];
          }
          if(element.MrCustTypeCode == this.CustTypeCompany){
            this.ListAppCustFamily[index].MrCustRelationshipCodeDesc = this.DictRefMaster[this.RefMasterTypeCustCompanyRelationship + element.MrCustRelationshipCode];
          }
        }
      }
    );
  }

  ListAppCustShareholder: Array<AppCustObj> = new Array<AppCustObj>();
  async GetListAppCustShareholderMainDataByAppId() {
    if (this.crdRvwCustInfoObj.MrCustTypeCode != this.CustTypeCompany) return;
    await this.http.post<{ ListAppCustObj: Array<AppCustObj> }>(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.appId, IsShareholder: true }).toPromise().then(
      (response) => {
        this.ListAppCustShareholder = response.ListAppCustObj;
        for (let index = 0; index < this.ListAppCustShareholder.length; index++) {
          const element = this.ListAppCustShareholder[index];
          if(element.MrCustTypeCode == this.CustTypePersonal){
            this.ListAppCustShareholder[index].MrCustRelationshipCodeDesc = this.DictRefMaster[this.RefMasterTypeCustPersonalRelationship + element.MrCustRelationshipCode];
          }
          if(element.MrCustTypeCode == this.CustTypeCompany){
            this.ListAppCustShareholder[index].MrCustRelationshipCodeDesc = this.DictRefMaster[this.RefMasterTypeCustCompanyRelationship + element.MrCustRelationshipCode];
          }
        }
      }
    );
  }

  ListAppCustGuarantor: Array<AppCustObj> = new Array<AppCustObj>();
  async GetListAppCustGuarantorMainDataByAppId() {
    await this.http.post<{ ListAppCustObj: Array<AppCustObj> }>(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.appId, IsGuarantor: true }).toPromise().then(
      (response) => {
        this.ListAppCustGuarantor = response.ListAppCustObj;
        for (let index = 0; index < this.ListAppCustGuarantor.length; index++) {
          const element = this.ListAppCustGuarantor[index];
          if(element.MrCustTypeCode == this.CustTypePersonal){
            this.ListAppCustGuarantor[index].MrCustRelationshipCodeDesc = this.DictRefMaster[this.RefMasterTypeCustPersonalRelationship + element.MrCustRelationshipCode];
          }
          if(element.MrCustTypeCode == this.CustTypeCompany){
            this.ListAppCustGuarantor[index].MrCustRelationshipCodeDesc = this.DictRefMaster[this.RefMasterTypeCustCompanyRelationship + element.MrCustRelationshipCode];
          }
        }
      }
    );
  }

  DictRefMaster: { [Id: string]: string } = {};
  async GetListRefMasterByRefMasterTypeCodes() {
    let tempReq = { refMasterTypeCodes: [this.RefMasterTypeCustPersonalRelationship, this.RefMasterTypeCustCompanyRelationship, this.RefMasterTypeCustGuarCompanyRelationship, this.RefMasterTypeCodeGuarPersonalRelationship] };
    await this.http.post<{ ReturnObject: any }>(URLConstant.GetListRefMasterByRefMasterTypeCodes, tempReq).toPromise().then(
      (response) => {
        for (let index = 0; index < response.ReturnObject.length; index++) {
          const element = response.ReturnObject[index];
          this.DictRefMaster[element.RefMasterTypeCode + element.MasterCode] = element.Descr;
        }
      }
    );
  }

  //#region Exposure Type
  readonly ExposureCustTypeCode: string = CommonConstant.ExposureCustTypeCode;
  readonly ExposureCustGroupTypeCode: string = CommonConstant.ExposureCustGroupTypeCode;
  readonly ExposureObligorTypeCode: string = CommonConstant.ExposureObligorTypeCode;
  //#endregion

  DictCrdRvwExposure: { [Id: string]: CrdRvwExposureDObj } = {};
  DictCrdRvwExposureHId: { [Id: string]: number } = {};
  DictCrdRvwGuarantorExposure: { [Id: string]: CrdRvwOvdObj } = {};
  async GetListCrdRvwExposureByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwExposureHObj: Array<CrdRvwExposureHObj>, ListCrdRvwOvdObj: Array<CrdRvwOvdObj> }>(URLConstant.GetListCrdRvwExposureByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        console.log(response);
        for (let index = 0; index < response.ListCrdRvwExposureHObj.length; index++) {
          const element: CrdRvwExposureHObj = response.ListCrdRvwExposureHObj[index];
          this.DictCrdRvwExposureHId[element.CustNo + element.RelationType] = element.CrdRvwExposureHId;
          this.DictCrdRvwExposure[element.CustNo + element.RelationType] = element.ListCrdRvwExposureDObj.find(x=>x.ExposureType == this.ExposureCustTypeCode);
        }

        for (let index = 0; index < response.ListCrdRvwOvdObj.length; index++) {
          const element = response.ListCrdRvwOvdObj[index];
          this.DictCrdRvwGuarantorExposure[element.CustNo] = element;
        }
        console.log(this.DictCrdRvwExposure);
        console.log(this.DictCrdRvwGuarantorExposure);
      }

    )
  }
  //#endregion

  //#region Link a href
  ClickLinkCust(CrdRvwExposureHId: number) {
    console.log(CrdRvwExposureHId);
    // AdInsHelper.OpenCustExposureViewByCrdRvwExposureHId(CrdRvwExposureHId);
  }
  //#endregion

}
