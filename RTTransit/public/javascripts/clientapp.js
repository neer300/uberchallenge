
(function ($) {
    
    var selectTemplate = '<select><% itemList.each(function(item) { %><option value="<%= item.get(\'code\') %>"><%= item.get(\'name\') %></option><% }); %></select>';
    
    var BaseItem = Backbone.Model.extend({
        code: null,
        name: null
    });
    
    var ItemCollection = Backbone.Collection.extend({
        initialize: function (model, options) {
        }
    });
    
    var ListView = Backbone.View.extend({
        el: '#agencyListDiv',
        initialize: function () {
            this.itemCollection = new ItemCollection(null, {
                view: this
            });

            this.itemCollection.add(new BaseItem({
                code: 'BART',
                name: 'BART'
            }));

            this.itemCollection.add(new BaseItem({
                code: 'VTA',
                name: 'VTA'
            }));
            this.render();
        },
        render: function () {
            //console.log($('#listTemplate').html());
            
            var template = _.template(selectTemplate, {
                itemList: this.itemCollection
            });
            console.log(template);
            $("#agencyListDiv").html(template);
        }
    });
    var newItem = new BaseItem({
        code: 'BART',
        name: 'BART'
    });

    var newListView = new ListView();
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