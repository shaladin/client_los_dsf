import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ProdOfferingObj } from 'app/shared/model/Request/Product/ProdOfferingObj.model';

@Component({
  selector: 'app-offering-search-office',
  templateUrl: './offering-search-office.component.html'
})
export class OfferingSearchOfficeComponent implements OnInit {
  listSelectedId: Array<number> = new Array<number>();
  arrListId: Array<number> = new Array<number>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  @Output() componentIsOn: EventEmitter<any> = new EventEmitter();
  @Input() ListOfficeMemberObjInput: any;
  @Input() ProdHId: any;
  obj: ProdOfferingObj = new ProdOfferingObj();

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService
  ) {
  }

  ngOnInit() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/product/productOfficeMbrTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.tempPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/product/productOfficeMbrTempPaging.json";
    this.tempPagingObj.ddlEnvironments = [
      {
        name: "ROA.AREA_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.obj.ProdHId = this.ProdHId;
    this.http.post(URLConstant.GetListProdBranchOfficeMbrByProdHId, {Id : this.ProdHId}).subscribe(
      response => {
        for (let i = 0; i < response["ReturnObject"].length; i++) {
          this.arrListId.push(response["ReturnObject"][i]["OfficeCode"]);
        }
        var addCrit = new CriteriaObj();
        addCrit.propName = "RO.OFFICE_CODE";
        addCrit.restriction = AdInsConstant.RestrictionIn;
        addCrit.listValue = this.arrListId;
        this.tempPagingObj.addCritInput.push(addCrit);

      }
    );

    if (this.ListOfficeMemberObjInput["result"].length != 0) {
      var addCrit = new CriteriaObj();
      addCrit.propName = "RO.OFFICE_CODE";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.ListOfficeMemberObjInput["result"];
      this.tempPagingObj.addCritInput.push(addCrit);
    }
    this.tempPagingObj.isReady = true;
  }

  GoBack() {
    var obj = {
      isOn: true,
      result: []
    }
    this.componentIsOn.emit(obj);
  }

  getListTemp(ev) {
    this.listSelectedId = ev;
  }

  SaveForm() {
    if (this.listSelectedId.length == 0) {
      this.toastr.errorMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }
  
    var obj = {
      ProdOfferingBranchMbrs: this.listSelectedId["TempListObj"],
      RowVersion: ""
    };

    for (var i = 0; i < this.listSelectedId["TempListObj"].length; i++) {
      obj.ProdOfferingBranchMbrs[i].ProdOfferingHId = this.ListOfficeMemberObjInput["ProdOfferingHId"],
        obj.ProdOfferingBranchMbrs[i].RowVersion = "";
    }

    this.http.post(URLConstant.AddProdOfferingOfficeMbrBatch, obj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        var obj = {
          isOn: true,
          result: []
        }
        this.componentIsOn.emit(obj);
      }
    );
  }
}
