import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
})
export class CreateGroupComponent implements OnInit {
  groupdata: any ;
  chekList: any = [];
  expense: any = [];
  userId: any;
  chekListid: any;
  liData: any;
  booleanfield:boolean=true;
  xyz:any=[];
  role:any;
  id={id:JSON.parse(localStorage.getItem('id')!),paidstatus:true}
  openAccordionIndex: number = -1;
  constructor(
    private rout: ActivatedRoute,
    private http: ApiServiceService,
    private toastr: ToastrService,
    private router:Router
  ) {}

  addexpense = new FormGroup({
    amount: new FormControl(null, [Validators.required]),
    description: new FormControl(''),
    splitbetween: new FormControl([], [Validators.required]),
    paidBy: new FormControl('', [Validators.required]),
    groupid: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if(!this.http.chekstorage())
    {
      localStorage.removeItem('login');
      this.router.navigate(['auth/login'])
    }
    this.getgroupdata();
    this.setexpense();
    this.getusers();
    this.booleanfield=true;
  }
  getgroupdata() {
    this.userId = JSON.parse(localStorage.getItem('id')!);
    this.http
      .getData(`/group/getgroup/${this.rout.snapshot.paramMap.get('id')}`)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.groupdata = res;
          this.xyz=this.liData.filter((item:any) => !this.groupdata?.users.some((obj:any) => obj.id?._id === item._id));

          const user = this.groupdata.users.find((user:any) => user.id._id === JSON.parse(localStorage.getItem('id')!));
    if (user) {
    this.role = user.roal;

          }
        },
        error: (err) => {
          console.log(err);
        },
      });


  }
  leavegroup(){
    console.log(localStorage.getItem('id'));

    const foundUser = this.groupdata?.users.find((user:any) => user.id?._id === JSON.parse(localStorage.getItem('id')!));
     console.log(foundUser.roal);
     this.chekListid=foundUser?._id;
     Swal.fire({
      title: 'Are you sure?',
      text: "You won't leave group!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, leave it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('leave group!', 'successfully');
        this.removeUser(foundUser.roal);
        this.router.navigate(['/home/dashboard']);
      }
    });


  }
  editgroupname(data:any)
  {
    this.booleanfield=true;
    this.http
      .putData(`/group/name/${this.rout.snapshot.paramMap.get('id')}`,{name:data})
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.getgroupdata();
          this.toastr.success( 'Updated Group Name  .', 'Successfully!');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getDataChek(e: any, data: any) {
    e.stopImmediatePropagation();
    if (this.chekList.includes(data)) {
      this.chekList.splice(this.chekList.indexOf(data), 1);
      console.log(this.chekList);
    } else {
      this.chekList.push(data);
      console.log(this.chekList);
    }
  }

  getexpense() {
    const list=this.chekList.map((data:any)=>{
      if(data===JSON.parse(localStorage.getItem('id')!))
      {
      return {id:data,paidstatus:true}
      }else{
        return {id:data,paidstatus:false}
      }
    })
    this.addexpense.controls['splitbetween'].setValue(list);
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
        console.log(this.userId, data2, data);

        this.http
          .patchData(`/expense/delete`, {
            userid: this.userId,
            expid: data2,
            amount: data,
          })
          .subscribe({
            next: (res: any) => {
              console.log(res);
              this.setexpense();
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    });
  }
  removeUser(data:string) {
    this.http
      .patchData(`/group/remove`, {
        userid: this.chekListid,
        groupid: this.rout.snapshot.paramMap.get('id'),
        roal:data,
      })
      .subscribe({
        next: (res: any) => {
          // this.toastr.success('Removed .', 'Successfully!');
          this.getgroupdata();
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getDataCheked(e: any, data: any) {
    e.stopImmediatePropagation();
    console.log(data);
    this.chekListid = data;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't remove!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, removed it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Removed!', 'successfully');
        this.removeUser('user');
      }
    });

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
    const userList=this.chekList.map((data:any)=>{

        return {id:data,roal:"user"}

    })
    this.http
      .patchData(`/group/add`, {
        userid: userList,
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
  openAccordion(index: number) {
    if (this.openAccordionIndex === index) {
      this.openAccordionIndex = -1; // Close the accordion if it's already open
    } else {
      this.openAccordionIndex = index; // Open the clicked accordion
    }
  }

  isAccordionOpen(index: number): boolean {
    return this.openAccordionIndex === index;
  }

  checkStatus(data: any) {

    const itemId = JSON.parse(localStorage.getItem('id')!);
    return data.some((item:any) => item.id?._id === itemId && item.paidstatus === 'false');
  }

}
