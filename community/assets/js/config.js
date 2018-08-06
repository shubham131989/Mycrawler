/* ============================================================
 * File: config.js
 * Configure routing
 * ============================================================ */

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',

        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
            $urlRouterProvider
                .otherwise('/access/login');

            $stateProvider
                .state('app', {
                    abstract: true,
                    url: "/app",
                    templateUrl: "tpl/app.html"
                })
                .state('app.dashboard', {
                    url: "/dashboard",
                    templateUrl: "tpl/dashboard.html",
                    controller: 'DashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'nvd3',
                                    'mapplic',
                                    'rickshaw',
                                    'metrojs',
                                    'sparkline',
                                    'skycons',
                                    'switchery'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/dashboard.js'
                                    ]);
                                });
                        }]
                    }
                })

                .state('app.events', {
                    url: "/events",
                    templateUrl: "tpl/events.html",
                    controller: 'eventCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/eventsUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.addEvent', {
                    url: "/addEvent",
                    templateUrl: "tpl/addEvent.html",
                    controller: 'addEventCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'timepicker',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/addEventUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.eventDetails', {
                    url: "/eventDetails/:eventId",
                    templateUrl: "tpl/eventDetails.html",
                    controller: 'eventDetailsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'timepicker',
                                'dropzone',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/eventDetailsUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.businesses', {
                    url: "/businesses",
                    templateUrl: "tpl/businesses.html",
                    controller: 'businessesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'timepicker',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/businessesUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.offers', {
                    url: "/offers",
                    templateUrl: "tpl/offers.html",
                    controller: 'offerCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'timepicker',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/offersUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.notifications', {
                    url: "/notifications",
                    templateUrl: "tpl/notifications.html",
                    controller: 'notificationCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'timepicker',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/notificationsUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.venues', {
                    url: "/venues",
                    templateUrl: "tpl/venues.html",
                    controller: 'venueCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/venuesUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.committeeMembers', {
                    url: "/committeeMembers",
                    templateUrl: "tpl/committeeMembers.html",
                    controller: 'committeeMembersCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'timepicker',
                                'select',
                                'sortable'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/committeeMembersUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.groupMembers', {
                    url: "/groupMembers",
                    templateUrl: "tpl/groupMembers.html",
                    controller: 'groupMembersCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'timepicker',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/groupMembersUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.addGroupMember', {
                    url: "/addGroupMember",
                    templateUrl: "tpl/addGroupMember.html",
                    controller: 'addGroupMemberCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/addGroupMemberUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.groupMemberDetails', {
                    url: "/groupMemberDetails/:subscriberId",
                    templateUrl: "tpl/groupMemberDetails.html",
                    controller: 'groupMemberDetailsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'timepicker',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/groupMemberDetailsUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                
                .state('app.feedbacks', {
                    url: "/feedbacks",
                    templateUrl: "tpl/feedbacks.html",
                    controller: 'feedbacksCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'dataTables',
                                'ui-grid',
                                'datepicker',
                                'timepicker',
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/feedbacksUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
          
                //Terms and Conditions    
                .state('app.terms', {
                    url: '/terms',
                    templateUrl: 'tpl/terms.html',

                })

                //Privacy Policy
                .state('app.privacy', {
                    url: '/privacy',
                    templateUrl: 'tpl/privacy.html',
                })

                //editProfile
                .state('app.editProfile', {
                    url: '/editProfile',
                    templateUrl: 'tpl/editProfile.html',

                })

                
            .state('app.builder', {
                url: '/builder',
                template: '<div></div>',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'assets/js/controllers/builder.js',
                        ]);
                    }]
                }
            })

            .state('app.layouts', {
                url: '/layouts',
                template: '<div ui-view></div>'
            })
            .state('app.layouts.default', {
                url: '/default',
                templateUrl: 'tpl/layouts_default.html'
            })
            .state('app.layouts.secondary', {
                url: '/secondary',
                templateUrl: 'tpl/layouts_secondary.html'
            })
            .state('app.layouts.horizontal', {
                url: '/horizontal',
                templateUrl: 'tpl/layouts_horizontal.html'
            })
            .state('app.layouts.rtl', {
                url: '/rtl',
                controller: 'RTLCtrl',
                templateUrl: 'tpl/layouts_default.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'assets/js/controllers/rtl.js',
                        ]);
                    }]
                }
            })
            .state('app.layouts.columns', {
                url: '/columns',
                templateUrl: 'tpl/layouts_columns.html'
            })

            // Boxed app
            .state('boxed', {
                url: "/boxed",
                templateUrl: "tpl/app.boxed.html"
            })

            // UI Elements 
            .state('app.ui', {
                    url: '/ui',
                    template: '<div ui-view></div>'
                })
                .state('app.ui.color', {
                    url: '/color',
                    templateUrl: 'tpl/ui_color.html'
                })
                .state('app.ui.typo', {
                    url: '/typo',
                    templateUrl: 'tpl/ui_typo.html'
                })
                .state('app.ui.icons', {
                    url: '/icons',
                    templateUrl: 'tpl/ui_icons.html',
                    controller: 'IconsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'sieve',
                                    'line-icons'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/icons.js'
                                    ])
                                });
                        }]
                    }
                })
                .state('app.ui.buttons', {
                    url: '/buttons',
                    templateUrl: 'tpl/ui_buttons.html'
                })
                .state('app.ui.offers', {
                    url: '/offers',
                    templateUrl: 'tpl/ui_offers.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'assets/js/controllers/offers.js'
                            ]);
                        }]
                    }
                })
                .state('app.ui.modals', {
                    url: '/modals',
                    templateUrl: 'tpl/ui_modals.html',
                    controller: 'ModalsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'assets/js/controllers/modals.js'
                            ]);
                        }]
                    }
                })
                .state('app.ui.progress', {
                    url: '/progress',
                    templateUrl: 'tpl/ui_progress.html'
                })
                .state('app.ui.tabs', {
                    url: '/tabs',
                    templateUrl: 'tpl/ui_tabs.html',
                    resolve: { 
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'tabcollapse'
                            ], {
                                insertBefore: '#lazyload_placeholder'
                            });
                        }]
                    }
                })
                .state('app.ui.sliders', {
                    url: '/sliders',
                    templateUrl: 'tpl/ui_sliders.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'noUiSlider',
                                'ionRangeSlider'
                            ], {
                                insertBefore: '#lazyload_placeholder'
                            });
                        }]
                    }
                })
                .state('app.ui.treeview', {
                    url: '/treeview',
                    templateUrl: 'tpl/ui_treeview.html',
                    controller: 'TreeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'navTree'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('assets/js/controllers/treeview.js');
                                });
                        }]
                    }
                })
                .state('app.ui.nestables', {
                    url: '/nestables',
                    templateUrl: 'tpl/ui_nestable.html',
                    controller: 'NestableCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'nestable'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('assets/js/controllers/nestable.js');
                                });
                        }]
                    }
                })

            // Form elements
            .state('app.forms', {
                    url: '/forms',
                    template: '<div ui-view></div>'
                })
                .state('app.forms.elements', {
                    url: '/elements',
                    templateUrl: 'tpl/forms_elements.html',
                    controller: 'FormElemCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'switchery',
                                    'select',
                                    'moment',
                                    'datepicker',
                                    'daterangepicker',
                                    'timepicker',
                                    'inputMask',
                                    'autonumeric',
                                    'wysihtml5',
                                    'summernote',
                                    'tagsInput',
                                    'dropzone',
                                    'typehead'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('assets/js/controllers/forms_elements.js');
                                });
                        }]
                    }
                })
                .state('app.forms.layouts', {
                    url: '/layouts',
                    templateUrl: 'tpl/forms_layouts.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'datepicker',
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('assets/js/controllers/forms_layouts.js');
                                });
                        }]
                    }
                })
                .state('app.forms.wizard', {
                    url: '/wizard',
                    templateUrl: 'tpl/forms_wizard.html',
                    controller: 'FormWizardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'wizard'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('assets/js/controllers/forms_wizard.js');
                                });
                        }]
                    }
                })

            // Portlets
            .state('app.portlets', {
                url: '/portlets',
                templateUrl: 'tpl/portlets.html',
                controller: 'PortletCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'assets/js/controllers/portlets.js'
                        ]);
                    }]
                }
            })

            // Views
            .state('app.views', {
                url: '/views',
                templateUrl: 'tpl/views.html'
            })

            // Tables
            .state('app.tables', {
                    url: '/tables',
                    template: '<div ui-view></div>'
                })
                .state('app.tables.basic', {
                    url: '/basic',
                    templateUrl: 'tpl/tables_basic.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'dataTables'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('assets/js/controllers/tables.js');
                                });
                        }]
                    }
                })
                .state('app.tables.dataTables', {
                    url: '/dataTables',
                    templateUrl: 'tpl/tables_dataTables.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'dataTables',
                                    'ui-grid' 
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('assets/js/controllers/dataTables.js');
                                });
                        }]
                    }
                })

            // Maps
            .state('app.maps', {
                    url: '/maps',
                    template: '<div class="full-height full-width" ui-view></div>'
                })
                .state('app.maps.google', {
                    url: '/google',
                    templateUrl: 'tpl/maps_google_map.html',
                    controller: 'GoogleMapCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'google-map'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('assets/js/controllers/google_map.js')
                                        .then(function() {
                                            return loadGoogleMaps();
                                        });
                                });
                        }]
                    }
                })
                .state('app.maps.vector', {
                    url: '/vector',
                    templateUrl: 'tpl/maps_vector_map.html',
                    controller: 'VectorMapCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'mapplic',
                                    'select'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('assets/js/controllers/vector_map.js');
                                });
                        }]
                    }
                })

            // Charts
            .state('app.charts', {
                url: '/charts',
                templateUrl: 'tpl/charts.html',
                controller: 'ChartsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                                'nvd3',
                                'rickshaw',
                                'sparkline'
                            ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                            .then(function() {
                                return $ocLazyLoad.load('assets/js/controllers/charts.js');
                            });
                    }]
                }
            })

            // Extras
            .state('app.extra', {
                    url: '/extra',
                    template: '<div ui-view></div>'
                })
                .state('app.extra.invoice', {
                    url: '/invoice',
                    templateUrl: 'tpl/extra_invoice.html'
                })
                .state('app.extra.blank', {
                    url: '/blank',
                    templateUrl: 'tpl/extra_blank.html'
                })
                .state('app.extra.gallery', {
                    url: '/gallery',
                    templateUrl: 'tpl/extra_gallery.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'isotope',
                                    'codropsDialogFx',
                                    'metrojs',
                                    'owlCarousel',
                                    'noUiSlider'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('assets/js/controllers/gallery.js');
                                });
                        }]
                    }
                })
                .state('app.extra.timeline', {
                    url: '/timeline',
                    templateUrl: 'tpl/extra_timeline.html'
                })

            // Extra - Others
            .state('access', {
                    url: '/access',
                    template: '<div class="full-height" ui-view></div>'
                })
                .state('access.404', {
                    url: '/404',
                    templateUrl: 'tpl/extra_404.html'
                })
                .state('access.500', {
                    url: '/500',
                    templateUrl: 'tpl/extra_500.html'
                })

                .state('access.login', {
                    url: '/login',
                    templateUrl: 'tpl/extra_login.html',
                    controller: 'loginCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function () {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/loginUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('access.register', {
                    url: '/register/:partner',
                    templateUrl: 'tpl/extra_register.html',
                    controller: 'registerCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'select'
                        ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function () {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/registerUiController.js'
                                    ]);
                                });
                        }]
                    }
                })
        }
    ]);