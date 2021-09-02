import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormArray, FormGroup, AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DatePipe, Location} from "@angular/common";
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { UcTempPagingObj } from "app/shared/model/TempPaging/UcTempPagingObj.model";
import { URLConstant } from 'app/shared/constant/URLConstant';
import { HttpClient } from '@angular/common/http';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { WhereValueObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { RdlcReportObjv2, ReportParamObjv2 } from 'app/shared/model/Report/RdlcReportObjv2.model';
import { AdminProcessXService, ReqAppAssetObjX } from '../../../admin-process-x.service';

@Component({
  selector: 'app-insurance-order-detail-x',
  templateUrl: './insurance-order-detail-x.component.html'
})
export class InsuranceOrderDetailXComponent implements OnInit {

  items: FormArray;
  agrmntId: number;
  bizTemplateCode: string;
  PrintedDdl: Array<KeyValueObj> =[
    {
      Key: "No",
      Value: "0"
    },
    {
      Key: "Yes",
      Value: "1"
    },
  ];

  InsuranceOrderForm = this.fb.group({
    AgrmntNo: [""],
    CustName: [""],
    StartDt: [""],
    Printed: [""],
  });
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  tempPagingObjPrinted: UcTempPagingObj = new UcTempPagingObj();
  Printed:boolean = false;
  minDt: Date;
  minDtString: string;
  businessDt: Date;
  listSelectedId: Array<number> = new Array<number>();
  IsEnd: boolean = false;
  RdlcReport: RdlcReportObjv2 = new RdlcReportObjv2();
  SppaNo: string;
  agrmntNo: string;
  
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private toastr: NGXToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cookieService: CookieService,
    private adminProcessSvcX: AdminProcessXService
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params['AgrmntId'] != null) {
        this.agrmntId = params['AgrmntId'];
      }
      if (params['BizTemplateCode'] != null) {
        this.bizTemplateCode = params['BizTemplateCode'];
      }
    });
  }

  ngOnInit() {
    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.items = this.InsuranceOrderForm.get("items") as FormArray;
    this.InsuranceOrderForm.patchValue({
      Printed: this.PrintedDdl[0].Value,
    });
    this.getData();
    this.bindUcAddToTempData();
    this.tempPagingObj.isReady = true;

  }

  getData() {
    this.http.post(URLConstant.GetAgrmntByAgrmntId, {Id: this.agrmntId}).subscribe(
      (response: AgrmntObj) => {
        this.InsuranceOrderForm.patchValue({
          AgrmntNo: response["AgrmntNo"],
          CustName: response["CustName"]
        })
      }
    );
    
    var datePipe = new DatePipe("en-US");
    this.http.post(URLConstantX.GetMinDeliveryDtDeliveryOrderHByAgrmntId, {Id: this.agrmntId}).subscribe(
      (response: any) => {
        this.InsuranceOrderForm.patchValue({
          StartDt: datePipe.transform(response[CommonConstant.Result], "yyyy-MM-dd")
        })
        this.minDt = response[CommonConstant.Result];
        this.minDtString = response[CommonConstant.Result];
      }
    );

  }

  CheckPrinted(){
    var datePipe = new DatePipe("en-US");
    
    if(this.InsuranceOrderForm.controls.Printed.value == 1){
      this.InsuranceOrderForm.controls.StartDt.reset();
      this.InsuranceOrderForm.controls.StartDt.disable();
      this.Printed = true;
    }
    else{
      this.InsuranceOrderForm.controls.StartDt.enable();
      this.InsuranceOrderForm.patchValue({
        StartDt: datePipe.transform(this.minDtString, "yyyy-MM-dd")
      })
      this.Printed = false;
    }
    this.bindUcAddToTempData();
  }

  bindUcAddToTempData() {
    if(this.Printed == false){
      this.tempPagingObj.urlJson = "./assets/impl/ucpaging/ucTempPaging/InsuranceOrderTempPagingX.json";
      this.tempPagingObj.pagingJson = "./assets/impl/ucpaging/ucTempPaging/InsuranceOrderTempPagingX.json";

      this.tempPagingObj.isReady = true;
      this.tempPagingObj.isSearched = true;
      this.tempPagingObj.delay = 1000;
      this.tempPagingObj.isHideSearch = true;

      let whereValueObj = new WhereValueObj();
      whereValueObj.property = "AgrmntId";
      whereValueObj.value = this.agrmntId;
      this.tempPagingObj.whereValue.push(whereValueObj);
    }
    else{
      this.tempPagingObjPrinted.urlJson = "./assets/impl/ucpaging/ucTempPaging/InsuranceOrderTempPagingPrintedX.json";
      this.tempPagingObjPrinted.pagingJson = "./assets/impl/ucpaging/ucTempPaging/InsuranceOrderTempPagingPrintedX.json";

      this.tempPagingObjPrinted.isReady = true;
      this.tempPagingObjPrinted.isSearched = true;
      this.tempPagingObjPrinted.delay = 1000;
      this.tempPagingObjPrinted.isHideSearch = true;

      let whereValueObj = new WhereValueObj();
      whereValueObj.property = "AgrmntId";
      whereValueObj.value = this.agrmntId;
      this.tempPagingObjPrinted.whereValue.push(whereValueObj);
    }
    
    
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListId;
    this.IsEnd = false;
    if(this.listSelectedId.length == 0){
    }else{
      let obj: ReqAppAssetObjX = {
        AgrmntId: this.agrmntId,
        ListAppAssetId: this.listSelectedId
      };
    }
  }

  async Save(enjiForm){

    this.markFormTouched(this.InsuranceOrderForm);
    if (this.listSelectedId.length == 0) {
      this.toastr.typeErrorCustom("Please select at least one Asset");
      return;
    }
    if (this.InsuranceOrderForm.valid) {
      let Obj = {
        SppaDt: this.businessDt,
        ListAppAssetId: this.listSelectedId,
        StartDt: this.InsuranceOrderForm.controls.StartDt.value,
        IsEnd: this.IsEnd,
        MrInsPolicySrc: "NEW"
      }
      if(this.Printed == false){
        this.adminProcessSvcX.SubmitInsuranceOrder(Obj).subscribe((response : any) => {
          this.SppaNo = response[CommonConstant.Result];
          this.printCustomerCard();
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_INSURANCE_ORDER_PAGING],
             { BizTemplateCode: this.bizTemplateCode });
        });
      }
      else{
        await this.getSppaNo();
        this.printCustomerCard();
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADM_PRCS_INSURANCE_ORDER_PAGING],
          { BizTemplateCode: this.bizTemplateCode });
      }
    }
  }

  async getSppaNo(){
    let Obj = {
      ListAppAssetId: this.listSelectedId,
    }
    await this.http.post(URLConstantX.GetSppaNoByAppAssetId, Obj).toPromise().then(
      (response:any) => {
        this.SppaNo = response[CommonConstant.Result];
      }
    );
  }

  markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  }

  cancelHandler() {
    this.toastr.warningMessage("Cancel Insurance Order");
    this.router.navigate([NavigationConstant.NAP_ADM_PRCS_INSURANCE_ORDER_PAGING],
      { queryParams: {BizTemplateCode: this.bizTemplateCode} });
  }

  OpenAgrmntView(agrmntId) {
    AdInsHelper.OpenAgrmntViewByAgrmntId(agrmntId);
  }

  printCustomerCard(){
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.RdlcReport.RequestingUsername = currentUserContext.UserName;
    this.RdlcReport.ReportInfo.ReportName = "Insert Pertanggungan By Agrmnt";
    this.RdlcReport.ReportInfo.ReportTemplateCode = "INSPERTANGGUNGANBYAGRMNT";
    this.RdlcReport.ReportInfo.ReportParameters = new Array<ReportParamObjv2>();
    this.RdlcReport.ReportInfo.ExportFormat = 0;
  
    let AgrmntIdReportParamObj: ReportParamObjv2 = new ReportParamObjv2();
    AgrmntIdReportParamObj.paramKey = "agrmntNo";
    AgrmntIdReportParamObj.paramValue = this.InsuranceOrderForm.controls.AgrmntNo.value;
    AgrmntIdReportParamObj.paramAssignment = 1;
    
    this.RdlcReport.ReportInfo.ReportParameters.push(AgrmntIdReportParamObj);

    let SppaNoReportParamObj: ReportParamObjv2 = new ReportParamObjv2();
    SppaNoReportParamObj.paramKey = "sppaNo";
    SppaNoReportParamObj.paramValue = this.SppaNo;
    SppaNoReportParamObj.paramAssignment = 1;
    
    this.RdlcReport.ReportInfo.ReportParameters.push(SppaNoReportParamObj);

    this.RdlcReport.ReportInfo.SubReports = [
      {
      reportName: "Insurance Pertanggungan By Agrmnt Accessory",
      reportTemplateCode: "INSPERTANGGUNGANBYAGRMNT_DETAILACC",
      reportPath: "",
      exportFormat: 0,
      reportParameters: [AgrmntIdReportParamObj,SppaNoReportParamObj],
      subReports: []
      },
      {
      reportName: "Insurance Pertanggungan By Agrmnt Detail Insurance",
      reportTemplateCode: "INSPERTANGGUNGANBYAGRMNT_DETAILINS",
      reportPath: "",
      exportFormat: 0,
      reportParameters: [AgrmntIdReportParamObj,SppaNoReportParamObj],
      subReports: []
      },
      {
      reportName: "Insurance Pertanggungan By Agrmnt Level Asset",
      reportTemplateCode: "INSPERTANGGUNGANBYAGRMNT_LVLASSET",
      reportPath: "",
      exportFormat: 0,
      reportParameters: [AgrmntIdReportParamObj,SppaNoReportParamObj],
      subReports: []
      }
    ]
  
    this.http.post(URLConstant.GenerateReportR3, this.RdlcReport).subscribe(
      (response) => {
        let linkSource: string = 'data:application/pdf;base64,' + response["ReportFile"];
        let fileName: string = this.agrmntId + ".pdf";
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
  
        if (response["ReportFile"] != undefined) {
          // downloadLink.click();
          // this.toastr.successMessage(response['message']);
  
          var iframe = "<iframe width='100%' height='100%' src='" + linkSource + "'></iframe>";
          var x = window.open();
          x.document.open();
          x.document.write(iframe);
          x.document.close();
        } else {
          this.toastr.warningMessage(response['message']);
        }
      });
  }

}
