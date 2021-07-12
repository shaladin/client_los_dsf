import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSumamryAppCfnaDsfComponent } from './view-sumamry-app-cfna-dsf.component';

describe('ViewSumamryAppCfnaDsfComponent', () => {
  let component: ViewSumamryAppCfnaDsfComponent;
  let fixture: ComponentFixture<ViewSumamryAppCfnaDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSumamryAppCfnaDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSumamryAppCfnaDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
