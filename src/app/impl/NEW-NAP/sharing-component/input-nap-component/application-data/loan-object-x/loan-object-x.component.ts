import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { AppLoanPurposeObj } from 'app/shared/model/app-loan-purpose.model';
import { ProdOfferingDObj } from 'app/shared/model/product/prod-offering-d-obj.model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/request/product/req-get-prod-offering-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { ExceptionConstantX } from 'app/impl/shared/constant/ExceptionConstantX';

@Component({
  selector: 'app-loan-object-x',
  templateUrl: './loan-object-x.component.html'
})
export class LoanObjectXComponent implements OnInit {
  @Input() AppId: number;
  @Input() mode: string;
  @Input() isCollateral: boolean;
  @Output() ResponseProdOfrUpToDate: EventEmitter<any>;

  modal: any;
  loanObjectInputLookupObj: InputLookupObj;
  AppLoanPurposeId: number;
  supplierInputLookupObj: InputLookupObj;
  title: string = "Add Loan Object";
  objEdit: AppLoanPurposeObj;
  AppLoanPurposeObj: AppLoanPurposeObj = new AppLoanPurposeObj();
  IsDisburseToCust: boolean;
  AppObj: AppObj;
  OfficeCode: string;
  RefProdCmptSupplSchm: ProdOfferingDObj;
  isCFNA: boolean = false;
  isProdOfrUpToDate: boolean = true;
  missingProdOfrComp: string;

  MainInfoForm = this.fb.group({
    IsDisburseToCust: [false],
    BudgetPlanAmount: ['', [Validators.required, Validators.min(1)]],
    SelfFinancing: ['', [Validators.required, Validators.min(-1)]],
    FinancingAmount: ['']
  })
  resultData: Array<AppLoanPurposeObj>;
  closeResult: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private modalService: NgbModal) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.mode = params["mode"];
    });
    if (this.mode == "edit") {
      this.route.queryParams.subscribe(params => {
        this.AppLoanPurposeId = params["AppLoanPurposeid"];
      });
    }
    this.ResponseProdOfrUpToDate = new EventEmitter();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async editLoanObject(id, content) {

    this.mode = "edit";
    this.AppLoanPurposeId = id;
    this.title = "Edit Loan Object";
    this.MainInfoForm.controls.FinancingAmount.disable();

    await this.http.post(URLConstant.GetAppLoanPurposeByAppLoanPurposeId, { Id: this.AppLoanPurposeId }).toPromise().then((response: AppLoanPurposeObj) => {
      this.objEdit = response;
      this.MainInfoForm.patchValue({
        IsDisburseToCust: response["IsDisburseToCust"],
        BudgetPlanAmount: response["BudgetPlanAmt"],
        SelfFinancing: response["SelfFinancingAmt"],
        FinancingAmount: response["FinancingAmt"],
        MrLoanPurposeCode: response["MrLoanPurposeCode"],
        SupplierCode: response["SupplCode"],
        SupplierName: response["SupplName"]
      });
      this.AppLoanPurposeObj.MrLoanPurposeCode = this.objEdit.MrLoanPurposeCode;
      this.AppLoanPurposeObj.SupplCode = this.objEdit.SupplCode;
      this.GetAppData();
      this.setLookup();
    })

    this.modal = this.modalService.open(content);
    this.modal.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modal.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modal.close();
    });
  }

  open(content) {

    this.mode = "add";
    this.objEdit = undefined;
    this.GetAppData();
    this.setLookup();
    this.MainInfoForm.patchValue({
      IsDisburseToCust: "",
      BudgetPlanAmount: 0,
      SelfFinancing: 0,
      FinancingAmount: 0,
      MrLoanPurposeCode: "",
      SupplierCode: "",
    });


    this.modal = this.modalService.open(content);
    this.modal.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modal.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modal.close();
    });
  }

  async ngOnInit() {
    this.loadDataTable();
    await this.GetAppData();
    this.setLookup();
    this.MainInfoForm.controls.FinancingAmount.disable();
  }

  CalculateFinancingAmt() {
    var BudgetPlanAmt = this.MainInfoForm.controls.BudgetPlanAmount.value;
    var SelfFinancingAmt = this.MainInfoForm.controls.SelfFinancing.value;

    if (SelfFinancingAmt > BudgetPlanAmt) {
      this.toastr.warningMessage("Self Financing Amount Must Be Lower Than Budget Plan Amount!");
      return;
    }

    var FinancingAmt = BudgetPlanAmt - SelfFinancingAmt;
    this.MainInfoForm.patchValue({
      FinancingAmount: FinancingAmt
    })
  }

  async GetAppData() {
    await this.http.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response: AppObj) => {
        this.AppObj = response;
        this.OfficeCode = this.AppObj.OriOfficeCode;
        if (this.AppObj.BizTemplateCode == CommonConstant.CFNA) {
          this.isCFNA = true;

          var objIsDisburse: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
          objIsDisburse.ProdOfferingCode = this.AppObj.ProdOfferingCode;
          objIsDisburse.RefProdCompntCode = CommonConstant.RefProdCompntCodeDisburseToCust;
          objIsDisburse.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;

          this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, objIsDisburse).toPromise().then(
            (response) => {
              if (response && response["StatusCode"] == "200" && response["ProdOfferingDId"] > 0) {
                this.MainInfoForm.patchValue({
                  IsDisburseToCust: response["CompntValue"] == 'Y' ? true : false
                });
                this.IsDisburseToCust = this.MainInfoForm.controls.IsDisburseToCust.value;

                this.CheckIsDisburseToCust();

                if (response["CompntValue"] != 'Y' && this.AppObj.BizTemplateCode != CommonConstant.CFNA) {
                  var appObj: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
                  appObj.ProdOfferingCode = this.AppObj.ProdOfferingCode;
                  appObj.RefProdCompntCode = CommonConstant.RefProdCompntSupplSchm;
                  appObj.ProdOfferingVersion = this.AppObj.ProdOfferingVersion;

                  this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
                    (response: ProdOfferingDObj) => {
                      if (response && response["StatusCode"] == "200") {
                        this.RefProdCmptSupplSchm = response;
                      }
                      else {
                        this.isProdOfrUpToDate = false;
                        this.missingProdOfrComp = CommonConstant.RefProdCompntSupplSchm;
                        this.ResponseProdOfrUpToDate.emit({ isProdOfrUpToDate: this.isProdOfrUpToDate, missingProdOfrComp: this.missingProdOfrComp });
                      }
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
                }
              }
              else {
                this.isProdOfrUpToDate = false;
                this.missingProdOfrComp = CommonConstant.RefProdCompntCodeDisburseToCust;
                this.ResponseProdOfrUpToDate.emit({ isProdOfrUpToDate: this.isProdOfrUpToDate, missingProdOfrComp: this.missingProdOfrComp });
              }
            }
          ).catch(
            (error) => {
              console.log(error);
            }
          );
        }
        if (this.AppObj.BizTemplateCode == CommonConstant.CFRFN4W) {
          this.MainInfoForm.controls.IsDisburseToCust.setValue(true);
          this.MainInfoForm.controls.IsDisburseToCust.disable();
          this.AppLoanPurposeObj.IsDisburseToCust = true;
          this.supplierInputLookupObj.isRequired = false;
          this.CheckIsDisburseToCust();
        }
      }
    );
  }

  setLookup() {
    this.loanObjectInputLookupObj = new InputLookupObj();
    this.loanObjectInputLookupObj.urlJson = "./assets/uclookup/NAP/lookupLoanObject.json";
    this.loanObjectInputLookupObj.urlEnviPaging = environment.losUrl + "/v1";
    this.loanObjectInputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupLoanObject.json";
    this.loanObjectInputLookupObj.genericJson = "./assets/uclookup/NAP/lookupLoanObject.json";

    this.supplierInputLookupObj = new InputLookupObj();
    this.supplierInputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.supplierInputLookupObj.addCritInput = new Array();


    if (this.isCollateral) {
      this.supplierInputLookupObj.urlJson = "./assets/uclookup/NAP/lookupSupplierRefinancingLoanObj.json";
      this.supplierInputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupSupplierRefinancingLoanObj.json";
      this.supplierInputLookupObj.genericJson = "./assets/uclookup/NAP/lookupSupplierRefinancingLoanObj.json";
    } else {
      this.supplierInputLookupObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
      this.supplierInputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
      this.supplierInputLookupObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";

      var critSuppSupplSchmObj = new CriteriaObj();
      critSuppSupplSchmObj.DataType = 'text';
      critSuppSupplSchmObj.restriction = AdInsConstant.RestrictionEq;
      critSuppSupplSchmObj.propName = 'VS.VENDOR_SCHM_CODE';
      critSuppSupplSchmObj.value = this.setCritSuppSupplSchmValue();
      this.supplierInputLookupObj.addCritInput.push(critSuppSupplSchmObj);
    }

    var critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'RO.OFFICE_CODE';
    critSuppObj.value = this.OfficeCode;
    this.supplierInputLookupObj.addCritInput.push(critSuppObj);

    if (this.objEdit != null) {
      this.loanObjectInputLookupObj.jsonSelect = { Descr: this.objEdit.MrLoanPurposeDescr };
      this.supplierInputLookupObj.jsonSelect = { VendorName: this.objEdit.SupplName };
    } else {
      this.loanObjectInputLookupObj.jsonSelect = { Descr: "" };
      this.supplierInputLookupObj.jsonSelect = { VendorName: "" };
    }
  }

  setCritSuppSupplSchmValue(): string {
    if (this.AppObj.BizTemplateCode == CommonConstant.CFNA) return "ALL";
    return this.RefProdCmptSupplSchm.CompntValue;
  }

  getSupplierInputLookupValue(event) {
    this.AppLoanPurposeObj.SupplCode = event.VendorCode;
  }

  getLoanInputLookupValue(event) {
    this.AppLoanPurposeObj.MrLoanPurposeCode = event.MasterCode;
  }

  SaveForm(enjiForm: NgForm) {
    this.AppLoanPurposeObj.AppId = this.AppId;
    if (this.MainInfoForm.controls.IsDisburseToCust.value == true) {
      this.AppLoanPurposeObj.IsDisburseToCust = true;
    } else {
      this.AppLoanPurposeObj.IsDisburseToCust = false;
    }
    this.AppLoanPurposeObj.BudgetPlanAmt = this.MainInfoForm.controls.BudgetPlanAmount.value;
    this.AppLoanPurposeObj.SelfFinancingAmt = this.MainInfoForm.controls.SelfFinancing.value;
    this.AppLoanPurposeObj.FinancingAmt = this.MainInfoForm.controls.FinancingAmount.value;

    if (this.mode == "edit") {
      this.AppLoanPurposeObj.AppLoanPurposeId = this.objEdit.AppLoanPurposeId;
      this.AppLoanPurposeObj.RowVersion = this.objEdit.RowVersion;
      if (this.isCFNA) {
        if (this.AppLoanPurposeObj.FinancingAmt <= 0) {
          this.toastr.errorMessage(ExceptionConstantX.FINANCING_AMT_CANNOT_LESS_THAN_ZERO);
          return;
        }
        //INTERNAL-0142 X: Sengaja di disable karena sudah ada penjagaan dari Max Plafond dari Agreement Parent
        //this.http.post(URLConstant.CheckFinAmtAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
          //(response) => {
            this.http.post(URLConstant.EditAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
              (response) => {
                this.modal.close();
                this.toastr.successMessage(response["message"]);
                enjiForm.reset();
                this.loadDataTable();
              });
          //},
          //(error) => { return; });
      } else {
        this.http.post(URLConstant.EditAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
          (response) => {
            this.modal.close();
            this.toastr.successMessage(response["message"]);
            enjiForm.reset();
            this.loadDataTable();
          });
      }
    }
    else {
      if (this.isCFNA) {
        if (this.AppLoanPurposeObj.FinancingAmt <= 0) {
          this.toastr.errorMessage(ExceptionConstantX.FINANCING_AMT_CANNOT_LESS_THAN_ZERO);
          return;
        }
        //INTERNAL-0142 X: Sengaja di disable karena sudah ada penjagaan dari Max Plafond dari Agreement Parent
        //this.http.post(URLConstant.CheckFinAmtAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
          //(response) => {
            this.http.post(URLConstant.AddAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
              (response) => {
                this.modal.close();
                this.toastr.successMessage(response["message"]);
                enjiForm.reset();
                this.loadDataTable();
              });
          //},(error) => { return; });
      } else {
        this.http.post(URLConstant.AddAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
          (response) => {
            this.modal.close();
            this.toastr.successMessage(response["message"]);
            enjiForm.reset();
            this.loadDataTable();
          });
      }
    }
  }

  deleteLoanObject(AppLoanPurposeId) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var obj = {
        Id: AppLoanPurposeId
      };

      this.http.post(URLConstant.DeleteAppLoanPurpose, obj).subscribe(response => {
        this.toastr.successMessage(response["Message"]);
        this.loadDataTable();
      });
    }
  }

  loadDataTable() {
    this.http.post(URLConstant.GetListAppLoanPurposeByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.resultData = response["listResponseAppLoanPurpose"];
      });
  }

  CheckIsDisburseToCust() {
    if (this.MainInfoForm.controls.IsDisburseToCust.value == true) {
      this.supplierInputLookupObj.isRequired = false;
      if (this.MainInfoForm.controls.lookupValueSupplier) {
        this.MainInfoForm.controls.lookupValueSupplier["controls"].value.clearValidators();
        this.MainInfoForm.controls.lookupValueSupplier["controls"].value.setValue("");
        this.MainInfoForm.controls.lookupValueSupplier.updateValueAndValidity();
      }
      this.AppLoanPurposeObj.SupplCode = "";
      this.http.post(URLConstant.GetGeneralSettingValueByCode, {Code: CommonConstantX.GSVendorMpfFdCode}).toPromise().then(
        (response: GeneralSettingObj) => {
          this.AppLoanPurposeObj.SupplCode = response.GsValue;
        }
      );
    } else {
      this.supplierInputLookupObj.isRequired = true;
      if (this.MainInfoForm.controls.lookupValueSupplier) {
        this.MainInfoForm.controls.lookupValueSupplier.setValidators(Validators.required);
        this.MainInfoForm.controls.lookupValueSupplier.updateValueAndValidity();
      }
    }
  }
}
