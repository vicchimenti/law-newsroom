/***
 *     @author Victor Chimenti, MSCS-SE '20
 *     @file output-minorfeed.js
 *     @see Seattle University School of Law Newsroom
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
 *     @version 1.2
 */




try {

    /***
     *  Assign local variables from the content type's fields
     * 
     * */
    var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />");
    var headline = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Headline' output='normal' display_field='value' />");
    var articleSummary = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Abstract' output='normal' display_field='value' />");
    var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Body' output='normal' display_field='value' />");
    var publishedDate = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Publish Date' output='normal' date_format='MMMM d, yyyy' />");
    var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
    var fieldTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category' output='normal' display_field='name' />");
    var pinned = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Pinned' output='normal' display_field='value' />");
    var inTheNewsLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' modifiers='htmlentities,js-var' />");
    var inTheNewsLinkTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link Title' output='normal' display_field='value' />");    
    var internalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Internal SU Link' output='normal' modifiers='nav_sections' />");
    var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />"); 



    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
    var listOfTags = "<div class='newsroomArticle tags hidden'>No Tags Entered</div>";
    var titleLink = "";
    var listItems = "";
    var suLawInTheNews = " - SU Law in the News"

    var externalLinkString = "";
    var internalLinkString = "";
    var dateline = '<p class="newsroomArticlePublishedDate">' + publishedDate + '</p>';
    var subTitleString = '<span class="newsroomArticleSubTitle card-subtitle hidden"></span>';
    var beginningHTML = '<div class="newsroomMinorFeedItem newsroomArticleWrapper newsroomBlurb card" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
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
        listOfTags = '<div class="newsroomArticle tags hidden"><ul class="categories">' + listItems + '</ul></div>';
        
        // when tags exist check for Special Categories - SU Law in the News
        if (fieldTags.includes("SU Law in the News")) {
            beginningHTML = '<div class="newsroomMinorFeedItem newsroomArticleWrapper newsroomBlurb card lawInTheNews" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
            endingHTML = '</div>';
            subTitleString = '<span class="newsroomArticleSubTitle card-subtitle">SU Law in the News</span>';
            dateline = '<p class="newsroomArticlePublishedDate">' + publishedDate + '<span class="newsroomArticleSpecialCategory">' + suLawInTheNews + '</span></p>';

            // parse law in news for external link to original story
            if (inTheNewsLink == "" || inTheNewsLinkTitle == "") {
                externalLinkString = '<span class="externalLink hidden">No Proper Link Provided</span>';
            } else {
                externalLinkString = '<span class="externalLink credits"><a href="' + inTheNewsLink + '" title="' + inTheNewsLinkTitle + '" target="_blank" class="card-link"><em>' + inTheNewsLinkTitle + '</em></a></span>';
            }

        // when tags exist check for Special Categories - Announcements
        } else if (fieldTags.includes("Announcements")) {
            beginningHTML = '<div class="newsroomMinorFeedItem newsroomArticleWrapper newsroomBlurb card lawAnnouncements" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
            endingHTML = '</div>';
            subTitleString = '<span class="newsroomArticleSubTitle card-subtitle">SU Law Announcement</span>';

            // parse announcements for internal link to origin
            if (internalLink == "") {
                internalLinkString = '<span class="internalLink hidden">No Proper Link Provided</span>';
            } else {
                internalLinkString = '<span class="internalLink credits"><em>' + internalLink + '</em></span>';
            }

        // when tags exist check for Special Categories - Announcements
        } else if (fieldTags.includes("Events")) {
            beginningHTML = '<div class="newsroomMinorFeedItem newsroomArticleWrapper newsroomBlurb card lawEvents" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
            endingHTML = '</div>';
            subTitleString = '<span class="newsroomArticleSubTitle card-subtitle">SU Law Event</span>';

            // parse events for internal link to origin
            if (internalLink == "") {
                internalLinkString = '<span class="internalLink hidden">No Proper Link Provided</span>';
            } else {
                internalLinkString = '<span class="internalLink credits"><em>' + internalLink + '</em></span>';
            }
        }
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
     *  Write the document once
     * 
     * */
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, anchorTag));
    // document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, subTitleString));
    // document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, thumbNailString));
    document.write('<div class="newsroomArticleBlurb container card-body"><div class="row">');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, externalLinkString));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, internalLinkString));
    document.write('<span class="newsroomArticleLead card-text"><p>' + articleSummary + '</p></span>');
    // document.write('<div class="creditsWrapper card-text hidden">');
    // document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, authorByLine));
    // document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, photoCredit));
    // document.write('</div>'); // close credits div
    document.write(dateline);
    document.write(listOfTags);
    document.write('<div class="hidden"><span class="articlePinned">' + pinned + '</span></div>');
    document.write('</div></div>'); // close newsroomArticleBlurb and row divs
    document.write(endingHTML);




} catch (err) {
    document.write(err.message);
}
