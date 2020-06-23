import { Component, OnInit, ViewChild } from '@angular/core';
import { UCSearchComponent } from '@adins/ucsearch';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { InputSearchObj } from 'app/shared/model/InputSearchObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsService } from 'app/shared/services/adIns.service';
import { LeadVerfObj } from 'app/shared/model/LeadVerfObj.Model';

@Component({
  selector: 'app-lead-verif',
  templateUrl: './lead-verif.component.html',
  providers: [NGXToastrService]
})

export class LeadVerifComponent implements OnInit {
  @ViewChild(UcgridfooterComponent) ucgridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;
  resultData: any;
  pageNow: number;
  totalData: number;
  pageSize: number = 10;
  apiUrl: string;
  orderByKey: string = null;
  orderByValue : boolean = true;
  inputObj: InputSearchObj;
  arrLeadVerf: Array<LeadVerfObj> = new Array();
  listSelectedId: Array<string> = [];
  tempListId: Array<string> = [];
  tempData: Array<any> = [];
  arrAddCrit = new Array<CriteriaObj>();
  arrCrit: Array<CriteriaObj>;
  checkboxAll: boolean = false;
  viewObj: string;
  AddRangeLeadVerfUrl = AdInsConstant.AddRangeLeadVerf;
  verifyStatus: string;
  leadUrl: string;
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private adInsService: AdInsService) { }

  ngOnInit() {
    this.arrCrit = new Array();
    this.inputObj = new InputSearchObj();
    this.inputObj._url = './assets/search/searchLeadVerf.json';
    this.pageNow = 1;
    this.pageSize = 10;
    this.inputObj.enviromentUrl = environment.losUrl;
    this.inputObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputObj.addCritInput = new Array();
    this.apiUrl = environment.losUrl + AdInsConstant.GetPagingObjectBySQL;

    this.inputObj.ddlEnvironments = [
      {
        name: "L.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    if (this.listSelectedId.length !== 0) {
      const addCritAssetMasterId : CriteriaObj = new CriteriaObj();
      addCritAssetMasterId.DataType = 'numeric';
      addCritAssetMasterId.propName = 'L.LEAD_ID';
      addCritAssetMasterId.restriction = AdInsConstant.RestrictionNotIn;
      addCritAssetMasterId.listValue = this.listSelectedId;
      this.arrCrit.push(addCritAssetMasterId);
      this.inputObj.addCritInput.push(addCritAssetMasterId);
    }
    this.leadUrl = environment.losR3Web + '/Lead/View?LeadId=';
  }

  searchSort(event: any) {
    if (this.resultData != null) {
      if (this.orderByKey == event.target.attributes.name.nodeValue) {
        this.orderByValue = !this.orderByValue
      } else {
        this.orderByValue = true
      }
      this.orderByKey = event.target.attributes.name.nodeValue;
      let order = {
        key: this.orderByKey,
        value: this.orderByValue
      }
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order)
    }
  }
  Checked(LeadId: string, isChecked: boolean): void {
    if (isChecked) {
      this.listSelectedId.push(LeadId);
    } else {
      const index : number = this.listSelectedId.indexOf(LeadId);
      if (index > -1) { this.listSelectedId.splice(index, 1); }
    }
  }
  searchPagination(event: number) {
    this.pageNow = event;
    let order = null;
    if (this.orderByKey != null) {
      order = {
        key: this.orderByKey,
        value: this.orderByValue
      }
    }
    this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order)
  }
  getResult(event) {
    this.resultData = event.response.Data;
    this.totalData = event.response.Count;
    this.ucgridFooter.pageNow = event.pageNow;
    this.ucgridFooter.totalData = this.totalData;
    this.ucgridFooter.resultData = this.resultData;
  }
  onSelect(event) {
    this.pageNow = event.pageNow;
    this.pageSize = event.pageSize;
    this.searchPagination(this.pageNow);
    this.totalData = event.Count;
  }

  formValidate(form: any, verifyStatus : string) {
    this.adInsService.scrollIfFormHasErrors(form);
    this.verifyStatus = verifyStatus;
  }
  getListWfTaskListId() {
    var tempArr : Array<string> = new Array();
    for (let index = 0; index < this.tempData.length; index++) {
      tempArr.push(this.tempData[index]['WfTaskListId']);
    }
    return tempArr;
  }
  SaveLeadVerf(leadVerfForm: any) {
    //var tempArr = this.getListWfTaskListId();
    for (let index = 0; index < this.tempData.length; index++) {
      var tempLeadVerfObj = new LeadVerfObj();
      tempLeadVerfObj.VerifyStat = this.verifyStatus;
      tempLeadVerfObj.LeadId = this.tempData[index].LeadId;
      tempLeadVerfObj.WfTaskListId = this.tempData[index].WfTaskListId
      this.arrLeadVerf.push(tempLeadVerfObj);
    }
    if (this.arrLeadVerf.length == 0) {
      this.toastr.typeErrorCustom('Please Add At Least One Data');
      return;
    }
    var LeadVerf = {
      LeadVerfObjs: this.arrLeadVerf
    }
    this.http.post(this.AddRangeLeadVerfUrl, LeadVerf).subscribe(
      response => {
        console.log(response);
        this.toastr.successMessage(response['message']);
      },
      error => {
        console.log(error);
      }
    );
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/Lead/Verif']);
    });
  }

  addToTemp() {
    if (this.listSelectedId.length !== 0) {
      for (var i = 0; i < this.listSelectedId.length; i++) {
        this.tempListId.push(this.listSelectedId[i]);
        var object = this.resultData.find(x => x.LeadId == this.listSelectedId[i]);
        this.tempData.push(object);
      }
      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }
      var addCrit : CriteriaObj = new CriteriaObj();
      addCrit.DataType = "numeric";
      addCrit.propName = "L.LEAD_ID";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.tempListId;
      this.arrAddCrit.push(addCrit);
      var order = null;
      if (this.orderByKey != null) {
        order = {
          key: this.orderByKey,
          value: this.orderByValue
        };
      }
      this.inputObj.addCritInput = this.arrAddCrit;
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order, this.arrAddCrit);
      this.listSelectedId = [];
    }
    else {
      this.toastr.typeErrorCustom('Please select at least one Available Lead');
    }
  }

  SelectAll(condition) {
    this.checkboxAll = condition;
    if (condition) {
      for (let i = 0; i < this.resultData.length; i++) {
        if (this.listSelectedId.indexOf(this.resultData[i].LeadId) < 0) {
          this.listSelectedId.push(this.resultData[i].LeadId);
        }
      }
    } else {
      for (let i = 0; i < this.resultData.length; i++) {
        let index = this.listSelectedId.indexOf(this.resultData[i].LeadId);
        if (index > -1) {
          this.listSelectedId.splice(index, 1);
        }
      }
    }
  }

  deleteFromTemp(LeadId: string) {
    if (confirm('Are you sure to delete this record?')) {
      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }
      var index : number = this.tempListId.indexOf(LeadId);
      if (index > -1) {
        this.tempListId.splice(index, 1);
        this.tempData.splice(index, 1);
      }
      var addCrit : CriteriaObj = new CriteriaObj();
      addCrit.DataType = "numeric";
      addCrit.propName = "L.LEAD_ID";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.tempListId;
      if (this.tempListId.length != 0) {
        this.arrAddCrit.push(addCrit);
      }
      var order = null;
      if (this.orderByKey != null) {
        order = {
          key: this.orderByKey,
          value: this.orderByValue
        };
      }
      this.inputObj.addCritInput = this.arrAddCrit;
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order, this.arrAddCrit);
    }
  }
}
