function renderReviews() { 
    var container = $('.reconciliationsToReview').hide().empty();
    var newTemplate = $(".templates .reviewNewTemplate");
    var skippedTemplate = $(".templates .reviewSkippedTemplate");
    var reconciledTemplate = $(".templates .reviewReconciledTemplate");
    $.each(entities, function(idx,entity){ 
        if (entity["/rec_ui/is_cvt"] || null == entity.id || $.isArray(entity.id))
            return;

        var template;
        if (entity.id === "None")
            template = newTemplate.clone();
        else if(entity.id === "")
            template = skippedTemplate.clone();
        else
            template = reconciledTemplate.clone();
        
        $(".candidateName",template).html("<a class='internalLink' href='#" + entity['/rec_ui/id'] + "'>" + textValue(entity) + "</a>");
        var freebaseName = null;
        if (entity['/rec_ui/freebase_name']){
            $.each(entity['/rec_ui/freebase_name'],function(idx,name){
                if (name.toLowerCase() === textValue(entity).toLowerCase())
                    freebaseName = name;
            })
            freebaseName = freebaseName || entity['/rec_ui/freebase_name'][0];
        }
        freebaseName = "" + (freebaseName || entity.id);
        
        $(".freebaseName", template).html(freebaseLink(entity.id, freebaseName));
        if (freebaseName && textValue(entity).toLowerCase() === freebaseName.toLowerCase())
            $(".freebaseName", template).addClass("identicalMatch");
            
        $(".internalLink", template).click(function(val) {
            $.historyLoad(entity["/rec_ui/id"]);
            $("#tabs > ul").tabs("select",0);})
        container.append(template);
    });
    container.show();
}