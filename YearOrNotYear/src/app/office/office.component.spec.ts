import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OfficeComponent } from './office.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        OfficeComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(OfficeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'YearOrNotYear'`, () => {
    const fixture = TestBed.createComponent(OfficeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('YearOrNotYear');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(OfficeComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to YearOrNotYear!');
  });
});
