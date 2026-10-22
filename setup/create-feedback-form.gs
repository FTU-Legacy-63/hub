/**
 * Run createK63FeedbackForm in your own Google Apps Script project.
 * Creates one responder form and one PRIVATE response spreadsheet.
 * Re-running resumes setup; no existing responses are deleted.
 * No Gmail, email sending, external requests, triggers or Drive sharing.
 * Signed-out access still requires an incognito check by the owner.
 */
function createK63FeedbackForm() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var properties = PropertiesService.getScriptProperties();
    var existing = properties.getProperty('K63_FEEDBACK_FORM_ID');
    var form = existing ? FormApp.openById(existing) : FormApp.create('Góp ý sản phẩm FTU Legacy K63', false);
    properties.setProperty('K63_FEEDBACK_FORM_ID', form.getId());
    form.setDescription('Chọn sản phẩm, đánh giá trải nghiệm và góp ý. Không thu tên hoặc email. Không gửi dữ liệu cá nhân hay thông tin tài khoản. Phản hồi dành cho ban điều phối; không công khai kết quả.');
    form.setCollectEmail(false);
    form.setLimitOneResponsePerUser(false);
    form.setPublishingSummary(false);
    form.setShowLinkToRespondAgain(true);
    form.setConfirmationMessage('Cảm ơn bạn đã góp ý cho FTU Legacy K63. Phản hồi đã được ghi nhận.');
    var names = ['G01 - Pitch & Ledger','G02 - MEDIFIN','G03 - WHO RUNS THE WORLD?','G04 - FinFlow','G05 - ARBIVERSE','G06 - Free Fall 2.0','G07 - CFA Quest','G08 - The Last Heir','G09 - Finfolio 2.0','G10 - The Credit Desk'];
    function findItem(title) {
      return form.getItems().filter(function(item) { return item.getTitle() === title; })[0];
    }
    var productTitle = 'Sản phẩm bạn muốn góp ý';
    var product = findItem(productTitle);
    product = product ? product.asListItem() : form.addListItem().setTitle(productTitle);
    product.setChoiceValues(names).setRequired(true);
    var ratingTitle = 'Trải nghiệm của bạn';
    var rating = findItem(ratingTitle);
    rating = rating ? rating.asScaleItem() : form.addScaleItem().setTitle(ratingTitle);
    rating.setBounds(1,5).setLabels('Cần cải thiện','Rất hài lòng').setRequired(true);
    var commentTitle = 'Điều hữu ích hoặc điều nên cải thiện';
    var comment = findItem(commentTitle);
    comment = comment ? comment.asParagraphTextItem() : form.addParagraphTextItem().setTitle(commentTitle);
    comment.setRequired(true).setHelpText('Không ghi mật khẩu, số điện thoại, email hoặc thông tin cá nhân.');
    // No sharing calls: the linked response spreadsheet is private by default.
    if (!form.getDestinationId()) {
      var sheetId = properties.getProperty('K63_FEEDBACK_SHEET_ID');
      if (!sheetId) {
        sheetId = SpreadsheetApp.create('FTU Legacy K63 - Phản hồi (riêng tư)').getId();
        properties.setProperty('K63_FEEDBACK_SHEET_ID', sheetId);
      }
      form.setDestination(FormApp.DestinationType.SPREADSHEET, sheetId);
    }
    if (form.supportsAdvancedResponderPermissions()) form.setPublished(true);
    else form.setAcceptingResponses(true);
    // Drafts a prefilled URL; never submits a response. Do not use item.getId()
    // as the public entry key, which is extracted from Google's real URL.
    var prefilled = form.createResponse().withItemResponse(product.createResponse(names[0])).toPrefilledUrl();
    var entry = (prefilled.match(/[?&](entry\.\d+)=/) || [])[1];
    if (!entry) throw new Error('Không lấy được productEntry. Giữ nguyên form và gửi link điền sẵn để kiểm tra.');
    Logger.log(JSON.stringify({formUrl:form.getPublishedUrl(),embedUrl:form.getPublishedUrl()+'?embedded=true',productEntry:entry},null,2));
    Logger.log('Kiểm tra Publish/Manage: Anyone with the link; thử ở cửa sổ ẩn danh. Chỉ gửi đoạn JSON phía trên, không gửi link chỉnh sửa hoặc bảng phản hồi.');
  } finally {
    lock.releaseLock();
  }
}
