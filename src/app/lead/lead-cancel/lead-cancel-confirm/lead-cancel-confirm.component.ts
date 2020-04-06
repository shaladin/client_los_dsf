import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-lead-cancel-confirm',
  templateUrl: './lead-cancel-confirm.component.html',
  styleUrls: ['./lead-cancel-confirm.component.scss'],
  providers: [NGXToastrService]
})
export class LeadCancelConfirmComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
