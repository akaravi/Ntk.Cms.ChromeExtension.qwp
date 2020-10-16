import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { CmsService } from './cmsService/cms.service';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FileUploadModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,


    
  ],
  bootstrap: [AppComponent],
  providers: [CmsService]
})
export class AppModule {}
