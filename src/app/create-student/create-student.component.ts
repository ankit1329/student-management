import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss']
})
export class CreateStudentComponent implements OnInit {
  fileUrl: any = '';
  filePath: string = '';
  picData: any;
  newStudentForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(20), Validators.pattern("^[a-zA-Z]+$")]],
    lastName: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(20), Validators.pattern("^[a-zA-Z]+$")]],
    dob: ['', [Validators.required]],
    percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
  });
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private sanitize: DomSanitizer) { }

  ngOnInit(): void {
    console.log(this.newStudentForm)
  }
  onSubmit() {
    console.log(this.newStudentForm.get('dob')?.value, environment.url + '/api/students')
    this.newStudentForm.get('dob')?.setValue('' + this.newStudentForm.get('dob')?.value?.year + '/' + this.newStudentForm.get('dob')?.value?.month + '/' + this.newStudentForm.get('dob')?.value?.day)
    console.log(this.newStudentForm.get('dob')?.value);
    this.http.post(environment.url + '/api/students', Object.assign({ avatarPath: this.filePath }, this.newStudentForm.value))
      .toPromise()
      .then((res: any) => {
        console.log(res);
        this.router.navigate(["/"]);
      })
      .catch(err => {
        console.log(err);
      })
  }
  onFileChange(event: any) {
    const file: File = event.target.files[0];
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
  getPic(path: string) {
    this.http.get(environment.url + "/api/students/profile-pic?path=" + path)
      .toPromise()
      .then((res: any) => {
        console.log(res);
        this.picData = res;
      })
      .catch(err => {
        console.log(err);
      })
  }
}


