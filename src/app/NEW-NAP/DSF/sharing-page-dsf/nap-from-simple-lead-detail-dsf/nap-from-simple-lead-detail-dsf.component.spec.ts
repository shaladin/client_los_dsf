import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapFromSimpleLeadDetailDsfComponent } from './nap-from-simple-lead-detail-dsf.component';

describe('NapFromSimpleLeadDetailDsfComponent', () => {
  let component: NapFromSimpleLeadDetailDsfComponent;
  let fixture: ComponentFixture<NapFromSimpleLeadDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapFromSimpleLeadDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapFromSimpleLeadDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
