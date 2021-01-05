import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustOtherInfoObj } from 'app/shared/model/AppCustOtherInfoObj.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-nap-other-info',
  templateUrl: './new-nap-other-info.component.html',
  styles: []
})
export class NewNapOtherInfoComponent implements OnInit {
  @Input() ParentForm: FormGroup;
  @Input() AppCustId: number;
  @Input() CustTypeCode: string;
  @Input() IsOtherInfoSubmitted: boolean;
  @Output() ResponseAppCustOtherInfo: EventEmitter<any> = new EventEmitter<any>();
  InputDebitorGroupLookupObj : InputLookupObj;
  InputDebitorBusinessScaleLookupObj: InputLookupObj;
  InputCounterpartCategoryLookupObj: InputLookupObj;
  InputSustaianableFinancialBusinessLookupObj: InputLookupObj;
  IsLookupReady: boolean;
  AttrGroup: string;
  ResponseCustOtherInfo : any;
  appCustOtherInfo : AppCustOtherInfoObj;
  custAttrRequest = new Array<Object>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder
  ) { 
    this.IsOtherInfoSubmitted = false;
  }

  async ngOnInit() {
    this.AttrGroup = this.CustTypeCode == CommonConstant.CustTypeCompany ? CommonConstant.AttrGroupCustCompanyOther:CommonConstant.AttrGroupCustPersonalOther;
 
    var AppcustOtherInfo = {
        AppCustId : this.AppCustId
      } 
    await this.httpClient.post(URLConstant.GetAppCustOtherInfoByAppCustId, AppcustOtherInfo).toPromise().then(
      (response: any) => {
        this.ResponseCustOtherInfo = response;
        this.ResponseAppCustOtherInfo.emit(response);
      });
  
      this.InputDebitorGroupLookupObj = new InputLookupObj();
      this.InputDebitorGroupLookupObj.urlJson = "./assets/uclookup/lookupDebitorGroup.json";
      this.InputDebitorGroupLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
      this.InputDebitorGroupLookupObj.urlEnviPaging = environment.FoundationR3Url;
      this.InputDebitorGroupLookupObj.pagingJson = "./assets/uclookup/lookupDebitorGroup.json";
      this.InputDebitorGroupLookupObj.genericJson = "./assets/uclookup/lookupDebitorGroup.json";
      this.InputDebitorGroupLookupObj.isReady = true;
  
      this.InputDebitorBusinessScaleLookupObj = new InputLookupObj(); 
      this.InputDebitorBusinessScaleLookupObj.urlJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
      this.InputDebitorBusinessScaleLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
      this.InputDebitorBusinessScaleLookupObj.urlEnviPaging = environment.FoundationR3Url;
      this.InputDebitorBusinessScaleLookupObj.pagingJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
      this.InputDebitorBusinessScaleLookupObj.genericJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
      this.InputDebitorBusinessScaleLookupObj.isReady = true;
      
      this.InputCounterpartCategoryLookupObj = new InputLookupObj(); 
      this.InputCounterpartCategoryLookupObj.urlJson = "./assets/uclookup/lookupCounterpartCategory.json";
      this.InputCounterpartCategoryLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
      this.InputCounterpartCategoryLookupObj.urlEnviPaging = environment.FoundationR3Url;
      this.InputCounterpartCategoryLookupObj.pagingJson = "./assets/uclookup/lookupCounterpartCategory.json";
      this.InputCounterpartCategoryLookupObj.genericJson = "./assets/uclookup/lookupCounterpartCategory.json";
      this.InputCounterpartCategoryLookupObj.isReady = true;
  
      this.InputSustaianableFinancialBusinessLookupObj = new InputLookupObj();
      this.InputSustaianableFinancialBusinessLookupObj.urlJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
      this.InputSustaianableFinancialBusinessLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
      this.InputSustaianableFinancialBusinessLookupObj.urlEnviPaging = environment.FoundationR3Url;
      this.InputSustaianableFinancialBusinessLookupObj.pagingJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
      this.InputSustaianableFinancialBusinessLookupObj.genericJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
      this.InputSustaianableFinancialBusinessLookupObj.isReady = true;

      if (this.ResponseCustOtherInfo.AppCustOtherInfoId != null) {

        this.InputDebitorGroupLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsDebtGrpLbppDescr };
        this.InputDebitorBusinessScaleLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsBizSclLbppDescr };
        this.InputCounterpartCategoryLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsCntrprtLbppDescr };
        this.InputSustaianableFinancialBusinessLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsBizSustainLbppDescr };
  
        this.ParentForm.patchValue({
          LbppmsDebtGrpLbppCode: this.ResponseCustOtherInfo.LbppmsDebtGrpLbppCode,
          LbppmsCntrprtLbppCode: this.ResponseCustOtherInfo.LbppmsCntrprtLbppCode,
          LbppmsBizSustainLbppCode: this.ResponseCustOtherInfo.LbppmsBizSustainLbppCode,
          LbppmsBizSclLbppCode: this.ResponseCustOtherInfo.LbppmsBizSclLbppCode,
          LbppmsCntrprtLbppDescr: this.ResponseCustOtherInfo.LbppmsCntrprtLbppDescr,
          LbppmsDebtGrpLbppDescr: this.ResponseCustOtherInfo.LbppmsDebtGrpLbppDescr,
          LbppmsBizSustainLbppDescr: this.ResponseCustOtherInfo.LbppmsBizSustainLbppDescr,
          LbppmsBizSclLbppDescr: this.ResponseCustOtherInfo.LbppmsBizSclLbppDescr
        });
      }
      this.IsLookupReady = true;
  }

  getLookupDebitorGroup(e){
    this.ParentForm.patchValue({
      LbppmsDebtGrpLbppCode: e.LbppCode,
      LbppmsDebtGrpLbppDescr: e.Descr
    }); 
  }   
  getLookupDebitorBusinessScale(e){
    this.ParentForm.patchValue({
      LbppmsBizSclLbppCode: e.LbppCode,
      LbppmsBizSclLbppDescr: e.Descr
    }); 
  }
  getLookupCounterpartCategory(e){
    this.ParentForm.patchValue({
      LbppmsCntrprtLbppCode: e.LbppCode,
      LbppmsCntrprtLbppDescr: e.Descr
    });  

  }
  getLookupSustainableFinancialBusiness(e){
    this.ParentForm.patchValue({
      LbppmsBizSustainLbppCode: e.LbppCode,
      LbppmsBizSustainLbppDescr: e.Descr
    }); 
  }


}
