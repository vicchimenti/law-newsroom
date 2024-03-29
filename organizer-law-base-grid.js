/***
 *      @author Victor Chimenti, MSCS
 *      @file organizerLawBaseGrid.js
 *      @see Media Library ID: 2686600
 *      organizer law base grid
 *      
 *      Foundation for Law Mainzone
 *          Masonry Organizer
 *
 *      @version 3.32
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
            case 5296:
                elem = "Publish Date";
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
                elem = "Post Title";
                break;
            case 203:
                elem = "Name of Faculty or Staff Member";
                break;
            case 243:
                elem = "Name";
                break;
            case 82:
                elem = "Article Title";
                break;
            case 364:
                elem = "Last Name";
                break;
            case 548:
                elem = "Degree Name";
                break;
            case 5296:
                elem = "Headline";
                break;
            default:
                elem = "Name";
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
                elem = "Service is Available";
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
 * @param cat is the category being parsed for
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
                case 'Article Title':
                    result = byName(cid, currentElement)(a, b);
                    break;
                case 'Last Name':
                    result = byName(cid, currentElement)(a, b);
                    break;
                case 'First Name':
                    result = byName(cid, currentElement)(a, b);
                    break;
                case 'Pinned':
                    result = byBoolean(cid, currentElement)(a, b);
                    break;
                case 'Faculty Status':
                    result = tagSort(cat, currentElement)(a, b);
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
        let choice = content.get("Article type").publish();
        let CID = new java.lang.Integer(choice.split(";")[0]);
        let LAYOUT = choice.split(";")[1];
        let SSID = String(content.get("Section")).match(/sslink_id="(\d+)"/)[1];
        let sortMethod = content.get("Sorting method").publish();
        let sElement = String(content.get("Custom element"));
        let bReverse = !content.get("Reverse order").isNull();
        let LIMIT = content.get("Total number of items to display");
        let nStart = content.get('Start Number') > 0 ? content.get('Start Number') : 1;
        let categoryName = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Article type" output="normal" display_field="name" />');




        /**
         * Get section
         */
        var oSSLM = ServerSideLinkManager.getManager();
        var mySectionLinkID = Number(SSID);
        var myLink = oSSLM.getLink(
            dbStatement.getConnection(),
            mySectionLinkID,
            section.getID(),
            content.getID(),
            language
        );
        var sectionID = myLink.getToSectionID();




        /**
         * Get content from section
         */
        var oChannel = publishCache.getChannel();
        var oSection = TreeTraversalUtils.findSection(
            oChannel,
            section,
            sectionID,
            language
        );
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
        var validContent = [];
        var oCM = ApplicationContextProvider.getBean(IContentManager);

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
         * Filter featured items for image
         * to maintain valid limits and start positions
         * current content types are
         *      Newscenter Story ID:5296
         *      Faculty Profile ID:5143
         * let all other content types pass thru
         * 
         * Newscenter Story requires a valid image
         * and a Yes response to the Feratured radio
         * 
         */
        var matchingOptions = [];
        
        if (CID == 5296) {

            for (let contentItem in validContent) {
            
                let selectedOption = validContent[contentItem].Content.get("Main Image").publish();
                let featuredOption = validContent[contentItem].Content.get("Featured").publish();

                if (selectedOption != "" && featuredOption == "Yes") {
    
                    matchingOptions.push(validContent[contentItem]);
                }
            }
             
        } else if (CID == 5143) {

            if (categoryName == "Faculty Profile") {

                for (let contentItem in validContent) {

                    matchingOptions.push(validContent[contentItem]);
                }

            } else {

                for (let contentItem in validContent) {
            
                    let selectedOption = validContent[contentItem].Content.get("Faculty Status").publish();
                    if (categoryName.includes(selectedOption)) {
        
                        matchingOptions.push(validContent[contentItem]);
                    }
                }
            }

        } else {

            for (let contentItem in validContent) {

                matchingOptions.push(validContent[contentItem]);
            }
        }




        /**
         * Sort content
         */
        if (sElement != "") {

            var arrayOfElements = [];
            arrayOfElements = sElement.split(',');
            matchingOptions.sort(byCustomElements(CID, arrayOfElements, categoryName));

        } else {

            matchingOptions.sort(eval(sortMethod + '(' + CID + ', sElement);'));

        }

        if (bReverse) {
            matchingOptions.reverse();
        }




        /**
         * Display content
         */
        header = header || '';
        midder = midder || '';
        footer = footer || '';




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
        let maxIterations = LIMIT <= matchingOptions.length && LIMIT > 0 ? LIMIT : matchingOptions.length;
        let start = nStart <= matchingOptions.length ? nStart - 1 : 0;
        let iterations = 0;




        /**
         * check for content in matching topics field
         * 
         */
        if (matchingOptions.length > 0) {

            /**
             * loop through matching topics and write only items requested
             * 
             */
            do {
                oCP.write(oT4SW, dbStatement, publishCache, oSection, matchingOptions[start].Content, LAYOUT, isPreview);
                start++;
                iterations++;
            } while (start < matchingOptions.length && iterations < maxIterations);

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




    } catch (e) {
        log("Error Thrown: " + e);
    }
}


/***
 *      @author Victor Chimenti, MSCS
 *      @file organizerLawBaseGrid.js
 *      @see Media Library ID: 2686600
 *      organizer law base grid
 *      
 */