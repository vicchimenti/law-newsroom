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

    var titleField = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="content" name="Title" output="selective-output" modifiers="striptags,htmlentities" format="$value" />');


    // declare content wrappers
    var header, midder, footer;

    // declare content wrappers
    header = '<div class="gridOrganizerWrapper contentItem" id="id' + content.getID() + '" \
                data-position-default="Main" data-position-selected="Main"> \
                <div class="titleWrapper col-xs-12"><h2 class="organizerTitle">' + titleField + '</h2></div> \
                <div class="gridOrganizer standardContent card-deck">';
    midder = '';
    footer = '</div></div>';

    // Write content
    main(header, midder, footer);

    
}   catch (err) {
        document.write(err.message + err.stack);
}
