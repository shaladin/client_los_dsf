import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchase-order-fl4w',
  templateUrl: './purchase-order-fl4w.component.html',
  styleUrls: ['./purchase-order-fl4w.component.scss']
})
export class PurchaseOrderFl4wComponent implements OnInit {
  AppId: number;
  AgrmntId: number;
  TaskListId: number;

  constructor() { }

  ngOnInit() {
  }

}
