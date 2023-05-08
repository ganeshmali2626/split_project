import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
})
export class CreateGroupComponent implements OnInit {
  groupdata: any = [];
  chekList: any = [];
  expense: any = [];
  userId: any;
  chekListid: any;
  liData: any;
  constructor(
    private rout: ActivatedRoute,
    private http: ApiServiceService,
    private toastr: ToastrService
  ) {}

  addexpense = new FormGroup({
    amount: new FormControl(null, [Validators.required]),
    description: new FormControl(''),
    splitbetween: new FormControl([], [Validators.required]),
    paidBy: new FormControl('', [Validators.required]),
    groupid: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.getgroupdata();
    this.setexpense();
    this.getusers();
  }
  getgroupdata() {
    this.userId = JSON.parse(localStorage.getItem('id')!);
    this.http
      .getData(`/group/getgroup/${this.rout.snapshot.paramMap.get('id')}`)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.groupdata = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getDataChek(e: any, data: any) {
    // e.stopImmediatePropagation();
    if (this.chekList.includes(data)) {
      this.chekList.splice(this.chekList.indexOf(data), 1);
      console.log(this.chekList);
    } else {
      this.chekList.push(data);
      console.log(this.chekList);
    }
  }

  getexpense() {
    this.addexpense.controls['splitbetween'].setValue(this.chekList);
    this.addexpense.controls['paidBy'].setValue(localStorage.getItem('id'));
    this.addexpense.controls['groupid'].setValue(this.groupdata._id);
    console.log(this.addexpense.value);

    this.http.postData('/expense/create', this.addexpense?.value).subscribe({
      next: (res) => {
        this.toastr.success('Added .', 'Successfully!');
        this.addexpense.reset({});
        this.chekList = [];
        console.log(res);
        this.setexpense();
      },
      error: (err) => {
        console.log(err.error);

        this.toastr.error(err.error.error, 'Somthing Wrong!');
      },
    });
  }

  setexpense() {
    this.http
      .getData(`/expense/get/${this.rout.snapshot.paramMap.get('id')}`)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.expense = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  payamount(data2: any, data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't pay!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, payed it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('payed!', 'successfully');
        this.http
          .patchData(`/expense/delete`, {
            userid: this.userId,
            expid: data2,
            amount: data,
          })
          .subscribe({
            next: (res: any) => {
              console.log(res);
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    });
  }
  removeUser() {
    this.http
      .patchData(`/group/remove`, {
        userid: this.chekListid,
        groupid: this.rout.snapshot.paramMap.get('id'),
      })
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Removed .', 'Successfully!');
          this.getgroupdata();
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getDataCheked(e: any, data: any) {
    // e.stopImmediatePropagation();
    console.log(data);
    this.chekListid = data;
  }
  getusers() {
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
  }
  addUser() {
    this.http
      .patchData(`/group/add`, {
        userid: this.chekList,
        groupid: this.rout.snapshot.paramMap.get('id'),
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.toastr.success('Added .', 'Successfully!');
          this.chekList = [];
          this.getgroupdata();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
