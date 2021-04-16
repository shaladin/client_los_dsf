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
import { ReqListProdOfferingBranchMbrObj } from 'app/shared/model/Request/Product/ReqAddProdOfferingBranchMbrObj.model';
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
  @Output() componentIsOn: EventEmitter<ProdOfficePassingObj> = new EventEmitter<ProdOfficePassingObj>();
  GenericByIdObj : GenericObj = new GenericObj();
  listSelected: Array<any> = new Array<any>();
  arrListCode: Array<string> = new Array<string>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  PassingObj: ProdOfficePassingObj = new ProdOfficePassingObj();
  ReqListProdBranchMbrObj : ReqListProdOfferingBranchMbrObj = new ReqListProdOfferingBranchMbrObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService
  ) {
  }

  ngOnInit() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/product/productOfficeMbrTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/product/productOfficeMbrTempPaging.json";
    this.tempPagingObj.ddlEnvironments = [
      {
        name: "ROA.AREA_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    this.GenericByIdObj.Id = this.ProdHId;
    this.http.post<ResGetProdOfferingBranchMbrObj>(URLConstant.GetListProdBranchOfficeMbrByProdHId, this.GenericByIdObj).subscribe(
      response => {
        for (let i = 0; i < response.ReturnObject.length; i++) {
          this.arrListCode.push(response.ReturnObject[i].OfficeCode);
        }
        var addCrit = new CriteriaObj();
        addCrit.propName = "RO.OFFICE_CODE";
        addCrit.restriction = AdInsConstant.RestrictionIn;
        addCrit.listValue = this.arrListCode;
        this.tempPagingObj.addCritInput.push(addCrit);

      }
    );

    if (this.ListOfficeMemberObjInput.length != 0) {
      var addCrit = new CriteriaObj();
      addCrit.propName = "RO.OFFICE_CODE";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.ListOfficeMemberObjInput;
      this.tempPagingObj.addCritInput.push(addCrit);
    }
    this.tempPagingObj.isReady = true;
  }

  GoBack() {
    this.PassingObj.isOn = true;
    this.componentIsOn.emit(this.PassingObj);
  }

  getListTemp(ev) {
    this.listSelected = ev["TempListObj"];
  }

  SaveForm() {
    if (this.listSelected.length == 0) {
      this.toastr.errorMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }
  
    this.ReqListProdBranchMbrObj.ProdOfferingBranchMbrs = this.listSelected

    for (var i = 0; i < this.listSelected.length; i++) {
      this.ReqListProdBranchMbrObj.ProdOfferingBranchMbrs[i].ProdOfferingHId = this.ProdOfferingHId,
      this.ReqListProdBranchMbrObj.ProdOfferingBranchMbrs[i].RowVersion = "";
    }

    this.http.post(URLConstant.AddProdOfferingOfficeMbrBatch, this.ReqListProdBranchMbrObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.PassingObj.isOn = true;
        this.componentIsOn.emit(this.PassingObj);
      }
    );
  }
}
