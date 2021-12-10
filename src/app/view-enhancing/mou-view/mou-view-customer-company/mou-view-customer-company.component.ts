import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { MouCustBankAccObj } from 'app/shared/model/mou-cust-bank-acc-obj.model';
import { MouCustCompanyDataObj } from 'app/shared/model/mou-cust-company-data-obj.model';
import { MouCustCompanyLegalDocObj } from 'app/shared/model/mou-cust-company-legal-doc-obj.model';
import { MouCustCompanyMgmntShrholderObj } from 'app/shared/model/mou-cust-company-mgmnt-shrholder-obj.model';
import { MouCustPersonalContactPersonObj } from 'app/shared/model/mou-cust-personal-contact-person-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { ResListKeyValueObj } from 'app/shared/model/response/generic/res-list-key-value-obj.model';

@Component({
  selector: 'app-mou-view-customer-company',
  templateUrl: './mou-view-customer-company.component.html'
})
export class MouViewCustomerCompanyComponent implements OnInit {

  @Input() custDataCompanyObj : MouCustCompanyDataObj = new MouCustCompanyDataObj();

  custModelReqObj: ReqRefMasterByTypeCodeAndMappingCodeObj;
  CustModelObjs: Array<KeyValueObj> = new Array<KeyValueObj>();
  CompanyTypeObjs: Array<KeyValueObj> = new Array<KeyValueObj>();
  CustTypeObjs: Array<KeyValueObj>= new Array<KeyValueObj>();
  CustModel: string = "";
  CompType: string = "";
  IndustryTypeName: string = "";
  listShareholder: Array<MouCustCompanyMgmntShrholderObj> = new Array<MouCustCompanyMgmntShrholderObj>();
  listContactPersonCompany: Array<MouCustPersonalContactPersonObj> = new Array<MouCustPersonalContactPersonObj>();
  listMouCustBankAcc: Array<MouCustBankAccObj> = new Array<MouCustBankAccObj>();
  listLegalDoc: Array<MouCustCompanyLegalDocObj> = new Array<MouCustCompanyLegalDocObj>();

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.setCustModelObj();
    await this.setCompanyTypeObj();
    await this.setIndustryTypeName(this.custDataCompanyObj.MouCustCompanyObj.IndustryTypeCode);
    this.listShareholder = this.custDataCompanyObj.MouCustCompanyMgmntShrholderObjs;
    await this.setCustTypeMgmntShrholderObj();
    this.listContactPersonCompany = this.custDataCompanyObj.MouCustCompanyContactPersonObjs;
    this.listMouCustBankAcc = this.custDataCompanyObj.MouCustBankAccObjs;
    this.listLegalDoc = this.custDataCompanyObj.MouCustCompanyLegalDocObjs;
  }

  async setCustModelObj() {
    this.custModelReqObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    this.custModelReqObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustModel;
    this.custModelReqObj.MappingCode = CommonConstant.CustTypeCompany;
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, this.custModelReqObj).toPromise().then(
      (response : ResListKeyValueObj) => {
        this.CustModelObjs = response[CommonConstant.ReturnObj];
        let temp = this.CustModelObjs.find(x => x.Key == this.custDataCompanyObj.MouCustObj.CustModelCode);
        this.CustModel = temp? temp.Value : "-";
      }
    );
  }

  async setCompanyTypeObj() {
    let refMasterObj = { RefMasterTypeCode : CommonConstant.RefMasterTypeCodeCompanyType };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.CompanyTypeObjs = response[CommonConstant.ReturnObj];
        let temp = this.CompanyTypeObjs.find(x => x.Key == this.custDataCompanyObj.MouCustCompanyObj.MrCompanyTypeCode);
        this.CompType = temp? temp.Value : "-";
      }
    );
  }

  async setIndustryTypeName(industryTypeCode : string) {
    await this.http.post(URLConstant.GetRefIndustryTypeByCode, {Code: industryTypeCode}).toPromise().then(
      (response) => {
        response? this.IndustryTypeName = response["IndustryTypeName"] : this.IndustryTypeName = "-";
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  async setCustTypeMgmntShrholderObj() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeShareholderCustType }).toPromise().then(
      (response) => {
        this.CustTypeObjs = response[CommonConstant.ReturnObj];
        if (this.CustTypeObjs.length > 0) {
          for (let index = 0; index < this.listShareholder.length; index++) {
            let temp = this.CustTypeObjs.find(x => x.Key == this.listShareholder[index].MrShrholderTypeCode);
            this.listShareholder[index].MrShrholderTypeName = temp ? temp.Value : "";
          }
        }
      }
    );
  }

}
