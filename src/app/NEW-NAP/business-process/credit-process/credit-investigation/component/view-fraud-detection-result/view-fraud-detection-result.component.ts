import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { FraudDukcapilObj } from 'app/shared/model/FraudDukcapilObj.Model';
import { NegativeCustObj } from 'app/shared/model/NegativeCust.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { NegativeAssetCheckForMultiAssetObj } from 'app/shared/model/NegativeAssetCheckForMultiAssetObj.Model';
import { NegativeAssetCheckObj } from 'app/shared/model/NegativeAssetCheckObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { NegativeAssetObj } from 'app/shared/model/NegativeAssetObj.Model';
import { ResDuplicateCustomerObj } from 'app/shared/model/Lead/ResDuplicateCustomerObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-fraud-detection-result',
  templateUrl: './view-fraud-detection-result.component.html'
})

export class ViewFraudDetectionResultComponent implements OnInit {

  @Input() appId: number;
  @Input() mrCustTypeCode: string = "";
  @Input() isView: boolean = false;

  viewDukcapilMainDataObj: string;
  losUrl = environment.losUrl;
  foundationUrl = environment.FoundationR3Url;
  getAppById = URLConstant.GetAppById;
  getCustDataByAppId = URLConstant.GetCustDataByAppId;
  getAppDupCheckCustByAppId = URLConstant.GetCustomerDuplicateCheck;
  getFraudDukcapilByIdNo = URLConstant.GetFraudDukcapilByIdNo;
  getNegativeCustomerDuplicateCheckUrl = URLConstant.GetNegativeCustomerDuplicateCheck;
  getAppAssetByAppId = URLConstant.GetAppAssetByAppId;
  getAssetNegativeDuplicateCheck = URLConstant.GetAssetNegativeDuplicateCheck;
  viewFraudVerifResultObj: any;

  arrValue = [];
  isDataAlreadyLoaded: boolean = false;
  closeResult: string;
  appObj: AppObj;
  appCustObj: AppCustObj;
  appCustCompanyObj: any;
  appCustPersonalObj: any;
  idNo: any;
  listNegativeCust: Array<NegativeCustObj> = new Array<NegativeCustObj>();
  RowVersion: any;
  appAssetObj: any;
  listNegativeAsset: Array<NegativeAssetObj> = new Array<NegativeAssetObj>();
  listNegativeAppAsset: Array<NegativeAssetObj> = new Array<NegativeAssetObj>();
  listNegativeAppCollateral: Array<NegativeAssetObj> = new Array<NegativeAssetObj>();
  dukcapilObj: any;
  viewDukcapilObj: string;
  listCustDuplicate: Array<ResDuplicateCustomerObj> = new Array<ResDuplicateCustomerObj>();
  trxRefNo: string;
  mrSrvySourceCode: string;
  requestDupCheck: any;
  custStat: string;

  constructor(private http: HttpClient,
    private modalService: NgbModal) { }

  async ngOnInit() : Promise<void>{

    this.getApp(this.appId);
    await this.getAppCust();
    this.arrValue.push(this.appId);
    this.viewDukcapilObj = "./assets/ucviewgeneric/viewDukcapilMainInfo.json";
    this.viewFraudVerifResultObj = "./assets/ucviewgeneric/viewFraudVerifResult.json";
  }

  async getAppCust() {
    this.appCustObj = new AppCustObj();
    this.appCustPersonalObj = new AppCustPersonalObj();
    this.appCustCompanyObj = new AppCustCompanyObj();
    this.dukcapilObj = new FraudDukcapilObj();
    var appReqObj = { "AppId": this.appId }
    this.http.post(this.getCustDataByAppId, appReqObj).subscribe(
      response => {
        this.appCustObj = response["AppCustObj"];
        this.appCustCompanyObj = response["AppCustCompanyObj"];
        this.appCustPersonalObj = response["AppCustPersonalObj"];
        this.idNo = this.appCustObj.IdNo;
        var fraudDukcapilReqObj = { "IdNo": this.idNo };
        this.getFraudDukcapil(fraudDukcapilReqObj);

        if (this.appCustObj.MrCustTypeCode == CommonConstant.CustTypePersonal) {
          this.requestDupCheck = {
            "CustName": this.appCustObj.CustName,
            "MrCustTypeCode": this.appCustObj.MrCustTypeCode,
            "MrCustModelCode": this.appCustObj.CustModelCode,
            "MrIdTypeCode": this.appCustObj.MrIdTypeCode,
            "IdNo": this.appCustObj.IdNo,
            "TaxIdNo": this.appCustObj.TaxIdNo,
            "BirthDt": this.appCustPersonalObj.BirthDt,
            "MotherMaidenName": this.appCustPersonalObj.MotherMaidenName,
            "MobilePhnNo1": this.appCustPersonalObj.MobilePhnNo1,
            "RowVersion": this.RowVersion
          };
        } else if (this.appCustObj.MrCustTypeCode == CommonConstant.CustTypeCompany) {
          this.requestDupCheck = {
            "CustName": this.appCustObj.CustName,
            "MrCustTypeCode": this.appCustObj.MrCustTypeCode,
            "MrCustModelCode": this.appCustObj.CustModelCode,
            "MrIdTypeCode": this.appCustObj.MrIdTypeCode,
            "IdNo": this.appCustObj.IdNo,
            "TaxIdNo": this.appCustObj.TaxIdNo,
            "BirthDt": this.appCustCompanyObj.EstablishmentDt,
            "MotherMaidenName": "-",
            "MobilePhnNo1": "-",
            "RowVersion": this.RowVersion
          };
        }
        this.getNegativeCustomer(this.requestDupCheck);
        if(this.appCustObj.IsExistingCust == false){
          this.getAppDupCheckCust(this.requestDupCheck);
        }
      },
      () => {
        console.log("error")
      }
    );

     await this.getAssetNegative(appReqObj);
  }

  getApp(appId : number){
    var appReqObj = { "AppId": appId };
    this.http.post<AppObj>(this.getAppById, appReqObj).subscribe(
      response => {
        this.appObj = response;
        this.trxRefNo = this.appObj.AppNo;
        this.mrSrvySourceCode = "APP";
        this.isDataAlreadyLoaded = true;
      },
      error => {
        console.log("error")
      }

    );
  }

  getNegativeCustomer(reqObj) {
    //List Negative Cust Duplicate Checking
    this.http.post(this.getNegativeCustomerDuplicateCheckUrl, reqObj).subscribe(
      (response) => {
        console.log(response);
        this.listNegativeCust = response['ReturnObject'].NegativeCustDuplicate;
        console.log(this.listNegativeCust);
        var idxSelected=this.listNegativeCust.findIndex(x=>x.CustNo==this.appCustObj.CustNo);
        if(idxSelected > -1)
          this.listNegativeCust[idxSelected].IsSelected=true;

      },
      () => {
        console.log("error");
      }
    );
  }

  getFraudDukcapil(reqObj) {
    this.http.post(this.getFraudDukcapilByIdNo, reqObj).subscribe(
      (response) => {
        if(response["StatusCode"]==200)
          this.dukcapilObj = response["ReturnObject"];
      },
      () => {
        console.log("error")
      }
    );
  }

  getAppDupCheckCust(appId) {
    this.http.post(this.getAppDupCheckCustByAppId, appId).subscribe(
      (response) => {
        this.listCustDuplicate = response['ReturnObject']["CustDuplicate"];
        var idxSelected = this.listCustDuplicate.findIndex(x => x.CustNo == this.appCustObj.CustNo);
        if (idxSelected < 0) {
          this.custStat = CommonConstant.CustStatExisting;
        } else {
          this.custStat = CommonConstant.CustStatNew;
          this.listCustDuplicate[idxSelected].IsSelected = true;
        }

      },
      () => {
        console.log("error")
      }
    );
  }

  async getAssetNegative(reqObj) {
    await this.http.post<AppAssetObj>(this.getAppAssetByAppId, reqObj).toPromise().then(
      response => {
        this.appAssetObj = response;

      },
      error => {
        console.log("error")
      }
    );

    if(this.appAssetObj.AppAssetId != 0){
      await this.getNegativeAsset();
    }

    await this.getNegativeCollateral();
    this.listNegativeAsset = this.listNegativeAppAsset.concat(this.listNegativeAppCollateral);
  }

  async getNegativeCollateral() {
    var appCollateralObj = new AppCollateralObj();
    var negativeAssetCheckForMultiAssetObj = new NegativeAssetCheckForMultiAssetObj();
    negativeAssetCheckForMultiAssetObj.RequestObj = new Array<NegativeAssetCheckObj>();
    appCollateralObj.AppId = this.appId;
    var listAppCollateral = new Array<AppCollateralObj>();
    await this.http.post(URLConstant.GetListAdditionalCollateralByAppId, appCollateralObj).toPromise().then(
      response => {
        listAppCollateral = response["ReturnObject"];
        
      },
      error => {
        console.log("error")
      }
    );
    
    if(listAppCollateral != null){
      for (var i = 0; i < listAppCollateral.length; i++) {
        var negativeAssetCheckObj = new NegativeAssetCheckObj();
        negativeAssetCheckObj.AssetTypeCode = listAppCollateral[i].AssetTypeCode;
        negativeAssetCheckObj.SerialNo1 = listAppCollateral[i].SerialNo1;
        negativeAssetCheckObj.SerialNo2 = listAppCollateral[i].SerialNo2;
        negativeAssetCheckObj.SerialNo3 = listAppCollateral[i].SerialNo3;
        negativeAssetCheckObj.SerialNo4 = listAppCollateral[i].SerialNo4;
        negativeAssetCheckObj.SerialNo5 = listAppCollateral[i].SerialNo5;
        negativeAssetCheckForMultiAssetObj.RequestObj[i] = negativeAssetCheckObj;
      }
      await this.http.post(URLConstant.GetAssetNegativeDuplicateCheckByListOfAsset, negativeAssetCheckForMultiAssetObj).toPromise().then(
        response => {
          this.listNegativeAppCollateral = response["ReturnObject"];
        });
    } 
  }


  async getNegativeAsset() {
    var negativeAssetObj = {
      AssetCategoryCode: this.appAssetObj.AssetCategoryCode,
      AssetTypeCode: this.appAssetObj.AssetTypeCode,
      FullAssetCode: this.appAssetObj.FullAssetCode,
      SerialNo1: this.appAssetObj.SerialNo1,
      SerialNo2: this.appAssetObj.SerialNo2,
      SerialNo3: this.appAssetObj.SerialNo3,
      SerialNo4: this.appAssetObj.SerialNo4,
      SerialNo5: this.appAssetObj.SerialNo5,
    }
    await this.http.post(this.getAssetNegativeDuplicateCheck, negativeAssetObj).toPromise().then(
      response => {
        this.listNegativeAppAsset = response["ReturnObject"];
      },
      error => {
        console.log("error")
      }
    );
  }

  open(content) {
    //this.type = "Add";
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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


