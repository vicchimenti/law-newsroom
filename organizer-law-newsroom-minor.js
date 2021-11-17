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
    var base = readMedia(3050627);
    eval(String(base));
    var header, midder, footer;
    var choice = String(content.get('Article type').publish());
    switch (choice) {
        default: header = '\
			<div class="newsroomOrganizerWrapper minor-feed col-12 col-xs-12 order-xs-3 col-md-4 col-md-pull-8 order-md-2" id="id' + content.getID() + '" data-position-default="Main" data-position-selected="Main">\
				<div class="newsroomOrganizer standardContent card-deck border-0">\
                  <div class="newsroomOrganizerExtra"></div>\
		';
        midder = '\
                  <span></span>\
 		';
        footer = '\
			</div>\
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