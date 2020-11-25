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
    // This is the original media library file for the edu newsroom 526090
    // This is the media library file for the new organizer 1607015
    // This is the media library file for the new law newsroom organizer 1889354
    eval(String(base));
    // Set content wrapper, if any
    // rm contentItem class
    var header, midder, footer;
    var choice = String(content.get('Article type').publish());
    switch (choice) {
        default: header = '\
			<div class="newsroomOrganizerWrapper col-xs-12 order-xs-1 col-md-8 col-md-push-4 order-md-2" id="id' + content.getID() + '" data-position-default="Main" data-position-selected="Main">\
				<span class="border-left">\
					<div class="newsroomOrganizer standardContent">\
                  		<div class="newsroomOrganizerExtra"></div>\
		';
        midder = '\
                  <span></span>\
 		';
        footer = '\
				</div>\
				<div class="newsroomOrganizerToggleExtra boxlinks" style="display:none">Show More</div>\
			</span>\
		</div>\
 		';
    }
    // Write content
    // Delegate header/footer writing to main method
    // (paginator doesn't display them in publish on pages >1, only preview)
    //if (header) document.write(header);
    main(header, midder, footer);
    //if (footer) document.write(footer);
} catch (err) {
    document.write(err.message + err.stack);
}