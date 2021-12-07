import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { MouCustAddrObj } from 'app/shared/model/mou-cust-addr-obj.model';
import { MouCustBankAccObj } from 'app/shared/model/mou-cust-bank-acc-obj.model';
import { MouCustPersonalContactPersonObj } from 'app/shared/model/mou-cust-personal-contact-person-obj.model';
import { MouCustPersonalDataObj } from 'app/shared/model/mou-cust-personal-data-obj.model';

@Component({
  selector: 'app-mou-view-customer-personal',
  templateUrl: './mou-view-customer-personal.component.html'
})
export class MouViewCustomerPersonalComponent implements OnInit {

  @Input() custDataPersonalObj: MouCustPersonalDataObj = new MouCustPersonalDataObj();
  @Input() CountryName: string;

  mouCustAddrForViewObjs: Array<MouCustAddrObj> = new Array<MouCustAddrObj>();
  listMouCustBankAcc: Array<MouCustBankAccObj> = new Array<MouCustBankAccObj>();
  listMouCustPersonalContactInformation: Array<MouCustPersonalContactPersonObj> = new Array<MouCustPersonalContactPersonObj>();
  CustRelationshipObjs: Array<KeyValueObj>= new Array<KeyValueObj>();
  TotalMonthlyIncome: number;
  TotalMonthlyExpense: number;
  NettMonthlyIncome: number;
  defCustModelCode: string;
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    this.listMouCustBankAcc = this.custDataPersonalObj.MouCustBankAccObjs;
    this.defCustModelCode = this.custDataPersonalObj.MouCustObj.CustModelCode;
    this.listMouCustPersonalContactInformation = this.custDataPersonalObj.MouCustPersonalContactPersonObjs;
    await this.setCustTypeMgmntShrholderObj();
    this.setMouCustFinData();
  }

  checkMouCustPhone(CheckPhnNo) : string{
    let PhnNo = CheckPhnNo == null? "" : CheckPhnNo;
    return PhnNo;
  }


  setMouCustFinData(){
      this.TotalMonthlyIncome = this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyIncomeAmt + this.custDataPersonalObj.MouCustPersonalFinDataObj.SpouseMonthlyIncomeAmt;
      this.TotalMonthlyExpense = this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyExpenseAmt + this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyInstallmentAmt;
      this.NettMonthlyIncome = (this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyIncomeAmt + this.custDataPersonalObj.MouCustPersonalFinDataObj.SpouseMonthlyIncomeAmt)-(this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyExpenseAmt + this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyInstallmentAmt);
  }

  async setCustTypeMgmntShrholderObj() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship }).toPromise().then(
      (response) => {
        this.CustRelationshipObjs = response[CommonConstant.ReturnObj];
        if (this.CustRelationshipObjs.length > 0) {
          for (let index = 0; index < this.listMouCustPersonalContactInformation.length; index++) {
            let temp = this.CustRelationshipObjs.find(x => x.Key == this.listMouCustPersonalContactInformation[index].MrCustRelationshipCode);
            this.listMouCustPersonalContactInformation[index].RelationshipName = temp ? temp.Value : "";
          }
        }
      }
    );
  }

}
