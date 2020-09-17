import { Component, OnInit, Input } from '@angular/core';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppGuarantorPersonalObj } from 'app/shared/model/AppGuarantorPersonalObj.Model';
import { AppGuarantorObj } from 'app/shared/model/AppGuarantorObj.Model';
import { AppGuarantorCompanyObj } from 'app/shared/model/AppGuarantorCompanyObj.Model';
import { GuarantorPersonalObj } from 'app/shared/model/GuarantorPersonalObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
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
    this.http.post(URLConstant.GetListAppGuarantorPersonalForView, {AppId:this.AppId}).subscribe(
      (response) => {
        this.listAppGuarantorPersonal = response[CommonConstant.ReturnObj];
      });

    this.http.post(URLConstant.GetListAppGuarantorCompanyForView, {AppId:this.AppId}).subscribe(
      (response) => {
        this.listAppGuarantorCompany = response[CommonConstant.ReturnObj];
      });



  }
  ViewGuarantorPersonal(content,id) {
    this.guarantorPersonalFiltered = this.listAppGuarantorPersonal.filter(
      per => per.AppGuarantorPersonalId == id);
    this.guarantorPersonal = this.guarantorPersonalFiltered[0];
    this.open(content);
  }
  ViewGuarantorCompany(content,id) {
    this.guarantorCompanyFiltered = this.listAppGuarantorCompany.filter(
      coy => coy.AppGuarantorCompanyId == id);
    this.guarantorCompany = this.guarantorCompanyFiltered[0];
    this.open(content);
  }
  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  cancel() {
    this.modalService.dismissAll();
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
