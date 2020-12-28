import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { CrdRvwExposureObj } from 'app/shared/model/CreditReview/CrdRvwExposureObj.Model';

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
  Title: string = "";
  isReady: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    // private fb: FormBuilder,
    private router: Router) { }

  async ngOnInit() {
    console.log(this.appId);
    console.log(this.crdRvwCustInfoObj);
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
      this.Title = "Family";
    }
    else {
      this.Title = "Shareholder";
    }
  }

  //#region Get Data
  ListAppCustFamily: Array<AppCustObj> = new Array<AppCustObj>();
  async GetListAppCustFamilyMainDataByAppId() {
    if (this.crdRvwCustInfoObj.MrCustTypeCode != this.CustTypePersonal) return;
    await this.http.post<{ ListAppCustObj: Array<AppCustObj> }>(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.appId, IsFamily: true }).toPromise().then(
      (response) => {
        console.log(response);
        this.ListAppCustFamily = response.ListAppCustObj;
      }
    );
  }

  ListAppCustShareholder: Array<AppCustObj> = new Array<AppCustObj>();
  async GetListAppCustShareholderMainDataByAppId() {
    if (this.crdRvwCustInfoObj.MrCustTypeCode != this.CustTypeCompany) return;
    await this.http.post<{ ListAppCustObj: Array<AppCustObj> }>(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.appId, IsShareholder: true }).toPromise().then(
      (response) => {
        console.log(response);
        this.ListAppCustShareholder = response.ListAppCustObj;
      }
    );
  }

  ListAppCustGuarantor: Array<AppCustObj> = new Array<AppCustObj>();
  async GetListAppCustGuarantorMainDataByAppId() {
    await this.http.post<{ ListAppCustObj: Array<AppCustObj> }>(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.appId, IsGuarantor: true }).toPromise().then(
      (response) => {
        console.log(response);
        this.ListAppCustGuarantor = response.ListAppCustObj;
      }
    );
  }

  DictRefMaster: { [Id: string]: string } = {};
  async GetListRefMasterByRefMasterTypeCodes() {
    let tempReq = { refMasterTypeCodes: [this.RefMasterTypeCustPersonalRelationship, this.RefMasterTypeCustCompanyRelationship, this.RefMasterTypeCustGuarCompanyRelationship, this.RefMasterTypeCodeGuarPersonalRelationship] };
    await this.http.post<{ ReturnObject: any }>(URLConstant.GetListRefMasterByRefMasterTypeCodes, tempReq).toPromise().then(
      (response) => {
        console.log(response);
        for (let index = 0; index < response.ReturnObject.length; index++) {
          const element = response.ReturnObject[index];
          this.DictRefMaster[element.RefMasterTypeCode + element.MasterCode] = element.Descr;
        }
        console.log(this.DictRefMaster);
      }
    );
  }

  DictCrdRvwExposure: { [Id: string]: CrdRvwExposureObj } = {};
  async GetListCrdRvwExposureByCrdRvwCustInfoId() {
    await this.http.post<{ ListCrdRvwExposureObj: Array<CrdRvwExposureObj> }>(URLConstant.GetListCrdRvwExposureByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
      (response) => {
        console.log(response);
        for (let index = 0; index < response.ListCrdRvwExposureObj.length; index++) {
          const element = response.ListCrdRvwExposureObj[index];
          this.DictCrdRvwExposure[element.CustNo + element.RelationWithCust] = element;
        }
        console.log(this.DictCrdRvwExposure);
      }

    )
  }
  //#endregion
  
  //#region Link a href
  ClickLinkCust(CustNo: string){
    console.log(CustNo);
    // AdInsHelper.OpenCustomerViewByCustId(0);
  }
  //#endregion

}
