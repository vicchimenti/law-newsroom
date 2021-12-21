/***
 * 	law/organizer/main/hero
 *	this is a switcher that defines which content layout to use given the
 *	variable that's being evaluated.
 *
 */


//var fieldToBeEvaluated = content.get("Newscenter Homepage").publish(); //edit this to change the field
//var optionToTestFor = "major"; //edit this to change the option
//var contentTypeLayout = 'output/main/herofeed'; //edit this to change the Content Layout to use for output

// try {
//     if (fieldToBeEvaluated == optionToTestFor) {
//         var sw = new java.io.StringWriter();
//         var t4w = new com.terminalfour.utils.T4StreamWriter(sw);
//         new com.terminalfour.publish.ContentPublisher().write(t4w, dbStatement, publishCache, section, content, contentTypeLayout, isPreview);
//         output = sw.toString();

//         document.write(output);
//     }

// } catch (err) {
//     document.write(err.message);
// }



/***
 * 	majorFeed
 *	this is a switcher that defines which content layout to use given the
 *	variable that's being evaluated.
 *
 */


 //let fieldToBeEvaluated = content.get("Newscenter Homepage").publish(); //edit this to change the field
 //let optionToTestFor = "major"; //edit this to change the option
 let contentTypeLayout = 'output/main/herofeed'; //edit this to change the Content Layout to use for output
 
 // validate item has image before calling writing to major feed
 let imageElement = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Main Image' output='normal' formatter='path/*' />");
 
 
 try {
     if (imageElement != "") {
         var sw = new java.io.StringWriter();
         var t4w = new com.terminalfour.utils.T4StreamWriter(sw);
         new com.terminalfour.publish.ContentPublisher().write(t4w, dbStatement, publishCache, section, content, contentTypeLayout, isPreview);
         output = sw.toString();
 
         document.write(output);
     }
 
 } catch (err) {
     document.write(err.message);
 }