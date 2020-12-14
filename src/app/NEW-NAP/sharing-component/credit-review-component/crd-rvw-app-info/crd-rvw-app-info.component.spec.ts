import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwAppInfoComponent } from './crd-rvw-app-info.component';

describe('CrdRvwAppInfoComponent', () => {
  let component: CrdRvwAppInfoComponent;
  let fixture: ComponentFixture<CrdRvwAppInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwAppInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwAppInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
