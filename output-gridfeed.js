/***
 *     @author Victor Chimenti, MSCS-SE '20
 *     @file output-gridfeed.js
 *     @see Seattle University School of Law Newsroom
 *
 *     This new content type layout is a smart layout for news items that must obey
 *     a masonry grid layout. In its first iteration this layout will be dedicated
 *     to the category news pages.
 *
 *     This content layout will be the organizer layout and will link to the
 *     full text layout to reveal the full article.
 *
 *     Document will write once when the page loads
 *
 *     @version 3.3
 */

try {

    /***
     *  Assign local variables from the content type's fields
     * 
     * */
    var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />");
    var headline = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Headline' output='normal' display_field='value' />");
    var frontPageImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Media Library Image' output='normal' formatter='path/*' />");
    var frontPageImagCaption = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Media Library Image Caption' output='normal' modifiers='striptags,htmlentities' />");
    var frontPageImagCredit = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Media Library Image Credit' output='normal' modifiers='striptags,htmlentities' />");
    var articleSummary = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Abstract' output='normal' display_field='value' />");
    var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Body' output='normal' display_field='value' />");
    var author = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Author' output='normal' display_field='value' />");
    var publishedDate = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Publish Date' output='normal' date_format='MMMM d, yyyy' />");
    var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
    var fieldTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category' output='normal' display_field='name' />");
    var pinned = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Pinned' output='normal' display_field='value' />");




    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
    var listOfTags = "";
    var titleLink = "";
    var authorByLine = "";
    var thumbNailString = '<span class="newsroomImageWrapper"><img src="' + frontPageImage + '" class="articleImage card-img-top" alt="' + frontPageImagCaption + '" /></span>';
    var beginningHTML = '<div class="gridFeedItem newsroomArticleWrapper newsroomBlurb card col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-4" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
    var endingHTML = '</div>';




    /***
     *  parse the list of tags, add <li> tags
     * 
     * */
    if (fieldTags != "") {
        var arrayOfTags = fieldTags.split(',');
        for (let i = 0; i < arrayOfTags.length; i++) {
            listOfTags += '<li class="tag">' + arrayOfTags[i] + '</li>';
        }
        listOfTags = '<div class="newsroomArticle tags hidden"><ul class="categories">' + listOfTags + '</ul></div>';
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
     *  Write the document once
     * 
     * */
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, thumbNailString));
    document.write('<div class="newsroomArticleBlurb container card-body"><div class="row">');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
    document.write('<span class="newsroomArticleLead card-text">' + articleSummary + '</span>');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, authorByLine));
    document.write('<p class="newsroomArticlePublishedDate">' + publishedDate + '</p>');
    document.write(listOfTags);
    document.write('<div class="hidden"><span class="articlePinned">' + pinned + '</span></div>');
    document.write('</div></div>'); // close newsroomArticleBlurb and row divs
    document.write(endingHTML);




} catch (err) {
    document.write(err.message);
}