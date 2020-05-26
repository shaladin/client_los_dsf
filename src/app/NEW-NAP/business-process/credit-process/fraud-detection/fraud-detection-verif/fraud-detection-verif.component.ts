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

@Component({
  selector: 'app-fraud-detection-verif',
  templateUrl: './fraud-detection-verif.component.html',
  styleUrls: []
})
export class FraudDetectionVerifComponent implements OnInit {

  losUrl = environment.losUrl;
  foundationUrl = environment.FoundationR3Url;
  getAppById = AdInsConstant.GetAppById;
  getCustDataByAppId = AdInsConstant.GetCustDataByAppId;
  getAppDupCheckCustByAppId = AdInsConstant.GetAppDupCheckCustByAppId;
  getFraudDukcapilByIdNo = AdInsConstant.GetFraudDukcapilByIdNo;
  addAppFraudVerf = AdInsConstant.AddAppFraudVerf;
  getLeadByLeadId = AdInsConstant.GetLeadByLeadId;
  getAppAssetByAppId = AdInsConstant.GetAppAssetByAppId;
  getAssetNegativeDuplicateCheck = AdInsConstant.GetAssetNegativeDuplicateCheck;
  bussinessDt: any;
  appId: any;
  appCustObj: any;
  appCustCompanyObj: any;
  appAssetObj: any;
  leadObj: any;
  appObj: AppObj;
  leadId: any;
  dukcapilObj: any;
  ListAssetNegative: any;
  listCustDuplicate: any;
  closeResult: string;
  idNo: any;
  verfUser: any;
  verfDt: any;
  verfNotes: any;
  verfCode: any;
  appCustPersonalObj: any;
  RowVersion: any;
  GetNegativeCustomerDuplicateCheckUrl = AdInsConstant.GetNegativeCustomerDuplicateCheck;
  ListNegativeCust: any;
  viewObj: string;
  arrValue = [];

  respAppDupCheck : any;
  respNegativeCust : any;
  respAssetNegative : any;

  WfTaskListId : number;


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

  ngOnInit() {

    if (this.WfTaskListId != null || this.WfTaskListId != undefined)
      this.claimTask();

    this.arrValue.push(this.appId);
    this.viewObj = "./assets/ucviewgeneric/viewCreditInvestigationInfo.json";
    var context = JSON.parse(localStorage.getItem("UserAccess"));
    this.verfUser = context["UserName"];
    this.verfDt = context["BusinessDt"];
    this.verfCode = context["EmpNo"];
    this.getApp();

  }

  getApp() {

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
        if (this.appCustObj.MrCustTypeCode == "PERSONAL") {
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

        //List Negative Cust Duplicate Checking
        this.http.post(this.GetNegativeCustomerDuplicateCheckUrl, requestDupCheck).subscribe(
          response => {
            this.respNegativeCust = response;
            this.ListNegativeCust = response['ReturnObject'].NegativeCustDuplicate;
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
    
    this.getAppAsset(appReqObj);
    this.getAppDupCheckCust(appReqObj);
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
        this.listCustDuplicate = response["ReturnObject"];
      },
      error => {
        console.log("error")
      }
    );
  }

  getAppAsset(appId) {
    this.http.post<AppAssetObj>(this.getAppAssetByAppId, appId).subscribe(
      response => {
        this.appAssetObj = response;

        this.getNegativeAsset();
      },
      error => {
        console.log("error")
      }
    );
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

  getNegativeAsset() {
    var negativeAssetObj = {
      "assetCategoryCode": this.appAssetObj.assetCategoryCode,
      "assetTypeCode": this.appAssetObj.assetTypeCode,
      "fullAssetCode": this.appAssetObj.fullAssetCode,
      "serialNo1": this.appAssetObj.serialNo1,
      "serialNo2": this.appAssetObj.serialNo2,
      "serialNo3": this.appAssetObj.serialNo3,
      "serialNo4": this.appAssetObj.serialNo4,
      "serialNo5": this.appAssetObj.serialNo5,
    }
    this.http.post(this.getAssetNegativeDuplicateCheck, negativeAssetObj).subscribe(
      response => {
        this.respAssetNegative = response;
        this.ListAssetNegative = response["ReturnObject"];
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
    var lobCode = localStorage.getItem("LobCode")
    this.router.navigate(["/Nap/CreditProcess/FraudDetection/Paging"], { queryParams: { "LobCode": lobCode } });
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
        var lobCode = localStorage.getItem("LobCode")
        this.router.navigate(["/Nap/CreditProcess/FraudDetection/Paging"], { queryParams: { "LobCode": lobCode } });
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

