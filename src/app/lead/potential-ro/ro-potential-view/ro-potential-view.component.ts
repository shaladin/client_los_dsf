import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';


@Component({
  selector: 'app-ro-potential-view',
  templateUrl: './ro-potential-view.component.html'
})
export class RoPotentialViewComponent implements OnInit {

  ViewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  VerifResultObj: VerfResultObj;
  VerifResultHObj: VerfResultHObj;
  VerifResultHDetailObj: Array<VerfResultHObj>;
  ListVerifResultHObj: Array<VerfResultHObj>;
  ListVerifResultDObj: Array<any>;
  IsViewSubDetail: boolean = false;
  IsFromTelemkOffer: boolean = false;
  IsFromTelemkOfferString: string = "true";
  roPotentialNo: string;
  reqVerfResObj = {
    TrxRefNo: "",
    MrVerfTrxTypeCode: CommonConstant.VerfSchemeCodeRoTelemkOffering,
  };
  reqVerfResHObj = {
    VerfResultHId: 0,
    VerfResultId: 0,
    MrVerfObjectCode: "",
  };
  reqVerfResDObj = {
    VerfResultHId: 0,
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NGXToastrService
  ) {
    this.route.queryParams.subscribe(params => {
      this.roPotentialNo = params['RoPotentialNo'];
      this.IsFromTelemkOfferString = params['IsFromTelemkOffer'];
      this.reqVerfResObj.TrxRefNo = this.roPotentialNo;
    });
  }

  async ngOnInit() {
    if(this.IsFromTelemkOfferString == "true"){
      this.IsFromTelemkOffer = true;
    }
    let whereForView = [];
    whereForView.push(this.roPotentialNo);
    console.log(this.IsFromTelemkOffer);
    if (this.IsFromTelemkOffer)
      this.ViewMainDataObj.viewInput = "./assets/ucviewgeneric/viewTelemkOfferDetailMainInfo.json";
    else
      this.ViewMainDataObj.viewInput = "./assets/ucviewgeneric/viewRoPotentialMainInfo.json";
    this.ViewMainDataObj.viewEnvironment = environment.losUrl;
    this.ViewMainDataObj.whereValue = whereForView;

    await this.getVerfResultData();
    await this.getVerfResultHData();
    await this.getListVerfResulHtData(this.reqVerfResHObj);
  }

  async getVerfResultData() {
    await this.http.post(URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode, this.reqVerfResObj).toPromise().then(
      (response: VerfResultObj) => {
        this.VerifResultObj = response;
        this.reqVerfResHObj.VerfResultId = this.VerifResultObj.VerfResultId;
      }
    );
  }

  async getVerfResultHData() {
    let obj = {
      TrxNo: this.reqVerfResObj.TrxRefNo
    }
    await this.http.post(URLConstant.GetVerfResultHsByTrxRefNo, obj).toPromise().then(
      (response) => {
        if (!response['responseVerfResultHCustomObjs'] || !response['responseVerfResultHCustomObjs'].length) return;
        this.VerifResultHObj = response['responseVerfResultHCustomObjs'][0];
        this.reqVerfResHObj.MrVerfObjectCode = this.VerifResultHObj.MrVerfObjectCode;
      }
    );
  }

  async getListVerfResulHtData(reqVerfResHObj) {
    await this.http.post(URLConstant.GetVerfResultHsByVerfResultIdAndObjectCode, reqVerfResHObj).toPromise().then(
      (response) => {
        this.ListVerifResultHObj = response["responseVerfResultHCustomObjs"];
      }
    );
  }

  showDetail(VerfResultHId) {
    this.VerifResultHDetailObj = this.ListVerifResultHObj.filter(vrh => vrh.VerfResultHId === VerfResultHId);
    this.IsViewSubDetail = true;
    this.reqVerfResDObj.VerfResultHId = VerfResultHId;
    let obj = {
      Id: this.reqVerfResDObj.VerfResultHId
    }
    this.http.post(URLConstant.GetListVerfResultDInQuestionGrp, obj).subscribe(
      (response: GenericListObj) => {
        this.ListVerifResultDObj = response.ReturnObject;
      }
    );
  }

  hideDetail() {
    this.IsViewSubDetail = false;
  }

  gotoTelemkDetail() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_POTENTIAL_RO_TEL_OFFER_DETAIL], { "RoPotentialNo": this.roPotentialNo });
  }

  getEvent(event) {
    if(event.Key == "customer"){
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: event.ViewObj.CustNo}).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }
}
