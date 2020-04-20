import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { AppCustPersonalObj } from 'app/shared/model/AppCustPersonalObj.Model';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { FraudDukcapilObj } from 'app/shared/model/FraudDukcapilObj.Model';


@Component({
  selector: 'app-view-fraud-detection-result',
  templateUrl: './view-fraud-detection-result.component.html'
})

export class ViewFraudDetectionResultComponent implements OnInit {
  
  @Input() appId: number;
  @Input() mrCustTypeCode : string;
  viewDukcapilMainDataObj : string;
  losUrl = environment.losUrl;
  foundationUrl = environment.FoundationR3Url;
  getAppById = this.losUrl + AdInsConstant.GetAppById;
  getCustDataByAppId = AdInsConstant.GetCustDataByAppId;
  getAppDupCheckCustByAppId = AdInsConstant.GetAppDupCheckCustByAppId;
  getFraudDukcapilByIdNo = AdInsConstant.GetFraudDukcapilByIdNo;
  getNegativeCustomerDuplicateCheckUrl = this.foundationUrl + AdInsConstant.GetNegativeCustomerDuplicateCheck;  
  getAppAssetByAppId = AdInsConstant.GetAppAssetByAppId;
  getAssetNegativeDuplicateCheck = AdInsConstant.GetAssetNegativeDuplicateCheck;

  arrValue = [];
  isDataAlreadyLoaded: boolean = false;
  closeResult: string;
  appCustObj: any;
  appCustCompanyObj: any;
  appCustPersonalObj: any;
  idNo: any;
  listNegativeCust: any;
  RowVersion: any;
  appAssetObj: any;
  listNegativeAsset: any;
  dukcapilObj: any;
  viewDukcapilObj: string;
  listCustDuplicate: any;
  trxRefNo : string;
  mrSrvySourceCode : string;
  requestDupCheck : any;
  custStat: string;

  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal) { }

    async ngOnInit(): Promise<void>{     

      await this.getApp();
      this.arrValue.push(this.appId);
      this.viewDukcapilObj = "./assets/ucviewgeneric/viewDukcapilMainInfo.json";
      
      this.isDataAlreadyLoaded = true;
  }

  getApp(){
    this.appCustObj = new AppCustObj();
    this.appCustPersonalObj = new AppCustPersonalObj();
    this.appCustCompanyObj = new AppCustCompanyObj();
    this.dukcapilObj = new FraudDukcapilObj();
    var appReqObj = {"AppId" : this.appId}
    this.http.post(this.getCustDataByAppId, appReqObj).subscribe(
    response => {
        this.appCustObj = response["AppCustObj"];
        this.appCustCompanyObj = response["AppCustCompanyObj"];
        this.appCustPersonalObj  = response["AppCustPersonalObj"];
        this.idNo = this.appCustObj.IdNo;
        this.trxRefNo = this.appCustObj.AppNo;
        this.mrSrvySourceCode = "MOU";
        var fraudDukcapilReqObj = {"IdNo" : this.idNo};
        this.getFraudDukcapil(fraudDukcapilReqObj);      
        
        if(this.mrCustTypeCode == "PERSONAL"){
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
        }else if(this.mrCustTypeCode == "COMPANY"){
          this.requestDupCheck = {
            "CustName": this.appCustObj.CustName,
            "MrCustTypeCode": this.appCustObj.MrCustTypeCode,
            "MrCustModelCode": this.appCustObj.CustModelCode,
            "MrIdTypeCode": this.appCustObj.MrIdTypeCode,
            "IdNo": this.appCustObj.IdNo,
            "TaxIdNo": this.appCustObj.TaxIdNo,
            "BirthDt" : this.appCustCompanyObj.EstablishmentDt,
            "MotherMaidenName" : "-",
            "MobilePhnNo1" : "-", 
            "RowVersion": this.RowVersion     
          };
        }
        this.getNegativeCustomer(this.requestDupCheck);
    },
    error => {
        console.log("error")
    }
  );

  this.getAppAsset(appReqObj);
  this.getAppDupCheckCust(appReqObj);
  }

  getNegativeCustomer(reqObj){
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
  
  getFraudDukcapil(idNo){
    this.http.post(this.getFraudDukcapilByIdNo, idNo).subscribe(
      response => {
          this.dukcapilObj = response;

      },
      error => {
          console.log("error")
      }
    );
    }

   getAppDupCheckCust(appId){
      this.http.post(this.getAppDupCheckCustByAppId, appId).subscribe(
        response => {
            this.listCustDuplicate = response;
            if(this.listCustDuplicate.indexOf(this.appCustObj.CustNo) < 0){
              this.custStat = "EXISTING"
            }else{
              this.custStat = "NEW"
            }
  
        },
        error => {
            console.log("error")
        }
      );
    }

  getAppAsset(appId){
    this.http.post<AppAssetObj>(this.getAppAssetByAppId, appId).subscribe(
      response => {
          this.appAssetObj = response;

      },
      error => {
          console.log("error")
      }
    );
    }


  getNegativeAsset(){
    var negativeAssetObj = {"assetCategoryCode": this.appAssetObj.assetCategoryCode,
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
          this.listNegativeAsset = response["AssetNegativeObj"];

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


