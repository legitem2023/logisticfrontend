// components/LuxuryErrorUI.jsx
import { useState, useEffect } from 'react';
import Head from 'next/head';

const LuxuryErrorUI = ({ 
  errorCode = 500, 
  errorMessage = "Something went wrong", 
  onRetry 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Head>
        <title>Error {errorCode} | LuxLogistics</title>
      </Head>
      
      <div className="error-container">
        <div className="error-content">
          <div className="error-graphic">
            <div className="hexagon-container">
              <div className="hexagon">
                <div className="error-code">{errorCode}</div>
              </div>
              <div className="pulse-ring"></div>
            </div>
          </div>
          
          <div className="error-details">
            <h1>System Interruption</h1>
            <p className="error-description">
              {errorMessage || "We apologize for the inconvenience. Our team has been notified and is working to resolve the issue."}
            </p>
            
            <div className="action-buttons">
              <button 
                className="primary-button"
                onClick={onRetry || (() => window.location.reload())}
              >
                <i className="icon-refresh"></i>
                Retry Connection
              </button>
              
              <button 
                className="secondary-button"
                onClick={() => setShowDetails(!showDetails)}
              >
                <i className={`icon-${showDetails ? 'chevron-up' : 'chevron-down'}`}></i>
                {showDetails ? 'Hide Details' : 'Technical Details'}
              </button>
              
              <button className="tertiary-button">
                <i className="icon-support"></i>
                Contact Support
              </button>
            </div>
            
            {showDetails && (
              <div className="technical-details">
                <h3>Technical Information</h3>
                <p>Error Code: {errorCode}</p>
                <p>Timestamp: {new Date().toLocaleString()}</p>
                <p>Reference ID: LX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="error-footer">
          <p>Motogo ® | Shipping Solutions</p>
        </div>
        
        <style jsx>{`
          .error-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #0a1a14 0%, #15261e 100%);
            color: #d8e2dc;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          
          .error-content {
            max-width: 1000px;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            background: rgba(21, 38, 30, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            padding: 3rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }
          
          .error-graphic {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          
          .hexagon-container {
            position: relative;
            width: 250px;
            height: 250px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .hexagon {
            position: relative;
            width: 200px;
            height: 200px;
            background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            z-index: 2;
            box-shadow: 0 10px 30px rgba(45, 106, 79, 0.4);
          }
          
          .error-code {
            font-size: 4rem;
            font-weight: 700;
            color: white;
          }
          
          .pulse-ring {
            position: absolute;
            width: 250px;
            height: 250px;
            border: 2px solid rgba(45, 106, 79, 0.6);
            border-radius: 50%;
            animation: pulse 2s infinite;
            z-index: 1;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              opacity: 0.7;
            }
            70% {
              transform: scale(1.1);
              opacity: 0;
            }
            100% {
              transform: scale(0.95);
              opacity: 0;
            }
          }
          
          .error-details {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            background: linear-gradient(to right, #d8e2dc, #a3b18a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .error-description {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2.5rem;
            color: #b7c9b7;
          }
          
          .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          
          button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            font-size: 1rem;
          }
          
          .primary-button {
            background: linear-gradient(to right, #2d6a4f, #40916c);
            color: white;
          }
          
          .primary-button:hover {
            background: linear-gradient(to right, #40916c, #2d6a4f);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(45, 106, 79, 0.3);
          }
          
          .secondary-button {
            background: rgba(255, 255, 255, 0.08);
            color: #d8e2dc;
            border: 1px solid rgba(255, 255, 255, 0.15);
          }
          
          .secondary-button:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: translateY(-2px);
          }
          
          .tertiary-button {
            background: transparent;
            color: #a3b18a;
          }
          
          .tertiary-button:hover {
            color: #d8e2dc;
            background: rgba(255, 255, 255, 0.05);
          }
          
          .technical-details {
            background: rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            border-radius: 12px;
            border-left: 4px solid #2d6a4f;
          }
          
          .technical-details h3 {
            margin-bottom: 1rem;
            color: #d8e2dc;
            font-size: 1.2rem;
          }
          
          .technical-details p {
            margin-bottom: 0.5rem;
            font-family: monospace;
            color: #a3b18a;
          }
          
          .error-footer {
            margin-top: 3rem;
            text-align: center;
            color: #7a8c69;
            font-size: 0.9rem;
          }
          
          @media (max-width: 768px) {
            .error-content {
              grid-template-columns: 1fr;
              text-align: center;
              padding: 2rem;
            }
            
            .hexagon-container {
              width: 200px;
              height: 200px;
              margin: 0 auto;
            }
            
            .hexagon {
              width: 150px;
              height: 150px;
            }
            
            .error-code {
              font-size: 3rem;
            }
            
            h1 {
              font-size: 2rem;
            }
          }
        `}</style>
        
        <style jsx global>{`
          /* Global icons using Font Awesome CDN */
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #15261e;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #2d6a4f;
            border-radius: 4px;
          }
        `}</style>
      </div>
    </>
  );
};

export default LuxuryErrorUI;
