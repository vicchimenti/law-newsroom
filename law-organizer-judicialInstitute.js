/* law/organizer/judicialInstitute */

//var fieldToBeEvaluated = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Category" output="normal" display_field="value" modifiers="htmlentities" delimiter=";" />'); //edit the field name to change the field


var fieldToBeEvaluated = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Category" output="normal" display_field="value" delimiter=";" />');


var optionToTestFor = "judicialInstitute"; //edit this to change the option
var contentTypeLayout = 'output/categoryfeed'; //edit this to change the Content Layout to use for output

var n = fieldToBeEvaluated.indexOf(optionToTestFor); /* determines starting character of string */

//document.write('<p>fieldToBeEvaluated: ' + fieldToBeEvaluated + "<br>");
//document.write('n: ' + n + "<br>");


try {
    if ((n >= 0)) { /* if it's there, it'll start at 0 or later, so process this */
        var sw = new java.io.StringWriter();
        var t4w = new com.terminalfour.utils.T4StreamWriter(sw);
        new com.terminalfour.publish.ContentPublisher().write(t4w, dbStatement, publishCache, section, content, contentTypeLayout, isPreview);
        output = sw.toString();

        document.write(output);

    } else {
        //document.write("else<br>");
    }
    //document.write("</p>");
} catch (err) {
    document.write(err.message);
}