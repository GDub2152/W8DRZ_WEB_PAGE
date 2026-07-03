
/* THE BLOWTORCH OF PARMA - Google Drive Library Web App
   Setup:
   1. Create a Google Drive folder for the club library.
   2. Put category folders inside it, such as Ham Radio, Antennas, Manuals, Minutes, Photos.
   3. Paste the root folder ID below.
   4. In Apps Script: Deploy > New deployment > Web app.
      Execute as: Me. Who has access: Anyone.
   5. Copy the Web App URL into assets/library-config.js.
*/
const ROOT_FOLDER_ID = 'PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE';

function doGet() {
  const root = DriveApp.getFolderById(ROOT_FOLDER_ID);
  const files = [];
  scanFolder_(root, 'Other', files);
  return ContentService
    .createTextOutput(JSON.stringify({ updated: new Date().toISOString(), files }))
    .setMimeType(ContentService.MimeType.JSON);
}

function scanFolder_(folder, category, out) {
  const folderName = folder.getName();
  const currentCategory = folderName === DriveApp.getFolderById(ROOT_FOLDER_ID).getName() ? category : folderName;

  const fileIter = folder.getFiles();
  while (fileIter.hasNext()) {
    const f = fileIter.next();
    out.push({
      name: f.getName(),
      url: f.getUrl(),
      category: currentCategory,
      description: f.getDescription() || '',
      mimeType: f.getMimeType(),
      modifiedTime: f.getLastUpdated().toISOString(),
      size: f.getSize()
    });
  }

  const folders = folder.getFolders();
  while (folders.hasNext()) scanFolder_(folders.next(), currentCategory, out);
}
