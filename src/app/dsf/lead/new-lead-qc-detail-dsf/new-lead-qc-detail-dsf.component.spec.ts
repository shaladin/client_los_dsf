import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadQcDetailDsfComponent } from './new-lead-qc-detail-dsf.component';

describe('NewLeadQcDetailDsfComponent', () => {
  let component: NewLeadQcDetailDsfComponent;
  let fixture: ComponentFixture<NewLeadQcDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadQcDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadQcDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
