import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustXObj } from 'app/impl/shared/model/cust-x-obj.model';

@Component({
  selector: 'app-asli-ri-view-x',
  templateUrl: './asli-ri-view-x.component.html',
  styleUrls: []
})
export class AsliRiViewXComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) {}

  @Input() custObj: CustXObj;
  @Input() parentForm: FormGroup;
  @Input() MrCustTypeCode: string;

  async ngOnInit() {}
}
