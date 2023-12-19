import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/core/http';
import { CommonService } from 'src/app/core/services/common.service';
import { Injectable } from "@angular/core";
interface IValidationError {
	_fileName: string;
	_fileSize: number;
	_isMatchedExt: boolean;
	_isSizeExceeds: boolean;
}

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
@Injectable()
export class ModalDialogComponent implements OnInit {
  selectedFile:File[] = [];
  listofAllFiles:any[]=[];
  private subscriptions: Subscription[] = [];
  // public dialogRef: MatDialogRef<ModalDialogComponent>;
  constructor(
    private _http: HttpService,
    private _common: CommonService,
    // private dialogRef: MatDialogRef<ModalDialogComponent>,
    public dialogRef: DialogRef<ModalDialogComponent>,

    )
   { }

  fileList
  uploadedFile
  ngOnInit(): void {
  }

  fileUpload(event:File[]) {
   this.selectedFile = event;
   for (const file of  this.selectedFile) {
    let newFile= {
      name:file.name,
      size:file.size
    }
    this.listofAllFiles.push(newFile)
   }

  }

  removeFile(index:number) {
    this.listofAllFiles.splice(index,1)
  }

  fileUploadvalidation(
    event: Event,
    filesize: number,
    filesiseType: 'kb' | 'mb',
    fileTypes: string[]
  ): IValidationError | null {
    filesize = filesize || 1;
    let validationInfo: IValidationError;
    const files = (event.target as HTMLInputElement).files as FileList;
  
    if (files.length > 0) {
      // Getting list of files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const _fileName = file.name; // file name
        const _fileSize = file.size; // file size
        const _fileTypes = fileTypes; // preferred extensions
        const _sizeInMB = file.size / (1024 * 1024);
        const _sizeInKB = file.size / 1024;
  
        const _fileExtension = _fileName
          .split('.')
          [_fileName.split('.').length - 1].toLowerCase(); // file extension
  
        const _isMatchedExt: boolean =
          _fileTypes.indexOf(_fileExtension) > -1;
        const _isSizeExceeds: boolean =
          filesiseType === 'mb'
            ? _sizeInMB > filesize
            : _sizeInKB > filesize;
  
        // OR together the accepted extensions and NOT it. Then OR the size cond.
        if (!_isMatchedExt || _isSizeExceeds) {
          /**
           * !avoid this due to Object Literal Shorthand Syntax
           * ! _fileName: _fileName to _fileName
           * !_fileSize: _fileSize to _fileSize
           * *This rule enforces the use of the shorthand syntax
           */
          return (validationInfo = {
            _fileName,
            _fileSize,
            _isMatchedExt,
            _isSizeExceeds
          });
        } else {
          return null;
        }
      }
      return null;
    } else {
      return null;
    }
  }

  public onUploadFiles(event: Event) {
		console.log(event);

		const validation = this.fileUploadvalidation(event, 16, 'mb', ['xlsx']);

		if (validation !== null) {
			if (validation?._isSizeExceeds) {
				// this._toastr.error(
				// 	'The File is too large. Allowed maximum size is 16MB',
				// 	'Error',
				// 	{
				// 		timeOut: 5000,
				// 		tapToDismiss: false,
				// 		extendedTimeOut: 5000
				// 	}
				// );
        console.log('The File is too large. Allowed maximum size is 16MB')
			} else if (!validation?._isMatchedExt) {
				// this._toastr.error(
				// 	'Only files with the following extensions are allowed:  xlsx.',
				// 	'Error',
				// 	{
				// 		timeOut: 5000,
				// 		tapToDismiss: false,
				// 		extendedTimeOut: 5000
				// 	}
				// );
        console.log('Only files with the following extensions are allowed:  xlsx.')
			}
		} else {
			const files = (event.target as HTMLInputElement).files as FileList;
			this.fileList = files[0] as File;
			if (files.length > 0) {
				const fileName = files[0].name;
				console.log(fileName);

				this.uploadedFile = files[0];
				// this.addExpenseForm.patchValue({
				// 	uploaded_file: fileName
				// });
			}

		}
	}
  public resetFileInput(event: Event) {
		(event.target as HTMLInputElement).value = '';
	}

  submitFile(){
    if(!this.fileList) {
      return
    }
    const param: FormData = new FormData();
    param.append('file', this.fileList);
    this.subscriptions.push(this._http.post('products/xlsUpload',param).subscribe({next: (result) => {
      this.fetchProductList();
     
      
    },error: (err) => {
      console.log(err);
      throw err;
      
    }}))
  }

  fetchProductList() {
    this.subscriptions.push(
      this._http.get("products/getAllProducts").subscribe({
        next: (result) => {
          this._common.setProductList(result.data);
          this.dialogRef.close()
          // this.loaded=true
        },
        error: (err) => {
          console.log(err);
          throw err;
        },
      })
    );
  }

}
