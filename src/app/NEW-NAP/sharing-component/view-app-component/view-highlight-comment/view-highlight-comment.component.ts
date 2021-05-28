import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCustAddrForViewObj } from 'app/shared/model/AppCustAddr/AppCustAddrForViewObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { CustHighlightCommentObj } from 'app/shared/model/CustHighlightCommentObj.Model';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';


@Component({
  selector: 'app-view-highlight-comment',
  templateUrl: './view-highlight-comment.component.html'
})
export class ViewHighlightCommentComponent implements OnInit {


  @Input() appId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();

  // viewMainDataObj:  UcViewGenericObj = new UcViewGenericObj();
  // viewJobDataProfObj:  UcViewGenericObj = new UcViewGenericObj();
  // viewJobDataEmpObj:  UcViewGenericObj = new UcViewGenericObj();
  // viewJobDataSmeObj:  UcViewGenericObj = new UcViewGenericObj();
  // viewJobDataNonProfObj:  UcViewGenericObj = new UcViewGenericObj();
  // viewFinDataObj:  UcViewGenericObj = new UcViewGenericObj();

  // arrValue = [];

  CustId: number;

  appCustObj: AppCustObj;
  appCustAddrForViewObjs: Array<AppCustAddrForViewObj>;
  listCustHighlightCommentObj: Array<CustHighlightCommentObj> = new Array<CustHighlightCommentObj>();
  custHighlightCommentObj: CustHighlightCommentObj;

  isView: boolean = false;
  InputDt: any;
  Comment: any;
  InputBy: any;
  AppNo: string = "-";

  IsInput: boolean = true;

  HighlightCommenForm = this.fb.group({
    Notes: ['']
  });


  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder) {
  }

  async ngOnInit(): Promise<void> {
    var reqObj = { AppId: this.appId }
    await this.http.post(URLConstant.GetCustDataPersonalForViewByAppId, reqObj).toPromise().then(
      (response) => {
        //console.log(response);
        this.appCustObj = response["AppCustObj"];
        this.GetCustObj(this.appCustObj.CustNo)
      });
    await this.http.post(URLConstant.GetAppById, reqObj).toPromise().then(
      (response) => {
        //console.log(response);
        this.AppNo = response["AppNo"];
      });
  }

  GetCustObj(CustNo) {
    var DealerCustNoObj = { CustNo: CustNo };
    this.http.post(URLConstant.GetCustByCustNo, DealerCustNoObj).subscribe(
      response => {
        // this.InputLookupCustomerObj.nameSelect = response["CustName"];
        // this.InputLookupCustomerObj.jsonSelect = { CustName: response["CustName"] };
        console.log(response);
        this.CustId = response["CustId"];
        this.GetListCustHighlightComment();
      }
    );
  }
  GetListCustHighlightComment() {
    console.log('richard check');
    this.listCustHighlightCommentObj = new Array<CustHighlightCommentObj>()
    var reqObjForAppCustHighlightComment = {
      AppId: this.appId
    }

    this.http.post(URLConstant.GetAppCustHighlightCommentByAppId, reqObjForAppCustHighlightComment).subscribe(
      response => {

        if (this.listCustHighlightCommentObj === null) {
          this.listCustHighlightCommentObj = new Array<CustHighlightCommentObj>()
        }
        var IdAppCustHC = 1;
        for (var Obj of response["ReturnObject"]) {
          var temp = new CustHighlightCommentObj();
          temp.CustNo = Obj.CustNo;
          temp.Comment = Obj.Comment;
          temp.CustHighlightCommentId = IdAppCustHC;
          temp.AppId = Obj.AppId;
          temp.AppNo = Obj.AppNo;
          temp.InputBy = Obj.InputBy;
          temp.InputDt = Obj.InputDt;
          this.listCustHighlightCommentObj.push(temp)
        }
      }
    );

  }

  Save(enjiForm) {
    var url;
    //url = URLConstant.AddCustHighlightComment;
    url = URLConstant.AddAppCustHighlightComment;

    var IdMax = this.listCustHighlightCommentObj.length;

    this.custHighlightCommentObj = new CustHighlightCommentObj()
    this.custHighlightCommentObj.AppId = this.appId;
    this.custHighlightCommentObj.AppNo = this.AppNo;
    this.custHighlightCommentObj.CustNo = this.appCustObj.CustNo;
    this.custHighlightCommentObj.Comment = this.HighlightCommenForm.controls.Notes.value;
    this.custHighlightCommentObj.InputBy = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));;
    this.custHighlightCommentObj.InputDt = new CurrentUserContext().BusinessDt;
    this.custHighlightCommentObj.CustHighlightCommentId = IdMax + 1;

    this.listCustHighlightCommentObj.push(this.custHighlightCommentObj)

    console.log(this.custHighlightCommentObj)
    this.outputTab.emit(this.custHighlightCommentObj);

    this.HighlightCommenForm.patchValue({
      Notes: ""
    });


    // this.http.post(url,this.custHighlightCommentObj ).subscribe(
    //   (response) => {
    //     this.toastr.successMessage("Saved");
    //     this.HighlightCommenForm.patchValue({
    //       Notes: ""
    //     });
    //     this.GetListCustHighlightComment(this.CustId);
    //   });
  }

  checkIsEmptyOrNot() {
    var isEmpty: Boolean = false;
    var formValue = this.HighlightCommenForm.value;
    var commentvalue = formValue["Notes"];
    if (commentvalue.length === 0 || !commentvalue.trim()) {
      isEmpty = true;
    }
    return isEmpty;
  }

  SaveCommnet() {

    // if(this.IsInput == false){
    //   this.toastr.warningMessage(ExceptionConstant.INPUT_MAX_1_COMMENT);
    //   return;
    // }

    var url;
    // url = URLConstant.AddCustHighlightComment;

    url = URLConstant.AddAppCustHighlightComment;
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    this.custHighlightCommentObj = new CustHighlightCommentObj()
    //this.custHighlightCommentObj.CustId = this.CustId;20510
    this.custHighlightCommentObj.AppId = this.appId;
    this.custHighlightCommentObj.AppNo = this.AppNo;
    //this.custHighlightCommentObj.CustNo = this.appCustObj.CustNo;
    this.custHighlightCommentObj.CustNo = this.appCustObj.CustNo;
    this.custHighlightCommentObj.Comment = this.HighlightCommenForm.controls.Notes.value;
    this.custHighlightCommentObj.InputBy = currentUserContext.UserName;
    this.custHighlightCommentObj.InputDt = currentUserContext.BusinessDt;
    console.log(this.custHighlightCommentObj)

    // this.listCustHighlightCommentObj.push(this.custHighlightCommentObj)

    console.log(this.custHighlightCommentObj)
    this.outputTab.emit(this.custHighlightCommentObj);
    this.IsInput = false;
    this.HighlightCommenForm.patchValue({
      Notes: ""
    });

    // this.http.post(url,this.custHighlightCommentObj ).subscribe(
    //   (response) => {
    //     this.toastr.successMessage("Saved");
    //     //this.GetListCustHighlightComment(this.CustId);
    //     this.HighlightCommenForm.patchValue({
    //       Notes: ""
    //     });
    //     this.IsInput = false;
    //     this.GetListCustHighlightComment(this.CustId);
    //   });
  }
  ViewHiglight(CustHighlightCommentId) {
    for (var any of this.listCustHighlightCommentObj) {
      if (any.CustHighlightCommentId == CustHighlightCommentId) {
        this.InputDt = any.InputDt;
        this.Comment = any.Comment;
        this.InputBy = any.InputBy;
        this.isView = true;
        break;
      }
    }
  }
  Back() {
    this.isView = false;
  }

}
