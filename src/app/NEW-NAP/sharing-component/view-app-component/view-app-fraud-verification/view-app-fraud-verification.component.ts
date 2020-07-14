import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { NegativeAssetCheckForMultiAssetObj } from 'app/shared/model/NegativeAssetCheckForMultiAssetObj.Model';
import { NegativeAssetCheckObj } from 'app/shared/model/NegativeAssetCheckObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-app-fraud-verification',
  templateUrl: './view-app-fraud-verification.component.html',
  styles: []
})
export class ViewAppFraudVerificationComponent implements OnInit {
  @Input() AppId: number;
  @Input() mrCustTypeCode: string = "";
  appData: any;
  appCustData: any;
  srvyOrderData: any;
  fraudVerfData: any;
  dupCustList: Array<any>;
  negCustList: Array<any>;
  appAssetList: Array<any>;
  negAssetList: Array<any>;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  arrValue = [];

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.arrValue.push(this.AppId);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewDukcapilMainInfo.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.whereValue = this.arrValue;

    this.httpClient.post(URLConstant.GetAppById, { AppId: this.AppId }).pipe(
      map((response) => {
        this.appData = response;
        return response;
      }),
      mergeMap((response) => {
        return this.httpClient.post(URLConstant.GetSrvyOrderBySrvyOrderNo, { SrvyOrderNo: response["SrvyOrderNo"] });
      }),
      mergeMap((response) => {
        this.srvyOrderData = response;
        let getAppCust = this.httpClient.post(URLConstant.GetAppCustByAppId, { AppId: this.AppId });
        let getDupCust = this.httpClient.post(URLConstant.GetAppDupCheckCustByAppId, { AppId: this.AppId });
        let getNegCust = this.httpClient.post(URLConstant.GetListAppNegativeCheckCustByAppId, { AppId: this.AppId });
        let getAppAsset = this.httpClient.post(URLConstant.GetAppAssetListByAppId, { AppId: this.AppId });
        let getFraudVerf = this.httpClient.post(URLConstant.GetAppFraudVerificationByAppId, { AppId: this.AppId });
        return forkJoin([getAppCust, getDupCust, getNegCust, getAppAsset, getFraudVerf]);
      }),
      mergeMap((response) => {
        this.appCustData = response[0];
        this.dupCustList = response[1][CommonConstant.ReturnObj];
        this.negCustList = response[2]["appNegativeCheckCusts"];
        this.appAssetList = response[3][CommonConstant.ReturnObj];
        this.fraudVerfData = response[4];
        var reqNegAsset = new NegativeAssetCheckForMultiAssetObj();
        var negAssetList = new Array<NegativeAssetCheckObj>();
        for (const item of this.appAssetList) {
          var negAssetObj = new NegativeAssetCheckObj(); 
          negAssetObj.AssetTypeCode = item.AssetTypeCode; 
          negAssetObj.SerialNo1 = item.SerialNo1;
          negAssetObj.SerialNo2 = item.SerialNo2;
          negAssetObj.SerialNo3 = item.SerialNo3;
          negAssetObj.SerialNo4 = item.SerialNo4;
          negAssetObj.SerialNo5 = item.SerialNo5;
          negAssetList.push(negAssetObj); 
        } 
        reqNegAsset.RequestObj = negAssetList;  
        return this.httpClient.post(URLConstant.GetAssetNegativeDuplicateCheckByListOfAsset, reqNegAsset);
      })
    ).subscribe(
      (response) => {
        this.negAssetList = response[CommonConstant.ReturnObj];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showDukcapilDetail(content) {
    this.modalService.open(content).result.then((result) => {}, (reason) => {});
  }
}
