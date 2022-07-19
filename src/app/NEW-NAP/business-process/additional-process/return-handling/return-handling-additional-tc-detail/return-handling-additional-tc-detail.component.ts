import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ReturnHandlingDObj } from 'app/shared/model/return-handling/return-handling-d-obj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppTCObj } from 'app/shared/model/app-tc-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { ReqTCObj } from 'app/shared/model/req-tc-obj.model';
import { formatDate } from '@angular/common';
import { map, mergeMap } from 'rxjs/operators';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResReturnHandlingDObj } from 'app/shared/model/response/return-handling/res-return-handling-d-obj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { environment } from 'environments/environment';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';

@Component({
  selector: 'app-return-handling-additional-tc-detail',
  templateUrl: './return-handling-additional-tc-detail.component.html',
  providers: [NGXToastrService]
})
export class ReturnHandlingAdditionalTcDetailComponent implements OnInit {

  getRefTcUrl: string;
  isReturnHandling: boolean = false;
  modal: any;
  closeResult: any;
  mode: string;
  currentEditedIndex: number;
  defaultDocType: string;
  CustType: string;
  appId: number;
  returnHandlingHId: number;
  wfTaskListId: any;
  // AppObj: any;
  returnHandlingDObj: ResReturnHandlingDObj = new ResReturnHandlingDObj();
  ReturnHandlingDData: ReturnHandlingDObj;
  BizTemplateCode: string;
  listAddTc: Array<AppTCObj> = new Array<AppTCObj>();
  appTcObj: Array<AppTCObj> = new Array<AppTCObj>();
  listTcCode: Array<AppTCObj> = new Array<AppTCObj>();
  inputGridObj: InputGridObj;
  ReqTCObj = new ReqTCObj();
  IsViewReady: boolean = false;
  maxPromisedDt: Date;
  currentUserContext: CurrentUserContext;

  ReturnHandlingForm = this.fb.group({
    ExecNotes: ['', Validators.maxLength(4000)],
    AppTcs: this.fb.array([])
  });

  AddTcForm = this.fb.group({
    TcName: ['', [Validators.required, Validators.maxLength(50)]],
    Notes: ['', [Validators.maxLength(50)]]
  });

  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_ADD_TC_PAGING;
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router,
    private modalService: NgbModal, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {

    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
      if (params['ReturnHandlingHId'] != null) {
        this.returnHandlingHId = params['ReturnHandlingHId'];
        this.isReturnHandling = true;
      }
      if (params['WfTaskListId'] != null) {
        this.wfTaskListId = params['WfTaskListId'];
      }
    });
  }

  initExistingTc() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppTc.json";

    this.http.post(URLConstant.GetListExistingTCbyAppId, { Id: this.appId }).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["AppTcs"]
      });
  }

  async ngOnInit(): Promise<void> {
    this.currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.maxPromisedDt = this.currentUserContext.BusinessDt;
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.IsViewReady = true;
    this.claimTask();
    this.initExistingTc();
    // await this.GetAppData();
    this.getCustType();
    if (this.isReturnHandling == true) {
      this.MakeViewReturnInfoObj();
    }
    this.http.post(URLConstant.GetListNewTCbyAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.listAddTc = response["AppTcs"];
        var fa_apptc = this.ReturnHandlingForm.get("AppTcs") as FormArray;
        for (const item of response["AppTcs"] as Array<AppTCObj>) {
          fa_apptc.push(this.AddTcControl(item));
        }
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  Back() {
    // var listAppTcObj = new Array<AppTCObj>();
    // for (var i = 0; i < this.ReturnHandlingForm.value.AppTcs["length"]; i++) {
    //   var appTC = new AppTCObj();
    //   appTC.AppTcId = this.ReturnHandlingForm.value.AppTcs[i].AppTcId;
    //   appTC.AppId = this.appId;
    //   appTC.TcCode = this.ReturnHandlingForm.value.AppTcs[i].TcCode;
    //   appTC.TcName = this.ReturnHandlingForm.value.AppTcs[i].TcName;
    //   appTC.PriorTo = this.ReturnHandlingForm.value.AppTcs[i].PriorTo;
    //   appTC.IsChecked = this.ReturnHandlingForm.value.AppTcs[i].IsChecked;
    //   appTC.ExpiredDt = this.ReturnHandlingForm.value.AppTcs[i].ExpiredDt;
    //   appTC.IsMandatory = this.ReturnHandlingForm.value.AppTcs[i].IsMandatory;
    //   appTC.PromisedDt = this.ReturnHandlingForm.value.AppTcs[i].PromisedDt;
    //   appTC.Notes = this.ReturnHandlingForm.value.AppTcs[i].Notes;
    //   appTC.IsAdditional = this.ReturnHandlingForm.value.AppTcs[i].IsAdditional;
    //   appTC.IsExpDtMandatory = this.ReturnHandlingForm.value.AppTcs[i].IsExpDtMandatory;

    //   var prmsDt = new Date(appTC.PromisedDt);
    //   var prmsDtForm = this.ReturnHandlingForm.value.AppTcs[i].PromisedDt;

    //   listAppTcObj.push(appTC);
    // }
    // this.ReqTCObj.ListAppTcObj = listAppTcObj;
    // this.http.post(URLConstant.DeleteRangeAppTc, this.ReqTCObj).subscribe(
    //   (response) => {
    //     var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    //     this.router.navigate(["/Nap/AddProcess/ReturnHandlingAddTc/Paging"], { queryParams: { BizTemplateCode: lobCode } });
    //   }
    // );
  }

  SaveForm() {
    if (this.isReturnHandling == false) {

    }
    if (this.isReturnHandling == true) {
      // this.setAddTc();
      this.setReturnHandlingD();

      var listAppTcObj = new Array<AppTCObj>();
      for (var i = 0; i < this.ReturnHandlingForm.value.AppTcs["length"]; i++) {
        var appTC = new AppTCObj();
        appTC.AppTcId = this.ReturnHandlingForm.value.AppTcs[i].AppTcId;
        appTC.AppId = this.appId;
        appTC.TcCode = this.ReturnHandlingForm.value.AppTcs[i].TcCode;
        appTC.TcName = this.ReturnHandlingForm.value.AppTcs[i].TcName;
        appTC.PriorTo = this.ReturnHandlingForm.value.AppTcs[i].PriorTo;
        appTC.IsChecked = this.ReturnHandlingForm.value.AppTcs[i].IsChecked;
        appTC.ExpiredDt = this.ReturnHandlingForm.value.AppTcs[i].ExpiredDt;
        appTC.IsMandatory = this.ReturnHandlingForm.value.AppTcs[i].IsMandatory;
        appTC.PromisedDt = this.ReturnHandlingForm.value.AppTcs[i].PromisedDt;
        appTC.Notes = this.ReturnHandlingForm.value.AppTcs[i].Notes;
        appTC.IsAdditional = this.ReturnHandlingForm.value.AppTcs[i].IsAdditional;
        appTC.IsExpDtMandatory = this.ReturnHandlingForm.value.AppTcs[i].IsExpDtMandatory;
        appTC.RowVersion = this.ReturnHandlingForm.value.AppTcs[i].RowVersion;

        var prmsDt = new Date(appTC.PromisedDt);
        var prmsDtForm = this.ReturnHandlingForm.value.AppTcs[i].PromisedDt;

        listAppTcObj.push(appTC);
      }
      this.ReqTCObj.ListAppTcObj = listAppTcObj;
      this.http.post(URLConstant.EditAdditionalTcNew, this.ReqTCObj).pipe(
        map((response) => {
          if (response["StatusCode"] == 200) {
            return response;
          }
          else {
            throw new Error(response["Message"]);
          }
        }),
        mergeMap((response) => {
          let EditReturnHandlingDUrl = environment.isCore ? URLConstant.EditReturnHandlingDV2 : URLConstant.EditReturnHandlingD;
          return this.http.post(EditReturnHandlingDUrl, this.ReturnHandlingDData);
        })
      ).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_ADD_TC_PAGING], { BizTemplateCode: lobCode });
        },
        (error) => {
          console.log(error);
        }
      );

    }
  }

  setReturnHandlingD() {
    this.ReturnHandlingDData = new ReturnHandlingDObj();
    this.ReturnHandlingDData.ReturnHandlingDId = this.returnHandlingDObj.ReturnHandlingDId;
    this.ReturnHandlingDData.ReturnHandlingHId = this.returnHandlingDObj.ReturnHandlingHId;
    this.ReturnHandlingDData.MrReturnTaskCode = this.returnHandlingDObj.MrReturnTaskCode;
    this.ReturnHandlingDData.ReturnStat = this.returnHandlingDObj.ReturnStat;
    this.ReturnHandlingDData.ReturnHandlingNotes = this.returnHandlingDObj.ReturnHandlingNotes;
    this.ReturnHandlingDData.ReturnHandlingExecNotes = this.ReturnHandlingForm.controls["ExecNotes"].value;
    this.ReturnHandlingDData.WfTaskListId = this.wfTaskListId;
    this.ReturnHandlingDData.RowVersion = this.returnHandlingDObj.RowVersion;
  }

  setAddTc() {
    console.log(this.ReturnHandlingForm);
    // var listAppTcObj = new Array<AppTCObj>();
    // for (var i = 0; i < this.ReturnHandlingForm.value.AppTcs["length"]; i++) {
    //   var appTC = new AppTCObj();
    //   appTC.AppId = this.appId;
    //   appTC.TcCode = this.ReturnHandlingForm.value.AppTcs[i].TcCode;
    //   appTC.TcName = this.ReturnHandlingForm.value.AppTcs[i].TcName;
    //   appTC.PriorTo = this.ReturnHandlingForm.value.AppTcs[i].PriorTo;
    //   appTC.IsChecked = this.ReturnHandlingForm.value.AppTcs[i].IsChecked;
    //   appTC.ExpiredDt = this.ReturnHandlingForm.value.AppTcs[i].ExpiredDt;
    //   appTC.IsMandatory = this.ReturnHandlingForm.value.AppTcs[i].IsMandatory;
    //   appTC.PromisedDt = this.ReturnHandlingForm.value.AppTcs[i].PromisedDt;
    //   appTC.Notes = this.ReturnHandlingForm.value.AppTcs[i].Notes;
    //   appTC.IsAdditional = this.ReturnHandlingForm.value.AppTcs[i].IsAdditional;

    //   var prmsDt = new Date(appTC.PromisedDt);
    //   var prmsDtForm = this.ReturnHandlingForm.value.AppTcs[i].PromisedDt;

    //   listAppTcObj.push(appTC);
    // }
    // // this.ReqTCObj.ListAppTcObj = this.listAppTcObj;
    // this.ReqTCObj.ListAppTcObj = listAppTcObj;
    // if (this.mode == "edit") {
    //   this.http.post(URLConstant.EditAppTc, this.ReqTCObj).subscribe(
    //     (response) => {
    //       this.toastr.successMessage(response["message"]);
    //       var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    //       this.router.navigate(["/Nap/AddProcess/ReturnHandlingAddTc/Paging"], { queryParams: { BizTemplateCode: lobCode } });
    //     });
    // } 
  }

  SaveAdditionalTCHandler() {
    // if(!this.ReturnHandlingForm.invalid){
    var listAppTcObj = new Array<AppTCObj>();
    for (var i = 0; i < this.ReturnHandlingForm.value.AppTcs["length"]; i++) {
      var appTC = new AppTCObj();
      appTC.AppTcId = this.ReturnHandlingForm.value.AppTcs[i].AppTcId;
      appTC.AppId = this.appId;
      appTC.TcCode = this.ReturnHandlingForm.value.AppTcs[i].TcCode;
      appTC.TcName = this.ReturnHandlingForm.value.AppTcs[i].TcName;
      appTC.PriorTo = this.ReturnHandlingForm.value.AppTcs[i].PriorTo;
      appTC.IsChecked = this.ReturnHandlingForm.value.AppTcs[i].IsChecked;
      appTC.ExpiredDt = this.ReturnHandlingForm.value.AppTcs[i].ExpiredDt;
      appTC.IsMandatory = this.ReturnHandlingForm.value.AppTcs[i].IsMandatory;
      appTC.PromisedDt = this.ReturnHandlingForm.value.AppTcs[i].PromisedDt;
      appTC.Notes = this.ReturnHandlingForm.value.AppTcs[i].Notes;
      appTC.IsAdditional = this.ReturnHandlingForm.value.AppTcs[i].IsAdditional;
      appTC.IsExpDtMandatory = this.ReturnHandlingForm.value.AppTcs[i].IsExpDtMandatory;
      appTC.RowVersion = this.ReturnHandlingForm.value.AppTcs[i].RowVersion;

      var prmsDt = new Date(appTC.PromisedDt);
      var prmsDtForm = this.ReturnHandlingForm.value.AppTcs[i].PromisedDt;

      listAppTcObj.push(appTC);
    }
    // this.ReqTCObj.ListAppTcObj = this.listAppTcObj;
    this.ReqTCObj.ListAppTcObj = listAppTcObj;
    this.http.post(URLConstant.EditAdditionalTcNew, this.ReqTCObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["Message"]);
        var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_ADD_TC_PAGING], { BizTemplateCode: lobCode });
      }
    );
    // }
    // else{
    //   this.toastr.warningMessage("Please Complete TC");
    // }
  }

  // async GetAppData() {
  //   await this.http.post(URLConstant.GetAppById, { Id: this.appId }).toPromise().then(
  //     (response) => {
  //       this.AppObj = response;
  //     }
  //   );
  // }

  MakeViewReturnInfoObj() {
    if (this.returnHandlingHId > 0) {
      let ReqByIdAndCodeObj = new GenericObj();
      ReqByIdAndCodeObj.Id = this.returnHandlingHId;
      ReqByIdAndCodeObj.Code = CommonConstant.ReturnHandlingAddTc;
      this.http.post(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, ReqByIdAndCodeObj).subscribe(
        (response : ResReturnHandlingDObj) => {
          this.returnHandlingDObj = response;
        });
    }
  }

  getCustType() {
    this.http.post(URLConstant.GetAppCustByAppId, { Id: this.appId }).toPromise().then(
      (response) => {
        this.CustType = response["MrCustTypeCode"];
        if (this.CustType == CommonConstant.CustTypePersonal) {
          this.getRefTcUrl = URLConstant.GetListRefTcPersonal;
        } else if (this.CustType == CommonConstant.CustTypeCompany) {
          this.getRefTcUrl = URLConstant.GetListRefTcCompany;
        }
      }
    );
  }

  bindRefTcObj() {
    this.http.post(URLConstant.GetListTCbyAppId, { Id: this.appId }).subscribe(
      (response) => {
        this.listTcCode = response["AppTcs"]
        this.http.post(this.getRefTcUrl, {}).subscribe(
          (response) => {
            var result = response[CommonConstant.ReturnObj];
            var listTcCodes = new Array();
            for (var i = 0; i < this.listTcCode.length; i++) {
              listTcCodes.push(this.listTcCode[i]["TcCode"]);
            }
            var curr = this.listAddedTc();
            console.log(curr);
            for (var j = 0; j < result.length; j++) {
              if (!listTcCodes.includes(result[j].TcCode) && !curr.includes(result[j].TcName)) {
                this.appTcObj.push(result[j]);
              }
            }
            this.AddTcForm.patchValue({
              TcName: this.appTcObj[0].TcName,
            });
            if (this.appTcObj.length > 0) {
              this.defaultDocType = this.appTcObj[0].TcCode;
            }
          }
        );
      }
    );
  }

  listAddedTc() {
    var listAddedTc = new Array();
    for (var x = 0; x < this.listAddTc.length; x++) {
      listAddedTc.push(this.listAddTc[x]["TcName"])
    }
    return listAddedTc;
  }
  AddNewTc() {
    var appTcObj = new AppTCObj();
    if (this.listAddTc == undefined) {
      this.listAddTc = new Array<AppTCObj>();
    }
    appTcObj.TcName = this.AddTcForm.controls.TcName.value;
    appTcObj.Notes = this.AddTcForm.controls.Notes.value;
    appTcObj.TcCode = this.appTcObj.find(i => i["TcName"] == this.AddTcForm.controls.TcName.value)["TcCode"];
    appTcObj.IsMandatory = true;
    appTcObj.AppId = this.appId;
    appTcObj.IsAdditional = true;
    appTcObj.PriorTo = "APP";
    appTcObj.IsChecked = false;
    appTcObj.IsExpDtMandatory = false;

    var fa_apptc = this.ReturnHandlingForm.get("AppTcs") as FormArray;

    if (this.mode == "Add") {
      this.listAddTc.push(appTcObj);
      this.ReqTCObj.ListAppTcObj = new Array<AppTCObj>();
      this.ReqTCObj.ListAppTcObj.push(appTcObj);
      this.http.post(URLConstant.GetDocIsExpDtMandatory, { Code: appTcObj.TcCode }).subscribe(
        (response) => {
          console.log("IsExpDate: " + JSON.stringify(response));
          if (response["DocCode"]) {
            appTcObj.IsExpDtMandatory = response["IsExpDtMandatory"];
          }
          this.http.post(URLConstant.AddAppTc, this.ReqTCObj).subscribe(
            (response: any) => {
              var ResponseObj = response[CommonConstant.ReturnObj];
              appTcObj.AppTcId = ResponseObj[0].Id;
              appTcObj.RowVersion = ResponseObj[0].RowVersion;
              fa_apptc.push(this.AddTcControl(appTcObj));
            });
        }
      );
    }
    // if (this.mode == "Edit") {
    //   this.listAddTc[this.currentEditedIndex] = appTcObj;
    // }
    this.modal.close();
    this.clearForm();
  }

  IsCheckedHandler(idx) {
    //bookmark
    var fa_apptc = this.ReturnHandlingForm.get("AppTcs") as FormArray;
    var group = fa_apptc.at(idx) as FormGroup;
    group.patchValue({
      ExpiredDt: "",
      PromisedDt: ""
    });
    if (group.controls["IsChecked"].value) {
      group.controls["PromisedDt"].clearValidators();
      group.controls["PromisedDt"].updateValueAndValidity();
      group.controls["PromisedDt"].disable();
      if (group.controls["IsExpDtMandatory"]) {
        group.controls["ExpiredDt"].setValidators([Validators.required]);
        group.controls["ExpiredDt"].updateValueAndValidity();
        group.controls["ExpiredDt"].enable();
      }
      else {
        group.controls["ExpiredDt"].clearValidators();
        group.controls["ExpiredDt"].updateValueAndValidity();
        group.controls["ExpiredDt"].disable();
      }
    }
    else {
      group.controls["ExpiredDt"].clearValidators();
      group.controls["ExpiredDt"].updateValueAndValidity();
      group.controls["ExpiredDt"].disable();
      group.controls["PromisedDt"].setValidators([Validators.required]);
      group.controls["PromisedDt"].updateValueAndValidity();
      group.controls["PromisedDt"].enable();
    }
  }

  async getExpDtMandatory(TcCode) {
    console.log("getExpDtMandatory Code: " + TcCode);
    await this.http.post(URLConstant.GetDocIsExpDtMandatory, { Code: TcCode }).subscribe(
      (response) => {
        console.log("getExpDtMandatory: " + JSON.stringify(response));
        var isExpDateMandatory = false;
        if (response["DocCode"]) {
          isExpDateMandatory = response["IsExpDtMandatory"];
        }
        return isExpDateMandatory;
      }
    );
  }

  ExpDtHandler(e, idx) {
    var formArray = this.ReturnHandlingForm.controls['AppTcs'] as FormArray;
    formArray.at(idx).patchValue({
      ExpiredDt: ""
    });
    if (e.target.checked) {
      formArray.at(idx).get("ExpiredDt").setValidators([Validators.required]);
      formArray.at(idx).get("ExpiredDt").updateValueAndValidity();
      formArray.at(idx).get("ExpiredDt").enable();
    }
    else {
      formArray.at(idx).get("ExpiredDt").clearValidators();
      formArray.at(idx).get("ExpiredDt").updateValueAndValidity();
      formArray.at(idx).get("ExpiredDt").disable();
    }
  }

  add(content) {
    this.mode = "Add"
    this.open(content);
    this.appTcObj = new Array<AppTCObj>();
    this.bindRefTcObj();
  }

  // edit(i, content) {
  //   this.clearForm();
  //   this.mode = "Edit";
  //   this.currentEditedIndex = i;
  //   this.AddTcForm.patchValue({
  //     TcName: this.listAddTc[i].TcName,
  //     Notes: this.listAddTc[i].Notes,
  //   });
  //   this.open(content);
  // }

  open(content) {
    this.modal = this.modalService.open(content);
    this.modal.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  delete(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.http.post(URLConstant.DeleteAppTc, this.listAddTc[i]).subscribe(
        (response) => {
          if (response["StatusCode"] == 200) {
            var apptcObjs = this.ReturnHandlingForm.controls["AppTcs"] as FormArray;
            apptcObjs.removeAt(i);
            this.listAddTc.splice(i, 1);
          }
          else {
            throw new Error(response["Message"]);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  AddTcControl(obj: AppTCObj) {
    var formGroup = this.fb.group({
      AppTcId: obj.AppTcId,
      TcName: obj.TcName,
      TcCode: obj.TcCode,
      PriorTo: obj.PriorTo,
      IsChecked: obj.IsChecked,
      IsMandatory: obj.IsMandatory,
      PromisedDt: [(obj.PromisedDt == null) ? '' : formatDate(obj.PromisedDt, 'yyyy-MM-dd', 'en-US'), [Validators.required]],
      ExpiredDt: [{ value: (obj.ExpiredDt == null) ? '' : formatDate(obj.ExpiredDt, 'yyyy-MM-dd', 'en-US'), disabled: obj.IsExpDtMandatory }],
      Notes: obj.Notes,
      IsExpDtMandatory: obj.IsExpDtMandatory,
      IsAdditional: obj.IsAdditional,
      RowVersion: obj.RowVersion,
    });

    if (obj.IsChecked) {
      formGroup.controls["PromisedDt"].clearValidators();
      formGroup.controls["PromisedDt"].updateValueAndValidity();
      formGroup.controls["PromisedDt"].disable();
      if (formGroup.controls["IsExpDtMandatory"]) {
        formGroup.controls["ExpiredDt"].setValidators([Validators.required]);
        formGroup.controls["ExpiredDt"].updateValueAndValidity();
        formGroup.controls["ExpiredDt"].enable();
      }
      else {
        formGroup.controls["ExpiredDt"].clearValidators();
        formGroup.controls["ExpiredDt"].updateValueAndValidity();
        formGroup.controls["ExpiredDt"].disable();
      }
    }
    else {
      formGroup.controls["ExpiredDt"].clearValidators();
      formGroup.controls["ExpiredDt"].updateValueAndValidity();
      formGroup.controls["ExpiredDt"].disable();
      formGroup.controls["PromisedDt"].setValidators([Validators.required]);
      formGroup.controls["PromisedDt"].updateValueAndValidity();
      formGroup.controls["PromisedDt"].enable();
    }

    return formGroup;
    // return this.fb.group({
    //   AppTcId: obj.AppTcId,
    //   TcName: obj.TcName,
    //   TcCode: obj.TcCode,
    //   PriorTo: obj.PriorTo,
    //   IsChecked: obj.IsChecked,
    //   IsMandatory: obj.IsMandatory,
    //   PromisedDt: [(obj.PromisedDt == null) ? '' : formatDate(obj.PromisedDt, 'yyyy-MM-dd', 'en-US'), [Validators.required]],
    //   ExpiredDt: [{value: (obj.ExpiredDt == null) ? '' : formatDate(obj.ExpiredDt, 'yyyy-MM-dd', 'en-US'), disabled: obj.IsExpDtMandatory}],
    //   Notes: obj.Notes,
    //   IsExpDtMandatory: obj.IsExpDtMandatory,
    //   IsAdditional: obj.IsAdditional
    // })
  }

  clearForm() {
    this.AddTcForm = this.fb.group({
      TcName: ['', [Validators.required, Validators.maxLength(50)]],
      Notes: ['', [Validators.maxLength(50)]],
    });
  }

  cancel() {
    this.modal.close();
  }

  claimTask(){
    if(environment.isCore){
      if(this.wfTaskListId!= "" && this.wfTaskListId!= undefined){
          this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
      }
    }
    else if (this.wfTaskListId> 0) {
      this.claimTaskService.ClaimTask(this.wfTaskListId);
    }
  }
}
