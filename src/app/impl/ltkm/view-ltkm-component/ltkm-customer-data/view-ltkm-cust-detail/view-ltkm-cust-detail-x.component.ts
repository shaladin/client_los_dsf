import { Component, OnInit, Input, Output, EventEmitter, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-ltkm-cust-detail-x',
  templateUrl: './view-ltkm-cust-detail-x.component.html'
})
export class ViewLtkmCustDetailXComponent implements OnInit {

  @Input() LtkmCustId: number;
  @Input() MrCustTypeCode: string;
  @Input() CustomerTitle: string;
  @Input() IsPopup: boolean = true;
  @Output() CloseDetail: EventEmitter<object> = new EventEmitter();

  constructor(private http: HttpClient, @Optional() public activeModal: NgbActiveModal) {
  }

  async ngOnInit() : Promise<void>{    
  }

  onBackClick(){
    this.CloseDetail.emit({});
  }
}
