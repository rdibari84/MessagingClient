import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, catchError, map } from 'rxjs/operators';
import { ApiService } from '../service/api.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    error = false;
    errorMessage: string;
    loginForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService
    ) {
        // redirect to home if already logged in
        if (sessionStorage.getItem('username')) {
            this.router.navigate(['/home']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
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
                    this.router.navigate(['/home']);
                },
                error => {
                    console.log('error', error);
                    this.error = true;
                    this.errorMessage = 'Error logging in. Please Try Again';
                    console.log('navigating');
                    this.router.navigate(['/']);
                });
    }

    hasError(): boolean {
        return this.error;
    }
}


