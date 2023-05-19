import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any;
  groups=["ganesh","sagar"]
  constructor(
    private rout: Router,
    private toastr: ToastrService,
    private http: ApiServiceService,
  ) {}

  ngOnInit(): void {
    if(!this.http.chekstorage())
    {
      localStorage.removeItem('login');
      this.rout.navigate(['auth/login'])
    }

    this.http.getData(`/user/oneuser/${localStorage.getItem('id')}`).subscribe({
      next: (res: any) => {
        console.log(res);
        this.userData=res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
