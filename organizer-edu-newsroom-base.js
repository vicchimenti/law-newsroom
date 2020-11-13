// NewsroomOrganizerBase.js
// 

importClass(com.terminalfour.sitemanager.cache.CachedContent);
importClass(com.terminalfour.navigation.ServerSideLinkManager);
importClass(com.terminalfour.spring.ApplicationContextProvider);
importClass(com.terminalfour.publish.utils.TreeTraversalUtils);
importClass(com.terminalfour.navigation.items.utils.TargetContentInfo);
importClass(com.terminalfour.utils.T4StreamWriter);
importClass(com.terminalfour.publish.ContentPublisher);
importClass(com.terminalfour.publish.utils.BrokerUtils);
importClass(com.terminalfour.navigation.items.utils.NavigationPaginator); // added 2-13-19 by JB due to API change

function log(message) {
  document.write('<script>eval("console.log(\'' + message + '\')");</script>\n');
  //document.write(message + '<br>');
}

/* Sorting methods */

/*
 * All methods select what element to use for sorting if one is not provided,
 * depending on the content type ID. They then return a method to be used by
 * Array.prototype.sort().
 *
 * @param cid The content type ID
 * @param elim The element to use for sorting
 * sorting function names are called by sortMethod and are the same as the values in List 409
 */


/**
 * Sorts content by date, from most recent to least recent.
 * If these is no date, content is treated as least recent.
 * Defaults to using the last modified date.
 */

/* ok, so: the cid and element are passed into the function on line 305. we cam simplify the functon by standardizing the name elements 
and making sure that all Newsroom content types are the same in structure.*/
function byDate(cid, elem) { 
    if (!elem) {
      //log("by date")
        switch (cid) {
            case 5150:
                elem = 'Publish Date';
                break;
            case 5155:
                elem = 'Publish Date';
                break; 
            case 5166:
                elem = 'Publish Date';
                break; 
          case 544:
                elem = 'Publish Date';
                break; 
            case 550:
                elem = 'Publish Date';
                break; 
            case 571:
                elem = 'Publish Date';
                break; 
            case 584:
                elem = 'Post Date';
                break; 
          default:
                return function (a, b) {
                    var dateA = a.CachedContent.getLastModified(language, CachedContent.APPROVED);
                    var dateB = b.CachedContent.getLastModified(language, CachedContent.APPROVED);
                    return dateB.compareTo(dateA);
                }
                break;
        }
    }
    return function (a, b) {
        var dateA = a.Content.get(elem).getValue();
        var dateB = b.Content.get(elem).getValue();
        // No date gets least recent treatment
        if (dateA && !dateB)
            return -1;
        if (!dateA && dateB)
            return 1;
        if (!dateA && !dateB)
            return 0;
        return dateB.compareTo(dateA);
    }
}

/**
 * Sorts content alphabetically, from A to Z. Ignores special characters
 * (anything that isn't a word or space).
 * Defaults to using the Name element.
 */
function byName(cid, elem) {
    if (!elem) {
        switch (cid) {
            case 5150:
                elem = 'Name';
                break;
            case 5155:
                elem = 'Name';
                break;
            default:
                elem = 'Name';
                break;
        }
    }
    return function (a, b) {
        var nameA = String(a.Content.get(elem)).replace(/[^\w\s]/gi, '').toLowerCase();
        var nameB = String(b.Content.get(elem)).replace(/[^\w\s]/gi, '').toLowerCase();
        return nameA.localeCompare(nameB);
    }
}

/**
 * Sorts content by a boolean value (i.e. whether or not an element has a value).
 * Particularly useful for single checkboxes (e.g. System Status content type).
 * Defaults to sorting by section order.
 * If two content items have the same value, also sorts by section order.
 */
function byBoolean(cid, elem) {
    if (!elem) {
        switch (cid) {
            case 5150:
                elem = 'Minor Story';
                break;
            case 5155:
                elem = 'Minor Story';
                break;
          default:
                return byOrder(cid, elem);
                break;
        }
    }
    return function (a, b) {
        var boolA = !a.Content.get(elem).isNull();
        var boolB = !b.Content.get(elem).isNull();
        if (boolA && !boolB)
            return 1;
        if (!boolA && boolB)
            return -1;
        return byOrder(cid, elem)(a, b);
    }
}

/**
 * Sorts content by section order.
 * Content type ID and element name have no effect on the returned sorting method.
 */
function byOrder(cid, elem) {
    return function (a, b) {
        if (a.index > b.index)
            return 1;
        if (a.index < b.index)
            return -1;
        return 0;
    }
}

/* Helper methods */

/**
 * Checks a content item's status to see if it should be displayed.
 * The result depends on whether the CMS is in preview or publish, as each mode
 * displays content under differet conditions:
 * - Preview: Content must be approved or pending
 * - Publish: Content must be approved
 */
var isValidStatus = (function () {
    if (isPreview)
        return function (status) { return status != 2; }
    else
        return function (status) { return status == 0; }
})();

/**
 * Determines whether a number has passed a certain limit.
 * Used for checking if the total number of content items to display has been reached.
 */
function isLimitPassed(i, limit) {
    if (limit > 0)
        return i >= limit;
    else
        return false;
}

function getMode(isPreview) {
    if (isPreview)
        return CachedContent.CURRENT;
    else
        return CachedContent.APPROVED;
}
/**
 * Checks to see if something (obj) is in a specified array (a).
 * Used for checking if a content item is a valid content type.
 */
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
       if (a[i] === obj) {
          return true;
       }
    }
    return false;
}

/* Main method */

/**
 * Method called by Organizer content types to sort and display content.
 */
function main(header, midder, footer) {

    // Set variables
    var title = (content.hasElement('Title') ? content.get('Title') : "");
    var choice = content.get('Article Type').publish();
    //log('Choice: ' + choice);
    var CID = new java.lang.Integer(choice.split(";")[0]); //before the semicolon, removed because we don't really care what the layout is
    var LAYOUT = choice.split(";")[1]; //after the semicolon
    
    var SSID = String(content.get('Section')).match(/sslink_id="(\d+)"/)[1];
    var sortMethod = content.get('Sorting method').publish();
    var sElement = String(content.get('Custom element'));
    var bReverse = !content.get('Reverse order').isNull();
    var bPaginate = (content.hasElement('Paginate?') ? !content.get('Paginate?').isNull() : null);
    var nPerPage = (content.hasElement('Total number of items to display per page') ? content.get('Total number of items to display per page') : 0);    
    var LIMIT = content.get('Total number of items to display');
  //log("LIMIT is: " + LIMIT);
    var nStart = (content.get('Start Number') && content.get('Start Number') > 0 ? content.get('Start Number') : 1);
    var bViewAll = (content.hasElement('Show link to original section') ? !content.get('Show link to original section').isNull() : false);
    var sViewAllText = (content.hasElement('Link to original section text') ? content.get('Link to original section text') : "");
    if (sViewAllText == "")
        sViewAllText = "View All";
    var bSummFirst = (LAYOUT == "v9/newsroomOrganizer/storyMajorLink");
  	if(bSummFirst){
    	LAYOUT = "v9/newsroomOrganizer/storyMinorFeed";
      //log("bSummFirst");
  	}
  
    var arrayOfValidContentTypeIDs = [5067,5150,5155,5166,544,550,571,584,601];
    //var arrayOfValidContentTypeIDs = [5155,5166,544,550,571,584,601];

    // Get section
    var oSSLM = ServerSideLinkManager.getManager();
    var mySectionLinkID = Number(SSID);
    var myLink = oSSLM.getLink(dbStatement.getConnection(), mySectionLinkID, section.getID(), content.getID(), language);
    var sectionID = myLink.getToSectionID();

    // Get content from section
    var oChannel = publishCache.getChannel();
    var oSection = TreeTraversalUtils.findSection(oChannel, section, sectionID, language);
    var dSequence = oSection.getContentsAndSequences();
    var mode = getMode(isPreview);
    var aSCI = oSection.getContent(oChannel, language, mode);  ///////UNCOMMENT oCHANNEL ON LIVE//////

    var mirrorContent = []; // CachedContent[] of content in the section
    for (var i = 0; i < aSCI.length; i++) {
        var item = aSCI[i].getContent();
        //log("ASCI I: " + i)
        //log("ASCI Content Name: " + item.getName(language,mode));
        mirrorContent.push(item);
    }
    var contentCurrent = oSection.getContent(language, CachedContent.CURRENT);
    var contentApproved = oSection.getContent(language, CachedContent.APPROVED);
    //log("Length of current content: " + contentCurrent.length);
    //log("Length of approved content: " + contentApproved.length);
    //log("Length of aSCI: " + aSCI.length);
    //log("Length of Mirror Content: " + mirrorContent.length);

    //var mirrorContent = oSection.getContent(language, mode);
    //var mirrorContent = oSection.getContent(publishCache.getChannel(), language, mode);

    // Filter content that matches content type
    var oCM = ApplicationContextProvider.getBean(com.terminalfour.content.IContentManager);
    var validContent = [];
    //log("mirrorContent.length: " + mirrorContent.length);
    for (var i = 0; i < mirrorContent.length; i++) {
        //log("Mirror I: " + i);
        var item = {
            Content: oCM.get(mirrorContent[i].ID, language/*, mirrorContent[i].getVersion(language, mode)*/),
            CachedContent: mirrorContent[i],
            index: dSequence.get(new java.lang.Integer(mirrorContent[i].ID))
        };
      
      
      //document.write('<!--\n"' + item.Content.get('Name') + '"\nStatus: ' + item.CachedContent.getStatus(language, mode) + '\n');
      
      //var isItValid = arrayOfValidContentTypeIDs.includes(spong);  

      var isValid = contains(arrayOfValidContentTypeIDs,item.Content.getContentTypeID());
      //log("contains: " + isValid);
      
      //if (item.Content.getContentTypeID() == CID) { 
      if (isValid) {
          //log("item.Content.getContentTypeID():" + item.Content.getContentTypeID());
            validContent.push(item);
            //log(LAYOUT + "     Content Valid")
            //document.write('valid\n-->');
        //log("Valid Content #" + i + ": " + item.Content.get('Name') + " | cid: " + item.Content.getContentTypeID() + item.Content.get('Topics').publish());

      }
      else {
          //log(LAYOUT + "     Content Invalid")
          //log("Invalid Content #" + i + ": " + item.Content.get('Name') + " | cid: " + item.Content.getContentTypeID());

      }
    }
    //log("Number of content items" + validContent.length);

    // Sort content
    //validContent.sort(eval(sortMethod + '(' + CID + ', sElement);'));
    validContent.sort(eval(sortMethod + '(2222, sElement);'));
  
  
    if (bReverse)
        validContent.reverse();


    // BEGIN check status of expired content
	/*for (var i = 0; i < validContent.length; i++) {
		document.write(validContent[i].CachedContent.getStatus());
	}*/
    // END

    // Display content
    if (!header)
        header = "";
    if (!midder)
        midder = "";
    if (!footer)
        footer = "";
    if (title != "")
        header = header + '<h2 class="organizerTitle">' + title + '</h2>';
    if (bViewAll) {
        var href = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Section" output="linkurl" modifiers="nav_sections" />');
        midder = midder + '<div class="boxlinkItem viewAll"><a href="' + href + '">' + sViewAllText + '</a></div>';
    }

    if (bPaginate && !bSummFirst) {
      //console.log("paginate yes bSummFirst no");
        var contentInfo = [];
        for (var i = nStart - 1; i < validContent.length && !isLimitPassed(i, LIMIT); i++) {
            var tci = new TargetContentInfo(validContent[i].CachedContent, oSection, language);
            contentInfo.push(tci);
            
            //document.write(" [" + validContent[i].Content.getVersion() + "] ");
        }
        var vector = new java.util.Vector(java.util.Arrays.asList(contentInfo));
        // changes below 2-13-19 by Jason due to API change
        //var paginator = ApplicationContextProvider.getBean(com.terminalfour.navigation.items.utils.NavigationPaginator);
        var sectionPublisher = com.terminalfour.spring.ApplicationContextProvider.getBean (com.terminalfour.publish.SectionPublisher),
    	contentPublisher = com.terminalfour.spring.ApplicationContextProvider.getBean (com.terminalfour.publish.ContentPublisher),
    	publishHelper = com.terminalfour.spring.ApplicationContextProvider.getBean (com.terminalfour.publish.PublishHelper),
    	paginator = new NavigationPaginator (sectionPublisher, contentPublisher, publishHelper);
        // end 2-13-19 changes
        paginator.setContentPerPage((nPerPage > 0 ? nPerPage : 10));
        paginator.setFormatter(LAYOUT);
        paginator.setLinksToShow(10);
        var before = '<div class="paginationWrapper"><div class="pagination"><span class="paginationNumber">';
        var middle = '</span><span class="paginationNumber">';
        var after = '</span></div></div>';
        paginator.setPageSeparators(before, middle, after);
        paginator.setBeforeAndAfterHTML(header, footer);
        paginator.setPreview(isPreview);
        //log("before write");
        paginator.write(document, dbStatement, publishCache, section, language, isPreview, vector);
        //log("after write");
    }
    else {
        //log("qwe");
        document.write(header);
        var oSW = new java.io.StringWriter();
        var oT4SW = new T4StreamWriter(oSW);
        var oCP = new ContentPublisher();
        // prepare for first content item
        first = true;
        //log("Valid Content Length: " + validContent.length);
        if (bSummFirst) { LIMIT = 100 } // get rid of limit if using summary first layout
        for (var i = nStart - 1; i < validContent.length && !isLimitPassed(i, LIMIT); i++) {
          //log("I: " + i);
          //log("Is Limit Passed: " + isLimitPassed(i, LIMIT));
          // if first print content item completely
         //log("inside loop LIMIT is: " + LIMIT);
          if (first) {
            oLayout = LAYOUT;
            first = false;
            //log("xxxxxxx");
          }
          // if not first print link version if requested but normally otherwise
          else {
            oLayout = bSummFirst ? LAYOUT + "/Link" : LAYOUT ;
            //log("i: " + i );
          }
          //log(validContent[i].Content.get('Name'));
          oCP.write(oT4SW, dbStatement, publishCache, oSection, validContent[i].Content, oLayout, isPreview);
        }

        document.write(oSW.toString());
        document.write(midder);
        document.write(footer);
    }

}















