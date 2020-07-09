import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-root',
  templateUrl: './error-dialog.component.html',
  providers: [NGXToastrService]
})
export class ErrorDialogComponent implements OnInit, AfterViewInit {

  title = 'Angular-Interceptor';
  status: string;
  reason:string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private toastr: NGXToastrService) {}

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    // setTimeout(() => this.toastr.errorAPI(this.data['status'],this.data['reason']));
  }
}
