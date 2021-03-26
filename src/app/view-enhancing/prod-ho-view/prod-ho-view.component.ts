import { environment } from "environments/environment";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { saveAs } from 'file-saver';
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { ProductDetailObj } from "app/shared/model/Request/Product/ProductDetailObj.model";
import { ProdHVersionObj } from "app/shared/model/Request/Product/ProdHVersionObj.model";
import { ProductBrancMbrObj } from "app/shared/model/Request/Product/ProductBranchMbrObj.model";

@Component({
  selector: 'app-prod-ho-view',
  templateUrl: './prod-ho-view.component.html'
})
export class ProdHoViewComponent implements OnInit {

  @Input() inputProdHId;

  prodId: any;
  prodHId: any;
  ProdBranchMemObj: any;
  ProdVersionObj: any;
  ProdBranchUrl: any;
  ProdVerUrl: any;
  ProdDUrl: any;
  refProductDetailObj: any;
  GenData: any;
  ProdCompGen: any;
  ProdCompNonGen: any;
  ProdBranchMbr: any;
  ProdVersion: any;
  ProdComp: any;
  IsLoaded: boolean = false;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {

    this.ProdDUrl = URLConstant.GetProductDetailComponentInfo;
    this.ProdBranchUrl = URLConstant.GetListProdBranchOfficeMbrByProdHId;
    this.ProdVerUrl = URLConstant.GetListProdHByProdCurrentProdHId;

    this.route.queryParams.subscribe(params => {
      if (params["prodHId"] != null) {
        this.prodHId = params["prodHId"];
      }
    });
  }

  DlRuleObj = {
    CompntValue: "",
  };
  async ngOnInit(): Promise<void> {
    if (this.prodHId == undefined) {
      this.prodHId = this.inputProdHId;
    }

    //** Main Information **//
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewProductMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.FoundationR3Url;

    //** Product Version **//
    this.ProdVersionObj = new ProdHVersionObj()
    this.ProdVersionObj.ProdHId = this.prodHId;
    this.http.post(this.ProdVerUrl, {Id : this.prodHId}).subscribe(
      response => {
        this.ProdVersion = response[CommonConstant.ReturnObj];
      }
    );

    //** Office Member **//
    this.ProdBranchMemObj = new ProductBrancMbrObj()
    this.ProdBranchMemObj.ProdHId = this.prodHId;
    this.http.post(this.ProdBranchUrl, {Id : this.prodHId}).subscribe(
      response => {
        this.ProdBranchMbr = response[CommonConstant.ReturnObj];
      }
    );

    //** Product Component **//
    this.refProductDetailObj = new ProductDetailObj();
    this.refProductDetailObj.ProdHId = this.prodHId;
    this.refProductDetailObj.GroupCodes = ['GEN', 'SCHM', 'SCORE', 'RULE', 'OTHR', 'LOS'];
    await this.http.post(this.ProdDUrl, this.refProductDetailObj).toPromise().then(
      response => {
        this.ProdComp = response[CommonConstant.ReturnObj].ProdOffComponents;
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
    this.DlRuleObj.CompntValue = CompntValue;
    this.http.post(URLConstant.DownloadProductRule, this.DlRuleObj, { responseType: 'blob' }).subscribe(
      response => {
        saveAs(response, CompntValueDesc + '.xlsx');
      }
    );
  }
}
