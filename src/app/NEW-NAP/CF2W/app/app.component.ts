import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  inputAddressObjForOwner: InputAddressObj;
  inputAddressObjForLoc: InputAddressObj;

  constructor(private http: HttpClient, private fb: FormBuilder, private route: ActivatedRoute) {
    this.getRefMasterListKeyValueActiveByCodeUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.getListKvpActiveRefAppSrcUrl = URLConstant.GetListKvpActiveRefAppSrc;
    this.getListActiveRefPayFreqUrl = URLConstant.GetListActiveRefPayFreq;
    this.getAppCustAddrUrl = URLConstant.GetListAppCustAddrByAppId;
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"] ? params["AppId"] : this.AppId;
    })
  }
  titleFinancialData: string = "Financial Data" + "  Regular Fixed";
  appCustAddrObj: any;
  AppId: any;
  getCustAddr: string;
  getRefMasterListKeyValueActiveByCodeUrl: string;
  getListKvpActiveRefAppSrcUrl: string;
  getListActiveRefPayFreqUrl: string;
  getAppCustAddrUrl: string;
  ownerAddrObj: any;
  locationAddrObj: any;
  copyCustomerAddr: any;
  inputFieldOwnerAddrObj: any;
  inputFieldLocationAddrObj: any;
  inputLookupObj: any;
  InputLookupCityIssuerObj: any;
  tempMrSalesRecommendCode: any;
  tempMrAppSourceCode: any;
  tempPayFreqCode: any;
  tempMrFirstInstTypeCode: any;
  tempMrCustNotifyOptCode: any;
  tempMrWopCode: any;
  tempInterestType: any;
  tempMrAssetConditionCode: any;
  tempMrAssetUsageCode: any;
  tempMrUserRelationshipCode: any;
  tempMrOwnerRelationshipCode: any;
  tempMrIdTypeCode: any;
  tempRateType: any;
  tempCopyAddrOwnerFrom: any;
  tempCopyAddrLocationFrom: any;
  tempMrGracePeriodTypeCode: any;
  AddrLegalObj: any;
  AddrResidenceObj: any;
  AddrMailingObj: any;
  AppCustAddrObj: any;
  CopyAddrOwnerFromType: any;
  EffectiveRateType : any;
  CopyAddrLocationFromType: any;
  appForm = this.fb.group({
    SalesOfficerNo: [''],
    SalesOfficerName: [''],
    SalesHeadNo: [''],
    SalesHeadName: [''],
    MrSalesRecommendCode: [''],
    SalesNotes: [''],
    MrAppSourceCode: [''],
    SrvyOrderNo: [''],
    Tenor: ["", [Validators.pattern("^[0-9]+$"), Validators.required]],
    MrFirstInstTypeCode: [''],
    PayFreqCode: [''],
    InterestType: [''],
    NumOfInst: [''],
    MrInstSchemeCode: [''],
    MrCustNotifyOptCode: [''],
    MrWopCode: [''],

    MrAssetConditionCode: [''],
    SerialNo1: [''],
    MrAssetUsageCode: [''],
    SerialNo2: [''],
    TaxCityIssuer: [''],
    SerialNo3: [''],
    TaxCityDt: [''],
    ManufacturingYear: ['', [Validators.pattern("^[0-9]+$")]],
    AssetTaxDt: [''],

    CopyAddrOwnerFrom: [''],
    CopyAddrLocationFrom: [''],
    UserName: [''],
    MrUserRelationshipCode: [''],
    OwnerName: [''],
    MrIdTypeCode: [''],
    MrOwnerRelationshipCode: [''],
    OwnerIdNo: [''],

    OwnerMobilePhnNo: [''],
    Notes: [''],

    TotalInsCptlzAmt: [''],
    TotalInsIncomeAmt: [''],

    //Use Life Insurance ? 
    TotalLifeInsCptlzAmt: [''],
    TotalLifeInsIncomeAmt: [''],
    
    //Dp asset,  
    //  rate type tidak masuk db 
    EffectiveRatePrcnt: [''],
    FlatRatePrcnt: [''],
    RateType: [''],
    InstAmt: [''],
    TdpPaidCoyAmt: [''], 
    RoundingAmt: [''],
    TotalInsCustAmt: [''],
    MrGracePeriodTypeCode: [''], 
    GracePeriod: ['']


  });
  async ngOnInit(): Promise<void> {
    this.inputAddressObjForOwner = new InputAddressObj();
    this.inputAddressObjForOwner.showSubsection = false;
    this.inputAddressObjForOwner.title = "Customer Address";
    this.inputAddressObjForOwner.showAllPhn = false;
    this.inputAddressObjForOwner.showFax = false;
    
    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.title = "Customer Address";
    this.inputAddressObjForLoc.showAllPhn = false;
    this.inputAddressObjForLoc.showFax = false;

    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();

    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmp.json";
    this.inputLookupObj.nameSelect = this.appForm.controls.SalesOfficerName.value;


    this.InputLookupCityIssuerObj = new InputLookupObj();
    this.InputLookupCityIssuerObj.urlJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupCityIssuerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCityIssuerObj.pagingJson = "./assets/uclookup/NAP/lookupDistrict.json";
    this.InputLookupCityIssuerObj.genericJson = "./assets/uclookup/NAP/lookupDistrict.json";
    await this.GetListAddr();
    //DDL Var Type Code
    var refMasterSalesRecommendation = new RefMasterObj();
    refMasterSalesRecommendation.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeSlsRecom;
    var AppSourceObj = {
      RowVersion: ""
    };
    var PayFreqCodeObj = {
      RowVersion: ""
    };
    var refMasterFirstInstType = new RefMasterObj();
    refMasterFirstInstType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeFirstInstType;
    var refMasterInterestType = new RefMasterObj();
    refMasterInterestType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInterestTypeGeneral;
    var refMasterCustNotifyOpt = new RefMasterObj();
    refMasterCustNotifyOpt.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustNotifyOpt;
    var refMasterWop = new RefMasterObj();
    refMasterWop.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeWOP;
    var refMasterCodeInterestType = new RefMasterObj();
    refMasterCodeInterestType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInterestTypeGeneral;
    var refMasterCodeAssetCondition = new RefMasterObj();
    refMasterCodeAssetCondition.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetCondition;
    var refMasterCodeAssetUsage = new RefMasterObj();
    refMasterCodeAssetUsage.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetUsage;
    var refMasterCodeCustPersonalRelationship = new RefMasterObj();
    refMasterCodeCustPersonalRelationship.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    var refMasterCodeIdType = new RefMasterObj();
    refMasterCodeIdType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    var refMasterCodeRateType = new RefMasterObj();
    refMasterCodeRateType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeRateType;
    var refMasterTypeCodeAddrType = new RefMasterObj();
    refMasterTypeCodeAddrType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAddrType;
    var refMasterTypeCodeGracePeriodType = new RefMasterObj();
    refMasterTypeCodeGracePeriodType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeGracePeriodType;

    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterSalesRecommendation).subscribe(
      (response) => {
        this.tempMrSalesRecommendCode = response[CommonConstant.ReturnObj];

        if (this.tempMrSalesRecommendCode.length > 0) {
          this.appForm.patchValue({
            MrSalesRecommendCode: this.tempMrSalesRecommendCode[0].Key
          });;
        }
      }
    );
    this.http.post(this.getListKvpActiveRefAppSrcUrl, AppSourceObj).subscribe(
      (response) => {
        this.tempMrAppSourceCode = response[CommonConstant.ReturnObj];
        if (this.tempMrAppSourceCode.length > 0) {
          this.appForm.patchValue({
            MrAppSourceCode: this.tempMrAppSourceCode[0].Key
          });;
        }
      }
    );
    this.http.post(this.getListActiveRefPayFreqUrl, PayFreqCodeObj).subscribe(
      (response) => {
        this.tempPayFreqCode = response[CommonConstant.ReturnObj];
        if (this.tempPayFreqCode.length > 0) {
          this.appForm.patchValue({
            PayFreqCode: this.tempPayFreqCode[0].PayFreqCode
          });;
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterFirstInstType).subscribe(
      (response) => {
        this.tempMrFirstInstTypeCode = response[CommonConstant.ReturnObj];
        if (this.tempMrFirstInstTypeCode.length > 0) {
          this.appForm.patchValue({
            MrFirstInstTypeCode: this.tempMrFirstInstTypeCode[0].Key
          });;
        }
      }
    );

    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterFirstInstType).subscribe(
      (response) => {
        this.tempMrFirstInstTypeCode = response[CommonConstant.ReturnObj];

        if (this.tempMrFirstInstTypeCode.length > 0) {
          this.appForm.patchValue({
            MrFirstInstTypeCode: this.tempMrFirstInstTypeCode[0].Key
          });;
        }
      }
    );

    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCustNotifyOpt).subscribe(
      (response) => {
        this.tempMrCustNotifyOptCode = response[CommonConstant.ReturnObj];

        if (this.tempMrCustNotifyOptCode.length > 0) {
          this.appForm.patchValue({
            MrCustNotifyOptCode: this.tempMrCustNotifyOptCode[0].Key
          });;
        }
      }
    );

    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterWop).subscribe(
      (response) => {
        this.tempMrWopCode = response[CommonConstant.ReturnObj];
        if (this.tempMrWopCode.length > 0) {
          this.appForm.patchValue({
            MrWopCode: this.tempMrWopCode[0].Key
          });;
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCodeInterestType).subscribe(
      (response) => {
        this.tempInterestType = response[CommonConstant.ReturnObj];
        if (this.tempInterestType.length > 0) {
          this.appForm.patchValue({
            InterestType: this.tempInterestType[0].Key
          });;
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCodeAssetCondition).subscribe(
      (response) => {
        this.tempMrAssetConditionCode = response[CommonConstant.ReturnObj];
        if (this.tempMrAssetConditionCode.length > 0) {
          this.appForm.patchValue({
            MrAssetConditionCode: this.tempMrAssetConditionCode[0].Key
          });;
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCodeAssetUsage).subscribe(
      (response) => {
        this.tempMrAssetUsageCode = response[CommonConstant.ReturnObj];
        if (this.tempMrAssetUsageCode.length > 0) {
          this.appForm.patchValue({
            MrAssetUsageCode: this.tempMrAssetUsageCode[0].Key
          });;
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCodeCustPersonalRelationship).subscribe(
      (response) => {
        this.tempMrUserRelationshipCode = response[CommonConstant.ReturnObj];
        this.tempMrOwnerRelationshipCode = response[CommonConstant.ReturnObj];
        if (this.tempMrUserRelationshipCode.length > 0) {
          this.appForm.patchValue({
            MrUserRelationshipCode: this.tempMrUserRelationshipCode[0].Key,
            MrOwnerRelationshipCode: this.tempMrOwnerRelationshipCode[0].Key
          });
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCodeIdType).subscribe(
      (response) => {
        this.tempMrIdTypeCode = response[CommonConstant.ReturnObj];
        if (this.tempMrIdTypeCode.length > 0) {
          this.appForm.patchValue({
            MrIdTypeCode: this.tempMrIdTypeCode[0].Key,

          });
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterCodeRateType).subscribe(
      (response) => {
        this.tempRateType = response[CommonConstant.ReturnObj];
        if (this.tempRateType.length > 0) {
          this.appForm.patchValue({
            RateType: this.tempRateType[0].Key, 
          });
          if(this.tempRateType[0].Key == "FLT"){
            this.appForm.controls.EffectiveRatePrcnt.disable();
            this.appForm.controls.FlatRatePrcnt.enable(); 
          }else if(this.tempRateType[0].Key == "EFCTV"){
            this.appForm.controls.EffectiveRatePrcnt.enable();
            this.appForm.controls.FlatRatePrcnt.disable(); 
          } 
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterTypeCodeAddrType).subscribe(
      (response) => {
        this.tempCopyAddrOwnerFrom = response[CommonConstant.ReturnObj];
        this.tempCopyAddrLocationFrom = response[CommonConstant.ReturnObj]; 
        if (this.tempRateType.length > 0) {
          this.appForm.patchValue({
            CopyAddrOwnerFrom: this.tempCopyAddrOwnerFrom[0].Key,
            CopyAddrLocationFrom: this.tempCopyAddrLocationFrom[0].Key,
          });
          this.CopyAddrOwnerFromType = this.appForm.controls.CopyAddrOwnerFrom.value;
          this.CopyAddrLocationFromType = this.appForm.controls.CopyAddrLocationFrom.value;
        }
      }
    );
    this.http.post(this.getRefMasterListKeyValueActiveByCodeUrl, refMasterTypeCodeGracePeriodType).subscribe(
      (response) => {
        this.tempMrGracePeriodTypeCode = response[CommonConstant.ReturnObj];
        if (this.tempMrGracePeriodTypeCode.length > 0) {
          this.appForm.patchValue({
            MrGracePeriodTypeCode: this.tempMrGracePeriodTypeCode[0].Key,

          });
        }
      }
    );

  }
  getLookupEmployeeResponse(ev) {
    this.appForm.patchValue({
      SalesOfficerNo: ev.SalesOfficerNo,
      SalesOfficerName: ev.SalesOfficerName,
      SalesHeadNo: ev.SalesHeadNo,
      SalesHeadName: ev.SalesHeadName

    });
  }

  PayFreqVal;
  PayFreqTimeOfYear;
  ChangeNumOfInstallmentTenor() {
    var temp = this.appForm.controls.Tenor.value;
    if (!isNaN(temp)) {
      if (this.PayFreqTimeOfYear == null && this.PayFreqVal == null) {
        this.PayFreqVal = this.tempPayFreqCode[0].PayFreqVal;
        this.PayFreqTimeOfYear = this.tempPayFreqCode[0].TimeOfYear;
      }
      var total = Math.floor((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }

  ChangeNumOfInstallmentPayFreq(ev) {

    var idx = ev.target.selectedIndex;
    var temp = this.appForm.controls.Tenor.value;
    if (!isNaN(temp)) {
      this.PayFreqVal = this.tempPayFreqCode[idx].PayFreqVal;
      this.PayFreqTimeOfYear = this.tempPayFreqCode[idx].TimeOfYear;
      var total = Math.floor((this.PayFreqTimeOfYear / 12) * temp / this.PayFreqVal);
      this.PatchNumOfInstallment(total);
    }
  }
  PatchNumOfInstallment(num) {
    this.appForm.patchValue({
      NumOfInst: num
    });
  }
  SetBpkbCity(event) {
    this.appForm.patchValue({
      TaxCityIssuer: event.DistrictCode,

    });
  }

  async GetListAddr() {
    this.appCustAddrObj = new AppCustAddrObj();
    this.appCustAddrObj.AppId = this.AppId;
    this.http.post(this.getAppCustAddrUrl, this.appCustAddrObj).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AddrLegalObj = this.AppCustAddrObj.filter(
          emp => emp.MrCustAddrTypeCode === CommonConstant.AddrTypeLegal);
        this.AddrResidenceObj = this.AppCustAddrObj.filter(
          emp => emp.MrCustAddrTypeCode === CommonConstant.AddrTypeResidence);
        this.AddrMailingObj = this.AppCustAddrObj.filter(
          emp => emp.MrCustAddrTypeCode === CommonConstant.AddrTypeMailing);
      }
    );
  }

  copyToOwnerAddr() {
    if (this.CopyAddrOwnerFromType == CommonConstant.AddrTypeLegal) {

      this.ownerAddrObj = new AddrObj();
      this.ownerAddrObj.Addr = this.AddrLegalObj[0].Addr;
      this.ownerAddrObj.AreaCode1 = this.AddrLegalObj[0].AreaCode1;
      this.ownerAddrObj.AreaCode2 = this.AddrLegalObj[0].AreaCode2;
      this.ownerAddrObj.AreaCode3 = this.AddrLegalObj[0].AreaCode3;
      this.ownerAddrObj.AreaCode4 = this.AddrLegalObj[0].AreaCode4;
      this.ownerAddrObj.City = this.AddrLegalObj[0].City;
      this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.AddrLegalObj[0].Zipcode;
      this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AddrLegalObj[0].Zipcode };
      this.inputAddressObjForOwner.default = this.ownerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
    }

    if (this.CopyAddrOwnerFromType == CommonConstant.AddrTypeResidence) {

      this.appForm.patchValue({
        OwnerAddr: this.AddrResidenceObj[0].Addr,
        OwnerAreaCode1: this.AddrResidenceObj[0].AreaCode1,
        OwnerAreaCode2: this.AddrResidenceObj[0].AreaCode2,
        OwnerAreaCode3: this.AddrResidenceObj[0].AreaCode3,
        OwnerAreaCode4: this.AddrResidenceObj[0].AreaCode4,
        OwnerCity: this.AddrResidenceObj[0].City,
        OwnerZipcode: this.AddrResidenceObj[0].Zipcode
      });
      this.ownerAddrObj = new AddrObj();
      this.ownerAddrObj.Addr = this.AddrResidenceObj[0].Addr;
      this.ownerAddrObj.AreaCode1 = this.AddrResidenceObj[0].AreaCode1;
      this.ownerAddrObj.AreaCode2 = this.AddrResidenceObj[0].AreaCode2;
      this.ownerAddrObj.AreaCode3 = this.AddrResidenceObj[0].AreaCode3;
      this.ownerAddrObj.AreaCode4 = this.AddrResidenceObj[0].AreaCode4;
      this.ownerAddrObj.City = this.AddrResidenceObj[0].City;

      this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.AddrResidenceObj[0].Zipcode;
      this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AddrResidenceObj[0].Zipcode };
      this.inputAddressObjForOwner.default = this.ownerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
    }

    if (this.CopyAddrOwnerFromType == CommonConstant.AddrTypeMailing) {

      this.appForm.patchValue({
        OwnerAddr: this.AddrMailingObj[0].Addr,
        OwnerAreaCode1: this.AddrMailingObj[0].AreaCode1,
        OwnerAreaCode2: this.AddrMailingObj[0].AreaCode2,
        OwnerAreaCode3: this.AddrMailingObj[0].AreaCode3,
        OwnerAreaCode4: this.AddrMailingObj[0].AreaCode4,
        OwnerCity: this.AddrMailingObj[0].City,
        OwnerZipcode: this.AddrMailingObj[0].Zipcode
      });
      this.ownerAddrObj = new AddrObj();
      this.ownerAddrObj.Addr = this.AddrMailingObj[0].Addr;
      this.ownerAddrObj.AreaCode1 = this.AddrMailingObj[0].AreaCode1;
      this.ownerAddrObj.AreaCode2 = this.AddrMailingObj[0].AreaCode2;
      this.ownerAddrObj.AreaCode3 = this.AddrMailingObj[0].AreaCode3;
      this.ownerAddrObj.AreaCode4 = this.AddrMailingObj[0].AreaCode4;
      this.ownerAddrObj.City = this.AddrMailingObj[0].City;

      this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.AddrMailingObj[0].Zipcode;
      this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AddrMailingObj[0].Zipcode };
      this.inputAddressObjForOwner.default = this.ownerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
    }
  }

  copyToLocationAddr() {

    if (this.CopyAddrLocationFromType == CommonConstant.AddrTypeLegal) {

      this.appForm.patchValue({
        LocationAddr: this.AddrLegalObj[0].Addr,
        LocationAreaCode1: this.AddrLegalObj[0].AreaCode1,
        LocationAreaCode2: this.AddrLegalObj[0].AreaCode2,
        LocationAreaCode3: this.AddrLegalObj[0].AreaCode3,
        LocationAreaCode4: this.AddrLegalObj[0].AreaCode4,
        LocationCity: this.AddrLegalObj[0].City,
        LocationZipcode: this.AddrLegalObj[0].Zipcode
      });
      this.locationAddrObj = new AddrObj();
      this.locationAddrObj.Addr = this.AddrLegalObj[0].Addr;
      this.locationAddrObj.AreaCode1 = this.AddrLegalObj[0].AreaCode1;
      this.locationAddrObj.AreaCode2 = this.AddrLegalObj[0].AreaCode2;
      this.locationAddrObj.AreaCode3 = this.AddrLegalObj[0].AreaCode3;
      this.locationAddrObj.AreaCode4 = this.AddrLegalObj[0].AreaCode4;
      this.locationAddrObj.City = this.AddrLegalObj[0].City;

      this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.AddrLegalObj[0].Zipcode;
      this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AddrLegalObj[0].Zipcode };
      this.inputAddressObjForLoc.default = this.locationAddrObj;
      this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
    }

    if (this.CopyAddrLocationFromType == CommonConstant.AddrTypeResidence) {

      this.appForm.patchValue({
        LocationAddr: this.AddrResidenceObj[0].Addr,
        LocationAreaCode1: this.AddrResidenceObj[0].AreaCode1,
        LocationAreaCode2: this.AddrResidenceObj[0].AreaCode2,
        LocationAreaCode3: this.AddrResidenceObj[0].AreaCode3,
        LocationAreaCode4: this.AddrResidenceObj[0].AreaCode4,
        LocationCity: this.AddrResidenceObj[0].City,
        LocationZipcode: this.AddrResidenceObj[0].Zipcode
      });
      this.locationAddrObj = new AddrObj();
      this.locationAddrObj.Addr = this.AddrResidenceObj[0].Addr;
      this.locationAddrObj.AreaCode1 = this.AddrResidenceObj[0].AreaCode1;
      this.locationAddrObj.AreaCode2 = this.AddrResidenceObj[0].AreaCode2;
      this.locationAddrObj.AreaCode3 = this.AddrResidenceObj[0].AreaCode3;
      this.locationAddrObj.AreaCode4 = this.AddrResidenceObj[0].AreaCode4;
      this.locationAddrObj.City = this.AddrResidenceObj[0].City;

      this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.AddrResidenceObj[0].Zipcode;
      this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AddrResidenceObj[0].Zipcode };
      this.inputAddressObjForLoc.default = this.locationAddrObj;
      this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
    }

    if (this.CopyAddrLocationFromType == CommonConstant.AddrTypeMailing) {
      this.appForm.patchValue({
        LocationAddr: this.AddrMailingObj[0].Addr,
        LocationAreaCode1: this.AddrMailingObj[0].AreaCode1,
        LocationAreaCode2: this.AddrMailingObj[0].AreaCode2,
        LocationAreaCode3: this.AddrMailingObj[0].AreaCode3,
        LocationAreaCode4: this.AddrMailingObj[0].AreaCode4,
        LocationCity: this.AddrMailingObj[0].City,
        LocationZipcode: this.AddrMailingObj[0].Zipcode
      });
      this.locationAddrObj = new AddrObj();
      this.locationAddrObj.Addr = this.AddrMailingObj[0].Addr;
      this.locationAddrObj.AreaCode1 = this.AddrMailingObj[0].AreaCode1;
      this.locationAddrObj.AreaCode2 = this.AddrMailingObj[0].AreaCode2;
      this.locationAddrObj.AreaCode3 = this.AddrMailingObj[0].AreaCode3;
      this.locationAddrObj.AreaCode4 = this.AddrMailingObj[0].AreaCode4;
      this.locationAddrObj.City = this.AddrMailingObj[0].City;

      this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.AddrMailingObj[0].Zipcode;
      this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AddrMailingObj[0].Zipcode };
      this.inputAddressObjForLoc.default = this.locationAddrObj;
      this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
    }
  }
  SetLocationAddrType(event) {
    this.CopyAddrLocationFromType = event; 
  }
  SetEffectiveRateType(event){
    this.EffectiveRateType = event; 

    if(this.EffectiveRateType == CommonConstant.RateTypeFlat){
      this.appForm.controls.EffectiveRatePrcnt.disable();
      this.appForm.controls.FlatRatePrcnt.enable(); 
    }else if(this.EffectiveRateType == CommonConstant.RateTypeEffective){
      this.appForm.controls.EffectiveRatePrcnt.enable();
      this.appForm.controls.FlatRatePrcnt.disable(); 
    }

 
  }
  SetOwnerAddrType(event) {
    this.CopyAddrOwnerFromType = event; 
  }
}
