angular.module('ui.gd.checkbox', [])
.directive('mCheckbox', function(inputDirective) {
    inputDirective = inputDirective[0];

    var FULL_CHECK_CSS = 'btn-full-check',
        PART_CHECK_CSS = 'btn-part-check';
    var KEY_CODE_SPACE = 32;

    return {
        restrict: 'E',
        transclude: true,
        replace:true,
        require: '?ngModel',
        scope: {
            partcheck:'@'
        },
        template:
            '<div class="btn-checkbox">' +
                '<div class="btn-icon"></div>' +
            '</div>',
        compile: compile
    };

    function compile(tElement, tAttrs) {
        tAttrs.type = 'checkbox';
        tAttrs.tabIndex = 0;
        tElement.attr('role', tAttrs.type);

        return function postLink(scope, element, attr, ngModelCtrl) {
            var checked = false;

            ngModelCtrl = ngModelCtrl || {
                $setViewValue: function(value) {
                    this.$viewValue = value;
                },
                $parsers:[],
                $formatters:[]
            };

            inputDirective.link(scope, {
              on: angular.noop,
              0: {}
            }, attr, ngModelCtrl);

            element.on('click', listener);
            element.on('keypress', keypressHandler);
            ngModelCtrl.$render = render;

            scope.$watch('partcheck', function(partCheck) {
                element.removeClass(FULL_CHECK_CSS);
                if(partCheck) {
                    element.addClass(PART_CHECK_CSS);
                }
                else {
                    element.removeClass(PART_CHECK_CSS);
                }
            });

            function keypressHandler(ev) {
                if(ev.which === KEY_CODE_SPACE) {
                    ev.preventDefault();
                    listener(ev);
                }
            }

            function listener(ev) {
                if(element[0].hasAttribute('disabled')) return;

                scope.$apply(function() {
                    checked = !checked;
                    ngModelCtrl.$setViewValue(checked, ev && ev.type);
                    ngModelCtrl.$render();
                });
            }

            function render() {
                checked = ngModelCtrl.$viewValue;
                element.removeClass(PART_CHECK_CSS);
                if(checked) {
                    element.addClass(FULL_CHECK_CSS);
                } else {
                    element.removeClass(FULL_CHECK_CSS);
                }
            }
        }
    }
});
