import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { environment } from '../../../../environments/environment';
import { PhoneVerifObj } from '../../../shared/model/PhoneVerifObj.model';



@Component({
  selector: "phone-verif-subject",
  templateUrl: "./phone-verif-subject.component.html",
  providers: [NGXToastrService]
})
export class PhnVerifSubjectComponent implements OnInit {

  getPhoneVerifSubjUrl: any;
  addEditVerfResultUrl: any;

  PhnSubjectForm = this.fb.group({
    ReservedFundObjs: this.fb.array([])
  });
  viewObj: any;

  appId: any;
  appObj = {
    AppId: 0,
  };

  phoneVerifObj: any;


  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {

    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    });
  }

  initUrl() {
    this.getPhoneVerifSubjUrl = AdInsConstant.GetAppFinDataByAppId;
    this.addEditVerfResultUrl = AdInsConstant.AddEditAppReservedFund;

  }

  ngOnInit() {
    this.initUrl();
    this.appObj.AppId = this.appId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    this.GetPhnVerfSubjData(this.appObj);

  }

  //SaveForm() {
  //  if (this.isCalculated == false) {
  //    this.toastr.errorMessage("Please Calculate First");
  //  }
  //  else {
  //    this.calculating()
  //    if (this.maxAllocatedAmt < this.totalRsvFundAmt) {
  //      this.toastr.errorMessage("Total Reserved Fund Amount Must be Less Than Remaining Allocated Amount");
  //    }
  //    else {
  //      this.setAppReservedFundData();
  //      this.http.post(this.addEditVerfResultUrl, this.allAppReservedFundObj).subscribe(
  //        (response) => {
  //          console.log(response);
  //          this.toastr.successMessage(response["message"]);
  //        },
  //        (error) => {
  //          console.log(error);
  //        }
  //      );
  //    }
  //  }
  //}



  GetPhnVerfSubjData(appObj) {
    this.http.post(this.getPhoneVerifSubjUrl, this.appObj).subscribe(
      (response) => {
        console.log(response);
        this.phoneVerifObj = response;
      }
    );
  }





  //test() {
  //  this.setAppReservedFundData();
  //  console.log(this.PhnSubjectForm);
  //  console.log(this.allAppReservedFundObj);
  //}
}
