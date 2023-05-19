import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-mailregister',
  templateUrl: './mailregister.component.html',
  styleUrls: ['./mailregister.component.css']
})
export class MailregisterComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
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
    groupid:new FormControl(this.route.snapshot.paramMap.get('id'), [Validators.required]),
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
