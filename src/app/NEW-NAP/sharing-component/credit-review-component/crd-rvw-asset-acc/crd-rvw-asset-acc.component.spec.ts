import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwAssetAccComponent } from './crd-rvw-asset-acc.component';

describe('CrdRvwAssetAccComponent', () => {
  let component: CrdRvwAssetAccComponent;
  let fixture: ComponentFixture<CrdRvwAssetAccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwAssetAccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwAssetAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
