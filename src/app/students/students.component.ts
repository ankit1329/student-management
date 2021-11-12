import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  students: any = [];
  host: string = environment.url;

  constructor(private http: HttpClient, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.getStudents();
    console.log(environment.url)
  }
  getStudents(sortBy="firstName") {
    this.http.get(environment.url + '/api/students?sortBy='+ sortBy)
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

}
