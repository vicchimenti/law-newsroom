/***
 *      @author Victor Chimenti, MSCS
 *      @file organizerLawBaseNewsroomGrid.js
 *      @see Media Library ID: 3045187
 *      organizer law base newsroom grid
 *
 *      Foundation for Law News Center Grid
 *          Category Organizer
 *
 *      @version 6.15
 */




/***
 *      Import T4 Utilities
 */
importClass(com.terminalfour.sitemanager.cache.CachedContent);
importClass(com.terminalfour.navigation.ServerSideLinkManager);
importClass(com.terminalfour.spring.ApplicationContextProvider);
importClass(com.terminalfour.publish.utils.TreeTraversalUtils);
importClass(com.terminalfour.navigation.items.utils.TargetContentInfo);
importClass(com.terminalfour.utils.T4StreamWriter);
importClass(com.terminalfour.publish.ContentPublisher);
importClass(com.terminalfour.publish.utils.BrokerUtils);
importClass(com.terminalfour.navigation.items.utils.NavigationPaginator);
importClass(com.terminalfour.content.IContentManager);
importClass(com.terminalfour.list.IPredefinedListManager);










/**
 * from the organizer we can't post console.log() directly to the browser.
 * this function allow you to create a log message that will post to the console in the browser
 * for debugging purposes. please remove any logs once done debugging
 *
 * To trigger this function when you need a console.log() use the example:
 * Example: log("variable a: " + varA);
 * 
 * @param message The string that will print to the browser console
 * 
 */
log = message => document.write('<script>eval("console.log(\'' + message + '\')");</script>');










/**
 * Sorts content by date, from most recent to least recent.
 * If these is no date, content is treated as least recent.
 * Defaults to using the last modified date.
 * 
 * @param cid The content type ID
 * @param elem The element to use for sorting
 * 
 */
function byDate(cid, elem) {

    if (!elem) {

        switch (cid) {
            case 208:
                elem = 'Published';
                break;
            case 82:
                elem = 'Publish Date';
                break;
            default:

                let result = (a, b) => {

                    var dateA = a.CachedContent.getLastModified(language, CachedContent.APPROVED);
                    var dateB = b.CachedContent.getLastModified(language, CachedContent.APPROVED);

                    return dateB.compareTo(dateA);
                }

                return result;
        }
    }


    let result = (a, b) => {

        var dateA = a.Content.get(elem).getValue();
        var dateB = b.Content.get(elem).getValue();

        return  (dateA && !dateB) ? -1 :
                (!dateA && dateB) ? 1 :
                (!dateA && !dateB) ? 0 :
                dateB.compareTo(dateA);
    }

    return result;
}




/**
 * Sorts content alphabetically, from A to Z. Ignores special characters
 * (anything that isn't a word or space).
 * Defaults to using the Name element.
 * 
 * @param cid The content type ID
 * @param elem The element to use for sorting
 * 
 */
function byName(cid, elem) {

    if (!elem) {

        switch (cid) {
            case 208:
                elem = 'Post Title';
                break;
            case 203:
                elem = 'Name of Faculty or Staff Member';
                break;
            case 243:
                elem = 'Name';
                break;
            case 82:
                elem = 'Article Title';
                break;
            case 364:
                elem = 'Last Name';
                break;
            case 548:
                elem = 'Degree Name';
                break;
            default:
                elem = 'Name';
                break;
        }
    }


    let result = (a, b) => {

        var strA = String(a.Content.get(elem)).replace(/[^\w\s]/gi, '').toLowerCase();
        var strB = String(b.Content.get(elem)).replace(/[^\w\s]/gi, '').toLowerCase();

        return strA.localeCompare(strB);
    }

    return result;
}




/**
 * Sorts content by a boolean value (i.e. whether or not an element has a value).
 * Particularly useful for single checkboxes (e.g. System Status content type).
 * Defaults to sorting by section order.
 * If two content items have the same value, also sorts by section order.
 * 
 * @param cid The content type ID
 * @param elem The element to use for sorting
 * 
 */
function byBoolean(cid, elem) {

    if (!elem) {

        switch (cid) {
            case 359:
                elem = 'Service is Available';
                break;
            default:
                return byOrder(cid, elem);
        }
    }


    let result = (a, b) => {

        var boolA = !a.Content.get(elem).isNull();
        var boolB = !b.Content.get(elem).isNull();

        return  (boolA && !boolB) ? 1 :
                (!boolA && boolB) ? -1 :
                byOrder(cid, elem)(a, b);
    }

    return result;
}




/**
 * Sorts content by section order.
 * Content type ID and element name have no effect on the returned sorting method.
 */
function byOrder(cid, elem) {

    let result = (a, b) => {

        return  (a.index > b.index) ? 1 :
                (a.index < b.index) ? -1 : 0;
    }

    return result;
}




/**
 * Determines whether a number has passed a certain limit.
 * Used for checking if the total number of content items to display has been reached.
 */
function isLimitPassed(i, limit) {

    return limit > 0 ? i >= limit : false;
}



/**
 * Parse Custom Sort Field for multiple fields
 * Called only when there is any custom field entered
 *
 * @param elem is a value assigned from an array like object of custom Elements to sort by
 * @param tag is the radio or tag valued from content item that is being sorted
 * 
 */
 function tagSort(tag, elem) {

    return function(a, b) {

        let strA = a.Content.get(elem).publish() !="" ? a.Content.get(elem).publish() : null;
        let strB = b.Content.get(elem).publish() !="" ? b.Content.get(elem).publish() : null;
        let isMatchA = (tag.includes(strA));
        let isMatchB = (tag.includes(strB));

        return isMatchA && !isMatchB ? -1 : !isMatchA && isMatchB ? 1 : 0;
    }
}




/**
 * Checks a content item's status to see if it should be displayed.
 * The result depends on whether the CMS is in preview or publish, as each mode
 * displays content under different conditions:
 * - Preview: Content must be approved or pending
 * - Publish: Content must be approved
 * 
 * @param isPreview boolean
 * 
 */
function getMode(isPreview) {

    return isPreview ? CachedContent.CURRENT : CachedContent.APPROVED;
}




/**
 * Parse Custom Sort Field for multiple fields
 * Called only when there is any custom field entered
 * 
 * @param elem is a value assigned from an array like object of custom Elements to sort by
 * 
 */
function dynamicSort(elem) {

    let result = (a, b) => {

        let strA = a.Content.get(elem).publish();
        let strB = b.Content.get(elem).publish();

        return strA > strB ? 1 : strA < strB ? -1 : 0;
    }

    return result;
}




/**
 * Parse Custom Sort Field for multiple fields
 * Called only when there is any custom field entered
 * 
 * @param cid is the content type id
 * @param elements is a value assigned from an array like object of custom Elements to sort by
 * 
 */
function byCustomElements(cid, elements, cat) {

    return function(a, b) {

        let element = result = 0;
        while (result === 0 && element < elements.length) {
            let currentElement = elements[element].trim();

            switch (currentElement) {
                case 'Published':
                    result = byDate(cid, currentElement)(a, b);
                    break;
                case 'Publish Date':
                    result = byDate(cid, currentElement)(a, b);
                    break;
                case "Category Pin":
                    result = tagSort(cat, currentElement)(a, b);
                    break;
                case 'Article Title':
                    result = byName(cid, currentElement)(a, b);
                    break;
                default:
                    result = dynamicSort(currentElement)(a, b);
            }
            element++;
        }
        return result;
    }
}








/**
 * Main
 * Method called by Organizer content types to sort and display content.
 */
function main(header, midder, footer) {

    try {

        /**
         * Declarations
         * 
         */
        // var title = content.hasElement('Title') ? content.get('Title') : null;
        var choice = content.get('Article type').publish();
        var CID = new java.lang.Integer(choice.split(";")[0]);
        var LAYOUT = choice.split(";")[1];
        var SSID = String(content.get('Section')).match(/sslink_id="(\d+)"/)[1];
        var sortMethod = content.get('Sorting method').publish();
        var sElement = String(content.get('Custom element'));
        var bReverse = !content.get('Reverse order').isNull();
        var bPaginate = content.hasElement('Paginate?') ? !content.get('Paginate?').isNull() : null;
        var nPerPage = content.hasElement('Total number of items to display per page') ? content.get('Total number of items to display per page') : 0;
        var LIMIT = content.get('Total number of items to display');
        var nStart = content.get('Start Number') > 0 ? content.get('Start Number') : 1;
        var categoryName = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Article type" output="normal" display_field="name" />');




        // the logic to determine layouts and links that were available to the user
        var bViewAll = content.hasElement('Show link to original section') ? !content.get('Show link to original section').isNull() : false;
        var sViewAllText = content.hasElement('Link to original section text') ? content.get('Link to original section text') : "";
        if (sViewAllText == "")
            sViewAllText = "View All";




        // overrides a news layout that doesn't work
        var bSummFirst = (LAYOUT == "v9/organizer/newsArticleSummary/Link");
        if (bSummFirst) {
            LAYOUT = "v9/organizer/newsArticleSummary";
        }




        /**
         * Get section
         */
        var oSSLM = ServerSideLinkManager.getManager();
        var mySectionLinkID = Number(SSID);
        var myLink = oSSLM.getLink(dbStatement.getConnection(), mySectionLinkID, section.getID(), content.getID(), language);
        var sectionID = myLink.getToSectionID();




        /**
         * Get content from section
         */
        var oChannel = publishCache.getChannel();
        var oSection = TreeTraversalUtils.findSection(oChannel, section, sectionID, language);
        var dSequence = oSection.getContentsAndSequences();
        var mode = getMode(isPreview);
        var aSCI = oSection.getContent(oChannel, language, mode);
        var mirrorContent = [];
        for (var i = 0; i < aSCI.length; i++) {
            var item = aSCI[i].getContent();
            mirrorContent.push(item);
        }




        /**
         * Filter content that matches content type
         */
        var oCM = ApplicationContextProvider.getBean(IContentManager);
        var listManager = ApplicationContextProvider.getBean(IPredefinedListManager);
        var validContent = [];

        for (var i = 0; i < mirrorContent.length; i++) {

            var item = {
                Content: oCM.get(mirrorContent[i].ID, language),
                CachedContent: mirrorContent[i],
                index: dSequence.get(new java.lang.Integer(mirrorContent[i].ID))
            };

            if (item.Content.getContentTypeID() == CID) {
                validContent.push(item);
            }
        }




        /**
         * Filter content that matches the category
         */
        var matchingTopics = [];
        for (let contentItem in validContent) {

            if (categoryName.includes("Archives")) {

                matchingTopics.push(validContent[contentItem]);

            } else {

                let categoryValues = validContent[contentItem].Content.get("Category").getValue().toString().split(';');
                for (let category in categoryValues) {
    
                    let categoryElement = categoryValues[category].split(':');
                    let topic = listManager.getEntry(categoryElement[0], categoryElement[1], language);
                    let topicName = topic.getName();
    
                    if (topicName == categoryName) {
                        matchingTopics.push(validContent[contentItem]);
                    }
                }

            }
        }




        /**
         * Sort content
         */
        if (sElement != "") {

            // when the user selects any custom sort element
            var arrayOfElements = [];
            arrayOfElements = sElement.split(',');
            matchingTopics.sort(byCustomElements(CID, arrayOfElements, categoryName));

        } else {

            // when the user only sorts by the default options
            matchingTopics.sort(eval(sortMethod + '(' + CID + ', sElement);'));

        }
        if (bReverse)
            matchingTopics.reverse();




        /**
         * Display content
         */
        if (!header)
            header = "";
        if (!midder)
            midder = "";
        if (!footer)
            footer = "";
        // if (title != "")
        //     header = header + '<h2 class="organizerTitle">' + title + '</h2>';
        if (bViewAll) {
            var href = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Section" output="linkurl" modifiers="nav_sections" />');
            midder = midder + '<div class="boxlinkItem viewAll"><a href="' + href + '">' + sViewAllText + '</a></div>';
        }



        /**
         * Determine Pagination
         */
        if (bPaginate && !bSummFirst) {

            // when the user selects a content type with Summary in the Content type and layout option while also selecting Paginate
            var contentInfo = [];
            for (var i = nStart - 1; i < matchingTopics.length && !isLimitPassed(i, LIMIT); i++) {
                var tci = new TargetContentInfo(matchingTopics[i].CachedContent, oSection, language);
                contentInfo.push(tci);
            }
            var vector = new java.util.Vector(java.util.Arrays.asList(contentInfo));
            var sectionPublisher = com.terminalfour.spring.ApplicationContextProvider.getBean(com.terminalfour.publish.SectionPublisher),
                contentPublisher = com.terminalfour.spring.ApplicationContextProvider.getBean(com.terminalfour.publish.ContentPublisher),
                publishHelper = com.terminalfour.spring.ApplicationContextProvider.getBean(com.terminalfour.publish.PublishHelper),
                paginator = new NavigationPaginator(sectionPublisher, contentPublisher, publishHelper);
            paginator.setContentPerPage((nPerPage > 0 ? nPerPage : 10));
            paginator.setFormatter(LAYOUT);
            paginator.setLinksToShow(10);
            var before = '<div class="paginationWrapper"><div class="pagination"><span class="paginationNumber">';
            var middle = '</span><span class="paginationNumber">';
            var after = '</span></div></div>';
            paginator.setPageSeparators(before, middle, after);
            paginator.setBeforeAndAfterHTML(header, footer);
            paginator.setPreview(isPreview);
            paginator.write(document, dbStatement, publishCache, section, language, isPreview, vector);


        } else {

            /**
             * Gather content and write header
             * 
             */
            document.write(header);
            var oSW = new java.io.StringWriter();
            var oT4SW = new T4StreamWriter(oSW);
            var oCP = new ContentPublisher();



            /**
             * initialize iterators to account for starting and ending points
             * 
             */
            let maxIterations = LIMIT <= matchingTopics.length && LIMIT > 0 ? LIMIT : matchingTopics.length;
            let start = nStart <= matchingTopics.length ? nStart - 1 : 0;
            let iterations = 0;




            /**
             * check for content in matching topics field
             * 
             */
            if (matchingTopics.length > 0) {

                /**
                 * loop through matching topics and write only items requested
                 * 
                 */
                do {
                    oCP.write(oT4SW, dbStatement, publishCache, oSection, matchingTopics[start].Content, LAYOUT, isPreview);
                    start++;
                    iterations++;
                } while (start < matchingTopics.length && iterations < maxIterations);

            } else {

                /**
                 * when no matching items write all categories
                 * 
                 */
                for (let story in validContent) {
                    oCP.write(oT4SW, dbStatement, publishCache, oSection, validContent[story].Content, LAYOUT, isPreview);
                }
            }




            /**
             * write the document
             * 
             */
             document.write(oSW.toString());
             document.write(midder);
             document.write(footer);
        }




    } catch (e) {
        log("Error Thrown: " + e);
    }
}