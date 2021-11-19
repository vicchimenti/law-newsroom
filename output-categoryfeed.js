/***
 *     @author Victor Chimenti, MSCS
 *     @see Seattle University School of Law News Center Category
 *     @file output-categoryfeed.js
 *          Law - Newscenter Story
 *          ID: 5296
 *
 *     This new content type layout is a smart layout for all items in the
 *     category newsfeed used by the School of Law Newsroom.
 *
 *     Document will write once when the page loads
 *
 *     @version 6.2
 */








/***
 *      Import T4 Utilities
 */
 importClass(com.terminalfour.media.IMediaManager);
 importClass(com.terminalfour.spring.ApplicationContextProvider);
 importClass(com.terminalfour.publish.utils.BrokerUtils);
 importClass(com.terminalfour.media.utils.ImageInfo);
 
 
 
 
/***
 *      Extract values from T4 element tags
 *      and confirm valid existing content item field
 */
function getContentValues(tag) {
    try {
        let _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag)
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
 *      Returns a media object
 */
// function getMediaInfo(mediaID) {

//     let mediaManager = ApplicationContextProvider.getBean(IMediaManager);
//     let media = mediaManager.get(mediaID, language);

//     return media;
// }




/***
 *      Returns a media stream object
 */
// function readMedia(mediaID) {

//     let mediaObj = getMediaInfo(mediaID);
//     let oMediaStream = mediaObj.getMedia();

//     return oMediaStream;
// }




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
    let catDict = {

        contentName:        getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle:       getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
        headline:           getContentValues('<t4 type="content" name="Headline" output="normal" modifiers="striptags,htmlentities" />'),
        articleSummary:     getContentValues('<t4 type="content" name="Abstract" output="normal" modifiers="striptags,htmlentities" />'),
        articleFullBody:    getContentValues('<t4 type="content" name="Article Body" output="normal" modifiers="medialibrary,nav_sections,htmlentities" />'),
        publishedDate:      getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        fullTextLink:       getContentValues('<t4 type="content" name="Article Title" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        catTags:            getContentValues('<t4 type="content" name="Category" output="normal" display_field="name" />'),
        catPin:             getContentValues('<t4 type="content" name="Category Pin" output="normal" display_field="value" />'),
        externalLink:       getContentValues('<t4 type="content" name="External Link" output="normal" modifiers="striptags,htmlentities" />'),
        externalLinkText:   getContentValues('<t4 type="content" name="External Link Title" output="normal" modifiers="striptags,htmlentities" />'),
        sectionLink:        getContentValues('<t4 type="content" name="Internal SU Link" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText:    getContentValues('<t4 type="content" name="Internal SU Link" output="linktext" modifiers="nav_sections" />'),
        contentId:          getContentValues('<t4 type="meta" meta="content_id" />')

    }

    /***
     *  Assign local variables from the content type's fields
     * 
     * */
    // var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />");
    // var headline = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Headline' output='normal' display_field='value' />");
    // var frontPageImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Main Image' output='normal' formatter='path/*' />");
    // var frontPageImageCaption = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Main Image Caption' output='normal' modifiers='striptags,htmlentities' />");
    // var frontPageImageCredit = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Main Image Credit' output='normal' modifiers='striptags,htmlentities' />");
    // var articleSummary = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Abstract' output='normal' display_field='value' />");
    // var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Body' output='normal' display_field='value' />");
    // var author = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Author' output='normal' display_field='value' />");
    // var publishedDate = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Publish Date' output='normal' date_format='MMMM d, yyyy' />");
    // var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Headline' output='fulltext' use-element='true' filename-element='Headline' modifiers='striptags,htmlentities' />");
    // var catTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category' output='normal' display_field='name' />");
    // var pinned = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Pinned' output='normal' display_field='value' />");
    // var isMajor = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Major or Minor' output='normal' display_field='value' />");
    // var catPin = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category Pin' output='normal' display_field='value' />");
    // var externalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' modifiers='htmlentities,js-var' />");
    // var externalLinkText = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link Title' output='normal' display_field='value' />");    
    // var sectionLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Internal SU Link' output='linkurl' modifiers='nav_sections' />");
    // var sectionLinkText = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Internal SU Link' output='linktext' modifiers='nav_sections' />");
    // var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />"); 




    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
     let openCardBody = '<div class="newsroomArticleBlurb container card-body"><div class="row px-0">';
     let closeCardBody = '</div></div>';
     let openHidden = '<div class="searchSortFields visually-hidden">';
     let closeHidden = '</div>';
     let listOfCats = "<div class='newsroomArticle tags hidden'>No Tags Entered</div>";
     let hyphen = " | ";
     let events = "Events";
     let announcements = "Announcements";
     let suLawInTheNews = "In the News";
     let summaryString = '<span class="newsroomArticleLead card-text"><p>' + catDict.articleSummary.content + '</p></span>';
     let dateline = '<p class="newsroomArticlePublishedDate">' + catDict.publishedDate.content + '</p>';
     let beginningHTML = '<article class="newsroomCategoryFeedItem newsroomBlurb col-12 col-xs-12 card border-0" id="category' + catDict.contentId.content + '" aria-label="' + catDict.headline.content + '">';
     let endingHTML = '<hr class="articleBorderBottom"></article>';


    // var listOfTags = "<div class='newsroomArticle tags hidden'>No Tags Entered</div>";
    // var titleLink = "";
    // var listItems = "";
    // var photoCredit = "";
    // var authorByLine = "";
    // var thumbNailString = "";
    // var externalLinkString = "";
    // var internalLinkString = "";
    // var publishedLink = "";
    // var hyphen = " - ";
    // var events = "Events";
    // var announcements = "Announcements";
    // var suLawInTheNews = "SU Law in the News";
    // var dateline = '<p class="newsroomArticlePublishedDate">' + publishedDate + '</p>';
    // var beginningHTML = '<div class="newsroomCategoryFeedItem newsroomBlurb col-12 col-xs-12 card border-0" title="' + articleTitle + '" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main" />">';
    // var endingHTML = '<hr class="articleBorderBottom"></div>';




    /***
     *  modify headline if special topic present
     * 
     * */
    function modifyWrapper(htmlClass) {

        beginningHTML = '<article class="newsroomCategoryFeedItem newsroomBlurb col-12 col-xs-12 card border-0 ' + htmlClass + '" id="category' + catDict.contentId.content + '" aria-label="' + catDict.headline.content + '">';
    }
    
    
    
    
    /***
     *  modify dateline if special topic present
     * 
     * */
    function modifyDateline(specialTopic) {

        dateline = '<p class="newsroomArticlePublishedDate">' + catDict.publishedDate.content + hyphen + '<span class="newsroomArticleSpecialCategory">' + specialTopic + '</span></p>';
    }




    /***
     *  process and prioritize special topics
     * 
     * */
    if (catDict.catTags.content.includes(suLawInTheNews)) {

        modifyWrapper(suLawInTheNews);
        modifyDateline(suLawInTheNews);

    } else if (catDict.catTags.content.includes(announcements)) {

        modifyWrapper(announcements);
        modifyDateline(announcements);

    } else if (catDict.catTags.content.includes(events)) {

        modifyWrapper(events);
        modifyDateline(events);

    }




    /***
     *  process categories
     * 
     * */
    if (catDict.catTags.content) {

        let arrayOfCats = catDict.catTags.content.split(',');
        let listItems = assignList(arrayOfCats);

        // Print any tags that were selected
        listOfCats = '<div class="newsroomArticle tags topics visually-hidden"><ul class="categories">' + listItems + '</ul></div><br>';
    }




    /***
     *  verify category pin
     * 
     * */
    let pinnedCat = (catDict.catPin.content)
                    ? '<span class="catPinned">' + catDict.catPin.content + '</span>'
                    : '<span class="catPinned">No Pin Selected</span>';




    /***
     *  determine if the article contains full text content
     * 
     * */
    let titleLink = (catDict.articleFullBody.content)
                    ? '<h3 class="newsroomArticleTitle card-title"><a class="card-link" target="_blank" href="' + catDict.fullTextLink.content + '"  title="Read the full article at: ' + catDict.headline.content + '">' + catDict.headline.content + '</a></h3>'
                    : '<h3 class="newsroomArticleTitle card-title">' + catDict.headline.content + '</h3>';




    /***
     *  default section link
     * 
     * */
    let publishedLink = (catDict.sectionLink.content && catDict.sectionLinkText.content)
                        ? '<span class="newsLink"><a class="card-link" target="_blank" href="' + catDict.sectionLink.content + '" title="Visit ' + catDict.sectionLinkText.content + '"><em>' + catDict.sectionLinkText.content + '</em></a></span>'
                        : (catDict.externalLink.content && catDict.externalLinkText.content)
                        ? '<span class="newsLink"><a class="card-link" target="_blank" href="' + catDict.externalLink.content + '" title="Visit ' + catDict.externalLinkText.content + '"><em>' + catDict.externalLinkText.content + '</em></a></span>'
                        : '<span class="newsLink visually-hidden">No Proper Link Provided</span>';




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
            pinnedCat,
            listOfCats,
            closeHidden,
            closeCardBody,
            endingHTML
        ]
    );




} catch (err) {
    document.write(err.message);
}
