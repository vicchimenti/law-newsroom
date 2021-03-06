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

    // declare content wrappers
    var header, midder, footer;

    // declare content wrappers
    header = '<div class="gridOrganizerWrapper contentItem" id="id' + content.getID() + '" data-position-default="Main" data-position-selected="Main"><div class="gridOrganizer standardContent card-deck"><div class="gridOrganizerExtra"></div>';
    midder = '<span></span>';
    footer = '</div><div class="gridOrganizer ToggleExtra boxlinks" style="display:none">Show More</div></div>';

    // Write content
    main(header, midder, footer);

    
}   catch (err) {
        document.write(err.message + err.stack);
}
