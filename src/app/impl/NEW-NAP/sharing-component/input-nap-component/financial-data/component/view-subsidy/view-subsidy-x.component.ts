import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { AppFinDataObjX } from 'app/impl/shared/model/AppFinDataObjX.model';



@Component({
  selector: 'app-view-subsidy-x',
  templateUrl: './view-subsidy-x.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ViewSubsidyXComponent implements OnInit {
  @Input() AppId: number;
  @Input() appFinDataObj : AppFinDataObjX;
  @Input() BizTemplateCode: string;

  constructor(
  ) { }

  ngOnInit() {

  }
}
