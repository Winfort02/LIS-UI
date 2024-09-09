import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrinalysisFormComponent } from './urinalysis-form.component';

describe('UrinalysisFormComponent', () => {
  let component: UrinalysisFormComponent;
  let fixture: ComponentFixture<UrinalysisFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrinalysisFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UrinalysisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
