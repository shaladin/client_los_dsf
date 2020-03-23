import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-mou-view-detail',
  templateUrl: './mou-view-detail.component.html',
  styleUrls: ['./mou-view-detail.component.scss']
})
export class MouViewDetailComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
  }

  MouDataForm = this.fb.group({
  })

}
