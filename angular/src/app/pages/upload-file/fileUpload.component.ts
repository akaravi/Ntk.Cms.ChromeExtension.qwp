import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
} from '@angular/core';
import { FlowDirective, Transfer } from '@flowjs/ngx-flow';
import { Subscription } from 'rxjs';
import { ComponentOptionModel } from 'src/app/models/componentOptionModel';

import { environment } from 'src/environments/environment';

const URL = environment.cmsServerConfig.configRouteUploadFileContent;
@Component({
  selector: 'app-file-upload',
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./fileUpload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements AfterViewInit, OnInit , OnDestroy {
  constructor(private cd: ChangeDetectorRef) { }
  @Input()
  set options(model: ComponentOptionModel) {
    this.dateOptionInput = model;
  }
  get options(): ComponentOptionModel {
    return this.dateOptionInput;
  }
  private dateOptionInput: ComponentOptionModel = new ComponentOptionModel();

  @ViewChild('flow', { static: false })
  flow: FlowDirective;
  autoUploadSubscription: Subscription;
  flowOption: flowjs.FlowOptions;
  uploadViewImage = false;
  ngOnInit(): void {
    this.flowOption = {
      target: URL,
      // tslint:disable-next-line: typedef
      query(flowFile, flowChunk) {
        if (flowFile.myparams) {
          return flowFile.myparams;
        }
        // console.log(flowChunk.offset)

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

  ngAfterViewInit(): void {
    this.autoUploadSubscription = this.flow.events$.subscribe((event) => {
      switch (event.type) {
        case 'filesSubmitted':
          return this.flow.upload();
        case 'fileSuccess':
          return this.fileSuccess(event);
        case 'newFlowJsInstance':
          return this.cd.detectChanges();
      }
    });
  }
  fileSuccess(event: any): void {
    if (event && event.event) {
      if (
        this.dateOptionInput &&
        this.dateOptionInput.actions &&
        this.dateOptionInput.actions.onActionSelect
      ) {
        const model = {
          fileName: event.event[0].name,
          fileKey: event.event[1],
        };

        this.dateOptionInput.actions.onActionSelect(model);
        this.dateOptionInput.data = { Select: model };
      }
    }
  }
  trackTransfer(transfer: Transfer): string {
    return transfer.id;
  }

  ngOnDestroy(): void {
    this.autoUploadSubscription.unsubscribe();
  }
}
