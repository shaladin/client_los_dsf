import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ReqListProdBranchMbrObj } from 'app/shared/model/Request/Product/ReqAddProdBranchMbrObj.model';
import { ProdOfficePassingObj } from 'app/shared/model/Product/ProdOfficePassingObj.model';
@Component({
  selector: 'app-ho-search-office',
  templateUrl: './ho-search-office.component.html'
})
export class HoSearchOfficeComponent implements OnInit {
  @Input() ProdHId : number;
  @Output() componentIsOn: EventEmitter<any> = new EventEmitter();
  @Input() ListOfficeMemberObjInput: Array<string> = new Array<string>();
  listSelected: Array<any> = new Array<any>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  ReqListProdBranchMbrObj: ReqListProdBranchMbrObj = new ReqListProdBranchMbrObj();
  PassingObj: ProdOfficePassingObj = new ProdOfficePassingObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService
  ) { }


  ngOnInit() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/product/productHOfficeMbrTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/product/productHOfficeMbrTempPaging.json";
    this.tempPagingObj.ddlEnvironments = [
      {
        name: "ROA.AREA_CODE",
        environment: environment.FoundationR3Url
      }
    ];

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
    this.listSelected = ev;
  }

  SaveForm() {
    if (this.listSelected.length == 0) {
      this.toastr.errorMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }

    this.ReqListProdBranchMbrObj.ProductBranchMbrs = this.listSelected["TempListObj"];

    for (var i = 0; i < this.ReqListProdBranchMbrObj.ProductBranchMbrs.length; i++) {
      this.ReqListProdBranchMbrObj.ProductBranchMbrs[i].ProdHId = this.ProdHId,
        this.ReqListProdBranchMbrObj.ProductBranchMbrs[i].RowVersion = "";
    }

    this.http.post(URLConstant.AddProductOfficeMbrBatch, this.ReqListProdBranchMbrObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.PassingObj.isOn = true;
        this.componentIsOn.emit(this.PassingObj);
      }
    );
  }
}
