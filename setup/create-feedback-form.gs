/** Run ONCE in an Apps Script project owned by the class. No API keys needed.
 * This creates a new form, not a public response spreadsheet.
 * Final no-login access MUST be checked in a signed-out/incognito browser.
 */
function createK63FeedbackForm() {
  var properties = PropertiesService.getScriptProperties();
  var existing = properties.getProperty('K63_FEEDBACK_FORM_ID');
  if (existing) throw new Error('Form already created. Open it in Google Forms; do not create duplicates.');
  var form = FormApp.create('Góp ý sản phẩm FTU Legacy K63');
  properties.setProperty('K63_FEEDBACK_FORM_ID', form.getId());
  form.setDescription('Chọn sản phẩm, đánh giá trải nghiệm và góp ý. Không cần ghi tên hoặc email; không gửi dữ liệu cá nhân hay thông tin tài khoản. Phản hồi chỉ dành cho ban điều phối và các nhóm dự án.');
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setPublishingSummary(false);
  form.setShowLinkToRespondAgain(true);
  form.setConfirmationMessage('Cảm ơn bạn đã góp ý cho FTU Legacy K63. Phản hồi đã được ghi nhận. Bạn có thể gửi góp ý khác ở đường dẫn bên dưới.');
  var names = ['G01 - Pitch & Ledger','G02 - MEDIFIN','G03 - WHO RUNS THE WORLD?','G04 - FinFlow','G05 - ARBIVERSE','G06 - Free Fall 2.0','G07 - CFA Quest','G08 - The Last Heir','G09 - Finfolio 2.0','G10 - The Credit Desk'];
  var product = form.addListItem().setTitle('Sản phẩm bạn muốn góp ý').setChoiceValues(names).setRequired(true);
  form.addScaleItem().setTitle('Trải nghiệm của bạn').setBounds(1,5).setLabels('Cần cải thiện','Rất hài lòng').setRequired(true);
  form.addParagraphTextItem().setTitle('Điều hữu ích hoặc điều nên cải thiện').setRequired(true);
  if (form.supportsAdvancedResponderPermissions()) form.setPublished(true);
  else form.setAcceptingResponses(true);
  var prefilled = form.createResponse().withItemResponse(product.createResponse(names[0])).toPrefilledUrl();
  var entry = (prefilled.match(/[?&](entry\.\d+)=/) || [])[1];
  Logger.log(JSON.stringify({formUrl:form.getPublishedUrl(),embedUrl:form.getPublishedUrl()+'?embedded=true',productEntry:entry},null,2));
  Logger.log('Owner setup remaining: Publish/Manage/Anyone with the link. Check no-login access, no email collection and response summary OFF. Never publish your editor or response spreadsheet link.');
}
