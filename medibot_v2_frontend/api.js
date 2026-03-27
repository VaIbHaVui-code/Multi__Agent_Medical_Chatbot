// // // api.js
// // // This file handles communication between your HTML and the two Python Backends.

// // // --- HELPER: GENERATE USER ID ---
// // // Your LangGraph server needs a "user_id" to remember conversation history.
// // // We save this in the browser so the bot remembers you even if you refresh.
// // function getUserId() {
// //     let userId = localStorage.getItem("medibot_user_id");
// //     if (!userId) {
// //         // Generate a random ID like "user_abc123"
// //         userId = "user_" + Math.random().toString(36).substr(2, 9);
// //         localStorage.setItem("medibot_user_id", userId);
// //     }
// //     return userId;
// // }

// // const MediBotAPI = {
    
// //     // ============================================================
// //     // FUNCTION 1: SCAN IMAGE
// //     // Connects to Backend 1 (Scanner) on Port 8000
// //     // ============================================================
// //     async scanImage(imageFile) {
// //         // 1. Prepare the file for upload
// //         const formData = new FormData();
// //         formData.append("file", imageFile); // Key must be 'file' to match api.py

// //         try {
// //             console.log("📤 Sending image to Vision Engine...");
            
// //             // Call the Vision API (defined in config.js)
// //             const response = await fetch(`${CONFIG.VISION_API_URL}/analyze`, {
// //                 method: "POST",
// //                 body: formData // No headers needed; browser handles multipart/form-data
// //             });

// //             if (!response.ok) {
// //                 throw new Error(`Vision Backend Error: ${response.statusText}`);
// //             }

// //             const data = await response.json();
// //             console.log("📥 Received Scan Report:", data);
// //             return data;

// //         } catch (error) {
// //             console.error("❌ Scanning Failed:", error);
// //             alert("Error: Scanner Backend is offline. Check if uvicorn is running on Port 8000.");
// //             return null;
// //         }
// //     },

// //     // ============================================================
// //     // FUNCTION 2: CHAT
// //     // Connects to Backend 2 (LangGraph Brain) on Port 5000
// //     // ============================================================
// //     async chat(userMessage) {
// //         const userId = getUserId(); // Get the persistent User ID

// //         try {
// //             console.log(`📤 Sending message to Brain (ID: ${userId}):`, userMessage);
            
// //             const response = await fetch(`${CONFIG.BRAIN_API_URL}/chat`, {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json"
// //                 },
// //                 body: JSON.stringify({ 
// //                     user_id: userId,   // REQUIRED by your new server.py
// //                     message: userMessage // Renamed from 'query' to 'message'
// //                 })
// //             });

// //             if (!response.ok) {
// //                 throw new Error(`Brain Backend Error: ${response.statusText}`);
// //             }

// //             const data = await response.json();
// //             console.log("📥 Received Brain Reply:", data);
            
// //             // The server returns { response: "..." }, so we return the whole object
// //             return data; 

// //         } catch (error) {
// //             console.error("❌ Chat Failed:", error);
// //             return { response: "⚠️ Error: The Brain is offline. Check if server.py is running on Port 5000." };
// //         }
// //     }
// // };
// // api.js
// // This file handles communication between your HTML and the two Python Backends.

// // --- HELPER: GENERATE USER ID ---
// // Your LangGraph server needs a "user_id" to remember conversation history.
// // We save this in the browser so the bot remembers you even if you refresh.
// // function getUserId() {
// //     let userId = localStorage.getItem("medibot_user_id");
// //     if (!userId) {
// //         // Generate a random ID like "user_abc123"
// //         userId = "user_" + Math.random().toString(36).substr(2, 9);
// //         localStorage.setItem("medibot_user_id", userId);
// //     }
// //     return userId;
// // }

// // const MediBotAPI = {
    
// //     // ============================================================
// //     // FUNCTION 1: SCAN IMAGE
// //     // Connects to Backend 1 (Scanner) on Port 8000
// //     // ============================================================
// //     async scanImage(imageFile) {
// //         // 1. Prepare the file for upload
// //         const formData = new FormData();
// //         formData.append("file", imageFile); // Key must be 'file' to match api.py

// //         try {
// //             console.log("📤 Sending image to Vision Engine...");
            
// //             // Call the Vision API (defined in config.js)
// //             const response = await fetch(`${CONFIG.VISION_API_URL}/analyze`, {
// //                 method: "POST",
// //                 body: formData // No headers needed; browser handles multipart/form-data
// //             });

// //             if (!response.ok) {
// //                 throw new Error(`Vision Backend Error: ${response.statusText}`);
// //             }

// //             const data = await response.json();
// //             console.log("📥 Received Scan Report:", data);
// //             return data;

// //         } catch (error) {
// //             console.error("❌ Scanning Failed:", error);
// //             alert("Error: Scanner Backend is offline. Check if uvicorn is running on Port 8000.");
// //             return null;
// //         }
// //     },

// //     // ============================================================
// //     // FUNCTION 2: CHAT (Legacy Static Mode)
// //     // Connects to Backend 2 (LangGraph Brain) on Port 5000
// //     // ============================================================
// //     async chat(userMessage) {
// //         const userId = getUserId(); // Get the persistent User ID

// //         try {
// //             console.log(`📤 Sending message to Brain (ID: ${userId}):`, userMessage);
            
// //             const response = await fetch(`${CONFIG.BRAIN_API_URL}/chat`, {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json"
// //                 },
// //                 body: JSON.stringify({ 
// //                     user_id: userId,   // REQUIRED by your new server.py
// //                     message: userMessage // Renamed from 'query' to 'message'
// //                 })
// //             });

// //             if (!response.ok) {
// //                 throw new Error(`Brain Backend Error: ${response.statusText}`);
// //             }

// //             const data = await response.json();
// //             console.log("📥 Received Brain Reply:", data);
            
// //             // The server returns { response: "..." }, so we return the whole object
// //             return data; 

// //         } catch (error) {
// //             console.error("❌ Chat Failed:", error);
// //             return { response: "⚠️ Error: The Brain is offline. Check if server.py is running on Port 5000." };
// //         }
// //     },

// //     // ============================================================
// //     // FUNCTION 3: LIVE CHAT STREAM (NEW: Real-Time Thinking)
// //     // Connects to Backend 2 to handle agent deliberation logs
// //     // ============================================================
// //     async chatStream(userMessage, onThought, onFinal) {
// //         const userId = getUserId();

// //         try {
// //             console.log(`📡 Opening Real-Time Stream to Brain...`);
            
// //             const response = await fetch(`${CONFIG.BRAIN_API_URL}/chat`, {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify({ 
// //                     user_id: userId,
// //                     message: userMessage 
// //                 })
// //             });

// //             if (!response.ok) throw new Error("Brain Offline");

// //             // 🟢 READABLE STREAM LOGIC (NDJSON)
// //             const reader = response.body.getReader();
// //             const decoder = new TextDecoder();
// //             let resultBuffer = "";

// //             while (true) {
// //                 const { value, done } = await reader.read();
// //                 if (done) break;

// //                 // Accumulate stream chunks and split by newline
// //                 resultBuffer += decoder.decode(value, { stream: true });
// //                 const lines = resultBuffer.split("\n");
                
// //                 // Keep potential partial line in buffer for next chunk
// //                 resultBuffer = lines.pop();

// //                 for (const line of lines) {
// //                     if (!line.trim()) continue;
// //                     try {
// //                         const data = JSON.parse(line);

// //                         // 1. Send thought to UI (Thinking Panel)
// //                         if (data.agent) {
// //                             onThought(data.agent, getAgentDisplayName(data.agent), data.text);
// //                         }

// //                         // 2. Return final verdict data to Chat bubble
// //                         if (data.final) {
// //                             onFinal(data);
// //                         }
// //                     } catch (parseErr) {
// //                         console.warn("⚠️ JSON Parse Skip:", line);
// //                     }
// //                 }
// //             }

// //         } catch (error) {
// //             console.error("❌ Stream Failed:", error);
// //             onFinal({ final: "⚠️ Connection Lost. Specialist nexus is unavailable." });
// //         }
// //     }
// // };

// // // --- UI HELPER: MAP BACKEND IDs TO PRETTY NAMES ---
// // function getAgentDisplayName(id) {
// //     const map = { 
// //         diag: "🔬 Dr. Diagnosis", 
// //         treat: "💊 Dr. Treatment", 
// //         skeptic: "🧐 The Skeptic", 
// //         judge: "👨‍⚖️ The Judge" 
// //     };
// //     return map[id] || "AI Specialist";
// // }
// // api.js
// // This file handles communication between your HTML and the two Python Backends.

// // --- HELPER: GENERATE USER ID ---
// // Your LangGraph server needs a "user_id" to remember conversation history.
// // We save this in the browser so the bot remembers you even if you refresh.
// function getUserId() {
//     let userId = localStorage.getItem("medibot_user_id");
//     if (!userId) {
//         // Generate a random ID like "user_abc123"
//         userId = "user_" + Math.random().toString(36).substr(2, 9);
//         localStorage.setItem("medibot_user_id", userId);
//     }
//     return userId;
// }

// const MediBotAPI = {
    
//     // ============================================================
//     // FUNCTION 1: SCAN IMAGE
//     // Connects to Backend 1 (Scanner) on Port 8000
//     // ============================================================
//     async scanImage(imageFile) {
//         // 1. Prepare the file for upload
//         const formData = new FormData();
//         formData.append("file", imageFile); // Key must be 'file' to match api.py

//         try {
//             console.log("📤 Sending image to Vision Engine...");
            
//             // Call the Vision API (defined in config.js)
//             const response = await fetch(`${CONFIG.VISION_API_URL}/analyze`, {
//                 method: "POST",
//                 body: formData // No headers needed; browser handles multipart/form-data
//             });

//             if (!response.ok) {
//                 throw new Error(`Vision Backend Error: ${response.statusText}`);
//             }

//             const data = await response.json();
//             console.log("📥 Received Scan Report:", data);
//             return data;

//         } catch (error) {
//             console.error("❌ Scanning Failed:", error);
//             alert("Error: Scanner Backend is offline. Check if uvicorn is running on Port 8000.");
//             return null;
//         }
//     },

//     // ============================================================
//     // FUNCTION 2: CHAT (Legacy Static Mode)
//     // Connects to Backend 2 (LangGraph Brain) on Port 5000
//     // ============================================================
//     async chat(userMessage) {
//         const userId = getUserId(); // Get the persistent User ID

//         try {
//             console.log(`📤 Sending message to Brain (ID: ${userId}):`, userMessage);
            
//             const response = await fetch(`${CONFIG.BRAIN_API_URL}/chat`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ 
//                     user_id: userId,   // REQUIRED by your new server.py
//                     message: userMessage // Renamed from 'query' to 'message'
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error(`Brain Backend Error: ${response.statusText}`);
//             }

//             const data = await response.json();
//             console.log("📥 Received Brain Reply:", data);
            
//             // The server returns { response: "..." }, so we return the whole object
//             return data; 

//         } catch (error) {
//             console.error("❌ Chat Failed:", error);
//             return { response: "⚠️ Error: The Brain is offline. Check if server.py is running on Port 5000." };
//         }
//     },

//     // ============================================================
//     // FUNCTION 3: LIVE CHAT STREAM (Real-Time Thinking)
//     // Connects to Backend 2 to handle agent deliberation logs
//     // ============================================================
//     async chatStream(userMessage, onThought, onFinal) {
//         const userId = getUserId();

//         try {
//             console.log(`📡 Opening Real-Time Stream to Brain...`);
            
//             const response = await fetch(`${CONFIG.BRAIN_API_URL}/chat`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ 
//                     user_id: userId,
//                     message: userMessage 
//                 })
//             });

//             if (!response.ok) throw new Error("Brain Offline");

//             // 🟢 READABLE STREAM LOGIC (NDJSON)
//             const reader = response.body.getReader();
//             const decoder = new TextDecoder();
//             let resultBuffer = "";

//             while (true) {
//                 const { value, done } = await reader.read();
                
//                 // If the stream is closed, process whatever is left in the buffer
//                 if (done) {
//                     if (resultBuffer.trim()) {
//                         this._processNDJSON(resultBuffer, onThought, onFinal);
//                     }
//                     break;
//                 }

//                 // Decode current chunk and add to buffer
//                 resultBuffer += decoder.decode(value, { stream: true });
                
//                 // Process only complete lines (ending in \n)
//                 const lines = resultBuffer.split("\n");
                
//                 // Keep the last partial line in the buffer for the next chunk
//                 resultBuffer = lines.pop();

//                 for (const line of lines) {
//                     this._processNDJSON(line, onThought, onFinal);
//                 }
//             }

//         } catch (error) {
//             console.error("❌ Stream Failed:", error);
//             onFinal({ final: "⚠️ Connection Lost. Specialist nexus is unavailable." });
//         }
//     },

//     // Internal helper to parse individual JSON lines from the stream
//     _processNDJSON(line, onThought, onFinal) {
//         if (!line.trim()) return;
//         try {
//             const data = JSON.parse(line);

//             // 1. If it's an agent thought, update the Thinking UI
//             if (data.agent) {
//                 onThought(data.agent, getAgentDisplayName(data.agent), data.text);
//             }

//             // 2. If it's the final verdict data, trigger the chat reply
//             if (data.final) {
//                 onFinal(data);
//             }
//         } catch (parseErr) {
//             console.warn("⚠️ JSON Parse Skip:", line);
//         }
//     }
// };

// // --- UI HELPER: MAP BACKEND IDs TO PRETTY NAMES ---
// function getAgentDisplayName(id) {
//     const map = { 
//         diag: "🔬 Dr. Diagnosis", 
//         treat: "💊 Dr. Treatment", 
//         skeptic: "🧐 The Skeptic", 
//         judge: "👨‍⚖️ The Judge" 
//     };
//     return map[id] || "AI Specialist";
// }
/**
 * api.js
 * Handles communication between the Cyberpunk UI and the MediBot Backends.
 * * - Backend 1 (Scanner - Port 8000): Standard JSON (Stable)
 * - Backend 2 (Brain - Port 5000): Real-Time NDJSON Streaming
 */

/**
 * api.js
 * Handles real-time communication for the MediBot Multi-Agent System.
 * - Backend 1 (Scanner): Port 8000 (Standard JSON)
 * - Backend 2 (Brain): Port 5000 (Streaming NDJSON)
 */

// --- PERSISTENT USER IDENTITY ---
/* ============================================================
   MEDIBOT API BRIDGE (Frontend <-> Backend)
   ============================================================ */

// 🟢 HELPER: Get the Real User ID (From Auth System)
function getUserId() {
    // 1. Try to get the ID saved by our new Authentication System
    let userId = localStorage.getItem("medibot_uid");
    
    // 2. Fallback: If no user is logged in, generate a temporary Guest ID
    if (!userId) {
        console.warn("⚠️ No logged-in user found. Using Guest ID.");
        userId = localStorage.getItem("medibot_guest_id");
        if (!userId) {
            userId = "guest_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("medibot_guest_id", userId);
        }
    }
    return userId;
}

const MediBotAPI = {
    
    // ============================================================
    // FUNCTION 1: SCAN IMAGE (Points to Vision Backend - Port 8000)
    // ============================================================
    async scanImage(imageFile) {
        const userId = getUserId();
        const formData = new FormData();
        formData.append("file", imageFile); 
        formData.append("user_id", userId); // 🟢 CRITICAL: Link scan to User

        try {
            console.log(`📸 [Vision] Sending scan to Port 8000 for User: ${userId}...`);
            
            // 🟢 UPDATED URL: Points to Backend 1 (api.py) on Port 8000
            const response = await fetch("http://127.0.0.1:8000/analyze", {
                method: "POST",
                body: formData 
            });

            if (!response.ok) throw new Error(`Vision Error: ${response.statusText}`);
            const data = await response.json();
            return data;

        } catch (error) {
            console.error("❌ Scan Failed:", error);
            // Fallback: If Port 8000 is down, try Port 5000 (The Chat Server)
            console.log("⚠️ Port 8000 failed. Trying Port 5000 fallback...");
            try {
                const fallbackResponse = await fetch("http://127.0.0.1:5000/api/scan", {
                    method: "POST",
                    body: formData
                });
                return await fallbackResponse.json();
            } catch (fallbackError) {
                alert("Error: Both Backend Systems are offline. Please run 'python server.py' and 'python -m app.api'");
                return null;
            }
        }
    },

    // ============================================================
    // FUNCTION 2: CHAT (Legacy Mode - Updated URL)
    // ============================================================
    async chat(userMessage) {
        const userId = getUserId();
        try {
            const response = await fetch("http://127.0.0.1:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, message: userMessage })
            });

            if (!response.ok) throw new Error("Brain Offline");
            return await response.json(); 
        } catch (error) {
            console.error("❌ Chat Failed:", error);
            return { response: "⚠️ Error: The Brain is offline." };
        }
    },

    // ============================================================
    // FUNCTION 3: LIVE CHAT STREAM (The New Thinking Feature)
    // ============================================================
    async chatStream(userMessage, onThought, onFinal) {
        const userId = getUserId();

        try {
            console.log(`📡 [Stream] Connecting to Medical Council (User: ${userId})...`);
            
            const response = await fetch("http://127.0.0.1:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user_id: userId,
                    message: userMessage 
                })
            });

            if (!response.ok) throw new Error("Brain Offline");

            // 🟢 STREAM READER: Processes chunks as they arrive
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let resultBuffer = "";

            while (true) {
                const { value, done } = await reader.read();
                
                if (done) {
                    if (resultBuffer.trim()) {
                        this._processNDJSON(resultBuffer, onThought, onFinal);
                    }
                    break;
                }

                resultBuffer += decoder.decode(value, { stream: true });
                
                // Split by newline (NDJSON protocol)
                const lines = resultBuffer.split("\n");
                
                // Keep the last partial line in the buffer
                resultBuffer = lines.pop();

                for (const line of lines) {
                    this._processNDJSON(line, onThought, onFinal);
                }
            }

        } catch (error) {
            console.error("❌ Stream Failed:", error);
            onFinal({ final: "⚠️ Connection Lost. Specialist nexus is currently unavailable." });
        }
    },

    // --- INTERNAL HELPER: DISPATCHER FOR STREAM CHUNKS ---
    _processNDJSON(line, onThought, onFinal) {
        if (!line.trim()) return;
        try {
            const data = JSON.parse(line);

            // 1. Agent Discussion (Thinking UI)
            if (data.agent) {
                // Map short codes to nice names
                let displayName = data.agent.toUpperCase();
                if (data.agent === 'diag') displayName = "DR. DIAGNOSIS";
                if (data.agent === 'treat') displayName = "DR. TREATMENT";
                if (data.agent === 'skeptic') displayName = "THE SKEPTIC";
                if (data.agent === 'judge') displayName = "THE JUDGE";

                onThought(data.agent, displayName, data.text);
            }

            // 2. Final Answer
            if (data.final) {
                onFinal(data); 
            }

            // 3. Errors
            if (data.error) {
                onThought('skeptic', 'SYSTEM ALERT', data.error);
            }
        } catch (parseErr) {
            console.warn("⚠️ JSON Parse Skip:", line);
        }
    }
};

// --- UI HELPER: MAP SPECIALIST IDs TO LABELS ---
function getAgentDisplayName(id) {
    const map = { 
        diag: "🔬 Dr. Diagnosis", 
        treat: "💊 Dr. Treatment", 
        skeptic: "🧐 The Skeptic", 
        judge: "👨‍⚖️ The Judge" 
    };
    return map[id] || "AI Specialist";
}