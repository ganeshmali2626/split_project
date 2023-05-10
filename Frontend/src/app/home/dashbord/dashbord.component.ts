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
export class DashbordComponent implements OnInit,OnChanges{

  groupList:any;

  constructor(
    private rout: Router,
    private toastr: ToastrService,
    private http: ApiServiceService,
    private obs:ObservableServiceService
  ) {}

  ngOnInit(): void {
    this.obs.state.next(true)
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  addItem(data:any)
  {
    console.log(data);
    this.groupList=data;

  }
  }

