import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData: any;
  edit: boolean = true;
  groups = ['ganesh', 'sagar'];
  constructor(
    private rout: Router,
    private toastr: ToastrService,
    private http: ApiServiceService
  ) {}

  edituserdetails = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnInit(): void {
    if (!this.http.chekstorage()) {
      localStorage.removeItem('login');
      this.rout.navigate(['auth/login']);
    }
    this.getuserdata();

  }
  getuserdata(){
    this.http.getData(`/user/oneuser/${localStorage.getItem('id')}`).subscribe({
      next: (res: any) => {
        console.log(res);
        this.userData = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  editvalue()
  {
    this.edit = !this.edit
    console.log(this.userData?.name);
    this.edituserdetails.controls['name'].setValue(this.userData?.name);
    this.edituserdetails.controls['phone'].setValue(this.userData?.phone);
    this.edituserdetails.controls['email'].setValue(this.userData?.email);


  }

  collection() {
    this.edit = !this.edit;
    console.log(this.edituserdetails.value);

    this.http
      .putData(
        `/user/edit/${localStorage.getItem('id')}`,
        this.edituserdetails.value
      )
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.toastr.success('Update .', 'Successfully!');
          this.getuserdata();
        },
        error: (err) => {
          this.toastr.error(err.messege);

          console.log(err);
        },
      });
  }
}
