import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-main-data-component',
  templateUrl: './main-data-component.component.html',
  styleUrls: ['./main-data-component.component.scss']
})
export class MainDataComponentComponent implements OnInit {
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
