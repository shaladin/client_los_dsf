import { environment } from "environments/environment";
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { ProductDetailObj } from "app/shared/model/Request/Product/ProductDetailObj.model";
import { ResGetProdDCompntInfoObj, ResProdHVersionObj } from "app/shared/model/Response/Product/ResGetProdObj.model";
import { ResGetProdBranchMbrObj } from "app/shared/model/Response/Product/ResGetProdBranchMbrObj.model";
import { ReqDownloadRuleObj } from "app/shared/model/Request/Product/ReqDownloadRuleObj.model";

@Component({
  selector: 'app-prod-ho-view',
  templateUrl: './prod-ho-view.component.html'
})
export class ProdHoViewComponent implements OnInit {

  @Input() inputProdHId;
  ProdHId: number;
  ProductDetailObj: ProductDetailObj;
  GenData: any;
  ProdCompGen: any;
  ProdCompNonGen: any;
  ProdBranchMbr: any;
  ProdVersion: any;
  ProdComp: any;
  IsLoaded: boolean = false;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  DlRuleObj  : ReqDownloadRuleObj = new ReqDownloadRuleObj();

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["ProdHId"] != null) {
        this.ProdHId = params["ProdHId"];
      }
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.ProdHId == undefined) {
      this.ProdHId = this.inputProdHId;
    }

    //** Main Information **//
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;

    //** Product Version **//
    this.http.post<ResProdHVersionObj>(URLConstant.GetListProdHByProdCurrentProdHId, {Id : this.ProdHId}).subscribe(
      response => {
        this.ProdVersion = response.ReturnObject
      }
    );

    //** Office Member **//
    this.http.post<ResGetProdBranchMbrObj>(URLConstant.GetListProdBranchOfficeMbrByProdHId, {Id : this.ProdHId}).subscribe(
      response => {
        this.ProdBranchMbr = response.ReturnObj;
      }
    );

    //** Product Component **//
    this.ProductDetailObj = new ProductDetailObj();
    this.ProductDetailObj.ProdHId = this.ProdHId;
    this.ProductDetailObj.GroupCodes = ['GEN', 'SCHM', 'SCORE', 'RULE', 'OTHR', 'LOS'];
    await this.http.post<ResGetProdDCompntInfoObj>(URLConstant.GetProductDetailComponentInfo, this.ProductDetailObj).toPromise().then(
      response => {
        this.ProdComp = response.ReturnObject.ProdOffComponents;
        this.GenData = this.ProdComp.filter(
          comp => comp.GroupCode == 'GEN');
        this.ProdCompGen = this.GenData[0];
        this.ProdCompNonGen = this.ProdComp.filter(
          comp => comp.GroupCode != 'GEN');
        this.IsLoaded = true;
      }
    );

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
