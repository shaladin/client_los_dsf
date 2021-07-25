import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';

@Component({
    selector: 'app-cust-history',
    templateUrl: './cust-history.component.html',
    styleUrls: []
})
export class CustHistoryComponent implements OnInit {


    @Input() AppId: number = 0;
    constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
        this.route.queryParams.subscribe(params => {
            this.AppId = params["AppId"];
        })
    }

    CustNo: string = "";
    ExstAgrmnt: Array<any> = new Array();
    AppRjct: Array<any> = new Array();
    AppPrcs: Array<any> = new Array();

    ngOnInit() {
        this.http.post(URLConstant.GetCustDataByAppId, { Id: this.AppId }).subscribe(
            (response) => {
                this.CustNo = response["AppCustObj"]["CustNo"];
                if (this.CustNo != null && this.CustNo != undefined && this.CustNo != "") {
                    this.http.post(URLConstant.GetAppById, { AppId: this.AppId }).subscribe(
                        (response: AppObj) => {
                            this.http.post(URLConstant.GetListLtkmAppPrcsByCustNoAndIsAppInitDone, { CustNo: this.CustNo, IsAppInitDone: response.IsAppInitDone }).subscribe(
                                (response: GenericListObj) => {
                                    this.AppPrcs = response.ReturnObject;
                                });
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                    this.http.post(URLConstant.GetLtkmExistAgrmntByCustNoAndIsAppInitDone, { CustNo: this.CustNo }).subscribe(
                        (response: GenericListObj) => {
                            this.ExstAgrmnt = response.ReturnObject;
                        });
                    this.http.post(URLConstant.GetLtkmAppRjcByCustNoAndAppStat, { CustNo: this.CustNo, AppStat: CommonConstant.Reject }).subscribe(
                        (response: GenericListObj) => {
                            this.AppRjct = response.ReturnObject;
                        });
                }
            });
    }

}
