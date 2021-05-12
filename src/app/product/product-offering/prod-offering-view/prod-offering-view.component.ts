import { environment } from "environments/environment";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";
import { ProdOfferingCodeVersionObj } from "app/shared/model/Request/Product/ProdOfferingCodeVersionObj.model";
import { ReqDownloadRuleObj } from "app/shared/model/Request/Product/ReqDownloadRuleObj.model";
import { ReqGetProdOffCompntObj } from "app/shared/model/Request/Product/ReqGetProdCompntObj.model";
import { ResGetListProdOfferingBranchMbrObj, ResProdOfferingBranchOfficeMbrObj } from "app/shared/model/Response/Product/ResGetProdOfferingBranchMbrObj.model";
import { ResGetListProdOfferingHVersionObj, ResGetProdOfferingDCompntInfoObj, ResGetProdOfferingHVersionObj, ResProdOffDCompntObj } from "app/shared/model/Response/Product/ResGetProdOfferingObj.model";
import { GenericObj } from "app/shared/model/Generic/GenericObj.Model";

@Component({
  selector: 'app-prod-offering-view',
  templateUrl: './prod-offering-view.component.html'
})
export class ProdOfferingViewComponent implements OnInit {
  @Input() inputProdOfferingHId;
  ProdOfferingHId: number;
  ProdOfferingCode: string;
  ProdOfferingVersion: string;
  MainInfoByHIdOnly: boolean = true;
  IsLoaded: boolean = false;
  GenericByIdObj : GenericObj = new GenericObj();
  ViewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  DlRuleObj  : ReqDownloadRuleObj = new ReqDownloadRuleObj();
  ProdCompGen: ResProdOffDCompntObj = new ResProdOffDCompntObj();
  GenData: Array<ResProdOffDCompntObj> = new Array<ResProdOffDCompntObj>();
  ProdComp: Array<ResProdOffDCompntObj> = new Array<ResProdOffDCompntObj>();
  ProdCompNonGen: Array<ResProdOffDCompntObj> = new Array<ResProdOffDCompntObj>();
  ReqGetProdOffCmpntObj: ReqGetProdOffCompntObj = new ReqGetProdOffCompntObj();
  GetProdOfferByVerCode: ProdOfferingCodeVersionObj = new ProdOfferingCodeVersionObj();
  ProdOfferingBranchMbrObj: Array<ResProdOfferingBranchOfficeMbrObj> = new Array<ResProdOfferingBranchOfficeMbrObj>();
  ListProdOfferingVersionObj: Array<ResGetProdOfferingHVersionObj> = new Array<ResGetProdOfferingHVersionObj>();
  
  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["prodOfferingHId"] != 0) {
        this.ProdOfferingHId = params["prodOfferingHId"];
      }
      else {
        if (params["prodOfferingCode"] != "") {
          this.ProdOfferingCode = params["prodOfferingCode"];
        }
        if (params["prodOfferingVersion"] != "") {
          this.ProdOfferingVersion = params["prodOfferingVersion"];
        }
        this.ProdOfferingHId = params["prodOfferingHId"];
        this.MainInfoByHIdOnly = false;
      }
    });
  }

  async LoadMainInfo() {
    this.GetProdOfferByVerCode.ProdOfferingCode = this.ProdOfferingCode;
    this.GetProdOfferByVerCode.ProdOfferingVersion = this.ProdOfferingVersion;
    await this.http.post<GenericObj>(URLConstant.GetProdOfferingHByCodeAndVersion, this.GetProdOfferByVerCode).toPromise().then(
      response => {
        this.ProdOfferingHId = response.Id;
      }
    );
  }

  async ngOnInit(): Promise<void> {
    if (this.ProdOfferingHId == undefined) {
      this.ProdOfferingHId = this.inputProdOfferingHId;
    }
    //** Main Information **//
    if (this.MainInfoByHIdOnly == true) {
      this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductOfferingMainInformation.json";
    }
    else {
      this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductOfferingMainInformationByCode.json";
    }
    this.ViewGenericObj.viewEnvironment = environment.losUrl;

    if (this.ProdOfferingHId == 0) {
      await this.LoadMainInfo();
    }

    //** Product Offering Version **//
    this.GenericByIdObj.Id = this.ProdOfferingHId;
    await this.http.post<ResGetListProdOfferingHVersionObj>(URLConstant.GetListProdOfferingHByProdOfferingCurrentProdHId, this.GenericByIdObj).toPromise().then(
      response => {
        this.ListProdOfferingVersionObj = response.ReturnObject;

      }
    );

    //** Office Member **//
    await this.http.post<ResGetListProdOfferingBranchMbrObj>(URLConstant.GetListProdOfferingBranchOfficeMbrByProdHId, this.GenericByIdObj).toPromise().then(
      response => {
        this.ProdOfferingBranchMbrObj = response.ReturnObject;
      }
    );


    //** Product Component **//
    this.ReqGetProdOffCmpntObj.ProdOfferingHId = this.ProdOfferingHId;
    this.ReqGetProdOffCmpntObj.GroupCodes = ['GEN', 'SCHM', 'SCORE', 'RULE', 'OTHR', 'LOS'];
    await this.http.post<ResGetProdOfferingDCompntInfoObj>(URLConstant.GetListProdOfferingDByProdOfferingHIdAndProdCompntGrpCode, this.ReqGetProdOffCmpntObj).toPromise().then(
      response => {
        this.ProdComp = response.ReturnObject.ProdOffComponents;
        this.GenData = this.ProdComp.filter(
          comp => comp.GroupCode == 'GEN');
        this.ProdCompGen = this.GenData[0];
        this.ProdCompNonGen = this.ProdComp.filter(
          comp => comp.GroupCode != 'GEN');
      }
    );
    this.IsLoaded = true;
  }
  
  DownloadRule(CompntValue, CompntValueDesc) {
    this.DlRuleObj.RuleSetName = CompntValue;
    this.http.post(URLConstant.DownloadProductRule, this.DlRuleObj, { responseType: 'blob' }).subscribe(
      response => {
        saveAs(response, CompntValueDesc + '.xlsx');
      }
    );
  }
}
