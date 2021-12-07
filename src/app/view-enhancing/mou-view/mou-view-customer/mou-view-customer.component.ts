import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { MouCustBankAccObj } from 'app/shared/model/mou-cust-bank-acc-obj.model';
import { MouCustCompanyDataObj } from 'app/shared/model/mou-cust-company-data-obj.model';
import { MouCustCompanyLegalDocObj } from 'app/shared/model/mou-cust-company-legal-doc-obj.model';
import { MouCustCompanyMgmntShrholderObj } from 'app/shared/model/mou-cust-company-mgmnt-shrholder-obj.model';
import { MouCustPersonalContactPersonObj } from 'app/shared/model/mou-cust-personal-contact-person-obj.model';
import { MouCustPersonalDataObj } from 'app/shared/model/mou-cust-personal-data-obj.model';

@Component({
  selector: 'app-mou-view-customer',
  templateUrl: './mou-view-customer.component.html'
})
export class MouViewCustomerComponent implements OnInit {

  @Input() MouCustId: number;
  
  custDataPersonalObj: MouCustPersonalDataObj = new MouCustPersonalDataObj();
  custDataCompanyObj: MouCustCompanyDataObj = new MouCustCompanyDataObj();
  

  listMouCustBankAccCompany: Array<MouCustBankAccObj> = new Array<MouCustBankAccObj>();
  listShareholder: Array<MouCustCompanyMgmntShrholderObj> = new Array<MouCustCompanyMgmntShrholderObj>();
  listContactPersonCompany: Array<MouCustPersonalContactPersonObj> = new Array<MouCustPersonalContactPersonObj>();
  listLegalDoc: Array<MouCustCompanyLegalDocObj> = new Array<MouCustCompanyLegalDocObj>();
  isBindDataDone: boolean = false;
  MrCustTypeCode: string;
  CountryName: string = "";
  
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.getCustData();
  }

  async getCustData() {
    await this.http.post(URLConstant.GetMouCustByMouCustId, { Id: this.MouCustId }).toPromise().then(
      async (response) => {
        if (response["MouCustObj"]["MouCustId"] > 0) {
          if (response["MouCustObj"]["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
            this.custDataPersonalObj = new MouCustPersonalDataObj();
            this.custDataPersonalObj.MouCustObj = response["MouCustObj"];
            this.custDataPersonalObj.MouCustPersonalObj = response["MouCustPersonalObj"];
            this.custDataPersonalObj.MouCustAddrLegalObj = response["MouCustAddrLegalObj"];
            this.custDataPersonalObj.MouCustAddrResidenceObj = response["MouCustAddrResidenceObj"];
            this.custDataPersonalObj.MouCustAddrMailingObj = response["MouCustAddrMailingObj"];
            this.custDataPersonalObj.MouCustPersonalContactPersonObjs = response["MouCustPersonalContactPersonObjs"];
            this.custDataPersonalObj.MouCustPersonalFinDataObj = response["MouCustPersonalFinDataObj"];
            this.custDataPersonalObj.MouCustBankAccObjs = response["MouCustBankAccObjs"];
            this.custDataPersonalObj.MouCustPersonalJobDataObj = response["MouCustPersonalJobDataObj"];
            this.custDataPersonalObj.MouCustSocmedObjs = response["MouCustSocmedObjs"];
            this.custDataPersonalObj.MouCustGrpObjs = response["MouCustGrpObjs"];

            await this.http.post(URLConstant.GetRefCountryByCountryCode, { Code: this.custDataPersonalObj.MouCustPersonalObj.NationalityCountryCode }).toPromise().then(
            (response) => {
              this.CountryName = response["CountryName"];
            });

            this.MrCustTypeCode = this.custDataPersonalObj.MouCustObj.MrCustTypeCode;
          }

          if (response["MouCustObj"]["MrCustTypeCode"] == CommonConstant.CustTypeCompany) {
            this.custDataCompanyObj = new MouCustCompanyDataObj();
            this.custDataCompanyObj.MouCustObj = response["MouCustObj"];
            this.custDataCompanyObj.MouCustCompanyObj = response["MouCustCompanyObj"];
            this.custDataCompanyObj.MouCustAddrLegalObj = response["MouCustAddrLegalObj"];
            this.custDataCompanyObj.MouCustAddrMailingObj = response["MouCustAddrMailingObj"];
            this.custDataCompanyObj.MouCustCompanyMgmntShrholderObjs = response["MouCustCompanyMgmntShrholderObjs"];
            this.listShareholder = this.custDataCompanyObj.MouCustCompanyMgmntShrholderObjs;
            this.custDataCompanyObj.MouCustCompanyContactPersonObjs = response["MouCustCompanyContactPersonObjs"];
            this.listContactPersonCompany = this.custDataCompanyObj.MouCustCompanyContactPersonObjs;
            this.custDataCompanyObj.MouCustCompanyFinDataObj = response["MouCustCompanyFinDataObj"];
            if (response["MouCustCompanyFinDataObj"] != undefined) {
              if (response["MouCustCompanyFinDataObj"].DateAsOf != undefined && response["MouCustCompanyFinDataObj"].DateAsOf != null) {
                this.custDataCompanyObj.MouCustCompanyFinDataObj.DateAsOf = formatDate(response["MouCustCompanyFinDataObj"].DateAsOf, 'yyyy-MM-dd', 'en-US');
              }
            }
            this.custDataCompanyObj.MouCustBankAccObjs = response["MouCustBankAccObjs"];
            this.listMouCustBankAccCompany = this.custDataCompanyObj.MouCustBankAccObjs;
            this.custDataCompanyObj.MouCustCompanyLegalDocObjs = response["MouCustCompanyLegalDocObjs"];
            this.listLegalDoc = this.custDataCompanyObj.MouCustCompanyLegalDocObjs;
            this.custDataCompanyObj.MouCustGrpObjs = response["MouCustGrpObjs"];

            this.MrCustTypeCode = this.custDataCompanyObj.MouCustObj.MrCustTypeCode;
          }
        }

        this.isBindDataDone = true;
      },
      (error) => {
        console.log(error);
        this.isBindDataDone = true;
      }
    );
  }



}
