import { Component, HostBinding, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { comgoAnimations } from '../../animations';
import { comgoConfigService } from '../../services/config.service';
import { comgoNavigationService } from '../navigation/navigation.service';
import { comgoSidebarService } from '../sidebar/sidebar.service';

@Component({
    selector   : 'comgo-theme-options',
    templateUrl: './theme-options.component.html',
    styleUrls  : ['./theme-options.component.scss'],
    animations : comgoAnimations
})
export class comgoThemeOptionsComponent implements OnInit, OnDestroy
{
    comgoConfig: any;
    form: FormGroup;

    @HostBinding('class.bar-closed')
    barClosed: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {comgoConfigService} _comgoConfigService
     * @param {comgoNavigationService} _comgoNavigationService
     * @param {comgoSidebarService} _comgoSidebarService
     * @param {Renderer2} _renderer
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _comgoConfigService: comgoConfigService,
        private _comgoNavigationService: comgoNavigationService,
        private _comgoSidebarService: comgoSidebarService,
        private _renderer: Renderer2
    )
    {
        // Set the defaults
        this.barClosed = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Build the config form
        // noinspection TypeScriptValidateTypes
        this.form = this._formBuilder.group({
            layout          : this._formBuilder.group({
                style    : new FormControl(),
                width    : new FormControl(),
                navbar   : this._formBuilder.group({
                    background: new FormControl(),
                    folded    : new FormControl(),
                    hidden    : new FormControl(),
                    position  : new FormControl(),
                    variant   : new FormControl()
                }),
                toolbar  : this._formBuilder.group({
                    background: new FormControl(),
                    hidden    : new FormControl(),
                    position  : new FormControl()
                }),
                footer   : this._formBuilder.group({
                    background: new FormControl(),
                    hidden    : new FormControl(),
                    position  : new FormControl()
                }),
                sidepanel: this._formBuilder.group({
                    hidden: new FormControl(),
                    position  : new FormControl()
                })
            }),
            customScrollbars: new FormControl()
        });

        // Subscribe to the config changes
        this._comgoConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                // Update the stored config
                this.comgoConfig = config;

                // Set the config form values without emitting an event
                // so that we don't end up with an infinite loop
                this.form.setValue(config, {emitEvent: false});
            });

        // Subscribe to the specific form value changes (layout.style)
        this.form.get('layout.style').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {

                // Reset the form values based on the
                // selected layout style
                this._resetFormValues(value);

            });

        // Subscribe to the form value changes
        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                // Update the config
                this._comgoConfigService.config = config;
            });

        // Add customize nav item that opens the bar programmatically
        const customFunctionNavItem = {
            'id'      : 'custom-function',
            'title'   : 'Custom Function',
            'type'    : 'group',
            'icon'    : 'settings',
            'children': [
                {
                    'id'      : 'customize',
                    'title'   : 'Customize',
                    'type'    : 'item',
                    'icon'    : 'settings',
                    'function': () => {
                        this.toggleSidebarOpen('themeOptionsPanel');
                    }
                }
            ]
        };

        this._comgoNavigationService.addNavigationItem(customFunctionNavItem, 'end');
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Remove the custom function menu
        this._comgoNavigationService.removeNavigationItem('custom-function');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset the form values based on the
     * selected layout style
     *
     * @param value
     * @private
     */
    private _resetFormValues(value): void
    {
        switch ( value )
        {
            // Vertical Layout #1
            case 'vertical-layout-1':
            {
                this.form.patchValue({
                    layout: {
                        width  : 'fullwidth',
                        navbar : {
                            background: 'mat-comgo-dark-700-bg',
                            folded    : false,
                            hidden    : false,
                            position  : 'left',
                            variant   : 'vertical-style-1'
                        },
                        toolbar: {
                            background: 'mat-white-500-bg',
                            hidden    : false,
                            position  : 'below-static'
                        },
                        footer : {
                            background: 'mat-comgo-dark-900-bg',
                            hidden    : false,
                            position  : 'below-static'
                        }
                    }
                });

                break;
            }

            // Vertical Layout #2
            case 'vertical-layout-2':
            {
                this.form.patchValue({
                    layout: {
                        width  : 'fullwidth',
                        navbar : {
                            background: 'mat-comgo-dark-700-bg',
                            folded    : false,
                            hidden    : false,
                            position  : 'left',
                            variant   : 'vertical-style-1'
                        },
                        toolbar: {
                            background: 'mat-white-500-bg',
                            hidden    : false,
                            position  : 'below'
                        },
                        footer : {
                            background: 'mat-comgo-dark-900-bg',
                            hidden    : false,
                            position  : 'below'
                        }
                    }
                });

                break;
            }

            // Vertical Layout #3
            case 'vertical-layout-3':
            {
                this.form.patchValue({
                    layout: {
                        width  : 'fullwidth',
                        navbar : {
                            background: 'mat-comgo-dark-700-bg',
                            folded    : false,
                            hidden    : false,
                            position  : 'left',
                            layout    : 'vertical-style-1'
                        },
                        toolbar: {
                            background: 'mat-white-500-bg',
                            hidden    : false,
                            position  : 'above-static'
                        },
                        footer : {
                            background: 'mat-comgo-dark-900-bg',
                            hidden    : false,
                            position  : 'above-static'
                        }
                    }
                });

                break;
            }

            // Horizontal Layout #1
            case 'horizontal-layout-1':
            {
                this.form.patchValue({
                    layout: {
                        width  : 'fullwidth',
                        navbar : {
                            background: 'mat-comgo-dark-700-bg',
                            folded    : false,
                            hidden    : false,
                            position  : 'top',
                            variant   : 'vertical-style-1'
                        },
                        toolbar: {
                            background: 'mat-white-500-bg',
                            hidden    : false,
                            position  : 'above'
                        },
                        footer : {
                            background: 'mat-comgo-dark-900-bg',
                            hidden    : false,
                            position  : 'above-fixed'
                        }
                    }
                });

                break;
            }
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._comgoSidebarService.getSidebar(key).toggleOpen();
    }

}
