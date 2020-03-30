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
  styleUrls: ['./legal-review-detail.component.scss']
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
  statusCheckeds : any;
  statusMandatories : any;
  LegalForm = this.fb.group(
    {
      items: this.fb.array([]),
      statusCheckeds : this.fb.array([]),
      statusMandatories : this.fb.array([])
    }
  );
  GetRefMasterByRefMasterTypeCodeUrl = AdInsConstant.GetRefMasterByRefMasterTypeCode;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    // private toastr: NGXToastrService
  ) { }

  ngOnInit() {
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
            values : [this.responseMouObj[i]['IsChecked']]
          });
          var tempMandatory = this.fb.group({
            values : [this.responseMouObj[i]['IsMandatory']]
          });
          this.statusCheckeds.push(tempChecked);
          this.statusMandatories.push(tempMandatory);
        }
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
    console.log('few');
    var refLglReviewObj = { "RefMasterTypeCode": "LGL_REVIEW" };
    this.items = this.LegalForm.get('items') as FormArray;
    this.statusCheckeds = this.LegalForm.get('statusCheckeds') as FormArray; 
    this.statusMandatories = this.LegalForm.get('statusMandatories') as FormArray; 
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
    console.log("nih" + formObj);
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
  }
}
