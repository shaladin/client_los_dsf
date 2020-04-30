import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';

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

    await this.http.post(environment.losUrl + AdInsConstant.GetAppReferantorByAppId, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.existData = true;
        if(response["AppReferantorId"] != 0){
          this.ResponseReferantorData.Name = response["ReferantorName"];
          this.ResponseReferantorData.Type = response["MrReferantorType"];
          this.ResponseReferantorData.BankAcc = response["BankAccName"];
          this.ResponseReferantorData.Tax = response["TaxIdNo"];
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
