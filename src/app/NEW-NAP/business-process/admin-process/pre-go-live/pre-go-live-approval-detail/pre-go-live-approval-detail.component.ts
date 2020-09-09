import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';
import { ApprovalObj } from 'app/shared/model/Approval/ApprovalObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { OutstandingTcObj } from 'app/shared/model/OutstandingTcObj.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';

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
  LeadNo: string;
  MouNo: string;
  AppTcList: any = [];
  identifier: string = "TCList";
  IsApvReady: boolean = false;
  outstandingTcObj : any;
  listAppTCObj : ListAppTCObj;
  appTC : AppTCObj;
  count1: number = 0;
  RfaLogObj: {
    RfaNo: any
  }
  ListRfaLogObj: any = new Array(this.RfaLogObj);
  inputObj2: any
  listPreGoLiveAppvrObj: any = new Array(this.inputObj2);

  MainInfoForm = this.fb.group({

  });
  AppId: any;
  AgrmntId: any;
  token = localStorage.getItem(CommonConstant.TOKEN);
  LeadId: string;
  bizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  MouCustId: any;


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

      var ApvHoldObj = new ApprovalObj()
      ApvHoldObj.TaskId = obj.taskId

      this.HoldTask(ApvHoldObj);
    });
  }

  ngOnInit() {
    console.log("aaa");
    this.arrValue.push(this.AgrmntId);
    this.http.post(URLConstant.GetRfaLogByTrxNoAndApvCategory, { TrxNo: this.TrxNo, ApvCategory: CommonConstant.ApvCategoryPreGoLive }).subscribe(
      (response) => {
        this.result = response;
        this.ListRfaLogObj = response["ListRfaLogObj"];
        for (let i = 0; i < this.ListRfaLogObj.length; i++) {
          this.listPreGoLiveAppvrObj[i] = {
            approvalBaseUrl: environment.ApprovalR3Url,
            type: 'task',
            refId: this.ListRfaLogObj[i]["RfaNo"],
            apvStat: this.ListRfaLogObj[i]["ApvStat"],
          }
        }
        this.IsApvReady = true;
      });

    var Obj = {
      AgrmntNo: this.TrxNo,
      RowVersion: ""
    }



    this.http.post(URLConstant.GetAgrmntByAppIdGetAgrmntByAgrmntNo, Obj).subscribe(
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
          RefProdCompntCode: CommonConstant.RefProdCompntCodeWayOfFinancing,
          RowVersion: ""
        }
        this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat, Obj2).subscribe(
          (response) => {
            this.result2 = response;
            this.WayOfFinancing = this.result2.CompntValueDesc;
          }
        );

        var Obj3 = {
          ProdOfferingCode: this.result.ProdOfferingCode,
          RefProdCompntCode: CommonConstant.RefProdCompntCodePurposeOfFinancing,
          RowVersion: ""
        }
        this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeAndACTProdStat, Obj3).subscribe(
          (response) => {
            this.result3 = response;
            this.PurposeOfFinancing = this.result3.CompntValueDesc;
          }
        );


        var Obj4 = {
          AppId: this.result.AppId,
          RowVersion: ""
        }
        this.http.post(URLConstant.GetAppById, Obj4).subscribe(
          (response) => {
            this.result4 = response;
            this.AppNo = this.result4.AppNo;

            if (this.result4.LeadId != null || this.result4.LeadId != undefined) {
              this.http.post(URLConstant.GetLeadByLeadId, { LeadId: this.result4.LeadId }).subscribe(
                (response) => {
                  this.LeadNo = response["LeadNo"];
                  this.LeadId = response["LeadId"];
                }
              );
            }

            this.http.post(URLConstant.GetMouCustByAppId, Obj4).subscribe(
              (response) => {
                this.MouNo = response["MouCustNo"];
                this.MouCustId = response["MouCustId"];
              }
            );


          }

        );


        var Obj5 = {
          AgrmntId: this.result.AgrmntId,
          RowVersion: ""
        }
        this.http.post(URLConstant.GetDeliveryOrderHByAgrmntId, Obj5).subscribe(
          (response) => {
            this.result5 = response;
            this.DeliveryDt = formatDate(this.result5.DeliveryDt, 'yyyy-MM-dd', 'en-US');

          }
        );

        this.http.post(URLConstant.GetAgrmntFinDataByAgrmntId, Obj5).subscribe(
          (response) => {
            this.result6 = response;
            this.InstAmt = this.result6.InstAmt;
          }
        );

      }
    ); 


  }
  HoldTask(obj) {
    this.http.post(URLConstant.ApvHoldTaskUrl, obj).subscribe(
      (response) => {
      },
      (error) => {
        this.router.navigate(["/Nap/AdminProcess/PreGoLive/Approval/Paging"], { queryParams: { "BizTemplateCode": this.bizTemplateCode } });
      }
    )
  }
 
  //nanti bakalan ke View, sementara kek gini dlu

  OpenView(key: string){
    if(key == 'app'){
      AdInsHelper.OpenAppViewByAppId(this.AppId);
    }else if(key == 'agrmnt'){
      AdInsHelper.OpenAgrmntViewByAgrmntId(this.AgrmntId);
    }else if(key == 'lead'){
      AdInsHelper.OpenLeadViewByLeadId(this.LeadId);
    }else if(key == 'mou'){
      AdInsHelper.OpenMOUCustViewByMouCustId(this.MouCustId);
    }else if(key == 'cust'){
      var custObj = { CustNo: this.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId (response["CustId"])
        });
    }else if(key == 'prod'){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( this.ProdOfferingCode, this.ProdOfferingVersion); 
    }
  }

  onAvailableNextTask() {

  }
  onApprovalSubmited() {  
    this.outstandingTcObj = new OutstandingTcObj(); 
    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

    for (var i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.MainInfoForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.MainInfoForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.MainInfoForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.MainInfoForm.value.TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.MainInfoForm.value.TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.MainInfoForm.value.TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.MainInfoForm.value.TCList[i].Notes;
      this.listAppTCObj.AppTCObj.push(this.appTC);
    }

    this.outstandingTcObj.ListAppTCObj = this.listAppTCObj.AppTCObj;

    this.http.post(URLConstant.SubmitOutstandingTc, this.outstandingTcObj).subscribe(
      response => {
        this.toastr.successMessage("Success");
        this.router.navigate(["/Nap/AdminProcess/PreGoLive/Approval/Paging"], { queryParams: { "BizTemplateCode": this.bizTemplateCode } });
      }
    );
 
  }

  onCancelClick() {
    this.router.navigateByUrl('/Nap/AdminProcess/PreGoLive/Approval/Paging?BizTemplateCode=' + localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE));
  }

  openView(custNo) {
    var link: string;
    var custObj = { CustNo: custNo };
    this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
      response => {
        AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
      });
  }
}
