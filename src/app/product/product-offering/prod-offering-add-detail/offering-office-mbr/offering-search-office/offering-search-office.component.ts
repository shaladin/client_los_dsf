import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ResGetProdOfferingBranchMbrObj } from 'app/shared/model/Response/Product/ResGetProdOfferingBranchMbrObj.model';
import { ReqListProdOfferingBranchMbrObj, ReqProdOfferingBranchMbrDomainObj } from 'app/shared/model/Request/Product/ReqAddProdOfferingBranchMbrObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ProdOfficePassingObj } from 'app/product/product-ho/prod-ho-add-detail/ProdOfficePassingObj.model';
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
    private toastr: NGXToastrService
  ) {
  }

  ngOnInit() {
    this.TempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/product/productOfficeMbrTempPaging.json";
    this.TempPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.TempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/product/productOfficeMbrTempPaging.json";

    this.GenericByIdObj.Id = this.ProdHId;
    this.http.post<ResGetProdOfferingBranchMbrObj>(URLConstant.GetListProdBranchOfficeMbrByProdHId, this.GenericByIdObj).subscribe(
      response => {
        for (let i = 0; i < response.ReturnObject.length; i++) {
          this.ArrListCode.push(response.ReturnObject[i].OfficeCode);
        }
        let addCrit = new CriteriaObj();
        addCrit.propName = "RO.OFFICE_CODE";
        addCrit.restriction = AdInsConstant.RestrictionIn;
        addCrit.listValue = this.ArrListCode;
        this.TempPagingObj.addCritInput.push(addCrit);

      }
    );

    if (this.ListOfficeMemberObjInput.length != 0) {
      let addCrit = new CriteriaObj();
      addCrit.propName = "RO.OFFICE_CODE";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.ListOfficeMemberObjInput;
      this.TempPagingObj.addCritInput.push(addCrit);
    }
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
