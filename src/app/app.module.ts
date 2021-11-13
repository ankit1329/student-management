import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbAlertModule, NgbButtonsModule, NgbModalModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { CreateStudentComponent } from './create-student/create-student.component';
import { StudentsComponent } from './students/students.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule, AvatarSource } from 'ngx-avatar';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const avatarSourcesOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS];

@NgModule({
  declarations: [
    AppComponent,
    CreateStudentComponent,
    StudentsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbAlertModule,
    NgbButtonsModule,
    NgbTimepickerModule,
    HttpClientModule,
    NgbModalModule,
    AvatarModule.forRoot(
      { sourcePriorityOrder: avatarSourcesOrder }
    ),
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
