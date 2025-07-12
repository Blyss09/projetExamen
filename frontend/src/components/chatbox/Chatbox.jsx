import './chatbox.css';

const Chatbox = () => {
    return (
        <div className="app-container">
        <div className="chat-container">
          <div className="chat-header">
            <h2 className="chat-title">💬 Chat de Discussion</h2>
          </div>
  
          <div className="chat-messages">
          </div>
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <button className="emoji-button">😊</button>
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Tapez votre message... 0/200" 
                maxLength="200" 
              />
              <button className="send-button" title="Envoyer">▲</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Chatbox;
  