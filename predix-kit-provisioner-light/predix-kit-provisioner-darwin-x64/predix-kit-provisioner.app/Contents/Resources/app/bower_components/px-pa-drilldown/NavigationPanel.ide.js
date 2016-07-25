/* jshint strict:false */
/* globals TW */
TW.IDE.Widgets.NavigationPanel_geCoreUx = function () {
    var thisWidget = this;

    this.widgetProperties = function () {
        return {
            'name': 'Navigation Panel (GE)',
            'description': 'Displays a Navigation Panel',
            'category': ['Common'],
            'supportsAutoResize': true,
            'defaultBindingTargetProperty': 'Data',
			'iconImage': this.widgetIconUrl(),
            'properties': {
				'BorderStyle': {
                    'baseType': 'STYLEDEFINITION',
					'defaultValue': 'DefaultImageBorderStyle'
                },
                'Data': {
                    'description' : 'source of hierarchical data',
                    'baseType': 'INFOTABLE',
                    'isBindingTarget' :true,
                    'warnIfNotBoundAsTarget': true
                },
                'LabelField': {
                    'description': 'Field to use for panel item display names',
                    'baseType': 'FIELDNAME',
                    'sourcePropertyName': 'Data'
                },
                'IDField': {
                    'description': 'Field that uniquely identifies a panel item',
                    'baseType': 'FIELDNAME',
                    'sourcePropertyName': 'Data'
                },
                'ParentIDField': {
                    'description': 'Field that uniquely identifies the parent of a panel item',
                    'baseType': 'FIELDNAME',
                    'sourcePropertyName': 'Data'
                },
                'SelectedItem': {
                    'baseType': 'STRING',
                    'isBindingSource' :true,
                    'warnIfNotBoundAsSource': true
                },
                'SelectedItemId': {
                    'baseType': 'STRING',
                    'isBindingSource' :true,
                    'warnIfNotBoundAsSource': true
                },
                'Breadcrumb': {
                    'baseType': 'STRING',
                    'isBindingSource' :true,
                    'warnIfNotBoundAsSource': true
                }
            }
        };
    };
    this.widgetEvents = function(){
        return{
            'SelectedItemChanged':{
	            'description' : 'Fired when an item is selected.'
            },
            'ContextSet':{
                'description' : 'Fired when context is set.'
            },
            'ClickedOutsideContextSelector':{
                'description' : 'Fired when you click outside of the expanded context selector.'
            }
        };
    };
	this.widgetServices = function(){
		return{
		};
	};

	this.widgetIconUrl = function() {
        return "../Common/extensions/GECoreUX/ui/NavigationPanelWidget_geCoreUx/images/icon.png";
    };
	
    this.renderHtml = function () {
        var html = '<div><img class="widget-icon" src="'+ this.widgetIconUrl() + '"/>Navigation Panel (GE)</div><div class="widget-content widget-navigation-panel-helper"></div>';
        return html;
    };
    this.afterSetProperty = function (name, value) {
		var result = false;
	    switch (name) {
	        default:
				result = true;
	            break;
	    }
	    return result;
    };
	
	this.afterRender = function () {
		var thisWidget = this;
		var imageStyle = TW.getStyleFromStyleDefinition(thisWidget.getProperty('BorderStyle'));
		var imageBorder = TW.getStyleCssBorderFromStyle(imageStyle);
	
        var resource = TW.IDE.getMashupResource();
        var widgetStyles =
            '#' + thisWidget.jqElementId + ' {'+ imageBorder +'} ';
        resource.styles.append(widgetStyles);
	};
	
    this.validate = function () {
        var result = [];
        var dataProperty = this.getProperty('Data');
        var assetEntityMapProperty = this.getProperty('AssetEntityMap');


        if (dataProperty === '' || dataProperty === undefined) {
            if (!this.isPropertyBoundAsTarget('Data')) {
                result.push({ severity: 'warning', message: 'Data is not configured or bound for {target-id}' });
            }
        }

        if (assetEntityMapProperty === '' || assetEntityMapProperty === undefined) {
            if (!this.isPropertyBoundAsTarget('AssetEntityMap')) {
                result.push({ severity: 'warning', message: 'Asset entity map is not configured or bound for {target-id'});
            }
        }

        return result;
    };

    this.beforeDestroy = function () {
        thisWidget = null;
    };
};