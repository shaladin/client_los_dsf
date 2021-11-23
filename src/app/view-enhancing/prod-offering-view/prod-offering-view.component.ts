import { environment } from "environments/environment";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcViewGenericObj } from "app/shared/model/uc-view-generic-obj.model";
import { ProdOfferingCodeVersionObj } from "app/shared/model/request/product/prod-offering-code-version-obj.model";
import { ReqDownloadRuleObj } from "app/shared/model/request/product/req-download-rule-obj.model";
import { ReqGetProdOffCompntObj } from "app/shared/model/request/product/req-get-prod-compnt-obj.model";
import { ResGetListProdOfferingBranchMbrObj, ResProdOfferingBranchOfficeMbrObj } from "app/shared/model/response/product/res-get-prod-offering-branch-mbr-obj.model";
import { ResGetListProdOfferingHVersionObj, ResGetProdOfferingDCompntInfoObj, ResGetProdOfferingHVersionObj } from "app/shared/model/response/product/res-get-prod-offering-obj.model";
import { GenericObj } from "app/shared/model/generic/generic-obj.model";
import { ResProdDCompntObj } from "app/shared/model/response/product/res-get-prod-obj.model";

@Component({
  selector: 'app-prod-offering-view',
  templateUrl: './prod-offering-view.component.html'
})
export class ProdOfferingViewComponent implements OnInit {
  ProdOfferingHId: number;
  ProdOfferingCode: string;
  ProdOfferingVersion: string;
  mainInfoByHIdOnly: boolean = true;
  IsLoaded: boolean = false;
  GenericByIdObj : GenericObj = new GenericObj();
  ViewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  DlRuleObj  : ReqDownloadRuleObj = new ReqDownloadRuleObj();
  ProdCompGen: ResProdDCompntObj = new ResProdDCompntObj();
  GenData: Array<ResProdDCompntObj> = new Array<ResProdDCompntObj>();
  ProdComp: Array<ResProdDCompntObj> = new Array<ResProdDCompntObj>();
  ProdCompNonGen: Array<ResProdDCompntObj> = new Array<ResProdDCompntObj>();
  GetProdOfferByVerCode: ProdOfferingCodeVersionObj = new ProdOfferingCodeVersionObj();
  refProductDetailObj: ReqGetProdOffCompntObj = new ReqGetProdOffCompntObj();
  ProdOfferingBranchMbr: Array<ResProdOfferingBranchOfficeMbrObj> = new Array<ResProdOfferingBranchOfficeMbrObj>();
  ListProdOfferingVersion: Array<ResGetProdOfferingHVersionObj> = new Array<ResGetProdOfferingHVersionObj>();
  
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
        this.mainInfoByHIdOnly = false;
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
    //** Main Information **//
    if (this.mainInfoByHIdOnly == true) {
      this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductOfferingMainInformation.json";
    }
    else {
      this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductOfferingMainInformationByCode.json";
    }

    if (this.ProdOfferingHId == 0) {
      await this.LoadMainInfo();
    }

    //** Product Offering Version **//
    this.GenericByIdObj.Id = this.ProdOfferingHId;
    await this.http.post<ResGetListProdOfferingHVersionObj>(URLConstant.GetListProdOfferingHByProdOfferingCurrentProdHId, this.GenericByIdObj).toPromise().then(
      response => {
        this.ListProdOfferingVersion = response.ReturnObject;

      }
    );

    //** Office Member **//
    await this.http.post<ResGetListProdOfferingBranchMbrObj>(URLConstant.GetListProdOfferingBranchOfficeMbrByProdHId, this.GenericByIdObj).toPromise().then(
      response => {
        this.ProdOfferingBranchMbr = response.ReturnObject;
      }
    );


    //** Product Component **//
    this.refProductDetailObj.ProdOfferingHId = this.ProdOfferingHId;
    this.refProductDetailObj.GroupCodes = ['GEN', 'SCHM', 'SCORE', 'RULE', 'OTHR', 'LOS'];
    await this.http.post<ResGetProdOfferingDCompntInfoObj>(URLConstant.GetListProdOfferingDByProdOfferingHIdAndProdCompntGrpCode, this.refProductDetailObj).toPromise().then(
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
    this.http.post(URLConstant.DownloadProductRule, this.DlRuleObj).subscribe(
      response => {
        // saveAs(response, CompntValueDesc + '.xls');
        let linkSource: string = "";
        let fileName: string = "";

        let type = response["ReturnObject"][0].Key.substring(response["ReturnObject"][0].Key.length - 4);
        if(type == ".xls"){
          linkSource = 'data:application/xls;base64,' + response["ReturnObject"][0].Value;
        }else {
          linkSource = 'data:application/xlsx;base64,' + response["ReturnObject"][0].Value;
        }
        fileName = response["ReturnObject"][0].Key;
        
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }
    );
  }
}
