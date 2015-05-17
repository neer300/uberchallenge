
(function ($) {
    
    var selectTemplate = '<select><% _(itemList).each(function(item) { %><option value="<%= item.get(\'code\') %>"><%= item.get(\'name\') %></option><% }); %></select>';
    
    var BaseItem = Backbone.Model.extend({
        code: null,
        name: null
    });
    
    var ItemCollection = Backbone.Collection.extend({
        model: BaseItem
    });
    
    var AgencyCollection = ItemCollection.extend({
        url: '/agencies',
        initialize: function () {
        },
        gather: function () {
          this.fetch({
              success: function (collection) {
                  console.log('Agencies fetched');
                  console.log(collection.models);
                  var itemList = collection.models;
                  itemList.forEach(function (item) {
                      console.log('code:' + item.get('code') + ' name: ' + item.get('name'));
                  });
              },
              error: function () {
                  console.err('Agencies fetch failed');
              }
          });
        }
    });
    
    var ListView = Backbone.View.extend({
        el: '#agencyListDiv',
        initialize: function () {
//            this.itemCollection = new ItemCollection(BaseItem, {
//                view: this
//            });
//
//            this.itemCollection.add(new BaseItem({
//                code: 'BART',
//                name: 'BART'
//            }));
//
//            this.itemCollection.add(new BaseItem({
//                code: 'VTA',
//                name: 'VTA'
//            }));
//            this.render();
            _.bindAll(this, 'render');
            this.collection.on('sync', this.render);
        },
        render: function () {
            //console.log($('#listTemplate').html());
            var modelList = this.collection.models; 
            console.log(modelList);
            var template = _.template(selectTemplate, {
                itemList: modelList
            });
            console.log(template);
            $("#agencyListDiv").html(template);
        }
    });
    var newItem = new BaseItem({
        code: 'BART',
        name: 'BART'
    });

    var agencyCollection = new AgencyCollection();
    var newListView = new ListView({collection: agencyCollection});
    agencyCollection.gather();
    
    /*var selectTemplate = '<select id="rate-selector"><% rates.each(function(rate) { %><option value="<%= rate.get(\'duration\') %>"><%= rate.get(\'duration\') %></option><% }); %></select>';
    console.log('underscore:' + (_ !== null));
    Rate = Backbone.Model.extend({
        duration: null
    });

    Rates = Backbone.Collection.extend({
        initialize: function(model, options) {}
    });

    AppView = Backbone.View.extend({
        el: 'div',
        initialize: function() {
            _.bindAll(this, 'render'); 
            this.rates = new Rates(null, {
                view: this
            });

            this.rates.add(new Rate({
                duration: "Not Set"
            }));
            this.rates.add(new Rate({
                duration: "Weekly"
            }));
            this.rates.add(new Rate({
                duration: "Monthly"
            }));

            this.render();
        },
        render: function() {
            console.log('rendering now');
            /*var rate_select_template = _.template(selectTemplate, {
                rates: this.rates,
                labelValue: 'Something'
            });
            var html = rate_select_template.toString();
            globalNeeraj = rate_select_template;
            console.log(html);
            console.log("hello world");
            console.log(rate_select_template);
            console.log('setting html:' + globalNeeraj);
            var element = $("#rate-editor-container");
            var div = document.getElementById('rate-editor-container');
            console.log(div);
            console.log('inner:' + element.innerHTML);
            var actual = '<select id="rate-selector"><option value="Not Set">Not Set</option><option value="Weekly">Weekly</option><option value="Monthly">Monthly</option></select>';
            $("#rate-editor-container").html(actual);
            element.innerHTML = globalNeeraj;
          //  this.delegateEvents();
          //  $("#rate-editor-container").empty().append("<button id='add'>Add list item</button>");
            $(this.el).html("<button id='add'>Add list item</button>");
            console.log('append done');
        },
    });

    var appview = new AppView();*/
    //$("#rate-editor-container").append("<button id='add'>Add list item</button>");
    
})(jQuery);