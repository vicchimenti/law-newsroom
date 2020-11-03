/* majorFeed
this is a switcher that defines which content layout to use given the variable that's being evaluated.

We could simple use this content layout to output the HTML + Content, but programmable layouts are tricky to manage and the code can't be reused easily for the many category pages we will have.


*/
var fieldToBeEvaluated = content.get("Major or Minor").publish(); //edit this to change the field
var optionToTestFor = "major"; //edit this to change the option
var contentTypeLayout   = 'output/majorfeed'; //edit this to change the Content Layout to use for output

try {
  if (fieldToBeEvaluated == optionToTestFor){
	var sw = new java.io.StringWriter();
	var t4w = new com.terminalfour.utils.T4StreamWriter(sw);
	new com.terminalfour.publish.ContentPublisher().write(t4w, dbStatement, publishCache, section, content, contentTypeLayout, isPreview); 
	output = sw.toString();

	document.write(output);
  }

} catch(err) {
	document.write(err.message);
}