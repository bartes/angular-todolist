function TabsController(tabPanelBuilder) {
  this._newTab = {};
  this.tabs = [
    { title: 'First tab', content: 'First tab content' },
    { title: 'Second tab', content: 'Second tab content'},
    { title: 'Third tab', content: 'Third tab content'}
  ];

  this.tabPanel = tabPanelBuilder(this.tabs);
}
TabsController.$inject = ['TabPanel'];

TabPanel = function($log, tabs) {
  this.$log = $log;

  this._tabs = tabs;
  this._activeTabIndex = 0;
}
TabPanel.$inject = ['$log'];

TabPanel.prototype = {
  getTabs: function() {
    return this._tabs;
  },
  getActiveTabIndex: function() {
    return this._activeTabIndex;
  },
  getActiveTab: function() {
    return this.tabs[this._activeTabIndex];
  },
  isActiveTab: function(index) {
    return this._activeTabIndex == index;
  },
  setActiveTab: function(index) {
    this._activeTabIndex = index;
  },
  closeTab: function(index) {
    this._tabs.splice(index, 1);
  },
  closeActiveTab: function() {
    this.closeTab(this._activeTabIndex);
  },
  addTab: function(tab) {
    this._tabs.push(tab);
  },
  _cssClassForTab: function(index) {
    if (this.isActiveTab(index)) {
      return 'tab-active';
    } else {
      return 'tab-inactive';
    }
  }
}

angular.service('TabPanel', function() {
  var scope = this;

  return function(tabs) {
    return scope.$new(TabPanel, tabs);
  }
});

angular.widget('@ui:tab', function(tabProperty, element) {
  var compiler = this;
  compiler.descend(true);
  compiler.directives(true);
  compiler.scope(true);

  element.attr('id', tabProperty);
  var template = angular.element('<ng:include />').attr('src', "'/assets/app/templates/tab_panel.html'");
  element.prepend(template);

  return function(element) {
    var scope = this;
    scope.$tabProperty = tabProperty;
    scope.$tabPanel = scope[tabProperty];
  }
});

