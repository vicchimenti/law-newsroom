/***
 *     @author Victor Chimenti, MSCS
 *     @file output-majorfeed.js
 *     @see Seattle University School of Law News Center
 *
 *     This new content type layout is a smart layout for all items in the
 *     major newsfeed used by the School of Law Newsroom. This content type
 *     ensures that images, headlines, by-lines, tags and the abstract
 *     summary layout as expected.
 *
 *     This content layout will be the organizer layout and will link to the
 *     full text layout to reveal the full article.
 *
 *     Document will write once when the page loads
 *
 *     @version 2.23
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
    var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
    var fieldTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category' output='normal' display_field='name' />");
    var pinned = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Pinned' output='normal' display_field='value' />");
    var inTheNewsLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' modifiers='htmlentities,js-var' />");
    var inTheNewsLinkTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link Title' output='normal' display_field='value' />");    
    var internalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Internal SU Link' output='linkurl' modifiers='nav_sections' />");
    var internalLinkTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Internal SU Link' output='linktext' modifiers='nav_sections' />");
    var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />"); 




    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
    var listOfTags = "<div class='newsroomArticle tags hidden'>No Tags Entered</div>";
    var titleLink = "";
    var listItems = "";
    var photoCredit = "";
    var authorByLine = "";
    var externalLinkString = "";
    var internalLinkString = "";
    var publishedLink = "";
    var hyphen = " - ";
    var events = "Events";
    var announcements = "Announcements";
    var suLawInTheNews = "SU Law in the News";
    var dateline = '<p class="newsroomArticlePublishedDate">' + publishedDate + '</p>';
    var thumbNailString = '<span class="newsroomImageWrapper"><img src="' + frontPageImage + '" class="articleImage card-img-top" alt="' + frontPageImageCaption + '" /></span>';
    var beginningHTML = '<div class="newsroomMajorFeedItem newsroomBlurb card border-0" title="' + articleTitle + '" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
    var endingHTML = '<hr class="articleBorderBottom"></div>';




    /***
     *  parse the list of tags, add <li> tags
     *  whenever there is tag we check for special topics
     *      events, announcements and su law in the news
     * 
     *  when a special topic is present we parse for valid links
     * 
     * */
    if (fieldTags != "") {
        var arrayOfTags = fieldTags.split(',');
        for (let i = 0; i < arrayOfTags.length; i++) {
            listItems += '<li class="tag">' + arrayOfTags[i] + '</li>';
        }

        // Print any tags that were selected
        listOfTags = '<div class="newsroomArticle tags"><ul class="categories">' + listItems + '</ul></div>';
        
        // when tags exist check for Special Categories - SU Law in the News
        if (fieldTags.includes("SU Law in the News")) {
            beginningHTML = '<div class="newsroomMajorFeedItem newsroomBlurb card border-0 lawInTheNews" title="' + articleTitle + '" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
            dateline = '<p class="newsroomArticlePublishedDate">' + publishedDate + hyphen + '<span class="newsroomArticleSpecialCategory">' + suLawInTheNews + '</span></p>';

            // parse law in news for external link to original story
            if (inTheNewsLink == "" || inTheNewsLinkTitle == "") {
                externalLinkString = '<span class="externalLink hidden">No Proper Link Provided</span>';
            } else {
                externalLinkString = '<span class="externalLink credits"><a href="' + inTheNewsLink + '" title="' + inTheNewsLinkTitle + '" target="_blank" class="card-link"><em>' + inTheNewsLinkTitle + '</em></a></span>';
            }

            // assign link value for publishing
            publishedLink = externalLinkString;


        // when tags exist check for Special Categories - Announcements
        } else if (fieldTags.includes("Announcements")) {
            beginningHTML = '<div class="newsroomMajorFeedItem newsroomBlurb card border-0 lawAnnouncements" title="' + articleTitle + '" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
            dateline = '<p class="newsroomArticlePublishedDate">' + publishedDate + hyphen + '<span class="newsroomArticleSpecialCategory">' + announcements + '</span></p>';

            // parse announcements for internal link to origin
            if (internalLink == "") {
                internalLinkString = '<span class="internalLink hidden">No Proper Link Provided</span>';
            } else {
                internalLinkString = '<span class="internalLink credits"><a href="' + internalLink + '" title="' + internalLinkTitle + '" target="_blank" class="card-link"><em>' + internalLinkTitle + '</em></a></span>';
            }

            // assign link value for publishing
            publishedLink = internalLinkString;


        // when tags exist check for Special Categories - Announcements
        } else if (fieldTags.includes("Events")) {
            beginningHTML = '<div class="newsroomMajorFeedItem newsroomBlurb card border-0 lawEvents" title="' + articleTitle + '" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
            dateline = '<p class="newsroomArticlePublishedDate">' + publishedDate + hyphen + '<span class="newsroomArticleSpecialCategory">' + events + '</span></p>';

            // parse events for internal link to origin
            if (internalLink == "") {
                internalLinkString = '<span class="internalLink hidden">No Proper Link Provided</span>';
            } else {
                internalLinkString = '<span class="internalLink credits"><a href="' + internalLink + '" title="' + internalLinkTitle + '" target="_blank" class="card-link"><em>' + internalLinkTitle + '</em></a></span>';
            }

            // assign link value for publishing
            publishedLink = internalLinkString;            
        }
    }




    /***
     *  determine if the article contains full text content
     * 
     * */
    if (articleFullBody == "") {
        titleLink = '<h3 class="newsroomArticleTitle card-title">' + headline + '</h3>';
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
        authorByLine = '<p class="byLine credits">By ' + author + '</p>';
    }
    if (photoCredit == "") {
        photoCredit = '<p class="byLine hidden">No Photographer Provided</p>';
    } else {
        photoCredit = '<p class="byLine credits">Image credit: ' + frontPageImageCredit + '</p>';
    }




    /***
     *  verify Main image and photo credits
     * 
     * */
    if (frontPageImage == "") {
        thumbNailString = '<span class="newsroomImageWrapper hidden">No Valid Image Content Provided</span>';
    } else {
        thumbNailString = '<span class="newsroomImageWrapper"><img src="' + frontPageImage + '" class="articleImage card-img-top" alt="' + frontPageImageCaption + '" /></span>';
    }




    /***
     *  Write the document once
     * 
     * */
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, anchorTag));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, thumbNailString));
    document.write('<div class="newsroomArticleBlurb container card-body"><div class="row px-0">');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, publishedLink));
    document.write('<span class="newsroomArticleLead card-text"><p>' + articleSummary + '</p></span>');
    document.write('<div class="creditsWrapper card-text hidden">');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, authorByLine));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, photoCredit));
    document.write('</div>'); // close credits div
    document.write(dateline);
    document.write('<div class="hidden">' + listOfTags + '</div>');
    document.write('<div class="hidden"><span class="articlePinned">' + pinned + '</span></div>');
    document.write('</div></div>'); // close newsroomArticleBlurb and row divs
    document.write(endingHTML);




} catch (err) {
    document.write(err.message);
}
