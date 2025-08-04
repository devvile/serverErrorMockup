export const WhitelistURLS = {
  '/api/requests/editRequestDates': 'Request dates have been updated',
  '/api/requests/draft': 'Request has been updated',
  '/api/requests/draft': 'Request has been created',
  '/api/emailconfiguration/wave/send': 'Emails have been sent successfully',
  '/api/emailconfiguration/send': 'Emails have been sent successfully',
  '/api/feedback/answer-form-update': 'Successfully updated feedback',
  '/api/feedback/answer-email-discovery-update': 'Successfully updated feedback',
  '/api/requests/edittlc': 'Request form has been updated',
  '/api/waves/createOrUpdateMany': 'Waves have been saved successfully',
  '/api/requests/removeMany': 'Requests have been succcessfuly removed',
  '/api/accountableEditorUsers': 'User has been added successfuly',
  '/api/server/importRequestDiscoveryWithFeedback': 'Data from the Xls file has been imported successfully',
  '/api/server/importWaveDiscoveryWithFeedback': 'Data from the Xls file has been imported successfully',
  '/api/feedback/blockfeedbackanswers': 'Feedback answer options have been updated successfully',
  '/api/oneItCalendar': 'Calendar request has been saved successfully',
  '/api/banner': 'Banner configuration has been updated successfully'
};

export const WhitelistURLS_COMPOSER = {
  '/affectedCi': 'Successfully updated feedback',
  '/api/waves/delete/': 'Wave has been deleted successfully',
  '/api/waves/createWavesFromRequestAndDistributeCIs/': 'Waves have been generated successfully',
  '/api/oneItCalendar/': 'Calendar request has been deleted successfully',
  '/api/emails/getEmailsForRequest/': 'Email list report request has been saved successfully',
  '/error/': 'Test operation completed successfully'
};
//todo need to thing about something more accurate
export const getCustomMessage = url => {
  if (!url) {
    return '';
  }

  let message = WhitelistURLS[url];

  if (!message) {
    message = Object.entries(WhitelistURLS_COMPOSER)
      .reduce((msg, [key, value]) => {
        if (url.indexOf(key) >= 0) {
          msg = value;
          return msg;
        }
      }, '');
  }

  return message || '';
};
