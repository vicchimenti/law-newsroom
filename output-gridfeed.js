/***
 *     @author Victor Chimenti, MSCS
 *     @see Seattle University School of Law News Center Gridfeed
 *     @file output-gridfeed.js
 *          Law - Newscenter Story
 *          ID: 5296
 *
 *     This new content type layout is a smart layout for news items that must obey
 *     a masonry grid layout.
 *
 *     Document will write once when the page loads
 *
 *     @version 7.2
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
 function getMediaInfo(mediaID) {
 
     let mediaManager = ApplicationContextProvider.getBean(IMediaManager);
     let media = mediaManager.get(mediaID, language);
 
     return media;
 }
 
 
 
 
 /***
  *      Returns a media stream object
  */
 function readMedia(mediaID) {
 
     let mediaObj = getMediaInfo(mediaID);
     let oMediaStream = mediaObj.getMedia();
 
     return oMediaStream;
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
 *      Write the document
 */
try {


    /***
     *      Dictionary of content
     * */
    let gridDict = {

        contentName:        getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle:       getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
        headline:           getContentValues('<t4 type="content" name="Headline" output="normal" modifiers="striptags,htmlentities" />'),
        frontPageImage:     getContentValues('<t4 type="content" name="Main Image" output="normal" formatter="path/*" />'),
        articleSummary:     getContentValues('<t4 type="content" name="Article Subtitle" output="normal" modifiers="striptags,htmlentities" />'),
        articleFullBody:    getContentValues('<t4 type="content" name="Article Body" output="normal" modifiers="medialibrary,nav_sections" />'),
        publishedDate:      getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        externalLink:      getContentValues('<t4 type="content" name="External Link" output="normal" modifiers="striptags,htmlentities" />'),
        externalLinkText:  getContentValues('<t4 type="content" name="External Link Title" output="normal" modifiers="striptags,htmlentities" />'),
        sectionLink:       getContentValues('<t4 type="content" name="Internal SU Link" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText:   getContentValues('<t4 type="content" name="Internal SU Link" output="linktext" modifiers="nav_sections" />'),
        fullTextLink:       getContentValues('<t4 type="content" name="Headline" output="fulltext" use-element="true" filename-element="Headline" modifiers="striptags,htmlentities" />'),
        catTags:            getContentValues('<t4 type="content" name="Category" output="normal" display_field="name" />'),
        catPin:             getContentValues('<t4 type="content" name="Category Pin" output="normal" display_field="value" />'),
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
    // var articleSubtitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Subtitle' output='normal' display_field='value' />");
    // var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Body' output='normal' display_field='value' />");
    // var author = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Author' output='normal' display_field='value' />");
    // var publishedDate = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Publish Date' output='normal' date_format='MMMM d, yyyy' />");
    // var externalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' modifiers='htmlentities,js-var' />");
    // var externalLinkText = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link Title' output='normal' display_field='value' />");    
    // var sectionLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Internal SU Link' output='linkurl' modifiers='nav_sections' />");
    // var sectionLinkText = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Internal SU Link' output='linktext' modifiers='nav_sections' />");
    // var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Headline' output='fulltext' use-element='true' filename-element='Headline' modifiers='striptags,htmlentities' />");
    // var catTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category' output='normal' display_field='name' />");
    // var pinned = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Pinned' output='normal' display_field='value' />");
    // var catPin = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category Pin' output='normal' display_field='value' />");
    // var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />"); 




    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
     let openCardBody = '<div class="newsroomArticleBlurb container card-body"><div class="row px-0">';
     let closeCardBody = '</div></div>';
     let openHidden = '<div class="searchSortFields visually-hidden">';
     let closeHidden = '</div>';
     let imageString = '<span class="imageString hidden visually-hidden" />No Image Provided</span>';
     let openImageWrapper = '<figure class="figure hidden visually-hidden">';
     let closeImageWrapper = '</figure>';
     let listOfCats = '<div class="newsroomArticle tags hidden">No Tags Entered</div>';
     let hyphen = " | ";
     let events = 'Events';
     let announcements = 'Announcements';
     let suLawInTheNews = 'In the News';
     let openFooter = '<div class="card-footer">'
     let closeFooter = '</div>';

     let summaryString = '<span class="newsroomArticleLead subtitle card-text"><p>' + gridDict.articleSummary.content + '</p></span>';
     let dateline = '<medium class="newsroomArticlePublishedDate">' + gridDict.publishedDate.content + '</medium>';


    // var cardText = "<span class='newsroomArticleLead card-text subtitle'><p>" + articleSubtitle + "</p></span>";
    // var titleLink = "";
    var listItems = "";
    var listOfTags = "";
    var publishedLink = "";
    // var thumbNailString = "";

    var beginningHTML = '<article class="gridFeedItem newsroomBlurb card shadow col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-4" id="newsGrid' + gridDict.contentId.content + '" aria-label="' + gridDict.headline.content + '" >';
    var endingHTML = '</article>';




    /***
     *  parse the list of tags, add <li> tags
     * 
     * */
    // if (catTags != "") {
    //     var arrayOfTags = catTags.split(',');
    //     for (let i = 0; i < arrayOfTags.length; i++) {
    //         listItems += '<li class="tag">' + arrayOfTags[i] + '</li>';
    //     }
    //     listOfTags = '<div class="newsroomArticle tags hidden"><ul class="categories">' + listItems + '</ul></div>';
    // }

        /***
     *  parse the list of tags, add <li> tags
     *  whenever there is tag we check for special topics
     *      events, announcements and su law in the news
     * 
     *  when a special topic is present we parse for valid links
     * 
     * */
//     if (catTags != "") {
//     var arrayOfTags = catTags.split(',');
//     for (let i = 0; i < arrayOfTags.length; i++) {
//         let currentItem = arrayOfTags[i].trim();
//         listItems += '<li class="tag">' + currentItem + '</li>';
//     }

//     // Print any tags that were selected
//     listOfTags = '<div class="newsroomArticle tags hidden"><ul class="categories">' + listItems + '</ul></div>';
    
//     // when tags exist check for Special Categories - SU Law in the News
//     if (catTags.includes("SU Law in the News")) {
//         beginningHTML = '<div class="gridFeedItem newsroomBlurb card shadow col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 lawInTheNews" title="' + articleTitle + '" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main" />">';
//         dateline = '<p class="newsroomArticlePublishedDate">' + publishedDate + hyphen + '<span class="newsroomArticleSpecialCategory">' + suLawInTheNews + '</span></p>';

//         // parse law in news for external link to original story
//         if (externalLink == "" || externalLinkText == "") {
//             externalLinkString = '<span class="externalLink hidden">No Proper Link Provided</span>';
//         } else {
//             externalLinkString = '<span class="externalLink credits"><a href="' + externalLink + '" title="' + externalLinkText + '" target="_blank" class="card-link"><em>' + externalLinkText + '</em></a></span>';
//         }

//         // assign link value for publishing
//         publishedLink = externalLinkString;
        
//     // when tags exist check for Special Categories - Announcements
//     } else if (catTags.includes("Announcements")) {
//         beginningHTML = '<div class="gridFeedItem newsroomBlurb card shadow col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 lawAnnouncements" title="' + articleTitle + '" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main" />">';
//         dateline = '<p class="newsroomArticlePublishedDate">' + publishedDate + hyphen + '<span class="newsroomArticleSpecialCategory">' + announcements + '</span></p>';

//         // parse announcements for internal link to origin
//         if (sectionLink == "") {
//             internalLinkString = '<span class="sectionLink hidden">No Proper Link Provided</span>';
//         } else {
//             internalLinkString = '<span class="sectionLink credits"><a href="' + sectionLink + '" title="' + sectionLinkText + '" target="_blank" class="card-link"><em>' + sectionLinkText + '</em></a></span>';
//         }

//         // assign link value for publishing
//         publishedLink = internalLinkString;
        
//     // when tags exist check for Special Categories - Announcements
//     } else if (catTags.includes("Events")) {
//         beginningHTML = '<div class="gridFeedItem newsroomBlurb card shadow col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 lawEvents" title="' + articleTitle + '" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main" />">';
//         dateline = '<p class="newsroomArticlePublishedDate">' + publishedDate + hyphen + '<span class="newsroomArticleSpecialCategory">' + events + '</span></p>';

//         // parse events for internal link to origin
//         if (sectionLink == "") {
//             internalLinkString = '<span class="sectionLink hidden">No Proper Link Provided</span>';
//         } else {
//             internalLinkString = '<span class="sectionLink credits"><a href="' + sectionLink + '" title="' + sectionLinkText + '" target="_blank" class="card-link"><em>' + sectionLinkText + '</em></a></span>';
//         }

//         // assign link value for publishing
//         publishedLink = internalLinkString;
//     }
// }




    /***
     *  determine if the article contains full text content
     * 
     * */
    // if (articleFullBody == "") {
    //     titleLink = '<h3 class="newsroomArticleTitle card-title">' + headline + '</h3>';
    // } else {
    //     titleLink = '<h3 class="newsroomArticleTitle card-title"><a href="' + fullTextLink + '">' + headline + '</a></h3>';
    // }




    /***
     *  verify Main image and photo credits
     * 
     * */
    if (frontPageImage == "") {
        thumbNailString = '<span class="newsroomImageWrapper hidden">No Image Provided</span>';

    } else {
        thumbNailString = '<span class="newsroomImageWrapper"><img src="' + frontPageImage + '" class="articleImage card-img-top" alt="' + frontPageImageCaption + '" /></span>';
    }




    /***
     *  determine if the article contains full text content
     * 
     * */
    let titleLink = (gridDict.articleFullBody.content)
                    ? '<h3 class="newsroomArticleTitle card-title"><a href="' + gridDict.fullTextLink.content + '" class="card-link" title="Read the full article at: ' + gridDict.headline.content + '" >' + gridDict.headline.content + '</a></h3>'
                    : '<h3 class="newsroomArticleTitle card-title">' + gridDict.headline.content + '</h3>';




    /***
     *  verify category pin
     * 
     * */
    let pinnedCat = gridDict.catPin.content
                    ? '<span class="catPinned">' + gridDict.catPin.content + '</span>'
                    : '<span class="catPinned">No Pin Selected</span>';




    /***
     *  default section link
     * 
     * */
    let publishedLink = (gridDict.sectionLink.content && gridDict.sectionLinkText.content)
                        ? '<span class="newsLink credits"><a class="card-link" target="_blank" href="' + gridDict.sectionLink.content + '" title="Visit ' + gridDict.sectionLinkText.content + '"><em>' + gridDict.sectionLinkText.content + '</em></a></span>'
                        : (gridDict.externalLink.content && gridDict.externalLinkText.content)
                        ? '<span class="newsLink credits"><a class="card-link" target="_blank" href="' + gridDict.externalLink.content + '" title="Visit ' + gridDict.externalLinkText.content + '"><em>' + gridDict.externalLinkText.content + '</em></a></span>'
                        : '<span class="newsLink visually-hidden">No Proper Link Provided</span>';




    /***
     *  process categories
     * 
     * */
    if (gridDict.catTags.content) {

        let arrayOfCats = gridDict.catTags.content.split(',');
        let listItems = assignList(arrayOfCats);

        // Print any tags that were selected
        listOfCats = '<div class="newsroomArticle tags topics"><ul class="categories">' + listItems + '</ul></div><br>';
    }




    /***
     *  Write the document once
     * 
     * */
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
    // document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, anchorTag));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, thumbNailString));
    document.write('<div class="newsroomArticleBlurb card-body">');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, publishedLink));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, cardText));
    document.write('</div>'); // close newsroomArticleBlurb
    document.write('<div class="card-footer"><medium class="newsroomArticlePublishedDate">' + publishedDate + '</medium></div>');
    document.write(listOfTags);
    document.write('<div class="hidden"><span class="articlePinned">' + pinned + '</span><span class="catPinned">' + catPin + '</span></div>');
    document.write(endingHTML);




    /***
     *  write document once
     * 
     * */
    writeDocument (
        [
            beginningHTML,

            openImageWrapper,

            imageString,
            closeImageWrapper,

            openCardBody,
            titleLink,
            publishedLink,
            summaryString,
            openHidden,
            pinnedCat,
            listOfCats,
            closeHidden,
            closeCardBody,
            openFooter,
            dateline,
            closeFooter,
            endingHTML
        ]
    );




} catch (err) {
    document.write(err.message);
}
