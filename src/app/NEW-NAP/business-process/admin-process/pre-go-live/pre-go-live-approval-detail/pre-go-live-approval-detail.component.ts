import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-pre-go-live-approval-detail',
  templateUrl: './pre-go-live-approval-detail.component.html'
})
export class PreGoLiveApprovalDetailComponent implements OnInit {
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: string; };
  viewObj: string;
  TrxNo: any;
  AgrmntNo: any;
  result: any;
  result2: any;
  result3: any;
  result4: any;
  result5: any;
  result6: any;
  arrValue = [];

  AppNo: any;
  NumOfAsset: any;
  Tenor: any;
  InstAmt: any;
  DeliveryDt: any;
  ProdOfferingName: any;
  WayOfFinancing: any;
  CustNo: any;
  CustName: any;
  OfficeName: any;
  PurposeOfFinancing: any;
  ProdOfferingCode: string;
  ProdOfferingVersion: string;
  LeadNo : string;

  AppTcList: any = [];
  identifier: string = "TCList";

  count1 : number = 0;
  RfaLogObj :{
    RfaNo: any
  }
  ListRfaLogObj : any = new Array(this.RfaLogObj); 
  inputObj2 : any
  listPreGoLiveAppvrObj : any = new Array(this.inputObj2);

  MainInfoForm = this.fb.group({

  });
  AppId: any;
  AgrmntId: any;
  token = localStorage.getItem("Token");
  LeadId: string;


  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AgrmntId = params["AgrmntId"];
      this.AppId = params["AppId"];
      this.TrxNo = params["TrxNo"];
      var obj = {
        taskId: params["TaskId"],
        instanceId: params["InstanceId"],
        approvalBaseUrl: environment.ApprovalR3Url
      }

      this.inputObj = obj;
    });
  }

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    this.http.post(AdInsConstant.GetRfaLogByTrxNoAndApvCategory, { TrxNo : this.TrxNo, ApvCategory : "PRE_GPV_APV" } ).subscribe(
      (response) => {
        this.result = response;
        this.ListRfaLogObj = response["ListRfaLogObj"];
        for(let i =0;i<this.ListRfaLogObj.length;i++){
            this.listPreGoLiveAppvrObj[i] = {
              approvalBaseUrl: environment.ApprovalR3Url,
              type: 'task',
              refId: this.ListRfaLogObj[i]["RfaNo"]
            }
          } 
      },
      (error) => {
        console.log(error);
      }
    );

    var Obj = {
      AgrmntNo: this.TrxNo,
      RowVersion: ""
    }

    

    this.http.post(AdInsConstant.GetAgrmntByAppIdGetAgrmntByAgrmntNo, Obj).subscribe(
      (response) => {
        this.result = response;
        this.AgrmntNo = this.result.AgrmntNo;
        this.CustNo = this.result.CustNo;
        this.CustName = this.result.CustName;
        this.OfficeName = this.result.OfficeName;
        this.NumOfAsset = this.result.NumOfAsset;
        this.Tenor = this.result.Tenor;
        this.ProdOfferingName = this.result.ProdOfferingName;
        this.ProdOfferingCode = this.result.ProdOfferingCode;
        this.ProdOfferingVersion = this.result.ProdOfferingVersion;
        var Obj2 = {
          ProdOfferingCode: this.result.ProdOfferingCode,
          RefProdCompntCode: "WAY_OF_FINANCING",
          RowVersion: ""
        }
        this.http.post(AdInsConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat, Obj2).subscribe(
          (response) => {
            this.result2 = response;
            this.WayOfFinancing = this.result2.CompntValueDesc;
            console.log("response");
            console.log(response);

          }
        );

        var Obj3 = {
          ProdOfferingCode: this.result.ProdOfferingCode,
          RefProdCompntCode: "PURPOSE_OF_FINANCING",
          RowVersion: ""
        }
        this.http.post(AdInsConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat, Obj3).subscribe(
          (response) => {
            this.result3 = response;
            this.PurposeOfFinancing = this.result3.CompntValueDesc;
          }
        );


        var Obj4 = {
          AppId: this.result.AppId,
          RowVersion: ""
        }
        this.http.post(AdInsConstant.GetAppById, Obj4).subscribe(
          (response) => {
            this.result4 = response;
            this.AppNo = this.result4.AppNo;

            this.http.post(AdInsConstant.GetLeadByLeadId, {LeadId : this.result4.LeadId}).subscribe(
              (response) => {
                this.LeadNo = response["LeadNo"];
                this.LeadId = response["LeadId"];
              }
            );
          }

        );

       

        var Obj5 = {
          AgrmntId: this.result.AgrmntId,
          RowVersion: ""
        }
        this.http.post(AdInsConstant.GetDeliveryOrderHByAgrmntId, Obj5).subscribe(
          (response) => {
            this.result5 = response;
            this.DeliveryDt = formatDate(this.result5.DeliveryDt, 'yyyy-MM-dd', 'en-US');

          }
        );

        this.http.post(AdInsConstant.GetAgrmntFinDataByAgrmntId, Obj5).subscribe(
          (response) => {
            this.result6 = response;
            this.InstAmt = this.result6.InstAmt;
          }
        );

      }
    );

    this.MainInfoForm.addControl(this.identifier, this.fb.array([]));
    var listTC = this.MainInfoForm.get(this.identifier) as FormArray;
    var appTcObj = {
      AppId: this.AppId
    }
    this.http.post(AdInsConstant.GetListTCbyAppId, appTcObj).subscribe(
      (response) => {
        this.AppTcList = response["AppTcs"];
        if (this.AppTcList != null && this.AppTcList["length"] != 0) {
          for (let i = 0; i < this.AppTcList["length"]; i++) {
            var TCDetail = this.fb.group({
              AppTcId: this.AppTcList[i].AppTcId,
              AppId: this.AppTcList[i].AppId,
              TcCode: this.AppTcList[i].TcCode,
              TcName: this.AppTcList[i].TcName,
              PriorTo: this.AppTcList[i].PriorTo,
              IsChecked: this.AppTcList[i].IsChecked,
              ExpiredDt: this.AppTcList[i].ExpiredDt != null ? formatDate(this.AppTcList[i].ExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
              IsMandatory: this.AppTcList[i].IsMandatory,
              PromisedDt: this.AppTcList[i].PromisedDt != null ? formatDate(this.AppTcList[i].PromisedDt, 'yyyy-MM-dd', 'en-US') : "",
              CheckedDt: this.AppTcList[i].CheckedDt != null ? formatDate(this.AppTcList[i].CheckedDt, 'yyyy-MM-dd', 'en-US') : "",
              Notes: this.AppTcList[i].Notes,
              RowVersion: this.AppTcList[i].RowVersion
            }) as FormGroup;

            if (this.AppTcList[i].IsMandatory == true) {
              TCDetail.controls.PromisedDt.setValidators([Validators.required]);
            }
            if (this.AppTcList[i].IsChecked == false) {
              TCDetail.controls.ExpiredDt.disable();
            } else {
              TCDetail.controls.PromisedDt.disable();
            }
            listTC.push(TCDetail);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );

    
  }
  changeValidation(arr) {
    if (this.MainInfoForm.controls[this.identifier]["controls"][arr]["controls"].IsMandatory.value == true) {
      this.MainInfoForm.controls[this.identifier]["controls"][arr]["controls"].PromisedDt.setValidators([Validators.required]);
    }
    if (this.MainInfoForm.controls[this.identifier]["controls"][arr]["controls"].IsChecked.value == false) {
      this.MainInfoForm.controls[this.identifier]["controls"][arr]["controls"].ExpiredDt.disable();
      this.MainInfoForm.controls[this.identifier]["controls"][arr]["controls"].PromisedDt.enable();
    } else {

      this.MainInfoForm.controls[this.identifier]["controls"][arr]["controls"].ExpiredDt.enable();
      this.MainInfoForm.controls[this.identifier]["controls"][arr]["controls"].PromisedDt.disable();
    }

    this.MainInfoForm.controls[this.identifier]["controls"][arr]["controls"].PromisedDt.updateValueAndValidity();
    this.MainInfoForm.controls[this.identifier]["controls"][arr]["controls"].ExpiredDt.updateValueAndValidity();
  }
  //nanti bakalan ke View, sementara kek gini dlu
  ToApp(){

    window.open("/Nap/View/AppView?AppId=" + this.AppId, "_blank");
  }
  ToAgrmnt(){
    window.open("/Nap/View/AgrmntView?AgrmntId=" + this.AgrmntId, "_blank");
  }
  ToLead(){
    window.open("/Lead/View?LeadId=" + this.LeadId, "_blank");
  }
  ToCust(){
    var custObj = { CustNo: this.CustNo };
    this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
      response => {
        var link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"] + "&Token=" + this.token;
        window.open(link, '_blank');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ToProdOffering(){
    var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + this.ProdOfferingCode + "&prodOfferingVersion=" + this.ProdOfferingVersion + "&Token=" + this.token;
    window.open(link, '_blank');
  }

  onAvailableNextTask() {

  }
  onApprovalSubmited() {
    this.toastr.successMessage("Success");
    this.router.navigate(["/Nap/AdminProcess/PreGoLive/Approval/Paging"]);
  }
}
