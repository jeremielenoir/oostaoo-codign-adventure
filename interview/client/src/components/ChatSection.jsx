import React from 'react';
import PropTypes from 'prop-types';

/* MUI components */
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';

/* Custom components */
import Message from './Message';

/* Style */
import '../assets/css/Interview.css';

/* Component definition */
const ChatSection = ({ toggleMessage, messages, message, sendMessage, inputRef, onChangeMessage }) => (
  <div className="chat-text">
    <div className="title-chat-text">
      <span> Messages dans l'appel </span>
      <CloseIcon id="close-icon" onClick={toggleMessage} />
    </div>
    <div className="messagesList">
      {messages.response.length > 0
        && messages.response.map((message) => (
          <Message text={message.text} date={message.date} />
        ))}
    </div>

    <div className="messageWriting">
      <form className="messageForm" onSubmit={(e) => sendMessage(e)}>
        <TextField
          required
          id="message"
          label="Message"
          value={message}
          ref={inputRef}
          onChange={(e) => onChangeMessage(e)}
          variant="outlined"
        />
        <Button
          id="send"
          size="small"
          color="primary"
          onClick={(e) => sendMessage(e)}
          style={{
            maxWidth: '40px',
            maxHeight: '56px',
            minWidth: '40px',
            minHeight: '56px',
            marginLeft: '5px',
          }}
        >
          <SendIcon />
        </Button>
      </form>
    </div>
  </div>
);

/* Proptypes */
ChatSection.propTypes = {
  toggleMessage: PropTypes.func,
  messages: PropTypes.object, // probably to change into array once we get the right response
  message: PropTypes.string,
  sendMessage: PropTypes.func,
  inputRef: PropTypes.func,
  onChangeMessage: PropTypes.func,
};

export default ChatSection;