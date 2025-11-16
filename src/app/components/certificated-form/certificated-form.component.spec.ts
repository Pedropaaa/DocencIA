import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatedFormComponent } from './certificated-form.component';

describe('CertificatedFormComponent', () => {
  let component: CertificatedFormComponent;
  let fixture: ComponentFixture<CertificatedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificatedFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificatedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
