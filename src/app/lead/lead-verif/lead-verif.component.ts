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
  pageNow: any;
  totalData: any;
  pageSize: any = 10;
  apiUrl: any;
  orderByKey: any = null;
  orderByValue = true;
  deleteUrl: any;
  inputObj: any;
  pageType: any = 'add';
  IsActive: any;
  leadVerfObj: any;
  exportData: any;
  arrLeadVerf: any = new Array();
  responseResultData: any;
  listSelectedId: Array<any> = [];
  listDeletedId: Array<any> = [];
  tempListId: Array<any> = [];
  tempData: Array<any> = [];
  arrAddCrit = new Array<CriteriaObj>();
  arrCrit: any;
  checkboxAll: any = false;
  viewObj: string;
  AddRangeLeadVerfUrl = AdInsConstant.AddRangeLeadVerf;
  verifyStatus: any;
  ClaimListTaskUrl = AdInsConstant.ClaimListTask;
  leadUrl: any;
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private adInsService: AdInsService) { }

  ngOnInit() {
    console.log('disini');
    this.arrCrit = new Array();
    this.inputObj = new InputSearchObj();
    this.inputObj._url = './assets/search/searchLeadVerf.json';
    this.inputObj.enviromentUrl = environment.losUrl;
    this.inputObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputObj.addCritInput = new Array();
    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.losUrl + AdInsConstant.GetPagingObjectBySQL;

    var GetListLeadVerfUrl = AdInsConstant.GetListLeadVerf;
    var obj = {};
    var arr = [0];
    var temp;
    this.http.post(GetListLeadVerfUrl, obj).subscribe(
      response => {
        temp = response['ReturnObject'];
        for (var i = 0; i < temp.length; i++) {
          arr.push(temp[i]['LeadId']);
        }

        const addCritAssetMasterId = new CriteriaObj();
        addCritAssetMasterId.DataType = 'numeric';
        addCritAssetMasterId.propName = 'L.LEAD_ID';
        addCritAssetMasterId.restriction = AdInsConstant.RestrictionNotIn;
        addCritAssetMasterId.listValue = arr;
        this.arrCrit.push(addCritAssetMasterId);
        this.inputObj.addCritInput.push(addCritAssetMasterId);
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
    this.leadUrl = '/Lead/View?LeadId=';
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
  Checked(LeadId: any, isChecked: any): void {
    if (isChecked) {
      this.listSelectedId.push(LeadId);
    } else {
      const index = this.listSelectedId.indexOf(LeadId);
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

  formValidate(form: any, verifyStatus) {
    this.adInsService.scrollIfFormHasErrors(form);
    this.verifyStatus = verifyStatus; 
  }
  getListWfTaskListId(){
    var tempArr = new Array();
    for (let index = 0; index < this.tempData.length; index++) {
      tempArr.push(this.tempData[index]['WfTaskListId']);
    }
    return tempArr;
  }
  SaveLeadVerf(leadVerfForm: any) {
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
      }
      for (var i = 0; i < this.listSelectedId.length; i++) {
        var object = this.resultData.find(x => x.LeadId == this.listSelectedId[i]);
        this.tempData.push(object);
      }
      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }
      var addCrit = new CriteriaObj();
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

  deleteFromTemp(LeadId: any) {
    if (confirm('Are you sure to delete this record?')) {
      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }
      var index = this.tempListId.indexOf(LeadId);
      if (index > -1) {
        this.tempListId.splice(index, 1);
        this.tempData.splice(index, 1);
      }
      var addCrit = new CriteriaObj();
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
