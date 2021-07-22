import { environment } from "environments/environment";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";
import { ResGetProdBranchMbrObj, ResProdBranchMbrObj } from "app/shared/model/Response/Product/ResGetProdBranchMbrObj.model";
import { ReqDownloadRuleObj } from "app/shared/model/Request/Product/ReqDownloadRuleObj.model";
import { ReqGetProdCompntObj } from "app/shared/model/Request/Product/ReqGetProdCompntObj.model";
import { GenericObj } from "app/shared/model/Generic/GenericObj.Model";
import { ResGetProdDCompntInfoObj, ResProdDCompntObj, ResProdHObj, ResProdHVersionObj } from "app/shared/model/Response/Product/ResGetProdObj.model";

@Component({
  selector: 'app-prod-ho-view',
  templateUrl: './prod-ho-view.component.html'
})
export class ProdHoViewComponent implements OnInit {

  @Input() inputProdHId: number;
  ProdHId: number;
  IsLoaded: boolean = false;
  GenericByIdObj: GenericObj = new GenericObj();
  ViewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  DlRuleObj: ReqDownloadRuleObj = new ReqDownloadRuleObj();
  ProdCompGen: ResProdDCompntObj = new ResProdDCompntObj();
  GenData: Array<ResProdDCompntObj> = new Array<ResProdDCompntObj>();
  ProdCompNonGen: Array<ResProdDCompntObj> = new Array<ResProdDCompntObj>();;
  ProdVersionObj: Array<ResProdHObj> = new Array<ResProdHObj>();
  ProductDetailObj: ReqGetProdCompntObj = new ReqGetProdCompntObj();
  ProdComp: Array<ResProdDCompntObj> = new Array<ResProdDCompntObj>();
  ProdBranchMbrObj: Array<ResProdBranchMbrObj> = new Array<ResProdBranchMbrObj>();

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
    this.ViewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductMainInformation.json";

    //** Product Version **//
    this.GenericByIdObj.Id = this.ProdHId;
    this.http.post(URLConstant.GetListProdHByProdCurrentProdHId, this.GenericByIdObj).subscribe(
      (response : ResProdHVersionObj) => {
        this.ProdVersionObj = response.ReturnObject
      }
    );

    //** Office Member **//
    this.http.post(URLConstant.GetListProdBranchOfficeMbrByProdHId, this.GenericByIdObj).subscribe(
      (response : ResGetProdBranchMbrObj) => {
        this.ProdBranchMbrObj = response.ReturnObject;
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
