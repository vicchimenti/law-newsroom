/***
 *      @author Victor Chimenti, MSCS
 *      @see Seattle University School of Law Newsroom
 *      @file law-text-html-contact.js
 *          Law - Newscenter Contact
 *          ID: 5603
 * 
 *      A contact box exclusively for the Law School News Center
 *          Contains contact info for two profiles
 *
 *      Document will write once when the page loads
 *
 *      @version 1.8
 */








/***
 *      Import T4 Utilities
 */
 importClass(com.terminalfour.publish.utils.BrokerUtils);

 
 
 
 
 /***
  *      Extract values from T4 element tags
  *      and confirm valid existing content item field
  */
 function getContentValues(tag) {
     try {
         let _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag)
         return {
             isError: false,
             content: _tag == '' ? null : _tag
         }
     } catch (error) {
         return {
             isError: true,
             message: error.message
         }
     }
 }
 
 
 

 /***
  *      Write the document
  */
 function writeDocument(array) {
 
     for (let i = 0; i < array.length; i++) {
 
         document.write(array[i]);
     }
 }




/***
 *      Main
 * */
 try {


    /***
     *      Dictionary of content
     * */
    let contactDict = {

        contentName:    getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        contactHeader:  getContentValues('<t4 type="content" name="Header" output="normal" modifiers="striptags,htmlentities" />'),
        lastName1:      getContentValues('<t4 type="content" name="Last Name 1" output="normal" modifiers="striptags,htmlentities" />'),
        firstName1:     getContentValues('<t4 type="content" name="First Name 1" output="normal" modifiers="striptags,htmlentities" />'),
        title1:         getContentValues('<t4 type="content" name="Title 1" output="normal" modifiers="striptags,htmlentities" />'),
        department1:    getContentValues('<t4 type="content" name="Department 1" output="normal" modifiers="striptags,htmlentities" />'),
        email1:         getContentValues('<t4 type="content" name="Email 1" output="normal" modifiers="striptags,htmlentities,encode_emails" />'),
        phone1:         getContentValues('<t4 type="content" name="Phone 1" output="normal" modifiers="striptags,htmlentities" />'),
        lastName2:      getContentValues('<t4 type="content" name="Last Name 2" output="normal" modifiers="striptags,htmlentities" />'),
        firstName2:     getContentValues('<t4 type="content" name="First Name 2" output="normal" modifiers="striptags,htmlentities" />'),
        title2:         getContentValues('<t4 type="content" name="Title 2" output="normal" modifiers="striptags,htmlentities" />'),
        department2:    getContentValues('<t4 type="content" name="Department 2" output="normal" modifiers="striptags,htmlentities" />'),
        email2:         getContentValues('<t4 type="content" name="Email 2" output="normal" modifiers="striptags,htmlentities,encode_emails" />'),
        phone2:         getContentValues('<t4 type="content" name="Phone 2" output="normal" modifiers="striptags,htmlentities" />'),
        anchorTag:      getContentValues('<t4 type="meta" meta="html_anchor" />'),
        contentId:      getContentValues('<t4 type="meta" meta="content_id" />')

    }


    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
    let beginningHTML = '<div class="newsCenterContact col-12 col-xs-12 card border-0" id="contact' + contactDict.contentId.content + '" data-position-default="Main" data-position-selected="Main">';
    let endingHTML = '<hr class="articleBorderBottom"></div>';
    let headerString = '<h2 class="newsCenterContactHeader card-header text-center border-0 px-0">' + contactDict.contactHeader.content + '</h2>';
    let openCardBody = '<div class="newsCenterContactBody card-body px-0">';
    let closeCardBody = '</div>';
    let openPrimary = '<address class="newsCenterContactPrimary" id="' + contactDict.contentId.content + '">';
    let closePrimary = '</address>'
    let primaryName = '<h3 class="card-title contactName">' + contactDict.firstName1.content + ' ' + contactDict.lastName1.content + '</h3>';
    let primaryTitle = '<p class="card-text contactTitle">' + contactDict.title1.content + '</p>';
    let primaryDepartment = '<p class="card-text contactDepartment">' + contactDict.department1.content + '</p>';
    let primaryEmail = '<p class="card-text emailWrapper"><a class="contactEmail" href="mailto:' + contactDict.email1.content + '" title="Contact ' + contactDict.firstName1.content + '">Email ' + contactDict.firstName1.content + '</a></p>';
    let primaryPhone = '<p class="card-text phoneWrapper"><a class="contactPhone" href="tel:' + contactDict.phone1.content + '" title="Call ' + contactDict.firstName1.content + '">' + contactDict.phone1.content + '</a></p> ';


    let secondaryName = '<h3 class="card-title contactName">' + contactDict.firstName2.content + ' ' + contactDict.lastName2.content + '</h3>';
    let secondaryTitle = '<p class="card-text contactTitle">' + contactDict.title2.content + '</p>';
    let secondaryDepartment = '<p class="card-text contactDepartment">' + contactDict.department2.content + '</p>';
    let secondaryEmail = '<p class="card-text emailWrapper"><a class="contactEmail" href="mailto:' + contactDict.email2.content + '" title="Contact ' + contactDict.firstName2.content + '">Email ' + contactDict.firstName2.content + '</a></p>';
    let secondaryPhone = '<p class="card-text phoneWrapper"><a class="contactPhone" href="tel:' + contactDict.phone2.content + '" title="Call ' + contactDict.firstName2.content + '">' + contactDict.phone2.content + '</a></p> ';




    /***
     *  write document once
     * 
     * */
     writeDocument (
        [
            beginningHTML,
            contactDict.anchorTag.content,
            headerString,
            openCardBody,
            openPrimary,
            primaryName,
            primaryTitle,
            primaryDepartment,
            primaryEmail,
            primaryPhone,
            closePrimary,
            closeCardBody,
            endingHTML
        ]
    );




} catch (err) {
    document.write(err.message);
}