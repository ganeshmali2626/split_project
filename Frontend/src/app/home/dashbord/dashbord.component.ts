import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { ToastrService } from 'ngx-toastr';
import { ObservableServiceService } from 'src/app/services/observable-service.service';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit{

  groupList:any;

  constructor(
    private rout: Router,
    private toastr: ToastrService,
    private http: ApiServiceService,
    private obs:ObservableServiceService
  ) {}

  ngOnInit(): void {
    if(!this.http.chekstorage())
    {
      localStorage.removeItem('login');
      this.rout.navigate(['auth/login'])
    }
    this.getgroups();
    this.obs.state.next(true)
  }

  getgroups() {
      this.obs.state.subscribe((data) => {
        if(data)
        {
          this.http.getData(`/group/get/${localStorage.getItem("id")}`).subscribe({
            next: (res: any) => {
              console.log(res);
              this.groupList = res;
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

