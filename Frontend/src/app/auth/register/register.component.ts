import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    private rout: Router,
    private http: ApiServiceService,
    private toastr: ToastrService,
    // private recaptcha: ReCaptchaV3Service,

  ) {}
  register = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  collection() {

    this.http
      .postData('/user/signup', this.register?.value)
      .subscribe({
        next: (res) => {
          this.toastr.success('Registered .', 'Successfully!');
          this.register.reset({});
          console.log(res);
        },
        error: (err) => {
          console.log(err.error);

          this.toastr.error(err.error.error, 'Somthing Wrong!');
        }
      });


  }
  ngOnInit(): void {

  }

}
