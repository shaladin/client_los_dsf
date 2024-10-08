import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { CrdRvwExposureDObj } from 'app/shared/model/credit-review/crd-rvw-exposure-d-obj.model';
import { CrdRvwExposureHObj } from 'app/shared/model/credit-review/crd-rvw-exposure-h-obj.model';
import { CrdRvwExposureObj } from 'app/shared/model/credit-review/crd-rvw-exposure-obj.model';
import { CrdRvwOvdObj } from 'app/shared/model/credit-review/crd-rvw-ovd-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { ResAppCustForListCustMainDataObj, ResListCustMainDataObj } from 'app/shared/model/response/nap/cust-main-data/res-list-cust-main-data-obj.model';

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
  ListAppCustFamily: Array<ResAppCustForListCustMainDataObj> = new Array<ResAppCustForListCustMainDataObj>();
  async GetListAppCustFamilyMainDataByAppId() {
    if (this.crdRvwCustInfoObj.MrCustTypeCode != this.CustTypePersonal) return;
    await this.http.post(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.appId, IsFamily: true }).toPromise().then(
      (response : ResListCustMainDataObj) => {
        this.ListAppCustFamily = response.ListAppCustObj;
        for (let index = 0; index < this.ListAppCustFamily.length; index++) {
          const element = this.ListAppCustFamily[index];
          if(element.MrCustTypeCode == this.CustTypePersonal){
            this.ListAppCustFamily[index].MrCustRelationshipDescr = this.DictRefMaster[this.RefMasterTypeCustPersonalRelationship + element.MrCustRelationshipCode];
          }
          if(element.MrCustTypeCode == this.CustTypeCompany){
            this.ListAppCustFamily[index].MrCustRelationshipDescr = this.DictRefMaster[this.RefMasterTypeCustCompanyRelationship + element.MrCustRelationshipCode];
          }
        }
      }
    );
  }

  ListAppCustShareholder: Array<ResAppCustForListCustMainDataObj> = new Array<ResAppCustForListCustMainDataObj>();
  async GetListAppCustShareholderMainDataByAppId() {
    if (this.crdRvwCustInfoObj.MrCustTypeCode != this.CustTypeCompany) return;
    await this.http.post<ResListCustMainDataObj>(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.appId, IsShareholder: true }).toPromise().then(
      (response) => {
        this.ListAppCustShareholder = response.ListAppCustObj;
        for (let index = 0; index < this.ListAppCustShareholder.length; index++) {
          const element = this.ListAppCustShareholder[index];
          if(element.MrCustTypeCode == this.CustTypePersonal){
            this.ListAppCustShareholder[index].MrCustRelationshipDescr = this.DictRefMaster[this.RefMasterTypeCustPersonalRelationship + element.MrCustRelationshipCode];
          }
          if(element.MrCustTypeCode == this.CustTypeCompany){
            this.ListAppCustShareholder[index].MrCustRelationshipDescr = this.DictRefMaster[this.RefMasterTypeCustCompanyRelationship + element.MrCustRelationshipCode];
          }
        }
      }
    );
  }

  ListAppCustGuarantor: Array<ResAppCustForListCustMainDataObj> = new Array<ResAppCustForListCustMainDataObj>();
  async GetListAppCustGuarantorMainDataByAppId() {
    await this.http.post<ResListCustMainDataObj>(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.appId, IsGuarantor: true }).toPromise().then(
      (response) => {
        this.ListAppCustGuarantor = response.ListAppCustObj;
        for (let index = 0; index < this.ListAppCustGuarantor.length; index++) {
          const element = this.ListAppCustGuarantor[index];
          if(element.MrCustTypeCode == this.CustTypePersonal){
            this.ListAppCustGuarantor[index].MrCustRelationshipDescr = this.DictRefMaster[this.RefMasterTypeCustPersonalRelationship + element.MrCustRelationshipCode];
          }
          if(element.MrCustTypeCode == this.CustTypeCompany){
            this.ListAppCustGuarantor[index].MrCustRelationshipDescr = this.DictRefMaster[this.RefMasterTypeCustCompanyRelationship + element.MrCustRelationshipCode];
          }
        }
      }
    );
  }

  DictRefMaster: { [Id: string]: string } = {};
  async GetListRefMasterByRefMasterTypeCodes() {
    let tempReq: GenericObj = new GenericObj();
    tempReq.Codes = [this.RefMasterTypeCustPersonalRelationship, this.RefMasterTypeCustCompanyRelationship, this.RefMasterTypeCustGuarCompanyRelationship, this.RefMasterTypeCodeGuarPersonalRelationship];
    await this.http.post<{ ReturnObject: Array<RefMasterObj> }>(URLConstant.GetListRefMasterByRefMasterTypeCodes, tempReq).toPromise().then(
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
    await this.http.post<{ ListCrdRvwExposureHObj: Array<CrdRvwExposureHObj>, ListCrdRvwOvdObj: Array<CrdRvwOvdObj> }>(URLConstant.GetListCrdRvwExposureByCrdRvwCustInfoId, { Id: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        for (let index = 0; index < response.ListCrdRvwExposureHObj.length; index++) {
          const element: CrdRvwExposureHObj = response.ListCrdRvwExposureHObj[index];
          this.DictCrdRvwExposureHId[element.CustNo + element.RelationType] = element.CrdRvwExposureHId;
          this.DictCrdRvwExposure[element.CustNo + element.RelationType] = element.ListCrdRvwExposureDObj.find(x=>x.ExposureType == this.ExposureCustTypeCode);
        }

        for (let index = 0; index < response.ListCrdRvwOvdObj.length; index++) {
          const element = response.ListCrdRvwOvdObj[index];
          this.DictCrdRvwGuarantorExposure[element.CustNo] = element;
        }
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
