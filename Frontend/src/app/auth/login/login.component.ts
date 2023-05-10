import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  protected aFormGroup!: FormGroup;
  token!: string;
  stoken: any;
  socialAuthService: any;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private http: ApiServiceService,
    private formBuilder: FormBuilder
  ) {}

  login = new FormGroup({
    phone: new FormControl(null, [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  loginUser() {
    this.http.postData(`/user/login`, this.login.value).subscribe({
      next: (res: any) => {
        console.log(res);

        localStorage.setItem('login', JSON.stringify(res.token.token));
        localStorage.setItem('id', JSON.stringify(res.token.id));
        this.router.navigate(['/home/dashboard']);
      },
      error: (err) => {
        console.log(err);

        localStorage.removeItem('login');
        this.toastr.error('', err.error.error);
      },
    });
  }

  // get email() {
  //   return this.login.get('email');
  // }
  // get password() {
  //   this.aFormGroup = this.formBuilder.group({
  //     recaptcha: ['', Validators.required],
  //   });
  //   return this.login.get('password');
  // }
  ngOnInit(): void {
    //   this.authService.authState.subscribe((user) => {
    //     if (this.token) {
    //       if (user.idToken) {
    //         this.stoken = user.idToken;
    //         this.googleSignIn();
    //       }
  }
  //   });
  //   this.captchaa();
  // }
  // signOut(): void {
  //   this.localDetails.removeData();
  //   this.authService
  //     .signOut()
  //     .then((data) => {
  //       this.router.navigate(['login']);
  //     })
  //     .catch((data) => {});
  // }
  // captchaa() {
  //   this.recaptcha.execute('importantAction').subscribe((token: string) => {
  //     this.token = token;
  //     this.login.get('captcha')?.setValue(token);
  //   });
  // }
  // googleSignIn() {
  //   this.http
  //     .postData('/auth/login/google', {
  //       token: this.stoken,
  //       captcha: this.token,
  //     })
  //     .subscribe({
  //       next: (res: any) => {
  //         localStorage.setItem('login', JSON.stringify(res.token)),
  //           this.router.navigate(['products/product-list']);
  //       },
  //       error: (err) => {
  //         this.signOut();
  //         console.log(err);
  //       },
  //     });
  // }
}
