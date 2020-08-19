import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingMouCompanyComponent } from './existing-mou-company.component';

describe('ExistingMouCompanyComponent', () => {
  let component: ExistingMouCompanyComponent;
  let fixture: ComponentFixture<ExistingMouCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingMouCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingMouCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
