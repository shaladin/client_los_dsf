import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { Location, DatePipe, formatDate } from "@angular/common";
import { InputLookupObj } from "app/shared/model/InputLookupObj.Model";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { KeyValueObj } from "app/shared/model/KeyValue/KeyValueObj.Model";
import { ExceptionConstant } from "app/shared/constant/ExceptionConstant";
import { ClaimWorkflowObj } from "app/shared/model/Workflow/ClaimWorkflowObj.Model";
import { NavigationConstant } from "app/shared/constant/NavigationConstant";
import { GenericObj } from "app/shared/model/Generic/GenericObj.Model";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CookieService } from "ngx-cookie";

@Component({
  selector: "app-change-mou-request-detail",
  templateUrl: "./change-mou-request-detail.component.html",
  providers: [NGXToastrService],
})
export class ChangeMouRequestDetailComponent implements OnInit {
  mouType: string;
  WfTaskListId: number;
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
  changeMouTrxNo : string;
  ChangeMouCustId: number;
  ChangeMouStatus : string;
  responseChangeMouObj: any;
  datePipe = new DatePipe("en-US");
  ChangeMouTrxId:number;

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
    ChangeMouStatus : [""],
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
    private cookieService: CookieService
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
    this.http
      .post(URLConstant.GetRefMasterListKeyValueActiveByCode, {
        RefMasterTypeCode: CommonConstant.CHANGE_MOU_TYPE,
      })
      .subscribe((response) => {
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
      this.http
        .post(URLConstant.GetLatestChangeMouCustVersionById, mouCust)
        .subscribe((response) => {
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

                this.MOUMainInfoForm.patchValue({
                  ...response,
                });

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

            this.MOUMainInfoForm.patchValue({
              ...response,
            });
            console.log(response);
            this.MOUMainInfoForm.controls.MrChangeMouTypeCode.disable();
          }
          this.responseChangeMouObj = response;
          this.CheckMouChangeType(this.responseChangeMouObj.MrChangeMouTypeCode);
        });     
    } else {
      this.MOUMainInfoForm.patchValue({
        MrChangeMouTypeCode: this.mouType,
      });
      this.CheckMouChangeType(this.mouType);
    }

    var obj = {Id: this.mouCustId}
    await this.http.post(URLConstant.GetChangeMouByMouCustIdStatusNew, obj).toPromise().then(
      (response) => {
        console.log(response)
        if(response["ChangeMouTrxId"] != 0)
        {
          this.changeMouTrxNo = response["ChangeMouTrxNo"];
          this.ChangeMouCustId = response["ChangeMouCustId"];
          this.ChangeMouStatus = response["Status"];
          this.ChangeMouTrxId = response["ChangeMouTrxId"];
          
          this.router.navigate(
            [
              NavigationConstant.CHANGE_MOU_REQ_DETAIL_CUSTOMER,
              this.MOUMainInfoForm.controls.MrMouTypeCode.value,
            ],
            { queryParams: { mouCustId: this.mouCustId , mode: this.pageType, ChangeMouTrxId: this.ChangeMouTrxId, changeMouTrxNo : this.changeMouTrxNo , ChangeMouCustId : this.ChangeMouCustId, ChangeMouStatus : this.ChangeMouStatus , WfTaskListId: this.WfTaskListId} }
          );
        }   
      }
    );
  }

  
   ClaimTask() {
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
     this.httpClient.post(URLConstant.ClaimTask, wfClaimObj).subscribe();
  }
  
  MouChangeTypeEvent(event){
    this.CheckMouChangeType(event.target.value);
  }

  CheckMouChangeType(trxType){
    if(trxType == CommonConstant.CHANGE_MOU_TRX_TYPE_REQ_EXP){
      this.MOUMainInfoForm.patchValue({
        ...this.responseChangeMouObj
      });

      this.MOUMainInfoForm.patchValue({
        MrChangeMouTypeCode: trxType,
        EndDt: formatDate(this.businessDt, 'yyyy-MM-dd', 'en-US')
      });
      this.MOUMainInfoForm.controls.EndDt.disable();
      this.MOUMainInfoForm.controls.RefNo.disable();
      this.MOUMainInfoForm.controls.PlafondAmt.disable();
      this.MOUMainInfoForm.controls.Notes.disable();
    }
    if(trxType == CommonConstant.CHANGE_MOU_TRX_TYPE_CHANGE_MOU){
      this.MOUMainInfoForm.controls.EndDt.enable();
      this.MOUMainInfoForm.controls.RefNo.enable();
      this.MOUMainInfoForm.controls.PlafondAmt.enable();
      this.MOUMainInfoForm.controls.Notes.enable();
    }
  }

  Back(): void {
    this.location.back();
  }

  Save(enjiForm) {
    var mouCustFormData = this.MOUMainInfoForm.getRawValue();

    var userContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.refOfficeId = userContext.OfficeId;
    this.businessDt = userContext.BusinessDt;

    if(this.MOUMainInfoForm.controls.EndDt.value<= this.datePipe.transform(this.businessDt, "yyyy-MM-dd")  && this.MOUMainInfoForm.controls.MrChangeMouTypeCode.value == CommonConstant.CHANGE_MOU_TRX_TYPE_CHANGE_MOU ){
      this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LESS_THAN +  this.datePipe.transform(this.businessDt, 'MMMM d, y')  );
     return;
    }

    if (this.pageType == "edit") 
    {
      mouCustFormData["RefOfficeId"] = this.refOfficeId;
      mouCustFormData["Status"] = "NEW";
      mouCustFormData[
        "TrxType"
      ] = this.MOUMainInfoForm.controls.MrChangeMouTypeCode.value;
      mouCustFormData["Version"] = 0;
      mouCustFormData["RequestDate"] = this.businessDt;

        this.httpClient
        .post(URLConstant.AddChangeMou, mouCustFormData)
        .subscribe((response) => {
          this.toastr.successMessage(response["Message"]);
          this.changeMouTrxNo = response["ChangeMouTrxNo"];
          this.ChangeMouCustId = response["ChangeMouCustId"];
          this.ChangeMouStatus = response["Status"];
          this.ChangeMouTrxId = response["ChangeMouTrxId"];
          if(mouCustFormData["TrxType"] == CommonConstant.CHANGE_MOU_TRX_TYPE_REQ_EXP){
            this.location.back();
          }else{
            this.router.navigate(
              [
                NavigationConstant.CHANGE_MOU_REQ_DETAIL_CUSTOMER,
                this.MOUMainInfoForm.controls.MrMouTypeCode.value,
              ],
              { queryParams: { mouCustId: this.mouCustId , mode: this.pageType , ChangeMouTrxId: this.ChangeMouTrxId, changeMouTrxNo : this.changeMouTrxNo , ChangeMouCustId : this.ChangeMouCustId, ChangeMouStatus : this.ChangeMouStatus , WfTaskListId: this.WfTaskListId} }
            );
          }       
        });
    }else{
      this.toastr.successMessage("Success");
      this.router.navigate([NavigationConstant.CHANGE_MOU_REQ_DETAIL_CUSTOMER, this.MOUMainInfoForm.controls.MrMouTypeCode.value,],
        { queryParams: { mouCustId: this.mouCustId, ChangeMouTrxId: this.ChangeMouTrxId, mode: this.pageType, WfTaskListId: this.WfTaskListId, ChangeMouCustId : this.ChangeMouCustId} }
      );
     }
    
  }
}
