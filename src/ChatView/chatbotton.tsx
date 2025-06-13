// import React, { useState } from 'react';
// import { Button, Box, Tooltip } from '@mui/material';
// import { MessageCircle } from 'lucide-react';
//
// const AnimatedChatButton = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [sendGreet, setSendGreet] = useState(false);
//
//     const handleClick = (message) => {
//         console.log("Sending message:", message);
//         // Your chat logic here
//     };
//
//     const buttonStyles = {
//         position: 'fixed',
//         bottom: '24px',
//         right: '24px',
//         zIndex: 1300,
//         width: '64px',
//         height: '64px',
//         minWidth: '64px',
//         borderRadius: '50%',
//         background: 'linear-gradient(135deg, #00bcd4 0%, #00acc1 50%, #00838f 100%)',
//         border: '3px solid #ffffff',
//         boxShadow: '0 8px 32px rgba(0, 188, 212, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)',
//         animation: 'bounce 2s infinite, glow 3s ease-in-out infinite alternate',
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//         '&:hover': {
//             transform: 'scale(1.1)',
//             background: 'linear-gradient(135deg, #26c6da 0%, #00bcd4 50%, #00acc1 100%)',
//             boxShadow: '0 12px 40px rgba(0, 188, 212, 0.6), 0 6px 20px rgba(0, 0, 0, 0.3)',
//         },
//         '&:active': {
//             transform: 'scale(0.95)',
//         }
//     };
//
//     const rippleStyles = {
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         width: '64px',
//         height: '64px',
//         borderRadius: '50%',
//         background: 'rgba(0, 188, 212, 0.3)',
//         transform: 'translate(-50%, -50%)',
//         animation: 'ripple 2s infinite',
//         pointerEvents: 'none',
//     };
//
//     const secondaryRippleStyles = {
//         ...rippleStyles,
//         background: 'rgba(0, 188, 212, 0.2)',
//         animation: 'ripple 2s infinite 0.5s',
//         width: '80px',
//         height: '80px',
//     };
//
//     const notificationDotStyles = {
//         position: 'absolute',
//         top: '2px',
//         right: '2px',
//         width: '16px',
//         height: '16px',
//         borderRadius: '50%',
//         background: 'linear-gradient(45deg, #ff4444, #ff6666)',
//         border: '2px solid white',
//         animation: 'pulse 1.5s infinite',
//         boxShadow: '0 2px 8px rgba(255, 68, 68, 0.4)',
//     };
//
//     const tooltipStyles = {
//         position: 'absolute',
//         bottom: '80px',
//         right: '8px',
//         background: 'white',
//         color: '#333',
//         padding: '12px 16px',
//         borderRadius: '12px',
//         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
//         fontSize: '14px',
//         fontWeight: '600',
//         whiteSpace: 'nowrap',
//         animation: 'float 3s ease-in-out infinite, fadeInOut 4s infinite',
//         '&::after': {
//             content: '""',
//             position: 'absolute',
//             top: '100%',
//             right: '20px',
//             width: 0,
//             height: 0,
//             borderLeft: '8px solid transparent',
//             borderRight: '8px solid transparent',
//             borderTop: '8px solid white',
//         }
//     };
//
//     const keyframes = `
//     @keyframes bounce {
//       0%, 20%, 53%, 80%, 100% {
//         transform: translateY(0);
//       }
//       40%, 43% {
//         transform: translateY(-12px);
//       }
//       70% {
//         transform: translateY(-6px);
//       }
//       90% {
//         transform: translateY(-2px);
//       }
//     }
//
//     @keyframes ripple {
//       0% {
//         transform: translate(-50%, -50%) scale(0);
//         opacity: 1;
//       }
//       100% {
//         transform: translate(-50%, -50%) scale(2);
//         opacity: 0;
//       }
//     }
//
//     @keyframes pulse {
//       0%, 100% {
//         transform: scale(1);
//         opacity: 1;
//       }
//       50% {
//         transform: scale(1.2);
//         opacity: 0.8;
//       }
//     }
//
//     @keyframes glow {
//       0% {
//         box-shadow: 0 8px 32px rgba(0, 188, 212, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2);
//       }
//       100% {
//         box-shadow: 0 12px 40px rgba(0, 188, 212, 0.7), 0 6px 20px rgba(0, 0, 0, 0.3);
//       }
//     }
//
//     @keyframes float {
//       0%, 100% {
//         transform: translateY(0px);
//       }
//       50% {
//         transform: translateY(-8px);
//       }
//     }
//
//     @keyframes fadeInOut {
//       0%, 100% {
//         opacity: 0.9;
//       }
//       50% {
//         opacity: 1;
//       }
//     }
//
//     @keyframes iconSpin {
//       0% {
//         transform: rotate(0deg);
//       }
//       100% {
//         transform: rotate(12deg);
//       }
//     }
//   `;
//
//     return (
//         <>
//             <style>{keyframes}</style>
//             <Box sx={{ position: 'relative' }}>
//                 {/* Ripple Effects */}
//                 <Box sx={rippleStyles} />
//                 <Box sx={secondaryRippleStyles} />
//
//                 {/* Chat Prompt Tooltip */}
//                 <Box sx={tooltipStyles}>
//                     💬 Chat with us!
//                 </Box>
//
//                 {/* Main Chat Button */}
//                 <Button
//                     sx={buttonStyles}
//                     onClick={() => {
//                         setIsOpen(!isOpen);
//                         if(!sendGreet) {
//                             handleClick("hi");
//                         }
//                         setSendGreet(true);
//                     }}
//                     aria-label="Open Chat"
//                 >
//                     {/* Message Icon */}
//                     <MessageCircle
//                         style={{
//                             width: '32px',
//                             height: '32px',
//                             color: 'white',
//                             transition: 'transform 0.3s ease',
//                             animation: 'iconSpin 0.5s ease-in-out',
//                         }}
//                     />
//
//                     {/* Notification Dot */}
//                     <Box sx={notificationDotStyles}>
//                         <Box sx={{
//                             width: '8px',
//                             height: '8px',
//                             borderRadius: '50%',
//                             background: 'white',
//                             margin: 'auto',
//                             marginTop: '2px'
//                         }} />
//                     </Box>
//                 </Button>
//             </Box>
//         </>
//     );
// };
//
// export default AnimatedChatButton;