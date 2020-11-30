/***
 *     @author Victor Chimenti, MSCS-SE 2020
 *     @file newOrganizerBase.js
 *
 *     This new content type is being created to solve a sorting problem.
 *     The new Course Item content type requires sorting by multiple input fields
 *     such as Course Number, Course Section, Course Name. These fields need to be
 *     combined into one field and then sorted by the organizer.
 *
 *     Since the Organizer already allows a Custom Sort Field, we will add logic to
 *     allow multiple Fields to be entered in this Custom Sort.
 *
 *     Adapted from the existing organizer organizer.js media library id 163514
 *
 *     @version 2.15
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
function log(message) {
  document.write("<script>eval(\"console.log('" + message + "')\");</script>");
}

/* Sorting methods */

/**
 * All methods select what element to use for sorting if one is not provided,
 * depending on the content type ID. They then return a method to be used by
 * Array.prototype.sort().
 *
 * @param cid The content type ID
 * @param elem The element to use for sorting
 */

/**
 * Sorts content by date, from most recent to least recent.
 * If these is no date, content is treated as least recent.
 * Defaults to using the last modified date.
 */
function byDate(cid, elem) {
  if (!elem) {
    switch (cid) {
      case 208:
        elem = "Published";
        break;
      case 82:
        elem = "Publish Date";
        break;
      default:
        return function (a, b) {
          var dateA = a.CachedContent.getLastModified(
            language,
            CachedContent.APPROVED
          );
          var dateB = b.CachedContent.getLastModified(
            language,
            CachedContent.APPROVED
          );
          return dateB.compareTo(dateA);
        };
        break;
    }
  }
  return function (a, b) {
    var dateA = a.Content.get(elem).getValue();
    var dateB = b.Content.get(elem).getValue();
    // No date gets least recent treatment
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;
    if (!dateA && !dateB) return 0;
    return dateB.compareTo(dateA);
  };
}

/**
 * Sorts content alphabetically, from A to Z. Ignores special characters
 * (anything that isn't a word or space).
 * Defaults to using the Name element.
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
      default:
        elem = "Name";
        break;
    }
  }
  return function (a, b) {
    var strA = String(a.Content.get(elem))
      .replace(/[^\w\s]/gi, "")
      .toLowerCase();
    var strB = String(b.Content.get(elem))
      .replace(/[^\w\s]/gi, "")
      .toLowerCase();
    return strA.localeCompare(strB);
  };
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
      case 359:
        elem = "Service is Available";
        break;
      default:
        return byOrder(cid, elem);
        break;
    }
  }
  return function (a, b) {
    var boolA = !a.Content.get(elem).isNull();
    var boolB = !b.Content.get(elem).isNull();
    if (boolA && !boolB) return 1;
    if (!boolA && boolB) return -1;
    return byOrder(cid, elem)(a, b);
  };
}

/**
 * Sorts content by section order.
 * Content type ID and element name have no effect on the returned sorting method.
 */
function byOrder(cid, elem) {
  return function (a, b) {
    if (a.index > b.index) return 1;
    if (a.index < b.index) return -1;
    return 0;
  };
}

/* Helper methods */

/**
 * Checks a content item's status to see if it should be displayed.
 * The result depends on whether the CMS is in preview or publish, as each mode
 * displays content under different conditions:
 * - Preview: Content must be approved or pending
 * - Publish: Content must be approved
 */
var isValidStatus = (function () {
  if (isPreview)
    return function (status) {
      return status != 2;
    };
  else
    return function (status) {
      return status == 0;
    };
})();

/**
 * Determines whether a number has passed a certain limit.
 * Used for checking if the total number of content items to display has been reached.
 */
function isLimitPassed(i, limit) {
  if (limit > 0) return i >= limit;
  else return false;
}

function getMode(isPreview) {
  if (isPreview) return CachedContent.CURRENT;
  else return CachedContent.APPROVED;
}

/**
 * Parse Custom Sort Field for multiple fields
 * Called only when there is any custom field entered
 *
 * @param elem is a value assigned from an array like object of custom Elements to sort by
 * @param elements array like object of custom sort elements parsed from the user input in the Custom element
 */
function dynamicSort(elem) {
  return function (a, b) {
    // we have to use publish() rather than getValue()
    // to accommodate multiple input types such as radio buttons, checkboxes in addition to plain text and numbers
    // publish() returns a string
    let strA = a.Content.get(elem).publish();
    let strB = b.Content.get(elem).publish();

    return strA > strB ? 1 : strA < strB ? -1 : 0;
  };
}

// calls dynamic sort and sends one element at a time from the array of custom elements
function byCustomElements(elements) {
  // assign the array of custom elements to a local scope
  let customElements = elements;
  return function (a, b) {
    // number of elements is the number of custom sort elements entered by the user
    let i = 0,
      result = 0,
      numberOfElements = customElements.length;

    // if the result is zero then the value of a and b are equal
    while (result === 0 && i < numberOfElements) {
      // iterate through each element
      let currentElement = customElements[i].trim();

      // sort the content items by the current custom element
      result = dynamicSort(currentElement)(a, b);
      i++;
    }
    return result;
  };
}

/* Main method */

/**
 * Method called by Organizer content types to sort and display content.
 */
function main(header, midder, footer) {
  /**
   * Set variables
   */

  // gets the title
  var title = content.hasElement("Title") ? content.get("Title") : "";
  // users choice for the content type to sort
  var choice = content.get("Content type and layout").publish();
  // parses out the content id that references the content type in the media library
  var CID = new java.lang.Integer(choice.split(";")[0]);
  // parses layout options from the content type choice
  var LAYOUT = choice.split(";")[1];
  // section id
  var SSID = String(content.get("Section")).match(/sslink_id="(\d+)"/)[1];
  // the required sort method from the list of options
  var sortMethod = content.get("Sorting method").publish();
  // the optional custom elements that a user can sort by - this can be any length of items
  var sElement = String(content.get("Custom element"));
  // the reverse order option
  var bReverse = !content.get("Reverse order").isNull();
  // the paginate option to display items on multiple pages
  var bPaginate = content.hasElement("Paginate?")
    ? !content.get("Paginate?").isNull()
    : null;
  // the number of items to display on each page when pagination is true
  var nPerPage = content.hasElement("Total number of items to display per page")
    ? content.get("Total number of items to display per page")
    : 0;
  // the number of items to display
  var LIMIT = content.get("Total number of items to display");
  // user has the option of beginning their display at any item rather than the first
  var nStart =
    content.get("Start Number") && content.get("Start Number") > 0
      ? content.get("Start Number")
      : 1;

  // the logic to determine layouts and links that were available to the user
  var bViewAll = content.hasElement("Show link to original section")
    ? !content.get("Show link to original section").isNull()
    : false;
  var sViewAllText = content.hasElement("Link to original section text")
    ? content.get("Link to original section text")
    : "";
  if (sViewAllText == "") sViewAllText = "View All";
  var bSummFirst = LAYOUT == "v9/organizer/newsArticleSummary/Link";
  if (bSummFirst) {
    LAYOUT = "v9/organizer/newsArticleSummary";
  }

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
  var oCM = ApplicationContextProvider.getBean(
    com.terminalfour.content.IContentManager
  );
  var validContent = [];
  for (var i = 0; i < mirrorContent.length; i++) {
    var item = {
      Content: oCM.get(mirrorContent[i].ID, language),
      CachedContent: mirrorContent[i],
      index: dSequence.get(new java.lang.Integer(mirrorContent[i].ID)),
    };
    if (item.Content.getContentTypeID() == CID) {
      validContent.push(item);
    }
  }

  /**
   * Sort content
   */
  if (sElement != "") {
    // when the user selects any custom sort element
    var arrayOfElements = [];
    arrayOfElements = sElement.split(",");
    validContent.sort(byCustomElements(arrayOfElements));
  } else {
    // when the user only sorts by the default options
    validContent.sort(eval(sortMethod + "(" + CID + ", sElement);"));
  }
  if (bReverse) validContent.reverse();

  /**
   * Display content
   */
  if (!header) header = "";
  if (!midder) midder = "";
  if (!footer) footer = "";
  if (title != "")
    header = header + '<div class="titleWrapper col-xs-12"><h2 class="organizerTitle">' + title + "</h2></div>";
  if (bViewAll) {
    var href = BrokerUtils.processT4Tags(
      dbStatement,
      publishCache,
      section,
      content,
      language,
      isPreview,
      '<t4 type="content" name="Section" output="linkurl" modifiers="nav_sections" />'
    );
    midder =
      midder +
      '<div class="boxlinkItem viewAll"><a href="' +
      href +
      '">' +
      sViewAllText +
      "</a></div>";
  }

  /**
   * Determine Pagination
   */
  if (bPaginate && !bSummFirst) {
    // when the user selects a content type with Summary in the Content type and layout option while also selecting Paginate

    var contentInfo = [];
    for (
      var i = nStart - 1;
      i < validContent.length && !isLimitPassed(i, LIMIT);
      i++
    ) {
      var tci = new TargetContentInfo(
        validContent[i].CachedContent,
        oSection,
        language
      );
      contentInfo.push(tci);
    }
    var vector = new java.util.Vector(java.util.Arrays.asList(contentInfo));
    var sectionPublisher = com.terminalfour.spring.ApplicationContextProvider.getBean(
        com.terminalfour.publish.SectionPublisher
      ),
      contentPublisher = com.terminalfour.spring.ApplicationContextProvider.getBean(
        com.terminalfour.publish.ContentPublisher
      ),
      publishHelper = com.terminalfour.spring.ApplicationContextProvider.getBean(
        com.terminalfour.publish.PublishHelper
      ),
      paginator = new NavigationPaginator(
        sectionPublisher,
        contentPublisher,
        publishHelper
      );
    paginator.setContentPerPage(nPerPage > 0 ? nPerPage : 10);
    paginator.setFormatter(LAYOUT);
    paginator.setLinksToShow(10);
    var before =
      '<div class="paginationWrapper"><div class="pagination"><span class="paginationNumber">';
    var middle = '</span><span class="paginationNumber">';
    var after = "</span></div></div>";
    paginator.setPageSeparators(before, middle, after);
    paginator.setBeforeAndAfterHTML(header, footer);
    paginator.setPreview(isPreview);
    paginator.write(
      document,
      dbStatement,
      publishCache,
      section,
      language,
      isPreview,
      vector
    );

    // eventually we may want an else if here EX: else if (bPaginate && bSummFirst) {...}
    // that would allow when the Summary and Paginate option are both chosen
    // however at this time I haven't been able to produce a solution that merges
    // the paginator with the oCP but it should be possible with enough time to work it out
    // for now we go straight to the else
    // and we must communicate to our departments that we don't support that functionality
    // when they try to select both summary and paginator
    // Victor 7/2020
  } else {
    document.write(header);
    var oSW = new java.io.StringWriter();
    var oT4SW = new T4StreamWriter(oSW);
    var oCP = new ContentPublisher();
    // prepare for first content item
    first = true;
    for (
      var i = nStart - 1;
      i < validContent.length && !isLimitPassed(i, LIMIT);
      i++
    ) {
      // if first print content item completely
      if (first) {
        oLayout = LAYOUT;
        first = false;
        // if not first print link version if requested but normally otherwise
      } else {
        oLayout = bSummFirst ? LAYOUT + "/Link" : LAYOUT;
      }
      oCP.write(
        oT4SW,
        dbStatement,
        publishCache,
        oSection,
        validContent[i].Content,
        oLayout,
        isPreview
      );
    }

    document.write(oSW.toString());
    document.write(midder);
    document.write(footer);
  }
}
