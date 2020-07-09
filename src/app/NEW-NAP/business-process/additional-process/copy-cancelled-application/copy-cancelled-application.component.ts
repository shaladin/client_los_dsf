import { Component, OnInit, ViewChild } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-copy-cancelled-application',
  templateUrl: './copy-cancelled-application.component.html',
  styleUrls: ['./copy-cancelled-application.component.scss']
})
export class CopyCancelledApplicationComponent implements OnInit {
  @ViewChild(UcpagingComponent) paging: UcpagingComponent;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  link: string;

  constructor(private http: HttpClient, private toastr: NGXToastrService, private router: Router) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCancelledApp.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCancelledApp.json";
  }

  getEvent(ev) {
    if(ev.Key == "prodOff"){
      this.http.post(AdInsConstant.GetProdOfferingHByCode, {ProdOfferingCode : ev.RowObj.ProdOfferingCode}).subscribe(
        response => {
          this.link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=" + response['ProdOfferingHId'];
          window.open(this.link, '_blank');
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(ev.Key == "copy"){
      if (confirm("Are you sure to copy this application?")) {
        this.http.post(URLConstant.CopyCancelledApp, { AppId: ev.RowObj.AppId }).subscribe(
          response => {
            this.toastr.successMessage(response["message"]);
            this.paging.searchPagination(1);
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }
}
