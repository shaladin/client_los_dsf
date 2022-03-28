import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-insurance-data',
  templateUrl: './insurance-data.component.html',
  styleUrls: ['./insurance-data.component.css']
})

export class InsuranceDataComponent implements OnInit {
  @Input() appId: number;
  @Input() BLCode: string;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) this.appId = params["AppId"];
    })
  }
  
  ngOnInit() {
  }

  SaveForm() {
    this.outputTab.emit();
  }

  Cancel() {
    this.outputCancel.emit();
  }
}