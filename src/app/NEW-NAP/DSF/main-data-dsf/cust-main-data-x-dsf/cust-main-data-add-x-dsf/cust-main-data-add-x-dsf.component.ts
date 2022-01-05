import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { UcDropdownListObj, UcDropdownListCallbackObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { ReqByProdOffCodeAndVersionObj } from 'app/shared/model/request/product/req-by-prod-off-code-and-version-obj.model';
import { ReqAddNapObj, ReqAddNapFromCopyObj } from 'app/shared/model/request/nap/new-application/req-add-nap-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ReqAddAppRoleObj } from 'app/shared/model/Request/NAP/new-application/ReqAddAppRoleObj.Model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { ExceptionConstantDsf } from 'app/shared/constant/ExceptionConstantDsf';

@Component({
  selector: 'app-cust-main-data-add-x-dsf',
  templateUrl: './cust-main-data-add-x-dsf.component.html',
  styleUrls: ['./cust-main-data-add-x-dsf.component.css']
})
export class CustMainDataAddXDsfComponent implements OnInit {

  @ViewChild('LookupOffering') ucLookupOffering: UclookupgenericComponent;
  @ViewChild('LookupCopyProduct') ucLookupCopyProduct: UclookupgenericComponent;
  inputLookupObjCopyProduct: InputLookupObj = new InputLookupObj();
  inputLookupObjName: InputLookupObj = new InputLookupObj();
  dropdownListObj: UcDropdownListObj = new UcDropdownListObj();
  bizTemplateCode: string;
  isCopyData: boolean = false;
  user: CurrentUserContext;
  DF: string = CommonConstant.DF;
  FCTR: string= CommonConstant.FCTR;
  addType: string;

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
      if (params["BizTemplateCode"] != null) this.bizTemplateCode = params["BizTemplateCode"];
      if (params["addType"] != null) this.addType = params["addType"];
    });
  }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MakeLookUpObj();

    if (this.user.MrOfficeTypeCode == CommonConstant.CENTER_GROUP_CODE) {
      this.NapAppForm.patchValue({
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }
    else {
      this.NapAppForm.controls.OriOfficeCode.disable();
      this.NapAppForm.patchValue({
        OriOfficeCode: this.user.OfficeCode,
        OriOfficeName: this.user.OfficeName,
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }
  }

  MakeLookUpObj() {
    this.dropdownListObj.apiUrl = URLConstant.GetListKvpActiveRefOfficeForPaging;
    this.dropdownListObj.requestObj = {};
    this.dropdownListObj.isSelectOutput = true;

    this.inputLookupObjCopyProduct = new InputLookupObj();
    this.inputLookupObjCopyProduct.urlJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.urlEnviPaging = environment.losUrl + "/v1";
    this.inputLookupObjCopyProduct.pagingJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.genericJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.isRequired = false;

    this.inputLookupObjName = new InputLookupObj();
    this.inputLookupObjName.urlJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.urlEnviPaging = environment.losUrl + "/v1";
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

    if(this.bizTemplateCode == CommonConstant.CFNA || this.bizTemplateCode == CommonConstant.FL4W)
    {
      var addCritAddType = new CriteriaObj();
      addCritAddType.DataType = "text";
      addCritAddType.propName = "pod.COMPNT_VALUE";
      addCritAddType.restriction = AdInsConstant.RestrictionEq;
      addCritAddType.value = this.addType;
      arrAddCrit.push(addCritAddType);
    }

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

    this.inputLookupObjCopyProduct.addCritInput = arrCopyLookupCrit;
    this.ucLookupCopyProduct.setAddCritInput();

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

    if(this.bizTemplateCode == CommonConstant.CFNA || this.bizTemplateCode == CommonConstant.FL4W)
    {
      var addCritAddType = new CriteriaObj();
      addCritAddType.DataType = "text";
      addCritAddType.propName = "pod.COMPNT_VALUE";
      addCritAddType.restriction = AdInsConstant.RestrictionEq;
      addCritAddType.value = this.addType;
      arrAddCrit.push(addCritAddType);
    }

    this.inputLookupObjName.addCritInput = arrAddCrit;
    this.ucLookupOffering.setAddCritInput();
  }

  getLookupAppResponseCopy(ev: any) {
    var reqByProdOffCodeAndVersionObj = new ReqByProdOffCodeAndVersionObj();
    reqByProdOffCodeAndVersionObj.ProdOfferingCode = ev.ProdOfferingCode;
    reqByProdOffCodeAndVersionObj.ProdOfferingVersion = ev.ProdOfferingVersion;
    this.http.post(URLConstant.GetProdStatByProdOffCodeAndVersion, reqByProdOffCodeAndVersionObj).subscribe(
      (response) => {
        let ProdStat = response["ProdStat"];
        let ProdStatDescr = response["ProdStatDescr"];
        if(ProdStat != "ACT"){
          this.toastr.warningMessage(ExceptionConstant.PRODUCT_HAS + ProdStatDescr);
        }
      }
    );
    this.NapAppForm.patchValue({
      AppNo: ev.AppNo,
      ProdOfferingName: ev.ProdOfferingName,
      CurrCode: ev.CurrCode,
    });
    this.NapAppForm.get("ProductOfferingNameIdentifier").patchValue({
      value: ev.ProdOfferingName
    });
    this.inputLookupObjName.isRequired = false;
    this.isCopyData = true;
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
    let requestAddNapObj: Object = new Object();
    let AddNapUrl: string = "";
    if (this.NapAppForm.getRawValue().AppNo == "") {
      let reqAddNapObj: ReqAddNapObj = new ReqAddNapObj();

      reqAddNapObj.OriOfficeCode = this.NapAppForm.getRawValue().OriOfficeCode;
      reqAddNapObj.OriOfficeName = this.NapAppForm.getRawValue().OriOfficeName;
      reqAddNapObj.CrtOfficeCode = this.NapAppForm.getRawValue().CrtOfficeCode;
      reqAddNapObj.CrtOfficeName = this.NapAppForm.getRawValue().CrtOfficeName;
      reqAddNapObj.ProdOfferingCode = this.NapAppForm.getRawValue().ProdOfferingCode;
      reqAddNapObj.ProdOfferingName = this.NapAppForm.getRawValue().ProdOfferingName;
      reqAddNapObj.ProdOfferingVersion = this.NapAppForm.getRawValue().ProdOfferingVersion;
      reqAddNapObj.CurrCode = this.NapAppForm.getRawValue().CurrCode;
      reqAddNapObj.LobCode = this.NapAppForm.getRawValue().LobCode;
      reqAddNapObj.RefProdTypeCode = this.NapAppForm.getRawValue().RefProdTypeCode;
      reqAddNapObj.PayFreqCode = this.NapAppForm.getRawValue().PayFreqCode;
      reqAddNapObj.BizTemplateCode = this.bizTemplateCode;

      requestAddNapObj = reqAddNapObj;
      AddNapUrl = URLConstantX.AddNewApplicationV2;
    }
    else {

      let reqAddNapFromCopyObj: ReqAddNapFromCopyObj = new ReqAddNapFromCopyObj();

      reqAddNapFromCopyObj.AppNo = this.NapAppForm.getRawValue().AppNo;
      reqAddNapFromCopyObj.OriOfficeCode = this.NapAppForm.getRawValue().OriOfficeCode;

      requestAddNapObj = reqAddNapFromCopyObj;
      if (this.bizTemplateCode === CommonConstant.OPL) {
        AddNapUrl = URLConstant.AddNewApplicationOplFromCopy;
      }
      else {
        AddNapUrl = URLConstantX.AddNewApplicationFromCopyV2_2;

        // await this.http.post<GenericObj>(URLConstantDsf.AddXDAACPDSF, requestAddNapObj).toPromise().then(
        //   (response) => {
        //   }
        // )
      }
    }

    this.http.post<GenericObj>(AddNapUrl, requestAddNapObj).subscribe(
      (response) => {
        setTimeout(() => { this.spinner.show(); }, 10);
        this.toastr.successMessage(response["message"]);
        let requestAddAppRoleObj: ReqAddAppRoleObj = new ReqAddAppRoleObj();

        requestAddAppRoleObj.AppId = response.Id;
        requestAddAppRoleObj.AppRoleCode = this.user.RoleCode;
        
        this.http.post<ReqAddAppRoleObj>(URLConstantDsf.AddNapRole, requestAddAppRoleObj).subscribe(
          (response) => {
            
          }
        )
        switch (this.bizTemplateCode) {
          case CommonConstant.CF4W:
            AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_CF4W_NAP1], { "AppId": response.Id, "CopyAppId": response.CopyId });
            break;
          case CommonConstant.CFRFN4W:
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CFRFN4W_NAP1], { "AppId": response.Id, "CopyAppId": response.CopyId });
            break;
          case CommonConstant.FCTR:
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FCTR_NAP1], { "AppId": response.Id });
            break;
          case CommonConstant.FL4W:
            AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_FL4W_NAP1], { "AppId": response.Id, "CopyAppId": response.CopyId });
            break;
          case CommonConstant.CFNA:
            AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_CFNA_NAP1], { "AppId": response.Id, "CopyAppId": response.CopyId });
            break;
          case CommonConstant.OPL:
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ROS_NAP1], { "AppId": response.Id });
            break;
          case CommonConstant.DF :
            AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_DLFN_NAP1], { "AppId": response.Id});
          break;
        }
      }
    );
  }

  buttonCancelClick() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_MAIN_DATA_NAP1_PAGING_X], { "BizTemplateCode": this.bizTemplateCode });
  }
}