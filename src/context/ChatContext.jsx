import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { chatService } from "../services/chatService";
import { matchService } from "../services/matchService";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

export const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [typingUsers, setTypingUsers] = useState({}); // { chatId: { userId: true } }

  // Ref to store current matches for socket listeners
  const matchesRef = useRef(matches);

  const { socket, isConnected, onEvent, offEvent, emitEvent } = useSocket();
  const { user } = useAuth();

  // Update matches ref when matches change
  useEffect(() => {
    matchesRef.current = matches;
  }, [matches]);

  // Initialize matches and set up socket listeners
  useEffect(() => {
    if (user) {
      fetchMatches();
      setupSocketListeners();
    }

    return () => {
      cleanupSocketListeners();
    };
  }, [user, socket]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const matchResponse = await matchService.getMatches();
      console.log("Match response:", matchResponse); // Debug log

      if (matchResponse.success && matchResponse.data) {
        setMatches(matchResponse.data);
        calculateUnreadCount(matchResponse.data);

        // Fetch recent messages for each match
        const messagePromises = matchResponse.data.map(async (match) => {
          try {
            if (match.chat) {
              const msgResponse = await chatService.getChatMessages(
                match.chat._id,
                1,
                20
              );
              return {
                chatId: match.chat._id,
                messages: msgResponse.success ? msgResponse.data : [],
              };
            }
            return { chatId: null, messages: [] };
          } catch (error) {
            console.error(
              `Failed to fetch messages for match ${match._id}:`,
              error
            );
            return { chatId: null, messages: [] };
          }
        });

        const messageResults = await Promise.all(messagePromises);
        const messagesMap = {};

        messageResults.forEach((result, index) => {
          if (result.chatId) {
            messagesMap[matchResponse.data[index]._id] = result.messages;
          }
        });

        setMessages(messagesMap);
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
      setError(error.response?.data?.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    if (!socket) return;

    // Listen for new messages
    onEvent("new-message", (message) => {
      console.log("Received new message via socket:", message);

      // Find the match by chat ID using current matches from ref
      const currentMatches = matchesRef.current;
      const matchId = currentMatches.find(
        (m) => m.chat?._id === message.chat
      )?._id;

      if (matchId) {
        setMessages((prev) => {
          const currentMessages = prev[matchId] || [];

          // Check for duplicates by ID
          const messageExists = currentMessages.some(
            (msg) => msg._id === message._id
          );

          if (!messageExists) {
            console.log("Adding new socket message:", message.content);
            return {
              ...prev,
              [matchId]: [...currentMessages, message],
            };
          } else {
            console.log("Skipping duplicate message:", message._id);
          }

          return prev;
        });

        // Update match with latest message info
        updateMatchLastMessage(matchId, message);
      } else {
        console.log(
          "Could not find match for chat:",
          message.chat,
          "Available matches:",
          currentMatches.map((m) => ({ id: m._id, chatId: m.chat?._id }))
        );
      }
    });

    // Listen for typing indicators
    onEvent("user-typing", ({ userId, chatId }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          [userId]: true,
        },
      }));
    });

    onEvent("user-stopped-typing", ({ userId, chatId }) => {
      setTypingUsers((prev) => {
        const newTypingUsers = { ...prev };
        if (newTypingUsers[chatId]) {
          delete newTypingUsers[chatId][userId];
          if (Object.keys(newTypingUsers[chatId]).length === 0) {
            delete newTypingUsers[chatId];
          }
        }
        return newTypingUsers;
      });
    });

    // Listen for new matches
    onEvent("new_match", (match) => {
      addMatch(match);
    });

    // Listen for typing indicators
    onEvent("user_typing", ({ userId, chatId, isTyping }) => {
      // Handle typing indicators if needed
      console.log(
        `User ${userId} is ${
          isTyping ? "typing" : "stopped typing"
        } in chat ${chatId}`
      );
    });

    // Listen for read receipts
    onEvent("message_read", ({ messageId, chatId, readBy }) => {
      // Update message read status
      setMessages((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || []).map((msg) =>
          msg._id === messageId
            ? { ...msg, readBy: [...(msg.readBy || []), readBy] }
            : msg
        ),
      }));
    });

    // Listen for message deletions
    onEvent("message-deleted", ({ messageId, chatId, deleteType }) => {
      console.log("Message deleted via socket:", {
        messageId,
        chatId,
        deleteType,
      });

      // Find the match by chat ID
      const currentMatches = matchesRef.current;
      const matchId = currentMatches.find((m) => m.chat?._id === chatId)?._id;

      if (matchId) {
        setMessages((prev) => ({
          ...prev,
          [matchId]: (prev[matchId] || []).filter(
            (msg) => msg._id !== messageId
          ),
        }));

        // If this was the last message, update the match
        const remainingMessages = (messages[matchId] || []).filter(
          (msg) => msg._id !== messageId
        );
        if (remainingMessages.length > 0) {
          const lastMessage = remainingMessages[remainingMessages.length - 1];
          updateMatchLastMessage(matchId, lastMessage);
        } else {
          // Update match to indicate no messages
          setMatches((prev) =>
            prev.map((match) => {
              if (match._id === matchId) {
                return {
                  ...match,
                  lastMessage: "",
                  lastMessageAt: new Date(),
                };
              }
              return match;
            })
          );
        }
      }
    });

    // Listen for message reactions
    onEvent("message-reaction", ({ messageId, userId, emoji, reactions }) => {
      console.log("Message reaction via socket:", { messageId, userId, emoji });

      // Find the match by looking through all messages
      setMessages((prev) => {
        const newMessages = { ...prev };

        Object.keys(newMessages).forEach((matchId) => {
          newMessages[matchId] = newMessages[matchId].map((msg) => {
            if (msg._id === messageId) {
              return {
                ...msg,
                reactions: reactions || [],
              };
            }
            return msg;
          });
        });

        return newMessages;
      });
    });

    // Listen for message edits
    onEvent(
      "message-edited",
      ({ messageId, content, isEdited, editedAt, chatId }) => {
        console.log("Message edited via socket:", {
          messageId,
          content,
          isEdited,
          editedAt,
        });

        // Find the match by chat ID
        const currentMatches = matchesRef.current;
        const matchId = currentMatches.find((m) => m.chat?._id === chatId)?._id;

        if (matchId) {
          setMessages((prev) => ({
            ...prev,
            [matchId]: (prev[matchId] || []).map((msg) => {
              if (msg._id === messageId) {
                return {
                  ...msg,
                  content,
                  isEdited,
                  editedAt,
                };
              }
              return msg;
            }),
          }));
        }
      }
    );

    // Listen for surprise message reveals
    onEvent(
      "surprise-revealed",
      ({ messageId, isRevealed, revealedAt, chatId }) => {
        console.log("Surprise message revealed via socket:", {
          messageId,
          isRevealed,
          revealedAt,
        });

        // Find the match by chat ID
        const currentMatches = matchesRef.current;
        const matchId = currentMatches.find((m) => m.chat?._id === chatId)?._id;

        if (matchId) {
          setMessages((prev) => ({
            ...prev,
            [matchId]: (prev[matchId] || []).map((msg) => {
              if (msg._id === messageId) {
                return {
                  ...msg,
                  isRevealed,
                  revealedAt,
                };
              }
              return msg;
            }),
          }));
        }
      }
    );

    // Listen for message delivery confirmations
    onEvent("message-delivered", ({ messageId, deliveredTo, deliveredAt }) => {
      console.log("🚚 Message delivered via socket:", {
        messageId,
        deliveredTo,
        deliveredAt,
      });

      setMessages((prev) => {
        const newMessages = { ...prev };

        Object.keys(newMessages).forEach((matchId) => {
          newMessages[matchId] = newMessages[matchId].map((msg) => {
            if (msg._id === messageId) {
              const updatedMsg = {
                ...msg,
                deliveredTo: [
                  ...(msg.deliveredTo || []),
                  { user: deliveredTo, deliveredAt },
                ],
              };
              console.log("📱 Updated message delivery status:", {
                messageId,
                oldDelivered: msg.deliveredTo?.length || 0,
                newDelivered: updatedMsg.deliveredTo.length,
              });
              return updatedMsg;
            }
            return msg;
          });
        });

        return newMessages;
      });
    });

    // Listen for message read confirmations
    onEvent("message-read", ({ messageId, readBy, readAt, chatId }) => {
      console.log("👁️ Message read via socket:", { messageId, readBy, readAt });

      // Find the match by chat ID
      const currentMatches = matchesRef.current;
      const matchId = currentMatches.find((m) => m.chat?._id === chatId)?._id;

      if (matchId) {
        setMessages((prev) => ({
          ...prev,
          [matchId]: (prev[matchId] || []).map((msg) => {
            if (msg._id === messageId) {
              const updatedMsg = {
                ...msg,
                readBy: [...(msg.readBy || []), { user: readBy, readAt }],
              };
              console.log("📖 Updated message read status:", {
                messageId,
                oldRead: msg.readBy?.length || 0,
                newRead: updatedMsg.readBy.length,
              });
              return updatedMsg;
            }
            return msg;
          }),
        }));
      }
    });
  };

  const cleanupSocketListeners = () => {
    if (!socket) return;

    offEvent("new-message");
    offEvent("new_match");
    offEvent("user-typing");
    offEvent("user-stopped-typing");
    offEvent("message_read");
    offEvent("message-deleted");
    offEvent("message-reaction");
    offEvent("message-edited");
    offEvent("surprise-revealed");
    offEvent("message-delivered");
    offEvent("message-read");
  };

  const updateMatchLastMessage = (matchId, message) => {
    setMatches((prev) =>
      prev.map((match) => {
        if (match._id === matchId || match.chat?._id === matchId) {
          return {
            ...match,
            lastMessage: message.content,
            lastMessageAt: message.createdAt,
            unread: message.sender._id !== user._id,
          };
        }
        return match;
      })
    );
  };

  // Calculate total unread messages
  const calculateUnreadCount = (matchList) => {
    const count = matchList.filter((match) => match.unread).length;
    setUnreadCount(count);
  };

  // Get messages for a specific chat
  const getMessages = (matchId) => {
    return messages[matchId] || [];
  };

  // Send a new message
  const sendMessage = async (
    matchId,
    text,
    type = "text",
    file = null,
    metadata = {}
  ) => {
    try {
      const match = matches.find((m) => m._id === matchId);
      if (!match || !match.chat) {
        throw new Error("Chat not found");
      }

      // Create message data
      const messageData = {
        chatId: match.chat._id,
        content: text,
        type,
        ...metadata,
      };

      if (replyingTo) {
        messageData.replyToId = replyingTo._id;
      }

      let response;

      if (file) {
        // Handle file upload
        const formData = new FormData();
        formData.append("chatId", match.chat._id);
        formData.append("type", type);
        formData.append("file", file);

        if (metadata.duration) {
          formData.append("duration", metadata.duration);
        }
        if (metadata.title) {
          formData.append("title", metadata.title);
        }
        if (replyingTo) {
          formData.append("replyToId", replyingTo._id);
        }

        response = await chatService.sendFileMessage(formData);
      } else {
        // Handle text/gif messages
        response = await chatService.sendMessage(messageData);

        console.log("Message sent successfully:", response.data?.content);
      }

      if (response.success && response.data) {
        // Add message to local state with duplicate check
        setMessages((prev) => {
          const currentMessages = prev[matchId] || [];

          // Check if this exact message already exists (from socket)
          const messageExists = currentMessages.some(
            (msg) => msg._id === response.data._id
          );

          if (!messageExists) {
            console.log("Adding sent message to local state:", {
              messageId: response.data._id,
              content: response.data.content,
              deliveredTo: response.data.deliveredTo,
              readBy: response.data.readBy,
            });
            return {
              ...prev,
              [matchId]: [...currentMessages, response.data],
            };
          } else {
            console.log(
              "Message already exists from socket:",
              response.data._id
            );
            // Update the existing message with the latest data from response
            return {
              ...prev,
              [matchId]: currentMessages.map((msg) =>
                msg._id === response.data._id ? response.data : msg
              ),
            };
          }
        });
        // No need to emit here to avoid duplicate messages

        return { success: true };
      }

      return {
        success: false,
        error: response.message || "Failed to send message",
      };
    } catch (error) {
      console.error("Failed to send message:", error);

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to send message",
      };
    }
  };

  // Mark messages as read
  const markAsRead = async (matchId) => {
    try {
      const match = matches.find((m) => m._id === matchId);
      if (!match || !match.chat) return;

      const response = await chatService.markAsRead(match.chat._id);

      if (response.success) {
        // Update local message state
        setMessages((prev) => ({
          ...prev,
          [matchId]: (prev[matchId] || []).map((msg) => ({
            ...msg,
            readBy: [
              ...(msg.readBy || []),
              { user: user._id, readAt: new Date() },
            ],
          })),
        }));

        // Update match unread status
        setMatches((prev) => {
          const updated = prev.map((match) =>
            match._id === matchId ? { ...match, unread: false } : match
          );
          calculateUnreadCount(updated);
          return updated;
        });

        // Emit socket event for read receipt
        if (socket && isConnected) {
          emitEvent("mark_read", {
            chatId: match.chat._id,
            userId: user._id,
          });
        }
      }
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  // Mark specific message as read
  const markMessageAsRead = async (messageId) => {
    try {
      console.log("ChatContext: Marking message as read:", { messageId });
      const response = await chatService.markMessageAsRead(messageId);

      if (response.success) {
        console.log("ChatContext: Message marked as read:", response.data);
        // The socket listener will handle updating the local state
      }

      return response;
    } catch (error) {
      console.error("ChatContext: Error marking message as read:", error);
      throw error;
    }
  };

  // Delete a chat
  const deleteChat = async (matchId) => {
    try {
      const match = matches.find((m) => m._id === matchId);
      if (!match) return;

      // Call unmatch API
      const response = await matchService.unmatchUser(matchId);

      if (response.success) {
        // Remove from local state
        setMatches((prev) => prev.filter((match) => match._id !== matchId));
        setMessages((prev) => {
          const newMessages = { ...prev };
          delete newMessages[matchId];
          return newMessages;
        });

        return { success: true };
      }

      return {
        success: false,
        error: response.message || "Failed to delete chat",
      };
    } catch (error) {
      console.error("Failed to delete chat:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete chat",
      };
    }
  };

  // Add a new match
  const addMatch = (user) => {
    const newMatch = {
      _id: user._id || user.id,
      user1: user,
      user2: user, // This will be populated correctly from backend
      lastMessage: `You matched with ${user.name}!`,
      lastMessageAt: new Date(),
      unread: true,
      createdAt: new Date(),
    };

    setMatches((prev) => [newMatch, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newMatch._id]: [],
    }));

    calculateUnreadCount([newMatch, ...matches]);
  };

  // Get match by matchId
  const getMatchById = (matchId) => {
    return matches.find((match) => match._id === matchId);
  };

  // Get user details by userId (from matches)
  const getUserById = (userId) => {
    const match = matches.find(
      (match) => match.user1?._id === userId || match.user2?._id === userId
    );
    if (match) {
      // Return the other user (not the current user)
      return match.user1?._id === userId ? match.user1 : match.user2;
    }
    return null;
  };

  // Start typing indicator
  const startTyping = (matchId) => {
    const match = matches.find((m) => m._id === matchId);
    if (match && match.chat && socket && isConnected) {
      emitEvent("typing-start", { chatId: match.chat._id });
    }
  };

  // Stop typing indicator
  const stopTyping = (matchId) => {
    const match = matches.find((m) => m._id === matchId);
    if (match && match.chat && socket && isConnected) {
      emitEvent("typing-stop", { chatId: match.chat._id });
    }
  };
  // Get typing users for a specific chat
  const getTypingUsers = (matchId) => {
    const match = matches.find((m) => m._id === matchId);
    if (match && match.chat && typingUsers[match.chat._id]) {
      // Return array of user IDs who are typing in this chat
      return Object.keys(typingUsers[match.chat._id]);
    }
    return [];
  };

  // Delete a message
  const deleteMessage = async (messageId, deleteType = "me") => {
    try {
      const response = await chatService.deleteMessage(messageId, deleteType);

      if (response.success) {
        // For "delete for me", remove from local state immediately
        if (deleteType === "me") {
          setMessages((prev) => {
            const newMessages = { ...prev };

            // Find which chat contains this message and remove it
            Object.keys(newMessages).forEach((matchId) => {
              const filteredMessages = newMessages[matchId].filter(
                (msg) => msg._id !== messageId
              );
              newMessages[matchId] = filteredMessages;

              // Update last message if needed
              if (filteredMessages.length > 0) {
                const lastMessage =
                  filteredMessages[filteredMessages.length - 1];
                updateMatchLastMessage(matchId, lastMessage);
              }
            });

            return newMessages;
          });
        }
        // For "delete for everyone", the socket event will handle the UI update
        // This ensures all users see the deletion in real-time
      }

      return response;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  };

  // Reply functions
  const setReplyTo = (message) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Reaction functions
  const addReaction = async (messageId, emoji) => {
    try {
      console.log("ChatContext: Adding reaction:", { messageId, emoji });
      const response = await chatService.addReaction(messageId, emoji);

      console.log("ChatContext: Add reaction response:", response);

      if (response.success) {
        console.log("ChatContext: Response successful, updating local state");
        // Update local state immediately
        setMessages((prev) => {
          const newMessages = { ...prev };

          Object.keys(newMessages).forEach((matchId) => {
            newMessages[matchId] = newMessages[matchId].map((msg) => {
              if (msg._id === messageId) {
                console.log("ChatContext: Updating message reactions:", {
                  messageId,
                  oldReactions: msg.reactions,
                  newReactions: response.data?.reactions,
                });
                return {
                  ...msg,
                  reactions: response.data?.reactions || [],
                };
              }
              return msg;
            });
          });

          console.log("ChatContext: Updated messages state");
          return newMessages;
        });
      } else {
        console.error("ChatContext: Response not successful:", response);
      }

      return response;
    } catch (error) {
      console.error("ChatContext: Error adding reaction:", error);
      throw error;
    }
  };

  const removeReaction = async (messageId, emoji) => {
    try {
      const response = await chatService.removeReaction(messageId, emoji);

      if (response.success) {
        // Update local state immediately
        setMessages((prev) => {
          const newMessages = { ...prev };

          Object.keys(newMessages).forEach((matchId) => {
            newMessages[matchId] = newMessages[matchId].map((msg) => {
              if (msg._id === messageId) {
                return {
                  ...msg,
                  reactions: response.data.reactions || [],
                };
              }
              return msg;
            });
          });

          return newMessages;
        });
      }

      return response;
    } catch (error) {
      console.error("Error removing reaction:", error);
      throw error;
    }
  };

  // Edit message function
  const editMessage = async (messageId, content) => {
    try {
      console.log("ChatContext: Editing message:", { messageId, content });
      const response = await chatService.editMessage(messageId, content);

      console.log("ChatContext: Edit message response:", response);

      if (response.success) {
        // Update local state immediately
        setMessages((prev) => {
          const newMessages = { ...prev };

          Object.keys(newMessages).forEach((matchId) => {
            newMessages[matchId] = newMessages[matchId].map((msg) => {
              if (msg._id === messageId) {
                console.log("ChatContext: Updating message content:", {
                  messageId,
                  oldContent: msg.content,
                  newContent: response.data.content,
                });
                return {
                  ...msg,
                  content: response.data.content,
                  isEdited: response.data.isEdited,
                  editedAt: response.data.editedAt,
                };
              }
              return msg;
            });
          });

          return newMessages;
        });
      }

      return response;
    } catch (error) {
      console.error("ChatContext: Error editing message:", error);
      throw error;
    }
  };

  // Send surprise message function
  const sendSurpriseMessage = async (
    matchId,
    content,
    surpriseEmoji = "🎉"
  ) => {
    try {
      console.log("ChatContext: Sending surprise message:", {
        matchId,
        content,
        surpriseEmoji,
      });

      const match = matches.find((m) => m._id === matchId);
      if (!match || !match.chat) {
        throw new Error("Chat not found");
      }

      const response = await chatService.sendSurpriseMessage({
        chatId: match.chat._id,
        content,
        surpriseEmoji,
      });

      console.log("ChatContext: Send surprise message response:", response);

      if (response.success) {
        // Add message to local state with duplicate check
        setMessages((prev) => {
          const currentMessages = prev[matchId] || [];

          // Check if this exact message already exists (from socket)
          const messageExists = currentMessages.some(
            (msg) => msg._id === response.data._id
          );

          if (!messageExists) {
            return {
              ...prev,
              [matchId]: [...currentMessages, response.data],
            };
          }

          return prev;
        });

        // Update match last message
        updateMatchLastMessage(matchId, response.data);
      }

      return response;
    } catch (error) {
      console.error("ChatContext: Error sending surprise message:", error);
      throw error;
    }
  };

  // Reveal surprise message function
  const revealSurpriseMessage = async (messageId) => {
    try {
      console.log("ChatContext: Revealing surprise message:", { messageId });
      const response = await chatService.revealSurpriseMessage(messageId);

      console.log("ChatContext: Reveal surprise message response:", response);

      if (response.success) {
        // Update local state immediately
        setMessages((prev) => {
          const newMessages = { ...prev };

          Object.keys(newMessages).forEach((matchId) => {
            newMessages[matchId] = newMessages[matchId].map((msg) => {
              if (msg._id === messageId) {
                console.log("ChatContext: Updating surprise message:", {
                  messageId,
                  isRevealed: response.data.isRevealed,
                  revealedAt: response.data.revealedAt,
                });
                return {
                  ...msg,
                  isRevealed: response.data.isRevealed,
                  revealedAt: response.data.revealedAt,
                };
              }
              return msg;
            });
          });

          return newMessages;
        });
      }

      return response;
    } catch (error) {
      console.error("ChatContext: Error revealing surprise message:", error);
      throw error;
    }
  };

  const value = {
    matches,
    messages,
    activeChat,
    unreadCount,
    loading,
    error,
    replyingTo,
    typingUsers,
    setActiveChat,
    getMessages,
    sendMessage,
    deleteMessage,
    editMessage,
    setReplyTo,
    cancelReply,
    addReaction,
    removeReaction,
    markAsRead,
    markMessageAsRead,
    deleteChat,
    addMatch,
    getMatchById,
    getUserById,
    startTyping,
    stopTyping,
    getTypingUsers,
    fetchMatches,
    sendSurpriseMessage,
    revealSurpriseMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
