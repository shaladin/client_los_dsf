import { Component, OnInit, Input, Output, EventEmitter, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-app-cust-detail',
  templateUrl: './view-app-cust-detail.component.html',
  styleUrls: []
})
export class ViewAppCustDetailComponent implements OnInit {

  @Input() AppCustId: number;
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
