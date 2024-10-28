import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredItemsComponent } from './expired-items.component';

describe('ExpiredItemsComponent', () => {
  let component: ExpiredItemsComponent;
  let fixture: ComponentFixture<ExpiredItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpiredItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
