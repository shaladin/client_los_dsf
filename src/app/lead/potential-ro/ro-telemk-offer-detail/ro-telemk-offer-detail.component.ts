import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DatePipe } from '@angular/common';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ResRoTelemkOfferSubjectObj } from 'app/shared/model/Lead/ResRoTelemkOfferSubjectObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { first } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-ro-telemk-offer-detail',
  templateUrl: './ro-telemk-offer-detail.component.html'
})
export class RoTelemkOfferDetailComponent implements OnInit {

  PromiseOpt: string = 'PROMISE_TO_LOAN';
  ViewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  TelemkOfferSubj: ResRoTelemkOfferSubjectObj;
  VerifResult: VerfResultObj;
  RoTelemkOfferingForm = this.fb.group({
    RoPotentialNo: ['', Validators.required],
    IsCustWillRo: ['', Validators.required],
    PromiseToLoanDt: [null],
    Notes: [null],
    Reason: ['']
  });

  roPotentialNo: string;
  listReason: Array<KeyValueObj>;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      this.roPotentialNo = params['RoPotentialNo'];
      this.RoTelemkOfferingForm.patchValue({ RoPotentialNo: this.roPotentialNo });
    });
  }

  businessDate: Date;

  async ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDate = new Date(context[CommonConstant.BUSINESS_DT]);
    this.businessDate.setDate(this.businessDate.getDate() + 1);

    let whereForView = [];
    whereForView.push(this.roPotentialNo);
    this.ViewMainDataObj.viewInput = "./assets/ucviewgeneric/viewTelemkOfferDetailMainInfo.json";
    this.ViewMainDataObj.viewEnvironment = environment.losUrl;
    this.ViewMainDataObj.whereValue = whereForView;

    await this.getVerfResultData();
    await this.getTelemkOfferSubj();

    await this.http.post(URLConstant.GetListActiveRefReason, { RefReasonTypeCode: CommonConstant.REF_REASON_RO_POTENTIAL }).pipe(first()).subscribe(
      (response) => {
        this.listReason = response[CommonConstant.ReturnObj];
        // this.RoTelemkOfferingForm.patchValue({
        //   Reason: this.listReason[0].Key
        // });
      }
    );
  }

  async getTelemkOfferSubj() {
    await this.http.post(URLConstant.GetTelemkOfferingSubjectByRoPotentialNo, { TrxNo: this.roPotentialNo }).toPromise().then(
      (response: ResRoTelemkOfferSubjectObj) => {
        this.TelemkOfferSubj = response;
      })
  }

  async getVerfResultData() {
    if (!this.roPotentialNo) return;

    await this.http.post(URLConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode, { TrxRefNo: this.roPotentialNo }).toPromise().then(
      (response: VerfResultObj) => {
        this.VerifResult = response;
      }
    );
    if (!this.VerifResult || this.VerifResult['VerfResultId'] == 0) {
      let Business_Date = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE));
      let datePipe = new DatePipe("en-US");
      let value = datePipe.transform(Business_Date, "yyyy-MM-dd");
      let businessDt = new Date(value);
      let reqAddVerifResultObj: VerfResultObj = new VerfResultObj();
      reqAddVerifResultObj.TrxRefNo = this.roPotentialNo;
      reqAddVerifResultObj.VerfDt = businessDt;
      reqAddVerifResultObj.MrVerfResultStatCode = CommonConstant.VerfResultStatCodeNew;
      reqAddVerifResultObj.MrVerfTrxTypeCode = CommonConstant.VerfSchemeCodeRoTelemkOffering;
      reqAddVerifResultObj.EmpNo = "-";
      reqAddVerifResultObj.LobCode = "-";
      reqAddVerifResultObj.LobName = "-";
      reqAddVerifResultObj.Notes = "-";
      await this.http.post(URLConstant.AddVerfResult, reqAddVerifResultObj).toPromise().then(
        (response) => { }
      );
    }
  }


  onChangeIsCustWillRo() {
    if (this.RoTelemkOfferingForm.controls['IsCustWillRo'].value == this.PromiseOpt)
      this.RoTelemkOfferingForm.controls['PromiseToLoanDt'].setValidators([Validators.required]);
    else
      this.RoTelemkOfferingForm.controls['PromiseToLoanDt'].clearValidators();

    if (this.RoTelemkOfferingForm.controls['IsCustWillRo'].value == "NO") {
      this.RoTelemkOfferingForm.controls['Reason'].setValidators([Validators.required]);
    } else {
      this.RoTelemkOfferingForm.controls['Reason'].clearValidators();
    }

    this.RoTelemkOfferingForm.controls['PromiseToLoanDt'].updateValueAndValidity();
    this.RoTelemkOfferingForm.controls['Reason'].updateValueAndValidity();
  }

  gotoView() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_POTENTIAL_RO_VIEW], { "RoPotentialNo": this.roPotentialNo, "IsFromTelemkOffer": true });
  }

  gotoVerif() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_POTENTIAL_RO_TEL_OFFER_VERIF], { "RoPotentialNo": this.roPotentialNo });
  }

  SaveForm() {
    let reqObj: object = {
      RoPotentialNo: this.RoTelemkOfferingForm.controls['RoPotentialNo'].value,
      IsCustWillRo: null,
      PromiseToLoanDt: this.RoTelemkOfferingForm.controls['IsCustWillRo'].value == this.PromiseOpt ? this.RoTelemkOfferingForm.controls['PromiseToLoanDt'].value : null,
      Notes: this.RoTelemkOfferingForm.controls['Notes'].value,
      ReasonCode: this.RoTelemkOfferingForm.controls['Reason'].value
    };

    let isWillRo = this.RoTelemkOfferingForm.controls['IsCustWillRo'].value;
    if (isWillRo == this.PromiseOpt) reqObj['IsCustWillRo'] = null;
    else if (isWillRo == 'YES') reqObj['IsCustWillRo'] = true;
    else reqObj['IsCustWillRo'] = false;

    this.http.post(URLConstant.UpdatePotentialRo, reqObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.onClickBack();
      })
  }

  onClickBack() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_POTENTIAL_RO_TEL_OFFER_PAGING], {});
  }
}
