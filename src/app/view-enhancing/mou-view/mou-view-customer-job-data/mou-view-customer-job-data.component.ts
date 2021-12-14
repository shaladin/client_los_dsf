import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { MouCustPersonalJobDataObj } from 'app/shared/model/mou-cust-personal-job-data-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { ResListKeyValueObj } from 'app/shared/model/response/generic/res-list-key-value-obj.model';

@Component({
  selector: 'app-mou-view-customer-job-data',
  templateUrl: './mou-view-customer-job-data.component.html'
})
export class MouViewCustomerJobDataComponent implements OnInit {

  @Input() CustModelCode: string;
  @Input() mouCustPersonalJobDataObj: MouCustPersonalJobDataObj = new MouCustPersonalJobDataObj();
  
  custModelReqObj : ReqRefMasterByTypeCodeAndMappingCodeObj;
  CustModelObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  JobPositionObj: Array<KeyValueObj>;
  JobStatObj: Array<KeyValueObj>;
  CompanyScaleObj: Array<KeyValueObj>;
  InvestmentTypeObj: Array<KeyValueObj>;
  CustModelName: string = "";
  ProfessionName: string = "";
  IndustryTypeName: string = "";
  JobPositionName: string = "";
  JobStatName: string = "";
  CompScale: string = "";
  InvestmentType: string = "";

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.bindCustModelObj();
    await this.setProfessionName(this.mouCustPersonalJobDataObj.MrProfessionCode);

    if(this.CustModelCode != "NONPROF"){
      await this.setIndustryTypeName(this.mouCustPersonalJobDataObj.IndustryTypeCode);
    }

    if(this.CustModelCode == "EMP"){
      await this.setJobStatObj();
    }

    if(this.CustModelCode == "SME"){
      await this.setInvestmentTypeObj();
    }
    
    if(this.CustModelCode == "EMP" || this.CustModelCode == "SME"){
      await this.setJobPositionObj();
      await this.setCompanyScaleObj();
    }

  }

  async bindCustModelObj() {
    this.custModelReqObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    this.custModelReqObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustModel;
    this.custModelReqObj.MappingCode = CommonConstant.CustTypePersonal;
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, this.custModelReqObj).toPromise().then(
      (response : ResListKeyValueObj) => {
        this.CustModelObj = response[CommonConstant.ReturnObj];
        let temp = this.CustModelObj.find(x => x.Key == this.CustModelCode);
        this.CustModelName = temp? temp.Value : "-";
      }
    );
  }

  async setProfessionName(professionCode : string) {
    await this.http.post(URLConstant.GetRefProfessionByCode, {Code : professionCode}).toPromise().then(
      (response) => {
        response? this.ProfessionName = response["ProfessionName"] : this.ProfessionName = "-";
      },
      (error) => {
        console.log(error);
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

  async setJobPositionObj() {
    let refMasterObj = { RefMasterTypeCode  : CommonConstant.RefMasterTypeCodeJobPosition };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        let temp = this.JobPositionObj.find(x => x.Key == this.mouCustPersonalJobDataObj.MrJobPositionCode);
        this.JobPositionName = temp? temp.Value : "-";
      }
    );
  }

  async setJobStatObj() {
    let refMasterObj = { RefMasterTypeCode  : CommonConstant.RefMasterTypeCodeJobStat };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.JobStatObj = response[CommonConstant.ReturnObj];
        let temp = this.JobStatObj.find(x => x.Key == this.mouCustPersonalJobDataObj.MrJobStatCode);
        this.JobStatName = temp? temp.Value : "-";
      }
    );
  }

  async setCompanyScaleObj() {
    let refMasterObj = { RefMasterTypeCode  : CommonConstant.RefMasterTypeCodeCoyScale };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.CompanyScaleObj = response[CommonConstant.ReturnObj];
        let temp = this.CompanyScaleObj.find(x => x.Key == this.mouCustPersonalJobDataObj.MrCompanyScaleCode);
        this.CompScale = temp? temp.Value : "-";
      }
    );
  }

  async setInvestmentTypeObj() {
    let refMasterObj = { RefMasterTypeCode  : CommonConstant.RefMasterTypeCodeInvestmentType };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.InvestmentTypeObj = response[CommonConstant.ReturnObj];
        let temp = this.InvestmentTypeObj.find(x => x.Key == this.mouCustPersonalJobDataObj.MrInvestmentTypeCode);
        this.InvestmentType = temp? temp.Value : "-";
      }
    );
  }
}
