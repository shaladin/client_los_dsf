import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwAppPlafondInfoXDsfComponent } from './crd-rvw-app-plafond-info-x-dsf.component';

describe('CrdRvwAppPlafondInfoXDsfComponent', () => {
  let component: CrdRvwAppPlafondInfoXDsfComponent;
  let fixture: ComponentFixture<CrdRvwAppPlafondInfoXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwAppPlafondInfoXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwAppPlafondInfoXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
