import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ViewInsuranceDataDetailXComponent } from './view-insurance-data-detail-x/view-insurance-data-detail-x.component';

@Component({
  selector: 'view-Insurance-data-x',
  templateUrl: './view-Insurance-data-x.component.html'
})
export class ViewInsuranceDataXComponent implements OnInit {
  @Input() AgrmntId: number;
  @Input() BizTemplateCode : string = "";
  appCollObjs: any;
  custTotalPremi: number = 0;
  totalCustPaidAmt: number = 0;
  totalCapitalizedAmt: number = 0;
  totalCustDiscAmt: number = 0;

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    this.http.post(URLConstantX.GetListAppInsObjByAgrmntIdForViewX, {Id: this.AgrmntId}).subscribe(
      (response) => {
        this.appCollObjs = response[CommonConstant.ReturnObj];

        for(let i = 0; i < this.appCollObjs.length; i++) {
          if(this.appCollObjs[i].TotalInsCustAmt != null) {
            this.custTotalPremi += this.appCollObjs[i].TotalInsCustAmt;
          }

          if(this.appCollObjs[i].TotalCustDiscAmt != null) {
            this.totalCustDiscAmt += this.appCollObjs[i].TotalCustDiscAmt; 
          }

          if(this.appCollObjs[i].InsCpltzAmt != null) {
            this.totalCapitalizedAmt += this.appCollObjs[i].InsCpltzAmt;
          }
        }

        this.custTotalPremi -= this.totalCustDiscAmt;
        this.totalCustPaidAmt = this.custTotalPremi - this.totalCapitalizedAmt;
        
      }
    );
  }

  viewDetailCollateralHandler(appInsObjId){
    const modalInsDetail = this.modalService.open(ViewInsuranceDataDetailXComponent);
    modalInsDetail.componentInstance.AppInsObjId = appInsObjId;
    modalInsDetail.result.then().catch((error) => {
    });
  }

}
