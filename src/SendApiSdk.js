'use strict';
const MessageState = require('./constants/MessageState');
const MessageResponse = require('./model/MessageResponse');
const rp = require('request-promise');

class SendApiSdk {

    constructor(accessToken) {
        this.apiUrl = `https://graph.facebook.com/v2.11/me/messages?access_token=${accessToken}`;
        this.requestOptions = {
            method: 'POST',
            uri: this.apiUrl,
            json: true
        };
    }

    sendMessage(messageRequestOrTemplate, typing) {
        let options = {...this.requestOptions};
        options.body = messageRequestOrTemplate;

        if (typing) {
            return this.sendTypingIndicator(messageRequestOrTemplate.recipient)
                .then(messageResponse => rp(options))
                .then(response => new MessageResponse(response))
                .catch(error => console.log(error));
        } else {
            return rp(options)
                .then(response => new MessageResponse(response))
                .catch(error => console.log(error));
        }
    }

    sendTypingIndicator(recipient) {
        return this.sendAction(recipient, MessageState.TYPING_ON);
    }

    sendAction(recipient, sender_action) {
        let options = {...this.requestOptions};
        options.body = {
            recipient: recipient,
            sender_action: sender_action
        };

        return rp(options)
            .then(response => new MessageResponse(response))
            .catch(error => console.log(error));
    }
}

export default SendApiSdk;