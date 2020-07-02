import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { element } from 'protractor';
import Swal from 'sweetalert2';
import { timer } from 'rxjs';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  panelOpenState = false;
  notepad = "";
  tag: string;
  localStorageData: any;
  noteTitles: any;
  selectedTitle: number;
  newNote = true;
  currentTime = new Date;
  searchtext: string;

  grid = false;

  expandingCondition = true;
  notepadclass = 'col-md-8 col-lg-8 col-sm-8';
  expandClass = 'col-md-3 col-lg-3 col-sm-3';
  expand = true;
  searchstring = false;

  constructor(
    private storage: StorageService
  ) {
  }

  async ngOnInit() {
    await this.storage.getnotedata().then(res => {
      if (res == null) {
        this.localStorageData = [];
      }
      else {
        this.localStorageData = JSON.parse(res);
      }
    })
    this.noteTitles = this.localStorageData;
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  addnote() {
    this.grid = false;
    this.newNote = true;
    this.notepad = ""; this.tag = "";
  }

  savenote() {
    let data = {
      time: this.currentTime,
      content: this.notepad,
      tag: this.tag
    }
    if (this.newNote == false && this.notepad.trim() != "") {
      this.noteTitles[this.selectedTitle] = data;
      Swal.fire("Note is updated");
    }
    else if (this.notepad.trim() != "") {
      this.noteTitles.push(data);
      Swal.fire("New Note is created");
    } else if (this.grid == true) {
      Swal.fire("Please select a Note to Edit");
    }

    else {
      Swal.fire("Please give some data to save");
      return;
    }
    this.storage.storenotedata(this.noteTitles).then(res => {
      console.log(res);
    })
    this.notepad = ""; this.tag = "";
    this.localStorageData = this.noteTitles;
    this.selectedTitle = null;
    this.newNote = true;

  }
  slectedTitle(value) {
    console.log(value);
    this.grid = false;
    this.selectedTitle = value;
    this.notepad = this.noteTitles[value].content;
    this.tag = this.noteTitles[value].tag;
    this.newNote = false;
  }
  deletenote() {
    if (this.selectedTitle == null) {
      Swal.fire('Please select a Note to delete')
    } else {
      this.noteTitles = this.noteTitles.filter(map => map != this.noteTitles[this.selectedTitle]);
      this.storage.storenotedata(this.noteTitles).then(res => {
        console.log(res);
      })
      this.localStorageData = this.noteTitles;
      this.notepad = "";
      this.tag = "";
      this.selectedTitle = null;
      this.newNote = false;
    }
  }

  areaselected() {
    if (this.notepad.trim() === "") {
      this.newNote = true
    }
  }

  search(value) {
    console.log(this.localStorageData);
    console.log(this.localStorageData.includes(value));

    if (value.trim() == "") {
      this.noteTitles = this.localStorageData;
    } else {
      this.noteTitles = [];
      this.localStorageData.forEach(element => {
        console.log(element.content)
        if (element.content.includes(value) || (element.tag != undefined && element.tag.includes(value))) {
          this.noteTitles.push(element);
        }
      })
      this.noteTitles.includes(this.searchtext);
      console.log(this.noteTitles);
    }
  }
  async addTag() {
    const { value: text } = await Swal.fire({
      input: 'text',
      inputPlaceholder: this.tag,
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true
    })
    if (text) {
      this.tag = text.toString();
    }
  }

  gridview() {
    this.grid = true;
    this.newNote = false;
  }
  listview() {
    this.grid = false;
  }

  expandClose() {
    this.expandingCondition = !this.expandingCondition;
    if (this.expandingCondition == true) {
      this.notepadclass = 'col-md-8 col-lg-8 col-sm-8';
      this.expandClass = 'col-lg-3 col-md-3 col-sm-3';
      timer(500).subscribe(res => {
        this.expand = this.expandingCondition;
      })

    }
    else {
      this.expand = this.expandingCondition;
      timer(500).subscribe(res => {
        this.notepadclass = "col-md-12 col-lg-12 col-sm-12";
        this.expandClass = 'none';
      })

    }
  }

  searchcondition() {
    this.searchstring = !this.searchstring;
    this.searchtext = "";
    this.search("")
  }

}
