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
 *      @version 1.0
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






<div class="newsCenterContact card">
  <h3 class="newsCenterContactHeader card-header"></h3>
  <div class="newsCenterContactBody card-body">
      <div class="newsCenterContactPrimary">
        <h4 class="card-title contactName"></h4>
        <p class="card-text contactTitle"></p>
        <p class="card-text contactDepartment"></p>
        <p class="card-text emailWrapper"><a href="#" class="contactEmail"></a></p>
        <p class="card-text contactPhone"></p> 
      </div>
      <div class="newsCenterContactSecondary">
        <h4 class="card-title contactName"></h4>
        <p class="card-text contactTitle"></p>
        <p class="card-text contactDepartment"></p>
        <p class="card-text emailWrapper"><a href="#" class="contactEmail"></a></p>
        <p class="card-text contactPhone"></p> 
      </div>
  </div>
</div>