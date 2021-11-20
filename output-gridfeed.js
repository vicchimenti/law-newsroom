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
 *     @version 7.8
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

        contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle: getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
        headline: getContentValues('<t4 type="content" name="Headline" output="normal" modifiers="striptags,htmlentities" />'),
        frontPageImage: getContentValues('<t4 type="content" name="Main Image" output="normal" formatter="path/*" />'),
        articleSummary: getContentValues('<t4 type="content" name="Article Subtitle" output="normal" modifiers="striptags,htmlentities" />'),
        articleFullBody: getContentValues('<t4 type="content" name="Article Body" output="normal" modifiers="medialibrary,nav_sections" />'),
        publishedDate: getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        externalLink: getContentValues('<t4 type="content" name="External Link" output="normal" modifiers="striptags,htmlentities" />'),
        externalLinkText: getContentValues('<t4 type="content" name="External Link Title" output="normal" modifiers="striptags,htmlentities" />'),
        sectionLink: getContentValues('<t4 type="content" name="Internal SU Link" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText: getContentValues('<t4 type="content" name="Internal SU Link" output="linktext" modifiers="nav_sections" />'),
        fullTextLink: getContentValues('<t4 type="content" name="Article Title" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        catTags: getContentValues('<t4 type="content" name="Category" output="normal" display_field="name" />'),
        catPin: getContentValues('<t4 type="content" name="Category Pin" output="normal" display_field="value" />'),
        contentId: getContentValues('<t4 type="meta" meta="content_id" />')

    }




    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
    let openCardBody = '<div class="newsroomArticleBlurb card-body"><div class="row px-0">';
    let closeCardBody = '</div></div>';
    let openHidden = '<div class="searchSortFields visually-hidden">';
    let closeHidden = '</div>';
    let imageString = '<span class="imageString hidden visually-hidden" />No Image Provided</span>';
    let openImageWrapper = '<figure class="figure newsroomImageWrapper visually-hidden">';
    let closeImageWrapper = '</figure>';
    let listOfCats = '<div class="newsroomArticle tags hidden">No Tags Entered</div>';
    let openFooter = '<div class="card-footer">'
    let closeFooter = '</div>';
    let summaryString = '<span class="newsroomArticleLead subtitle card-text"><p>' + gridDict.articleSummary.content + '</p></span>';
    let dateline = '<medium class="newsroomArticlePublishedDate">' + gridDict.publishedDate.content + '</medium>';
    let beginningHTML = '<article class="gridFeedItem newsroomBlurb card shadow col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-4" id="newsGrid' + gridDict.contentId.content + '" aria-label="' + gridDict.headline.content + '" >';
    let endingHTML = '</article>';




    /***
     *  determine if the article contains full text content
     * 
     * */
    let titleLink = (gridDict.articleFullBody.content) ?
        '<h3 class="newsroomArticleTitle card-title"><a href="' + gridDict.fullTextLink.content + '" class="card-link" title="Read the full article at: ' + gridDict.headline.content + '" >' + gridDict.headline.content + '</a></h3>' :
        '<h3 class="newsroomArticleTitle card-title">' + gridDict.headline.content + '</h3>';




    /***
     *  verify category pin
     * 
     * */
    let pinnedCat = gridDict.catPin.content ?
        '<span class="catPinned">' + gridDict.catPin.content + '</span>' :
        '<span class="catPinned">No Pin Selected</span>';




    /***
     *  default section link
     * 
     * */
    let publishedLink = (gridDict.sectionLink.content && gridDict.sectionLinkText.content) ?
        '<span class="newsLink credits"><a class="card-link" target="_blank" href="' + gridDict.sectionLink.content + '" title="Visit ' + gridDict.sectionLinkText.content + '"><em>' + gridDict.sectionLinkText.content + '</em></a></span>' :
        (gridDict.externalLink.content && gridDict.externalLinkText.content) ?
        '<span class="newsLink credits"><a class="card-link" target="_blank" href="' + gridDict.externalLink.content + '" title="Visit ' + gridDict.externalLinkText.content + '"><em>' + gridDict.externalLinkText.content + '</em></a></span>' :
        '<span class="newsLink visually-hidden">No Proper Link Provided</span>';




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
     *  Parse for image
     * 
     * */
    if (gridDict.frontPageImage.content) {

        let imageID = content.get('Main Image').getID();
        let mediaInfo = getMediaInfo(imageID);
        let media = readMedia(imageID);
        let info = new ImageInfo;
        info.setInput(media);

        let imageDefaultAlt = gridDict.articleTitle.content;

        imageString = (info.check()) ?
            '<img src="' + gridDict.frontPageImage.content + '" class="articleImage figure-img card-img-top" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" />' :
            '<img src="' + gridDict.frontPageImage.content + '" class="articleImage figure-img card-img-top" alt="' + imageDefaultAlt + '" loading="auto" />';

        openImageWrapper = '<figure class="figure newsroomImageWrapper">';
    }




    /***
     *  write document once
     * 
     * */
    writeDocument(
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