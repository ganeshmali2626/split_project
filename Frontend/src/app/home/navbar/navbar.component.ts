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
  @Output() grouparraylist = new EventEmitter<any>();
  constructor(
    private rout: Router,
    private toastr: ToastrService,
    private http: ApiServiceService,
    public cd: ChangeDetectorRef,
    private obs:ObservableServiceService,
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


  ngOnInit(): void {
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
    this.getgroups();
  }
  logout() {
    localStorage.removeItem('login');
    localStorage.removeItem('id');
    this.rout.navigate(['/auth/login']);
  }
  getDataChek(e: any, data: any) {
    e.stopImmediatePropagation();
    console.log('fdsfsd');
    if (this.chekList.includes(data)) {
      this.chekList.splice(this.chekList.indexOf(data), 1);
      console.log(this.chekList);
    } else {
      this.chekList.push(data);
      console.log(this.chekList);
    }
  }
  createGroup(data: any) {
    const userList=this.chekList.map((data:any)=>{
      if(data===JSON.parse(localStorage.getItem('id')!))
    {
        return {id:data,roal:"admin"}
    }else{
        return {id:data,roal:"user"}
    }
    })
    console.log(localStorage.getItem('id'));

    this.http
      .postData('/group/create', { name: data, users: userList })
      .subscribe({
        next: (res) => {
          this.toastr.success('CREATED .', 'Successfully!');
          console.log(res);
          this.getgroups();
          this.obs.state.next(true)
        },
        error: (err) => {
          console.log(err.error);

          this.toastr.error(err.error.error, 'Somthing Wrong!');
        },
      });
  }
  getgroups() {
    this.obs.state.subscribe((data) => {
      if(data)
      {
        this.http.getData(`/group/get/${localStorage.getItem("id")}`).subscribe({
          next: (res: any) => {
            console.log(res);
            this.groupList = res;
            this.grouparraylist.emit(this.groupList);
            this.obs.state.next(false)
          },
          error: (err) => {
            this.obs.state.next(false)
            console.log(err);
          },
        });
      }
    })
  }
}
