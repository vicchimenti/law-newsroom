/***
 *     @author Victor Chimenti, MSCS
 *     @see Seattle University School of Law News Center
 *     @file output-minorfeed.js
 *          Law - Newscenter Story
 *          ID: 5296
 *
 *     This new content type layout is a smart layout for all items in the
 *     minor newsfeed.
 *
 *     Document will write once when the page loads
 *
 *     @version 2.2
 */








/***
 *      Import T4 Utilities
 */
 importClass(com.terminalfour.publish.utils.BrokerUtils);




 /***
 *      Extract values from T4 element tags
 *      and confirm valid existing content item field
 */
function getContentValues(tag) {
    try {
        var _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag)
        return {
            isError: false,
            content: _tag == '' ? null : _tag
        }
    } catch (error) {
        return {
            isError: true,
            message: error.message
        }
    }
}




/***
 *      Returns an array of list items
 */
function assignList(arrayOfValues) {

    let listValues = '';

    for (let i = 0; i < arrayOfValues.length; i++) {

        listValues += '<li class="tag">' + arrayOfValues[i].trim() + '</li>';
    }

    return listValues;
}




/***
 *      Write the document
 */
function writeDocument(array) {

    for (let i = 0; i < array.length; i++) {

        document.write(array[i]);
    }
}




/***
 *      Main
 */
try {


    /***
     *      Dictionary of content
     * */
    let minorDict = {
        
        itemName:           getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle:       getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
        headline:           getContentValues('<t4 type="content" name="Headline" output="normal" modifiers="striptags,htmlentities" />'),
        fullTextLink:       getContentValues('<t4 type="content" name="Headline" output="fulltext" use-element="true" filename-element="Headline" modifiers="striptags,htmlentities" />'),
        publishedDate:      getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="" />'),
        articleSummary:     getContentValues('<t4 type="content" name="Article Subtitle" output="normal" modifiers="striptags,htmlentities" />'),
        articleFullBody:    getContentValues('<t4 type="content" name="Article Body" output="normal" modifiers="medialibrary,nav_sections" />'),
        pinned:             getContentValues('<t4 type="content" name="Pinned" output="normal" display_field="value" />'),
        catTags:            getContentValues('<t4 type="content" name="Category" output="normal" display_field="name" />'),
        linkPath:           getContentValues('<t4 type="content" name="External Link" output="normal" modifiers="striptags,htmlentities" />'),
        linkText:           getContentValues('<t4 type="content" name="External Link Title" output="normal" modifiers="striptags,htmlentities" />'),
        contentId:          getContentValues('<t4 type="meta" meta="content_id" />')
    }

    // var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />");
    // var headline = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Headline' output='normal' display_field='value' />");
    // var articleSummary = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Abstract' output='normal' display_field='value' />");
    // var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Body' output='normal' display_field='value' />");
    // var publishedDate = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Publish Date' output='normal' date_format='MMMM d, yyyy' />");
    // var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
    // var fieldTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category' output='normal' display_field='name' />");
    // var pinned = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Pinned' output='normal' display_field='value' />");
    // var inTheNewsLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' modifiers='htmlentities,js-var' />");
    // var inTheNewsLinkTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link Title' output='normal' display_field='value' />");    
    // var internalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Internal SU Link' output='linkurl' modifiers='nav_sections' />");
    // var internalLinkTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Internal SU Link' output='linktext' modifiers='nav_sections' />");
    // var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />"); 




    /***
     *  Initialize defaults
     * 
     * */
    let listOfCats = "<div class='newsroomArticle tags hidden'>No Tags Entered</div>";
    let openCardBody = '<div class="newsroomArticleBlurb container card-body"><div class="row px-0">';
    let closeCardBody = '</div></div>';
    let openHidden = '<div class="searchSortFields visually-hidden">';
    let closeHidden = '</div>';
    var hyphen = " | ";
    var events = "Events";
    var announcements = "Announcements";
    var suLawInTheNews = "SU Law in the News";
    let dateline = '<p class="newsroomArticlePublishedDate">' + minorDict.publishedDate.content + '</p>';
    let beginningHTML = '<article class="newsroomMinorFeedItem newsroomBlurb card border-0" aria-label="' + minorDict.headline.content + '" id="minor' + minorDict.contentId.content + '" />">';
    var endingHTML = '<hr class="articleBorderBottom"></article>';




    /***
     *  modify headline if special topic present
     * 
     * */
    function modifyWrapper(htmlClass) {

        beginningHTML = '<article class="newsroomMinorFeedItem newsroomBlurb card border-0 ' + htmlClass + '" aria-label="' + minorDict.headline.content + '" id="minor' + minorDict.contentId.content + '" />">';

    }




    /***
     *  modify dateline if special topic present
     * 
     * */
    function modifyDateline(specialTopic) {

        dateline = '<p class="newsroomArticlePublishedDate">' + minorDict.publishedDate.content + hyphen + '<span class="newsroomArticleSpecialCategory">' + specialTopic + '</span></p>';

    }




    /***
     *  process and prioritize special topics
     * 
     * */
    switch (minorDict.catTags.content) {

        case (minorDict.catTags.content.includes(suLawInTheNews)):
            modifyWrapper(suLawInTheNews);
            modifyDateline(suLawInTheNews);
            break;

        case (minorDict.catTags.content.includes(announcements)):
            modifyWrapper(announcements);
            modifyDateline(announcements);
            break;

        case (minorDict.catTags.content.includes(events)):
            modifyWrapper(events);
            modifyDateline(events);
            break;
    }




    /***
     *  process categories
     * 
     * */
    if (minorDict.catTags.content) {

        let arrayOfCats = minorDict.catTags.content.split(',');
        let listItems = assignList(arrayOfCats);

        // Print any tags that were selected
        listOfCats = '<div class="newsroomArticle tags topics visually-hidden"><ul class="categories">' + listItems + '</ul></div><br>';
    }




    /***
     *  process link
     * 
     * */
    let  publishedLink =    (minorDict.linkPath.content && minorDict.linkText.content)
                            ? '<span class="externalLink credits"><a href="' + minorDict.linkPath.content + '" class="card-link" target="_blank" aria-label="Visit ' + minorDict.linkText.content + '"><em>' + minorDict.linkText.content + '</em></a></span>'
                            : '<span class="externalLink visually-hidden">No Proper Link Provided</span>';




    /***
     *  determine if the article contains full text content
     * 
     * */
    let titleLink = (minorDict.articleFullBody.content && minorDict.headline.content)
                    ? '<h3 class="newsroomArticleTitle card-title"><a href="' + minorDict.fullTextLink.content + '" class="card-link" aria-label="Read the full article at: ' + minorDict.headline.content + '" >' + headline + '</a></h3>'
                    : '<h3 class="newsroomArticleTitle card-title">' + minorDict.itemName.content + '</h3>';




    /***
     *  parse for summary
     * 
     * */
    let summaryString = (minorDict.articleSummary.content)
                        ? '<p class="newsroomArticleLead card-text">' + minorDict.articleSummary.content + '</p>'
                        : '<p class="newsroomArticleLead card-text visually-hidden">No Summary Provided</p>';




    /***
     *  parse for pinned item
     * 
     * */
    let pinnedItem =    (minorDict.pinned.content)
                        ? '<div class="visually-hidden"><span class="articlePinned">' + minorDict.pinned.content + '</span></div>'
                        : '<div class="visually-hidden"><span class="articlePinned">No Pin Entered</span></div>';




    /***
     *  Write the document once
     * 
     * */
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, anchorTag));
    document.write('<div class="newsroomArticleBlurb container card-body"><div class="row px-0">');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, publishedLink));
    // document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, internalLinkString));
    document.write('<span class="newsroomArticleLead card-text"><p>' + articleSummary + '</p></span>');
    document.write(dateline);
    document.write(listOfCats);
    document.write('<div class="hidden"><span class="articlePinned">' + pinned + '</span></div>');
    document.write('</div></div>'); // close newsroomArticleBlurb and row divs
    document.write(endingHTML);



    /***
     *  write document once
     * 
     * */
    writeDocument (
        [
            beginningHTML,
            openCardBody,
            titleLink,

            publishedLink,

            summaryString,
            dateline,
            openHidden,
            listOfCats,
            pinnedItem,
            closeHidden,
            closeCardBody,
            endingHTML
        ]
    );




} catch (err) {
    document.write(err.message);
}
