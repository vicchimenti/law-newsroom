/***
 *      @author Victor Chimenti, MSCS
 *      @see Seattle University School of Law Newsroom
 *      @file output-main-herofeed.js
 *          Law - Newscenter Story
 *          ID: 5296
 *          output/main/herofeed
 *
 *      Document will write once when the page loads
 *
 *      @version 4.7
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
 *      and confirm valid existing content item field and trim strings
 */
function getContentValues(tag) {

    try {

        let _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag).trim()

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

        contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle: getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
        headline: getContentValues('<t4 type="content" name="Headline" output="normal" modifiers="striptags,htmlentities" />'),
        frontPageImage: getContentValues('<t4 type="content" name="Main Image" output="normal" formatter="path/*" />'),
        articleFullBody: getContentValues('<t4 type="content" name="Article Body" output="normal" modifiers="medialibrary,nav_sections" />'),
        publishedDate: getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        pinned: getContentValues('<t4 type="content" name="Pinned" output="normal" display_field="value" />'),
        fullTextLink: getContentValues('<t4 type="content" name="Article Title" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        contentId: getContentValues('<t4 type="meta" meta="content_id" />')

    }




    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
    let openCardBody = '<div class="card-body">';
    let closeCardBody = '</div>';
    let openHidden = '<div class="searchSortFields visually-hidden hidden">';
    let closeHidden = '</div>';
    let imageString = '<span class="imageString hidden visually-hidden hidden" />No Image Provided</span>';
    let openFooter = '<div class="card-footer bg-transparent border-0">';
    let closeFooter = '</div>';
    let borderBottom = '<hr class="articleBorderBottom">';
    let beginningHTML = '<article class="mainHeroItem col-xs-12 col-lg-3 card border-0" id="hero' + heroDict.contentId.content + '" aria-label="' + heroDict.headline.content + '">';
    let endingHTML = '</article>';




    /***
     *  determine if the article contains full text content
     * 
     * */
    let titleLink = (heroDict.articleFullBody.content) ?
        '<h3 class="mainHeroTitle card-title"><a href="' + heroDict.fullTextLink.content + '" class="card-link" target="_blank" title="Read the full article at: ' + heroDict.headline.content + '" >' + heroDict.headline.content + '</a></h3>' :
        '<h3 class="mainHeroTitle card-title">' + heroDict.headline.content + '</h3>';




    /***
     *  parse for pinned item
     * 
     * */
    let pinnedItem = (heroDict.pinned.content) ?
        '<div class="visually-hidden hidden"><span class="articlePinned">' + heroDict.pinned.content + '</span></div>' :
        '<div class="visually-hidden hidden"><span class="articlePinned">No Pin Entered</span></div>';




    /***
     *  Parse for image
     * 
     * */
    if (heroDict.frontPageImage.content) {

        var imageID = content.get('Main Image').getID();
        var mediaInfo = getMediaInfo(imageID);
        var media = readMedia(imageID);
        var info = new ImageInfo;
        info.setInput(media);

        let imageDefaultAlt = heroDict.articleTitle.content ? heroDict.articleTitle.content : heroDict.contentName.content;

        imageString = (info.check()) ?
            '<img src="' + heroDict.frontPageImage.content + '" class="mainHeroImage card-img-top" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" />' :
            '<img src="' + heroDict.frontPageImage.content + '" class="mainHeroImage card-img-top" alt="' + imageDefaultAlt + '" loading="auto" />';
    }




    /***
     *  write document once
     * 
     * */
    writeDocument(
        [
            beginningHTML,
            imageString,
            openCardBody,
            titleLink,
            openHidden,
            pinnedItem,
            closeHidden,
            closeCardBody,
            openFooter,
            borderBottom,
            closeFooter,
            endingHTML
        ]
    );




} catch (err) {
    document.write(err.message);
}