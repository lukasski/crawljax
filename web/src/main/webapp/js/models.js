//Application Models
App.Link = Ember.Object.extend({ text: null, icon: null, target: null, action: false });
    
App.browsers = [
         Ember.Object.create({name: "Mozilla Firefox", value:"firefox"}),
         Ember.Object.create({name: "Google Chrome", value:"chrome"}),
         Ember.Object.create({name: "Microsoft Internet Explorer", value:"ie"})
	];

App.clickRules = [
         Ember.Object.create({name: "Click Default Elements", value:"Default"}),
         Ember.Object.create({name: "Click More Elements", value:"More"}),
         Ember.Object.create({name: "Custom Rules", value:"Custom"})
    ];
    
App.clickType = [Ember.Object.create({name: "Click", value:"click"}),
                     Ember.Object.create({name: "Don't Click", value:"noClick"})];
    
App.tags = ["a", "abbr", "address", "area", "article", "aside", "audio",
                "button", "canvas", "details", "div", "figure", "footer",
                "form", "header", "img", "input", "label", "li", "nav", "ol", 
                "section", "select", "span", "summary", "table", "td", "textarea", 
                "th", "tr", "ul", "video" ];
    
App.clickConditions = [
        Ember.Object.create({name: "With Attribute (name=value):", value:"wAttribute"}),
        Ember.Object.create({name: "With Text:", value:"wText"}),
        Ember.Object.create({name: "With XPath:", value:"wXPath"}),
        Ember.Object.create({name: "When URL contains:", value:"url"}),
        Ember.Object.create({name: "When URL does not contain:", value:"notUrl"}),
        Ember.Object.create({name: "When Regex:", value:"regex"}),
        Ember.Object.create({name: "When not Regex:", value:"notRegex"}),
        Ember.Object.create({name: "When XPath:", value:"xPath"}),
        Ember.Object.create({name: "When not XPath:", value:"notXPath"}),
        Ember.Object.create({name: "When element with id is visible:", value:"visible"}),
        Ember.Object.create({name: "When element with id is not visible:", value:"notVisible"}),
        Ember.Object.create({name: "When Javascript is true:", value:"javascript"})
    ];
    
App.pageConditions = [
         Ember.Object.create({name: "When URL contains:", value:"url"}),
         Ember.Object.create({name: "When URL does not contain:", value:"notUrl"}),
         Ember.Object.create({name: "When Regex:", value:"regex"}),
         Ember.Object.create({name: "When not Regex:", value:"notRegex"}),
         Ember.Object.create({name: "When XPath:", value:"xPath"}),
         Ember.Object.create({name: "When not XPath:", value:"notXPath"}),
         Ember.Object.create({name: "When element with id is visible:", value:"visible"}),
         Ember.Object.create({name: "When element with id is not visible:", value:"notVisible"}),
         Ember.Object.create({name: "When Javascript is true:", value:"javascript"})
    ];
    
App.comparators = [
         Ember.Object.create({name: "Ignore Attribute:", value:"attribute"}),
         Ember.Object.create({name: "Ignore White Space", value:"simple"}),
         Ember.Object.create({name: "Ignore Dates", value:"date"}),
         Ember.Object.create({name: "Ignore Scripts", value:"script"}),
         Ember.Object.create({name: "Only observe plain DOM structure", value:"plain"}),
         Ember.Object.create({name: "Ignore Regex:", value:"regex"}),
         Ember.Object.create({name: "Ignore XPath:", value:"xPath"}),
         Ember.Object.create({name: "Ignore within Distance Edit Threshold:", value:"distance"})
    ];

//Configuration Model
App.Config = Ember.Object.extend();
App.Config.reopenClass({
    	isSaving: false,
    	findAll: function(){
    		var allConfigs = [];
    	    $.ajax({
    	      url: '/rest/configurations',
    	      dataType: 'json',
    	      context: allConfigs,
    	      success: function(response){
    	        response.forEach(function(config){
    	          this.addObject(App.Config.create(config))
    	        }, this);
    	      }
    	    });
    	    return allConfigs;
    	 },
    	 find: function(id){
    		 var config = App.Config.create({id: id });
    		 $.ajax({
    			 url: '/rest/configurations/' + id,
    			 dataType: 'json',
    			 context: config,
    			 success: function(response){ this.setProperties(response); }
    		 });
    		 return config;
    	 },
    	 newConfig: function()
    	 {
    		 var config = App.Config.create({});
    		 $.ajax({
    			 url: '/rest/configurations/new',
    			 dataType: 'json',
    			 context: config,
    			 success: function(response){ this.setProperties(response); }
    		 });
    		 return config;
    	 },
    	 add: function(config, callback)
    	 {
    		 if (!this.isSaving) {
    			 this.isSaving = true;
    			 $.ajax({
    				 url: '/rest/configurations',
    				 type: 'POST',
    				 contentType: "application/json;",
    				 data: JSON.stringify(config),
    				 dataType: 'json',
    				 context: this,
    				 success: function(response){ 
    					 config.setProperties(response);
    					 this.isSaving = false;
    					 if (callback !== undefined) callback(config);
    			 	}
    			 });
    		 }
    		 return config;
    	 },
    	 update: function(config)
    	 {
    		 if (!this.isSaving) {
    			 this.isSaving = true;
    			 $.ajax({
    				 url: '/rest/configurations/' + config.id,
    				 type: 'PUT',
    				 contentType: "application/json;",
    				 data: JSON.stringify(config),
    				 dataType: 'json',
    				 context: this,
    				 success: function(response){ 
    					 config.setProperties(response);
    					 this.isSaving = false;
    				 }
    			 });
    		 }
    		 return config;
    	 },
    	 remove: function(config, callback)
    	 {
    		 if (!this.isSaving) {
    			 this.isSaving = true;
    			 $.ajax({
    				 url: '/rest/configurations/' + config.id,
    				 type: 'DELETE',
    				 contentType: "application/json;",
    				 data: JSON.stringify(config),
    				 dataType: 'json',
    				 context: this,
    				 success: function(response){ 
    					 this.isSaving = false;
    					 if (callback !== undefined) callback(config); 
    				 }
    			 });
    		 }
    	 }
});

//Crawl History Model
App.CrawlHistory = Ember.Object.extend();
App.CrawlHistory.reopenClass({
	isSaving: false,
	findAll: function(id){
		var allHistory = [];
		var data = '';
		if (id !== undefined) data = { config: id };
	    $.ajax({
	      url: '/rest/history',
	      dataType: 'json',
	      context: allHistory,
	      data: data,
	      success: function(response){
	        response.forEach(function(history){
	          this.addObject(App.CrawlHistory.create(history))
	        }, this);
	      }
	    });
	    return allHistory;
	 },
	 add: function(configId, callback)
	 {
		 if (!this.isSaving) {
			 this.isSaving = true;
			 $.ajax({
				 url: '/rest/history',
				 type: 'POST',
				 contentType: "application/json;",
				 data: configId,
				 dataType: 'json',
				 context: this,
				 success: function(response){ 
					 this.isSaving = false;
					 if (callback !== undefined) callback(response);
			 	}
			 });
		 }
	 }
});