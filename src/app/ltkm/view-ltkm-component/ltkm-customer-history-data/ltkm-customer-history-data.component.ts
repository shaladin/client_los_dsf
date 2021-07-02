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
    selector: 'view-ltkm-cust-history',
    templateUrl: './ltkm-customer-history-data.component.html',
    styleUrls: []
})
export class ViewLtkmCustHistoryDataComponent implements OnInit {
    @Input() LtkmCustId: number = 0;
    constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) { }

    CustNo: string;
    ListExstAgrmnt: Array<any> = new Array();
    ListAppRjct: Array<any> = new Array();
    ListAppPrcs: Array<any> = new Array();

    ngOnInit() {
        this.http.post(URLConstant.getLtkmReqByLtkmCustId, { Id: this.LtkmCustId }).subscribe(
            (response) => {
                this.CustNo = response["ReturnObject"]["CustNo"];
                if (response["ReturnObject"]["LtkmSrc"] == 'APP')
                    if (response["ReturnObject"]["AppId"] != 0) {
                        this.http.post(URLConstant.GetAppById, { Id: response["ReturnObject"]["AppId"] }).subscribe(
                            (response: AppObj) => {
                                this.GetListLtkmAppPrcsByCustNoAndIsAppInitDone(this.CustNo, response.IsAppInitDone);
                            },
                            (error) => {
                                console.log(error);
                            }
                        );
                    } else {
                        this.GetListLtkmAppPrcsByCustNoAndIsAppInitDone(this.CustNo, false);
                    }
                this.GetLtkmExistAgrmntByCustNoAndIsAppInitDone();
                this.GetLtkmAppRjcByCustNoAndAppStat();
            });
    }

    GetListLtkmAppPrcsByCustNoAndIsAppInitDone(custNo: string, isAppInitDone: boolean) {
        this.http.post(URLConstant.GetListLtkmAppPrcsByCustNoAndIsAppInitDone, { CustNo: custNo, IsAppInitDone: isAppInitDone }).subscribe(
            (response: GenericListObj) => {
                this.ListAppPrcs = response.ReturnObject;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    GetLtkmAppRjcByCustNoAndAppStat() {
        this.http.post(URLConstant.GetLtkmAppRjcByCustNoAndAppStat, { CustNo: this.CustNo, AppStat: CommonConstant.Reject }).subscribe(
            (response: GenericListObj) => {
                this.ListAppRjct = response.ReturnObject;
            });
    }
    GetLtkmExistAgrmntByCustNoAndIsAppInitDone() {
        this.http.post(URLConstant.GetLtkmExistAgrmntByCustNoAndIsAppInitDone, { CustNo: this.CustNo }).subscribe(
            (response: GenericListObj) => {
                this.ListExstAgrmnt = response.ReturnObject;
            });
    }
}
