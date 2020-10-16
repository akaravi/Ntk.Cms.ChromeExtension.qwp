import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { FlowDirective, Transfer } from "@flowjs/ngx-flow";
import { Subscription } from "rxjs";
const URL = "http://localhost:2390/api/v1/FileContent/Upload/";
@Component({
  selector: "app-upload-file",
  templateUrl: "./upload-file.component.html",
  styleUrls: ["./upload-file.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent implements AfterViewInit, OnInit {
  constructor(private cd: ChangeDetectorRef) {}
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
        // generate some values

        flowFile.myparams = {
          ChunkNumber: flowChunk.offset + 1,
          ChunkSize: flowChunk.flowObj.opts.chunkSize,
          CurrentChunkSize: flowChunk.endByte - flowChunk.startByte,
          TotalSize: flowChunk.fileObj.size,
          Identifier: flowChunk.fileObj.uniqueIdentifier,
          Filename: flowChunk.fileObj.name,
          RelativePath: flowChunk.fileObj.relativePath,
          TotalChunks: flowChunk.fileObj.chunks.length,
        };
        return flowFile.myparams;
      },
      allowDuplicateUploads: false,
    };
  }

  ngAfterViewInit() {
    this.autoUploadSubscription = this.flow.events$.subscribe((event) => {
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
    console.log("event", event);
    if (event && event.event) {
      console.log("name", event.event[0].name);
      console.log("responce", event.event[1]);
    }
  }
  trackTransfer(transfer: Transfer) {
    return transfer.id;
  }

  ngOnDestroy() {
    this.autoUploadSubscription.unsubscribe();
  }
}
