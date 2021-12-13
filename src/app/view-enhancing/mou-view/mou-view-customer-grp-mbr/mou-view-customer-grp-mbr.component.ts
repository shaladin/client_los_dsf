import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { MouCustGrpObj } from 'app/shared/model/mou-cust-grp-obj.model';

@Component({
  selector: 'app-mou-view-customer-grp-mbr',
  templateUrl: './mou-view-customer-grp-mbr.component.html'
})
export class MouViewCustomerGrpMbrComponent implements OnInit {

  @Input() MouCustGrpObjs: Array<MouCustGrpObj>;
  @Input() MrCustTypeCode: string;

  CustRelationshipPersonalObj: Array<KeyValueObj>;
  CustRelationshipCompanyObj: Array<KeyValueObj>;
  CustRelationship: string = "";
  
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.getCustGrpData();
    if(this.MrCustTypeCode == "PERSONAL"){
      await this.bindCustRelationshipPersonalObj(this.MouCustGrpObjs[0].MrCustRelationshipCode);
    }
    else{
      await this.bindCustRelationshipCompanyObj(this.MouCustGrpObjs[0].MrCustRelationshipCode);
    }
  }

  async getCustGrpData(){
    this.http.post(URLConstant.GetCustByCustNo, { CustNo: this.MouCustGrpObjs[0].CustNo }).toPromise().then(
      (response) => {
        this.MouCustGrpObjs[0].CustName = response["CustName"];
      }
    );
  }

  async bindCustRelationshipPersonalObj(MrCustRelationshipCode : string){
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship }).toPromise().then(
      (response) => {
        this.CustRelationshipPersonalObj = response[CommonConstant.ReturnObj];
        let temp = this.CustRelationshipPersonalObj.find(x => x.Key == MrCustRelationshipCode);
        this.CustRelationship = temp? temp.Value : "-";
      }
    );
  }

  async bindCustRelationshipCompanyObj(MrCustRelationshipCode : string){
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustCompanyRelationship }).toPromise().then(
      (response) => {
        this.CustRelationshipCompanyObj = response[CommonConstant.ReturnObj];
        let temp = this.CustRelationshipCompanyObj.find(x => x.Key == MrCustRelationshipCode);
        this.CustRelationship = temp? temp.Value : "-";
      }
    );
  }

}
