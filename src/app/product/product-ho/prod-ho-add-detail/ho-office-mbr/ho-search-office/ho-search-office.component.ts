import { Component, OnInit, Output, Input, ViewChild, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
@Component({
  selector: 'app-ho-search-office',
  templateUrl: './ho-search-office.component.html'
})
export class HoSearchOfficeComponent implements OnInit {
  listSelectedId: Array<any> = new Array<any>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  @Output() componentIsOn: EventEmitter<any> = new EventEmitter();
  @Input() ListOfficeMemberObjInput: any;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService
  ) { }


  ngOnInit() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/productHOfficeMbrTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.tempPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/productHOfficeMbrTempPaging.json";
    this.tempPagingObj.ddlEnvironments = [
      {
        name: "ROA.AREA_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    if (this.ListOfficeMemberObjInput["result"].length != 0) {
      var addCrit = new CriteriaObj();
      addCrit.DataType = "numeric";
      addCrit.propName = "RO.REF_OFFICE_ID";
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
    if (this.listSelectedId["TempListId"].length == 0) {
      this.toastr.errorMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }

    var obj = {
      ProductBranchMbrs: this.listSelectedId["TempListObj"],
      RowVersion: ""
    };

    for (var i = 0; i < this.listSelectedId["TempListId"].length; i++) {
      obj.ProductBranchMbrs[i].ProdHId = this.ListOfficeMemberObjInput["param"],
        obj.ProductBranchMbrs[i].RowVersion = "";
    }

    this.http.post(URLConstant.AddProductOfficeMbrBatch, obj).subscribe(
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
