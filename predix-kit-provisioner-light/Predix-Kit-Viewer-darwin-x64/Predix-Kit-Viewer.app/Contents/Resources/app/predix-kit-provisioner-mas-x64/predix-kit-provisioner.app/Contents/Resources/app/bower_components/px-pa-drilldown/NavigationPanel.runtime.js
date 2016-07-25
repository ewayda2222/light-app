/* globals TW, $*/
TW.Runtime.Widgets.NavigationPanel_geCoreUx = function () {
	'use strict';

	var $ctl;
	var me = this;

	var widgetJqElement;

	// Control variables
	this.infotable = null;
	var selectedOnCurrentLevel = false;

	var firstAsset;

	var breadcrumbStack = [];

	this.runtimeProperties = function () {
		return {
			'needsError': true,
			'propertyAttributes': {
				'Data': {
					'isLocalizable': false
				},
				'Selected': {
					'isLocalizable': false
				},
				'Breadcrumb': {
					'isLocalizable': false
				}
			}
		};
	};

	var adjustForScrollbar = function() {
		$('.dd-wrapper .dd-menu', $ctl).first().each(function() {
			if (this.scrollHeight > this.clientHeight) {
				$(this).addClass('dd-menu-scroll');
			} else {
				$(this).removeClass('dd-menu-scroll');
			}
		});
	};

	this.renderHtml = function () {
		return '<div class="wrap"><div id="' + this.jqElementId + '" class="demo-container"></div></div>';
	};

	this.updateProperty = function (updatePropertyInfo) {
		var domElementId = this.jqElementId;
		var widgetProperties = this.properties;
		var widgetReference = this;

		if (updatePropertyInfo.TargetProperty === "Data") {
			widgetReference.lastData = updatePropertyInfo;

			this.infotable = updatePropertyInfo;

			var rows = updatePropertyInfo.ActualDataRows;

			// rows will come back undefined if there is an error calling GetNetworkConnections
			if (rows) {
				$ctl = this.jqElement;
				$ctl.empty();
				$ctl.append('<ul id="' + domElementId + '-list"></ul>');
				var list = $('#' + domElementId + '-list', $ctl);

				var IDFieldName = widgetProperties.IDField;
				var parentFieldName = widgetProperties.ParentIDField;
				var labelFieldName = widgetProperties.LabelField;
				var rootParentID = widgetProperties.RootParentID;
				if (rootParentID === undefined) {
					rootParentID = '';
				}

				widgetReference.loadChildren(list, rootParentID, parentFieldName, IDFieldName, labelFieldName, rootParentID, rows);

				widgetReference.createControl();
			} else {
				widgetJqElement.find('.dd-header .dd-header-span').text('No assets provisioned');
				// Remove the data-error element to get rid of red loading bar, and stop close action when clicking on the nav panel
				var dataErrorInterval = setInterval(function() {
					var element = $('#' + me.jqElementId + '-data-error');
					if (element) {
						element.remove();
						clearInterval(dataErrorInterval);
					}
				}, 100);
			}
		}
	};

	this.loadChildren = function (list, rootParentID, parentFieldName, IDFieldName, labelFieldName, requiredParentID, rows) {
		var len = rows.length;

		for (var rowId = 0; rowId < len; rowId++) {
			var row = rows[rowId];
			var parentID = row[parentFieldName];

			if (parentID === requiredParentID) {
				var childID = row[IDFieldName];
				var label = row[labelFieldName];
				var appendObj = list;
				var newNode;

				if (list.is('li')) {
					if (list.children("ul").first().is("ul")) {
						appendObj = list.children("ul").first();
					}
					else {
						appendObj = $("<ul></ul>").appendTo(list);
					}
				}
				var nodeId = childID.replace(/\s/g, '');
				newNode = $("<li></li>").html('<div class="drilldownitem" id="' + nodeId + '" data-key="'+childID+'"><li>' + label + '</li></div>');
				
				if (this.firstChild === undefined) {
					this.firstChild = childID;
					// check if breadcrumb is empty
					var currentBreadcrumb = me.getProperty('Breadcrumb');
					if((currentBreadcrumb === undefined ) || (currentBreadcrumb === '')) {
						setContext(label);
						me.setProperty("SelectedItem", label);
						me.setProperty("SelectedItemId", childID);
					}
					firstAsset = nodeId;
				}

				newNode.appendTo(appendObj);
				
				this.loadChildren(newNode, rootParentID, parentFieldName, IDFieldName, labelFieldName, childID, rows);
			}
		}
	};

	this.beforeDestroy = function () {
		var widgetElement = this.jqElement;

		try {
			widgetElement.unbind();
		}
		catch (destroyErr) {
		}
	};

	this.afterRender = function () {
		widgetJqElement = me.jqElement;

		var parentLeftSidebar = widgetJqElement.closest('.layout-horiz-fixed-left');
		if (parentLeftSidebar && parentLeftSidebar.length === 1) {
			// Hide the parent left sidebar to stop the sidebar collapse animation on page load
			parentLeftSidebar.css("visibility", "hidden");

			// Make parent sidebar visible again after initial collapse animation is complete
			setTimeout(function () {
				parentLeftSidebar.css("visibility", "visible");
			}, 500);
		}

		$ctl = widgetJqElement;
		$ctl.empty();
		$ctl.append('<ul id="' + me.jqElementId + '-list"></ul>');

		me.createControl();
	};

	var setContext = function(assetLabel) {
		var path = '';
		_(breadcrumbStack).forEach(function(item) {
			path += item.name + ' > ';
		});
		path += assetLabel;
		me.setProperty("Breadcrumb", path);
		widgetJqElement.triggerHandler("ContextSet");
		widgetJqElement.triggerHandler("SelectedItemChanged");

		// remove context special active state
		$('.nav a.special-active').removeClass("special-active");
	};

	var popBreadcrumb = function () {
		var breadcrumb = breadcrumbStack.pop();
		adjustForScrollbar();
		return breadcrumb;
	};

	var pushBreadcrumb = function (name, id) {
		breadcrumbStack.push({name: name, id: id});
		adjustForScrollbar();
	};

	var contextClickHandler = function() {
		$('.drilldownitem > li').click(function() {
			var text = $(this).text();
			var parent = $(this).parent();
			var id = parent[0].id;
			if (text !== '') {
				setContext(text);
				me.setProperty("SelectedItem", text);
				me.setProperty("SelectedItemId", id);
			}
		});
	};

	this.createControl = function () {
		var $ctlList = $('#' + this.jqElementId + '-list', $ctl);

		contextClickHandler();

		var $selectedElements = null;
		var unselectAll = function () {
			if ($selectedElements !== null) {
				$selectedElements.removeClass('selected');
			}
		};

		var selectElementsOf = function (selector) {
			unselectAll();
			$selectedElements = $(selector).children();
			$selectedElements.addClass('selected');
		};

		$ctlList.dcDrilldown(
			{
				showCount: false,
				showHeader: false,
				speed: 'slow',
				saveState: false,
				linkType: 'backButton',
				includeHdr: false
			});

		selectElementsOf('#' + firstAsset + '.drilldownitem', $ctl);

		// hover effect where the icon changes
		$('.drilldownitem').on("mouseover touchstart", function() {
			$(this).find('.btn .geip-icon-ico_lite-arrow-next_sm').toggleClass("geip-icon-ico_lite-arrow-next_sm").toggleClass("icon-ico_chevron_right_sm");
			$(this).find('.btn .geip-icon-ico_lite-arrow-prev_sm').toggleClass("geip-icon-ico_lite-arrow-prev_sm").toggleClass("icon-ico_chevron_left_sm");
		}).on("mouseout touchend", function() {
			$(this).find('.btn .icon-ico_chevron_right_sm').toggleClass("geip-icon-ico_lite-arrow-next_sm").toggleClass("icon-ico_chevron_right_sm");
			$(this).find('.btn .icon-ico_chevron_left_sm').toggleClass("geip-icon-ico_lite-arrow-prev_sm").toggleClass("icon-ico_chevron_left_sm");
		});

		$('.drilldownitem > li', $ctl).click(function (event) {
			var node = event.currentTarget.parentNode;

			contextClickHandler();
			selectElementsOf('#' + node.id + '.drilldownitem', $ctl);
		});

		var mseDownNavButton = false;

		$('.drilldownitem.dd-parent-a > .btn.btn-navigate', $ctl)
			.click(function (event) {
				var itemName = event.currentTarget.parentElement.innerText;
				if (selectedOnCurrentLevel) {
					popBreadcrumb();
				}
				selectedOnCurrentLevel = false;
				pushBreadcrumb(itemName, event.currentTarget.parentElement.id);
				mseDownNavButton = false;
			})
			.mouseenter(function () {
				$(this).siblings('li').addClass('hovering');
				if (mseDownNavButton) {
					$(this).addClass('activated');
					$(this).siblings('li').addClass('activated');
				}
			}).mouseleave(function () {
			$(this).siblings('li').removeClass('hovering');
			if (mseDownNavButton) {
				$(this).removeClass('activated');
				$(this).siblings('li').removeClass('activated');
				mseDownNavButton = false;
			}
		}).mousedown(function () {
			$(this).addClass('activated');
			$(this).siblings('li').addClass('activated');
			mseDownNavButton = true;
		}).mouseup(function () {
			$(this).removeClass('activated');
			$(this).siblings('li').removeClass('activated');
			mseDownNavButton = false;
		});

		$('.btn.btn-navigate-back', $ctl).click(function () {
			window.setTimeout(popBreadcrumb, 200);
		});

		$('.drilldownitem li', $ctl)
			.mouseenter(function () {
				var element = $(this);

				if ((this.offsetWidth < this.scrollWidth) && !element.attr('title')) {
					element.attr('title', element.text());
				}
				contextClickHandler();
			});

		// listener for closing the context selector if it's open and you click outside of it
		$(document).on("mouseup touchend", function (e)
		{
			var container = $('#' + me.jqElementId);
			var container2 = $('.nav.nav-list li');

			if ((!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) && (!container2.is(e.target) && container2.has(e.target).length === 0)) // ... nor a descendant of the container
			{
				widgetJqElement.triggerHandler("ClickedOutsideContextSelector");
				$('.nav a.special-active').removeClass("special-active");
			}
		});
	};
	$(window).resize(function() {
		adjustForScrollbar();
	});

	$(document).ready(function() {
		adjustForScrollbar();
	});
};