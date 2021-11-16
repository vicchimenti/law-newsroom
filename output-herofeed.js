/***
 *      @author Victor Chimenti, MSCS
 *      @see Seattle University School of Law Newsroom
 *      @file output-herofeed.js
 *          Law - Newscenter Story
 *          ID: 5296
 *
 *      Document will write once when the page loads
 *
 *      @version 3.4
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
 
     var mediaManager = ApplicationContextProvider.getBean(IMediaManager);
     var media = mediaManager.get(mediaID, language);
 
     return media;
 }
 
 
 
 
 /***
  *      Returns a media stream object
  */
 function readMedia(mediaID) {
 
     var mediaObj = getMediaInfo(mediaID);
     var oMediaStream = mediaObj.getMedia();
 
     return oMediaStream;
 }
 
 
 
 
 /***
  *      Write the document
  */
 function writeDocument(array) {
 
     for (let i = 0; i < array.length; i++) {
 
         document.write(array[i]);
     }
 }




try {


    /***
     *      Dictionary of content
     * */
    let heroDict = {

        contentName:            getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle:           getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
        headline:               getContentValues('<t4 type="content" name="Headline" output="normal" modifiers="striptags,htmlentities" />'),
        frontPageImage:         getContentValues('<t4 type="content" name="Main Image" output="normal" formatter="path/*" />'),
        articleFullBody:        getContentValues('<t4 type="content" name="Article Body" output="normal" modifiers="medialibrary,nav_sections" />'),
        publishedDate:          getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        pinned:                 getContentValues('<t4 type="content" name="Pinned" output="normal" display_field="value" />'),
        fullTextLink:           getContentValues('<t4 type="content" name="Headline" output="fulltext" use-element="true" filename-element="Headline" modifiers="striptags,htmlentities" />'),
        contentId:              getContentValues('<t4 type="meta" meta="content_id" />')

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
    // var fieldTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category' output='normal' display_field='name' />");
    // var pinned = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Pinned' output='normal' display_field='value' />");
    // var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />"); 




    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
    // var listOfTags = "";
    var titleLink = "";
    // var listItems = "";
    // var listOfTags = "";
    // var photoCredit = "";
    // var authorByLine = "";
    var imageString = '<span class="newsroomImageWrapper"><img src="' + frontPageImage + '" class="articleImage card-img-top" alt="' + frontPageImageCaption + '" /></span>';
    var beginningHTML = '<div class="newsroomHeroFeedItem newsroomBlurb col-12 col-xs-12 card border-0" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
    var endingHTML = '<hr class="articleBorderBottom"></div>';




    /***
     *  determine if the article contains full text content
     * 
     * */
    let titleLink = (heroDict.articleFullBody.content)
                    ? '<h3 class="newsroomArticleTitle card-title"><a href="' + heroDict.fullTextLink.content + '" class="card-link" title="Read the full article at: ' + heroDict.headline.content + '" >' + heroDict.headline.content + '</a></h3>'
                    : '<h3 class="newsroomArticleTitle card-title">' + heroDict.headline.content + '</h3>';




    /***
     *  parse for pinned item
     * 
     * */
    let pinnedItem =    (heroDict.pinned.content)
                        ? '<div class="visually-hidden"><span class="articlePinned">' + heroDict.pinned.content + '</span></div>'
                        : '<div class="visually-hidden"><span class="articlePinned">No Pin Entered</span></div>';




    /***
     *  parse the list of tags, add <li> tags
     * 
     * */
    // if (fieldTags != "") {
    //     var arrayOfTags = fieldTags.split(',');
    //     for (let i = 0; i < arrayOfTags.length; i++) {
    //         listItems += '<li class="tag">' + arrayOfTags[i] + '</li>';
    //     }
    //     listOfTags = '<div class="newsroomArticle tags"><ul class="categories">' + listItems + '</ul></div>';
    // }


    /***
     *  determine which link, if any, goes in the title
     *  and determine if a unique headline was added
     *  if no headline is added then use the title
     * 
     * */
    // if (headline == "" && articleFullBody == "") {
    //     titleLink = '<h3 class="newsroomArticleTitle card-title">' + articleTitle + '</h3>';
    // } else if (articleFullBody == "") {
    //     titleLink = '<h3 class="newsroomArticleTitle card-title">' + headline + '</h3>';
    // } else if (headline == "") {
    //     titleLink = '<h3 class="newsroomArticleTitle card-title"><a href="' + fullTextLink + '">' + articleTitle + '</a></h3>';
    // } else {
    //     titleLink = '<h3 class="newsroomArticleTitle card-title"><a href="' + fullTextLink + '">' + headline + '</a></h3>';
    // }


    /***
     *  display byline only when provided 
     * 
     * */
    // if (author == "") {
    //     authorByLine = '<p class="byLine hidden">No Author Provided</p>';
    // } else {
    //     authorByLine = '<p class="byLine">By ' + author + '</p>';
    // }
    // if (photoCredit == "") {
    //     photoCredit = '<p class="byLine hidden">No Photographer Provided</p>';
    // } else {
    //     photoCredit = '<p class="byLine">Image credit: ' + frontPageImageCredit + '</p>';
    // }



    /***
     *  verify Main image and photo credits
     * 
     * */
    if (frontPageImage == "") {
        imageString = '<span class="newsroomImageWrapper hidden">No Image Provided</span>';
        // photoCredit = '<p class="byLine hidden">No Photographer Provided</p>';

    } else {
        imageString = '<span class="newsroomImageWrapper"><img src="' + frontPageImage + '" class="articleImage card-img-top" alt="' + frontPageImageCaption + '" /></span>';
        // photoCredit = '<p class="byLine hidden">No Photographer Provided</p>';
    }




    /***
     *  Write the document once
     * 
     * */
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, anchorTag));

    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, imageString));
    document.write('<div class="newsroomArticleBlurb container card-body"><div class="row px-0">');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
    document.write('</div></div>'); // close newsroomArticleBlurb and row divs
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
