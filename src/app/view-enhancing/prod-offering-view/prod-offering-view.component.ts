import { environment } from "environments/environment";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { saveAs } from 'file-saver';
import { URLConstant } from "app/shared/constant/URLConstant";
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { ProdOfferingCodeVersionObj } from "app/shared/model/Request/Product/ProdOfferingCodeVersionObj.model";
import { ProductOfferingBranchMbrObj } from "app/shared/model/Request/Product/ProductOfferingBranchMbrObj.model";
import { ProductOfferingDetailObj } from "app/shared/model/Request/Product/ProductOfferingDetailObj.model";
import { ReqDownloadRuleObj } from "app/shared/model/Request/Product/ReqDownloadRuleObj.model";

@Component({
  selector: 'app-prod-offering-view',
  templateUrl: './prod-offering-view.component.html'
})
export class ProdOfferingViewComponent implements OnInit {
  @Input() inputProdOfferingHId;

  prodOfferingHId: any;
  prodOfferingCode: any;
  prodOfferingVersion: any;
  ProdOfferingBranchMemObj: any;
  ProdOfferingVersionObj: any;
  GetProdOfferByVerCode: any;
  ProdOfferingBranchUrl: any;
  ProdOfferingVerUrl: any;
  ProdOfferingDUrl: any;
  ProdOfferingCodeVerUrl: any
  refProductDetailObj: any;
  GenData: any;
  ProdComp: any;
  ProdCompGen: any;
  ProdCompNonGen: any;
  ProdOfferingBranchMbr: any;
  ProdOfferingVersion: any;
  ProdOfferingCodeVersion: any;
  mainInfoByHIdOnly: boolean = true;
  IsLoaded: boolean = false;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  DlRuleObj  : ReqDownloadRuleObj = new ReqDownloadRuleObj();
  
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {

    this.ProdOfferingDUrl = URLConstant.GetListProdOfferingDByProdOfferingHIdAndProdCompntGrpCode;
    this.ProdOfferingBranchUrl = URLConstant.GetListProdOfferingBranchOfficeMbrByProdHId;
    this.ProdOfferingVerUrl = URLConstant.GetListProdOfferingHByProdOfferingCurrentProdHId;
    this.ProdOfferingCodeVerUrl = URLConstant.GetProdOfferingHByCodeAndVersion;

    this.route.queryParams.subscribe(params => {
      if (params["prodOfferingHId"] != 0) {
        this.prodOfferingHId = params["prodOfferingHId"];
      }
      else {
        if (params["prodOfferingCode"] != "") {
          this.prodOfferingCode = params["prodOfferingCode"];
        }
        if (params["prodOfferingVersion"] != "") {
          this.prodOfferingVersion = params["prodOfferingVersion"];
        }
        this.prodOfferingHId = params["prodOfferingHId"];
        this.mainInfoByHIdOnly = false;
      }
    });
  }

  async LoadMainInfo() {
    this.GetProdOfferByVerCode = new ProdOfferingCodeVersionObj();
    this.GetProdOfferByVerCode.ProdOfferingCode = this.prodOfferingCode;
    this.GetProdOfferByVerCode.ProdOfferingVersion = this.prodOfferingVersion;
    await this.http.post(this.ProdOfferingCodeVerUrl, this.GetProdOfferByVerCode).toPromise().then(
      response => {
        this.ProdOfferingCodeVersion = response;
        this.prodOfferingHId = this.ProdOfferingCodeVersion.ProdOfferingHId
      }
    );
  }


  async ngOnInit(): Promise<void> {
    if (this.prodOfferingHId == undefined) {
      this.prodOfferingHId = this.inputProdOfferingHId;
    }
    //** Main Information **//
    if (this.mainInfoByHIdOnly == true) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductOfferingMainInformation.json";
    }
    else {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/product/viewProductOfferingMainInformationByCode.json";
    }
    this.viewGenericObj.viewEnvironment = environment.losUrl;


    if (this.prodOfferingHId == 0) {
      await this.LoadMainInfo();
    }

    //** Product Offering Version **//
    await this.http.post(this.ProdOfferingVerUrl, {Id : this.prodOfferingHId}).toPromise().then(
      response => {
        this.ProdOfferingVersion = response[CommonConstant.ReturnObj];

      }
    );

    //** Office Member **//
    await this.http.post(this.ProdOfferingBranchUrl, {Id : this.prodOfferingHId}).toPromise().then(
      response => {
        this.ProdOfferingBranchMbr = response[CommonConstant.ReturnObj];
      }
    );


    //** Product Component **//
    this.refProductDetailObj = new ProductOfferingDetailObj();
    this.refProductDetailObj.ProdOfferingHId = this.prodOfferingHId;
    this.refProductDetailObj.RefProdCompntGrpCode = ['GEN', 'SCHM', 'SCORE', 'RULE', 'OTHR', 'LOS'];
    await this.http.post(this.ProdOfferingDUrl, this.refProductDetailObj).toPromise().then(
      response => {
        this.ProdComp = response[CommonConstant.ReturnObj].ProdOffComponents;
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
