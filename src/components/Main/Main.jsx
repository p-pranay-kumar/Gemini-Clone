import React, { useContext, useState, useEffect } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { context } from '../../context/context';

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, setResultData, setRecentPrompt, setLoading, isNewChat, setIsNewChat } = useContext(context);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    console.log("resultData:", resultData);
  }, [resultData]);

  useEffect(() => {
    if (isNewChat) {
      setInput('');
      setResultData('');
      setIsSent(false);
      setIsNewChat(false); // Reset the new chat state
    }
  }, [isNewChat, setInput, setResultData, setIsNewChat]);

  const handleSend = async () => {
    console.log("Sending prompt:", input); // Add this line for debugging
    if (input.trim() === '') return;
    setRecentPrompt(input);
    setLoading(true);
    setIsSent(true);
    await onSent(input);
    setLoading(false);
    setInput('');
    setIsNewChat(false); // Reset isNewChat state after sending a new prompt
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const sanitizeHTML = (html) => {
    return { __html: html };
  };

  return (
    <div className='main'>
      <div className='nav'>
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className='main-container'>
        {isSent ? (
          <div className='result'>
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className='loader'>
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <div>
                  <h5 dangerouslySetInnerHTML={sanitizeHTML(resultData)}></h5>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className='greet'>
              <p><span>Hello, Pranay.</span></p>
              <p>How can I help you today?</p>
            </div>
            <div className='cards'>
              <div className='card'>
                <p>Suggest beautiful places to see on an upcoming trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className='card'>
                <p>Teach me the concept of game theory in simple terms</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className='card'>
                <p>Give me ways to add certain foods to my diet</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className='card'>
                <p>Write code for a specific task, including edge cases</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              type="text" 
              placeholder='Enter a prompt here'
              onKeyPress={handleKeyPress} // Add event listener for Enter key press
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img onClick={handleSend} src={assets.send_icon} alt="" />
            </div>
          </div>
          <p className='bottom-info'>
            Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
