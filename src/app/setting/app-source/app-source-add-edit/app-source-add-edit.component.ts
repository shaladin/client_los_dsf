import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { RefAppSrcObj } from 'app/shared/model/RefAppSrcObj.Model';
import { formatDate } from '@angular/common';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-app-source-add-edit',
  templateUrl: './app-source-add-edit.component.html'
})
export class AppSourceAddEditComponent implements OnInit {

  mode: any;
  listAppSrcType: any;
  rasObj: RefAppSrcObj = new RefAppSrcObj();
  RefAppSrcId: number;
  resultData: any;

  AppSourceForm = this.fb.group({
    AppSrcCode: ['', [Validators.required, Validators.maxLength(50)]],
    AppSrcName: ['', [Validators.required, Validators.maxLength(100)]],
    MrAppSrcTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    Descr: ['', Validators.maxLength(50)],
    PeriodFrom:['',[Validators.required]],
    PeriodTo:['',[Validators.required]],
    MaxApvDt:['',[Validators.required]],
    IsActive:[true]
  });


  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 
    this.route.queryParams.subscribe(params => {
      if (params["mode"] != null) {
        this.mode = params["mode"];
      }
      if (params["RefAppSrcId"] != null) {
        this.RefAppSrcId = params["RefAppSrcId"];
      }
    });
  }

  ngOnInit() {
    var refMasterCategoryObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAppSrcType
    }
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterCategoryObj).subscribe(
      (response) => {
        this.listAppSrcType = response[CommonConstant.ReturnObj];
        if (this.listAppSrcType.length > 0) {
          this.AppSourceForm.patchValue({
            MrAppSrcTypeCode: this.listAppSrcType[0].Key 
          });
        }
      }
    );

    if (this.mode == "Edit") {
      this.AppSourceForm.controls["AppSrcCode"].disable();
      this.rasObj = new RefAppSrcObj();
      this.rasObj.RefAppSrcId = this.RefAppSrcId;
      this.http.post(URLConstant.GetRefAppSrcByRefAppSrcId, { Id: this.RefAppSrcId }).subscribe(
        response => {
          this.resultData = response;
          this.AppSourceForm.patchValue({
            AppSrcCode: this.resultData.AppSrcCode,
            AppSrcName: this.resultData.AppSrcName,
            MrAppSrcTypeCode: this.resultData.MrAppSrcTypeCode,
            Descr: this.resultData.Descr,
            PeriodFrom: formatDate(this.resultData.PeriodFrom, 'yyyy-MM-dd', 'en-US'),
            PeriodTo: formatDate(this.resultData.PeriodTo, 'yyyy-MM-dd', 'en-US'),
            MaxApvDt: formatDate(this.resultData.MaxApvDt, 'yyyy-MM-dd', 'en-US'),
            IsActive: this.resultData.IsActive
          });

        }
      );
    }
  }

  SaveForm() 
  {
    if (this.mode == "Add") {
      this.rasObj = new RefAppSrcObj();
      this.rasObj.AppSrcCode = this.AppSourceForm.controls["AppSrcCode"].value;
      this.rasObj.AppSrcName = this.AppSourceForm.controls["AppSrcName"].value;
      this.rasObj.MrAppSrcTypeCode = this.AppSourceForm.controls["MrAppSrcTypeCode"].value;
      this.rasObj.Descr = this.AppSourceForm.controls["Descr"].value;
      this.rasObj.PeriodFrom = this.AppSourceForm.controls["PeriodFrom"].value;
      this.rasObj.PeriodTo = this.AppSourceForm.controls["PeriodTo"].value;
      this.rasObj.MaxApvDt = this.AppSourceForm.controls["MaxApvDt"].value;
      this.rasObj.IsActive = this.AppSourceForm.controls["IsActive"].value;
      this.http.post(URLConstant.AddRefAppSrc, this.rasObj).subscribe(
        response => {
          this.toastr.successMessage(response["Message"]);
          //this.router.navigate(["/Setting/AppSource/Paging"], { queryParams: { "RefAppSrcId": this.rasObj.RefAppSrcId } });
          AdInsHelper.RedirectUrl(this.router,["/Setting/AppSource/Paging"],{ "RefAppSrcId": this.rasObj.RefAppSrcId});
        }
      );
    } else {
      this.rasObj = this.resultData;
      this.rasObj.AppSrcName = this.AppSourceForm.controls["AppSrcName"].value;
      this.rasObj.MrAppSrcTypeCode = this.AppSourceForm.controls["MrAppSrcTypeCode"].value;
      this.rasObj.Descr = this.AppSourceForm.controls["Descr"].value;
      this.rasObj.PeriodFrom = this.AppSourceForm.controls["PeriodFrom"].value;
      this.rasObj.PeriodTo = this.AppSourceForm.controls["PeriodTo"].value;
      this.rasObj.MaxApvDt = this.AppSourceForm.controls["MaxApvDt"].value;
      this.rasObj.IsActive = this.AppSourceForm.controls["IsActive"].value;
      this.http.post(URLConstant.EditRefAppSrc, this.rasObj).subscribe(
        response => {
          this.toastr.successMessage(response["Message"]);
          //this.router.navigate(["/Setting/AppSource/Paging"], { queryParams: { "RefAppSrcId": this.rasObj.RefAppSrcId } });
          AdInsHelper.RedirectUrl(this.router,["/Setting/AppSource/Paging"],{ "RefAppSrcId": this.rasObj.RefAppSrcId});
        }
      );
    }
  }

}
