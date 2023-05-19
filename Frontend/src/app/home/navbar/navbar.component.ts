import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ObservableServiceService } from 'src/app/services/observable-service.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

const SWEETALERT_CONFIG_TOKEN = 'SweetAlertConfigToken';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [
    {
      provide: SWEETALERT_CONFIG_TOKEN,
      useValue: {
        title: 'Are you sure?',
        text: "You won't be Logout!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      },
    },
  ],
})
export class NavbarComponent implements OnInit {
  showdetails: boolean = false;
  liData: any;
  chekList: any = [];
  groupList: any;
  status!: boolean;
  constructor(
    private rout: Router,
    private toastr: ToastrService,
    private http: ApiServiceService,
    public cd: ChangeDetectorRef,
    private obs: ObservableServiceService,
    @Inject(SWEETALERT_CONFIG_TOKEN) private swalConfig: any
  ) {}
  alertfun() {
    Swal.fire(this.swalConfig).then((result: any) => {
      if (result.isConfirmed) {
        this.logout();
        Swal.fire('Logout!', 'Your are successfully loged out.', 'success');
      }
    });
  }

  login = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    users: new FormArray([
      new FormControl('', [Validators.required, Validators.email]),
    ]),
  });

  get usersArray(): FormArray {
    return this.login.get('users') as FormArray;
  }
  onAddUser() {
    this.usersArray.push(
      new FormControl(null, [Validators.required, Validators.email])
    );
  }
  isEmailNotUnique(email: string, currentIndex: number): boolean {
    const emailControls = this.usersArray.controls.filter(
      (control, index) => index !== currentIndex
    );
    this.status = emailControls.some((control) => control.value === email);

    return emailControls.some((control) => control.value === email);
  }
  ngOnInit(): void {
    if (!this.http.chekstorage()) {
      localStorage.removeItem('login');
      this.rout.navigate(['auth/login']);
    }
    this.http.getData('/user/group').subscribe({
      next: (res: any) => {
        console.log(res);
        this.liData = res;
      },
      error: (err) => {
        localStorage.removeItem('login');
        console.log(err);
      },
    });
    // this.getgroups();
  }
  logout() {
    localStorage.removeItem('login');
    localStorage.removeItem('id');
    this.rout.navigate(['/auth/login']);
  }
  // getDataChek(e: any, data: any) {
  //   e.stopImmediatePropagation();
  //   if (this.chekList.includes(data)) {
  //     this.chekList.splice(this.chekList.indexOf(data), 1);
  //     console.log(this.chekList);
  //   } else {
  //     this.chekList.push(data);
  //     console.log(this.chekList);
  //   }
  // }
  createGroup() {
    this.http.getData(`/user/oneuser/${localStorage.getItem('id')}`).subscribe({
      next: (res: any) => {
        // this.login?.value?.users?.includes("ganesh@mali")
        this.login.value.users?.push(res.email);
        const userList = this.login.value.users?.map((data: any) => {
          if (data === res.email) {
            return { id: data, roal: 'admin' };
          } else {
            return { id: data, roal: 'user' };
          }
        });
        this.http
          .postData('/group/create', {
            name: this.login.value.name,
            users: userList,
          })
          .subscribe({
            next: (res) => {
              this.toastr.success('CREATED .', 'Successfully!');
              console.log(res);
              // this.getgroups();
              this.obs.state.next(true);
              this.login.reset();
            },
            error: (err) => {
              console.log(err.error);
              console.log('new test git');

              this.login.reset();
              this.toastr.error(err.error.error, 'Somthing Wrong!');
            },
          });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
