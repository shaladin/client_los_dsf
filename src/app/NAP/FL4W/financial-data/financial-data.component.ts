import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { GetAppSubsidyByAppIdObj } from 'app/shared/model/GetAppSubsidyByAppIdObj.Model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubsidyComponent } from './subsidy/subsidy.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-financial-data',
  templateUrl: './financial-data.component.html',
  styleUrls: ['./financial-data.component.scss']
})
export class FinancialDataComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private modalService: NgbModal, private spinner: NgxSpinnerService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
    });
    this.GetListAppSubsidyByAppIdUrl = AdInsConstant.GetListAppSubsidyByAppId;
  }
  AppId: number;
  GetListAppSubsidyByAppIdUrl: string;
  getAppSubsidyByAppIdObj: any;
  listAppSubsidy: any;
  ngOnInit() {
    this.getAppSubsidyByAppIdObj = new GetAppSubsidyByAppIdObj();
    this.getAppSubsidyByAppIdObj.AppId = this.AppId;
    console.log("aaa");
    this.http.post(this.GetListAppSubsidyByAppIdUrl, this.getAppSubsidyByAppIdObj).subscribe(
      response => {
        this.listAppSubsidy = response["AppSubsidies"];
        console.log(this.listAppSubsidy);
      });
  }
  openModalAddFee() {
    const modalMouFee = this.modalService.open(SubsidyComponent);
    modalMouFee.componentInstance.AppId = this.AppId;
    modalMouFee.componentInstance.Mode = 'add';
    modalMouFee.result.then(
      (response) => {
        this.spinner.show();
        var GetAppSubsidyByAppIdObj = new GetAppSubsidyByAppIdObj();
        GetAppSubsidyByAppIdObj.AppId = this.AppId;
      
        this.spinner.hide();
        
      }
    ).catch((error) => {
      if (error != 0) {
        console.log(error);
      }
    });
  }


}
