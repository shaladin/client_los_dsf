import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadInputLeadDataXComponent } from './new-lead-input-lead-data-x.component';

describe('NewLeadInputLeadDataXComponent', () => {
  let component: NewLeadInputLeadDataXComponent;
  let fixture: ComponentFixture<NewLeadInputLeadDataXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadInputLeadDataXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadInputLeadDataXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
