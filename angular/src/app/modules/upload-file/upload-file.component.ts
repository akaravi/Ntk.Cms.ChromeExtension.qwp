import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
} from "@angular/core";
import { FlowDirective, Transfer } from "@flowjs/ngx-flow";
import { Subscription } from "rxjs";
import { ComponentOptionModel } from 'src/app/models/componentOptionModel';
import { environment } from 'src/environments/environment';

const URL = environment.configApiServerPath+"/FileContent/Upload/";
//const URL = "http://localhost:2390/api/v1/FileContent/Upload/";
@Component({
  selector: "app-upload-file",
  templateUrl: "./upload-file.component.html",
  styleUrls: ["./upload-file.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent implements AfterViewInit, OnInit {
  constructor(private cd: ChangeDetectorRef) {}
  @Input()
  set options(model: ComponentOptionModel) {
    this.dateOptionInput = model;  
  }
  get options(): ComponentOptionModel {
    return this.dateOptionInput;
  }
  private dateOptionInput: ComponentOptionModel=new ComponentOptionModel();

  @ViewChild("flow", { static: false })
  flow: FlowDirective;
  autoUploadSubscription: Subscription;
  flowOption: flowjs.FlowOptions;
  uploadViewImage=false;
  ngOnInit() {
    this.flowOption = {
      target: URL,
      query: function (flowFile, flowChunk) {
        if (flowFile.myparams) {
          return flowFile.myparams;
        }
        //console.log(flowChunk.offset)

        // generate some values
        flowFile.myparams = {
          Filename: flowChunk.fileObj.name,
          Identifier: flowChunk.fileObj.uniqueIdentifier,
          TotalChunks: flowChunk.fileObj.chunks.length,
        };
        return flowFile.myparams;
      },
      allowDuplicateUploads: false,
    };
  }

  ngAfterViewInit() {
    this.autoUploadSubscription = this.flow.events$.subscribe((event) => {
      console.log("event",event);
      switch (event.type) {
        case "filesSubmitted":
          return this.flow.upload();
        case "fileSuccess":
          return this.fileSuccess(event);
        case "newFlowJsInstance":
          return this.cd.detectChanges();
      }
    });
  }
  fileSuccess(event: any) {
    if (event && event.event) {
      
      if (this.dateOptionInput && this.dateOptionInput.actions && this.dateOptionInput.actions.onActionSelect) {
        const model={
          fileName:event.event[0].name,
          fileKey:event.event[1]
        }
      

        this.dateOptionInput.actions.onActionSelect(model);
        this.dateOptionInput.dataModel={Select:model};
      }
    }
  }
  trackTransfer(transfer: Transfer) {
    return transfer.id;
  }

  ngOnDestroy() {
    this.autoUploadSubscription.unsubscribe();
  }
}
