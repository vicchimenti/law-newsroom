/***
 *     @author Victor Chimenti, MSCS
 *     @see Seattle University School of Law News Center Majorfeed
 *     @file output-majorfeed.js
 *          Law - Newscenter Story
 *          ID: 5296
 *
 *     Document will write once when the page loads
 *
 *     @version 2.36
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
 *      Main
 */
try {


    /***
     *      Dictionary of content
     * */
    let majorDict = {

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
        contentId:              getContentValues('<t4 type="meta" meta="content_id" />')

    }




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
    let listOfCats = "<div class='newsroomArticle tags hidden'>No Tags Entered</div>";
    let hyphen = " | ";
    let events = "Events";
    let announcements = "Announcements";
    let suLawInTheNews = "In the News";
    let summaryString = '<span class="newsroomArticleLead card-text"><p>' + majorDict.articleSummary.content + '</p></span>';
    let dateline = '<p class="newsroomArticlePublishedDate">' + majorDict.publishedDate.content + '</p>';
    let beginningHTML = '<article class="newsroomMajorFeedItem newsroomBlurb card border-0" id="major' + majorDict.contentId.content + '" aria-label="' + majorDict.headline.content + '">';
    let endingHTML = '<hr class="articleBorderBottom"></article>';




    /***
     *  modify headline if special topic present
     * 
     * */
    function modifyWrapper(htmlClass) {

        beginningHTML = '<article class="newsroomMajorFeedItem newsroomBlurb card border-0 ' + htmlClass + '" id="major' + majorDict.contentId.content + '" aria-label="' + majorDict.headline.content + '">';
    }
    
    
    
    
    /***
     *  modify dateline if special topic present
     * 
     * */
    function modifyDateline(specialTopic) {

        dateline = '<p class="newsroomArticlePublishedDate">' + majorDict.publishedDate.content + hyphen + '<span class="newsroomArticleSpecialCategory">' + specialTopic + '</span></p>';
    }




    /***
     *  process and prioritize special topics
     * 
     * */
    if (majorDict.catTags.content.includes(suLawInTheNews)) {

        modifyWrapper(suLawInTheNews);
        modifyDateline(suLawInTheNews);

    } else if (majorDict.catTags.content.includes(announcements)) {

        modifyWrapper(announcements);
        modifyDateline(announcements);

    } else if (majorDict.catTags.content.includes(events)) {

        modifyWrapper(events);
        modifyDateline(events);

    }




    /***
     *  process categories
     * 
     * */
    if (majorDict.catTags.content) {

        let arrayOfCats = majorDict.catTags.content.split(',');
        let listItems = assignList(arrayOfCats);

        // Print any tags that were selected
        listOfCats = '<div class="newsroomArticle tags topics visually-hidden"><ul class="categories">' + listItems + '</ul></div><br>';
    }




    /***
     *  default section link
     * 
     * */
    let publishedLink = (majorDict.sectionLink.content && majorDict.sectionLinkText.content)
                        ? '<span class="newsLink"><a href="' + majorDict.sectionLink.content + '" class="card-link" target="_blank" title="Visit ' + majorDict.sectionLinkText.content + '"><em>' + majorDict.sectionLinkText.content + '</em></a></span>'
                        : (majorDict.externalLink.content && majorDict.externalLinkText.content)
                        ? '<span class="newsLink"><a href="' + majorDict.externalLink.content + '" class="card-link" target="_blank" title="Visit ' + majorDict.externalLinkText.content + '"><em>' + majorDict.externalLinkText.content + '</em></a></span>'
                        : '<span class="newsLink visually-hidden">No Proper Link Provided</span>';




    /***
     *  parse for pinned item
     * 
     * */
    let pinnedItem =    (majorDict.pinned.content)
                        ? '<div class="visually-hidden"><span class="articlePinned">' + majorDict.pinned.content + '</span></div>'
                        : '<div class="visually-hidden"><span class="articlePinned">No Pin Entered</span></div>';




    /***
     *  determine if the article contains full text content
     * 
     * */
     let titleLink =    (majorDict.articleFullBody.content)
                        ? '<h3 class="newsroomArticleTitle card-title"><a href="' + majorDict.fullTextLink.content + '" class="card-link" title="Read the full article at: ' + majorDict.headline.content + '" >' + majorDict.headline.content + '</a></h3>'
                        : '<h3 class="newsroomArticleTitle card-title">' + majorDict.headline.content + '</h3>';




    /***
     *  Parse for image
     * 
     * */
    if (majorDict.frontPageImage.content) {

        let imageID = content.get('Main Image').getID();
        let mediaInfo = getMediaInfo(imageID);
        let media = readMedia(imageID);
        let info = new ImageInfo;
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
            pinnedItem,
            closeHidden,
            closeCardBody,
            endingHTML
        ]
    );




} catch (err) {
    document.write(err.message);
}
