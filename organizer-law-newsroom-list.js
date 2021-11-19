function readMedia(mediaID) {
	var oMM = com.terminalfour.media.MediaManager.getManager();
	var oMedia = oMM.get(dbStatement, mediaID, language);
	var oMediaStream = oMedia.getMedia();
	var oScanner = new java.util.Scanner(oMediaStream).useDelimiter("\\A");
	var sMedia = "";
	while (oScanner.hasNext()) {
		sMedia += oScanner.next();
	}
	return sMedia; 
}


try {
	// Import Organizer base from media library
	var base = readMedia(1889354);
	eval(String(base));

	let titleField = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Title" output="selective-output" modifiers="striptags,htmlentities" format="$value" />');


	// Set content wrappers
	var header, midder, footer;
  
	header = '<div class="newsroomOrganizerWrapper contentItem col" id="id' + content.getID() + '" data-position-default="Main" data-position-selected="Main">\
				<div class="titleWrapper standardContent col-xs-12">\
                <h2 class="organizerTitle text-center">' + titleField + '</h2></div>\
				<div class="newsroomOrganizer standardContent col-xs-12 card-deck">';
	midder = '';
	footer = '</div></div>';
        
	// Write content
  	main(header, midder, footer);
}

catch (err) {
	document.write(err.message + err.stack);
}