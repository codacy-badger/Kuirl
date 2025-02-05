import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { User, UsersService } from '@knora/core';
import { CacheService } from '../../main/cache/cache.service';
import { DialogComponent } from '../../main/dialog/dialog.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    loading: boolean;
    error: boolean;
    errorMessage: any;

    @Input() username: string;

    @Input() loggedInUser?: boolean = false;

    @Output() refreshParent: EventEmitter<any> = new EventEmitter<any>();

    sysAdmin: boolean = false;

    user: User;

    constructor (private _cache: CacheService,
        private _dialog: MatDialog,
        private _usersService: UsersService,
        private _titleService: Title) {

        // get info about the logged-in user: does he have the right to change user's profile?
        if (localStorage.getItem('session') && !this.loggedInUser) {
            this.sysAdmin = JSON.parse(localStorage.getItem('session')).user.sysAdmin;
        }

    }

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        this.loading = true;

        // set the cache
        this._cache.get(this.username, this._usersService.getUserByUsername(this.username));

        this._cache.get(this.username, this._usersService.getUserByUsername(this.username)).subscribe(
            (response: any) => {
                this.user = response;

                // set the page title
                this._titleService.setTitle(this.user.username + ' (' + this.user.givenName + ' ' + this.user.familyName + ')');

                this.loading = false;
            },
            (error: any) => {
                console.error(error);
                this.errorMessage = error;
                this.loading = false;
            }
        );
    }

    openDialog(mode: string, name: string): void {
        const dialogConfig: MatDialogConfig = {
            width: '560px',
            position: {
                top: '112px'
            },
            data: { name: name, mode: mode }
        };

        const dialogRef = this._dialog.open(DialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            // update the view
            this.getUser();
        });
    }

}
