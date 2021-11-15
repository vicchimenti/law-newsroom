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
 *     @version 2.28
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
 




try {


    /***
     *      Dictionary of content
     * */
    var majorDict = {

        frontPageImageCredit:   getContentValues('<t4 type="content" name="Main Image Credit" output="normal" modifiers="striptags,htmlentities" />'),
        author:                 getContentValues('<t4 type="content" name="Author" output="normal" modifiers="striptags,htmlentities" />'),
        pinned:                 getContentValues('<t4 type="content" name="Pinned" output="normal" display_field="value" />'),
        catTags:                getContentValues('<t4 type="content" name="Category" output="normal" display_field="name" />'),
        contentName:            getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle:           getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
        headline:               getContentValues('<t4 type="content" name="Headline" output="normal" modifiers="striptags,htmlentities" />'),
        articleSummary:         getContentValues('<t4 type="content" name="Abstract" output="normal" modifiers="striptags,htmlentities" />'),
        articleFullBody:        getContentValues('<t4 type="content" name="Article Body" output="normal" modifiers="medialibrary,nav_sections" />'),
        publishedDate:          getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        frontPageImage:         getContentValues('<t4 type="content" name="Main Image" output="normal" formatter="path/*" />'),
        frontPageImageCaption:  getContentValues('<t4 type="content" name="Main Image Caption" output="normal" modifiers="striptags,htmlentities" />'),
        fullTextLink:           getContentValues('<t4 type="content" name="Headline" output="fulltext" use-element="true" filename-element="Headline" modifiers="striptags,htmlentities" />'),
        externalLink:           getContentValues('<t4 type="content" name="External Link" output="normal" modifiers="striptags,htmlentities" />'),
        externalLinkText:       getContentValues('<t4 type="content" name="External Link Title" output="normal" modifiers="striptags,htmlentities" />'),
        sectionLink:            getContentValues('<t4 type="content" name="Internal SU Link" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText:        getContentValues('<t4 type="content" name="Internal SU Link" output="linktext" modifiers="nav_sections" />'),
        contentID:              getContentValues('<t4 type="meta" meta="content_id" />')

    }




    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */

    let openCardBody = '<div class="newsroomArticleBlurb container card-body"><div class="row px-0">';
    let closeCardBody = '</div></div>';
    let openHidden = '<div class="searchSortFields visually-hidden">';
    let closeHidden = '</div>';
    let summaryString = '<span class="newsroomArticleLead card-text"><p>' + majorDict.articleSummary.content + '</p></span>';
    var imageString = '<span class="imageString hidden visually-hidden" />No Image Provided</span>';
    var openImageWrapper = '<figure class="figure hidden visually-hidden">';
    var closeImageWrapper = '</figure>';

    var listOfCats = "<div class='newsroomArticle tags hidden'>No Tags Entered</div>";
    var titleLink = "";
    var listItems = "";
    var photoCredit = "";
    var authorByLine = "";
    var externalLinkString = "";
    var internalLinkString = "";
    var publishedLink = "";
    var hyphen = " | ";
    var events = "Events";
    var announcements = "Announcements";
    var suLawInTheNews = "SU Law in the News";
    var dateline = '<p class="newsroomArticlePublishedDate">' + majorDict.publishedDate.content + '</p>';
    var beginningHTML = '<article class="newsroomMajorFeedItem newsroomBlurb card border-0" id="major' + majorDict.contentID.content + '" aria-label="' + majorDict.headline.content + '" data-position-default="Main" data-position-selected="Main">';
    var endingHTML = '<hr class="articleBorderBottom"></article>';




    /***
     *  modify headline if special topic present
     * 
     * */
    function modifyWrapper(htmlClass) {

        beginningHTML = '<article class="newsroomMinorFeedItem newsroomBlurb card border-0 ' + htmlClass + '" aria-label="' + majorDict.headline.content + '" id="minor' + majorDict.contentId.content + '" />';
    }
    
    
    
    
    /***
     *  modify dateline if special topic present
     * 
     * */
    function modifyDateline(specialTopic) {

        dateline = '<p class="newsroomArticlePublishedDate">' + majorDict.publishedDate.content + hyphen + '<span class="newsroomArticleSpecialCategory">' + specialTopic + '</span></p>';
    }








    /***
     *  determine if the article contains full text content
     * 
     * */
    if (majorDict.articleFullBody.content) {

        titleLink = '<h3 class="newsroomArticleTitle card-title"><a href="' + majorDict.fullTextLink.content + '" class="card-link" title="Read the full article at: ' + majorDict.headline.content + '">' + majorDict.headline.content + '</a></h3>';

    } else {

        titleLink = '<h3 class="newsroomArticleTitle card-title">' + majorDict.headline.content + '</h3>';

    }




    /***
     *  Parse for image
     * 
     * */
    if (majorDict.frontPageImage.content) {

        var imageID = content.get('Main Image').getID();
        var mediaInfo = getMediaInfo(imageID);
        var media = readMedia(imageID);
        var info = new ImageInfo;
        info.setInput(media);

        let imageDefaultAlt = majorDict.frontPageImageCaption.content ? majorDict.frontPageImageCaption.content : majorDict.articleTitle.content;

        imageString =   (info.check())
                        ? '<img src="' + majorDict.frontPageImage.content + '" class="articleImage figure-img card-img-top" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" />'
                        : '<img src="' + majorDict.frontPageImage.content + '" class="articleImage figure-img card-img-top" alt="' + imageDefaultAlt + '" loading="auto" />';
    
        openImageWrapper = '<figure class="figure">';
    }




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
            closeHidden,
            closeCardBody,
            endingHTML
        ]
    );




} catch (err) {
    document.write(err.message);
}
