import { environment } from "environments/environment";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";
import { ResGetProdBranchMbrObj } from "app/shared/model/Response/Product/ResGetProdBranchMbrObj.model";
import { ReqDownloadRuleObj } from "app/shared/model/Request/Product/ReqDownloadRuleObj.model";
import { ReqGetProdCompntObj } from "app/shared/model/Request/Product/ReqGetProdCompntObj.model";
import { GenericObj } from "app/shared/model/Generic/GenericObj.Model";
import { ResGetProdDCompntInfoObj, ResProdDCompntObj, ResProdHVersionObj } from "app/shared/model/Response/Product/ResGetProdObj.model";

@Component({
  selector: 'app-prod-ho-view',
  templateUrl: './prod-ho-view.component.html'
})
export class ProdHoViewComponent implements OnInit {

  @Input() inputProdHId;
  ProdHId: number;
  GenData: any;
  ProdCompGen: any;
  ProdCompNonGen: any;
  ProdBranchMbr: any;
  ProdVersion: any;
  IsLoaded: boolean = false;
  GenericByIdObj: GenericObj = new GenericObj();
  ProductDetailObj: ReqGetProdCompntObj = new ReqGetProdCompntObj();
  ProdComp: Array<ResProdDCompntObj> = new Array<ResProdDCompntObj>();
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
    this.GenericByIdObj.Id = this.ProdHId;
    this.http.post(URLConstant.GetListProdHByProdCurrentProdHId, this.GenericByIdObj).subscribe(
      (response : ResProdHVersionObj) => {
        this.ProdVersion = response.ReturnObject
      }
    );

    //** Office Member **//
    this.http.post(URLConstant.GetListProdBranchOfficeMbrByProdHId, this.GenericByIdObj).subscribe(
      (response : ResGetProdBranchMbrObj) => {
        this.ProdBranchMbr = response.ReturnObject;
      }
    );

    //** Product Component **//
    this.ProductDetailObj.ProdHId = this.ProdHId;
    this.ProductDetailObj.GroupCodes = ['GEN', 'SCHM', 'SCORE', 'RULE', 'OTHR', 'LOS'];
    await this.http.post(URLConstant.GetProductDetailComponentInfo, this.ProductDetailObj).toPromise().then(
      (response : ResGetProdDCompntInfoObj) => {
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
