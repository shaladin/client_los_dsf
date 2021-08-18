import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { UcDropdownListCallbackObj, UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { ReqAddNapFromCopyObj, ReqAddNapObj } from 'app/shared/model/Request/NAP/NewApplication/ReqAddNapObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';

@Component({
  selector: 'factoring-review-assign-product',
  templateUrl: './factoring-review-assign-product.component.html',
  providers: [NGXToastrService]
})
export class FactoringReviewAssignProductComponent implements OnInit {

  @ViewChild('LookupOffering') ucLookupOffering: UclookupgenericComponent;
  inputLookupObjCopyProduct: InputLookupObj = new InputLookupObj();
  inputLookupObjName: InputLookupObj = new InputLookupObj();
  dropdownListObj: UcDropdownListObj = new UcDropdownListObj();
  isCopyData: boolean = false;
  user: CurrentUserContext;
  FCTR: string = CommonConstant.FCTR;
  bizTemplateCode: string = this.FCTR;
  OfficeCode: string;
  OfficeName: string;
  CessieNo: string;
  CessieHXId: number;
  WfTaskListId: number;
  CustId: number;
  CustNo: string;

  NapAppForm = this.fb.group({
    AppNo: [''],
    OriOfficeCode: ['', [Validators.required]],
    OriOfficeName: [''],
    CrtOfficeCode: [''],
    CrtOfficeName: [''],
    ProdOfferingCode: [''],
    ProdOfferingName: [''],
    ProdOfferingVersion: [''],
    CurrCode: [''],
    CurrDescr: [''],
    LobCode: [''],
    RefProdTypeCode: [''],
    PayFreqCode: [''],
  });

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private http: HttpClient, private toastr: NGXToastrService, private spinner: NgxSpinnerService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["OfficeCode"] != null) this.OfficeCode = params["OfficeCode"];
      if (params["OfficeName"] != null) this.OfficeCode = params["OfficeName"];
      if (params["CessieNo"] != null) this.CessieNo = params["CessieNo"];
      if (params["CessieHXId"] != null) this.CessieHXId = params["CessieHXId"];
      if (params["WfTaskListId"] != null) this.WfTaskListId = params["WfTaskListId"];
      if (params["CustNo"] != null) this.CustNo = params["CustNo"];
      if (params["CustId"] != null) this.CustId = params["CustId"];
    });
  }

  ClaimTask() {
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    if (this.WfTaskListId > 0) {
      this.ClaimTask();
    }

    this.MakeLookUpObj();

    this.NapAppForm.controls.OriOfficeCode.disable();
    this.NapAppForm.patchValue({
      OriOfficeCode: this.OfficeCode,
      OriOfficeName: this.OfficeName,
      CrtOfficeCode: this.OfficeCode,
      CrtOfficeName: this.OfficeName,
    });
  }

  MakeLookUpObj() {
    this.dropdownListObj.apiUrl = URLConstant.GetListKvpActiveRefOfficeForPaging;
    this.dropdownListObj.requestObj = {};
    this.dropdownListObj.isSelectOutput = true;

    this.inputLookupObjCopyProduct = new InputLookupObj();
    this.inputLookupObjCopyProduct.urlJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.urlEnviPaging = environment.losUrl + '/v1';
    this.inputLookupObjCopyProduct.pagingJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.genericJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.isRequired = false;

    this.inputLookupObjName = new InputLookupObj();
    this.inputLookupObjName.urlJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.urlEnviPaging = environment.losUrl + '/v1';
    this.inputLookupObjName.pagingJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.genericJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.nameSelect = this.NapAppForm.controls.ProdOfferingName.value;
    this.inputLookupObjName.isRequired = true;

    var arrCopyLookupCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "a.ORI_OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.OfficeCode];
    arrCopyLookupCrit.push(addCrit);

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'vrl.BIZ_TMPLT_CODE';
    critObj.value = this.bizTemplateCode;
    arrCopyLookupCrit.push(critObj);
    this.inputLookupObjCopyProduct.addCritInput = arrCopyLookupCrit;

    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.OfficeCode];
    arrAddCrit.push(addCrit);

    var addCritBizTempalte = new CriteriaObj();
    addCritBizTempalte.DataType = "text";
    addCritBizTempalte.propName = "rlob.BIZ_TMPLT_CODE";
    addCritBizTempalte.restriction = AdInsConstant.RestrictionEq;
    addCritBizTempalte.value = this.bizTemplateCode;
    arrAddCrit.push(addCritBizTempalte);

    this.inputLookupObjName.addCritInput = arrAddCrit;

    if (this.user.MrOfficeTypeCode != "CG") {
      this.NapAppForm.patchValue({
        OriOfficeCode: this.user.OfficeCode,
        OriOfficeName: this.user.OfficeName,
      });
    }
  }

  ChangeValueOffice(ev: UcDropdownListCallbackObj) {
    this.NapAppForm.patchValue({
      OriOfficeCode: ev.selectedObj.Key,
      OriOfficeName: ev.selectedObj.Value
    });

    var arrCopyLookupCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "a.ORI_OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = ev.selectedObj.Key;
    arrCopyLookupCrit.push(addCrit);

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'vrl.BIZ_TMPLT_CODE';
    critObj.value = this.bizTemplateCode;
    arrCopyLookupCrit.push(critObj);

    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = ev.selectedObj.Key;
    arrAddCrit.push(addCrit);

    var addCritBizTempalte = new CriteriaObj();
    addCritBizTempalte.DataType = "text";
    addCritBizTempalte.propName = "rlob.BIZ_TMPLT_CODE";
    addCritBizTempalte.restriction = AdInsConstant.RestrictionEq;
    addCritBizTempalte.value = this.bizTemplateCode;
    arrAddCrit.push(addCritBizTempalte);

    this.inputLookupObjName.addCritInput = arrAddCrit;
    this.ucLookupOffering.setAddCritInput();
  }

  getLookupAppResponseName(ev: any) {
    let tempLobCode;
    let tempCurrCode;
    let tempCurrDescr;
    let tempPayFreqCode;
    let tempRefProdTypeCode;
    this.http.post(URLConstant.GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion, {
      ProdOfferingCode: ev.ProdOfferingCode, ProdOfferingVersion: ev.ProdOfferingVersion
    }).subscribe(
      (response) => {
        let listD = response["ListProdOfferingDObj"];
        for (let i = 0; i < listD.length; i++) {
          if (listD[i].RefProdCompntCode == CommonConstant.RefProdCompntLob) {
            tempLobCode = listD[i].CompntValue;
          }
          else if (listD[i].RefProdCompntCode == CommonConstant.RefProdCompntCurr) {
            tempCurrCode = listD[i].CompntValue;
            tempCurrDescr = listD[i].CompntValueDesc;
          }
          else if (listD[i].RefProdCompntCode == CommonConstant.RefProdCompntPayFreq) {
            let listPayFreqCode = listD[i].CompntValue.split(";");
            if (listPayFreqCode.length == 1) {
              tempPayFreqCode = listD[i].CompntValue;
            }
            else {
              tempPayFreqCode = null;
            }
          }
          else if (listD[i].RefProdCompntCode == CommonConstant.RefProdCompntProdType) {
            tempRefProdTypeCode = listD[i].CompntValue;
          }
        }
        this.NapAppForm.patchValue({
          ProdOfferingCode: ev.ProdOfferingCode,
          ProdOfferingName: ev.ProdOfferingName,
          ProdOfferingVersion: ev.ProdOfferingVersion,
          CurrCode: tempCurrCode,
          CurrDescr: tempCurrDescr,
          LobCode: tempLobCode,
          PayFreqCode: tempPayFreqCode,
          RefProdTypeCode: tempRefProdTypeCode
        });
      }
    );
  }

  SaveForm() {
    let Url: string = "";
    var obj = {
      OriOfficeCode: this.NapAppForm.getRawValue().OriOfficeCode,
      OriOfficeName: this.NapAppForm.getRawValue().OriOfficeName,
      CrtOfficeCode: this.NapAppForm.getRawValue().CrtOfficeCode,
      CrtOfficeName: this.NapAppForm.getRawValue().CrtOfficeName,
      ProdOfferingCode: this.NapAppForm.getRawValue().ProdOfferingCode,
      ProdOfferingName: this.NapAppForm.getRawValue().ProdOfferingName,
      ProdOfferingVersion: this.NapAppForm.getRawValue().ProdOfferingVersion,
      CurrCode: this.NapAppForm.getRawValue().CurrCode,
      LobCode: this.NapAppForm.getRawValue().LobCode,
      RefProdTypeCode: this.NapAppForm.getRawValue().RefProdTypeCode,
      PayFreqCode: this.NapAppForm.getRawValue().PayFreqCode,
      BizTemplateCode: this.bizTemplateCode,
      CessieHXId: this.CessieHXId
    }

    Url = URLConstantX.AssignProduct;

    this.http.post<GenericObj>(Url, obj).subscribe(
      (response) => {
        setTimeout(() => { this.spinner.show(); }, 20);
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_FACTORING_REVIEW_DETAIL], { "CessieHXId": this.CessieHXId, "WfTaskListId": this.WfTaskListId, "CessieNo": this.CessieNo, "OfficeCode": this.OfficeCode, "OfficeName": this.OfficeName, "CustNo": this.CustNo, "CustId": this.CustId });
      }
    );
  }

  buttonCancelClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_FACTORING_REVIEW_PAGING], {});
  }
}