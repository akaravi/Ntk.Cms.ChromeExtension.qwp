import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { FlowDirective, Transfer } from "@flowjs/ngx-flow";
import { Subscription } from "rxjs";

@Component({
  selector: "app-upload-file",
  templateUrl: "./upload-file.component.html",
  styleUrls: ["./upload-file.component.scss"],
})
export class UploadFileComponent implements AfterViewInit, OnInit {
  constructor(private cd: ChangeDetectorRef) {}
  @ViewChild("flow", { static: false })
  flow: FlowDirective;
  autoUploadSubscription: Subscription;

  ngOnInit() {
    this.flowOption = {
      target: "http://localhost:2390/api/v1/FileContent/Upload/",
      query: function (flowFile, flowChunk) {
        // if (flowFile.myparams) {
        //   return flowFile.myparams;
        // }
        // generate some values
        console.log("flowFile", flowFile);
        console.log("flowChunk", flowChunk);
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
      // flowChunkNumber: this.offset + 1,
      // flowChunkSize: this.flowObj.opts.chunkSize,
      // flowCurrentChunkSize: this.endByte - this.startByte,
      // flowTotalSize: this.fileObj.size,
      // flowIdentifier: this.fileObj.uniqueIdentifier,
      // flowFilename: this.fileObj.name,
      // flowRelativePath: this.fileObj.relativePath,
      // flowTotalChunks: this.fileObj.chunks.length
    };
  }
  flowOption: flowjs.FlowOptions;
  ngAfterViewInit() {
    this.autoUploadSubscription = this.flow.events$.subscribe((event) => {
      switch (event.type) {
        case "filesSubmitted":
          return this.flow.upload();
        case "newFlowJsInstance":
          this.cd.detectChanges();
      }
    });
  }
  trackTransfer(transfer: Transfer) {
    return transfer.id;
  }

  ngOnDestroy() {
    this.autoUploadSubscription.unsubscribe();
  }
}
