import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshIntervalComponent } from './refresh-interval.component';

describe('RefreshIntervalComponent', () => {
  let component: RefreshIntervalComponent;
  let fixture: ComponentFixture<RefreshIntervalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefreshIntervalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RefreshIntervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
