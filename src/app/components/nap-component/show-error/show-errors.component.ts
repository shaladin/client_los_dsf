import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';
import { isNull } from '@angular/compiler/src/output/output_ast';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'show-errors',
  template: `
    <div *ngIf="shouldShowErrors()" class="invalid-feedback d-block">
      <div *ngFor="let error of listOfErrors()" translate>{{error}}</div>
    </div>
  `
})
// <div class="col-md-9">
// <input type="text" class="form-control adInsInput width-25-per" name="empNo" required
//   [attr.disabled]="pageType == 'edit' ? true : null" [(ngModel)]="empNo" #EmpNo="ngModel"
//   [ngClass]="{ 'is-invalid': RefEmpForm.submitted && EmpNo.invalid }">
// <div *ngIf="RefEmpForm.submitted && EmpNo.invalid" class="invalid-feedback">
//   <div *ngIf="EmpNo.errors.required" class="adInsReqMsg" translate>This field is required</div>
// </div>
// </div>
export class ShowErrorsComponent {

  private static readonly errorMessages = {
    'required': () => 'This field is required',
    'requiredWithField': (params) => params + ' is required',
    'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
    'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
    'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
    'years': (params) => params.message,
    'countryCity': (params) => params.message,
    'uniqueName': (params) => params.message,
    'telephoneNumbers': (params) => params.message,
    'telephoneNumber': (params) => params.message
  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;
  @Input()
  private submit: boolean;
  @Input()
  private fieldName: string;

  shouldShowErrors(): boolean {
    return this.control && (this.submit || this.control.dirty || this.control.touched) &&
      this.control.errors && !this.control.valid;
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors)
      .map(field => this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    if (this.fieldName === undefined) {
      if (type == "pattern" && params.requiredPattern == "^[0-9]+$") {
      return "Number Only";
      }
      return ShowErrorsComponent.errorMessages[type](params);
    } else {
      return ShowErrorsComponent.errorMessages['requiredWithField'](this.fieldName);
    }
  }

}

// CustCoyController.cs
// CustCoyLegalDocController.cs
// CustCoyShareholderController.cs
// CustEmergencyCntctController.cs
// CustExposureController.cs
// CustGrpController.cs
// CustPersonalController.cs
// CustPersonalJobDataController.cs
// CustScoreAttrContentController.cs

// containerBuilder.RegisterType<CustCoyService>().As<ICustCoyService>();
// containerBuilder.RegisterType<CustCoyLegalDocService>().As<ICustCoyLegalDocService>();
// containerBuilder.RegisterType<CustCoyShareholderService>().As<ICustCoyShareholderService>();
// containerBuilder.RegisterType<CustEmergencyCntctService>().As<ICustEmergencyCntctService>();
// containerBuilder.RegisterType<CustExposureService>().As<ICustExposureService>();
// containerBuilder.RegisterType<CustGrpService>().As<ICustGrpService>();
// containerBuilder.RegisterType<CustPersonalService>().As<ICustPersonalService>();
// containerBuilder.RegisterType<CustPersonalJobDataService>().As<ICustPersonalJobDataService>();
// containerBuilder.RegisterType<CustScoreAttrContentService>().As<ICustScoreAttrContentService>();