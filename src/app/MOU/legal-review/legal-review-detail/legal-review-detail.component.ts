import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-legal-review-detail',
  templateUrl: './legal-review-detail.component.html',
  styleUrls: ['./legal-review-detail.component.scss']
})
export class LegalReviewDetailComponent implements OnInit {
  viewObj: string;
  MouCustId: any;
  GetListActiveRefMasterUrl  = AdInsConstant.GetListActiveRefMaster;
  responseObj: any;
  responseRefMasterObj: any;
  GetMouCustTcForMouLglByCustMouIdUrl = AdInsConstant.GetMouCustTcForMouLglByCustMouId;
  responseMouObj: any;
  items: any;
  LegalForm = this.fb.group(
    {
      items : this.fb.array([this.fb.group({
        ReviewComponentName : ['']
      })])
    }
  );
  GetRefMasterByRefMasterTypeCodeUrl = AdInsConstant.GetRefMasterByRefMasterTypeCode;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewCustomerDocPrinting.json";
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
      }
    });
    // var refObj = { "RefMasterTypeCode": "LGL_REVIEW" };
    // this.http.post(this.GetListActiveRefMasterUrl, refObj).subscribe(
    //   response => {
    //     this.responseRefMasterObj = response['ReturnObject'];
    //   },
    //   error => {
    //     this.router.navigateByUrl('Error');
    //   }
    // );
    var mouObj = { "MouCustId": this.MouCustId };
    this.http.post(this.GetMouCustTcForMouLglByCustMouIdUrl, mouObj).subscribe(
      response => {
        this.responseMouObj = response['ReturnObject'];
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
    console.log('few');
    var refLglReviewObj = { "RefMasterTypeCode": "LGL_REVIEW" };
    this.items = this.LegalForm.get('items') as FormArray; //sbg pointing data 
    this.http.post(this.GetListActiveRefMasterUrl, refLglReviewObj).subscribe(
      (response) => {
        var lengthDataReturnObj = response["ReturnObject"].length;
          for (var i = 0; i < lengthDataReturnObj; i++) {
            var eachDataDetail = this.fb.group({
              ReviewComponentName: response["ReturnObject"][i].Descr,
            }) as FormGroup;
            this.items.push(eachDataDetail);
          }
      },
      (error) => {
        console.log(error);
      }
    );
    
  }

}
