import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FormComponent.css'

const FormComponent = () => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        email: '',
        phone: '',
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "phone") {
            const cleanedValue = value.replace(/\D/g, ''); 
            if (cleanedValue.length > 10) return; 
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: cleanedValue
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    const handleDateChange = (date) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            dob: date
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

       
        if (!formData.name || !formData.dob || !formData.email || !formData.phone) {
            alert("All fields are required.");
            return;
        }
        
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }
        
        const today = new Date();
        const dob = new Date(formData.dob);
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age < 18) {
            alert("You must be at least 18 years old.");
            return;
        }

        const formattedDob = formData.dob ? 
      `${formData.dob.getDate()}-${formData.dob.getMonth() + 1}-${formData.dob.getFullYear()}` : '';

        const submissionData = {
            ...formData,
            dob: formattedDob, 
          };

        try {
            await axios.post('http://localhost:3001/submit', submissionData);
            navigate('/submissions'); 
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Submission failed: " + error.message);
            }
        }
    };

    return (
        <div className= "form-container">
            <h2>Create An Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <DatePicker
                        selected={formData.dob}
                        onChange={handleDateChange}
                        dateFormat="MMMM d, yyyy"
                        maxDate={new Date()}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        name="dob"
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="\d{10}"
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default FormComponent;
