  /***
   *     @author Victor Chimenti, MSCS-SE '20
   *     @file output-majorfeed.js
   *     @see Seattle University School of Law Newsroom
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
   *     @version 2.0
   */

  try {
      /* -- Assign all the things -- */
      var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />");
      var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Full Article' output='normal' display_field='value' />");
      var frontPageImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Media Library Image' output='normal' formatter='path/*' />");
      var altfrontPageImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Media Library Image Caption' output='normal' modifiers='striptags,htmlentities' />");
      var externalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' use-element='true' filename-element='External Link' modifiers='striptags,htmlentities' />");
      var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
      var fieldTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Categories' output='normal' display_field='value' />");
      var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />");
      var lastModified = '<div class="lastModified" style="display:inline-block"><p>Last modified: <t4 type="meta" meta="last_modified" format="MMMM d, yyyy" /></p></div>';
      var listOfTags = "";
      var featureImageString = "";


      /* -- Prepare all the things -- */
      var beginningHTML = '<div class="newsroomMajorFeedItem newsroomArticleWrapper newsroomBlurb" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="Main" data-position-selected="Main"/>">';
      var endingHTML = '</div>';


      /* parse the list of tags, add <li> tags*/
      if (fieldTags != "") {
          var arrayOfTags = fieldTags.split(',');
          for (let i = 0; i < arrayOfTags.length; i++) {
              listOfTags += '<li class="tag">' + arrayOfTags[i] + '</li>';
          }
          listOfTags = '<div class="knowledgeBaseItem"><ul>' + listOfTags + '</ul></div>';
      }


      /* determine which link, if any, goes on the image */
      if (externalLink == "") {
          featureImageString = '<span class="newsroomImageWrapper"><img src="' + featureImage + '" class="articleImage" alt="' + altFeatureImage + '" /></span>';
      } else {
          featureImageString = '<span class="newsroomImageWrapper"><a href="' + externalLink + '" target="_blank"><img src="' + featureImage + '" class="articleImage" alt="' + altFeatureImage + '" /></a></span>';
      }


      /* -- Write all the things -- */
      document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
      document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, anchorTag));



      document.write('<span class="newsroomImageWrapper">' + articleTitle + '</span>');




      document.write('<div class="newsArticleHeader"><h2 id="pageTitle">' + articleTitle + '</h2></div>');
      document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, featureImageString));
      document.write('<div class="articleText standardContent">' + articleFullBody + '</div>');


      document.write(listOfTags);
      document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, lastModified));
      document.write(endingHTML);


  } catch (err) {
      document.write(err.message);
  }

  /***
   *     @author Victor Chimenti, MSCS-SE '20
   *     @file v9-organizer-articleSummary.js
   *
   *     This new content type is a hybrid being adapted from the knowledge base
   *     content type used by IT Services and the News type available to all departments.
   *     It is intended to provide a searchable, sortable group of articles that can be
   *     exported to and used by any department when they need a summary and image to
   *     align responsively in an organizer layout.
   *
   *     This specific project is intended for the CDLI Gadget Finder.
   *
   *     This content type will work in conjunction with the Organizer and each item
   *     will contain one searchable, article.
   *
   *     Document will write once when the page loads
   *
   *     @version 4.5
   */

  try {
      /* -- Assign all the things -- */
      var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />");
      var thumbnailImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Thumbnail image' output='normal' formatter='path/*' />");
      var altThumbnailImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Alt Image' output='normal' modifiers='striptags,htmlentities' />");
      var articleSummary = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Summary' output='normal' display_field='value' />");
      var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Full Article' output='normal' display_field='value' />");
      var externalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' use-element='true' filename-element='External Link' modifiers='striptags,htmlentities' />");
      var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
      var fieldTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Categories' output='normal' display_field='value' />");
      var lastModified = '<div class="lastModified" style="display:inline-block"><p>Last modified: <t4 type="meta" meta="last_modified" format="MMMM d, yyyy" /></p></div>';
      var listOfTags = "";
      var titleLink = "";
      var thumbNailString = "";


      /**
       * Fields reserved for full text layout:
       * 
       *    var featureImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Thumbnail image' output='normal' formatter='path/*' />");
       *    var altFeatureImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Alt Feature Image' output='normal' modifiers='striptags,htmlentities' />");
       *
       */


      /* -- Prepare all the things -- */
      var beginningHTML = '<div class="newsItemWrapper" id="id<t4 type=\'meta\' meta=\'content_id\' />"><div class="newsItem standardContent">';
      var endingHTML = '</div></div>';


      /* parse the list of tags, add <li> tags*/
      if (fieldTags != "") {
          var arrayOfTags = fieldTags.split(',');
          for (let i = 0; i < arrayOfTags.length; i++) {
              listOfTags += '<li class="tag">' + arrayOfTags[i] + '</li>';
          }
          listOfTags = '<div class="knowledgeBaseItem tags"><ul class="categories">' + listOfTags + '</ul></div>';
      }


      /* determine which link, if any, goes in the title */
      if (articleFullBody == "") {
          titleLink = "<h3>" + articleTitle + "</h3>";
      } else {
          titleLink = '<h3><a href="' + fullTextLink + '">' + articleTitle + '</a></h3>';
      }


      /* determine which link, if any, goes on the image */
      if (externalLink == "") {
          thumbNailString = '<div class="newsImage"><img src="' + thumbnailImage + '" class="articleImage" alt="' + altThumbnailImage + '" /></div>';
      } else {
          thumbNailString = '<div class="newsImage"><a href="' + externalLink + '" target="_blank"><img src="' + thumbnailImage + '" class="articleImage" alt="' + altThumbnailImage + '" /></a></div>';
      }



      /* -- Write all the things -- */
      document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
      document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
      document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, thumbNailString));
      document.write('<div class="articleSummary">');
      document.write('<div class="summary"><p>' + articleSummary + '</p></div>')
      document.write(listOfTags);
      document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, lastModified));
      document.write('</div>'); // close articleSummary
      document.write(endingHTML);




  } catch (err) {
      document.write(err.message);
  }