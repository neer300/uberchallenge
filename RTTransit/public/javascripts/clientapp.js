
(function ($) {
    
    function success (position) {
        console.log(position);
        var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var options = {
            zoom: 15,
            center: coords,
            mapTypeControl: false,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var element = $("#mapContainer");
        element.css('width', '300px');
        element.css('height', '200px');
        var map = new google.maps.Map(document.getElementById('mapContainer'), options);
        var marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: "You are here"
        });
    }
    
    var selectTemplate = '<select><option disabled selected> -- select an option -- </option><% _(itemList).each(function(item) { %><option value="<%= item.get(\'code\') %>"><%= item.get(\'name\') %></option><% }); %></select>';
    var listTemplate = '<ul style="list-style-type:none"><% _(itemList).each(function(item) { %><li><%= item %></li><% }); %></ul>';
    
    var BaseItem = Backbone.Model.extend({
        idAttribute: 'code',
        code: null,
        name: null
    });
    
    var ItemCollection = Backbone.Collection.extend({
        model: BaseItem,
        gather: function () {
            this.fetch({
                success: function (collection) {
                    var models = collection.models;
                    models.forEach(function (item) {
                        console.log('code:' + item.get('code') + ' name:' + item.get('name'));
                    });
                },
                error: function () {
                    console.log('Agencies fetch failed');
                }
            });
          }
    });
    
    var AgencyCollection = ItemCollection.extend({
        url: '/agencies',
    });
    
    var RouteItem = BaseItem.extend({
        directionArray: null
    });
    
    var RouteCollection = ItemCollection.extend({
        initialize: function (a, b) {
            this.url = '/'  + agencyCode + '/routes';
        },
        model: RouteItem
    });
    
    var StopCollection = ItemCollection.extend({
        initialize: function () {
            this.url = '/'  + agencyCode + '/' + routeCode + '/' + directionCode + '/stops';
        }
    });
    
    var DepartureCollection = Backbone.Collection.extend({
        initialize: function () {
            this.url = '/'  + agencyCode + '/' + routeCode + '/' + directionCode + '/' + stopCode + '/departures';
        },
        gather: function () {
            this.fetch({
                success: function (collection) {
                    var models = collection.models;
                    models.forEach(function (item) {
                        console.log(item);
                    });
                },
                error: function () {
                    console.err('Agencies fetch failed');
                }
            });
        },
        parse: function(response) {
            this.models = response;
        }
    });
    
    var SelectView = Backbone.View.extend({
        initialize: function (obj) {
            _.bindAll(this, 'render', 'onLocalChangeEvent');
            this.collection.on('sync', this.render);
            this.title = obj.title;
        },
        events: {
            'change': 'onLocalChangeEvent'
        },
        render: function () {
            var titleDivTemplate = '<div>' + this.title + '</div>';
            var modelList = this.collection.models;
            var template = _.template(selectTemplate, {
                itemList: modelList
            });

            this.$el.html(titleDivTemplate + template);
            return this;
        },
        onLocalChangeEvent: function (e) {
            this.trigger('itemselected', e.target.value);
        },
        title: 'Default Title'
    });
    
    var ListView = Backbone.View.extend({
        initialize: function (obj) {
            _.bindAll(this, 'render');
            this.collection.on('sync', this.render);
            this.defaultMsg = obj.defaultMsg;
            this.title = obj.title;
        },
        render: function () {
            var titleDivTemplate = '<div>' + this.title + '</div>';
            var modelList = this.collection.models;
            if (modelList.length > 0) {
                var template = _.template(listTemplate, {
                    itemList: modelList
                });

                this.$el.html(titleDivTemplate + template);
            } else {
                this.$el.html(titleDivTemplate + '<p>'+ this.defaultMsg + '</p');
            }
            
            return this;
        },
        defaultMsg: 'Nothing to show',
        title: 'Default Title'
    });
    
    var newRouteCollection;
    var agencyCollection;
    var directionCollection;
    var agencyCode = '';
    var routeCode = '';
    var directionCode = '';
    var stopCode = '';
    
    function onStopSelect(value) {
        stopCode = value;
        var newDepartureCollection = new DepartureCollection();
        var newDeparturesView = new ListView({
            collection: newDepartureCollection,
            defaultMsg: 'No departures available at this time',
            title: 'Departures in next (minutes)'
        });
        newDepartureCollection.gather();
        $("#departuresListDiv").empty().append(newDeparturesView.render().$el);
    } 
    
    function onDirectionSelect(value) {
        directionCode = value;
        var newStopCollection = new StopCollection();
        var newStopView = new SelectView({
            collection: newStopCollection,
            title: 'Select Stop'
        });
        newStopView.on('itemselected', onStopSelect);
        newStopCollection.gather();
        $("#stopListDiv").empty().append(newStopView.render().$el);
        $("#departuresListDiv").empty();
    }
    function onRouteSelect(value) {
        routeCode = value;
        var routeModel = newRouteCollection.get(value);
        var directionArray = routeModel.get('directionArray');
        directionCollection = new ItemCollection(directionArray, {refId: value });
        var directionView = new SelectView({
            collection: directionCollection,
            title: 'Select Direction'
        });
        directionView.on('itemselected', onDirectionSelect);
        $("#directionListDiv").empty().append(directionView.render().$el);
        $("#departuresListDiv").empty();
        $("#stopListDiv").empty();
    }
    
    function onAgencySelect(value) {
        agencyCode = value;
        newRouteCollection = new RouteCollection([],{refId: value});
        var newRouteView = new SelectView({
            collection: newRouteCollection,
            title: 'Select Route'
        });
        newRouteView.on('itemselected', onRouteSelect);
        newRouteCollection.gather();
        $("#routeListDiv").empty().append(newRouteView.render().$el);
        $("#departuresListDiv").empty();
        $("#stopListDiv").empty();
        $("#directionListDiv").empty()
    }

    agencyCollection = new AgencyCollection();
    var newListView = new SelectView({
        collection: agencyCollection,
        title: 'Select Agency'
    });
    newListView.on('itemselected', onAgencySelect);
    agencyCollection.gather();
    $("#agencyListDiv").empty().append(newListView.render().$el);
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success);
    } else {
        $("#mapContainer").html('<p>Map cannot be displayed as no geolocation is available</p>');
    }
})(jQuery);