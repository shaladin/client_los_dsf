import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MouCustTcComponent } from "app/MOU/mou-customer-request/mou-cust-tc/mou-cust-tc.component";
import Stepper from "bs-stepper";
import { environment } from "environments/environment";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import {UcviewgenericComponent} from '@adins/ucviewgeneric';
import { UcViewGenericObj } from "app/shared/model/uc-view-generic-obj.model";
import { MouCustObj } from "app/shared/model/mou-cust-obj.model";
import { NavigationConstantDsf } from "app/shared/constant/NavigationConstantDsf";

@Component({
  selector: 'app-change-mou-request-detail-customer-x-dsf',
  templateUrl: './change-mou-request-detail-customer-x-dsf.component.html',
  styleUrls: ['./change-mou-request-detail-customer-x-dsf.component.css']
})
export class ChangeMouRequestDetailCustomerXDsfComponent implements OnInit {

  private stepperGeneral: Stepper;
  private stepperFactoring: Stepper;
  private stepperDealerfinancing: Stepper;
  @ViewChild("MouTcGeneral") public mouTcGeneral: MouCustTcComponent;
  @ViewChild("MouTcFactoring") public mouTcFactoring: MouCustTcComponent;
  mouType: string;
  mouCustId: number;
  ChangeMouCustId: number;
  changeMouTrxNo: string;
  currentStepIndex: number;
  ChangeMouStatus: string;
  mode: string;
  pageType: string;
  pageTitle: string;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  private viewGeneric: UcviewgenericComponent;
  @ViewChild('viewGeneric') set content(content: UcviewgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.viewGeneric = content;
    }
  }
  resultData: MouCustObj;
  ChangeMouTrxId: number;
  WfTaskListId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get("MOUType") != null) {
        this.mouType = params.get("MOUType");
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params["mouCustId"] != null) {
        this.mouCustId = params["mouCustId"];
      }
      if (params["mode"] != null) {
        this.pageType = params["mode"];
      }
      if (params["changeMouTrxNo"] != null) {
        this.changeMouTrxNo = params["changeMouTrxNo"];
      }
      if (params["ChangeMouStatus"] != null) {
        this.ChangeMouStatus = params["ChangeMouStatus"];
      }
      if (params["ChangeMouCustId"] != null) {
        this.ChangeMouCustId = params["ChangeMouCustId"];
      }
      if (params["ChangeMouTrxId"] != null) {
        this.ChangeMouTrxId = params["ChangeMouTrxId"];
      }
      if (params["WfTaskListId"] != null)
        this.WfTaskListId = params["WfTaskListId"];

    });
    this.currentStepIndex = 1;
  }

  async ngOnInit() {
    this.httpClient
      .post(URLConstant.GetMouCustById, { Id: this.mouCustId })
      .subscribe((response: MouCustObj) => {
        this.resultData = response;

        if (this.resultData.MrMouTypeCode == CommonConstant.FACTORING) {
          this.viewGenericObj.viewInput = "./assets/impl/ucviewgeneric/viewChangeMouHeaderX.json";
          this.pageTitle = "MOU Factoring";
        } else{
          this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewChangeMouHeader.json";
          if (this.resultData.MrMouTypeCode == CommonConstant.GENERAL) {
            this.pageTitle = "MOU General";
          } else if (this.resultData.MrMouTypeCode == CommonConstant.DEALERFINANCING ) {
            this.pageTitle = "MOU Dealer Financing";
          }
        }
      });

    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web,
      },
    ];
    this.viewGenericObj.whereValue = [this.ChangeMouCustId]
  }


  ngAfterViewInit(): void {
    if (this.mouType == CommonConstant.GENERAL) {
      this.stepperGeneral = new Stepper(
        document.querySelector("#stepperGeneral"),
        {
          linear: false,
          animation: true,
        }
      );
      this.stepperGeneral.to(this.currentStepIndex);
    } else if (this.mouType == CommonConstant.FACTORING) {
      this.stepperFactoring = new Stepper(
        document.querySelector("#stepperFactoring"),
        {
          linear: false,
          animation: true,
        }
      );
      this.stepperFactoring.to(this.currentStepIndex);
    } else if (this.mouType == CommonConstant.DEALERFINANCING) {
      this.stepperDealerfinancing = new Stepper(
        document.querySelector("#stepperDealerfinancing"),
        {
          linear: false,
          animation: true,
        }
      );
      this.stepperDealerfinancing.to(this.currentStepIndex);
    }
  }



  getModeDetail(e) {
    if (e != null) {
      this.mode = e.mode;
    }
  }

  designatedStepHandler(idx) {
    if (this.mouType == CommonConstant.GENERAL) {
      this.stepperGeneral.to(idx);
    } else if (this.mouType == CommonConstant.FACTORING) {
      this.stepperFactoring.to(idx);
    } else if (this.mouType == CommonConstant.DEALERFINANCING) {
      this.stepperDealerfinancing.to(idx);
    }
    this.currentStepIndex = idx;
  }

  mouDocumentBack() {
    if (this.mouType == CommonConstant.GENERAL) {
      this.stepperGeneral.previous();
      this.currentStepIndex--;
    } else if (this.mouType == CommonConstant.FACTORING) {
      this.stepperFactoring.previous();
      this.currentStepIndex--;
    } else if (this.mouType == CommonConstant.DEALERFINANCING) {
      this.stepperDealerfinancing.previous();
      this.currentStepIndex--;
    }
  }

  editMainInfoHandler() {
    if (this.pageType == "return") {

      this.router.navigate([NavigationConstantDsf.CHANGE_MOU_REQ_DETAIL_DSF], {
        // queryParams: {
        //   MouCustId: this.mouCustId,
        //   mode: "return",
        //   MrMouTypeCode: this.mouType,
        //   ChangeMouTrxId: this.ChangeMouTrxId
        // },
        queryParams: { MouCustId: this.mouCustId, ChangeMouTrxId: this.ChangeMouTrxId, mode: "return", MrMouTypeCode: this.mouType, WfTaskListId: this.WfTaskListId, ChangeMouCustId : this.ChangeMouCustId},
      });
    } else {
      this.router.navigate([NavigationConstantDsf.CHANGE_MOU_REQ_DETAIL_DSF], {
        // queryParams: {
        //   MouCustId: this.mouCustId,
        //   mode: "edit",
        //   MrMouTypeCode: this.mouType,
        //   ChangeMouTrxId: this.ChangeMouTrxId
        // },
        queryParams: { MouCustId: this.mouCustId, ChangeMouTrxId: this.ChangeMouTrxId, mode: "edit", MrMouTypeCode: this.mouType, WfTaskListId: this.WfTaskListId, ChangeMouCustId : this.ChangeMouCustId},
      });
    }
  }

  cancelHandler() {
    if (this.pageType == "return") {
      this.toastr.warningMessage("Cancel From Change Mou Request");
      this.router.navigate([NavigationConstantDsf.CHANGE_MOU_RTN_PAGING_DSF]);
    } else {
      this.toastr.warningMessage("Cancel From Change Mou Request");
      this.router.navigate([NavigationConstantDsf.CHANGE_MOU_REQ_PAGING_DSF]);
    }
  }

  submitHandler() {
    if (
      (this.mouType == CommonConstant.GENERAL && this.currentStepIndex >= 2) ||
      (this.mouType == CommonConstant.FACTORING && this.currentStepIndex >= 2) ||
      (this.mouType == CommonConstant.FINANCING && this.currentStepIndex >= 2)
    ) {

      if (this.pageType == "return") {
        var returnObj = { TaskListId: this.WfTaskListId };
        let urlPost = environment.isCore ? URLConstant.SubmitChangeMouReturnV2 : URLConstant.SubmitChangeMouReturn;

        this.httpClient.post(urlPost, returnObj).subscribe(() => {
          this.toastr.successMessage("Success");
          this.router.navigate([NavigationConstantDsf.CHANGE_MOU_RTN_PAGING_DSF]);
        });
      } else {
        var reqByIdObj = { Id: this.mouCustId };
        let urlPost = environment.isCore ? URLConstant.SubmitWorkflowChangeMouRequestV2 : URLConstant.SubmitWorkflowChangeMouRequest;

        this.httpClient.post(urlPost, reqByIdObj).subscribe(() => {
          this.toastr.successMessage("Success");
          this.router.navigate([NavigationConstantDsf.CHANGE_MOU_REQ_PAGING_DSF]);
        });
      }
    } else {
      this.toastr.warningMessage("Please follow the steps first");
    }
  }

  stepHandlerGeneral(response) {
    switch (response["StatusCode"].toString()) {
      case "200":
        this.stepperGeneral.next();
        this.currentStepIndex++;
        break;

      case "-1":
        this.stepperGeneral.previous();
        this.currentStepIndex--;
        break;

      case "-2":
        if (this.pageType == "return") {
          this.router.navigate([NavigationConstantDsf.MOU_EDIT_CUST_PAGING_DSF]);
        } else {
          this.router.navigate([NavigationConstantDsf.MOU_REQ_PAGING_DSF]);
        }
        break;
      default:
        break;
    }
    if (this.currentStepIndex >= 3) {
      this.toastr.successMessage("Success");
      if (this.pageType == "return") {
        this.router.navigate([NavigationConstantDsf.CHANGE_MOU_RTN_PAGING_DSF]);
      }
      else{
        this.router.navigate([NavigationConstantDsf.CHANGE_MOU_REQ_PAGING_DSF]);
      }
    }
  }

  stepHandlerFactoring(response) {
    switch (response["StatusCode"].toString()) {
      case "200":
        this.stepperFactoring.next();
        this.currentStepIndex++;
        break;

      case "-1":
        this.stepperFactoring.previous();
        this.currentStepIndex--;
        break;

      case "-2":
        if (this.pageType == "return") {
          this.router.navigate([NavigationConstantDsf.MOU_EDIT_CUST_PAGING_DSF]);
        } else {
          this.router.navigate([NavigationConstantDsf.MOU_REQ_PAGING_DSF]);
        }
        break;
      default:
        break;
    }
    if (this.currentStepIndex >= 3) {
      this.toastr.successMessage("Success");
      this.toastr.successMessage("Success");
      if (this.pageType == "return") {
        this.router.navigate([NavigationConstantDsf.CHANGE_MOU_RTN_PAGING_DSF]);
      }
      else{
        this.router.navigate([NavigationConstantDsf.CHANGE_MOU_REQ_PAGING_DSF]);
      }
    }
  }
  refreshMainInfo(response) {
    this.viewGeneric.initiateForm();
  }

  stepHandlerDealerfinancing(response) {
    switch (response["StatusCode"].toString()) {
      case "200":
        this.stepperDealerfinancing.next();
        this.currentStepIndex++;
        break;

      case "-1":
        this.stepperDealerfinancing.previous();
        this.currentStepIndex--;
        break;

      case "-2":
        if (this.pageType == "return") {
          this.router.navigate([NavigationConstantDsf.MOU_EDIT_CUST_PAGING_DSF]);
        } else {
          this.router.navigate([NavigationConstantDsf.MOU_REQ_PAGING_DSF]);
        }
        break;
      default:
        break;
    }
    if (this.currentStepIndex >= 3) {
      this.toastr.successMessage("Success");
      this.toastr.successMessage("Success");
      if (this.pageType == "return") {
        this.router.navigate([NavigationConstantDsf.CHANGE_MOU_RTN_PAGING_DSF]);
      }
      else{
        this.router.navigate([NavigationConstantDsf.CHANGE_MOU_REQ_PAGING_DSF]);
      }
    }
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData["CustNo"] };
      this.httpClient
        .post(URLConstant.GetCustByCustNo, custObj)
        .subscribe((response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }

}
