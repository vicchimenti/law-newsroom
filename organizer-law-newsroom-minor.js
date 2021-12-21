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

    

    let contactField = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Contact Info" output="selective-output" format="$value" />');
    let titleField = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Title" output="selective-output" modifiers="striptags,htmlentities" format="$value" />');

    var header, midder, footer;
    var choice = String(content.get('Article type').publish());

    switch (choice) {
        default: header = '\
			<div class="newsroomOrganizerWrapper minor-feed col-12 col-xs-12 order-xs-3 col-lg-4 col-lg-pull-8 order-lg-2" id="id' + content.getID() + '" data-position-default="Main" data-position-selected="Main">\
                <div class="contactWrapper col-xs-12">' + contactField + '</div>\
                <div class="titleWrapper standardContent col-xs-12">\
                <h2 class="organizerTitle text-center sr-only">' + titleField + '</h2></div>\
				<div class="newsroomOrganizer standardContent card-deck border-0">\
		';
        midder = '';
        footer = '</div></div>';    
    }


    // Write content
    main(header, midder, footer);


} catch (err) {
    document.write(err.message + err.stack);
}