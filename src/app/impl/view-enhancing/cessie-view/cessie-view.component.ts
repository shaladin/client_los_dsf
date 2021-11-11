import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTabChangeEvent } from '@angular/material';
import { CookieService } from 'ngx-cookie';
import { AppObj } from 'app/shared/model/App/App.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';

@Component({
    selector: 'app-cessie-view',
    templateUrl: './cessie-view.component.html'
})
export class CessieViewComponent implements OnInit {
    CessieHXId: number;
    AppObj: AppObj;
    viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
    mrCustTypeCode: string;
    IsReady: boolean = false;
    appId: number;
    constructor(private route: ActivatedRoute,
        private http: HttpClient,
        private cookieService: CookieService) {
        this.route.queryParams.subscribe(params => {
            if (params["CessieHXId"] != null) {
                this.CessieHXId = params["CessieHXId"]
            }
        })
    }


    async ngOnInit(): Promise<void> {
        this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCessieMainInfoPreGoLive.json";
        this.viewGenericObj.whereValue = [this.CessieHXId];
        var Obj = { Id: this.CessieHXId };
        this.http.post(URLConstantX.GetListApp, Obj).subscribe(
            async (response) => {
                this.AppObj = response[CommonConstant.ReturnObj][0];
                this.appId = this.AppObj.AppId;
                await this.GetAppCust();
            });

    }


    async GetAppCust() {
        await this.http.post<AppCustObj>(URLConstant.GetAppCustByAppId, { Id: this.appId }).toPromise().then(
            (response) => {
                this.mrCustTypeCode = response.MrCustTypeCode;
                this.IsReady = true;
            }
        )
    }

    tabChangeEvent(tabChangeEvent: MatTabChangeEvent) {
        if (tabChangeEvent.index == 0) {
        }
        // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AppMainInfoComponent);
        // this.mainInfoContainer.clear();
        // const component = this.mainInfoContainer.createComponent(componentFactory);
        // component.instance.arrValue = this.arrValue;
    }

    GetCallBack(ev: any) {
        if (ev.Key == "ViewProdOffering") {
          AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
        }
        else if (ev.Key == "customer") {
          var custObj = {
            CustNo: ev.ViewObj.CustNo
          };
          this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
            (response) => {
              if(response['MrCustTypeCode'] == CommonConstant.CustTypePersonal) {
                AdInsHelper.OpenCustomerViewByCustId(response['CustId']);
              } else if(response['MrCustTypeCode'] == CommonConstant.CustTypeCompany) {
                AdInsHelper.OpenCustomerCoyViewByCustId(response['CustId']);
              }
            }
          )
        }
        else if (ev.Key == "mou") {
          AdInsHelper.OpenMOUCustViewByMouCustId(ev.ViewObj.MouCustId);
        }
      }
}
