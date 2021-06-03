import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AppInvoiceFctrObj } from 'app/shared/model/AppInvoiceFctrObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';

@Component({
  selector: 'invoice-verif-detail-DF',
  templateUrl: './invoice-verif-detail-df.component.html'
})
export class InvoiceVerifDetailDFComponent implements OnInit {
  private stepper: Stepper;

  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  listInvoice: Array<AppInvoiceFctrObj>;
  listVerificationStatus: Array<KeyValueObj>;
  verifStatCode: RefMasterObj;
  AppId: number;
  WfTaskListId: number;
  TrxNo: string;
  PlafondAmt: number;
  OsPlafondAmt: number;
  MrMouTypeCode: string;
  token = localStorage.getItem(CommonConstant.TOKEN);
  LobCode: string;
  IsReady: boolean = false;

  appTC: AppTCObj;
  RlistAppTCObj: { ListAppTcObj: Array<AppTCObj> };

  InvoiceForm = this.fb.group({
      Invoices: this.fb.array([])
  });
  StepperIndex: number = 1;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private httpClient: HttpClient, private router: Router, private toastr: NGXToastrService) {
      this.route.queryParams.subscribe(params => {
          this.AppId = params["AppId"];
          this.WfTaskListId = params["TaskListId"];
          this.TrxNo = params["TrxNo"];
      });
  }

  NextStep(Step) {
      this.ChangeTab(Step);
      this.stepper.next();
  }

  SaveForm() {

      //DIPINDAH KE INVOICE VERIF DETAIL LIST OF INVOICE
      // var Url: any;
      // if (this.MrMouTypeCode == CommonConstant.FACTORING) {
      //   Url = URLConstant.UpdateAppInvoiceFctr;
      // } else {
      //   Url = URLConstant.UpdateAppInvoiceDlfn;
      // }
      // var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray
      // for (let i = 0; i < fa_listInvoice.length; i++) {
      //   var item = fa_listInvoice.at(i);
      //   this.listInvoice[i].IsApproved = item.get("Verification").value == "APV" ? true : false;
      //   this.listInvoice[i].InvoiceStat = item.get("Verification").value;
      //   this.listInvoice[i].Notes = item.get("InvoiceNotes").value;
      //   this.listInvoice[i].RowVersion = item.get("RowVersion").value;
      // }
      var businessDt = new Date(localStorage.getItem(CommonConstant.BUSINESS_DATE_RAW));

      this.RlistAppTCObj = {
          ListAppTcObj: []
      }
      this.RlistAppTCObj.ListAppTcObj = new Array();

      for (var i = 0; i < this.InvoiceForm.value.TCList["length"]; i++) {
          this.appTC = new AppTCObj();
          this.appTC.AppId = this.InvoiceForm.value.TCList[i].AppId;
          this.appTC.TcCode = this.InvoiceForm.value.TCList[i].TcCode;
          this.appTC.PriorTo = this.InvoiceForm.value.TCList[i].PriorTo;
          this.appTC.IsChecked = this.InvoiceForm.getRawValue().TCList[i].IsChecked;
          this.appTC.ExpiredDt = this.InvoiceForm.getRawValue().TCList[i].ExpiredDt;
          this.appTC.IsMandatory = this.InvoiceForm.value.TCList[i].IsMandatory;
          this.appTC.PromisedDt = this.InvoiceForm.getRawValue().TCList[i].PromisedDt;
          this.appTC.CheckedDt = this.InvoiceForm.value.TCList[i].CheckedDt;
          this.appTC.Notes = this.InvoiceForm.value.TCList[i].Notes;
          this.appTC.RowVersion = this.InvoiceForm.value.TCList[i].RowVersion;

          var prmsDt = new Date(this.appTC.PromisedDt);
          var prmsDtForm = this.InvoiceForm.value.TCList[i].PromisedDt;
          if (this.appTC.IsChecked == false) {
              if (prmsDtForm != null) {
                  if (prmsDt < businessDt) {
                      this.toastr.warningMessage("Promise Date for " + this.appTC.TcName + " can't be lower than Business Date");
                      return;
                  }
              }
          }
          this.RlistAppTCObj.ListAppTcObj.push(this.appTC);
      }
      this.httpClient.post(URLConstant.EditAppTc, this.RlistAppTCObj).subscribe(
          (response) => {
              this.toastr.successMessage(response["message"]);
              this.ResumeWf();
              // AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], {});
          });
  }

  ChangeTab(Step) {
      switch (Step) {
          case "INVOICE":
              this.StepperIndex = 1;
              break;
          case "TC":
              this.StepperIndex = 2;
              break;
          default:
              break;
      }
  }

  async ngOnInit() {
      this.claimTask();
      this.stepper = new Stepper(document.querySelector('#stepper1'), {
          linear: false,
          animation: true
      })

      let reqApp : GenericObj = new GenericObj();
      reqApp.Id = this.AppId
      
      await this.httpClient.post<AppObj>(URLConstant.GetAppById, reqApp).toPromise().then(
          (response) => {
              this.LobCode = response.LobCode
          }

      );
      if (this.LobCode == "DLRFNCNG") {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewInvoiceVerifDlrFinancing.json";
          this.viewGenericObj.viewEnvironment = environment.losUrl;
          this.viewGenericObj.ddlEnvironments = [
              {
                  name: "ApplicationNo",
                  environment: environment.losR3Web
              },
              {
                  name: "MouCustNo",
                  environment: environment.losR3Web
              },
          ];
          this.IsReady = true;
      } else {
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewInvoiceVerif.json";
          this.viewGenericObj.viewEnvironment = environment.losUrl;
          this.viewGenericObj.ddlEnvironments = [
              {
                  name: "ApplicationNo",
                  environment: environment.losR3Web
              },
              {
                  name: "MouCustNo",
                  environment: environment.losR3Web
              },
          ];
          this.IsReady = true;
      }



      //viewInvoiceVerifDlrFinancing


      this.GetListVerifStatus();
      var request = {
          Id: this.AppId
      }

      this.httpClient.post(URLConstant.GetMouCustByAppId, request).subscribe((responseMou) => {
          this.PlafondAmt = responseMou["PlafondAmt"];
          this.MrMouTypeCode = responseMou["MrMouTypeCode"];

          if (this.MrMouTypeCode == CommonConstant.FACTORING) {
              this.httpClient.post(URLConstant.GetListAppInvoiceFctrByAppId, request).subscribe((response) => {
                  this.listInvoice = response["AppInvoiceFctrObjs"];
                  var totalInvoice = 0;
                  for (let i = 0; i < this.listInvoice.length; i++) {
                      var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
                      fa_listInvoice.push(this.AddInvoiceControl(this.listInvoice[i]))
                      totalInvoice += this.listInvoice[i].InvoiceAmt;
                  }
                  this.OsPlafondAmt = this.PlafondAmt - totalInvoice;
              });
          } else {
              var requestDlrFncng = {
                  AppId: this.AppId,
                  MouCustId: responseMou["MouCustId"]
              }

              var DisbAmt = 0;
              this.httpClient.post(URLConstant.GetListAppInvoiceXAppInvoiceDlrFncngHByAppId, { Id: this.AppId }).subscribe(
                  (response) => {
                      this.listInvoice = response["AppInvoiceDlrFncngHObj"];
                      for (let i = 0; i < this.listInvoice.length; i++) {
                          var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
                          fa_listInvoice.push(this.AddInvoiceControl(this.listInvoice[i]))
                      }
                      DisbAmt = this.listInvoice[0].DisbAmt;
                      this.OsPlafondAmt = this.PlafondAmt - DisbAmt;
                  });
          }
      })
  }

  AddInvoiceControl(obj) {
      return this.fb.group({
          InvoiceNo: obj.InvoiceNo,
          CustName: obj.CustomerFactoringName,
          InvoiceAmt: obj.InvoiceAmt,
          Verification: this.listVerificationStatus[0].Key,
          InvoiceNotes: obj.InvoiceNotes,
          InvoiceDt: obj.InvoiceDueDt,
          RowVersion: obj.RowVersion,
      })
  }

  GetListVerifStatus() {
      this.httpClient.post(URLConstant.GetListActiveRefStatusByStatusGrpCode, { Code: CommonConstant.INV_VERF_RESULT_STAT }).subscribe((response) => {
          this.listVerificationStatus = response[CommonConstant.ReturnObj];
      })
  }

  Cancel() {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], {});
  }


  async claimTask() {
      var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
      var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
      wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
      wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
      this.httpClient.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
          () => {
          });
  }
  Calculate(i) {
      var fa_listInvoice = this.InvoiceForm.get("Invoices") as FormArray;
      var item = fa_listInvoice.at(i);
      if (item.get("Verification").value == "APV") {
          this.OsPlafondAmt -= item.get("InvoiceAmt").value;
      }
      else {
          this.OsPlafondAmt += item.get("InvoiceAmt").value;
      }
  }

  GetCallBack(ev) {
      if (ev.Key == "ViewProdOffering") {
          AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
      }
  }

  ResumeWf() {
      var workflowApiObj = new WorkflowApiObj();
      workflowApiObj.TaskListId = this.WfTaskListId;
      workflowApiObj.ListValue["pBookmarkValue"] = CommonConstant.BOOKMARK_DONE;
      this.httpClient.post(URLConstant.ResumeWorkflow, workflowApiObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_INVOICE_VERIF_PAGING], {});
        }
      );
    }
}
