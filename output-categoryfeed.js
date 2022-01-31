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
 *     @version 6.8
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

        contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle: getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
        headline: getContentValues('<t4 type="content" name="Headline" output="normal" modifiers="striptags,htmlentities" />'),
        articleSummary: getContentValues('<t4 type="content" name="Abstract" output="normal" modifiers="striptags,htmlentities" />'),
        articleFullBody: getContentValues('<t4 type="content" name="Article Body" output="normal" modifiers="medialibrary,nav_sections,htmlentities" />'),
        publishedDate: getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        fullTextLink: getContentValues('<t4 type="content" name="Article Title" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        catTags: getContentValues('<t4 type="content" name="Category" output="normal" display_field="name" />'),
        catPin: getContentValues('<t4 type="content" name="Category Pin" output="normal" display_field="value" />'),
        externalLink: getContentValues('<t4 type="content" name="External Link" output="normal" modifiers="striptags,htmlentities" />'),
        externalLinkText: getContentValues('<t4 type="content" name="External Link Title" output="normal" modifiers="striptags,htmlentities" />'),
        sectionLink: getContentValues('<t4 type="content" name="Internal SU Link" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText: getContentValues('<t4 type="content" name="Internal SU Link" output="linktext" modifiers="nav_sections" />'),
        contentId: getContentValues('<t4 type="meta" meta="content_id" />')

    }




    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
    let openCardBody = '<div class="newsroomArticleBlurb container card-body"><div class="row mx-0 px-0">';
    let closeCardBody = '</div></div>';
    let openHidden = '<div class="searchSortFields visually-hidden hidden">';
    let closeHidden = '</div>';
    let listOfCats = "<div class='newsroomArticle tags hidden'>No Tags Entered</div>";
    let hyphen = " | ";
    let events = "Events";
    let announcements = "Announcements";
    let suLawInTheNews = "In the News";
    let summaryString = '<span class="newsroomArticleLead card-text px-0 mx-0"><p>' + catDict.articleSummary.content + '</p></span>';
    let dateline = '<p class="newsroomArticlePublishedDate mx-0 px-0">' + catDict.publishedDate.content + '</p>';
    let beginningHTML = '<article class="newsroomCategoryFeedItem newsroomBlurb col-12 col-xs-12 card border-0" id="category' + catDict.contentId.content + '" aria-label="' + catDict.headline.content + '">';
    let endingHTML = '<hr class="articleBorderBottom"></article>';




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

        dateline = '<p class="newsroomArticlePublishedDate px-0 mx-0">' + catDict.publishedDate.content + hyphen + '<span class="newsroomArticleSpecialCategory">' + specialTopic + '</span></p>';
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
        listOfCats = '<div class="newsroomArticle tags topics visually-hidden hidden"><ul class="categories">' + listItems + '</ul></div><br>';
    }




    /***
     *  verify category pin
     * 
     * */
    let pinnedCat = (catDict.catPin.content) ?
        '<span class="catPinned">' + catDict.catPin.content + '</span>' :
        '<span class="catPinned">No Pin Selected</span>';




    /***
     *  determine if the article contains full text content
     * 
     * */
    let titleLink = (catDict.articleFullBody.content) ?
        '<h3 class="newsroomArticleTitle card-title px-0 mx-0"><a class="card-link" target="_blank" href="' + catDict.fullTextLink.content + '"  title="Read the full article at: ' + catDict.headline.content + '">' + catDict.headline.content + '</a></h3>' :
        '<h3 class="newsroomArticleTitle card-title px-0 mx-0">' + catDict.headline.content + '</h3>';




    /***
     *  default section link
     * 
     * */
    let publishedLink = (catDict.sectionLink.content && catDict.sectionLinkText.content) ?
        '<span class="newsLink px-0 mx-0"><a class="card-link" target="_blank" href="' + catDict.sectionLink.content + '" title="Visit ' + catDict.sectionLinkText.content + '"><em>' + catDict.sectionLinkText.content + '</em></a></span>' :
        (catDict.externalLink.content && catDict.externalLinkText.content) ?
        '<span class="newsLink px-0 mx-0"><a class="card-link" target="_blank" href="' + catDict.externalLink.content + '" title="Visit ' + catDict.externalLinkText.content + '"><em>' + catDict.externalLinkText.content + '</em></a></span>' :
        '<span class="newsLink visually-hidden hidden">No Proper Link Provided</span>';




    /***
     *  write document once
     * 
     * */
    writeDocument(
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