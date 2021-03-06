
angular.module('app',[  'directive.input.label',
                        'directive.categoryNameAttribute',
                        'directive.date.filter',
                        'directive.transaction.table',
                        'directive.netPosChart',
                        'directive.netCashFlowChart',
                        'directive.balance.sheet',
                        'service.downloadFormService',
                        'service.database',
                        'service.mainAppLinker',
                        'service.CSVWriter',
                        'service.netPosition',
                        'service.netCashFlow',
                        'service.Config',
                        'service.Setup',
                        'service.balanceSheet',
                        'controller.downloadForm',
                        'controller.menuController',
                        'controller.mainChoice',
                        'controller.categoryEdit',
                        'controller.dashBoard',
                        'controller.save',
                        'controller.setup'
                         ]);






