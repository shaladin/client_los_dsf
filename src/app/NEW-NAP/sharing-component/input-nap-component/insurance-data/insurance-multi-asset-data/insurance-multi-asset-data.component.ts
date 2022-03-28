import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-insurance-multi-asset-data',
  templateUrl: './insurance-multi-asset-data.component.html',
  styleUrls: ['./insurance-multi-asset-data.component.css']

})
export class InsuranceMultiAssetDataComponent implements OnInit {
  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Input() BLCode: string = "";
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    })
  }

  async ngOnInit() {
  }

  CancelHandler() {
    this.outputCancel.emit();
  }

  SaveForm() {
    this.outputTab.emit();
  }
}