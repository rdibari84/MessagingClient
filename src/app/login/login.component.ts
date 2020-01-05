import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, catchError, map } from 'rxjs/operators';
import { ApiService } from '../service/api.service';
import { AlertService } from '../service/alert.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    navigationSubscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (sessionStorage.getItem('username')) {
            this.router.navigate(['/home']);
        }

        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.navigationSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
            }
        });
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnDestroy() {
        this.navigationSubscription.unsubscribe();
    }

    // convenience getter for easy access to form fields
    get formInputs() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.apiService.login(this.formInputs.username.value, this.formInputs.password.value)
            .pipe()
            .subscribe(
                data => {
                    sessionStorage.setItem('username', this.formInputs.username.value);
                    this.apiService.register(this.formInputs.username.value);
                    this.router.navigate(['/home']);
                },
                error => {
                    this.alertService.error('Username or password is incorrect', true);
                    this.router.navigate(['/login']);
                });
    }
}


