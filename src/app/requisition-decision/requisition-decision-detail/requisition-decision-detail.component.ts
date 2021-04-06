import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-requisition-decision-detail',
  templateUrl: './requisition-decision-detail.component.html',
  styleUrls: []
})
export class RequisitionDecisionDetailComponent implements OnInit {
  AppId: number;
  AppAssetId: number;
  WfTaskListId: number;
  TotalPurchaseAsset: number = 0;
  TotalUseExistingStock: number = 0;
  Index: number;

  IsSecondDetail: boolean = false;
  IsExisting: boolean = false;

  SerialNo1: string = "-";
  SerialNo2: string = "-";
  SerialNo3: string = "-";
  SerialNo4: string = "-";
  SerialNo5: string = "-";
  AssetTypeCode: string = "";

  AssetInfoObj: any;
  AssetObj: any;
  AssetTypeObj: any;

  ListOfAsset: Array<any> = new Array<any>();
  AttributeList: Array<any> = new Array<any>();
  AccessoriesList: Array<any> = new Array<any>();
  
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  InputLookupAssetObj: InputLookupObj = new InputLookupObj();

  ReqDecForm = this.fb.group({
    Decision: ['', [Validators.required]],
    AssetNo: [''],
    ManYear: [, [Validators.required, Validators.min(1)]],
    Notes: ['', [Validators.maxLength(4000)]]
  });
  
  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService,
    private fb: FormBuilder, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["WfTaskListId"] != null) {
        this.WfTaskListId = params["WfTaskListId"];
      }
    });
  }

  async ngOnInit() {
    this.ClaimTask();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAssetNumber.json";
    this.InputLookupAssetObj.urlQryPaging = URLConstant.GetAssetStockPagingFromAms;
    this.InputLookupAssetObj.urlEnviPaging = environment.AMSUrl;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAssetNumber.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAssetNumber.json";
    this.InputLookupAssetObj.isRequired = true;

    await this.SetMainInfo();
    await this.SetListOfAsset();
  }

  
  ClaimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();

    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }

  async SetMainInfo() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/opl/view-opl-main-info.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
  }

  async SetListOfAsset() {
    var requestAppId = {
      Id: this.AppId
    };

    await this.http.post(URLConstant.GetListOfAsset, requestAppId).toPromise().then(
      (response: any) => {
        this.ListOfAsset = response["ReturnObject"];

        if(this.ListOfAsset.length !== 0) {
          for(let i = 0; i < this.ListOfAsset.length; i++) {
            if(this.ListOfAsset[i].Decision === "Purchase Asset") {
              this.TotalPurchaseAsset += 1;
            }
            else if(this.ListOfAsset[i].Decision === "Use Existing Stock") {
              this.TotalUseExistingStock += 1;
            }
          }
        }
      }
    );
  }

  CancelToPaging() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.REQUISITION_DECISION_PAGING], { BizTemplateCode: CommonConstant.OPL });
  }

  Submit() {
    if(this.ListOfAsset.length !== this.TotalPurchaseAsset + this.TotalUseExistingStock) {
      this.toastr.warningMessage("All Asset Must Select Decision");
    }
    else {
      var requestRequisitionDecisionObj = {
        AppId: this.AppId,
        WfTaskListId: this.WfTaskListId
      };

      this.http.post(URLConstant.SubmitRequisitionDecision, requestRequisitionDecisionObj).subscribe(
        (response) => {
          this.toastr.successMessage("Submit Requisition Decision Success");
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.REQUISITION_DECISION_PAGING], { BizTemplateCode: CommonConstant.OPL });
        }
      );
    }
  }

  ChangeDetail(index: number, appAssetId: number) {
    this.AssetInfoObj = this.ListOfAsset[index];
    this.AppAssetId = appAssetId;
    this.Index = index;

    this.ReqDecForm.patchValue({
      Decision: this.AssetInfoObj.DecisionCode,
      ManYear: this.AssetInfoObj.ManufacturingYear
    });

    this.ChangeDecision(this.AssetInfoObj.DecisionCode);

    this.ReqDecForm.controls.ManYear.disable();

    var requestAppAssetId = {
      Id: this.AppAssetId
    };

    this.http.post(URLConstant.GetListAppAssetAccessoryAndAppAssetAttrByAppAssetId, requestAppAssetId).subscribe(
      (response) => {
        this.AttributeList = response["AppAssetAttrs"] ? response["AppAssetAttrs"] : new Array<any>();
        this.AccessoriesList = response["AppAssetAccesories"] ? response["AppAssetAccesories"] : new Array<any>();
      }
    );

    this.IsSecondDetail = true;
  }

  OnChangedDdl(event: any) {
    this.ChangeDecision(event.target.value);
  }
  
  SetAsset(event: any) {
    this.ReqDecForm.patchValue({
      AssetNo: event.AssetNo
    });
    
    var requestAssetNo = {
      AssetNo: event.AssetNo
    };

    this.http.post(URLConstant.GetAssetByAssetNo, requestAssetNo).subscribe(
      (response: any) => {
        this.AssetObj = response;
        this.AssetTypeCode = this.AssetObj.AssetTypeCode;
        this.SerialNo1 = this.AssetObj.SerialNo1;
        this.SerialNo2 = this.AssetObj.SerialNo2;
        this.SerialNo3 = this.AssetObj.SerialNo3;
        this.SerialNo4 = this.AssetObj.SerialNo4;
        this.SerialNo5 = this.AssetObj.SerialNo5;
      }
    );

    this.http.post(URLConstant.GetAssetTypeByCode, {Code: this.AssetTypeCode }).subscribe(
      (response: any) => {
        this.AssetTypeObj = response;
      }
    );
  }

  ChangeDecision(decisionCode: string) {
    if(decisionCode === "EXISTING") {
      this.ReqDecForm.controls.AssetNo.setValidators(Validators.required);
      
      if(this.AssetInfoObj.AssetNo !== null) {
        this.ReqDecForm.patchValue({
          AssetNo: this.AssetInfoObj.AssetNo
        });
  
        this.InputLookupAssetObj.jsonSelect = { AssetNo: this.AssetInfoObj.AssetNo };
        this.InputLookupAssetObj.idSelect = this.AssetInfoObj.AssetNo;

        var requestAssetNo = {
          AssetNo: this.AssetInfoObj.AssetNo
        };

        this.http.post(URLConstant.GetAssetByAssetNo, requestAssetNo).subscribe(
          (response: any) => {
            this.AssetObj = response;
            this.AssetTypeCode = this.AssetObj.AssetTypeCode;
            this.SerialNo1 = this.AssetObj.SerialNo1;
            this.SerialNo2 = this.AssetObj.SerialNo2;
            this.SerialNo3 = this.AssetObj.SerialNo3;
            this.SerialNo4 = this.AssetObj.SerialNo4;
            this.SerialNo5 = this.AssetObj.SerialNo5;
          }
        );

        this.http.post(URLConstant.GetAssetTypeByCode, {Code: this.AssetTypeCode }).subscribe(
          (response: any) => {
            this.AssetTypeObj = response;
          }
        );
      }

      this.IsExisting = true;
    }
    else {
      this.ReqDecForm.controls.AssetNo.clearValidators();
      this.IsExisting = false;
      this.ReqDecForm.patchValue({
        AssetNo: ""
      });
      this.ReqDecForm.controls.AssetNo.updateValueAndValidity();
    }
  }

  Cancel() {
    this.IsSecondDetail = false;
    this.SetListOfAsset();
  }

  SaveForm() {
    var requestRequisitionDecisionObj = {
      AppId: this.AppId,
      Notes: this.ReqDecForm.value.Notes,
      AppAssetId: this.AppAssetId,
      DecisionCode: this.ReqDecForm.value.Decision,
      AssetNo: this.ReqDecForm.value.AssetNo
    };

    this.http.post(URLConstant.SaveRequisitionDecision, requestRequisitionDecisionObj).subscribe(
      (response: any) => {
        this.ListOfAsset[this.Index].DecisionCode = this.ReqDecForm.value.Decision;
        this.ListOfAsset[this.Index].AssetNo = this.ReqDecForm.value.AssetNo;

        this.TotalPurchaseAsset = 0;
        this.TotalUseExistingStock = 0;

        for(let i = 0; i < this.ListOfAsset.length; i++) {
          if(this.ListOfAsset[i].Decision === "Purchase Asset") {
            this.TotalPurchaseAsset += 1;
          }
          else if(this.ListOfAsset[i].Decision === "Use Existing Stock") {
            this.TotalUseExistingStock += 1;
          }
        }

        this.toastr.successMessage("Submit Requisition Decision Asset Success");
        this.IsSecondDetail = false;
        this.SetListOfAsset();
      }
    );
  }

  GetCallBack(event: any) {
    if(event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.ViewObj.ProdOfferingCode, event.ViewObj.ProdOfferingVersion);
    }
  }
}