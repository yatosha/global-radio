var site_url = "https://globalradio.co.tz/index.php/wp-json/";

function getPosts(){
    $.ajax({
        url:site_url+"wp/v2/posts",
        type:"GET",
        success:function(result){
        console.log(result);
        var output = "";
           for(i in result){
            var media_id = result[i].featured_media;
            var post_id = result[i].id;
            var post_link = result[i].link;
            var post_title = result[i].title.rendered;
            var post_date = result[i].date;
            output =""+
            "<div class='post_list_item'>"+
            "<div class='demo-card-wide mdl-card  mdl-shadow--2dp'>"+
            "<div class='mdl-card__media'id='post_thumb_"+ post_id +"'></div>"+
            "<div class='mdl-card__supporting-text'>"+
            "<p class='post_title b'>"+ post_title +"</p>"+
            "<p class='b'>"+ post_date +"</p>"+
            "</div>"+
            "<div class='mdl-card__actions'>"+
            "<a class='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>"+
            "Soma Zaidi"+
            "</a>"+
            "</div>"+
            "<div class='mdl-card__menu'>"+
            "<button class='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'>"+
            "<i class='material-icons'>share</i>"+
            "</button>"+
            "</div>"+
            "</div>"+
            "</div>";   
            $("#post_list_habari").append(output);
            //setTimeout(function)
           }
           
           output = "";
        },
        error:function(error){
            //$("#request-error").modal("show");
            //alert(error);
        }
 
    });
}

function getPostThumbnail(id){
    $.ajax({
        url:site_url+"wp/v2/media/"+id,
        type:"GET",
        success:function(result){
            var image_data = "<img src='"+ result.source_url +"'  width='100%' height='auto'>";
            $("#post_thumb_"+id).html(image_data)
           // $("#post_thumb_"+id).attr("src", ); 
            //console.log(id +" - "+ result.source_url);
            //return ;
        },
        error:function(error){
            //return null;
        }
    });
}