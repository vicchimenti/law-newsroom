/***
 *     @author Victor Chimenti, MSCS-SE '20
 *     @file output-eventsfeed.js
 *     @see Seattle University School of Law Newsroom
 *
 *     This new content type layout is a smart layout for all items in the
 *     category newsfeed used by the School of Law Newsroom. This content type
 *     ensures that images, headlines, by-lines, tags and the abstract
 *     summary layout as expected.
 *
 *     This content layout will be the organizer layout and will link to the
 *     full text layout to reveal the full article.
 *
 *     Document will write once when the page loads
 *
 *     @version 4.3
 */




try {

    /***
     *  Assign local variables from the content type's fields
     * 
     * */
    var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />");
    var headline = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Headline' output='normal' display_field='value' />");
    var frontPageImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Main Image' output='normal' formatter='path/*' />");
    var frontPageImageCaption = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Main Image Caption' output='normal' modifiers='striptags,htmlentities' />");
    var frontPageImageCredit = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Main Image Credit' output='normal' modifiers='striptags,htmlentities' />");
    var articleSummary = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Abstract' output='normal' display_field='value' />");
    var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Body' output='normal' display_field='value' />");
    var author = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Author' output='normal' display_field='value' />");
    var publishedDate = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Publish Date' output='normal' date_format='MMMM d, yyyy' />");
    var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Headline' output='fulltext' use-element='true' filename-element='Headline' modifiers='striptags,htmlentities' />");
    var fieldTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category' output='normal' display_field='name' />");
    var pinned = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Pinned' output='normal' display_field='value' />");
    var isMajor = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Major or Minor' output='normal' display_field='value' />");
    var catPin = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category Pin' output='normal' display_field='value' />");
    // var gridImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='8x10 Image' output='normal' formatter='path/*' />");
    // var gridImageCaption = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='8x10 Image Caption' output='normal' modifiers='striptags,htmlentities' />");
    // var gridImageCredit = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='8x10 Image Credit' output='normal' modifiers='striptags,htmlentities' />");    
    var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />"); 




    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
    var titleLink = "";
    var listItems = "";
    var listOfTags = "";
    var photoCredit = "";
    var authorByLine = "";
    var thumbNailString = "";
    var beginningHTML = '<div class="newsroomCategoryFeedItem newsroomArticleWrapper newsroomBlurb card col-xs-12" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main" />">';
    var endingHTML = '<hr class="articleBorderBottom"></div>';




    /***
     *  parse the list of tags, add <li> tags
     * 
     * */
    if (fieldTags != "") {
        var arrayOfTags = fieldTags.split(',');
        for (let i = 0; i < arrayOfTags.length; i++) {
            let currentItem = arrayOfTags[i].trim();
            listItems += '<li class="tag">' + currentItem + '</li>';
        }
        listOfTags = '<div class="newsroomArticle tags"><ul class="categories">' + listItems + '</ul></div>';
    }


    /***
     *  determine which link, if any, goes in the title
     *  and determine if a unique headline was added
     *  if no headline is added then use the title
     * 
     * */
    if (headline == "" && articleFullBody == "") {
        titleLink = '<h3 class="newsroomArticleTitle card-title">' + articleTitle + '</h3>';
    } else if (articleFullBody == "") {
        titleLink = '<h3 class="newsroomArticleTitle card-title">' + headline + '</h3>';
    } else if (headline == "") {
        titleLink = '<h3 class="newsroomArticleTitle card-title"><a href="' + fullTextLink + '">' + articleTitle + '</a></h3>';
    } else {
        titleLink = '<h3 class="newsroomArticleTitle card-title"><a href="' + fullTextLink + '">' + headline + '</a></h3>';
    }


    /***
     *  display byline only when provided 
     * 
     * */
    if (author == "") {
        authorByLine = '<p class="byLine hidden">No Author Provided</p>';
    } else {
        authorByLine = '<p class="byLine">By ' + author + '</p>';
    }


    /***
     *  determine if minor feed
     * 
     * */
    // if (isMajor == "major") {

    //     // default to a Main image
    //     if (frontPageImage == "") {
    //         thumbNailString = '<span class="newsroomImageWrapper"><img src="' + gridImage + '" class="articleImage card-img-top" alt="' + gridImageCaption + '" /></span>';
    //         if (gridImageCredit == "") {
    //             photoCredit = '<p class="byLine hidden">No Photographer Provided</p>';
    //         } else {
    //             photoCredit = '<p class="byLine">Image credit: ' + gridImageCredit + '</p>';
    //         }
    //     } else {
    //         thumbNailString = '<span class="newsroomImageWrapper"><img src="' + frontPageImage + '" class="articleImage card-img-top" alt="' + frontPageImageCaption + '" /></span>';
    //         if (frontPageImageCredit == "") {
    //             photoCredit = '<p class="byLine hidden">No Photographer Provided</p>';
    //         } else {
    //             photoCredit = '<p class="byLine">Image credit: ' + frontPageImageCredit + '</p>';
    //         }
    //     }

    // } else {
    //     thumbNailString = '<span class="newsroomImageWrapper hidden"></span>';
    // }


    /***
     *  determine if major feed
     * 
     * */
    if (isMajor == "major") {
        // ensure that an image was provided with the major feed
        if (frontPageImage == "") {
            thumbNailString = '<span class="newsroomImageWrapper hidden">No Image Provided</span>';
        } else {
            thumbNailString = '<span class="newsroomImageWrapper"><img src="' + frontPageImage + '" class="articleImage card-img-top" alt="' + frontPageImageCaption + '" /></span>';
        }
        // ensure that an image credit was provided
        if (photoCredit == "") {
            photoCredit = '<p class="byLine hidden">No Photographer Provided</p>';
        } else {
            photoCredit = '<p class="byLine">Image credit: ' + frontPageImageCredit + '</p>';
        }
    // if it's a minor article ignore any image provided in this feed
    } else {
        thumbNailString = '<span class="newsroomImageWrapper hidden"></span>';
    }




    /***
     *  Write the document once
     * 
     * */
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, anchorTag));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, thumbNailString));
    document.write('<div class="newsroomArticleBlurb container card-body"><div class="row">');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
    document.write('<span class="newsroomArticleLead card-text"><p>' + articleSummary + '</p></span>');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, authorByLine));
    document.write('<p class="newsroomArticlePublishedDate">' + publishedDate + '</p>');
    document.write(listOfTags);
    document.write('<div class="hidden"><span class="articlePinned">' + pinned + '</span><span class="catPinned">' + catPin + '</span></div>');
    document.write('</div></div>'); // close newsroomArticleBlurb and row divs
    document.write(endingHTML);




} catch (err) {
    document.write(err.message);
}
