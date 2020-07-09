import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { FraudDukcapilObj } from 'app/shared/model/FraudDukcapilObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppDupCheckObj } from 'app/shared/model/AppDupCheckCust/AppDupCheckObj.Model';
import { NegativeCustObj } from 'app/shared/model/NegativeCust.Model';
import { NegativeAssetCheckForMultiAssetObj } from 'app/shared/model/NegativeAssetCheckForMultiAssetObj.Model';
import { NegativeAssetCheckObj } from 'app/shared/model/NegativeAssetCheckObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { NegativeAssetObj } from 'app/shared/model/NegativeAssetObj.Model';
import { ResDuplicateCustomerObj } from 'app/shared/model/Lead/ResDuplicateCustomerObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';


@Component({
  selector: 'app-fraud-detection-verif',
  templateUrl: './fraud-detection-verif.component.html',
  styleUrls: []
})
export class FraudDetectionVerifComponent implements OnInit {

  losUrl = environment.losUrl;
  foundationUrl = environment.FoundationR3Url;
  getAppById = URLConstant.GetAppById;
  getCustDataByAppId = AdInsConstant.GetCustDataByAppId;
  getAppDupCheckCustByAppId = AdInsConstant.GetCustomerDuplicateCheck;
  getFraudDukcapilByIdNo = AdInsConstant.GetFraudDukcapilByIdNo;
  addAppFraudVerf = AdInsConstant.AddAppFraudVerf;
  getLeadByLeadId = AdInsConstant.GetLeadByLeadId;
  getAppAssetByAppId = AdInsConstant.GetAppAssetByAppId;
  getAssetNegativeDuplicateCheck = AdInsConstant.GetAssetNegativeDuplicateCheck;
  bussinessDt: any;
  appId: any;
  appCustObj: AppCustObj = new AppCustObj();
  appCustCompanyObj: any;
  appAssetObj: AppAssetObj;
  leadObj: any;
  appObj: AppObj;
  leadId: any;
  dukcapilObj: any;
  ListAssetNegative: Array<NegativeAssetObj> = new Array<NegativeAssetObj>();
  ListAssetNegativeAsset: Array<NegativeAssetObj> = new Array<NegativeAssetObj>();
  ListAssetNegativeCollateral: Array<NegativeAssetObj> = new Array<NegativeAssetObj>();
  listCustDuplicate: Array<ResDuplicateCustomerObj> = new Array<ResDuplicateCustomerObj>();
  closeResult: string;
  idNo: any;
  verfUser: any;
  verfDt: any;
  verfNotes: any;
  verfCode: any;
  appCustPersonalObj: any;
  RowVersion: any;
  GetNegativeCustomerDuplicateCheckUrl = AdInsConstant.GetNegativeCustomerDuplicateCheck;
  ListNegativeCust: Array<NegativeCustObj> = new Array<NegativeCustObj>();
  viewObj: string;
  arrValue = [];

  respAppDupCheck : any;
  respNegativeCust : any;
  respAssetNegative : any;

  WfTaskListId : number;
  custStat: string;


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
        
      }
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params["WfTaskListId"]
      }
    });
  }

  async ngOnInit() : Promise<void> {
    if (this.WfTaskListId != null || this.WfTaskListId != undefined)
      this.claimTask();

    this.arrValue.push(this.appId);
    this.viewObj = "./assets/ucviewgeneric/viewCreditInvestigationInfo.json";
    var context = JSON.parse(localStorage.getItem("UserAccess"));
    this.verfUser = context["UserName"];
    this.verfDt = context["BusinessDt"];
    this.verfCode = context["EmpNo"];
    await this.getApp();

  }

  async getApp() {

    //Get App Cust Data
    this.appCustObj = new AppCustObj();
    this.appCustPersonalObj = new AppCustPersonalObj();
    this.appCustCompanyObj = new AppCustCompanyObj();
    this.appAssetObj = new AppAssetObj();
    this.appObj = new AppObj();
    this.dukcapilObj = new FraudDukcapilObj();
    this.leadObj = new LeadObj();

    var appReqObj = { "AppId": this.appId };
    this.http.post<AppObj>(this.getAppById, appReqObj).subscribe(
      response => {
        this.appObj = response;
        console.log(this.appObj);
        this.leadId = this.appObj.LeadId;
        if (this.leadId != null) {
          var leadReqObj = { "LeadId": this.leadId }
          this.getLead(leadReqObj);
        }
      },
      error => {
        console.log("error")
      }

    );
    this.http.post(this.getCustDataByAppId, appReqObj).subscribe(
      response => {
        this.appCustObj = response["AppCustObj"];
        this.appCustCompanyObj = response["AppCustCompanyObj"];
        this.appCustPersonalObj = response["AppCustPersonalObj"];
        this.idNo = this.appCustObj.IdNo;

        console.log("appCustObj")
        console.log(this.appCustObj)
        console.log(this.appCustCompanyObj)

        var fraudDukcapilReqObj = { "IdNo": this.idNo };

        this.getFraudDukcapil(fraudDukcapilReqObj);

        var requestDupCheck;
        if (this.appCustObj.MrCustTypeCode == CommonConstant.CustTypePersonal) {
          var requestDupCheckPersonal = {
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
          }
          requestDupCheck = requestDupCheckPersonal;
        } else {
          var requestDupCheckCompany = {
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
          }
          requestDupCheck = requestDupCheckCompany;
        }

        if(this.appCustObj.IsExistingCust == false){
          this.getAppDupCheckCust(requestDupCheck);
        }

        //List Negative Cust Duplicate Checking
        this.http.post(this.GetNegativeCustomerDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.respNegativeCust = response;
            this.ListNegativeCust = response['ReturnObject'].NegativeCustDuplicate;
            var idxSelected = this.ListNegativeCust.findIndex(x => x.CustNo == this.appCustObj.CustNo);
            if(idxSelected > -1){
              this.ListNegativeCust[idxSelected].IsSelected = true;
            }
          },
          error => {
            console.log("error");
          }
        );
      },
      error => {
        console.log("error")
      }
    );
    
    await this.getAssetNegative(appReqObj);
  }



  getLead(leadId) {
    this.http.post<LeadObj>(this.getLeadByLeadId, leadId).subscribe(
      response => {
        this.leadObj = response;
      },
      error => {
        console.log("error")
      }
    );

  }

  getAppDupCheckCust(appId) {
    this.http.post(this.getAppDupCheckCustByAppId, appId).subscribe(
      response => {
        this.respAppDupCheck = response;
        this.listCustDuplicate = response["ReturnObject"]["CustDuplicate"];

        var idxSelected = this.listCustDuplicate.findIndex(x => x.CustNo == this.appCustObj.CustNo);
        if(idxSelected > -1){
          this.listCustDuplicate[idxSelected].IsSelected = true;
          this.custStat = CommonConstant.CustStatNew;
        }else{
          this.custStat = CommonConstant.CustStatExisting;
        }
      },
      error => {
        console.log("error")
      }
    );
  }

  async getAssetNegative(appId) {
    await this.http.post<AppAssetObj>(this.getAppAssetByAppId, appId).toPromise().then(
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
    this.ListAssetNegative = this.ListAssetNegativeAsset.concat(this.ListAssetNegativeCollateral);
  }

  async getNegativeCollateral() {
    var appCollateralObj = new AppCollateralObj();
    var negativeAssetCheckForMultiAssetObj = new NegativeAssetCheckForMultiAssetObj();
    negativeAssetCheckForMultiAssetObj.RequestObj = new Array<NegativeAssetCheckObj>();
    appCollateralObj.AppId = this.appId;
    var listAppCollateral = new Array<AppCollateralObj>();
    await this.http.post(AdInsConstant.GetListAdditionalCollateralByAppId, appCollateralObj).toPromise().then(
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
      await this.http.post(AdInsConstant.GetAssetNegativeDuplicateCheckByListOfAsset, negativeAssetCheckForMultiAssetObj).toPromise().then(
        response => {
          this.ListAssetNegativeCollateral = response["ReturnObject"];
        });
    } 
  }

  getFraudDukcapil(idNo) {
    this.http.post(this.getFraudDukcapilByIdNo, idNo).subscribe(
      response => {
        this.dukcapilObj = response;
      },
      error => {
        console.log("error")
      }
    );
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
        this.respAssetNegative = response;
        this.ListAssetNegativeAsset = response["ReturnObject"];
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

  cancel(){
    var lobCode = localStorage.getItem("BizTemplateCode")
    this.router.navigate(["/Nap/CreditProcess/FraudDetection/Paging"], { queryParams: { BizTemplateCode: lobCode } });
  }

  submit() {
    var verfObj = {
      "AppId": this.appId, 
      "VerifyByName": this.verfUser,
      "VerifyDt": this.verfDt, 
      "Notes": this.verfNotes, 
      "VerifyByCode": this.verfCode, 
      "VerifyStat": "Verified",
      "WFTaskId" : this.WfTaskListId
    }
    this.http.post(this.addAppFraudVerf, verfObj).subscribe(
      response => {
        var BizTemplateCode = localStorage.getItem("BizTemplateCode")
        this.router.navigate(["/Nap/CreditProcess/FraudDetection/Paging"], { queryParams: { "BizTemplateCode": BizTemplateCode } });
      },
      error => {
        console.log("error");
      }
    )
  }

  async claimTask()
  {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { 
      pWFTaskListID: this.WfTaskListId, 
      pUserID: currentUserContext["UserName"],
      isLoading:false
    };
    console.log(wfClaimObj);
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
}

