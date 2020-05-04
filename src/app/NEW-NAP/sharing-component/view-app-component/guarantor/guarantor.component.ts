import { Component, OnInit, Input } from '@angular/core';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-guarantor',
  templateUrl: './guarantor.component.html',
  styleUrls: []
})
export class GuarantorComponent implements OnInit {

  viewObj: string;
  viewObj1: string;
  viewObj2: string;
  viewObj3: string;
  viewObj4: string;
  inputGridObj: InputGridObj;
  @Input() arrValue = [];
  @Input() AppId;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppGuarantorLegalDoc.json";

    var AppObj = {
      AppId: this.AppId
    }

    this.http.post(AdInsConstant.GetListAppGuarantorCompanyByAppId, AppObj).subscribe(
      (response) => {
        console.log(response);
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["ReturnObject"]["ListAppGuarantorCompanyLegalDoc"]
      },
      (error) => {
        console.log(error);
      }
    );

    this.viewObj = "./assets/ucviewgeneric/viewGuarantorPersonalMainInfo.json";
    this.viewObj1 = "./assets/ucviewgeneric/viewGuarantorPersonalAddr.json";
    this.viewObj2 = "./assets/ucviewgeneric/viewGuarantorCompanyMainInfo.json";
    this.viewObj3 = "./assets/ucviewgeneric/viewGuarantorCompanyAddr.json";
    this.viewObj4 = "./assets/ucviewgeneric/viewGuarantorCompanyContactInfo.json";
  }

}
