import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NegativeAssetCheckForMultiAssetObj } from 'app/shared/model/NegativeAssetCheckForMultiAssetObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { NegativeAssetCheckObj } from 'app/shared/model/NegativeAssetCheckObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { FraudDukcapilObj } from 'app/shared/model/FraudDukcapilObj.Model';
import { environment } from 'environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fraud-verification-multi-asset',
  templateUrl: './fraud-verification-multi-asset.component.html'
})
export class FraudVerificationMultiAssetComponent implements OnInit {
  appAssetObj: any;
  getAppAssetListByAppIdUrl: string;
  getAssetNegativeDuplicateCheckByListOfAssetUrl: string;
  AppId: number;
  WfTaskListId: number;
  listAssetData: any;
  negativeAssetCheckForMultiAssetObj: any;
  negativeAssetCheckObj: any;
  listAssetNegative: any;
  mrCustTypeCode: string;
  verfUser: any;
  verfDt: any;
  verfNotes: any;
  verfCode: any;
  viewObj: string;
  arrValue = [];
  viewDukcapilMainDataObj: string;
  losUrl = environment.losUrl;
  foundationUrl = environment.FoundationR3Url;
  getAppById = AdInsConstant.GetAppById;
  getCustDataByAppId = AdInsConstant.GetCustDataByAppId;
  getAppDupCheckCustByAppId = AdInsConstant.GetAppDupCheckCustByAppId;
  getNegativeCustomerDuplicateCheckUrl = AdInsConstant.GetNegativeCustomerDuplicateCheck;
  getFraudDukcapilByIdNo = AdInsConstant.GetFraudDukcapilByIdNo;
  getAppAssetByAppId = AdInsConstant.GetAppAssetByAppId;
  getAssetNegativeDuplicateCheck = AdInsConstant.GetAssetNegativeDuplicateCheck;
  addAppFraudVerfUrl = AdInsConstant.AddAppFraudVerf;
  isDataAlreadyLoaded: boolean = false;
  closeResult: string;
  appCustObj: any;
  appCustCompanyObj: any;
  appCustPersonalObj: any;
  TrxNo: any;
  listNegativeCust: any;
  RowVersion: any;
  listNegativeAsset: any;
  dukcapilObj: any;
  viewDukcapilObj: string;
  listCustDuplicate: any;
  trxRefNo: string;
  mrSrvySourceCode: string;
  requestDupCheck: any;
  custStat: string;
  tempAppObj: any;
  appFraudVerf: any;
  idNo: any;
  bizTemplateCode: any;

  constructor(private http: HttpClient, private route: ActivatedRoute, private modalService: NgbModal, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.AppId = params['AppId'];
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
    });
    this.getAppAssetListByAppIdUrl = AdInsConstant.GetAppAssetListByAppId;
    this.getAssetNegativeDuplicateCheckByListOfAssetUrl = AdInsConstant.GetAssetNegativeDuplicateCheckByListOfAsset;
  }

  async ngOnInit(): Promise<void> {
    await this.ClaimTask();
    this.arrValue.push(this.AppId);
    this.viewObj = "./assets/ucviewgeneric/viewFraudVerifMultiAssetMainInfo.json";
    var context = JSON.parse(localStorage.getItem("UserAccess"));
    this.verfUser = context["UserName"];
    this.verfDt = context["BusinessDt"];
    this.verfCode = context["EmpNo"];
    await this.getApp();
    await this.getAppAsset();
    this.viewDukcapilObj = "./assets/ucviewgeneric/viewDukcapilMainInfoFL4W.json";
    this.isDataAlreadyLoaded = true;
    this.bizTemplateCode = AdInsConstant.FL4W;
  }

  async ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext["UserName"], isLoading: false };
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }

  getApp() {
    this.appCustObj = new AppCustObj();
    this.appCustPersonalObj = new AppCustPersonalObj();
    this.appCustCompanyObj = new AppCustCompanyObj();
    this.dukcapilObj = new FraudDukcapilObj();
    var appReqObj = { "AppId": this.AppId }
    this.http.post(this.getCustDataByAppId, appReqObj).subscribe(
      response => {
        this.appCustObj = response["AppCustObj"];
        this.mrCustTypeCode = this.appCustObj["MrCustTypeCode"];
        this.appCustCompanyObj = response["AppCustCompanyObj"];
        this.appCustPersonalObj = response["AppCustPersonalObj"];
        this.TrxNo = this.appCustObj.AppNo;
        this.trxRefNo = this.appCustObj.AppNo;
        this.idNo = this.appCustObj.IdNo;
        this.mrSrvySourceCode = "MOU";
        this.getFraudDukcapil();

        if (this.mrCustTypeCode == "PERSONAL") {
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
        } else if (this.mrCustTypeCode == "COMPANY") {
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
      },
      error => {
        console.log("error")
      }
    );

    this.getAppAsset();
    this.getAppDupCheckCust(appReqObj);
  }

  getNegativeCustomer(reqObj) {
    //List Negative Cust Duplicate Checking
    this.http.post(this.getNegativeCustomerDuplicateCheckUrl, this.requestDupCheck).subscribe(
      response => {
        this.listNegativeCust = response['ReturnObject'].NegativeCustDuplicate;
      },
      error => {
        console.log("error");
      }
    );
  }

  getFraudDukcapil() {
        var fraudDukcapilReqObj = { "IdNo": this.idNo };
        this.http.post(this.getFraudDukcapilByIdNo, fraudDukcapilReqObj).subscribe(
          response => {
            this.dukcapilObj = response["ReturnObject"];
            console.log(fraudDukcapilReqObj);
          },
          error => {
            console.log("error")
          }
        );
  }

  getAppDupCheckCust(AppId) {
    this.http.post(this.getAppDupCheckCustByAppId, AppId).subscribe(
      response => {
        this.listCustDuplicate = response["ReturnObject"];
        if (this.listCustDuplicate.indexOf(this.appCustObj.CustNo) < 0) {
          this.custStat = "EXISTING"
        } else {
          this.custStat = "NEW"
        }
      },
      error => {
        console.log("error")
      }
    );
  }

  getAppAsset() {
    this.appAssetObj = new AppAssetObj();
    this.negativeAssetCheckForMultiAssetObj = new NegativeAssetCheckForMultiAssetObj();
    this.negativeAssetCheckForMultiAssetObj.RequestObj = new Array<NegativeAssetCheckObj>();
    this.appAssetObj.AppId = this.AppId;
    this.http.post(this.getAppAssetListByAppIdUrl, this.appAssetObj).subscribe(
      response => {
        console.log(response);
        this.listAssetData = response["ReturnObject"];

        for (var i = 0; i < this.listAssetData.length; i++) {
          this.negativeAssetCheckObj = new NegativeAssetCheckObj();
          this.negativeAssetCheckObj.AssetTypeCode = this.listAssetData[i].AssetTypeCode;
          this.negativeAssetCheckObj.SerialNo1 = this.listAssetData[i].SerialNo1;
          this.negativeAssetCheckObj.SerialNo2 = this.listAssetData[i].SerialNo2;
          this.negativeAssetCheckObj.SerialNo3 = this.listAssetData[i].SerialNo3;
          this.negativeAssetCheckObj.SerialNo4 = this.listAssetData[i].SerialNo4;
          this.negativeAssetCheckObj.SerialNo5 = this.listAssetData[i].SerialNo5;
          this.negativeAssetCheckForMultiAssetObj.RequestObj[i] = this.negativeAssetCheckObj;
          console.log(this.negativeAssetCheckForMultiAssetObj);
        }
        this.http.post(this.getAssetNegativeDuplicateCheckByListOfAssetUrl, this.negativeAssetCheckForMultiAssetObj).subscribe(
          response => {
            console.log(this.negativeAssetCheckForMultiAssetObj);
            this.listAssetNegative = response["ReturnObject"];
          });
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
  submit() {
    var verfObj = {
      "AppId": this.AppId, "VerifyByName": this.verfUser,
      "VerifyDt": this.verfDt, "Notes": this.verfNotes, "VerifyByCode": this.verfCode, "VerifyStat": "Verified", "WfTaskId": this.WfTaskListId
    }
    this.http.post(this.addAppFraudVerfUrl, verfObj).subscribe(
      response => {
        console.log("Success");
        this.router.navigate(["Nap/CreditProcess/FraudDetection/Paging"]);
      },
      error => {
        console.log("error");
      }
    )
  }
}
