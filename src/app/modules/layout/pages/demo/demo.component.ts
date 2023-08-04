import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { EndpointService } from 'src/app/services/endpoint.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
  form: FormGroup;
  videoUrl: string = '';
  id_request: string = '';

  constructor(
    private fb: FormBuilder,
    private _svcEndpoint: EndpointService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef) {
    this.form = this.fb.group({
      text: ['', Validators.required]
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      event.preventDefault();
      this.crearHablante();
    }
  }

  crearHablante() {
    if (this.form.valid) {
      this.spinner.show();
      this.id_request = '';
      this.videoUrl = '';
      
      const body = this.form.value;

      this._svcEndpoint.crearVideo(body).subscribe({
        next: (resp: any) => {
          this.cd.detectChanges();
          this.videoUrl = resp.result_url;
          this.spinner.hide();
        },
        error: (error: any) => {
          console.error(error);
          this.spinner.hide();
        }
      })
    }
  }
}
