/***
 *  law/grid/organizer/archives
 * 
 */


/***
 *  declare and assign topic layout
 * 
 */
 var fieldToBeEvaluated = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Category" output="normal" display_field="value" delimiter=";" />');
 var optionToTestFor = "news center archives"; //not used for archives
 var contentTypeLayout = 'output/gridfeed'; // hardcoded for archives
 var n = fieldToBeEvaluated.indexOf(optionToTestFor); /* not used for archives */
 
 
 /***
  *  send correct layout to the document
  * 
  */
 try {
 
     /* archives all default to gridfeed */
     if ((contentTypeLayout == "output/gridfeed")) {
         var sw = new java.io.StringWriter();
         var t4w = new com.terminalfour.utils.T4StreamWriter(sw);
         new com.terminalfour.publish.ContentPublisher().write(t4w, dbStatement, publishCache, section, content, contentTypeLayout, isPreview);
         output = sw.toString();
 
         // write to page document
         document.write(output);
     }
 
 
 } catch (err) {
     document.write(err.message);
 }