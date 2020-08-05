import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Validators, FormBuilder } from '@angular/forms';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-return-handling-additional-tc-detail',
  templateUrl: './return-handling-additional-tc-detail.component.html',
  providers: [NGXToastrService]
})
export class ReturnHandlingAdditionalTcDetailComponent implements OnInit {

  getAppUrl: any;
  rtnHandlingDUrl: any;
  editRtnHandlingDUrl: any;
  isReturnHandling: boolean = false;
  modal: any;
  closeResult: any;
  mode: any;
  currentEditedIndex: any;
  defaultDocType : any;

  ReturnHandlingForm = this.fb.group({
    ExecNotes: ['', Validators.maxLength(4000)],
  });
  viewObj: any;

  appId: any;
  returnHandlingHId: any;
  wfTaskListId: any;

  appObj = {
    AppId: 0,
  };

  rtnHandlingDObj = {
    ReturnHandlingDId: 0,
  };

  AddTcForm = this.fb.group({
    DocTc: ['', [Validators.required, Validators.maxLength(50)]],
    Notes: ['', [Validators.required, Validators.maxLength(50)]]
  });

  AppObj: any;
  returnHandlingDObj: any;
  ReturnHandlingDData: ReturnHandlingDObj;
  BizTemplateCode: string;
  arrValue = [];
  listAddTc : Array<AppTCObj> = new Array<AppTCObj>();
  appTcObj : Array<AppTCObj> = new Array<AppTCObj>();
  listTcCode : Array<AppTCObj> = new Array<AppTCObj>();

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router,
    private modalService: NgbModal,) {

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

  initUrl() {
    this.getAppUrl = URLConstant.GetAppById;
    this.rtnHandlingDUrl = URLConstant.GetReturnHandlingDByReturnHandlingDId;
    this.editRtnHandlingDUrl = URLConstant.EditReturnHandlingD;
  }

  async ngOnInit(): Promise<void> {
    this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
    this.ClaimTask();
    this.arrValue.push(this.appId);
    this.initUrl();
    this.appObj.AppId = this.appId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppData();
    if (this.isReturnHandling == true) {
      this.MakeViewReturnInfoObj();
    }
    this.bindRefTcObj();
  }

  SaveForm() {
    if (this.isReturnHandling == false) {

    }
    if (this.isReturnHandling == true) {
      this.setReturnHandlingD();
      this.http.post(this.editRtnHandlingDUrl, this.ReturnHandlingDData).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          var lobCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
          this.router.navigate(["/Nap/AdditionalProcess/ReturnHandlingCollateral/Paging"], { queryParams: { BizTemplateCode: lobCode } })
        });

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

  async GetAppData() {
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {

        this.AppObj = response;
      }
    );
  }

  MakeViewReturnInfoObj() {
    if (this.returnHandlingHId > 0) {
      var obj = {
        ReturnHandlingHId: this.returnHandlingHId,
        MrReturnTaskCode: CommonConstant.ReturnHandlingAddColtr
      }
      this.http.post<ReturnHandlingDObj>(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, obj).subscribe(
        (response) => {
          this.returnHandlingDObj = response;
        });
    }
  }


  bindRefTcObj() {
    this.http.post(URLConstant.GetListTCbyAppId, {appId : this.appId}).subscribe(
      (response) => {
        var result : any;
        this.listTcCode = response["AppTcs"]
        this.http.post(URLConstant.GetListActiveRefTc, {}).subscribe(
          (response) => {
            var result : any;
            result = response[CommonConstant.ReturnObj];
            for(var i =0;i<result.length;i++){
              for(var j = 0; j<this.listTcCode.length; j ++){
                if(!result[i]["TcCode"].some(x => x == this.listTcCode[j]["TcCode"])){
                  this.appTcObj = result;
                }
              }
            }
            if (this.appTcObj.length > 0) {
              this.defaultDocType = this.appObj[0]["TcCode"].Value;
            }
          }
        );
      }
    );
  }

  AddNewTc() {
    var appTcObj = new AppTCObj();
    if (this.listAddTc == undefined) {
      this.listAddTc = new Array<AppTCObj>();
    }
    if (this.mode == "Add") {
      this.listAddTc.push(appTcObj);
    }
    if (this.mode == "Edit") {
      this.listAddTc[this.currentEditedIndex] = appTcObj;
    }
    this.modal.close();
    this.clearForm();
  }

  add(content) {
    this.mode= "add"
    this.open(content);
  }

  edit(i, content) {
    this.clearForm();
    this.mode = "Edit";
    this.currentEditedIndex = i;
    this.AddTcForm.patchValue({
      DocTc: this.listAddTc[i].TcName,
      Notes: this.listAddTc[i].Notes,
    });
    this.open(content);
  }

  open(content) {
    this.modal = this.modalService.open(content);
    this.modal.result.then((result) => {
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

  delete(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.listAddTc.splice(i, 1);
    }
  }

  clearForm() {
    this.AddTcForm = this.fb.group({
      DocTc: [this.defaultDocType, [Validators.required, Validators.maxLength(50)]],
      DocNo: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  AddEdit(AppCollateralId) {
    if (this.isReturnHandling == false) {
    }
    if (this.isReturnHandling == true) {
      this.router.navigateByUrl("/Nap/AdditionalProcess/ReturnHandlingCollateral/Detail?AppId=" + this.appId + "&AppCollateralId=" + AppCollateralId + "&ReturnHandlingHId=" + this.returnHandlingHId + "&WfTaskListId=" + this.wfTaskListId);
    }
  }

  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.wfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
}
