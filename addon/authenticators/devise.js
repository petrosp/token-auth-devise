// import Ember from 'ember';
// import Base from 'ember-simple-auth/authenticators/base';
//
// export default Base.extend({
//   restore(data) {
//   },
//
//   authenticate(/*args*/) {
//   },
//
//   invalidate(data) {
//   }
// });

import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';
import Ember from 'ember';

const { RSVP, isEmpty, run } = Ember;

export default DeviseAuthenticator.extend({
  session: Ember.inject.service('session'),

  restore(data){
    return new RSVP.Promise((resolve, reject) => {
      if (!isEmpty(data.accessToken) && !isEmpty(data.expiry) &&
        !isEmpty(data.tokenType) && !isEmpty(data.uid) && !isEmpty(data.client)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  authenticate(identification, password) {
    return new RSVP.Promise((resolve, reject) => {
      const { identificationAttributeName } = this.getProperties('identificationAttributeName');
      const data         = { password };
      data[identificationAttributeName] = identification;

      this.makeRequest(data).then(function(response, status, xhr) {
        var result = {
          accessToken: xhr.getResponseHeader('access-token'),
          expiry: xhr.getResponseHeader('expiry'),
          tokenType: xhr.getResponseHeader('token-type'),
          uid: xhr.getResponseHeader('uid'),
          client: xhr.getResponseHeader('client')
        };

        run(null, resolve, result);
      }, function(xhr) {
        run(null, reject, xhr.responseJSON || xhr.responseText);
      });
    });
  }
});
