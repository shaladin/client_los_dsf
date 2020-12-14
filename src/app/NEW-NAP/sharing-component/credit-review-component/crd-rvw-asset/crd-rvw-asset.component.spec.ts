import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwAssetComponent } from './crd-rvw-asset.component';

describe('CrdRvwAssetComponent', () => {
  let component: CrdRvwAssetComponent;
  let fixture: ComponentFixture<CrdRvwAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
