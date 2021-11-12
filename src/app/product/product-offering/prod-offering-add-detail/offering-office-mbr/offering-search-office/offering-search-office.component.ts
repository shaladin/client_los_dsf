import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { FromValueObj, UcTempPagingObj } from 'app/shared/model/temp-paging/uc-temp-paging-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ReqListProdOfferingBranchMbrObj, ReqProdOfferingBranchMbrDomainObj } from 'app/shared/model/request/product/req-add-prod-offering-branch-mbr-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ProdOfficePassingObj } from 'app/product/product-ho/prod-ho-add-detail/ProdOfficePassingObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
@Component({
  selector: 'app-offering-search-office',
  templateUrl: './offering-search-office.component.html'
})
export class OfferingSearchOfficeComponent implements OnInit {
  @Input() ListOfficeMemberObjInput: Array<string> = new Array<string>();
  @Input() ProdOfferingHId: number;
  @Input() ProdHId: number;
  @Output() ComponentIsOn: EventEmitter<ProdOfficePassingObj> = new EventEmitter<ProdOfficePassingObj>();
  GenericByIdObj : GenericObj = new GenericObj();
  ArrListCode: Array<string> = new Array<string>();
  TempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  PassingObj: ProdOfficePassingObj = new ProdOfficePassingObj();
  ReqListProdBranchMbrObj : ReqListProdOfferingBranchMbrObj = new ReqListProdOfferingBranchMbrObj();
  ListSelected: Array<ReqProdOfferingBranchMbrDomainObj> = new Array<ReqProdOfferingBranchMbrDomainObj>();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private cookieService: CookieService
  ) {
  }

  ngOnInit() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.TempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/product/productOfficeMbrTempPaging.json";
    this.TempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/product/productOfficeMbrTempPaging.json";
    
    this.TempPagingObj.addCritInput = new Array();
    
    if(currentUserContext.OfficeCode != "HO"){
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'RO.PARENT_OFFICE_CODE';
      critObj.value = currentUserContext.OfficeCode;
      this.TempPagingObj.addCritInput.push(critObj);

      critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionOr;
      critObj.propName = 'RO.OFFICE_CODE';
      critObj.value = currentUserContext.OfficeCode;
      this.TempPagingObj.addCritInput.push(critObj);
    }

    let fromValueObj = new FromValueObj();
    fromValueObj.property = 'ProdHId';
    fromValueObj.value = this.ProdHId;
    this.TempPagingObj.fromValue.push(fromValueObj);
    
    let fromValueObj2 = new FromValueObj();
    fromValueObj2.property = 'ProdOfferingHId';
    fromValueObj2.value = this.ProdOfferingHId;
    this.TempPagingObj.fromValue.push(fromValueObj2);

    this.TempPagingObj.isReady = true;
  }

  GoBack() {
    this.PassingObj.isOn = true;
    this.ComponentIsOn.emit(this.PassingObj);
  }

  getListTemp(ev) {
    this.ListSelected = ev["TempListObj"];
  }

  SaveForm() {
    if (this.ListSelected.length == 0) {
      this.toastr.errorMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }
  
    this.ReqListProdBranchMbrObj.ProdOfferingBranchMbrs = this.ListSelected

    for (var i = 0; i < this.ListSelected.length; i++) {
      this.ReqListProdBranchMbrObj.ProdOfferingBranchMbrs[i].ProdOfferingHId = this.ProdOfferingHId,
      this.ReqListProdBranchMbrObj.ProdOfferingBranchMbrs[i].RowVersion = "";
    }

    this.http.post(URLConstant.AddProdOfferingOfficeMbrBatch, this.ReqListProdBranchMbrObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.PassingObj.isOn = true;
        this.ComponentIsOn.emit(this.PassingObj);
      }
    );
  }
}
