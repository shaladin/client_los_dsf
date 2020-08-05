import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-tab-referantor',
  templateUrl: './tab-referantor.component.html',
  styleUrls: ['./tab-referantor.component.scss']
})
export class TabReferantorComponent implements OnInit {

  @Input() appId;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder) { }

  ResponseReferantorData;
  existData;
  async ngOnInit() {
    this.existData = false;
    this.ResponseReferantorData = {
      Name: "",
      Type: "",
      BankAcc: "",
      Tax: ""
    };
    await this.GetReferantorData();
  }

  async GetReferantorData(){
    var obj = {
      AppId: this.appId,
      RowVersion: ""
    }

    await this.http.post(URLConstant.GetAppReferantorByAppId, obj).toPromise().then(
      (response) => {
        if(response["AppReferantorId"] != 0){
          this.existData = true;
          this.ResponseReferantorData.Name = response["ReferantorName"];
          this.ResponseReferantorData.Type = response["MrReferantorTypeName"];
          this.ResponseReferantorData.BankAcc = response["BankAccName"];
          this.ResponseReferantorData.Tax = response["TaxIdNo"];
          this.ResponseReferantorData.TaxIdName = response["TaxIdName"];
          this.ResponseReferantorData.TaxIdAreaCode1 = response["TaxIdAreaCode1"];
          this.ResponseReferantorData.TaxIdAreaCode2 = response["TaxIdAreaCode2"];
          this.ResponseReferantorData.TaxIdAreaCode3 = response["TaxIdAreaCode3"];
          this.ResponseReferantorData.TaxIdAreaCode4 = response["TaxIdAreaCode4"];
          this.ResponseReferantorData.TaxIdName = response["TaxIdName"];
          this.ResponseReferantorData.TaxIdAddr = response["TaxIdAddr"];
          this.ResponseReferantorData.TaxIdCity = response["TaxIdCity"];
          this.ResponseReferantorData.TaxIdZipcode = response["TaxIdZipcode"];
        }
      })
  }
}
