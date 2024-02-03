import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/SubmissionsComponent.css';
import { useNavigate } from 'react-router-dom';

const SubmissionsComponent = () => {
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get('http://localhost:3001/submissions');
                setSubmissions(response.data);
            } catch (error) {
                console.error('Failed to fetch submissions:', error);
            }
        };

        fetchSubmissions();
    }, []);

    function redirectAccount(){
        navigate('/');
    }

    return (
        <div className="submissions-container">
            <h2 className="submissions-title">Submissions</h2>
            {submissions.map((submission, index) => (
                <div key={index} className="submission-item">
                    <p className="submission-detail"><strong>Name:</strong> {submission.name}</p>
                    <p className="submission-detail"><strong>Date of Birth:</strong> {submission.dob}</p>
                    <p className="submission-detail"><strong>Email:</strong> {submission.email}</p>
                    <p className="submission-detail"><strong>Phone:</strong> {submission.phone}</p>
                </div>
            ))}
            <button onClick={redirectAccount}>Create Another Account</button>
        </div>
    );
};

export default SubmissionsComponent;
