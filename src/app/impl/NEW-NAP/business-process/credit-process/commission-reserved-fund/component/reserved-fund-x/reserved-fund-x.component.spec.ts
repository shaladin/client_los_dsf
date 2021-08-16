import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedFundXComponent } from './reserved-fund-x.component';

describe('ReservedFundXComponent', () => {
  let component: ReservedFundXComponent;
  let fixture: ComponentFixture<ReservedFundXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservedFundXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservedFundXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
