// ConvoHubAI - LiveKit Video Service
// 100% Free & Open Source - Self-hosted
// GitHub: https://github.com/livekit/livekit

// LiveKit Server URL (self-hosted or LiveKit Cloud free tier)
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880';
const LIVEKIT_API_KEY = import.meta.env.VITE_LIVEKIT_API_KEY || 'devkey';
const LIVEKIT_API_SECRET = import.meta.env.VITE_LIVEKIT_API_SECRET || 'secret';

// Generate access token for a participant (should be done on backend for security)
export const generateToken = async (roomName, participantName, isAgent = false) => {
  try {
    // In production, call your backend API to generate token
    const response = await fetch('/api/v1/video/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('convohubai_access_token')}`
      },
      body: JSON.stringify({
        room_name: roomName,
        participant_name: participantName,
        is_agent: isAgent
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate token');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

// Create a new video room
export const createRoom = async (agentId, options = {}) => {
  const roomName = `agent-${agentId}-${Date.now()}`;
  
  try {
    const token = localStorage.getItem('convohubai_access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch('/api/v1/video/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: roomName,
        empty_timeout: options.emptyTimeout || 300,
        max_participants: options.maxParticipants || 2,
        metadata: JSON.stringify({
          agentId,
          createdAt: new Date().toISOString()
        })
      })
    });

    // Get response text first
    const responseText = await response.text();
    
    if (!response.ok) {
      let errorMessage = 'Failed to create room';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Parse successful response
    if (!responseText) {
      throw new Error('Empty response from server');
    }
    
    const room = JSON.parse(responseText);
    return room;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

// Get room info
export const getRoom = async (roomName) => {
  try {
    const response = await fetch(`/api/v1/video/rooms/${roomName}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('convohubai_access_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Room not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting room:', error);
    throw error;
  }
};

// List active rooms
export const listRooms = async () => {
  try {
    const response = await fetch('/api/v1/video/rooms', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('convohubai_access_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to list rooms');
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing rooms:', error);
    throw error;
  }
};

// Delete a room
export const deleteRoom = async (roomName) => {
  try {
    const response = await fetch(`/api/v1/video/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('convohubai_access_token')}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting room:', error);
    return false;
  }
};

// Get participants in a room
export const getParticipants = async (roomName) => {
  try {
    const response = await fetch(`/api/v1/video/rooms/${roomName}/participants`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('convohubai_access_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get participants');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting participants:', error);
    throw error;
  }
};

// LiveKit server URL getter
export const getLiveKitUrl = () => LIVEKIT_URL;

export default {
  generateToken,
  createRoom,
  getRoom,
  listRooms,
  deleteRoom,
  getParticipants,
  getLiveKitUrl
};