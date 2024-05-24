"use client";

import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

export default function Head() {
  const [peerId, setPeerId] = useState('');
  const [inputPeerId, setInputPeerId] = useState('');
  const [callId, setCallId] = useState('');
  const [peer, setPeer] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [call, setCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const remoteAudioRef = useRef();
  const localAudioRef = useRef(); // Ref for local audio playback

  useEffect(() => {
    if (peerId) {
      const peerInstance = new Peer(peerId);

      peerInstance.on('open', id => {
        setPeerId(id);
      });

      peerInstance.on('call', incomingCall => {
        setIncomingCall(incomingCall);
      });

      peerInstance.on('error', err => {
        console.error('PeerJS error:', err);
      });

      setPeer(peerInstance);

      return () => {
        peerInstance.destroy();
      };
    }
  }, [peerId]);

  const initializePeer = () => {
    if (!inputPeerId) {
      alert("Please enter your ID");
      return;
    }
    setPeerId(inputPeerId);
  };

  const answerCall = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setLocalStream(stream);
        localAudioRef.current.srcObject = stream; // Attach local stream to audio element
        incomingCall.answer(stream);
        incomingCall.on('stream', remoteStream => {
          remoteAudioRef.current.srcObject = remoteStream; // Set remote stream to remote audio element
        });
        setCall(incomingCall);
        setIncomingCall(null);
      })
      .catch(err => {
        console.error('Error accessing media devices:', err);
      });
  };

  const declineCall = () => {
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(null);
    }
  };

  const callUser = (id) => {
    if (!id) {
      alert("Please enter the recipient ID");
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setLocalStream(stream);
        localAudioRef.current.srcObject = stream; // Attach local stream to audio element
        const outgoingCall = peer.call(id, stream);
        if (outgoingCall) {
          outgoingCall.on('stream', remoteStream => {
            remoteAudioRef.current.srcObject = remoteStream; // Set remote stream to remote audio element
          });
          outgoingCall.on('error', err => {
            console.error('Outgoing call error:', err);
          });
          setCall(outgoingCall);
        } else {
          console.error('Failed to initiate call.');
        }
      })
      .catch(err => {
        console.error('Error accessing media devices:', err);
      });
  };

  const endCall = () => {
    if (call) {
      call.close();
      setCall(null);
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    remoteAudioRef.current.srcObject = null;
    localAudioRef.current.srcObject = null; // Clear local audio playback
  };

  return (
    <div>
      <h1>Carsle Voice Call</h1>
      {!peerId ? (
        <div>
          <input
            type="text"
            placeholder="Enter your ID"
            value={inputPeerId}
            onChange={(e) => setInputPeerId(e.target.value)}
          />
          <button onClick={initializePeer}>Set My ID</button>
        </div>
      ) : (
        <div>
          <h2>Your ID: {peerId}</h2>
          <input
            type="text"
            placeholder="Enter recipient ID"
            value={callId}
            onChange={(e) => setCallId(e.target.value)}
          />
          <button onClick={() => callUser(callId)}>Call</button>
          <button onClick={endCall}>End Call</button>
          {incomingCall && (
            <div>
              <h3>Incoming Call</h3>
              <button onClick={answerCall}>Answer</button>
              <button onClick={declineCall}>Decline</button>
            </div>
          )}
          <audio ref={remoteAudioRef} autoPlay></audio>
          <audio ref={localAudioRef} autoPlay muted></audio> {/* Local audio playback with mute */}
        </div>
      )}
    </div>
  );
}













// // Ensure this is at the top of your component file to make it a client component
// "use client";

// import { useState, useEffect, useRef } from 'react';
// import Peer from 'peerjs';

// export default function Home() {
//     const [peerId, setPeerId] = useState('');
//        const [inputPeerId, setInputPeerId] = useState('');
//        const [callId, setCallId] = useState('');
//        const [peer, setPeer] = useState(null);
//        const [localStream, setLocalStream] = useState(null);
//        const [call, setCall] = useState(null);
//        const [incomingCall, setIncomingCall] = useState(null);
//        const remoteAudioRef = useRef();
    
//        useEffect(() => {
//          if (peerId) {
//            const peerInstance = new Peer(peerId);
    
//            peerInstance.on('open', id => {
//              setPeerId(id);
//            });
    
//            peerInstance.on('call', incomingCall => {
//              setIncomingCall(incomingCall);
//            });
    
//            peerInstance.on('error', err => {
//              console.error('PeerJS error:', err);
//            });
    
//            setPeer(peerInstance);
    
//            return () => {
//              peerInstance.destroy();
//            };
//          }
//        }, [peerId]);


//     const initializePeer = () => {
//         setPeerId(inputPeerId);
//     };

    

//   const answerCall = () => {
//     navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
//       setLocalStream(stream);
//       incomingCall.answer(stream);
//       incomingCall.on('stream', remoteStream => {
//         remoteAudioRef.current.srcObject = remoteStream;
//       });
//       setCall(incomingCall);
//       setIncomingCall(null);
//     });
//   };

//   const declineCall = () => {
//     if (incomingCall) {
//       incomingCall.close();
//       setIncomingCall(null);
//     }
//   };

//   const callUser = (id) => {
//     navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
//       setLocalStream(stream);
//       const outgoingCall = peer.call(id, stream);
//       outgoingCall.on('stream', remoteStream => {
//         remoteAudioRef.current.srcObject = remoteStream;
//       });
//       setCall(outgoingCall);
//     });
//   };

//   const endCall = () => {
//     if (call) {
//       call.close();
//       setCall(null);
//     }
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//       setLocalStream(null);
//     }
//     remoteAudioRef.current.srcObject = null;
//   };

//   return (
//     <div>
//       <h1>PeerJS Voice Call</h1>
//       {!peerId ? (
//         <div>
//            <input
//              type="text"
//              placeholder="Enter your ID"
//              value={inputPeerId}
//              onChange={(e) => setInputPeerId(e.target.value)}
//            />
//            <button onClick={initializePeer}>Set My ID</button>
//          </div>
//        ) : (
//          <div>
//            <h2>Your ID: {peerId}</h2>
//            <input
//              type="text"
//              placeholder="Enter recipient ID"
//              value={callId}
//              onChange={(e) => setCallId(e.target.value)}
//            />
//            <button onClick={() => callUser(callId)}>Call</button>
//            <button onClick={endCall}>End Call</button>
//            {incomingCall && (
//              <div>
//                <h3>Incoming Call</h3>
//                <button onClick={answerCall}>Answer</button>
//                <button onClick={declineCall}>Decline</button>
//              </div>
//            )}
//            <audio ref={remoteAudioRef} autoPlay></audio>
//          </div>
//        )}
//      </div>
//   );
// }



// Ensure this is at the top of your component file to make it a client component
// "use client";

// import { useState, useEffect, useRef } from 'react';
// import Peer from 'peerjs';

// export default function Home() {
//   const [peerId, setPeerId] = useState('');
//   const [inputPeerId, setInputPeerId] = useState('');
//   const [callId, setCallId] = useState('');
//   const [peer, setPeer] = useState(null);
//   const [localStream, setLocalStream] = useState(null);
//   const [call, setCall] = useState(null);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const remoteAudioRef = useRef();

//   useEffect(() => {
//     if (peerId) {
//       const peerInstance = new Peer(peerId, {
//         host: 'peerjs-server.herokuapp.com',
//         secure:true, 
//         port:443
//       });

//       peerInstance.on('open', id => {
//         setPeerId(id);
//       });

//       peerInstance.on('call', incomingCall => {
//         setIncomingCall(incomingCall);
//       });

//       setPeer(peerInstance);

//       return () => {
//         peerInstance.destroy();
//       };
//     }
//   }, [peerId]);

//   const initializePeer = () => {
//     setPeerId(inputPeerId);
//   };

//   const answerCall = () => {
//     navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
//       setLocalStream(stream);
//       incomingCall.answer(stream);
//       incomingCall.on('stream', remoteStream => {
//         remoteAudioRef.current.srcObject = remoteStream;
//       });
//       setCall(incomingCall);
//       setIncomingCall(null);
//     });
//   };

//   const declineCall = () => {
//     if (incomingCall) {
//       incomingCall.close();
//       setIncomingCall(null);
//     }
//   };

//   const callUser = (id) => {
//     navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
//       setLocalStream(stream);
//       const outgoingCall = peer.call(id, stream);
//       outgoingCall.on('stream', remoteStream => {
//         remoteAudioRef.current.srcObject = remoteStream;
//       });
//       setCall(outgoingCall);
//     });
//   };

//   const endCall = () => {
//     if (call) {
//       call.close();
//       setCall(null);
//     }
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//       setLocalStream(null);
//     }
//     remoteAudioRef.current.srcObject = null;
//   };

//   return (
//     <div>
//       <h1>PeerJS Voice Call</h1>
//       {!peerId ? (
//         <div>
//           <input
//             type="text"
//             placeholder="Enter your ID"
//             value={inputPeerId}
//             onChange={(e) => setInputPeerId(e.target.value)}
//           />
//           <button onClick={initializePeer}>Set My ID</button>
//         </div>
//       ) : (
//         <div>
//           <h2>Your ID: {peerId}</h2>
//           <input
//             type="text"
//             placeholder="Enter recipient ID"
//             value={callId}
//             onChange={(e) => setCallId(e.target.value)}
//           />
//           <button onClick={() => callUser(callId)}>Call</button>
//           <button onClick={endCall}>End Call</button>
//           {incomingCall && (
//             <div>
//               <h3>Incoming Call</h3>
//               <button onClick={answerCall}>Answer</button>
//               <button onClick={declineCall}>Decline</button>
//             </div>
//           )}
//           <audio ref={remoteAudioRef} autoPlay></audio>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useRef } from 'react';
// import Peer from 'peerjs';




// export default function Home() {
//   const [peerId, setPeerId] = useState('');
//   const [inputPeerId, setInputPeerId] = useState('');
//   const [callId, setCallId] = useState('');
//   const [peer, setPeer] = useState(null);
//   const [localStream, setLocalStream] = useState(null);
//   const [call, setCall] = useState(null);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const remoteAudioRef = useRef();

//   useEffect(() => {
//     if (peerId) {
//       const peerInstance = new Peer(peerId, {
//         host: "/",
//         port: "9000"
//       });

//       peerInstance.on('open', id => {
//         setPeerId(id);
//       });

//       peerInstance.on('call', incomingCall => {
//         setIncomingCall(incomingCall);
//       });

//       peerInstance.on('error', err => {
//         console.error('PeerJS error:', err);
//       });

//       setPeer(peerInstance);

//       return () => {
//         peerInstance.destroy();
//       };
//     }
//   }, [peerId]);

//   const initializePeer = () => {
//     if (!inputPeerId) {
//       alert("Please enter your ID");
//       return;
//     }
//     setPeerId(inputPeerId);
//   };

//   const answerCall = () => {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(stream => {
//         setLocalStream(stream);
//         incomingCall.answer(stream);
//         incomingCall.on('stream', remoteStream => {
//           remoteAudioRef.current.srcObject = remoteStream;
//         });
//         setCall(incomingCall);
//         setIncomingCall(null);
//       })
//       .catch(err => {
//         console.error('Error accessing media devices:', err);
//       });
//   };

//   const declineCall = () => {
//     if (incomingCall) {
//       incomingCall.close();
//       setIncomingCall(null);
//     }
//   };

//   const callUser = (id) => {
//     if (!id) {
//       alert("Please enter the recipient ID");
//       return;
//     }
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(stream => {
//         setLocalStream(stream);
//         const outgoingCall = peer.call(id, stream);
//         if (outgoingCall) {
//           outgoingCall.on('stream', remoteStream => {
//             remoteAudioRef.current.srcObject = remoteStream;
//           });
//           outgoingCall.on('error', err => {
//             console.error('Outgoing call error:', err);
//           });
//           setCall(outgoingCall);
//         } else {
//           console.error('Failed to initiate call.');
//         }
//       })
//       .catch(err => {
//         console.error('Error accessing media devices:', err);
//       });
//   };

//   const endCall = () => {
//     if (call) {
//       call.close();
//       setCall(null);
//     }
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//       setLocalStream(null);
//     }
//     remoteAudioRef.current.srcObject = null;
//   };

//   return (
//     <div>
//       <h1>Carsle Voice Call</h1>
//       {!peerId ? (
//         <div>
//           <input
//             type="text"
//             placeholder="Enter your ID"
//             value={inputPeerId}
//             onChange={(e) => setInputPeerId(e.target.value)}
//           />
//           <button onClick={initializePeer}>Set My ID</button>
//         </div>
//       ) : (
//         <div>
//           <h2>Your ID: {peerId}</h2>
//           <input
//             type="text"
//             placeholder="Enter recipient ID"
//             value={callId}
//             onChange={(e) => setCallId(e.target.value)}
//           />
//           <button onClick={() => callUser(callId)}>Call</button>
//           <button onClick={endCall}>End Call</button>
//           {incomingCall && (
//             <div>
//               <h3>Incoming Call</h3>
//               <button onClick={answerCall}>Answer</button>
//               <button onClick={declineCall}>Decline</button>
//             </div>
//           )}
//           <audio ref={remoteAudioRef} autoPlay></audio>
//         </div>
//       )}
//     </div>
//   );
// }





















// import Image from "next/image";
// import Link from 'next/link';
// import styles from "./page.module.css";

// export default function Head() {
//   return (
//     <div className="all">
//       <div className="body">
//         <div className="header">
//             <div className="hicon"></div>
//             <h1 className="h1">Contacts</h1>
//         </div>
//         <input type="number" className="inp" placeholder="search" />
//         <div className="fav">
//             <h1 className="favh">FAVOURITES</h1>
//             <div className="favf">
//             <div className="cirs"></div>
//             <div className="cirs1"></div>
//             <div className="cirs2"></div>
//             <div className="cirs3"></div>
//             <div className="cirs4"></div>
//             </div>
//         </div>
//         <div className="every">
//             <div className="cover">
//                 <div className="cir"></div>
//                 <h1 className="covh">
//                     Richard Joe<br />
//                     <span className="covs">+234 902 406 1211</span>
//                 </h1>
//             </div>

//             <div className="cover">
//                 <div className="cir1"></div>
//                 <h1 className="covh">
//                     Grace Toph<br />
//                     <span className="covs">+234 703 809 1317</span>
//                 </h1>
//             </div>

//             <div className="cover">
//                 <div className="cir2"></div>
//                 <h1 className="covh">
//                     Alex Ray<br />
//                     <span className="covs">+234 813 204 2498</span>
//                 </h1>
//             </div>

//             <div className="cover">
//                 <div className="cir3"></div>
//                 <h1 className="covh">
//                     Hermes Leo<br />
//                     <span className="covs">+234 703 429 7718</span>
//                 </h1>
//             </div>

//             <div className="cover">
//                 <div className="cir4"></div>
//                 <h1 className="covh">
//                     Mary Neil<br />
//                     <span className="covs">+234 704 429 6731</span>
//                 </h1>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// }