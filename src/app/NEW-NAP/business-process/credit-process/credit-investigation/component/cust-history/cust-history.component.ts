import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-cust-history',
  templateUrl: './cust-history.component.html'
})
export class CustHistoryComponent implements OnInit {

  @Input() AppId: any;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  CustNo: any;
  result: any;
  ExstAgrmnt: any;
  AppRjct: any;
  AppPrcs: any;

  ngOnInit() {
    // this.http.post(URLConstant.GetCustDataByAppId, { Id: this.AppId }).subscribe(
    //   (response) => {
    //     this.CustNo = response["AppCustObj"]["CustNo"];
    //     if (this.CustNo != null && this.CustNo != undefined && this.CustNo != "") {
    //       this.http.post(URLConstant.GetAppById, { Id: this.AppId }).subscribe(
    //         (response: AppObj) => {
    //           this.http.post(URLConstant.GetAppByCustNoAndIsAppInitDone, { CustNo: this.CustNo, IsAppInitDone: response.IsAppInitDone }).subscribe(
    //             (response) => {
    //               this.AppPrcs = response;
    //             });
    //         },
    //         (error) => {
    //           console.log(error);
    //         }
    //       );
    //       this.http.post(URLConstant.GetAgrmntByCustNo, { CustNo: this.CustNo }).subscribe(
    //         (response) => {
    //           this.ExstAgrmnt = response;
    //         });
    //       this.http.post(URLConstant.GetAppByCustNoAndAppStat, { CustNo: this.CustNo, AppStat: "REJECT" }).subscribe(
    //         (response) => {
    //           this.AppRjct = response;
    //         });
    //     }
    //   });
  }
}
