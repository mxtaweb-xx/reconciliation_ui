var freebase = (function() {
   var freebase = {};
   var miniTopicFloaterEl = $("#miniTopicFloater");
   function miniTopicFloater(element, id) {
       element.bind("hover",function() {
           miniTopicFloaterEl.empty().freebaseMiniTopic(id).show();
       })
       element.bind("hoverend", function() {
           miniTopicFloaterEl.hide();
       })
       element.mousemove(function(e){
           miniTopicFloaterEl.css({
               top: (e.pageY + 15) + "px",
               left: (e.pageX + 15) + "px"
           });
       });
       return element;
   }
   freebase.link = function(name, id) {
       var linkVal = $("<a target='_blank' href='"+freebase_url+"/view"+id+"'>" + name + "</a>");
       return miniTopicFloater(linkVal, id);
   };
   return freebase;
}());

