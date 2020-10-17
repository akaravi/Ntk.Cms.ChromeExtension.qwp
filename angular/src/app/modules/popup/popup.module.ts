import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PopupComponent } from "./pages/popup/popup.component";
import { PopupRoutingModule } from "./popup-routing.module";
import { FormsModule } from "@angular/forms";
// import { FileUploadModule } from "ng2-file-upload";
import { NgxFlowModule, FlowInjectionToken } from '@flowjs/ngx-flow';
import Flow from '@flowjs/flow.js';
import { UploadFileComponent } from '../upload-file/upload-file.component';


@NgModule({
  declarations: [PopupComponent,UploadFileComponent],
  imports: [CommonModule, PopupRoutingModule, FormsModule,
     //FileUploadModule,
     NgxFlowModule],
  providers: [
    {
      provide: FlowInjectionToken,
      useValue: Flow
    }
  ]
})
export class PopupModule {}
