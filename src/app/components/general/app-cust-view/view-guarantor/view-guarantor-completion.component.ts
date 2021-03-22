import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppGuarantorPersonalObj } from 'app/shared/model/AppGuarantorPersonalObj.Model';
import { AppGuarantorObj } from 'app/shared/model/AppGuarantorObj.Model';
import { AppGuarantorCompanyObj } from 'app/shared/model/AppGuarantorCompanyObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ViewAppCustDetailComponent } from 'app/components/general/app-cust-view/view-app-cust-detail/view-app-cust-detail.component';

@Component({
  selector: 'app-guarantor-completion',
  templateUrl: './view-guarantor-completion.component.html',
  styleUrls: []
})
export class GuarantorCompletionComponent implements OnInit {

  @Input() AppId;
  listAppGuarantorPersonal : Array<AppGuarantorPersonalObj> = new Array<AppGuarantorPersonalObj>();
  listAppGuarantorCompany : Array<AppGuarantorCompanyObj> = new Array<AppGuarantorCompanyObj>();
  listAppGuarantor : Array<AppGuarantorObj> = new Array<AppGuarantorObj>();
  guarantorPersonal: any;
  guarantorPersonalFiltered: any;
  guarantorCompany: any;
  guarantorCompanyFiltered: any;
  closeResult: any;
  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    this.setValue();
  }

  setValue(){    
    this.http.post(URLConstant.GetListAppGuarantorPersonalForView, {Id:this.AppId}).subscribe(
      (response) => {
        this.listAppGuarantorPersonal = response[CommonConstant.ReturnObj];
      });

    this.http.post(URLConstant.GetListAppGuarantorCompanyForView, {Id:this.AppId}).subscribe(
      (response) => {
        this.listAppGuarantorCompany = response[CommonConstant.ReturnObj];
      });
  }
  
  ViewGuarantorPersonal(id) {
    this.OpenDetailAppCustModal(id, CommonConstant.CustTypePersonal);
  }

  ViewGuarantorCompany(id) {
    this.OpenDetailAppCustModal(id, CommonConstant.CustTypeCompany);
  }

  OpenDetailAppCustModal(appCustId, mrCustTypeCode) {
    const modalInsDetail = this.modalService.open(ViewAppCustDetailComponent);
    modalInsDetail.componentInstance.AppCustId = appCustId;
    modalInsDetail.componentInstance.MrCustTypeCode = mrCustTypeCode;
    modalInsDetail.componentInstance.CustomerTitle = 'Guarantor';
    modalInsDetail.result.then().catch((error) => {
    });
  }


}
