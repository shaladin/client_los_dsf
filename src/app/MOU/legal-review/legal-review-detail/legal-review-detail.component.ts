import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MouCustLglReviewObj } from 'app/shared/model/MouCustLglReviewObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-legal-review-detail',
  templateUrl: './legal-review-detail.component.html',
  styleUrls: ['./legal-review-detail.component.scss'],
  providers: [NGXToastrService]
})
export class LegalReviewDetailComponent implements OnInit {
  viewObj: string;
  MouCustId: any;
  GetListActiveRefMasterUrl = AdInsConstant.GetListActiveRefMaster;
  AddRangeMouCustLglReview = AdInsConstant.AddRangeMouCustLglReview;
  responseObj: any;
  responseRefMasterObj: any;
  GetMouCustTcForMouLglByCustMouIdUrl = AdInsConstant.GetMouCustTcForMouLglByCustMouId;
  responseMouObj: any;
  items: any;
  termConditions : any;
  LegalForm = this.fb.group(
    {
      items: this.fb.array([]),
      termConditions : this.fb.array([])
    }
  );
  GetRefMasterByRefMasterTypeCodeUrl = AdInsConstant.GetRefMasterByRefMasterTypeCode;
  EditListMouCustTc = AdInsConstant.EditListMouCustTc;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: NGXToastrService
  ) { }

  ngOnInit() {
    this.items = this.LegalForm.get('items') as FormArray;
    this.termConditions = this.LegalForm.get('termConditions') as FormArray;
    this.viewObj = "./assets/ucviewgeneric/viewCustomerDocPrinting.json";
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
      }
    });
    var mouObj = { "MouCustId": this.MouCustId };
    this.http.post(this.GetMouCustTcForMouLglByCustMouIdUrl, mouObj).subscribe(
      response => {
        this.responseMouObj = response['ReturnObject'];
        for(let i=0;i<this.responseMouObj.length;i++){
          var tempChecked = this.fb.group({
            IsChecked : new FormControl({value:this.responseMouObj[i]['IsChecked'], disabled:this.responseMouObj[i]['IsChecked'] }),
            IsMandatory : new FormControl({value:this.responseMouObj[i]['IsMandatory'], disabled:this.responseMouObj[i]['IsMandatory'] }),
            DocumentName : [this.responseMouObj[i]['DocumentName']],
            ExpiredDt : [this.responseMouObj[i]['ExpiredDt']],
            PromisedDt : [this.responseMouObj[i]['PromisedDt']],
            Notes : [this.responseMouObj[i]['Notes']],
            TcCode  : [this.responseMouObj[i]['TcCode']],
            PriorTo  : [this.responseMouObj[i]['PriorTo']],
            CheckedDt : [this.responseMouObj[i]['CheckedDt']]
          })as FormGroup;
          this.termConditions.push(tempChecked);
        }
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
    console.log('few');
    var refLglReviewObj = { "RefMasterTypeCode": "LGL_REVIEW" };
    this.http.post(this.GetListActiveRefMasterUrl, refLglReviewObj).subscribe(
      (response) => {
        var lengthDataReturnObj = response["ReturnObject"].length;
        this.responseRefMasterObj = response["ReturnObject"];
        for (var i = 0; i < lengthDataReturnObj; i++) {
          var eachDataDetail = this.fb.group({
            ReviewComponentName: [response["ReturnObject"][i].Descr],
            ReviewComponentValue: [response["ReturnObject"][i].MasterCode],
            values: []
          }) as FormGroup;
          this.items.push(eachDataDetail);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  SaveData(formObj: any) {
    console.log(formObj);
    var mouObj = new MouCustLglReviewObj();
    for (let index = 0; index < this.responseRefMasterObj.length; index++) {
      var tempMouObj = {
        MouCustId: this.MouCustId,
        MrLglReviewCode: formObj.value.items[index].ReviewComponentValue,
        LglReviewResult: formObj.value.items[index].values
      }
      mouObj.MouCustLglReviewObjs.push(tempMouObj);
    }
    this.http.post(this.AddRangeMouCustLglReview, mouObj).subscribe(
      response => {
        console.log('success');
        // this.toastr.successMessage(response['message']);
        // this.router.navigate(["/Mou/CustomerLegalReview"], { queryParams: { "MouCustId": this.MouCustId } });
      },
      error => {
        console.log(error);
      }
    );
    
    var tempMouTc = new Array();
    for(var i=0;i<this.responseMouObj.length;i++){
      var tempIsChecked, tempIsMandatory;
      if(formObj.value.termConditions[i].IsChecked == true || formObj.value.termConditions[i].IsChecked == null){
        tempIsChecked = true;
      }
      else if(formObj.value.termConditions[i].IsChecked == false){
        tempIsChecked = false;
      }

      if(formObj.value.termConditions[i].IsMandatory == true || formObj.value.termConditions[i].IsMandatory == null){
        tempIsMandatory = true;
      }
      else if(formObj.value.termConditions[i].IsMandatory == false){
        tempIsMandatory = false;
      }
      
      var tempChecked = {
        IsChecked : tempIsChecked,
        IsMandatory : tempIsMandatory,
        DocumentName : this.responseMouObj[i]['DocumentName'],
        ExpiredDt : this.responseMouObj[i]['ExpiredDt'],
        PromisedDt : this.responseMouObj[i]['PromisedDt'],
        Notes : this.responseMouObj[i]['Notes'],
        TcCode : this.responseMouObj[i]['TcCode'],
        PriorTo : this.responseMouObj[i]['PriorTo'],
        CheckedDt : this.responseMouObj[i]['CheckedDt'],
        MouCustId : this.MouCustId
      };
      tempMouTc.push(tempChecked);
    }
    var mouTcObjs = {
      "MouCustTcObjs" : tempMouTc
    }
    this.http.post(this.EditListMouCustTc, mouTcObjs).subscribe(
      response => {
        console.log('success');
        this.toastr.successMessage(response['message']);
        this.router.navigate(["/Mou/CustomerLegalReview"], { queryParams: { "MouCustId": this.MouCustId } });
      },
      error => {
        console.log(error);
      }
    );
  }
}
