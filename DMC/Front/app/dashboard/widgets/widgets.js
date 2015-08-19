//failed to refresh -> ui
//multi refresh on widget -> handle
//layout
var Widgets = Widgets || {};
Widgets.create = function(scope){
    var widget = {};
    widget.onRefreshing = null;
    widget.onRedrawing = null;
    widget.draw = function(){
      widget.onRedrawing();
    };
    widget.autoRefresh = function(){
        setTimeout(function ()
        {
            widget.refreshWidget();
            widget.autoRefresh();
        }, 1000);
    };
    widget.refreshWidget = function(){
        widget.onRefreshing();
    };
    scope.$on('EVENT_dashboardRefresh',  function(event, args) {
        scope.refreshWidget();
    });
    widget.error = function(error){

    };
    return widget;
};
Widgets.drawPercentageGauge = function(paper,w,h,percentageValue){
    var lineWidth = 30;
    var centerPoint_x = w/2;
    var centerPoint_y = h/2+50;
    var width = w;
    var height = h/2 + 30;
    var fillColor = "#506eb9";
    var textColor = "white";
    var backgroundColor = "white";
    var percentage = percentageValue/100;
    var degrees = percentage * 180;
    var text = percentageValue + "%";
    paper.clear();
    var arc_bg = paper.circularArc(centerPoint_x, centerPoint_y,height,360 - (180 - degrees), 360) .attr({
        'stroke': backgroundColor,
        'stroke-width': lineWidth
    });
    var arc_val = paper.circularArc(centerPoint_x, centerPoint_y,height,180,180 + degrees) .attr({
        'stroke': fillColor,
        'stroke-width': lineWidth
    });
    paper.text(centerPoint_x,centerPoint_y-20,text).attr({"font-size": "26px",  fill: textColor});
};
angular.module("myOctopusDMC")
    .directive('cpuWidget',function($q, octopusDeviceService) {
        return {
            scope: true,
            templateUrl: "app/dashboard/widgets/w_gauge.html",
            link: function (scope, element, attr) {
                scope.title = "CPU";
                scope.details = "Intel Edison Cores";
                scope.stats = null;
                scope.widget = Widgets.create(scope);
                var paper = Raphael(element[0].querySelector('.gWidget_c'), "100%", "100%");
                scope.widget.onRedrawing = function(){
                    if (scope.stats==null) return;
                   // element.append("cpu: " + scope.stats.cpuUsagePercent);
                    Widgets.drawPercentageGauge(paper,280,130,scope.stats.cpuUsagePercent);
                };
                scope.widget.onRefreshing = function(){
                    octopusDeviceService.getCpuStats().then(function(results){
                        scope.stats = results;
                        scope.widget.draw();
                    }, function(e) { widget.error(e)});
                };
                scope.widget.refreshWidget();
                scope.widget.autoRefresh();
            }
        }
    })
    .directive('memoryWidget',function($q, octopusDeviceService) {
        return {
            scope: true,
            templateUrl: "app/dashboard/widgets/w_gauge.html",
            link: function (scope, element, attr) {
                scope.stats = null;
                scope.title = "MEMORY";
                scope.details = "Intel Edison Memory";
                scope.widget = Widgets.create(scope);
                var paper = Raphael(element[0].querySelector('.gWidget_c'), "100%", "100%");
                scope.widget.onRedrawing = function(){
                   // element.empty();
                    if (scope.stats==null) return;
                   // element.append("<p>totalMemory: " + scope.stats.totalMemory + "</p>");
                   // element.append("<p>freeMemoryPercentage: " + scope.stats.freeMemoryPercentage+ "</p>");
                    Widgets.drawPercentageGauge(paper,280,130,scope.stats.freeMemoryPercentage);
                };
                scope.widget.onRefreshing = function(){
                    octopusDeviceService.getMemoryStats().then(function(results){
                        scope.stats = results;
                        scope.widget.draw();
                    }, function(e) { widget.error(e)});
                };
                scope.widget.refreshWidget();
                //scope.widget.autoRefresh();
            }
        }
    })
    .directive('storageWidget',function($q, octopusDeviceService) {
        return {
            scope: true,
            templateUrl: "app/dashboard/widgets/w_gauge.html",
            link: function (scope, element, attr) {
                scope.stats = null;
                scope.title = "STORAGE";
                scope.details = "Intel Edison Storage";
                scope.widget = Widgets.create(scope);
                var paper = Raphael(element[0].querySelector('.gWidget_c'), "100%", "100%");
                scope.widget.onRedrawing = function(){
                    //element.empty();
                    if (scope.stats==null) return;
                    //element.append("<p>totalStorageSizeInMB: " + scope.stats.totalStorageSizeInMB + "</p>");
                    //element.append("<p>freeStorageSizeInMB: " + scope.stats.freeStorageSizeInMB+ "</p>");
                    //element.append("<p>freeStorageSizeInPercentage: " + scope.stats.freeStorageSizeInPercentage+ "</p>");
                    Widgets.drawPercentageGauge(paper,280,130,scope.stats.freeStorageSizeInPercentage);
                };
                scope.widget.onRefreshing = function(){
                    octopusDeviceService.getStorageStats().then(function(results){
                        scope.stats = results;
                        scope.widget.draw();
                    }, function(e) { widget.error(e)});
                };
                scope.widget.refreshWidget();
                //scope.widget.autoRefresh();
            }
        }
    })
    .directive('wifiWidget',function($q, octopusDeviceService) {
        return {
            scope: true,
            link: function (scope, element, attr) {
                scope.stats = null;
                scope.widget = Widgets.create(scope);
                scope.widget.onRedrawing = function(){
                    element.empty();
                    if (scope.stats==null) return;
                    element.append("<p>isEnabled: " + scope.stats.isEnabled + "</p>");
                    element.append("<p>isConnected: " + scope.stats.isConnected+ "</p>");
                    element.append("<p>networkSSID: " + scope.stats.networkSSID+ "</p>");
                };
                scope.widget.onRefreshing = function(){
                    octopusDeviceService.getWifiStats().then(function(results){
                        scope.stats = results;
                        scope.widget.draw();
                    }, function(e) { widget.error(e)});
                };
                scope.widget.refreshWidget();
                scope.widget.autoRefresh();
            }
        }
    })
    .directive('bluetoothWidget',function($q, octopusDeviceService) {
        return {
            scope: true,
            link: function (scope, element, attr) {
                scope.stats = null;
                scope.widget = Widgets.create(scope);
                scope.widget.onRedrawing = function(){
                    element.empty();
                    if (scope.stats==null) return;
                    element.append("<p>isEnabled: " + scope.stats.isEnabled + "</p>");
                };
                scope.widget.onRefreshing = function(){
                    octopusDeviceService.getBluetoothStats().then(function(results){
                        scope.stats = results;
                        scope.widget.draw();
                    }, function(e) { widget.error(e)});
                };
                scope.widget.refreshWidget();
                scope.widget.autoRefresh();
            }
        }
    })
    .directive('sensorsWidget',function($q, octopusDeviceService) {
        return {
            scope: true,
            templateUrl: "app/dashboard/widgets/w_sensors.html",
            link: function (scope, element, attr) {
                scope.stats = null;
                scope.widget = Widgets.create(scope);
                scope.widget.onRedrawing = function(){
                   // element.empty();
                    if (scope.stats==null) return;
                    var sTable = $("#sensorsBody");
                    sTable.empty();
                    $.each(scope.stats.sensors, function(i,v){
                        sTable.append("<tr>");
                        sTable.append("<td style='text-align: left;'>" +  v.sensor.name +"</td>");
                        sTable.append("<td>" +  v.lastReadingDate.toLocaleDateString() +"  </td>");
                        sTable.append("<td>" +  v.lastReadingValue +"</td>");
                        sTable.append("</tr>");
                    });
                    sTable.append("</table>");
                };
                scope.widget.onRefreshing = function(){
                    octopusDeviceService.getSensorsStats().then(function(results){
                        scope.stats = results;
                        scope.widget.draw();
                    }, function(e) { widget.error(e)});
                };
                scope.widget.refreshWidget();
                scope.widget.autoRefresh();
            }
        }
    });

Raphael.fn.arc = function(startX, startY, endX, endY, radius1, radius2, angle) {
    var arcSVG = [radius1, radius2, angle, 0, 1, endX, endY].join(' ');
    return this.path('M'+startX+' '+startY + " a " + arcSVG);
};
Raphael.fn.circularArc = function(centerX, centerY, radius, startAngle, endAngle) {
    var startX = centerX+radius*Math.cos(startAngle*Math.PI/180);
    var startY = centerY+radius*Math.sin(startAngle*Math.PI/180);
    var endX = centerX+radius*Math.cos(endAngle*Math.PI/180);
    var endY = centerY+radius*Math.sin(endAngle*Math.PI/180);
    return this.arc(startX, startY, endX-startX, endY-startY, radius, radius, 0);
};