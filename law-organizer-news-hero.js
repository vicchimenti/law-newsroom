/***
 * 	law/organizer/news/hero
 *	this is a switcher that defines which content layout to use given the
 *	variable that's being evaluated.
 *
 */


var fieldToBeEvaluated = content.get("Newscenter Homepage").publish(); //edit this to change the field
var optionToTestFor = "centerpiece"; //edit this to change the option
var contentTypeLayout = 'output/herofeed'; //edit this to change the Content Layout to use for output

try {
    if (fieldToBeEvaluated == optionToTestFor) {
        var sw = new java.io.StringWriter();
        var t4w = new com.terminalfour.utils.T4StreamWriter(sw);
        new com.terminalfour.publish.ContentPublisher().write(t4w, dbStatement, publishCache, section, content, contentTypeLayout, isPreview);
        output = sw.toString();

        document.write(output);
    }

} catch (err) {
    document.write(err.message);
}