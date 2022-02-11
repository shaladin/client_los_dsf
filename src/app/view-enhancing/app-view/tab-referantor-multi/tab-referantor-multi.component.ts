import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppReferantorTaxInfoObj } from 'app/shared/model/app-referantor/app-referantor-tax-info-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { NapAppReferantorModel } from 'app/shared/model/nap-app-referantor.model';
import { TabReferantorMultiDetailComponent } from '../tab-referantor-multi-detail/tab-referantor-multi-detail.component';

@Component({
  selector: 'app-tab-referantor-multi',
  templateUrl: './tab-referantor-multi.component.html'
})
export class TabReferantorMultiComponent implements OnInit {

  @Input() AppId;
  IsReady: boolean = false;
  IsHidden: boolean = true;
  refCategory: Array<KeyValueObj> = new Array<KeyValueObj>();
  ListAppReferantors: Array<NapAppReferantorModel> = new Array<NapAppReferantorModel>();

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  async ngOnInit() {
    await this.getAppReferantorData();
    this.IsReady = true;
  }

  async getAppReferantorData() {
    let obj = {
      Id: this.AppId,
    }

    await this.http.post(URLConstant.GetListAppReferantorWithDetailByAppId, obj).toPromise().then(
    (response) => {
      this.ListAppReferantors = response[CommonConstant.ReturnObj];
      console.log(this.ListAppReferantors);

      for(let i = 0; i < this.ListAppReferantors.length; i++){
        this.setReferantorCategory(this.ListAppReferantors[i], i);
      }
    });
  }

  setReferantorCategory(AppReferantorObj : NapAppReferantorModel, i : number){
    if(AppReferantorObj.ReferantorCategory != CommonConstant.ReferantorCategoryAgency && AppReferantorObj.ReferantorCategory != CommonConstant.ReferantorCategoryCustomer){
      AppReferantorObj.ReferantorCategory = CommonConstant.ReferantorCategorySupplierEmployee;
    }
  }

  viewDetailReferantor(i : number){
    let appReferantorObj = new AppReferantorTaxInfoObj();
    appReferantorObj.TaxIdNo = this.ListAppReferantors[i].TaxIdNo;
    appReferantorObj.TaxIdName = this.ListAppReferantors[i].TaxIdName;
    appReferantorObj.TaxpayerNo = this.ListAppReferantors[i].TaxpayerNo;
    appReferantorObj.TaxIdAddr = this.ListAppReferantors[i].TaxIdAddr;
    appReferantorObj.TaxIdAreaCode1 = this.ListAppReferantors[i].TaxIdAreaCode1;
    appReferantorObj.TaxIdAreaCode2 = this.ListAppReferantors[i].TaxIdAreaCode2;
    appReferantorObj.TaxIdAreaCode3 = this.ListAppReferantors[i].TaxIdAreaCode3;
    appReferantorObj.TaxIdAreaCode4 = this.ListAppReferantors[i].TaxIdAreaCode4;
    appReferantorObj.TaxIdCity = this.ListAppReferantors[i].TaxIdCity;
    appReferantorObj.TaxIdZipcode = this.ListAppReferantors[i].TaxIdZipcode;

    const modalViewReferantorDetail = this.modalService.open(TabReferantorMultiDetailComponent);
    modalViewReferantorDetail.componentInstance.AppReferantorTaxInfoObj = appReferantorObj;
    modalViewReferantorDetail.result.then().catch((error) => {
    });
  }

}
