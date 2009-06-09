function renderReviews() { 
    var container = $('.reconciliationsToReview');
    container.empty();
    container.hide();
    $.each(entities, function(idx,entity){ 
        var template;
        if (entity.id === null || entity.id === undefined || entity.id === "")
            return
        if (entity.id === "None")
            template = $("#reviewNewTemplate").clone();
        else
            template = $("#reviewReconciledTemplate").clone();
        
        $(".candidateName",template).html("<a class='internalLink' href='#" + entity['/rec_ui/id'] + "'>" + textValue(entity) + "</a>");
        $(".freebaseName", template).html("<a href='"+freebase_url+"/view/"+entity.id+"'>"+entity['/rec_ui/freebase_name'] || entity.id+"</a>");
        $(".internalLink", template).click(function(val) {
            $.historyLoad(entity["/rec_ui/id"]);
            $("#tabs > ul").tabs("select",0);})
        container.append(template);
    });
    container.show();
}