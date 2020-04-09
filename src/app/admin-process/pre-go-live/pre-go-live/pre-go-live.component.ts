import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pre-go-live',
  templateUrl: './pre-go-live.component.html',
  styleUrls: ['./pre-go-live.component.scss']
})
export class PreGoLiveComponent implements OnInit {

  viewObj: string;
  MainInfoForm = this.fb.group({
    AgrmntDt : ['', Validators.required],
    EffectiveDt : ['', Validators.required],
    Notes : ['', Validators.required]
  })


  constructor(private fb : FormBuilder) { }

  ngOnInit() {

    this.viewObj = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLive.json";


  }

}
