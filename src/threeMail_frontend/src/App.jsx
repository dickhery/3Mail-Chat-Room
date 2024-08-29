import React, { useState, useEffect, useRef } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as chatRoomIdl, canisterId as chatRoomCanisterId } from '../../declarations/threeMail_backend';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authClient, setAuthClient] = useState(null);
    const [principal, setPrincipal] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [chatRoomActor, setChatRoomActor] = useState(null);
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [showCreateUsername, setShowCreateUsername] = useState(false);
    const [showChangeUsername, setShowChangeUsername] = useState(false);
    const [initialScrollDone, setInitialScrollDone] = useState(false);
    const [scrollOnNextUpdate, setScrollOnNextUpdate] = useState(false);
    const [unseenMessagesCount, setUnseenMessagesCount] = useState(0);
    const [lastSeenMessageTimestamp, setLastSeenMessageTimestamp] = useState(null);
    const chatBoxRef = useRef(null);
    const [hideCounter, setHideCounter] = useState(false);
    const [isSending, setIsSending] = useState(false); // New state to control Send button visibility
    const [isAdmin, setIsAdmin] = useState(false);
    const adminPIDs = [
        "lhqjs-2526y-iveq4-ehfgj-fqx72-3s4pk-wrr5u-bwdb7-inxiv-vnv32-pqe"
    ];

    useEffect(() => {
        async function initAuth() {
            const client = await AuthClient.create();
            setAuthClient(client);
            if (await client.isAuthenticated()) {
                const identity = client.getIdentity();
                const agent = new HttpAgent({ identity });
                const actor = Actor.createActor(chatRoomIdl, {
                    agent,
                    canisterId: chatRoomCanisterId,
                });
                setChatRoomActor(actor);
                setPrincipal(identity.getPrincipal().toText());
                setIsAuthenticated(true);
                await checkAndSetUsername(actor, identity.getPrincipal());
                checkAdminPrivileges(identity.getPrincipal().toText());
                fetchMessagesPeriodically(actor);
            } else {
                generateNpcUsername();
                const agent = new HttpAgent();
                const actor = Actor.createActor(chatRoomIdl, {
                    agent,
                    canisterId: chatRoomCanisterId,
                });
                setChatRoomActor(actor);
                fetchMessagesPeriodically(actor);
            }
        }
        initAuth();
    }, []);

    useEffect(() => {
        if (messages.length > 0 && !initialScrollDone) {
            scrollToBottom();
            setInitialScrollDone(true);
            setLastSeenMessageTimestamp(messages[messages.length - 1].timestamp);
        }
        if (scrollOnNextUpdate) {
            scrollToBottom();
            setScrollOnNextUpdate(false);
        } else {
            updateUnseenMessagesCount();
        }
    }, [messages]);

    useEffect(() => {
        const handleScroll = () => {
            if (isAtBottom()) {
                setUnseenMessagesCount(0);
                setLastSeenMessageTimestamp(
                    messages.length > 0 ? messages[messages.length - 1].timestamp : null
                );
            }
        };
        const chatBox = chatBoxRef.current;
        if (chatBox) {
            chatBox.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (chatBox) {
                chatBox.removeEventListener('scroll', handleScroll);
            }
        };
    }, [messages]);

    const generateNpcUsername = () => {
        const storedNpcId = sessionStorage.getItem('npcId');
        if (storedNpcId) {
            setUsername(`NPC-${storedNpcId}`);
        } else {
            const identifier = Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, '0');
            sessionStorage.setItem('npcId', identifier);
            setUsername(`NPC-${identifier}`);
        }
    };

    const checkAndSetUsername = async (actor, principal) => {
        try {
            const storedUsername = await actor.getUsername(
                Principal.fromText(principal.toText())
            );
            if (storedUsername && storedUsername.length > 0) {
                setUsername(storedUsername[0]);
                setShowCreateUsername(false);
                setShowChangeUsername(true);
            } else {
                generateNpcUsername();
                setShowCreateUsername(true);
            }
        } catch (error) {
            console.error('Failed to fetch username:', error);
        }
    };

    const fetchMessages = async (actor) => {
        try {
            const msgs = await actor.getMessages();
            const newMessages = msgs.filter(
                (msg) => !lastSeenMessageTimestamp || msg.timestamp > lastSeenMessageTimestamp
            );
            if (newMessages.length > 0) {
                setMessages(msgs);
                if (!isAtBottom() && !scrollOnNextUpdate) {
                    setUnseenMessagesCount((prevCount) => prevCount + newMessages.length);
                    hideCounterTemporarily();
                }
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const fetchMessagesPeriodically = (actor) => {
        fetchMessages(actor);
        setInterval(() => fetchMessages(actor), 3000);
    };

    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            setUnseenMessagesCount(0);
            setLastSeenMessageTimestamp(
                messages.length > 0 ? messages[messages.length - 1].timestamp : null
            );
        }
    };

    const isAtBottom = () => {
        if (chatBoxRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
            return scrollTop + clientHeight >= scrollHeight - 10;
        }
        return false;
    };

    const updateUnseenMessagesCount = () => {
        if (chatBoxRef.current && !isAtBottom()) {
            const unseenCount = messages.filter(
                (msg) =>
                    !lastSeenMessageTimestamp || msg.timestamp > lastSeenMessageTimestamp
            ).length;
            if (unseenCount !== unseenMessagesCount) {
                setUnseenMessagesCount(unseenCount);
            }
        } else {
            setUnseenMessagesCount(0);
        }
    };

    const hideCounterTemporarily = () => {
        setHideCounter(true);
        setTimeout(() => {
            setHideCounter(false);
        }, 200);
    };

    const handleLogin = async () => {
        await authClient.login({
            identityProvider: 'https://identity.ic0.app',
            onSuccess: async () => {
                const identity = authClient.getIdentity();
                const agent = new HttpAgent({ identity });
                const actor = Actor.createActor(chatRoomIdl, {
                    agent,
                    canisterId: chatRoomCanisterId,
                });
                setChatRoomActor(actor);
                setPrincipal(identity.getPrincipal().toText());
                setIsAuthenticated(true);
                await checkAndSetUsername(actor, identity.getPrincipal());
                checkAdminPrivileges(identity.getPrincipal().toText());
                fetchMessagesPeriodically(actor);
            },
        });
    };

    const handleLogout = async () => {
        await authClient.logout();
        setIsAuthenticated(false);
        setPrincipal('');
        setIsAdmin(false); // Ensure admin status is reset on logout
        generateNpcUsername();
        fetchMessages(chatRoomActor);
    };

    const handleSendMessage = async () => {
        if (messageText.trim() !== '' && username.trim() !== '') {
            try {
                setIsSending(true); // Hide the Send button
                await chatRoomActor.sendMessage(username, messageText);
                setMessageText('');
                setScrollOnNextUpdate(true);
                await fetchMessages(chatRoomActor);
            } catch (error) {
                console.error('Failed to send message:', error);
            } finally {
                setIsSending(false); // Show the Send button again
            }
        } else {
            console.error('Message text or username is empty.');
        }
    };

    const handleCreateUsername = async () => {
        setShowCreateUsername(true); // Show the input and submit button
    };

    const handleSubmitCreateUsername = async () => {
        if (newUsername.trim() !== '') {
            const confirm = window.confirm(
                `Are you sure you want to create the username: ${newUsername}? This cannot be changed later.`
            );
            if (confirm) {
                try {
                    const success = await chatRoomActor.setUsername(newUsername);
                    if (success) {
                        setUsername(newUsername);
                        setShowCreateUsername(false);
                        setShowChangeUsername(true);
                    } else {
                        alert('Username already exists. Please choose another one.');
                    }
                } catch (error) {
                    console.error('Failed to create username:', error);
                }
            }
        }
    };

    const handleChangeUsername = async () => {
        setShowChangeUsername(true); // Show the input and submit button
    };

    const handleSubmitChangeUsername = async () => {
        if (newUsername.trim() !== '') {
            const confirm = window.confirm(
                `Are you sure you want to change your username to: ${newUsername}?`
            );
            if (confirm) {
                try {
                    const success = await chatRoomActor.setUsername(newUsername);
                    if (success) {
                        setUsername(newUsername);
                        setShowChangeUsername(false);
                    } else {
                        alert('Username already exists. Please choose another one.');
                    }
                } catch (error) {
                    console.error('Failed to change username:', error);
                }
            }
        }
    };

    const checkAdminPrivileges = (principalId) => {
        if (adminPIDs.includes(principalId)) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    };

    const handleDeleteMessage = async (timestamp) => {
        const confirm = window.confirm('Are you sure you want to delete this message?');
        if (confirm) {
            try {
                const success = await chatRoomActor.deleteMessage(timestamp);
                if (success) {
                    await fetchMessages(chatRoomActor);
                } else {
                    alert('Failed to delete message. Access denied or message not found.');
                }
            } catch (error) {
                console.error('Failed to delete message:', error);
            }
        }
    };

    const handleScrollToNew = () => {
        scrollToBottom();
    };

    return (
        <div className="App">
            <h1>3Mail Chat Room</h1>
            {isAdmin && (
                <button onClick={handleLogout} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    Admin Logout
                </button>
            )}
            {!isAuthenticated ? (
                <button onClick={handleLogin}>Login with Internet Identity</button>
            ) : (
                <div>
                    <button onClick={handleLogout}>Logout</button>
                    {showCreateUsername ? (
                        <div className="create-username">
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Choose your username..."
                            />
                            <button onClick={handleSubmitCreateUsername}>Submit</button>
                        </div>
                    ) : (
                        <button onClick={handleCreateUsername}>Create Username</button>
                    )}
                    {showChangeUsername && (
                        <div className="change-username">
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Change your username..."
                            />
                            <button onClick={handleSubmitChangeUsername}>Submit</button>
                        </div>
                    )}
                </div>
            )}
            <div ref={chatBoxRef} className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <span className="username">{msg.username}:</span>
                        <span className="message-content">{msg.text}</span>
                        <div className="timestamp">
                            {new Date(Number(msg.timestamp / BigInt(1000000))).toLocaleString()}
                        </div>
                        {isAdmin && (
                            <button onClick={() => handleDeleteMessage(msg.timestamp)}>
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="message-input-container">
                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                />
                {!isSending && (
                    <button onClick={handleSendMessage}>Send</button>
                )}
                <button onClick={handleScrollToNew}>Scroll to New</button>
                {!hideCounter && unseenMessagesCount > 0 && (
                    <span className="unseen-counter">({unseenMessagesCount} new)</span>
                )}
            </div>
            <div className="footer">
                <p>Current Username: {username}</p>
                <p style={{ fontSize: '0.8rem' }}>Your PID: {principal}</p>
            </div>
        </div>
    );
}

export default App;
