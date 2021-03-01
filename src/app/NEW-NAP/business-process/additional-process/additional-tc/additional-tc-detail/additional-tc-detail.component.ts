import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-additional-tc-detail',
  templateUrl: './additional-tc-detail.component.html',
  styleUrls: []
})
export class AdditionalTcDetailComponent implements OnInit {
  AppId: number = 0;
  AppTcId: number = 0;
  Index: number;
  
  ListTc: Array<any> = new Array<any>();

  TcObj: any;

  IsSecondDetail: boolean = false;
  
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  InputLookupTcObj: InputLookupObj = new InputLookupObj();

  TcForm = this.fb.group({
    TcCode: ['', [Validators.required]],
    PriorTo: ['', [Validators.required]],
    IsMandatory: [, [Validators.required]],
    Mandatory: ['']
  });

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService,
    private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
    });
  }

  async ngOnInit() {
    this.InputLookupTcObj.urlJson = "./assets/uclookup/tc/lookup-ref-tc.json";
    this.InputLookupTcObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupTcObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupTcObj.pagingJson = "./assets/uclookup/tc/lookup-ref-tc.json";
    this.InputLookupTcObj.genericJson = "./assets/uclookup/tc/lookup-ref-tc.json";
    this.InputLookupTcObj.isRequired = true;

    await this.SetMainInfo();
    await this.SetListTc();
  }

  async SetMainInfo() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/new-nap/business-process/additional-process/view-additional-tc-main-info.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
  }

  async SetListTc() {
    var requestAppId = {
      AppId: this.AppId
    };

    await this.http.post(URLConstant.GetListTCbyAppId, requestAppId).toPromise().then(
      (response: any) => {
        this.ListTc = response["AppTcs"];
      }
    );
  }

  AddTc() {
    this.AppTcId = 0;

    this.InputLookupTcObj.jsonSelect = "";
    this.InputLookupTcObj.idSelect = "";
    this.InputLookupTcObj.nameSelect = "";

    this.TcForm.patchValue({
      TcCode: "",
      PriorTo: "APP",
      IsMandatory: true,
      Mandatory: "Yes"
    });

    this.IsSecondDetail = true;
  }

  EditTc(index: number, appTcId: number) {
    this.TcObj = this.ListTc[index];
    this.AppTcId = appTcId;
    this.Index = index;

    var Mandatory = "";
    if(this.TcObj.IsMandatory) {
      Mandatory = "Yes"
    }
    else {
      Mandatory = "No"
    }

    this.InputLookupTcObj.jsonSelect = { TcName: this.TcObj.TcName };
    this.InputLookupTcObj.idSelect = this.TcObj.TcCode;
    this.InputLookupTcObj.nameSelect = this.TcObj.TcName;

    this.TcForm.patchValue({
      TcCode: this.TcObj.TcCode,
      PriorTo: this.TcObj.PriorTo,
      IsMandatory: this.TcObj.IsMandatory,
      Mandatory: Mandatory
    });

    this.IsSecondDetail = true;
  }

  BackToPaging() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_ADD_TC_PAGING], { BizTemplateCode: CommonConstant.OPL });
  }

  SetTc(event: any) {
    this.TcForm.patchValue({
      TcCode: event.TcCode
    });
  }

  changeMandatory(isMandatory: string){
    if(isMandatory === "Yes") {
      this.TcForm.patchValue({
        IsMandatory: true
      });
    }
    else {
      this.TcForm.patchValue({
        IsMandatory: false
      });
    }
  }
  
  Cancel() {
    this.IsSecondDetail = false;
  }

  SaveForm() {
    var requestAdditionalTcObj = {
      AppId: this.AppId,
      AppTcId: this.AppTcId,
      TcCode: this.TcForm.value.TcCode,
      TcName: this.TcObj.TcName,
      PriorTo: this.TcForm.value.PriorTo,
      IsMandatory: this.TcForm.value.IsMandatory
    };

    this.http.post(URLConstant.AddEditAdditionalTc, requestAdditionalTcObj).subscribe(
      (response) => {
        this.SetListTc();

        this.toastr.successMessage("Success!");
        this.IsSecondDetail = false;
      }
    );
  }

  GetCallBack(event: any) {
    if(event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if(event.Key === "Agreement") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.ViewObj.AgrmntId);
    }
    else if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.ViewObj.ProdOfferingCode, event.ViewObj.ProdOfferingVersion);
    }
  }
}