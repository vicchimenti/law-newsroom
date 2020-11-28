  /***
   *     @author Victor Chimenti, MSCS-SE '20
   *     @file output-categoryfeed.js
   *
   *     This layout is adapted from the edu general news layout.
   *
   *     This content type will work in conjunction with the Organizer and each item
   *     will contain one searchable, article.
   *
   *     Document will write once when the page loads
   *
   *     @version 5.0
   */

  try {
      /* -- Assign all the things -- */
      var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />");
      var thumbnailImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Media Library Image' output='normal' formatter='path/*' />");
      var altThumbnailImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Media Library Image Caption' output='normal' modifiers='striptags,htmlentities' />");
      var articleSummary = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Abstract' output='normal' display_field='value' />");
      var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Body' output='normal' display_field='value' />");
      //   var externalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' use-element='true' filename-element='External Link' modifiers='striptags,htmlentities' />");
      //   var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
      var fieldTags = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Category' output='normal' display_field='value' />");
      var headline = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Headline' output='normal' display_field='value' />");

      var author = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Author' output='normal' display_field='value' />");

      var publishedDate = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Publish Date' output='normal' date_format='MMMM d, yyyy' />");

      var pinned = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Pinned' output='normal' display_field='value' />");

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