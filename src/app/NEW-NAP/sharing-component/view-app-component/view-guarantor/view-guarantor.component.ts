import { Component, OnInit, Input } from '@angular/core';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppGuarantorPersonalObj } from 'app/shared/model/AppGuarantorPersonalObj.Model';
import { AppGuarantorObj } from 'app/shared/model/AppGuarantorObj.Model';
import { AppGuarantorCompanyObj } from 'app/shared/model/AppGuarantorCompanyObj.Model';
import { GuarantorPersonalObj } from 'app/shared/model/GuarantorPersonalObj.Model';

@Component({
  selector: 'app-guarantor',
  templateUrl: './view-guarantor.component.html',
  styleUrls: []
})
export class GuarantorComponent implements OnInit {

  @Input() AppId;
  listAppGuarantorPersonal : Array<AppGuarantorPersonalObj> = new Array<AppGuarantorPersonalObj>();
  listAppGuarantorCompany : Array<AppGuarantorCompanyObj> = new Array<AppGuarantorCompanyObj>();
  listAppGuarantor : Array<AppGuarantorObj> = new Array<AppGuarantorObj>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.setValue();
  }

  setValue(){ 
    // this.http.post(AdInsConstant.GetListAppGuarantor, {AppId:this.AppId}).subscribe(
    //   (response) => {
    //     console.log(response);
    //     this.listAppGuarantor = response["ReturnObject"];
    //     console.log(this.listAppGuarantor);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );    
    this.http.post(AdInsConstant.GetListAppGuarantorPersonalForView, {AppId:this.AppId}).subscribe(
      (response) => {
        console.log(response);
        this.listAppGuarantorPersonal = response["ReturnObject"];
      },
      (error) => {
        console.log(error);
      }
    );

    this.http.post(AdInsConstant.GetListAppGuarantorCompanyForView, {AppId:this.AppId}).subscribe(
      (response) => {
        console.log(response);
        this.listAppGuarantorCompany = response["ReturnObject"];
      },
      (error) => {
        console.log(error);
      }
    );

  }

}
