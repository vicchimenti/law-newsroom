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
	var base = readMedia(1607015);
	eval(String(base));
	// Set content wrapper, if any
	var header, midder, footer;
	var choice = String(content.get('Article type').publish());
	switch (choice) {
	default:
		header = '\
			<div class="newsroomOrganizerWrapper contentItem" id="id' + content.getID() + '" data-position-default="MainZone" data-position-selected="MainZone">\
				<div class="newsroomOrganizer standardContent">\
                  <div class="newsroomOrganizerExtra"></div>\
		';
        midder = '\
                  <span></span>\
 		';
        footer = '\
			</div>\
			<div class="newsroomOrganizerToggleExtra boxlinks" style="display:none">Show More</div>\
		</div>\
 		';
	}
	// Write content
  	// Delegate header/footer writing to main method
  	// (paginator doesn't display them in publish on pages >1, only preview)
	//if (header) document.write(header);
	main(header, midder, footer);
	//if (footer) document.write(footer);
}

catch (err) {
	document.write(err.message + err.stack);
}