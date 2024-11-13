import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import './App.css';
import backgroundImage from 'dist/ALCI.jpeg'; // Import background image

// Backend URL
const baseURL = 'https://eklektos-server-app-1.onrender.com';

function App() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [uniqueCode, setUniqueCode] = useState(null);
    const [qrCodeImage, setQrCodeImage] = useState(null);
    const [verificationMessage, setVerificationMessage] = useState(null);
    const [verifiedName, setVerifiedName] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Generate a unique code based on email uniqueness
    const generateCode = async () => {
        if (!name.trim() || !email.trim()) {
            setErrorMessage("Please enter your name and email to generate a code.");
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/generate-code`, { name, email });
            const code = response.data.uniqueCode;
            setUniqueCode(code);
            setErrorMessage(null);

            // Generate QR code image
            const qrImageUrl = await QRCode.toDataURL(`${window.location.origin}/?code=${code}`);
            setQrCodeImage(qrImageUrl);
        } catch (error) {
            setErrorMessage(error.response?.data.message || "Error generating code.");
        }
    };

    const verifyCode = async () => {
        try {
            const response = await axios.get(`${baseURL}/verify-code`, {
                params: { code: uniqueCode },
            });
            setVerifiedName(response.data.name);
            setVerificationMessage(response.data.message);
        } catch (error) {
            setVerificationMessage(error.response?.data?.message || "Verification failed.");
        }
    };

    return (
        <div
            className="container"
            style={{
                backgroundImage: `url(${backgroundImage})`,  // Set background image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh', // Optional: full viewport height
                color: 'white', // Adjust text color for visibility
            }}
        >
            <h1>Eklektos Apostolic Network ALIC24 Registration Link</h1>

            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={generateCode}>Generate QR Code</button>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {qrCodeImage && (
                <div>
                    <p>Scan this QR Code at the meeting for verification:</p>
                    <img src={qrCodeImage} alt="QR Code" />
                </div>
            )}

            <button onClick={verifyCode}>Verify Code</button>

            {verificationMessage && <p>{verificationMessage}</p>}
            {verifiedName && <p>Verified user: {verifiedName}</p>}
        </div>
    );
}

export default App;
