import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  students: any = [];
  host: string = environment.url;
  fileUrl: any = '';
  filePath: any = '';
  picData: any;
  fileName: any;
  newStudentForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern("^[a-zA-Z]+$")]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern("^[a-zA-Z]+$")]],
    dob: ['', [Validators.required]],
    percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
  });
  inEditStudent: any;
  constructor(private http: HttpClient,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private sanitize: DomSanitizer,
    private toastr: ToastrService) {

  }

  ngOnInit() {
    this.getStudents();
    console.log(environment.url)
  }
  getStudents(sortBy = "firstName") {
    this.http.get(environment.url + '/api/students?sortBy=' + sortBy)
      .toPromise()
      .then((res: any) => {
        this.students = res.data;
      })
      .catch(err => {
        console.log(err);
      })
  }
  onSort(event: any) {
    console.log(event);
    if (event === 'dob') {
      this.students = this.students.map((el: any) => {
        let currentDate = new Date();
        let dob = new Date(el.dob);
        if (dob.getTime() < currentDate.getTime()) {
          dob.setFullYear(currentDate.getFullYear() + 1);
        }
        el.dobDiff = dob.getTime() - currentDate.getTime()
        return el;
      })
        .sort((a: any, b: any) => a.dobDiff - b.dobDiff)
    } else
      this.getStudents(event)
  }
  addStudent() {
    console.log('add');
  }
  delete(student: any) {
    if (window.confirm("Remove " + student.firstName + "?")) {
      this.http.delete(environment.url + '/api/students/' + student._id)
        .toPromise()
        .then((res: any) => {
          this.getStudents();
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      return;
    }
  }

  edit(student: any) {
    this.inEditStudent = student;
    this.newStudentForm.get('firstName')?.setValue(student.firstName)
    this.newStudentForm.get('lastName')?.setValue(student.lastName)
    this.newStudentForm.get('dob')?.setValue({
      year: new Date(student.dob).getFullYear(),
      month: new Date(student.dob).getMonth() + 1,
      day: new Date(student.dob).getDate()
    })
    this.newStudentForm.get('percentage')?.setValue(student.percentage)
  }

  open(content: any) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        console.log(`Closed with: ${result}`);
        this.toastr.success('Success!', `Added new student: ${result.data.firstName}`);
        this.getStudents();
        this.inEditStudent = null;
        this.fileUrl = null;
        this.filePath = null;
        this.picData = null;
        this.fileName = null;
      }, (reason) => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
        this.inEditStudent = null;
        this.fileUrl = null;
        this.filePath = null;
        this.picData = null;
        this.fileName = null;
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  onSubmit(modal: any) {
    if (this.inEditStudent) {
      console.log(this.newStudentForm.get('dob')?.value, environment.url + '/api/students')
      this.newStudentForm.get('dob')?.setValue('' + this.newStudentForm.get('dob')?.value?.year + '/' + this.newStudentForm.get('dob')?.value?.month + '/' + this.newStudentForm.get('dob')?.value?.day)
      this.http.put(environment.url + '/api/students/' + this.inEditStudent._id, Object.assign({ avatarPath: this.filePath || this.inEditStudent.avatarPath }, this.newStudentForm.value))
        .toPromise()
        .then((res: any) => {
          console.log(res);
          modal.close({ success: true, data: res });
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      this.newStudentForm.get('dob')?.setValue('' + this.newStudentForm.get('dob')?.value?.year + '/' + this.newStudentForm.get('dob')?.value?.month + '/' + this.newStudentForm.get('dob')?.value?.day)
      this.http.post(environment.url + '/api/students', Object.assign({ avatarPath: this.filePath }, this.newStudentForm.value))
        .toPromise()
        .then((res: any) => {
          console.log(res);
          modal.close({ success: true, data: res });
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
  onFileChange(event: any) {
    const file: File = event.target.files[0];
    this.fileName = file.name;
    this.fileUrl = this.sanitize.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]));
    console.log(this.fileUrl)
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const upload$ = this.http.post(environment.url + "/api/students/profile-pic", formData)
        .toPromise()
        .then((res: any) => {
          console.log(res);
          this.filePath = res.path;
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

}
