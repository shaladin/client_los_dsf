import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forkJoin } from 'rxjs';
import { MouCustFctrObj } from 'app/shared/model/MouCustFctrObj.Model';

@Component({
  selector: 'app-mou-detail-factoring',
  templateUrl: './mou-detail-factoring.component.html',
  styleUrls: ['./mou-detail-factoring.component.scss']
})
export class MouDetailFactoringComponent implements OnInit {
  @Input() MouCustId: number;
  @Output() ResponseMouCustFactoring: EventEmitter<any> = new EventEmitter();
  recourseTypeList: any;
  wopList: any;
  paidByList: any;
  instTypeList: any;
  singleInstCalcMthdList: any;
  payFreqList: any;
  instSchmList: any;
  private mode: string = "add";

  MouDetailFactoringForm = this.fb.group({
    MouCustFctrId: [0, [Validators.required]],
    MouCustId: [0, [Validators.required]],
    MrRecourseTypeCode: [''],
    IsDisclosed: [false],
    WopCode: [''],
    MrPaidByCode: [''],
    MrInstTypeCode: [''],
    SingleInstCalcMthd: [''],
    TopDays: [''],
    TenorFrom: [''],
    TenorTo: [''],
    PayFreqCode: [''],
    MrInstSchmCode: [''],
    InterestRatePrcnt: [''],
    RetentionPrcnt: [''],
    IsListedCust: [false],
    Notes: [''],
    RowVersion: ['']
  });
  
  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder
  ) { 
    var rmRecourseType = new RefMasterObj();
    rmRecourseType.RefMasterTypeCode = "RECOURSE_TYPE";
    let getRecourseType = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmRecourseType);
    var rmWop = new RefMasterObj();
    rmWop.RefMasterTypeCode = "WOP";
    let getWop = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmWop);
    var rmPaidBy = new RefMasterObj();
    rmPaidBy.RefMasterTypeCode = "PAID_BY";
    let getPaidBy = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmPaidBy);
    var rmInstType = new RefMasterObj();
    rmInstType.RefMasterTypeCode = "INST_TYPE";
    let getInstType = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmInstType);
    var rmSingleInstCalcMethod = new RefMasterObj();
    rmSingleInstCalcMethod.RefMasterTypeCode = "SINGLE_INST_CALC_METHOD";
    let getSingleInstCalcMethod = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmSingleInstCalcMethod);
    var rmPayFreq = new RefMasterObj();
    rmPayFreq.RefMasterTypeCode = "PAY_FREQ";
    let getPayFreq = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmPayFreq);
    var rmInstSchm = new RefMasterObj();
    rmInstSchm.RefMasterTypeCode = "INST_SCHM";
    let getInstSchm = this.httpClient.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, rmInstSchm);
    forkJoin([getRecourseType, getWop, getPaidBy, getInstType, getSingleInstCalcMethod, getPayFreq, getInstSchm]).subscribe(
      (response) => {
        this.recourseTypeList = response[0];
        this.wopList = response[1];
        this.paidByList = response[2];
        this.instTypeList = response[3];
        this.singleInstCalcMthdList = response[4];
        this.payFreqList = response[5];
        this.instSchmList = response[6];
        this.MouDetailFactoringForm.patchValue({
          MrRecourseTypeCode: this.recourseTypeList.ReturnObject[0].Key,
          WopCode: this.wopList.ReturnObject[0].Key,
          MrPaidByCode: this.paidByList.ReturnObject[0].Key,
          MrInstTypeCode: this.instTypeList.ReturnObject[0].Key,
          SingleInstCalcMthd: this.singleInstCalcMthdList.ReturnObject[0].Key,
          PayFreqCode: this.payFreqList.ReturnObject[0].Key,
          MrInstSchmCode: this.instSchmList.ReturnObject[0].Key
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    var mouCustFctr = new MouCustFctrObj();
    mouCustFctr.MouCustId = this.MouCustId;
    this.httpClient.post(AdInsConstant.GetMouCustFctrByMouCustId, mouCustFctr).subscribe(
      (response: MouCustFctrObj) => {
        if(response.MouCustFctrId != 0){
          this.mode = "edit";
          this.MouDetailFactoringForm.patchValue({
            ...response
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  Save(enjiForm){
    var formData = this.MouDetailFactoringForm.value;
    var url;

    if(this.mode == "add"){
      url = AdInsConstant.AddMouCustFctr;
    }
    else{
      url = AdInsConstant.EditMouCustFctr;
    }

    this.httpClient.post(url, formData).subscribe(
      (response) => {
        this.ResponseMouCustFactoring.emit(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
