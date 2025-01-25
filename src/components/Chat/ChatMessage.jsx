import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import './styles.css';

const ChatMessage = ({ text, isUser }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isUser) {
      setIsTyping(true);
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayText(prev => prev + text.charAt(index));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 1); // Adjust typing speed here

      return () => clearInterval(timer);
    }
  }, [text, isUser]);

  if (isUser) {
    return (
      <div className="chat-message user-message">
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div className="chat-message bot-message">
      {isTyping ? (
        <div>{displayText}</div>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code: ({node, inline, className, children, ...props}) => (
              <code className={inline ? 'inline-code' : 'block-code'} {...props}>
                {children}
              </code>
            ),
            pre: ({children}) => <pre className="code-block">{children}</pre>,
            a: ({node, children, ...props}) => (
              <a target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            )
          }}
        >
          {text}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default ChatMessage;
