import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { Location, DatePipe, formatDate } from "@angular/common";
import { InputLookupObj } from "app/shared/model/input-lookup-obj.model";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { KeyValueObj } from "app/shared/model/key-value/key-value-obj.model";
import { ExceptionConstant } from "app/shared/constant/ExceptionConstant";
import { ClaimWorkflowObj } from "app/shared/model/workflow/claim-workflow-obj.model";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { GenericObj } from "app/shared/model/generic/generic-obj.model";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CookieService } from "ngx-cookie";
import { ClaimTaskService } from "app/shared/claimTask.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-change-mou-request-detail",
  templateUrl: "./change-mou-request-detail.component.html",
  providers: [NGXToastrService],
})
export class ChangeMouRequestDetailComponent implements OnInit {
  mouType: string;
  WfTaskListId: any;
  inputLookupCust: InputLookupObj;
  pageType: string = "edit";
  mouCustId: number;
  refOfficeId: number;
  businessDt: Date;
  mouCustUrl: string;
  custId: number;
  custUrl: string;
  IsRevolving: string;
  ChangeMouTypeList: Array<KeyValueObj> = new Array<KeyValueObj>();
  noChangeMouData: string = "false";
  changeMouTrxNo: string;
  ChangeMouCustId: number;
  ChangeMouStatus: string;
  responseChangeMouObj: any;
  datePipe = new DatePipe("en-US");
  ChangeMouTrxId: number;
  ChnMouVersion: number = 1;
  tempNewTrx: boolean = true;
  tempChangeMouTrxId: number = 0;
  tempChangeMouCustId: number = 0;

  revolvingName = "";
  plafondName = "";
  mouTypeName = "";
  MOUMainInfoForm = this.fb.group({
    MouCustId: [0, [Validators.required]],
    MouCustNo: [""],
    EndDt: ["", [Validators.required]],
    RefNo: [""],
    IsRevolving: [""],
    CurrCode: [""],
    PlafondAmt: ["", [Validators.required, Validators.min(1.0)]],
    MouStat: ["", [Validators.required]],
    MrMouTypeCode: ["", [Validators.required]],
    Notes: [""],
    MrCustTypeCode: [""],
    RowVersion: [""],
    CustModelCode: [""],
    MrChangeMouTypeCode: [""],
    MrRevolvingTypeCode: [""],
    ChangeMouTrxNo: [""],
    ChangeMouStatus: [""],
    PlafondType: [""]
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private http: HttpClient,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params["mode"] != null) {
        this.pageType = params["mode"];
      }
      if (params["MouCustId"] != null) {
        this.mouCustId = params["MouCustId"];
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
      if (params["MrMouTypeCode"] != null) {
        this.mouType = params["MrMouTypeCode"];
      }
      if (params["WfTaskListId"] != null)
        this.WfTaskListId = params["WfTaskListId"];

      if (params["ChangeMouTrxId"] != null) {
        this.ChangeMouTrxId = params["ChangeMouTrxId"];
      }
    });
  }

  async ngOnInit() {
    var datePipe = new DatePipe("en-US");

    var userContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.refOfficeId = userContext.OfficeId;
    this.businessDt = userContext.BusinessDt;
    if (this.pageType == "return") {
      this.ClaimTask();
    }

    //bind data dropdown
    await this.http
      .post(URLConstant.GetRefMasterListKeyValueActiveByCode, {
        RefMasterTypeCode: CommonConstant.CHANGE_MOU_TYPE,
      })
      .toPromise().then((response) => {
        this.ChangeMouTypeList = response[CommonConstant.ReturnObj];
        if (this.pageType != "edit") {
          this.MOUMainInfoForm.patchValue({
            MrChangeMouTypeCode: this.ChangeMouTypeList[0].Key,
          });
        }
      });

    if (this.pageType == "edit" || this.pageType == "return") {
      var mouCust = new GenericObj();
      mouCust.Id = this.mouCustId;

      var obj = { Id: this.mouCustId }
      await this.http.post(URLConstant.GetChangeMouByMouCustIdStatusNew, obj).toPromise().then(
        (response) => {
          console.log(response)
          //Jika ada data dengan status NEW
          if (response["ChangeMouTrxId"] != 0) {
            this.tempChangeMouCustId = response["ChangeMouCustId"];
            this.tempChangeMouTrxId = response["ChangeMouTrxId"];

            response["EndDt"] = datePipe.transform(
              response["EndDt"],
              "yyyy-MM-dd"
            );
            if (response["IsRevolving"] == true) {
              response["IsRevolving"] = "Yes";
            } else {
              response["IsRevolving"] = "No";
            }

            if (
              response["MrRevolvingTypeCode"] == null ||
              response["MrRevolvingTypeCode"] == ""
            ) {
              response["MrRevolvingTypeCode"] = "-";
            }

            if (
              response["PlafondType"] == null ||
              response["PlafondType"] == ""
            ) {
              response["PlafondType"] = "-";
            }

            this.MOUMainInfoForm.patchValue({
              ...response,
            });
            this.MOUMainInfoForm.controls.MrChangeMouTypeCode.disable();

            this.tempNewTrx = false;

            this.responseChangeMouObj = response;
            this.CheckMouChangeType(this.responseChangeMouObj.TrxType);
            this.GetRefmasterData();
          }
        }
      );

      if(this.tempNewTrx == true)
      {
        this.http
        .post(URLConstant.GetLatestChangeMouCustVersionById, mouCust)
        .subscribe((response) => {
          console.log(response);
          if (response["Status"] == "Failed") {
            this.httpClient
              .post(URLConstant.GetMouCustById, mouCust)
              .subscribe((response) => {
                response["StartDt"] = datePipe.transform(
                  response["StartDt"],
                  "yyyy-MM-dd"
                );
                response["EndDt"] = datePipe.transform(
                  response["EndDt"],
                  "yyyy-MM-dd"
                );
                if (response["IsRevolving"] == true) {
                  response["IsRevolving"] = "Yes";
                } else {
                  response["IsRevolving"] = "No";
                }

                if (
                  response["MrRevolvingTypeCode"] == null ||
                  response["MrRevolvingTypeCode"] == ""
                ) {
                  response["MrRevolvingTypeCode"] = "-";
                }

                if (
                  response["PlafondType"] == null ||
                  response["PlafondType"] == ""
                ) {
                  response["PlafondType"] = "-";
                }

                this.MOUMainInfoForm.patchValue({
                  ...response,
                });
                this.GetRefmasterData();
                var custObj = { CustNo: response["CustNo"] };

                this.httpClient
                  .post(URLConstant.GetCustByCustNo, custObj)
                  .subscribe((response) => {
                    this.custId = response["CustId"];
                  });

                if (response["MrChangeMouTypeCode"] == null) {
                  this.MOUMainInfoForm.controls.MrChangeMouTypeCode.setValue(
                    this.ChangeMouTypeList[0].Key
                  );
                }

                this.GetRefmasterData();
              });
          } else {
            response["StartDt"] = datePipe.transform(
              response["StartDt"],
              "yyyy-MM-dd"
            );
            response["EndDt"] = datePipe.transform(
              response["EndDt"],
              "yyyy-MM-dd"
            );

            if (response["IsRevolving"] == true) {
              response["IsRevolving"] = "Yes";
            } else {
              response["IsRevolving"] = "No";
            }

            if (
              response["MrRevolvingTypeCode"] == null ||
              response["MrRevolvingTypeCode"] == ""
            ) {
              response["MrRevolvingTypeCode"] = "-";
            }

            if (
              response["PlafondType"] == null ||
              response["PlafondType"] == ""
            ) {
              response["PlafondType"] = "-";
            }

            this.MOUMainInfoForm.patchValue({
              ...response,
            });
            this.ChnMouVersion = response["Version"] + 1;

            if (response["ChangeMouStat"] == CommonConstant.ChangeMouNew || response["ChangeMouStat"] == CommonConstant.ChangeMouReturn) {
              this.MOUMainInfoForm.controls.MrChangeMouTypeCode.disable();
            }    
          }

          this.responseChangeMouObj = response;
          this.CheckMouChangeType(this.responseChangeMouObj.MrChangeMouTypeCode);
          this.GetRefmasterData();
        });
      }
    } 
    else 
    {
      this.MOUMainInfoForm.patchValue({
        MrChangeMouTypeCode: this.mouType,
      });
      this.CheckMouChangeType(this.mouType);
    }

    if(this.MOUMainInfoForm.controls.PlafondType.value == CommonConstant.MOU_CUST_PLAFOND_TYPE_BOCLLTR)
    {
      this.MOUMainInfoForm.controls.PlafondAmt.clearValidators();
      this.MOUMainInfoForm.controls.PlafondAmt.updateValueAndValidity();
    }
  }


  ClaimTask() {
    if (environment.isCore) {
      if (this.WfTaskListId != "" && this.WfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
      }
    }
    else if (this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
  }
  
  GetRefmasterData(){
    if(this.MOUMainInfoForm.controls.MrRevolvingTypeCode.value === "-"){
      this.revolvingName = "-";
    }
    else{
      this.http
      .post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, {
        RefMasterTypeCode: CommonConstant.MOU_REVOLVING_TYPE, MasterCode: this.MOUMainInfoForm.controls.MrRevolvingTypeCode.value
      })
      .subscribe((response) => {
          this.revolvingName = response["Descr"];
      });
    }

    if(this.MOUMainInfoForm.controls.PlafondType.value === "-"){
      this.plafondName = "-";
    }
    else{
      this.http
      .post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, {
        RefMasterTypeCode: CommonConstant.RefMasterTypeCodePlafonType, MasterCode: this.MOUMainInfoForm.controls.PlafondType.value
      })
      .subscribe((response) => {
        this.plafondName = response["Descr"];
      });
    }


    this.http
    .post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMouType, MasterCode: this.MOUMainInfoForm.controls.MrMouTypeCode.value
    })
    .subscribe((response) => {
      this.mouTypeName = response["Descr"];
    });
  }

  MouChangeTypeEvent(event) {
    this.CheckMouChangeType(event.target.value);
  }

  CheckMouChangeType(trxType) {
    if (trxType == CommonConstant.CHANGE_MOU_TRX_TYPE_REQ_EXP) {
      this.MOUMainInfoForm.patchValue({
        ...this.responseChangeMouObj
      });
      this.GetRefmasterData();
      this.MOUMainInfoForm.patchValue({
        MrChangeMouTypeCode: trxType,
        EndDt: formatDate(this.businessDt, 'yyyy-MM-dd', 'en-US')
      });
      this.MOUMainInfoForm.controls.EndDt.disable();
      this.MOUMainInfoForm.controls.RefNo.disable();
      this.MOUMainInfoForm.controls.PlafondAmt.disable();
      this.MOUMainInfoForm.controls.Notes.disable();
    }
    if (trxType == CommonConstant.CHANGE_MOU_TRX_TYPE_CHANGE_MOU) {
      this.MOUMainInfoForm.controls.EndDt.enable();
      this.MOUMainInfoForm.controls.RefNo.enable();
      this.MOUMainInfoForm.controls.PlafondAmt.enable();
      this.MOUMainInfoForm.controls.Notes.enable();
    }
  }

  Back(): void {
    this.location.back();
  }

  async Save(enjiForm) {
    var mouCustFormData = this.MOUMainInfoForm.getRawValue();

    var userContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.refOfficeId = userContext.OfficeId;
    this.businessDt = userContext.BusinessDt;

    if (this.MOUMainInfoForm.controls.EndDt.value <= this.datePipe.transform(this.businessDt, "yyyy-MM-dd") && this.MOUMainInfoForm.controls.MrChangeMouTypeCode.value == CommonConstant.CHANGE_MOU_TRX_TYPE_CHANGE_MOU) {
      this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LESS_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y'));
      return;
    }

    if (this.pageType == "edit") {
      mouCustFormData["RefOfficeId"] = this.refOfficeId;
      mouCustFormData["Status"] = "NEW";
      mouCustFormData[
        "TrxType"
      ] = this.MOUMainInfoForm.controls.MrChangeMouTypeCode.value;
      mouCustFormData["Version"] = this.ChnMouVersion;
      mouCustFormData["RequestDate"] = this.businessDt;

      if (this.tempNewTrx == true) {
        this.httpClient
          .post(environment.isCore ? URLConstant.AddChangeMouV2 : URLConstant.AddChangeMou, mouCustFormData)
          .subscribe((response) => {
            this.toastr.successMessage(response["Message"]);
            this.changeMouTrxNo = response["ChangeMouTrxNo"];
            this.ChangeMouCustId = response["ChangeMouCustId"];
            this.ChangeMouStatus = response["Status"];
            this.ChangeMouTrxId = response["ChangeMouTrxId"];
            if (mouCustFormData["TrxType"] == CommonConstant.CHANGE_MOU_TRX_TYPE_REQ_EXP) {
              this.location.back();
            } else {
              this.router.navigate(
                [
                  NavigationConstant.CHANGE_MOU_REQ_DETAIL_CUSTOMER,
                  this.MOUMainInfoForm.controls.MrMouTypeCode.value,
                ],
                { queryParams: { mouCustId: this.mouCustId, mode: this.pageType, ChangeMouTrxId: this.ChangeMouTrxId, changeMouTrxNo: this.changeMouTrxNo, ChangeMouCustId: this.ChangeMouCustId, ChangeMouStatus: this.ChangeMouStatus, WfTaskListId: this.WfTaskListId } }
              );
            }
          });
      }
      else {
        mouCustFormData["ChangeMouCustId"] = this.tempChangeMouCustId;
        mouCustFormData["ChangeMouTrxId"] = this.tempChangeMouTrxId;
        this.httpClient
          .post(URLConstant.EditChangeMou, mouCustFormData)
          .subscribe((response) => {
            this.toastr.successMessage(response["Message"]);
            this.changeMouTrxNo = response["ChangeMouTrxNo"];
            this.ChangeMouCustId = response["ChangeMouCustId"];
            this.ChangeMouStatus = response["Status"];
            this.ChangeMouTrxId = response["ChangeMouTrxId"];

            this.router.navigate(
              [
                NavigationConstant.CHANGE_MOU_REQ_DETAIL_CUSTOMER,
                this.MOUMainInfoForm.controls.MrMouTypeCode.value,
              ],
              { queryParams: { mouCustId: this.mouCustId, mode: this.pageType, ChangeMouTrxId: this.ChangeMouTrxId, changeMouTrxNo: this.changeMouTrxNo, ChangeMouCustId: this.ChangeMouCustId, ChangeMouStatus: this.ChangeMouStatus, WfTaskListId: this.WfTaskListId } }
            );
          });
      }

    } else {
      mouCustFormData["ChangeMouTrxId"] = this.ChangeMouTrxId;
      this.httpClient
        .post(URLConstant.EditChangeMou, mouCustFormData)
        .subscribe((response) => {
          this.toastr.successMessage(response["Message"]);
          this.changeMouTrxNo = response["ChangeMouTrxNo"];
          this.router.navigate([NavigationConstant.CHANGE_MOU_REQ_DETAIL_CUSTOMER, this.MOUMainInfoForm.controls.MrMouTypeCode.value,],
            { queryParams: { mouCustId: this.mouCustId, ChangeMouTrxId: this.ChangeMouTrxId, changeMouTrxNo: this.changeMouTrxNo, mode: this.pageType, WfTaskListId: this.WfTaskListId, ChangeMouCustId: this.ChangeMouCustId } }
          );
        });
    }
  }
}
